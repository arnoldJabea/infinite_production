import { BaseSchema } from '@adonisjs/lucid/schema'

export default class News extends BaseSchema {
  protected tableName = 'news'

  async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('content').notNullable()
      table.string('cover_image').nullable()
      table.timestamp('published_at', { useTz: true }).nullable()

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down () {
    this.schema.dropTable(this.tableName)
  }
}