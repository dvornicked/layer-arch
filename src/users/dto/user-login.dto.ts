import { IsEmail, IsString } from 'class-validator'

export class UserLoginDto {
	@IsEmail({}, { message: 'Invalid value' })
	email: string

	@IsString({ message: 'No password specified' })
	password: string
}
