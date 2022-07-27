import { isEmail } from 'class-validator'

export class UserLoginDto {
	email: string
	password: string
}
