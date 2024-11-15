const readline = require('readline').promises

module.exports = async function readSecrets(config) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  })

  await iterateObjectRecursively(config, async (key, value, path) => {
    if (value === '<cli>') {
      const secret = await rl.question(`\x1b[36mPlease, provide a value for \x1b[0m\x1b[38;5;214m"${path.join('.')}":\x1b[0m`)
      setValueAtPath(config, path, secret)
    }
  })

  rl.close()
}

async function iterateObjectRecursively(obj, callback, path = []) {
  if (Array.isArray(obj)) {
    for (let index = 0; index < obj.length; index++) {
      const value = obj[index]
      const currentPath = [...path, index]
      if (typeof value === 'object' && value !== null) {
        await iterateObjectRecursively(value, callback, currentPath)
      } else {
        await callback(index, value, currentPath)
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key]
      if (typeof value === 'object' && value !== null) {
        await iterateObjectRecursively(value, callback, currentPath)
      } else {
        await callback(key, value, currentPath)
      }
    }
  }
}

function setValueAtPath(obj, path, newValue) {
  let current = obj

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    
    if (!(key in current)) {
      throw new Error(`${path} is not in the obj`)
    }

    current = current[key]
  }

  const lastKey = path[path.length - 1]
  current[lastKey] = newValue
}
