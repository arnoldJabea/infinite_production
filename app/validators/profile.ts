import vine from '@vinejs/vine'

export const profileValidator = vine.compile(
  vine.object({
    bio: vine.string().trim().optional(),
    website: vine.string().url().optional(),
    socials: vine.record(vine.string()).optional()
  })
)
