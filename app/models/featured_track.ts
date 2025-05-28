import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class FeaturedTrack extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare userId: number

    @column()
    declare title: string

    @column()
    declare audioUrl: string

    @column()
    declare coverImageUrl: string | null

    @column()
    declare description: string | null

    @column()
    declare isVisible: boolean
    @column()
    declare isPublished: boolean

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime


    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>
}