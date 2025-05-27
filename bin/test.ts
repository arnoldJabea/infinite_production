// bin/test.ts
import { configure, run } from '@japa/runner'
import { apiClient } from '@japa/api-client'
import { assert } from '@japa/assert'
import { adonisjs } from '@japa/plugin-adonisjs'

// important : pointe vers TON fichier ace.ts pour démarrer l’app
import { startAdonis } from './console'

// Charge l’instance AdonisJS pour les tests
const adonis = await startAdonis({
  environment: 'test',
  // tu peux ajouter ici une BDD de test ou un .env.testing
})

configure({
  plugins: [
    assert(),
    apiClient(),
    adonisjs({
      startApp: () => import('./tests/bootstrap.js').then(({ app }) => app),
    }),
  ],
  suites: [
    {
      name: 'functional',
      files: ['tests/functional/**/*.spec.ts'],
      timeout: 60_000,
    },
  ],
})

run()
  .finally(() => adonis.close())
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })