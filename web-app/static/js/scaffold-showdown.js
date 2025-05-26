const blockExtension = {
  type: 'lang',
  regex: /\[block\]([\s\S]*?)\[\/block\]/g, // Match [block]...[/block]
  replace: function (match, content) {
    return `
<div>
${content}
</div>`
  }
}

const codeBlockExtension = {
  type: 'lang', // Process the custom Markdown syntax
  regex: /\[code-block([\s\S]*?)\]([\s\S]*?)\[\/code-block\]/g, // Match [code-block js]...[/code-bloc]
  replace: function (match, language, content) {
    return `
<div>
  <span>
    <img class="copy-icon" src="/image/copy.svg?v=6facca19" onclick="copyText(this)">
  </span>
\`\`\`${language}
${content}
\`\`\`
</div>`
  }
}

const quoteExtension = {
  type: 'lang', // Process the custom Markdown syntax
  regex: /\[quote([\s\S]*?)\]([\s\S]*?)\[\/quote\]/g, // Match [quote Author]...[/quote]
  replace: function (match, author, content) {
    return `
<span class="quote">
  <span class="quote-text">
    “&nbsp;&nbsp;${content}&nbsp;&nbsp;”
  </span>
  <span class="quote-author">
    ${author}
  </span>
</span>`
  }
}

const detailsExtension = {
  type: 'lang', // Process the custom Markdown syntax
  regex: /\[details([\s\S]*?)\]([\s\S]*?)\[\/details\]/g, // Match [details Summary]...[/details]
  replace: function (match, summary, content) {
    summary = summary.trim()
    return `<details><summary><h3>${summary}</h3></summary>${content}</details>`
  }
}

window.registerShowdownExtension('block', function() {
  return [blockExtension]
})
window.registerShowdownExtension('codeBlock', function() {
  return [codeBlockExtension]
})
window.registerShowdownExtension('quote', function() {
  return [quoteExtension]
})
window.registerShowdownExtension('details', function() {
  return [detailsExtension]
})
