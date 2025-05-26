const unisonSvgMidiExtension = {
  type: 'lang', // Process the custom Markdown syntax
  regex: /\[unison-svg-midi([\s\S]*?)\]([\s\S]*?)\[\/unison-svg-midi\]/g, // Match [unison-svg-midi]...[/unison-svg-midi]
  replace: function (match, soundFont, content) {
    soundFont = (soundFont || 'SpanishClassicalGuitar').trim()
    const sanitizedContent = content.trim()
    return `
<div>
  <span>
    <img class="copy-icon" src="/image/copy.svg?v=6facca19" onclick="copyText(this)">
  </span>
  <template is="unison-svg-midi" id="${crypto.randomUUID()}" data-sound-font="/magenta-soundfonts/${soundFont}">
    ${sanitizedContent}
  </template>
</div>`
  }
}

const unisonSvgExtension = {
  type: 'lang', // Process the custom Markdown syntax
  regex: /\[unison-svg\]([\s\S]*?)\[\/unison-svg\]/g, // Match [unison-svg]...[/unison-svg]
  replace: function (match, content) {
    const sanitizedContent = content.trim()
    return `
<div>
  <span>
    <img class="copy-icon" src="/image/copy.svg?v=6facca19" onclick="copyText(this)">
  </span>
  <template is="unison-svg" id="${crypto.randomUUID()}">
    ${sanitizedContent}
  </template>
</div>`
  }
}

const unisonMidiExtension = {
  type: 'lang', // Process the custom Markdown syntax
  regex: /\[unison-midi([\s\S]*?)\]([\s\S]*?)\[\/unison-midi\]/g, // Match [unison-midi]...[/unison-midi]
  replace: function (match, soundFont, content) {
    soundFont = (soundFont || 'SpanishClassicalGuitar').trim()
    const sanitizedContent = content.trim()
    return `
<div>
  <template is="unison-midi" id="${crypto.randomUUID()}" data-sound-font="/magenta-soundfonts/${soundFont}">
    ${sanitizedContent}
  </template>
</div>`
  }
}

const unisonTextHighlightsExtension = {
  type: 'lang', // Process the custom Markdown syntax
  regex: /\[unison-text-highlights\]([\s\S]*?)\[\/unison-text-highlights\]/g, // Match [unison-text-highlights]...[/unison-text-highlights]
  replace: function (match, content) {
    const sanitizedContent = content.trim()
    return `
<div>
  <span>
    <img class="copy-icon" src="/image/copy.svg?v=6facca19" onclick="copyText(this)">
  </span>
  <template is="unison-text-highlights" id="${crypto.randomUUID()}">
    ${sanitizedContent}
  </template>
</div>`
  }
}

const unisonTextareaSvgMidiExtension = {
  type: 'lang', // Process the custom Markdown syntax
  regex: /\[unison-textarea-svg-midi([\s\S]*?)\]([\s\S]*?)\[\/unison-textarea-svg-midi\]/g, // Match [unison-textarea-svg-midi]...[/unison-textarea-svg-midi]
  replace: function (match, soundFont, content) {
    soundFont = (soundFont || 'SpanishClassicalGuitar').trim()
    const sanitizedContent = content.trim()
    return `
<div>
  <span>
    <img class="copy-icon" src="/image/copy.svg?v=6facca19" onclick="copyText(this)">
    <img alt="edit" class="edit-icon" src="/image/edit.svg?v=667dd9d8" style="display: none" >
    <img alt="preview" class="render-icon" src="/image/render.svg?v=fc6bbc8e">
  </span>
  <template is="unison-textarea-svg-midi" id="${crypto.randomUUID()}" data-sound-font="/magenta-soundfonts/${soundFont}">
    ${sanitizedContent}
  </template>
</div>`
  }
}

const unisonTextareaSvgExtension = {
  type: 'lang', // Process the custom Markdown syntax
  regex: /\[unison-textarea-svg\]([\s\S]*?)\[\/unison-textarea-svg\]/g, // Match [unison-textarea-svg]...[/unison-textarea-svg]
  replace: function (match, content) {
    const sanitizedContent = content.trim()
    return `
<div>
  <span>
    <img class="copy-icon" src="/image/copy.svg?v=6facca19" onclick="copyText(this)">
    <img alt="edit" class="edit-icon" src="/image/edit.svg?v=667dd9d8" style="display: none" >
    <img alt="preview" class="render-icon" src="/image/render.svg?v=fc6bbc8e">
  </span>
  <template is="unison-textarea-svg" id="${crypto.randomUUID()}">
    ${sanitizedContent}
  </template>
</div>`
  }
}

// Register the unison extensions with Showdown
window.registerShowdownExtension('unisonSvgMidi', function() {
  return [unisonSvgMidiExtension]
})
window.registerShowdownExtension('unisonSvg', function() {
  return [unisonSvgExtension]
})
window.registerShowdownExtension('unisonMidi', function() {
  return [unisonMidiExtension]
})
window.registerShowdownExtension('unisonTextHighlights', function() {
  return [unisonTextHighlightsExtension]
})
window.registerShowdownExtension('unisonTextareaSvgMidi', function() {
  return [unisonTextareaSvgMidiExtension]
})
window.registerShowdownExtension('unisonTextareaSvg', function() {
  return [unisonTextareaSvgExtension]
})
