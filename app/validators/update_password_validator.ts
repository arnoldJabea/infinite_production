// start/validators/update_password.ts
import vine from '@vinejs/vine'

export const updatePasswordValidator = vine.compile(
  vine.object({
    oldPassword: vine.string(),
    newPassword: vine
      .string()
      .minLength(8)
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/) // min. 1 lettre et 1 chiffre
  })
)