import Project from '#models/project'
import User from '#models/user'

export default class ProjectAccessService {
  static async ensureOwner(user: User, projectId: number) {
    const project = await Project.find(projectId)

    if (!project) return null
    if (project.userId !== user.id) throw new Error('FORBIDDEN')

    return project
  }
}