import User from '#models/user'
import { cuid } from '@adonisjs/core/helpers'
import Mail from '@adonisjs/mail/services/main'

export default class PasswordResetService {
    static async sendResetLink(email: string) {
        const user = await User.findBy('email', email)

        if (!user) {

            return
        }

        const resetToken = cuid()
        user.resetToken = resetToken
        await user.save()

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        const resetLink = `${frontendUrl}/reset-password/${resetToken}`

        await Mail.send((message) => {
            message
                .to(user.email)
                .from('no-reply@infinite-productions.local')
                .subject('Réinitialisation de ton mot de passe')
                .html(`
      <p>Bonjour ${user.email},</p>
      <p>Tu as demandé une réinitialisation de ton mot de passe.</p>
      <p>Clique sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Si tu n'as pas fait cette demande, ignore ce message.</p>
    `)
        })

        return resetLink
    }
}