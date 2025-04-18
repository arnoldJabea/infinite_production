import type { HttpContext } from '@adonisjs/core/http'

export default class ProjectsController {
  async index(_ctx: HttpContext) {}
  async store({ request: _request }: HttpContext) {}
  async show(_ctx: HttpContext) {}
  async update(_ctx: HttpContext) {}
  async destroy(_ctx: HttpContext) {}
}
