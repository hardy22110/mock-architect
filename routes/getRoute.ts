import express, { Request, Response } from 'express'
import { Worker } from 'worker_threads'
import sendMessageToWorker from '../utils/sendMessageToWorker'
import logger from '../utils/logger'
import { URL } from 'url'
import { randomUUID } from 'crypto'

const getRouter = express.Router()
type mockAPIConfig = {
  // 呼叫路徑 (用於找設定值)
  path: string
  method: 'get' | 'GET'
  timeout: number | string
  mockDataURL: string
}

getRouter.get('/*', async (request: Request, response: Response) => {
  const UUID = randomUUID()
  logger.debug(`[GET] [${UUID}] [GO]`)
  let result: any = null
  let statusCode = 500
  try {
    // Get information
    const { url, path, method } = request
    const params: Record<string, string> = {}
    const parsedUrl = new URL(url, 'http://localhost.com')
    for (const [key, value] of parsedUrl.searchParams.entries()) {
      params[key] = value
    }
    logger.info(
      `[GET] [${UUID}] [INFORMATION]`,
      JSON.stringify({
        path,
        method,
        params,
      })
    )

    // Get mock data
    result = await sendMessageToWorker(
      new Worker('./worker/getMockResponseByPath.js'),
      { path, method }
    )
    if (!result) {
      throw new Error('result not found in sendMessageToWorker')
    }
    // Print get mock data result
    logger.info(`[GET] [${UUID}] [RESULT]`, result)

    statusCode = 200
  } catch (error) {
    statusCode = 500
    logger.error(`[GET] [${UUID}] [CATCH]`, error)
  }
  logger.debug(`[GET] [${UUID}] [END]`)
  // Send response
  response.status(statusCode).send(result)
})

export default getRouter
