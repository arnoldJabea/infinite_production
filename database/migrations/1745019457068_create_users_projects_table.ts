import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UsersProjects extends BaseSchema {
  protected tableName = 'users_projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('project_id')
        .unsigned()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')

      table.enum('role', ['artist', 'provider', 'manager']).notNullable()
      
      table.unique(['user_id', 'project_id'])


      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
