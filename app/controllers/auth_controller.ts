import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/register'
import { loginValidator } from '#validators/login'

export default class AuthController {
  async register({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    // Vérification manuelle de l'unicité de l'email
    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      return response.badRequest({ message: 'Cet email est déjà utilisé.' })
    }

    const user = await User.create(data)
    const token = await auth.use('api').createToken(user)
    return response.created({ user: user.serialize(), token })
  }

  async login({ request, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    const token = await auth.use('api').createToken(user)
    return { user: user.serialize(), token }
  }

  async me({ auth }: HttpContext) {
    await auth.authenticate()
    return auth.user
  }
}
