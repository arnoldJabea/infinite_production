import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import vine from '@vinejs/vine'

export default class ResetPasswordController {
  async handle({ request, response }: HttpContext) {
    const schema = vine.compile(
      vine.object({
        token: vine.string(),
        password: vine.string().minLength(8).confirmed(), 
      })
    )

    const payload = await request.validateUsing(schema)

    
    const user = await User.findBy('reset_token', payload.token)

    if (!user) {
      return response.badRequest({ message: 'Token invalide ou expiré.' })
    }

    // Mise à jour du mot de passe et suppression du token
    user.password = await hash.make(payload.password)
    user.reset_token = null
    await user.save()

    return response.ok({ message: 'Mot de passe réinitialisé avec succès.' })
  }
}