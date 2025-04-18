import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Media extends BaseSchema {
  protected tableName = 'media'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('project_id')
        .unsigned()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')

      table.string('title').notNullable()
      table.enum('type', ['image', 'video', 'audio']).notNullable()
      table.string('url').notNullable()

      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
