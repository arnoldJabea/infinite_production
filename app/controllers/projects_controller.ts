import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import { projectValidator } from '#validators/project'
import { DateTime } from 'luxon'

export default class ProjectsController {


  async index({ auth }: HttpContext) {
    const user = auth.user!

    const projects = await Project
      .query()
      .where('userId', user.id)
      .orderBy('createdAt', 'desc')

    return projects
  }


  async store({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(projectValidator)

    const project = await Project.create({
      title: payload.title,
      description: payload.description,
      userId: auth.user!.id,
      startDate: payload.startDate ? DateTime.fromJSDate(payload.startDate) : undefined,
      endDate: payload.endDate ? DateTime.fromJSDate(payload.endDate) : undefined,
    })


    return response.created({ project })
  }



  async show({ params, auth, response }: HttpContext) {
    const project = await Project.find(params.id)

    if (!project || project.userId !== auth.user!.id) {
      return response.unauthorized({ message: "Accès refusé à ce projet." })
    }

    return project
  }

  async update(_ctx: HttpContext) { }
  async destroy(_ctx: HttpContext) { }
}
