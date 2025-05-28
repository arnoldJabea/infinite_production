import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddProfessionAndStyleToProfiles extends BaseSchema {
  protected tableName = 'profiles'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('profession').nullable()
      table.string('style').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('profession')
      table.dropColumn('style')
    })
  }
}