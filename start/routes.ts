import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// 🟢 Public
router.get('/', async () => {
  return { message: 'API Infinite Production Backend OK' }
})

router.post('/register', '#controllers/auth_controller.register')
router.post('/login', '#controllers/auth_controller.login')

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
}).middleware([middleware.auth()])

// 🔐 Projects CRUD
router.resource('/projects', '#controllers/projects_controller')
  .apiOnly()
  .middleware('*', [middleware.auth()])

// 🔐 Events
router.group(() => {
  router.get('/projects/:projectId/events', '#controllers/events_controller.index')
  router.post('/projects/:projectId/events', '#controllers/events_controller.store')
  router.delete('/events/:id', '#controllers/events_controller.destroy')
}).middleware([middleware.auth()])

// 🔐 Media
router.group(() => {
  router.get('/projects/:projectId/media', '#controllers/media_controller.index')
  router.post('/projects/:projectId/media', '#controllers/media_controller.store')
  router.delete('/projects/:projectId/media/:id', '#controllers/media_controller.destroy') 
}).middleware([middleware.auth()])

// 🔐 Collaborators
router.group(() => {
  router.get('/projects/:projectId/collaborators', '#controllers/collaborators_controller.index')
  router.post('/projects/:projectId/collaborators', '#controllers/collaborators_controller.store')
  router.delete('/projects/:projectId/collaborators/:userId', '#controllers/collaborators_controller.destroy')
}).middleware([middleware.auth()])
