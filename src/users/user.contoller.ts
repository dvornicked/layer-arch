import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { BaseController } from '../common/base.controller'
import { HTTPError } from '../errors/http-error.class'
import { LoggerService } from '../logger/logger.service'
import { TYPES } from '../types'

class User {}
const users = []

@injectable()
export class UserController extends BaseController implements UserController {
	constructor(@inject(TYPES.Logger) logger: LoggerService) {
		super(logger)
		this.bindRoutes([
			{ path: '/register', method: 'post', func: this.register },
			{ path: '/login', method: 'post', func: this.login },
		])
	}

	register(req: Request, res: Response, next: NextFunction) {
		users.push(new User())
		this.ok(res, 'register')
	}
	login(req: Request, res: Response, next: NextFunction) {
		// this.ok(res, 'login')
		next(new HTTPError(401, 'Auth Error', 'Login'))
	}
}
