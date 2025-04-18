import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import { projectValidator } from '#validators/project'
import { DateTime } from 'luxon'

export default class ProjectsController {
  async index(_ctx: HttpContext) {}

  async store({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(projectValidator)

    const project = await Project.create({
      title: payload.title,
      description: payload.description,
      userId: auth.user!.id,
      startDate: payload.start_date ? DateTime.fromJSDate(payload.start_date) : undefined,
      endDate: payload.end_date ? DateTime.fromJSDate(payload.end_date) : undefined,
    })
    

    return response.created({ project })
  }

  async show(_ctx: HttpContext) {}
  async update(_ctx: HttpContext) {}
  async destroy(_ctx: HttpContext) {}
}
