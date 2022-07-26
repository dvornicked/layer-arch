import { Logger } from 'tslog';

export class LoggerService {
  private logger: Logger = new Logger({
    // displayInstanceName: false,
    // displayLoggerName: false,
    displayFunctionName: false,
    displayFilePath: 'hidden'
    
  })

  log(...args: unknown[]) {
    this.logger.info(...args)
  }

  error(...args: unknown[]) {
    this.logger.error(...args)
  }

  warn(...args: unknown[]) {
    this.logger.warn(...args)
  }
}