/**
 * Bootstrap Japa + AdonisJS v6
 */
import { configure, ProcessSuite } from '@japa/runner'
import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'

configure({
  // Chaque fichier *.spec.ts est une suite :
  files: ['tests/**/*.spec.ts'],
  plugins: [
    assert(),                       // assertions classiques
    apiClient(),                    // supertest intégré
    pluginAdonisJS(),               // boot/teardown de l’app
  ],
  suites: [
    ProcessSuite({ name: 'functional' }),
  ],
  // On ferme proprement l’app entre les tests
  teardown: async () => {
    await pluginAdonisJS().close()
  },
})