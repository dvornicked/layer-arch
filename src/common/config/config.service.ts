import { IConfigService } from './config.service.interface'
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { ILogger } from '../../logger/logger.service.interface'

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		const result: DotenvConfigOutput = config()
		if (result.error) this.logger.error('[ConfigService] .env error')
		else {
			this.logger.log('[ConfigService] Сonfig .env uploaded successfully')
			this.config = result.parsed as DotenvParseOutput
		}
	}

	get(key: string) {
		return this.config[key]
	}
}
