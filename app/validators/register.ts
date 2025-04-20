import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().minLength(6),
    role: vine.enum(['artist', 'provider', 'admin'] as const),
  })
)
