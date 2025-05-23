import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Project from '#models/project'
import Media from '#models/media'
import Event from '#models/event'
import { DateTime } from 'luxon'

export default class AdminDashboardController {
  async stats({ response, auth }: HttpContext) {
    if (auth.user!.role !== 'admin') {
      return response.forbidden({ message: 'Accès réservé aux administrateurs.' })
    }

    const [
      totalUsers,
      totalProjects,
      totalMedia,
      totalEvents,
      roleCounts,
      recentUsers,
      projectsThisMonth,
      mediaThisWeek,
      latestProjects,
    ] = await Promise.all([
      User.query().count('* as total'),
      Project.query().count('* as total'),
      Media.query().count('* as total'),
      Event.query().count('* as total'),
      User.query().select('role').count('* as count').groupBy('role'),
      User.query()
        .where('created_at', '>=', DateTime.now().minus({ days: 30 }).toSQLDate())
        .count('* as total'),
      Project.query()
        .where('created_at', '>=', DateTime.now().startOf('month').toSQLDate())
        .count('* as total'),
      Media.query()
        .where('created_at', '>=', DateTime.now().startOf('week').toSQLDate())
        .count('* as total'),
      Project.query()
        .orderBy('created_at', 'desc')
        .limit(5)
        .preload('user', (query) => query.select(['id', 'email', 'role'])),
    ])

    return {
      totals: {
        users: totalUsers[0].$extras.total,
        projects: totalProjects[0].$extras.total,
        media: totalMedia[0].$extras.total,
        events: totalEvents[0].$extras.total,
      },
      usersByRole: roleCounts.map((r) => ({
        role: r.role,
        count: r.$extras.count,
      })),
      recentUsers: recentUsers[0].$extras.total,
      projectsThisMonth: projectsThisMonth[0].$extras.total,
      mediaThisWeek: mediaThisWeek[0].$extras.total,
      latestProjects: latestProjects.map((p) => ({
        id: p.id,
        title: p.title,
        createdAt: p.createdAt,
        user: {
          email: p.user.email,
          role: p.user.role,
        },
      })),
    }
  }
}