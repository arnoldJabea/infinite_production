import vine from '@vinejs/vine'

export const newsletterValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2),
    lastName: vine.string().trim().minLength(2),
    email: vine.string().email(),
    favoriteArtist: vine.string().optional(),
  })
)