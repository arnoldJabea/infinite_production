import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare bio: string

  @column()
  declare website: string 

  @column()
  declare socials: Record<string, string> | null

  @column()
  declare profession: string | null

  @column()
  declare style: string | null

  @column({ columnName: 'press_kit_path' })
  declare pressKitPath: string | null

  @column()
  declare phone: string

  @column()
  declare photoUrl: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}