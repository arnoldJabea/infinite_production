import vine from '@vinejs/vine'

export const profileValidator = vine.compile(
  vine.object({
    bio: vine.string().trim().optional(),                          
    website: vine.string().url().optional(),                       
    socials: vine.record(vine.string()).optional(),
    profession: vine.string().maxLength(100).optional(),
    style: vine.string().maxLength(100).optional(),
  })
)
