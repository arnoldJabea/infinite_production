import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import User from '#models/user'
import { collaboratorValidator } from '#validators/collaborator'

export default class CollaboratorsController {
  async index({ params, auth, response }: HttpContext) {
    const project = await Project.find(params.projectId)

    if (!project) {
      return response.notFound({ message: 'Projet introuvable.' })
    }

    if (project.userId !== auth.user!.id) {
      return response.unauthorized({ message: 'Accès interdit.' })
    }

    const collaborators = await project.related('collaborators')
      .query()
      .pivotColumns(['role'])

    return collaborators
  }

  async store({ params, request, auth, response }: HttpContext) {
    const project = await Project.find(params.projectId)

    if (!project) {
      return response.notFound({ message: 'Projet introuvable.' })
    }

    if (project.userId !== auth.user!.id) {
      return response.unauthorized({ message: 'Accès interdit.' })
    }

    const { userId, role } = await request.validateUsing(collaboratorValidator)

    const user = await User.find(userId)
    if (!user) {
      return response.notFound({ message: 'Utilisateur introuvable.' })
    }

    // Vérifie si déjà collaborateur pour éviter doublon
    const existing = await project.related('collaborators').query().where('id', userId).first()
    if (existing) {
      return response.conflict({ message: 'Utilisateur déjà collaborateur.' })
    }

    await project.related('collaborators').attach({
      [userId]: { role },
    })

    return response.created({ message: 'Collaborateur ajouté avec succès.' })
  }

  async destroy({ params, auth, response }: HttpContext) {
    const project = await Project.find(params.projectId)

    if (!project) {
      return response.notFound({ message: 'Projet introuvable.' })
    }

    if (project.userId !== auth.user!.id) {
      return response.unauthorized({ message: 'Accès interdit.' })
    }

    await project.related('collaborators').detach([params.userId])

    return response.ok({ message: 'Collaborateur supprimé avec succès.' })
  }
}
