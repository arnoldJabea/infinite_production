import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddResetTokenToUsers extends BaseSchema {
  protected tableName = 'users'

  async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('reset_token').nullable().after('password')
    })
  }

  async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('reset_token')
    })
  }
}