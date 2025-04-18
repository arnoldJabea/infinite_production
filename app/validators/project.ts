import vine from '@vinejs/vine'

export const projectValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3),
    description: vine.string().trim().optional(),
    startDate: vine.date().optional(),
    endDate: vine.date().optional(),
  })
)
