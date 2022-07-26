import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { LoggerService } from '../logger/logger.service'
import { TYPES } from '../types'
import { IExceptionFilter } from './exception.filter.interface'
import { HTTPError } from './http-error.class'
import 'reflect-metadata'

@injectable()
export class ExceptionFilter implements IExceptionFilter {
  constructor(@inject(TYPES.Logger) private logger: LoggerService) {}

  catch(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HTTPError) {
      this.logger.error(
        `[${err.context}] Error ${err.statusCode} : ${err.message}`
      )
      res.status(err.statusCode).send({ err: err.message })
    } else {
      this.logger.error(`${err.message}`)
      res.status(500).send({ err: err.message })
    }
  }
}
