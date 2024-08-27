// very, very basic client side logger
export class logger {
  private static printLog(message: unknown, level: 'debug' | 'info' | 'warning' | 'error', data?: Array<unknown>) {
    const date = new Date().toISOString()

    if (data) {
      console.log(`[${date}] [${level}] : ${message}`, data)
      return
    }

    console.log(`[${date}] [${level}] : ${message}`)
  }

  static debug(message: string, ...data: Array<unknown>) {
    this.printLog(message, 'debug', data)
  }

  static info(message: string, ...data: Array<unknown>) {
    this.printLog(message, 'info', data)
  }

  static warning(message: string, ...data: Array<unknown>) {
    this.printLog(message, 'warning', data)
  }

  static error(message: string, ...data: Array<unknown>) {
    this.printLog(message, 'error', data)
  }
}