import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/register'
import { loginValidator } from '#validators/login'

import Hash from '@adonisjs/core/services/hash'
import { updatePasswordValidator } from '#validators/update_password_validator'

import Profile from '#models/profile'

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

  async login({ request, auth, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    // 🔐 Si le mot de passe doit être changé
    if (user.mustUpdatePassword) {
      const token = await auth.use('api').createToken(user)
      return response.ok({
        status: 'must_update_password',
        message: 'Vous devez mettre à jour votre mot de passe.',
        token,
        user: user.serialize(),
      })
    }

    // 📄 Si le profil n'est pas encore créé
    const profile = await Profile.findBy('userId', user.id)
    if (!profile) {
      const token = await auth.use('api').createToken(user)
      return response.ok({
        status: 'must_complete_profile',
        message: 'Vous devez compléter votre profil.',
        token,
        user: user.serialize(),
      })
    }

    // ✅ Connexion normale
    const token = await auth.use('api').createToken(user)
    return response.ok({ user: user.serialize(), token })
  }

  async me({ auth }: HttpContext) {
    await auth.authenticate()
    const user = auth.user!
    const profile = await Profile.findBy('userId', user.id)

    return {
      user: user.serialize(),
      hasProfile: !!profile, // 👈 true si profil existe, false sinon
    }
  }
  async updatePassword({ request, auth, response }: HttpContext) {
    const user = auth.user!

    const { oldPassword, newPassword } = await request.validateUsing(updatePasswordValidator)

    const isValid = await Hash.verify(user.password, oldPassword)
    if (!isValid) {
      return response.unauthorized({ message: 'Mot de passe actuel incorrect.' })
    }

    user.password = newPassword
    user.mustUpdatePassword = false
    await user.save()

    return response.ok({ message: 'Mot de passe mis à jour avec succès.' })
  }
}
