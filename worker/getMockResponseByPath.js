const { parentPort } = require('worker_threads')
const fs = require('fs')
const path = require('path')

function delay(time) {
  return new Promise((resolve) => {
    const ms = time ? time : 0
    setTimeout(() => resolve(), ms < 0 ? 0 : ms)
  })
}

// 當前路徑
let currentPath = ''
// eslint-disable-next-line no-prototype-builtins
if (process.hasOwnProperty('pkg')) {
  //  It is run as an executable
  currentPath = path.dirname(process.execPath)
} else {
  //  It is run with nodejs
  currentPath = __dirname
}

parentPort?.on('message', async (message) => {
  let mockResponse = null
  try {
    // Get config
    const mockConfig = JSON.parse(
      fs.readFileSync(path.join(currentPath, '../mockConfig.json')).toString()
    )
    const { mockList } = mockConfig
    if (!Array.isArray(mockList)) {
      throw new Error('mockList not found in mockConfig.json')
    }

    // Get current mock config
    const currentMockSetting = mockList.find(
      ({ path, method }) =>
        path === message.path &&
        method.toUpperCase() === message.method.toUpperCase()
    )
    if (!currentMockSetting) {
      throw new Error('currentMockSetting not found in mockList')
    }

    // Get current mock Response config
    const { timeout, mockDataURL } = currentMockSetting
    if (!mockDataURL) {
      throw new Error('currentMockSetting.mockDataURL not found')
    }

    // Get mock Response
    mockResponse = JSON.parse(
      fs.readFileSync(path.join(currentPath, mockDataURL)).toString()
    )

    // Timeout
    await new Promise((resolve) => {
      setTimeout(() => resolve(), Number(timeout) || 0)
    })

  } catch (error) {
    throw error
  }

  parentPort?.postMessage(mockResponse)
})