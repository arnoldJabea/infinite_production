// start/validators/contact_validator.ts
import { schema, rules } from '@adonisjs/validator'

export class ContactValidator {
  constructor(protected ctx: any) {}

  public schema = schema.create({
    fullName: schema.string([rules.minLength(2), rules.maxLength(100)]),
    email: schema.string([rules.email()]),
    subject: schema.string([rules.minLength(3), rules.maxLength(200)]),
    message: schema.string([rules.minLength(10), rules.maxLength(2000)]),
  })
}