import { Container, ContainerModule, interfaces } from 'inversify'
import { App } from './app'
import { ConfigService } from './common/config/config.service'
import { IConfigService } from './common/config/config.service.interface'
import { PrismaService } from './common/database/prisma.service'
import { ExceptionFilter } from './errors/exception.filter'
import { IExceptionFilter } from './errors/exception.filter.interface'
import { LoggerService } from './logger/logger.service'
import { ILogger } from './logger/logger.service.interface'
import { TYPES } from './types'
import { UserController } from './users/users.contoller'
import { UserService } from './users/users.service'
import { IUserService } from './users/users.service.interface'
import { IUserController } from './users/users.controller.interface'
import { UsersRepository } from './users/users.repository'
import { IUsersRepository } from './users/users.repository.interface'

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope()
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter)
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope()
	bind<IUserController>(TYPES.UserController)
		.to(UserController)
		.inSingletonScope()
	bind<IUserService>(TYPES.UserService).to(UserService)
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope()
	bind<IUsersRepository>(TYPES.UsersRepository)
		.to(UsersRepository)
		.inSingletonScope()
	bind<App>(TYPES.Application).to(App)
})

const bootstrap = async () => {
	const appContainer = new Container()
	appContainer.load(appBindings)
	const app = appContainer.get<App>(TYPES.Application)
	await app.init()
	return { appContainer, app }
}

export const boot = bootstrap()
