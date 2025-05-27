import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { ensureOwnerOrAdminGeneric } from '#middleware/ensure_owner_or_admin_for'
import Project from '#models/project'
import Media from '#models/media'
import Event from '#models/event'

// 🟢 Public
router.get('/', async () => {
  return { message: 'API Infinite Production Backend OK' }
})

router.post('/register', '#controllers/auth_controller.register')
router.post('/login', '#controllers/auth_controller.login')

router.post('/forgot-password', '#controllers/forgot_password_controller.handle')
router.post('/reset-password', '#controllers/reset_password_controller.handle')

// 🔐 Authenticated routes
router.group(() => {
  router.get('/me', '#controllers/auth_controller.me')
}).middleware([middleware.auth()])

// 🔐 User management (optionnel - à activer si nécessaire)
router.group(() => {
  router.get('/users', '#controllers/users_controller.index')
}).middleware([middleware.auth()])

// 🔐 Profile routes
router.group(() => {
  router.post('/profile', '#controllers/profiles_controller.store')
  router.get('/profile', '#controllers/profiles_controller.show')
  router.put('/profile', '#controllers/profiles_controller.update')
  router.post('/profile/presskit', '#controllers/profiles_controller.uploadPressKit')
  router.get('/profile/presskit-url', '#controllers/profiles_controller.pressKitUrl')
}).middleware([middleware.auth()])

// 🔐 Projects CRUD
router.resource('/projects', '#controllers/projects_controller')
  .apiOnly()
  .middleware({
    '*': [middleware.auth()],
    update: [ensureOwnerOrAdminGeneric(Project)],
    destroy: [ensureOwnerOrAdminGeneric(Project)],
  })

// 🔐 Events
router.group(() => {
  router.get('/projects/:projectId/events', '#controllers/events_controller.index')
  router.post('/projects/:projectId/events', '#controllers/events_controller.store')
  router.delete('/events/:id', '#controllers/events_controller.destroy').middleware([
    ensureOwnerOrAdminGeneric(Event),
  ])
}).middleware([middleware.auth()])

// 🔐 Media
router.group(() => {
  router.get('/projects/:projectId/media', '#controllers/media_controller.index')
  router.post('/projects/:projectId/media', '#controllers/media_controller.store')
  router.delete('/projects/:projectId/media/:id', '#controllers/media_controller.destroy').middleware([
    ensureOwnerOrAdminGeneric(Media),
  ])
}).middleware([middleware.auth()])

// 🔐 Collaborators
router.group(() => {
  router.get('/projects/:projectId/collaborators', '#controllers/collaborators_controller.index')
  router.post('/projects/:projectId/collaborators', '#controllers/collaborators_controller.store')
  router.delete('/projects/:projectId/collaborators/:userId', '#controllers/collaborators_controller.destroy')
}).middleware([middleware.auth()])

// 🔐 Admin dashboard
router.group(() => {
  router.get('/admin/stats', '#controllers/admin_dashboard_controller.stats')
  router.get('/admin/stats/users-per-month', '#controllers/admin_dashboard_controller.usersPerMonth')
  router.get('/admin/stats/users-by-role', '#controllers/admin_dashboard_controller.usersByRole')
  router.get('/admin/stats/projects-per-month', '#controllers/admin_dashboard_controller.projectsPerMonth')
}).middleware([
  middleware.auth(),
  middleware.ensureRole(['admin'])
])