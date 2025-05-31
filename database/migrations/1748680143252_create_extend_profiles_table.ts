// database/migrations/xxxx_extend_profiles.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ExtendProfiles extends BaseSchema {
  protected tableName = 'profiles'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('phone').nullable()
      table.string('photo_url').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('phone', 'photo_url')
    })
  }
}