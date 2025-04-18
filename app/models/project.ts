import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import { DateTime } from 'luxon'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { hasMany } from '@adonisjs/lucid/orm'
import Event from '#models/event'
import Media from './media.js'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column.dateTime()
  declare startDate: DateTime

  @column.dateTime()
  declare endDate: DateTime

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @hasMany(() => Media)
  declare media: HasMany<typeof Media>



  @hasMany(() => Event)
  declare events: HasMany<typeof Event>

  @manyToMany(() => User, {
    pivotTable: 'users_projects',
    pivotColumns: ['role'],
  })
  declare collaborators: ManyToMany<typeof User>
  


  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
