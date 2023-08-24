import express, { Request, Response } from 'express'
import { Worker } from 'worker_threads'
import sendMessageToWorker from '../utils/sendMessageToWorker'
import logger from '../utils/logger'
import { randomUUID } from 'crypto'

const getRouter = express.Router()

type mockAPIConfig = {
  // 呼叫路徑 (用於找設定值)
  path: string
  method: 'get' | 'GET' | 'post' | 'POST'
  timeout: number | string
  mockDataURL: string
}

getRouter.post('/*', async (request: Request, response: Response) => {
  const UUID = randomUUID()
  logger.debug(`[POST] [${UUID}] [GO]`)
  let result: any = null
  let statusCode = 500
  try {
    // Get information
    const { path, method, body } = request
    logger.info(
      `[POST] [${UUID}] [INFORMATION]`,
      `path = ${path}, method = ${method}, body = ${JSON.stringify(body)}`
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
    logger.info(`[POST] [${UUID}] [RESULT]`, result)

    statusCode = 200
  } catch (error) {
    logger.error(`[POST] [${UUID}] [CATCH]`, error)
    statusCode = 500
  }
  logger.debug(`[POST] [${UUID}] [END]`)
  // Send response
  response.status(statusCode).send(result)
})

export default getRouter
