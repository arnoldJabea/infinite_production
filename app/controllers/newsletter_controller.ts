import type { HttpContext } from '@adonisjs/core/http'
import Newsletter from '#models/newsletter'
import { newsletterValidator } from '#validators/newsletter'

export default class NewsletterController {
  async subscribe({ request, response }: HttpContext) {
    const payload = await request.validateUsing(newsletterValidator)

    const existing = await Newsletter.findBy('email', payload.email)
    if (existing) {
      return response.conflict({ message: 'Cette adresse email est déjà inscrite.' })
    }

    await Newsletter.create(payload)

    return response.created({ message: 'Inscription à la newsletter réussie.' })
  }

  async index({ response }: HttpContext) {
    const all = await Newsletter.all()
    return response.ok(all)
  }
}