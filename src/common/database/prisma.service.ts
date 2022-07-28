import { inject, injectable } from 'inversify'
import { PrismaClient, UserModel } from '@prisma/client'
import { TYPES } from '../../types'
import { ILogger } from '../../logger/logger.service.interface'

@injectable()
export class PrismaService {
	client: PrismaClient

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		this.client = new PrismaClient()
	}

	async connect() {
		try {
			this.logger.log('[PrismaService]: Successful connection to database')
			await this.client.$connect()
		} catch (e) {
			if (e instanceof Error)
				this.logger.error(
					'[PrismaService] Failed to connect to database: ' + e.message,
				)
		}
	}

	async disconnect() {
		await this.client.$disconnect()
	}
}
