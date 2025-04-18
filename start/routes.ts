import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router.get('/', async () => {
  return { message: 'API Infinite Production Backend OK' }
})
router.resource('/projects', '#controllers/projects_controller')
  .apiOnly()
  .middleware('*', [middleware.auth()])
router.post('/register', '#controllers/auth_controller.register')
router.post('/login',    '#controllers/auth_controller.login')
router.get('/me', '#controllers/auth_controller.me')
router.get('/users', '#controllers/users_controller.index')
      .middleware([middleware.auth()])


router.group(() => {
  router.post('/profile', '#controllers/profiles_controller.store')
  router.get('/profile', '#controllers/profiles_controller.show')
  router.put('/profile', '#controllers/profiles_controller.update')
}).middleware([middleware.auth()])

router.group(() => {
  router.get('/projects/:projectId/events', '#controllers/events_controller.index')
  router.post('/projects/:projectId/events', '#controllers/events_controller.store')
  router.delete('/events/:id', '#controllers/events_controller.destroy')
}).middleware([middleware.auth()])


      
