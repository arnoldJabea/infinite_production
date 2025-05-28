import type { HttpContext } from '@adonisjs/core/http'
import { profileValidator } from '#validators/profile'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import Profile from '#models/profile'


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

    return response.ok({ profile })

  }
  async uploadPressKit({ request, auth, response }: HttpContext) {
    const file = request.file('file', {
      size: '5mb',
      extnames: ['pdf', 'zip'],
    })

    if (!file) {
      return response.badRequest({ message: 'Aucun fichier reçu.' })
    }

    const profile = await auth.user!.related('profile').query().first()
    if (!profile) return response.notFound({ message: 'Profil inexistant.' })

    const fileName = `${cuid()}.${file.extname}`
    await file.move(app.makePath('uploads/presskits'), { name: fileName })

    profile.pressKitPath = `presskits/${fileName}`
    await profile.save()

    const baseUrl = process.env.APP_URL || 'http://localhost:3333'
    const url = `${baseUrl}/uploads/${profile.pressKitPath}`

    return response.ok({
      message: 'Fichier press kit ajouté.',
      path: profile.pressKitPath,
      publicUrl: url
    })
  }

  async pressKitUrl({ auth, response }: HttpContext) {
    const profile = await auth.user!.related('profile').query().first()

    if (!profile || !profile.pressKitPath) {
      return response.notFound({ message: 'Aucun press kit disponible.' })
    }

    const baseUrl = process.env.APP_URL || 'http://localhost:3333'
    const url = `${baseUrl}/uploads/${profile.pressKitPath}`

    return response.ok({ url })
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

    return response.ok({ message: 'Profil mis à jour.', profile })
  }
  public async search({ request, response }: HttpContext) {
    const query = request.input('query')
    const profession = request.input('profession')
    const style = request.input('style')

    const profilesQuery = Profile.query()
      .preload('user') // si besoin d’infos user
      .if(query, (qb) => {
        qb.where('bio', 'ilike', `%${query}%`)
          .orWhere('website', 'ilike', `%${query}%`)
      })
      .if(profession, (qb) => {
        qb.where('profession', profession)
      })
      .if(style, (qb) => {
        qb.where('style', style)
      })

    const results = await profilesQuery

    return response.ok({ data: results })
  }
}
