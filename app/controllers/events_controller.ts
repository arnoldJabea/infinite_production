import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import Project from '#models/project'
import { eventValidator } from '#validators/event'
import { DateTime } from 'luxon'

export default class EventsController {
  async index({ params, auth, response }: HttpContext) {
    const project = await Project.find(params.projectId)

    if (!project) {
      return response.notFound({ message: 'Projet introuvable.' })
    }

    if (project.userId !== auth.user!.id) {
      return response.unauthorized({ message: 'Accès interdit à ce projet.' })
    }

    const events = await project.related('events').query().orderBy('date', 'asc')
    return events
  }

  async store({ params, request, auth, response }: HttpContext) {
    const project = await Project.find(params.projectId)

    if (!project) {
      return response.notFound({ message: 'Projet introuvable.' })
    }

    if (project.userId !== auth.user!.id) {
      return response.unauthorized({ message: 'Accès interdit à ce projet.' })
    }

    const payload = await request.validateUsing(eventValidator)

    const event = await project.related('events').create({
      ...payload,
      date: DateTime.fromJSDate(new Date(payload.date))  // Format Luxon
    })

    return response.created({ event })
  }

  async destroy({ params, auth, response }: HttpContext) {
    const event = await Event.find(params.id)

    if (!event) {
      return response.notFound({ message: 'Événement introuvable.' })
    }

    const project = await event.related('project').query().first()
    if (!project || project.userId !== auth.user!.id) {
      return response.unauthorized({ message: 'Tu ne peux pas supprimer cet événement.' })
    }

    await event.delete()
    return response.ok({ message: 'Événement supprimé avec succès.' })
  }
}
