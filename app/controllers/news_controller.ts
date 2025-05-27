import type { HttpContext } from '@adonisjs/core/http'
import News from '#models/news'
import { newsValidator } from '#validators/news'

export default class NewsController {
  async index() {
    const news = await News.query().orderBy('createdAt', 'desc')
    return news
  }

  async show({ params, response }: HttpContext) {
    const news = await News.find(params.id)

    if (!news) {
      return response.notFound({ message: 'Actualité introuvable.' })
    }

    return news
  }

  async store({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(newsValidator)

    const news = await News.create({
      ...payload,
      userId: auth.user!.id,
    })

    return response.created({ message: 'Actualité publiée avec succès.', data: news })
  }

  async update({ params, request, response, auth }: HttpContext) {
    const news = await News.find(params.id)

    if (!news) {
      return response.notFound({ message: 'Actualité introuvable.' })
    }

    if (news.userId !== auth.user!.id && auth.user!.role !== 'admin') {
      return response.forbidden({ message: 'Accès refusé.' })
    }

    const payload = await request.validateUsing(newsValidator)

    news.merge(payload)
    await news.save()

    return response.ok({ message: 'Actualité mise à jour.', data: news })
  }

  async destroy({ params, response, auth }: HttpContext) {
    const news = await News.find(params.id)

    if (!news) {
      return response.notFound({ message: 'Actualité introuvable.' })
    }

    if (news.userId !== auth.user!.id && auth.user!.role !== 'admin') {
      return response.forbidden({ message: 'Accès refusé.' })
    }

    await news.delete()

    return response.ok({ message: 'Actualité supprimée avec succès.' })
  }
}