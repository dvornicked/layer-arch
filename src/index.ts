import { Container, ContainerModule, interfaces } from 'inversify'
import { App } from './app'
import { ExceptionFilter } from './errors/exception.filter'
import { LoggerService } from './logger/logger.service'
import { TYPES } from './types'
import { UserController } from './users/user.contoller'

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<LoggerService>(TYPES.Logger).to(LoggerService)
  bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter)
  bind<UserController>(TYPES.UserController).to(UserController)
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
