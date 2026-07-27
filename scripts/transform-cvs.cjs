#!/usr/bin/env node
/**
 * Transform Guseyn_Ismayylov_CV*.html from e-ui → semantic HTML + cv.css
 */
const fs = require('fs')
const path = require('path')

const DIR = path.join(__dirname, '../web-app/static/html')
const SKIP = new Set(['Guseyn_Ismayylov_CV_NODE.html']) // already redesigned

const HEAD = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="author" content="Guseyn Ismayylov">
    <title>__TITLE__</title>
    <link rel="shortcut icon" type="image/png" href="/image/favicon.png?v=f80d70da">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/normalize.css?v=54740e0a">
    <link rel="stylesheet" href="/css/cv.css?v=20260727">
  </head>
  <body>
`

function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/)
  return m ? m[1] : 'Guseyn Ismayylov CV'
}

function cleanBullet(text) {
  return text.replace(/^[\s•·]+/, '').trim()
}

function cleanLinks(html) {
  return html
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>/g, '<a href="$1">')
    .replace(/\s+data-[a-z0-9-]+="[^"]*"/g, '')
    .replace(/\s+is="[^"]*"/g, '')
}

function findOpenTag(html, predicate, from = 0) {
  let i = from
  while (i < html.length) {
    const start = html.indexOf('<', i)
    if (start < 0) return -1
    const end = html.indexOf('>', start)
    if (end < 0) return -1
    const open = html.slice(start, end + 1)
    if (!open.startsWith('</') && !open.startsWith('<!--') && predicate(open)) {
      return start
    }
    i = end + 1
  }
  return -1
}

function extractElement(html, openTagIndex) {
  const openEnd = html.indexOf('>', openTagIndex)
  const tagMatch = html.slice(openTagIndex + 1, openEnd).match(/^([a-zA-Z0-9-]+)/)
  if (!tagMatch) throw new Error('No tag name at ' + openTagIndex)
  const tag = tagMatch[1].toLowerCase()
  let i = openEnd + 1
  let depth = 1
  const openRe = new RegExp(`<${tag}(?=[\\s>/])`, 'gi')
  const closeRe = new RegExp(`</${tag}>`, 'gi')

  while (i < html.length && depth > 0) {
    openRe.lastIndex = i
    closeRe.lastIndex = i
    const openM = openRe.exec(html)
    const closeM = closeRe.exec(html)
    if (!closeM) throw new Error(`Unclosed <${tag}>`)
    if (openM && openM.index < closeM.index) {
      depth++
      i = openM.index + openM[0].length
    } else {
      depth--
      if (depth === 0) {
        return {
          outerStart: openTagIndex,
          outerEnd: closeM.index + closeM[0].length,
          inner: html.slice(openEnd + 1, closeM.index)
        }
      }
      i = closeM.index + closeM[0].length
    }
  }
  throw new Error(`Failed to extract <${tag}>`)
}

function transformHeader(block) {
  const img = block.match(/src="([^"]+)"[\s\S]*?alt="([^"]*)"/)
  const captions = [...block.matchAll(/<span is="e-caption"[^>]*>([\s\S]*?)<\/span>/g)]
  const contactsBlock = block.match(
    /<div is="e-row"[^>]*>([\s\S]*?)<\/div>\s*<div is="e-row"[^>]*>([\s\S]*?)<\/div>/
  )
  if (!img || captions.length < 2 || !contactsBlock) {
    throw new Error('Header parse failed')
  }

  const contactLinks = [...contactsBlock[1].matchAll(/href="([^"]+)"[^>]*>([^<]+)</g)]
    .map(([, href, text]) => `            <li><a href="${href}">${text.trim()}</a></li>`)
    .join('\n')

  const socialLinks = [...contactsBlock[2].matchAll(/<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)]
    .map(([, href, text]) => `<a href="${href}">${text.trim()}</a>`)

  const socialHtml = socialLinks
    .map((a, i) =>
      i === 0
        ? `            <li>${a}</li>`
        : `            <li><span class="cv-sep" aria-hidden="true">·</span></li>\n            <li>${a}</li>`
    )
    .join('\n')

  return `      <header class="cv-header">
        <img class="cv-photo" src="${img[1]}" alt="${img[2] || 'Guseyn Ismayylov'}">
        <div class="cv-identity">
          <h1 class="cv-name">Guseyn Ismayylov</h1>
          <span class="cv-role">${captions[0][1].trim()}</span>
          <span class="cv-meta">${captions[1][1].trim()}</span>
          <ul class="cv-contacts">
${contactLinks}
          </ul>
          <ul class="cv-socials">
