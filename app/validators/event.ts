import vine from '@vinejs/vine'

export const eventValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3),
    location: vine.string().trim().optional(),
    date: vine.date()
  })
)
