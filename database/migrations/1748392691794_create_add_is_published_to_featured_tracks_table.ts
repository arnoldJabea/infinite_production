import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddIsPublishedToFeaturedTracks extends BaseSchema {
  public async up () {
    this.schema.alterTable('featured_tracks', (table) => {
      table.boolean('is_published').defaultTo(false)
    })
  }

  public async down () {
    this.schema.alterTable('featured_tracks', (table) => {
      table.dropColumn('is_published')
    })
  }
}