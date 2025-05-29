import vine from '@vinejs/vine'

export const eventFilterValidator = vine.compile(
  vine.object({
    from: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    to: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  })
)