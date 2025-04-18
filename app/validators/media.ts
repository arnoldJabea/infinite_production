import vine from '@vinejs/vine'

export const mediaValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(2),
    type: vine.enum(['image', 'video', 'audio'] as const),
    url: vine.string().url()
  })
)
