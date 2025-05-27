import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddPressKitPathToProfiles extends BaseSchema {
  protected tableName = 'profiles'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('press_kit_path').nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('press_kit_path')
    })
  }
}