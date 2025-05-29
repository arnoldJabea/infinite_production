import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Project from '#models/project'
import Media from '#models/media'
import Event from '#models/event'
import { DateTime } from 'luxon'

export default class AdminDashboardController {
    async stats({ response, auth, request }: HttpContext) {
        if (auth.user!.role !== 'admin') {
            return response.forbidden({ message: 'Accès réservé aux administrateurs.' })
        }

        const { role, keyword, startDate, endDate, page = 1 } = request.qs()

        const start = startDate ? DateTime.fromISO(startDate) : DateTime.now().minus({ months: 1 })
        const end = endDate ? DateTime.fromISO(endDate) : DateTime.now()

        const userQuery = User.query().whereBetween('created_at', [
            start.toSQLDate() ?? '',
            end.toSQLDate() ?? ''
        ])
        if (role) userQuery.andWhere('role', role)
        if (keyword) {
            userQuery.andWhere((query) => {
                query
                    .whereILike('email', `%${keyword}%`)
                    .orWhereILike('full_name', `%${keyword}%`)
            })
        }
        const totalUsers = await userQuery.clone().count('* as total')
        const roleCounts = await userQuery.clone().select('role').count('* as count').groupBy('role')
        const recentUsers = await userQuery.clone().count('* as total')

        const projectQuery = Project.query().whereBetween('created_at', [
            start.toSQLDate() ?? '',
            end.toSQLDate() ?? ''
        ])
        if (keyword) {
            projectQuery.andWhereILike('title', `%${keyword}%`)
        }
        const totalProjects = await projectQuery.clone().count('* as total')
        const paginatedProjects = await projectQuery
            .clone()
            .orderBy('created_at', 'desc')
            .preload('user', (query) => query.select(['id', 'email', 'role']))
            .paginate(Number(page), 5)
        paginatedProjects.baseUrl('/admin/stats')

        const [totalMedia, totalEvents, projectsThisMonth, mediaThisWeek] = await Promise.all([
            Media.query().count('* as total'),
            Event.query().count('* as total'),
            Project.query()
                .where('created_at', '>=', DateTime.now().startOf('month').toSQLDate())
                .count('* as total'),
            Media.query()
                .where('created_at', '>=', DateTime.now().startOf('week').toSQLDate())
                .count('* as total')
        ])

        return {
            filters: { role, keyword, startDate, endDate, page },
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
            latestProjects: paginatedProjects.toJSON(),
        }
    }
    async usersPerMonth({ response }: HttpContext) {
        const now = DateTime.now()
        const months = Array.from({ length: 6 }, (_, i) => now.minus({ months: i }).startOf('month'))

        const data = await Promise.all(months.map(async (month) => {
            const count = await User.query()
                .where('created_at', '>=', month.toISODate())
                .where('created_at', '<', month.plus({ months: 1 }).toISODate())
                .count('* as total')

            return {
                month: month.toFormat('yyyy-MM'),
                total: Number(count[0].$extras.total),
            }
        }))

        return response.ok(data.reverse())
    }
    async usersByRole({ response }: HttpContext) {
        const roles = await User.query()
            .select('role')
            .count('* as total')
            .groupBy('role')

        return response.ok(
            roles.map((r) => ({
                role: r.role,
                total: Number(r.$extras.total),
            }))
        )
    }
    async projectsPerMonth({ response }: HttpContext) {
        const now = DateTime.now()
        const months = Array.from({ length: 6 }, (_, i) => now.minus({ months: i }).startOf('month'))

        const data = await Promise.all(months.map(async (month) => {
            const count = await Project.query()
                .where('created_at', '>=', month.toISODate())
                .where('created_at', '<', month.plus({ months: 1 }).toISODate())
                .count('* as total')

            return {
                month: month.toFormat('yyyy-MM'),
                total: Number(count[0].$extras.total),
            }
        }))

        return response.ok(data.reverse())
    }

  

public async eventsInRange({ request, response }: HttpContext) {
  const from = request.input('from')
  const to = request.input('to')
  const artistId = request.input('artistId')

  const eventQuery = Event.query()
    .preload('project', (projectQuery) => {
      projectQuery.preload('user')
    })
    .orderBy('date', 'asc')

  if (from) {
    const fromDate = DateTime.fromISO(from).toISODate()
    if (fromDate) {
      eventQuery.where('date', '>=', fromDate)
    }
  }

  if (to) {
    const toDate = DateTime.fromISO(to).toISODate()
    if (toDate) {
      eventQuery.where('date', '<=', toDate)
    }
  }

  if (artistId) {
    eventQuery.whereHas('project', (q) => {
      q.where('user_id', artistId)
    })
  }

  const events = await eventQuery

  // Regrouper par projet
  const grouped = events.reduce((acc, event) => {
    const projectId = event.project.id

    if (!acc[projectId]) {
      acc[projectId] = {
        project: {
          id: event.project.id,
          title: event.project.title,
          user: {
            id: event.project.user.id,
            email: event.project.user.email,
            fullName: event.project.user.fullName,
          },
        },
        events: [],
      }
    }

    acc[projectId].events.push({
      id: event.id,
      title: event.title,
      location: event.location,
      date: event.date,
    })

    return acc
  }, {} as Record<number, any>)

  return response.ok({
    from,
    to,
    artistId,
    totalProjects: Object.keys(grouped).length,
    groupedEvents: Object.values(grouped),
  })
}


}