${socialHtml}
          </ul>
        </div>
      </header>`
}

function transformSummary(inner) {
  const p = inner.match(/<p[^>]*>([\s\S]*?)<\/p>/)
  if (!p) throw new Error('Summary parse failed')
  return `      <section class="cv-summary">
        <p>${cleanLinks(p[1]).trim()}</p>
      </section>`
}

function transformSkills(inner) {
  const ul = inner.match(/<ul[^>]*>([\s\S]*?)<\/ul>/)
  if (!ul) throw new Error('Skills parse failed')
  const items = [...ul[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, t]) => {
    const cleaned = t
      .replace(/<strong[^>]*>/g, '<strong class="cv-skill-label">')
      .replace(/\s+data-[a-z0-9-]+="[^"]*"/g, '')
      .replace(/\s+is="[^"]*"/g, '')
      .trim()
    return `          <li>${cleaned}</li>`
  })
  return `      <section class="cv-section">
        <h2 class="cv-heading">Skills</h2>
        <ul class="cv-skills">
${items.join('\n')}
        </ul>
      </section>`
}

function transformVentures(inner) {
  const p = inner.match(/<p[^>]*>([\s\S]*?)<\/p>/)
  if (!p) throw new Error('Ventures parse failed')
  const parts = p[1]
    .split(/<br\s*\/?>\s*<br\s*\/?>/i)
    .map((part) => `        <p class="cv-venture cv-prose">${cleanLinks(part).trim()}</p>`)
  return `      <section class="cv-section">
        <h2 class="cv-heading">Ventures &amp; Passions</h2>
${parts.join('\n')}
      </section>`
}

function transformJobs(inner) {
  const withoutH = inner.replace(/<h2[^>]*>Work Experience<\/h2>\s*/i, '')
  const jobBlocks = []
  let searchFrom = 0
  while (true) {
    const idx = findOpenTag(
      withoutH,
      (open) => open.startsWith('<div') && open.includes('is="e-stack"'),
      searchFrom
    )
    if (idx < 0) break
    const el = extractElement(withoutH, idx)
    const jobInner = el.inner

    const titleM = jobInner.match(/<span is="e-bold">([\s\S]*?)<\/span>/)
    const dateM = jobInner.match(/<span is="e-caption"[^>]*>([\s\S]*?)<\/span>/)
    if (!titleM || !dateM) {
      searchFrom = el.outerEnd
      continue
    }

    let rest = jobInner.replace(/<div is="e-row"[\s\S]*?<\/div>/, '').trim()
    let bulletsHtml = ''
    let noteHtml = ''
    let recHtml = ''

    const ulMatch = rest.match(/<ul[^>]*>([\s\S]*?)<\/ul>/)
    if (ulMatch) {
      const items = [...ulMatch[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(
        ([, t]) => `            <li>${cleanBullet(t)}</li>`
      )
      bulletsHtml = `\n          <ul class="cv-bullets">\n${items.join('\n')}\n          </ul>`
      rest = rest.replace(ulMatch[0], '')
    }

    const pMatch = rest.match(/<p[^>]*>([\s\S]*?)<\/p>/)
    if (pMatch) {
      noteHtml = `\n          <p class="cv-job-note">${cleanBullet(pMatch[1])}</p>`
      rest = rest.replace(pMatch[0], '')
    }

    const aMatch = rest.match(/href="([^"]+)"[^>]*>View Recommendations<\/a>/)
    if (aMatch) {
      recHtml = `\n          <a class="cv-rec" href="${aMatch[1]}">View Recommendations</a>`
    }

    jobBlocks.push(`        <article class="cv-job">
          <div class="cv-job-header">
            <span class="cv-job-title">${titleM[1].trim()}</span>
            <span class="cv-job-dates">${dateM[1].trim()}</span>
          </div>${bulletsHtml}${noteHtml}${recHtml}
        </article>`)

    searchFrom = el.outerEnd
  }

  return `      <section class="cv-section">
        <h2 class="cv-heading">Work Experience</h2>

${jobBlocks.join('\n\n')}
      </section>`
}

function transformFooter(inner) {
  const sections = []
  let searchFrom = 0
  while (true) {
    const idx = findOpenTag(
      inner,
      (open) => open.startsWith('<div') && open.includes('is="e-panel"'),
      searchFrom
    )
    if (idx < 0) break
    const el = extractElement(inner, idx)
    const h = el.inner.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)
    if (!h) {
      searchFrom = el.outerEnd
      continue
    }
    const content = el.inner
      .replace(/<h2[^>]*>[\s\S]*?<\/h2>/, '')
      .replace(/<\/?section[^>]*>/g, '')
      .replace(/<p[^>]*>/g, '<p>')
    const cleaned = cleanLinks(content).trim()
    sections.push(`        <section class="cv-section">
          <h2 class="cv-heading">${h[1].trim()}</h2>
          ${cleaned}
        </section>`)
    searchFrom = el.outerEnd
  }
  return `      <div class="cv-footer">
