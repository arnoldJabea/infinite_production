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
router.get('/me',        '#controllers/auth_controller.me')
      
