import path from "path"
import winston from "winston"
import DailyRotateFile from "winston-daily-rotate-file"

import { config } from "./env.config.js"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logDir = path.join(__dirname, '../../logs')

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red bold',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue',
    }
}

winston.addColors(customLevels.colors)

const consoleFormat = winston.format.combine(
    winston.format.errors({stack: true}),
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
    winston.format.colorize({all: true}),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        const output = stack ?? message
        const shortOutput = typeof output === 'string'
            ? output.split('\n').slice(0, 3).join('\n')
            : output
        return `${timestamp} [${level}]: ${shortOutput}`
    })
)

const fileFormat = winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
        winston.format.json()
    )


const logger = winston.createLogger({
    level: config.NODE_ENV === 'production' ? 'info' : 'debug',
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            format: consoleFormat,
        }),
        new DailyRotateFile({
            dirname: logDir,
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            format: fileFormat,
            maxFiles: '14d',
        }), 
         new DailyRotateFile({
            dirname: logDir,
            filename: 'fatal-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'fatal',
            format: fileFormat,
            maxFiles: '28d',
        })
    ]
})

export default logger