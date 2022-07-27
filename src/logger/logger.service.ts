import { injectable } from 'inversify'
import { Logger } from 'tslog'
import 'reflect-metadata'
import { ILogger } from './logger.service.interface'

@injectable()
export class LoggerService implements ILogger {
	logger: Logger = new Logger({
		displayFunctionName: false,
		displayFilePath: 'hidden',
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
