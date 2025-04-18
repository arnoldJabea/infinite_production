import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddRoleToUsers extends BaseSchema {
  public async up() {
    this.schema.alterTable('users', (table) => {
      table
        .enum('role', ['admin', 'artist', 'provider'])
        .defaultTo('artist')
        .after('password')
    })
  }
  public async down() {
    this.schema.alterTable('users', (table) => {
      table.dropColumn('role')
    })
  }
}
