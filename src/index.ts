import { Container, ContainerModule, interfaces } from 'inversify'
import { App } from './app'
import { ExceptionFilter } from './errors/exception.filter'
import { IExceptionFilter } from './errors/exception.filter.interface'
import { LoggerService } from './logger/logger.service'
import { ILogger } from './logger/logger.service.interface'
import { TYPES } from './types'
import { UserController } from './users/user.contoller'
import { UserService } from './users/user.service'
import { IUserService } from './users/user.service.interface'
import { IUserController } from './users/users.controller.interface'

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.Logger).to(LoggerService)
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter)
	bind<IUserController>(TYPES.UserController).to(UserController)
	bind<IUserService>(TYPES.UserService).to(UserService)
	bind<App>(TYPES.Application).to(App)
})

const bootstrap = () => {
	const appContainer = new Container()
	appContainer.load(appBindings)
	const app = appContainer.get<App>(TYPES.Application)
	app.init()
	return { appContainer, app }
}

export const { appContainer, app } = bootstrap()
