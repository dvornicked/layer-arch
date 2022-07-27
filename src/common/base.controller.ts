import { Router, Response } from 'express'
import { injectable } from 'inversify'
import { LoggerService } from '../logger/logger.service'
import { IControllerRoute } from './route.interface'
import 'reflect-metadata'

@injectable()
export abstract class BaseController {
	private readonly _router: Router
	get router() {
		return this._router
	}

	constructor(private logger: LoggerService) {
		this._router = Router()
	}

	send<T>(res: Response, code: number, message: T) {
		res.type('application/json')
		return res.status(code).json(message)
	}

	ok<T>(res: Response, message: T) {
		return this.send(res, 200, message)
	}

	created(res: Response) {
		return res.sendStatus(201)
	}

	protected bindRoutes(routes: IControllerRoute[]) {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`)
			const middleware = route.middlewares?.map((m) => m.execute.bind(m))
			const handler = route.func.bind(this)
			const pipeline = middleware ? [...middleware, handler] : handler
			this.router[route.method](route.path, pipeline)
		}
	}
}
