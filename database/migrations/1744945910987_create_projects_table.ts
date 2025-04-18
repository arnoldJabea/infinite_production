import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Projects extends BaseSchema {
  protected tableName = 'projects'

  async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')             
      table.string('title').notNullable()    
      table.text('description')              
      table.date('start_date').nullable()    
      table.date('end_date').nullable()      
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')                
      table.timestamps(true)                
    })
  }

  async down () {
    this.schema.dropTable(this.tableName)
  }
}
