import type { HttpContext } from '@adonisjs/core/http'
import { mediaValidator } from '#validators/media'
import Media from '#models/media'
import Project from '#models/project'

export default class MediaController {
  async index({ params, auth, response }: HttpContext) {
    const project = await Project.find(params.projectId)

    if (!project || project.userId !== auth.user!.id) {
      return response.unauthorized({ message: 'Accès interdit au projet.' })
    }

    const media = await project.related('media').query().orderBy('created_at', 'desc')
    return media
  }

  async store({ params, request, auth, response }: HttpContext) {
    const project = await Project.find(params.projectId)

    if (!project || project.userId !== auth.user!.id) {
      return response.unauthorized({ message: 'Accès interdit au projet.' })
    }

    const payload = await request.validateUsing(mediaValidator)

    const media = await project.related('media').create(payload)
    return response.created({ media })
  }

  async destroy({ params, auth, response }: HttpContext) {
    const media = await Media.find(params.id)

    if (!media) {
      return response.notFound({ message: 'Média introuvable.' })
    }

    const project = await media.related('project').query().first()

    if (!project || project.userId !== auth.user!.id) {
      return response.unauthorized({ message: 'Tu ne peux pas supprimer ce média.' })
    }

    await media.delete()
    return response.ok({ message: 'Média supprimé.' })
  }
}
