// app/middleware/ensure_profile_exists.ts
import type { HttpContext } from '@adonisjs/core/http'
import Profile from '#models/profile'

export default class EnsureProfileExists {
  async handle({ auth, response }: HttpContext, next: () => Promise<void>) {
    const user = auth.user!

    const profile = await Profile.findBy('userId', user.id)

    if (!profile) {
      return response.unauthorized({
        message: 'Complétez votre profil pour accéder à cette fonctionnalité.',
      })
    }

    await next()
  }
}