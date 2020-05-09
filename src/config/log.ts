import chalk from 'chalk'
import consoleback from 'consoleback'
import fs from 'fs'
import moment from 'moment'

const real = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
}
console.log = (message?: any, ...optionalParams: any[]) => {
  real.log(chalk.green(message, ...optionalParams))
}

console.error = (message?: any, ...optionalParams: any[]) => {
  real.error(chalk.red(message, ...optionalParams))
}

console.warn = (message?: any, ...optionalParams: any[]) => {
  real.warn(chalk.yellow(message, ...optionalParams))
}

console.info = (message?: any, ...optionalParams: any[]) => {
  real.info(chalk.blue(message, ...optionalParams))
}

console.debug = (message?: any, ...optionalParams: any[]) => {
  real.debug(chalk.redBright(message, ...optionalParams))
}

const initLog = async () => {
  consoleback({
    callback: (type: string, message: any, ...optionalParams: any[]) => {
      fs.appendFileSync(
        `./${moment().format('YYYY-MM-DD')}.log`,
        `${[message, ...optionalParams].join(' ')}\n`
      )
    },
    showTime: true,
  })
}

export default initLog

export const log = (
  className: string,
  methodName: string,
  message: string,
  ...optionalParams: string[]
) => {
  console.log(className, `[${methodName}]`, message, optionalParams)
}

export const warn = (
  className: string,
  methodName: string,
  message: string,
  ...optionalParams: string[]
) => {
  console.warn(className, `[${methodName}]`, message, optionalParams)
}

export const error = (
  className: string,
  methodName: string,
  message: string,
  ...optionalParams: string[]
) => {
  console.error(className, `[${methodName}]`, message, optionalParams)
}

export const info = (
  className: string,
  methodName: string,
  message: string,
  ...optionalParams: string[]
) => {
  console.info(className, `[${methodName}]`, message, optionalParams)
}

export const debug = (
  className: string,
  methodName: string,
  message: string,
  ...optionalParams: string[]
) => {
  console.debug(className, `[${methodName}]`, message, optionalParams)
}
