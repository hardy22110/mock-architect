import { Worker } from 'worker_threads'

export default function sendMessageToWorker(worker: Worker, message: any): Promise<any> {
  return new Promise((resolve, reject) => {
    // 監聽訊息事件
    worker.on('message', (result) => {
      // 移除監聽，以免後續的通訊干擾
      worker.removeAllListeners('message')
      console.log('worker message', result)
      resolve(result)
    })

    worker.on('error', (error) => {
      worker.removeAllListeners('message');

      console.log('worker error', error)
      // 處理錯誤
      reject(error)
    })

    // 向 Worker 發送訊息
    worker.postMessage(message)
  })
}
