import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { ensureOwnerOrAdminGeneric } from '#middleware/ensure_owner_or_admin_for'

import Project from '#models/project'
import Media from '#models/media'
import Event from '#models/event'
import News from '#models/news'
import FeaturedTrack from '#models/featured_track'
import YouTubeVideo from '#models/youtube_video'
import Achievement from '#models/achievement'

// 🟢 Routes publiques
router.get('/', async () => {
  return { message: 'API Infinite Production Backend OK' }
})

router.post('/login', '#controllers/auth_controller.login')
router.post('/forgot-password', '#controllers/forgot_password_controller.handle')
router.post('/reset-password', '#controllers/reset_password_controller.handle')
router.post('/contact', '#controllers/contacts_controller.store')
router.get('/events', '#controllers/events_controller.listPublic')
router.get('/youtube', '#controllers/youtube_videos_controller.index')
router.get('/youtube/:id', '#controllers/youtube_videos_controller.show')
router.get('/achievements', '#controllers/achievements_controller.index')
router.get('/profiles/:id/events', '#controllers/events_controller.listByProfile')

// 🔐 Auth & compte
router
  .post('/register', '#controllers/auth_controller.register')
  .middleware([middleware.auth(), middleware.ensureRole(['admin'])])

router
  .put('/update-password', '#controllers/auth_controller.updatePassword')
  .middleware([middleware.auth()])

router.get('/me', '#controllers/auth_controller.me').middleware([middleware.auth()])

// 🔐 Users (optionnel)
router.get('/users', '#controllers/users_controller.index').middleware([middleware.auth()])

// 🔐 Profils
router.group(() => {
  router.post('/profile', '#controllers/profiles_controller.store')
  router.get('/profile', '#controllers/profiles_controller.show')
  router.put('/profile', '#controllers/profiles_controller.update')
  router.post('/profile/presskit', '#controllers/profiles_controller.uploadPressKit')
  router.get('/profile/presskit-url', '#controllers/profiles_controller.pressKitUrl')
}).middleware([middleware.auth()])

router.get('/profiles/search', '#controllers/profiles_controller.search')

// 🔐 Projets
router
  .resource('/projects', '#controllers/projects_controller')
  .apiOnly()
  .middleware('*', [middleware.auth(), middleware.ensureProfileExists()])
  .middleware('update', [ensureOwnerOrAdminGeneric(Project)])
  .middleware('destroy', [ensureOwnerOrAdminGeneric(Project)])

// 🔐 Événements (projets)
router.group(() => {
  router.get('/projects/:projectId/events', '#controllers/events_controller.index')
  router.post('/projects/:projectId/events', '#controllers/events_controller.store')
  router.delete('/events/:id', '#controllers/events_controller.destroy')
    .middleware([ensureOwnerOrAdminGeneric(Event)])
}).middleware([middleware.auth(), middleware.ensureProfileExists()])

// 🔐 Médias (projets)
router.group(() => {
  router.get('/projects/:projectId/media', '#controllers/media_controller.index')
  router.post('/projects/:projectId/media', '#controllers/media_controller.store')
  router.delete('/projects/:projectId/media/:id', '#controllers/media_controller.destroy')
    .middleware([ensureOwnerOrAdminGeneric(Media)])
}).middleware([middleware.auth(), middleware.ensureProfileExists()])

// 🔐 Collaborateurs
router.group(() => {
  router.get('/projects/:projectId/collaborators', '#controllers/collaborators_controller.index')
  router.post('/projects/:projectId/collaborators', '#controllers/collaborators_controller.store')
  router.delete('/projects/:projectId/collaborators/:userId', '#controllers/collaborators_controller.destroy')
}).middleware([middleware.auth(), middleware.ensureProfileExists()])

// 🔐 Morceaux en vedette
router.group(() => {
  router.post('/featured-tracks', '#controllers/featured_tracks_controller.store')
  router.get('/featured-tracks', '#controllers/featured_tracks_controller.index')
  router.get('/me/featured-tracks', '#controllers/featured_tracks_controller.mine')
  router.put('/featured-tracks/:id', '#controllers/featured_tracks_controller.update')
    .middleware([ensureOwnerOrAdminGeneric(FeaturedTrack)])
  router.delete('/featured-tracks/:id', '#controllers/featured_tracks_controller.destroy')
    .middleware([ensureOwnerOrAdminGeneric(FeaturedTrack)])
}).middleware([middleware.auth(), middleware.ensureProfileExists()])

// 🔐 YouTube vidéos
router.group(() => {
  router.post('/youtube-videos', '#controllers/youtube_videos_controller.store')
  router.get('/youtube-videos', '#controllers/youtube_videos_controller.index')
  router.put('/youtube-videos/:id', '#controllers/youtube_videos_controller.update')
    .middleware([ensureOwnerOrAdminGeneric(YouTubeVideo)])
  router.delete('/youtube-videos/:id', '#controllers/youtube_videos_controller.destroy')
    .middleware([ensureOwnerOrAdminGeneric(YouTubeVideo)])
}).middleware([middleware.auth(), middleware.ensureProfileExists()])

// 🔐 Réalisations (achievements)
router.group(() => {
  router.post('/achievements', '#controllers/achievements_controller.store')
  router.get('/me/achievements', '#controllers/achievements_controller.mine')
  router.put('/achievements/:id', '#controllers/achievements_controller.update')
    .middleware([ensureOwnerOrAdminGeneric(Achievement)])
  router.delete('/achievements/:id', '#controllers/achievements_controller.destroy')
    .middleware([ensureOwnerOrAdminGeneric(Achievement)])
}).middleware([middleware.auth(), middleware.ensureProfileExists()])

// 🔐 Admin dashboard
router.group(() => {
  router.get('/admin/stats', '#controllers/admin_dashboard_controller.stats')
  router.get('/admin/stats/users-per-month', '#controllers/admin_dashboard_controller.usersPerMonth')
  router.get('/admin/stats/users-by-role', '#controllers/admin_dashboard_controller.usersByRole')
  router.get('/admin/stats/projects-per-month', '#controllers/admin_dashboard_controller.projectsPerMonth')
  router.get('/admin/stats/events-in-range', '#controllers/admin_dashboard_controller.eventsInRange')
}).middleware([middleware.auth(), middleware.ensureRole(['admin'])])

// 🔐 Newsletter
router.post('/newsletter', '#controllers/newsletter_controller.subscribe')
router.get('/admin/newsletters', '#controllers/newsletter_controller.index')
  .middleware([middleware.auth(), middleware.ensureRole(['admin'])])

// 🔐 Actualités (news)
router.group(() => {
  router.get('/news', '#controllers/news_controller.index')
  router.post('/news', '#controllers/news_controller.store')
}).middleware([middleware.auth()])

router
  .put('/news/:id', '#controllers/news_controller.update')
  .middleware([middleware.auth(), ensureOwnerOrAdminGeneric(News)])

router
  .delete('/news/:id', '#controllers/news_controller.destroy')
  .middleware([middleware.auth(), ensureOwnerOrAdminGeneric(News)])

router.post('/profile/photo', '#controllers/profiles_controller.uploadPhoto')
  .middleware([middleware.auth()])