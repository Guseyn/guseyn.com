const fs = require('fs')
const path = require('path')
const glob = require('glob')
const { execSync } = require('child_process')

// Check if three arguments are provided
if (process.argv.length !== 5) {
  console.error('Usage: node update_cdn.js [clean|update] <directory> <origin_host> <cdn_host>')
  process.exit(1)
}

const directory = 'web-app'
const actionFlag = process.argv[2]
const originHost = process.argv[3]
const cdnHost = process.argv[4]

// Check if the directory exists
if (!fs.existsSync(directory) || !fs.lstatSync(directory).isDirectory()) {
  console.error(`Error: Directory not found: ${directory}`)
  process.exit(1)
}

const fileTypes = [ 'html', 'md' ]
const patterns = fileTypes.map(type => path.join(directory, `**/*.${type}`))
const files = [].concat(...patterns.map(pattern => glob.sync(pattern)))

// Determine whether to update or clean up based on the flag
if (actionFlag === 'update') {
  // Update HTML|MD files in the specified directory and its subdirectories
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8')
    fs.writeFileSync(
      file,
      content
        .replace(/(href=['"])(\/css|\/svg|\/md|\/font)(.*['"])/g, `$1${cdnHost}$2$3`)
        .replace(/(href=['"])(\/html)(.*['"])/g, `$1${originHost}$2$3`)
        .replace(/(src=['"])(\/js|\/svg|\/image)(.*['"])/g, `$1${cdnHost}$2$3`)
        .replace(/(data-src=['"])(\/md)(.*['"])/g, `$1${cdnHost}$2$3`)
        .replace(/(data-src=['"])(\/html)(.*['"])/g, `$1${originHost}$2$3`),
        'utf-8'
    )
  })
  console.log(`CDN host is added within ${directory}`)
} else if (actionFlag === 'clean') {
  // Clean up HTML files in the specified directory and its subdirectories
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8')
    fs.writeFileSync(
      file,
      content
        .replace(new RegExp(`(href=['"]${cdnHost})(\/css|\/svg|\/md|\/font)(.*['"])`, 'g'), 'href="$2$3')
        .replace(new RegExp(`(href=['"]${originHost})(\/html)(.*['"])`, 'g'), 'href="$2$3')
        .replace(new RegExp(`(src=['"]${cdnHost})(\/js|\/svg|\/image)(.*['"])`, 'g'), 'src="$2$3')
        .replace(new RegExp(`(data-src=['"]${cdnHost})(\/md)(.*['"])`, 'g'), 'data-src="$2$3')
        .replace(new RegExp(`(data-src=['"]${originHost})(\/html)(.*['"])`, 'g'), 'data-src="$2$3'),
      'utf-8'
    )
  })
  console.log(`CDN host is removed within ${directory}`)
} else {
  console.error('Error: Invalid action flag. Use update or clean.')
  process.exit(1)
}
