import { createLogger, format, transports } from 'winston'

import 'winston-daily-rotate-file'
import path from 'path'
const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }),
  // format.align(),
  format.printf(
    ({ level, timestamp, message }) => `${level.toUpperCase()}: ${[timestamp]}: ${message}`
  )
)

// 專案路徑
let projectFolder = ''
// eslint-disable-next-line no-prototype-builtins
if (process.hasOwnProperty('pkg')) {
  //  It is run as an executable
  projectFolder = path.dirname(process.execPath)
} else {
  //  It is run with nodejs
  projectFolder = __dirname
}

const defaultOptions = {
  format: customFormat,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  colorize: true,
}

const winLogger = createLogger({
  format: customFormat,
  transports: [
    new transports.DailyRotateFile({
      filename: projectFolder + '/logs/mock-architect-%DATE%.log',
      level: 'info',
      json: true,
      handleExceptions: true,
      ...defaultOptions,
    }),
    new transports.DailyRotateFile({
      filename: projectFolder + '/logs/mock-architect-%DATE%-debug.log',
      level: 'debug',
      json: true,
      handleExceptions: true,
      datePattern: 'YYYY-MM-DD',
    }),
  ],
})

const logger = {
  info(...message: any[]) {
    winLogger.info(message.join(', '))
  },
  debug(...message: any[]) {
    winLogger.debug(message.join(', '))
  },
  error(...message: any[]) {
    winLogger.error(message.join(', '))
  },
}
export default logger
