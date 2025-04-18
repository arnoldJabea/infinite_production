import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/register'
import { loginValidator }    from '#validators/login'

export default class AuthController {
  async register({ request, auth, response }: HttpContext) {
    const data  = await request.validateUsing(registerValidator)
    const user  = await User.create(data)
    const token = await auth.use('api').createToken(user)
    return response.created({ user, token })
  }

  async login({ request, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user   = await User.verifyCredentials(email, password)
    const token  = await auth.use('api').createToken(user)
    return token
  }

  async me({ auth }: HttpContext) {
    await auth.authenticate()
    return auth.user
  }
}
