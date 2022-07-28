import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { BaseController } from '../common/base.controller'
import { ValidateMiddleware } from '../common/validate.middleware'
import { HTTPError } from '../errors/http-error.class'
import { LoggerService } from '../logger/logger.service'
import { TYPES } from '../types'
import { UserLoginDto } from './dto/user-login.dto'
import { UserRegisterDto } from './dto/user-register.dto'
import { UserService } from './users.service'
import { sign } from 'jsonwebtoken'
import { ConfigService } from '../common/config/config.service'
import { IUserService } from './users.service.interface'
import { IConfigService } from '../common/config/config.service.interface'
import { AuthGuard } from '../common/auth.guard'

@injectable()
export class UserController extends BaseController implements UserController {
	constructor(
		@inject(TYPES.Logger) logger: LoggerService,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(logger)
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		])
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	) {
		const result = await this.userService.createUser(body)
		if (!result) return next(new HTTPError(422, 'This user is already exists'))
		this.ok(res, { email: result.email, id: result.id })
	}

	async info({ user }: Request, res: Response, next: NextFunction) {
		const userInfo = await this.userService.getUserInfo(user)
		this.ok(res, { email: userInfo?.email, id: userInfo?.id })
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	) {
		const result = await this.userService.validateUser(req.body)
		if (!result) return next(new HTTPError(401, 'Auth Error'))
		else {
			const jwt = await this.signJWT(
				req.body.email,
				this.configService.get('SECRET'),
			)
			this.ok(res, { jwt })
		}
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(error, token) => {
					if (error) reject(error)
					resolve(token as string)
				},
			)
		})
	}
}
