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

	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'hello@gmail.com', password: 'passd' })
		expect(res.body.jwt).not.toBeUndefined()
	})

	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'hello@gmail.com', password: 'passd2' })
		expect(res.statusCode).toBe(401)
	})

	it('Info - success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'hello@gmail.com', password: 'passd' })
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`)
		expect(res.body.email).toBe('hello@gmail.com')
	})

	it('Info - error', async () => {
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer jwt`)
		expect(res.statusCode).toBe(401)
	})
})

afterAll(() => {
	application.close()
})
