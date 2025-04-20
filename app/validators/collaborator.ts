import vine from '@vinejs/vine'

export const collaboratorValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(), 
    role: vine.enum(['artist', 'provider', 'manager'] as const),
  })
)
