import { BaseSchema } from '@adonisjs/lucid/schema'

export default class FeaturedTracks extends BaseSchema {
  protected tableName = 'featured_tracks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('title').notNullable()
      table.string('audio_url').notNullable()
      table.string('cover_image_url').nullable()
      table.text('description').nullable()
      table.boolean('is_visible').defaultTo(true)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}