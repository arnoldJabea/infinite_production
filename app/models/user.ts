import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { hasMany } from '@adonisjs/lucid/orm'
import Project from '#models/project'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { hasOne } from '@adonisjs/lucid/orm'
import Profile from '#models/profile'
import type { HasOne } from '@adonisjs/lucid/types/relations'
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string
  @column()
  declare role: 'artist' | 'provider' | 'admin'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>

  @hasMany(() => Project)
  declare projects: HasMany<typeof Project>

  @manyToMany(() => Project, {
    pivotTable: 'users_projects',
    pivotColumns: ['role'],
  })
  

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}

function manyToMany(_arg0: () => typeof Project, _arg1: { pivotTable: string; pivotColumns: string[] }): (target: User, propertyKey: "updatedAt") => void {
  throw new Error('Function not implemented.')
}
