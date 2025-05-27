import type { HttpContext } from '@adonisjs/core/http'
import type { BaseModel } from '@adonisjs/lucid/orm'

/**
 * Interface commune pour tous les modèles qui ont un champ userId
 */
interface Ownable {
  userId: number
}

/**
 * Middleware générique basé sur un modèle Lucid à typage fort
 * @param Model - Le modèle Lucid à contrôler (doit avoir userId)
 * @param paramKey - Le nom du paramètre dans `params` contenant l'ID (ex: "id" ou "projectId")
 */
export function ensureOwnerOrAdminGeneric<T extends typeof BaseModel>(
  Model: T,
  paramKey: string = 'id'
) {
  return async ({ auth, params, response }: HttpContext, next: () => Promise<void>) => {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Authentification requise.' })
    }

    const id = params[paramKey]
    if (!id) {
      return response.badRequest({ message: `Identifiant manquant dans le paramètre : ${paramKey}` })
    }

    const instance = await Model.find(id) as (InstanceType<T> & Ownable) | null

    if (!instance) {
      return response.notFound({ message: `${Model.name} introuvable.` })
    }

    if (instance.userId !== user.id && user.role !== 'admin') {
      return response.forbidden({ message: `Accès refusé : vous n'êtes pas propriétaire.` })
    }

    await next()
  }
}