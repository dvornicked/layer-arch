import 'reflect-metadata'
import { Container } from 'inversify'
import { IConfigService } from '../common/config/config.service.interface'
import { TYPES } from '../types'
import { User } from './user.entity'
import { IUsersRepository } from './users.repository.interface'
import { UserService } from './users.service'
import { IUserService } from './users.service.interface'
import { UserModel } from '@prisma/client'

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
}

const UsersRepository: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
}

const container = new Container()
let configService: IConfigService
let usersRepository: IUsersRepository
let usersService: IUserService

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService)
	container
		.bind<IConfigService>(TYPES.ConfigService)
		.toConstantValue(ConfigServiceMock)
	container
		.bind<IUsersRepository>(TYPES.UsersRepository)
		.toConstantValue(UsersRepository)

	usersService = container.get<IUserService>(TYPES.UserService)
	configService = container.get<IConfigService>(TYPES.ConfigService)
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository)
})

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1')
		usersRepository.create = jest.fn().mockImplementation(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		)
		const createdUser = await usersService.createUser({
			email: 't@t.t',
			password: 'pass',
			name: 'name',
		})

		expect(createdUser?.id).toEqual(1)
		expect(createdUser?.password).not.toEqual('1')
	})
})
