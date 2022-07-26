import express, { Express } from 'express'
import { Server } from 'http'
import { inject, injectable } from 'inversify'
import { ExceptionFilter } from './errors/exception.filter'
import { LoggerService } from './logger/logger.service'
import { TYPES } from './types'
import { UserController } from './users/user.contoller'
import 'reflect-metadata'

@injectable()
export class App {
  app: Express
  server: Server
  port: number

  constructor(
    @inject(TYPES.Logger) private logger: LoggerService,
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter
  ) {
    this.app = express()
    this.port = 8000
  }

  useRoutes() {
    this.app.use('/users', this.userController.router)
  }

  useExceptionFilter() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
  }

  public async init() {
    this.useRoutes()
    this.useExceptionFilter()
    this.server = this.app.listen(this.port)
    console.log(`Server started: http://localhost:${this.port}`)
  }
}
