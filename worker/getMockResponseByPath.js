
const { parentPort } = require('worker_threads')
const fs = require('fs')
const path = require('path')
// 專案路徑
let currentPath = ''
// eslint-disable-next-line no-prototype-builtins
if (process.hasOwnProperty('pkg')) {
  //  It is run as an executable
  currentPath = path.dirname(process.execPath)
} else {
  //  It is run with nodejs
  currentPath = __dirname
}

parentPort?.on('message', (message) => {

  // get setting
  try {
    const mockConfig = JSON.parse(
      fs.readFileSync(path.join(currentPath, '../mockConfig.json')).toString()
    )
    const { mockList } = mockConfig
    if (!Array.isArray(mockList)) {
      throw new Error('mockList not found in mockConfig.json')
    }
    console.log('mockList', mockList)
    // get current mock setting
    const currentMockSetting = mockList.find(({ path }) => path === message.path)
    if (!currentMockSetting) {
      throw new Error('currentMockSetting not found in mockList')
    }
    
    
  } catch (error) {
    console.log('[readFile] mockConfig error', error)
  }


  parentPort?.postMessage(message)
})