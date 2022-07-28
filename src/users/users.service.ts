import { inject, injectable } from 'inversify'
import { IConfigService } from '../common/config/config.service.interface'
import { TYPES } from '../types'
import { UserLoginDto } from './dto/user-login.dto'
import { UserRegisterDto } from './dto/user-register.dto'
import { User } from './user.entity'
import { IUserService } from './users.service.interface'
import { IUsersRepository } from './users.repository.interface'

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private userRepository: IUsersRepository,
	) {}
	async createUser({ email, name, password }: UserRegisterDto) {
		const newUser = new User(email, name)
		const salt = Number(this.configService.get('SALT'))
		await newUser.setPassword(password, salt)
		const existedUser = await this.userRepository.find(email)
		if (existedUser) return null
		else return this.userRepository.create(newUser)
	}
	async validateUser({ email, password }: UserLoginDto) {
		const existedUser = await this.userRepository.find(email)
		if (!existedUser) return false
		const newUser = new User(
			existedUser.email,
			existedUser.name,
			existedUser.password,
		)
		return newUser.comparePassword(password)
	}

	async getUserInfo(email: string) {
		return this.userRepository.find(email)
	}
}
