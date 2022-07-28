import { boot } from '../src'
import { App } from '../src/app'
import request from 'supertest'

let application: App

beforeAll(async () => {
	const { app } = await boot
	application = app
})

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'hello@gmail.com', password: 'passd' })
		expect(res.statusCode).toBe(422)
	})
})

afterAll(() => {
	application.close()
})
