import type { HttpContext } from '@adonisjs/core/http'

export default class EnsureRoleMiddleware {
  public async handle(
    { auth, response }: HttpContext,
    next: () => Promise<void>,
    roles: string[] = []
  ) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'Authentification requise.' })
    }

    if (!roles.includes(user.role)) {
      return response.forbidden({
        message: `Accès interdit. Rôle requis : ${roles.join(', ')}`,
      })
    }

    await next()
  }
}