
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddMustUpdatePasswordToUsers extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('must_update_password').defaultTo(true)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('must_update_password')
    })
  }
}