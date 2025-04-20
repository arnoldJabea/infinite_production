import type { HttpContext } from '@adonisjs/core/http'
import { profileValidator } from '#validators/profile'

export default class ProfilesController {
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const existing = await user.related('profile').query().first()

    if (existing) {
      return response.badRequest({ message: 'Profil déjà créé.' })
    }

    const payload = await request.validateUsing(profileValidator)

    const profile = await user.related('profile').create(payload)
    return response.created({ profile })
  }

  async show({ auth, response }: HttpContext) {
    const profile = await auth.user!.related('profile').query().first()
    if (!profile) return response.notFound({ message: 'Profil non trouvé.' })

  }

  async update({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const profile = await user.related('profile').query().first()

    if (!profile) {
      return response.notFound({ message: 'Profil inexistant.' })
    }

    const payload = await request.validateUsing(profileValidator)
    profile.merge(payload)
    await profile.save()

    return profile
  }
}
