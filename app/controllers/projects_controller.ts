import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import { projectValidator } from '#validators/project'
import { DateTime } from 'luxon'
import ProjectAccessService from '#services/project_access_service'

export default class ProjectsController {
  async index({ auth }: HttpContext) {
    const projects = await Project
      .query()
      .where('userId', auth.user!.id)
      .orderBy('createdAt', 'desc')
      .preload('events')
      .preload('media')

    return projects
  }

  async store({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(projectValidator)

    if (
      payload.startDate &&
      payload.endDate &&
      payload.startDate > payload.endDate
    ) {
      return response.badRequest({
        message: 'La date de fin ne peut pas être antérieure à la date de début.',
      })
    }
    console.log('auth.user =', auth.user)

    const project = await Project.create({
      title: payload.title,
      description: payload.description,
      userId: auth.user!.id,
      startDate: payload.startDate
        ? (typeof payload.startDate === 'string'
          ? DateTime.fromISO(payload.startDate)
          : DateTime.fromJSDate(payload.startDate))
        : undefined,
      endDate: payload.endDate
        ? (typeof payload.endDate === 'string'
          ? DateTime.fromISO(payload.endDate)
          : DateTime.fromJSDate(payload.endDate))
        : undefined
    })
   

    return response.created({ project })
    
  }

  async show({ params, auth, response }: HttpContext) {
    try {
      const project = await ProjectAccessService.ensureOwner(auth.user!, params.id)
      if (!project) {
        return response.notFound({ message: 'Projet introuvable.' })
      }
      return project
    } catch (error) {
      if (error.message === 'FORBIDDEN') {
        return response.forbidden({ message: 'Tu n’as pas accès à ce projet.' })
      }
      throw error
    }
  }

  async update({ params, auth, request, response }: HttpContext) {
    try {
      const project = await ProjectAccessService.ensureOwner(auth.user!, params.id)
      if (!project) {
        return response.notFound({ message: 'Projet introuvable.' })
      }

      const data = await request.validateUsing(projectValidator)

      if (
        data.startDate &&
        data.endDate &&
        data.startDate > data.endDate
      ) {
        return response.badRequest({
          message: 'La date de fin ne peut pas être antérieure à la date de début.',
        })
      }

      project.merge({
        ...data,
        startDate: data.startDate
          ? (typeof data.startDate === 'string'
            ? DateTime.fromISO(data.startDate)
            : DateTime.fromJSDate(data.startDate))
          : undefined,
        endDate: data.endDate
          ? (typeof data.endDate === 'string'
            ? DateTime.fromISO(data.endDate)
            : DateTime.fromJSDate(data.endDate))
          : undefined,
      })

      await project.save()

      return project
    } catch (error) {
      if (error.message === 'FORBIDDEN') {
        return response.forbidden({ message: 'Tu n’as pas le droit de modifier ce projet.' })
      }
      throw error
    }
  }

  async destroy({ params, auth, response }: HttpContext) {
    try {
      const project = await ProjectAccessService.ensureOwner(auth.user!, params.id)
      if (!project) {
        return response.notFound({ message: 'Projet introuvable.' })
      }

      await project.delete()

      return response.ok({ message: 'Projet supprimé avec succès.' })
    } catch (error) {
      if (error.message === 'FORBIDDEN') {
        return response.forbidden({ message: 'Tu n’as pas le droit de supprimer ce projet.' })
      }
      throw error
    }
  }
}