import { compare, hash } from 'bcryptjs'

export class User {
	private _password: string
	constructor(
		private readonly _email: string,
		private readonly _name: string,
		password?: string,
	) {
		if (password) this._password = password
	}

	get email() {
		return this._email
	}

	get name() {
		return this._name
	}

	get password() {
		return this._password
	}

	async setPassword(pass: string, salt: number) {
		this._password = await hash(pass, salt)
	}

	async comparePassword(pass: string) {
		return await compare(pass, this._password)
	}
}