${sections.join('\n\n')}
      </div>`
}

function transform(html) {
  const title = extractTitle(html)
  const mainIdx = findOpenTag(html, (o) => o.startsWith('<main'))
  if (mainIdx < 0) throw new Error('No main')
  const main = extractElement(html, mainIdx)

  let content = main.inner
  const firstDiv = findOpenTag(content, (o) => o.startsWith('<div'))
  if (firstDiv >= 0) {
    const outer = extractElement(content, firstDiv)
    // If it's the outer e-stack, unwrap
    if (content.slice(firstDiv, firstDiv + 80).includes('is="e-stack"')) {
      content = outer.inner
    }
  }

  const pageOneIdx = findOpenTag(content, (o) => o.includes('data-cv-page-one'))
  if (pageOneIdx >= 0) {
    const pageOne = extractElement(content, pageOneIdx)
    content = content.slice(0, pageOneIdx) + pageOne.inner + content.slice(pageOne.outerEnd)
  }

  const parts = []
  let i = 0
  while (i < content.length) {
    const next = content.indexOf('<', i)
    if (next < 0) break
    const end = content.indexOf('>', next)
    const open = content.slice(next, end + 1)
    if (open.startsWith('</') || open.startsWith('<!--')) {
      i = end + 1
      continue
    }

    if (open.startsWith('<div') && open.includes('is="e-panel"') && !open.includes('data-cv-section')) {
      const el = extractElement(content, next)
      const inner = el.inner
      if (/Guseyn Ismayylov/.test(inner) && /<img/i.test(inner)) {
        parts.push(transformHeader(inner))
      } else if (/<h2[^>]*>Skills<\/h2>/i.test(inner)) {
        parts.push(transformSkills(inner))
      } else if (/Ventures/i.test(inner)) {
        parts.push(transformVentures(inner))
      } else {
        console.warn('    unknown panel:', inner.slice(0, 80).replace(/\s+/g, ' '))
      }
      i = el.outerEnd
      continue
    }

    if (open.startsWith('<div') && open.includes('is="e-info"')) {
      const el = extractElement(content, next)
      parts.push(transformSummary(el.inner))
      i = el.outerEnd
      continue
    }

    if (open.startsWith('<div') && open.includes('data-cv-section="work-experience"')) {
      const el = extractElement(content, next)
      const stackIdx = findOpenTag(el.inner, (o) => o.includes('is="e-stack"'))
      const stackInner = stackIdx >= 0 ? extractElement(el.inner, stackIdx).inner : el.inner
      parts.push(transformJobs(stackInner))
      i = el.outerEnd
      continue
    }

    if (open.startsWith('<div') && open.includes('data-cv-footer-row')) {
      const el = extractElement(content, next)
      parts.push(transformFooter(el.inner))
      i = el.outerEnd
      continue
    }

    if (/^<(div|section)\b/i.test(open)) {
      const el = extractElement(content, next)
      console.warn('    skipped:', open.slice(0, 100))
      i = el.outerEnd
    } else {
      i = end + 1
    }
  }

  return `${HEAD.replace('__TITLE__', title)}    <main class="cv">
${parts.join('\n\n')}
    </main>
  </body>
</html>
`
}

const files = fs
  .readdirSync(DIR)
  .filter((f) => /^Guseyn_Ismayylov_CV.*\.html$/.test(f) && !SKIP.has(f))
  .sort()

console.log(`Transforming ${files.length} CV files (skipping NODE)...`)

let failed = 0
for (const file of files) {
  const full = path.join(DIR, file)
  const html = fs.readFileSync(full, 'utf8')
  if (!html.includes('e-ui.css')) {
    console.log(`  skip (already new) ${file}`)
    continue
  }
  try {
    const out = transform(html)
    const jobs = (out.match(/class="cv-job"/g) || []).length
    const footerHeadings = (() => {
      const m = out.match(/class="cv-footer"[\s\S]*?<\/div>\s*<\/main>/)
      return m ? (m[0].match(/class="cv-heading"/g) || []).length : 0
    })()
    const ok =
      out.includes('cv-header') &&
      out.includes('cv-skills') &&
      jobs >= 5 &&
      footerHeadings === 3 &&
      /Certifications/.test(out) &&
      /Education/.test(out) &&
      !/is="e-|e-ui\.css/.test(out)

    if (!ok) {
      console.warn(`  WARN ${file}: jobs=${jobs} footerHeadings=${footerHeadings}`)
      failed++
    }
    fs.writeFileSync(full, out)
    console.log(`  OK ${file} (jobs=${jobs}, footer=${footerHeadings})`)
  } catch (err) {
    failed++
    console.error(`  FAIL ${file}: ${err.message}`)
  }
}

process.exit(failed ? 1 : 0)
