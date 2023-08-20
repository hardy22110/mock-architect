import express, { Request, Response } from 'express'
import { Worker } from 'worker_threads'
import getPathFromURL from '../utils/getPathFromURL'
import getURLParams from '../utils/getURLParams'
import sendMessageToWorker from '../utils/sendMessageToWorker'

const getRouter = express.Router()

type mockAPIConfig = {
  // 呼叫路徑 (用於找設定值)
  path: string
  method: 'get' | 'GET'
  timeout: number | string
  mockDataURL: string
}

getRouter.get('/*', async (request: Request, response: Response) => {
  try {
    // Print Log
    const { path, method } = request
    // const path = getPathFromURL(url)
    const params = getURLParams(path)
    console.log('req url', path, {
      params: JSON.stringify(params),
    })

    // Get mock data
    const result = await sendMessageToWorker(
      new Worker('./worker/getMockResponseByPath.js'),
      { path }
    )
    // getMockResponseByPath
    console.log('sendMessageToWorker re', result)

    response.status(200).send(result)
  } catch (error) {
    console.log('sendMessageToWorker error', error)
    response.status(500).send()
  }
})

export default getRouter
