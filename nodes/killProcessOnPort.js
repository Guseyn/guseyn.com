const { exec } = require('child_process')

module.exports = function killProcessOnPort(port) {
  const command = process.platform === 'win32'
    ? `netstat -ano | findstr :${port}` // For Windows
    : `lsof -i :${port} -t` // For macOS/Linux

  exec(command, (err, stdout) => {
    if (err) {
      console.error(`Error finding process on port ${port}:`, err.message)
      return
    }

    const processId = process.platform === 'win32'
      ? stdout.trim().split(/\s+/).pop() // Extract PID for Windows
      : stdout.trim() // Process ID for Unix-based systems

    if (!processId) {
      console.log(`No process found on port ${port}`)
      return
    }

    const killCommand = process.platform === 'win32'
      ? `taskkill /PID ${processId} /F`
      : `kill -9 ${processId}`

    exec(killCommand, (killErr) => {
      if (killErr) {
        console.error(`Error killing process on port ${port}:`, killErr.message)
      } else {
        console.log(`Successfully killed process on port ${port}`)
      }
    })
  })
}

