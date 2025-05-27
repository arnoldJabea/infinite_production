import type { HttpContext } from '@adonisjs/core/http'
import crypto from 'node:crypto'
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'
import vine from '@vinejs/vine'

export default class ForgotPasswordController {
  async handle({ request, response }: HttpContext) {
    const schema = vine.compile(
      vine.object({
        email: vine.string().email(),
      })
    )

    const { email } = await request.validateUsing(schema)

    const user = await User.findBy('email', email)

    if (user) {
      
      const token = crypto.randomBytes(32).toString('hex')

     
      user.resetToken = token
      await user.save()

      
      const resetUrl = `http://localhost:5173/reset-password/${token}`

      
      await mail.send((message) => {
        message
          .to(user.email)
          .subject('Réinitialisation du mot de passe')
          .html(`
            <p>Bonjour,</p>
            <p>Vous avez demandé une réinitialisation de mot de passe.</p>
            <p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <br />
            <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
          `)
      })
    }

    
    return response.ok({
      message: 'Si un compte existe, un lien de réinitialisation a été envoyé.',
      
    })
  }
}