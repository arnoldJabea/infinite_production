import vine from '@vinejs/vine'

export const newsValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(255),
    content: vine.string().minLength(10),
  })
)