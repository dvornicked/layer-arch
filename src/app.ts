import express, { Express } from 'express'
import { Server } from 'http'
import { inject, injectable } from 'inversify'
import { ExceptionFilter } from './errors/exception.filter'
import { LoggerService } from './logger/logger.service'
import { TYPES } from './types'
import { UserController } from './users/users.contoller'
import { json } from 'body-parser'
import 'reflect-metadata'
import { ConfigService } from './common/config/config.service'
import { IConfigService } from './common/config/config.service.interface'
import { IExceptionFilter } from './errors/exception.filter.interface'
import { IUserController } from './users/users.controller.interface'
import { ILogger } from './logger/logger.service.interface'
import { PrismaService } from './common/database/prisma.service'
import { AuthMiddleware } from './common/auth.middleware'

@injectable()
export class App {
	app: Express
	server: Server
	port: number

	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express()
		this.port = 3003
	}

	useRoutes() {
		this.app.use('/users', this.userController.router)
	}

	useExceptionFilter() {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
	}

	useMiddleware() {
		this.app.use(json())
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'))
		this.app.use(authMiddleware.execute.bind(authMiddleware))
	}

	public async init() {
		this.useMiddleware()
		this.useRoutes()
		this.useExceptionFilter()
		await this.prismaService.connect()
		this.server = this.app.listen(this.port)
		console.log(`Server started: http://localhost:${this.port}`)
	}
}
