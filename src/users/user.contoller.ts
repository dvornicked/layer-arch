import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { BaseController } from '../common/base.controller'
import { ValidateMiddleware } from '../common/validate.middleware'
import { HTTPError } from '../errors/http-error.class'
import { LoggerService } from '../logger/logger.service'
import { TYPES } from '../types'
import { UserLoginDto } from './dto/user-login.dto'
import { UserRegisterDto } from './dto/user-register.dto'
import { UserService } from './user.service'

@injectable()
export class UserController extends BaseController implements UserController {
	constructor(
		@inject(TYPES.Logger) logger: LoggerService,
		@inject(TYPES.UserService) private userService: UserService,
	) {
		super(logger)
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{ path: '/login', method: 'post', func: this.login },
		])
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	) {
		const result = await this.userService.createUser(body)
		console.log(result)
		if (!result) return next(new HTTPError(422, 'This user is not exists'))
		this.ok(res, { email: result.email })
	}

	login(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	) {
		this.ok(res, 'login')
		// next(new HTTPError(401, 'Auth Error', 'Login'))
	}
}
