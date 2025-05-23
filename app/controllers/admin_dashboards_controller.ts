import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Project from '#models/project'
import Media from '#models/media'
import Event from '#models/event'

export default class AdminDashboardController {
  async stats({ response, auth }: HttpContext) {
    if (auth.user!.role !== 'admin') {
      return response.forbidden({ message: 'Accès réservé aux administrateurs.' })
    }

    const [users, projects, media, events] = await Promise.all([
      User.query().count('* as total'),
      Project.query().count('* as total'),
      Media.query().count('* as total'),
      Event.query().count('* as total'),
    ])

    const roleCounts = await User.query()
      .select('role')
      .count('* as count')
      .groupBy('role')

    return {
      users: users[0].$extras.total,
      projects: projects[0].$extras.total,
      media: media[0].$extras.total,
      events: events[0].$extras.total,
      usersByRole: roleCounts.map((r) => ({ role: r.role, count: r.$extras.count })),
    }
  }
}