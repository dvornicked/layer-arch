import { inject, injectable } from 'inversify'
import { PrismaService } from '../common/database/prisma.service'
import { TYPES } from '../types'
import { User } from './user.entity'
import { IUsersRepository } from './users.repository.interface'

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {}
	async create({ email, password, name }: User) {
		return this.prismaService.client.userModel.create({
			data: { email, password, name },
		})
	}

	async find(email: string) {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		})
	}
}
