import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'

export default class EnsureOwnerOrAdminMiddleware {
  public async handle({ auth, params, response }: HttpContext, next: () => Promise<void>) {
    const projectId = params.id || params.projectId
    const user = auth.user!

    if (!projectId) {
      return response.badRequest({ message: 'ID du projet requis.' })
    }

    const project = await Project.find(projectId)

    if (!project) {
      return response.notFound({ message: 'Projet introuvable.' })
    }

    if (user.role !== 'admin' && project.userId !== user.id) {
      return response.unauthorized({ message: 'Accès non autorisé à ce projet.' })
    }

    await next()
  }
}