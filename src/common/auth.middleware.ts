import { NextFunction, Request, Response } from 'express'
import { IMiddleware } from './middleware.interface'
import { verify, JwtPayload } from 'jsonwebtoken'

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}
	execute(req: Request, res: Response, next: NextFunction) {
		if (req.headers.authorization) {
			verify(
				req.headers.authorization.split(' ')[1],
				this.secret,
				(error, payload) => {
					if (error) next()
					else if (payload) {
						req.user = (payload as JwtPayload).email
						next()
					}
				},
			)
		} else {
			next()
		}
	}
}
