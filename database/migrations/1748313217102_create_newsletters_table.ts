import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'newsletters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('first_name')
      table.string('last_name')
      table.string('email').notNullable().unique()
      table.string('favorite_artist').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}