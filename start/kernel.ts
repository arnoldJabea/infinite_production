/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
| Le fichier kernel HTTP sert à enregistrer les middlewares utilisés
| globalement ou pour les routes nommées.
|
*/

import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'
import ensureOwnerOrAdmin from '#middleware/ensure_owner_or_admin_middleware'

/**
 * Gestionnaire d'erreur global
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * Middlewares globaux (s'exécutent pour chaque requête, même sans route)
 */
server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('#middleware/force_json_response_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
])

/**
 * Middlewares appliqués aux requêtes avec une route définie
 */
router.use([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
])

/**
 * Middlewares nommés, à utiliser avec `middleware.nom()` dans les routes
 */
export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'),
  forceJsonResponse: () => import('#middleware/force_json_response_middleware'),
  containerBindings: () => import('#middleware/container_bindings_middleware'),
  ensureRole: () => import('#middleware/ensure_role_middleware'),
  ensureOwnerOrAdmin: () => import('#middleware/ensure_owner_or_admin_middleware'),
})