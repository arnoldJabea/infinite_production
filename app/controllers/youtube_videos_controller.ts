import type { HttpContext } from '@adonisjs/core/http'
import YouTubeVideo from '#models/youtube_video'

export default class YouTubeVideosController {
  public async store({ request, auth, response }: HttpContext) {
    const user = auth.user!

    const payload = request.only(['title', 'description', 'youtube_url', 'is_visible'])

    if (!payload.youtube_url) {
      return response.badRequest({ message: 'Lien YouTube requis.' })
    }

    const video = await YouTubeVideo.create({
      userId: user.id,
      title: payload.title,
      description: payload.description,
      youtubeUrl: payload.youtube_url,
      isVisible: payload.is_visible ?? true,
    })

    return response.created({
      message: 'Vidéo YouTube ajoutée avec succès.',
      data: video,
    })
  }

  public async index({ response }: HttpContext) {
    const videos = await YouTubeVideo.query()
      .where('is_visible', true)
      .preload('user')
      .orderBy('created_at', 'desc')

    return response.ok({ data: videos })
  }
  public async show({ params, response }: HttpContext) {
    const video = await YouTubeVideo
      .query()
      .where('id', params.id)
      .andWhere('is_visible', true)
      .preload('user')
      .first()

    if (!video) {
      return response.notFound({ message: 'Vidéo non trouvée ou privée.' })
    }

    return response.ok({ data: video })
  }
  public async update({ request, params, auth, response }: HttpContext) {
    const user = auth.user!

    const video = await YouTubeVideo.find(params.id)

    if (!video) {
      return response.notFound({ message: 'Vidéo non trouvée.' })
    }

    // Vérifie si c’est le propriétaire ou un admin
    if (video.userId !== user.id && user.role !== 'admin') {
      return response.unauthorized({ message: 'Accès non autorisé.' })
    }

    const payload = request.only(['title', 'description', 'youtube_url', 'is_visible'])

    video.merge({
      title: payload.title ?? video.title,
      description: payload.description ?? video.description,
      youtubeUrl: payload.youtube_url ?? video.youtubeUrl,
      isVisible: payload.is_visible ?? video.isVisible,
    })

    await video.save()

    return response.ok({ message: 'Vidéo mise à jour avec succès.', data: video })
  }
  public async destroy({ params, response }: HttpContext) {
    const video = await YouTubeVideo.find(params.id)

    if (!video) {
      return response.notFound({ message: 'Vidéo introuvable.' })
    }

    await video.delete()
    return response.ok({ message: 'Vidéo supprimée avec succès.' })
  }

}