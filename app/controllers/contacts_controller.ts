    
import type { HttpContext } from '@adonisjs/core/http'
import { ContactValidator } from '#validators/contact'
import mail from '@adonisjs/mail/services/main'

export default class ContactController {
  async store({ request, response }: HttpContext) {
    const payload = await request.validate(ContactValidator)

    await mail.send((message) => {
      message
        .from('jabeajordan11@gmail.com')            // expéditeur (email de l'utilisateur)
        .to('aroljabea71@gmail.com')                // destinataire (email de l'utilisateur)
        .subject(`Message de contact: ${payload.subject}`)
        .html(`
          <h2>💬 Nouveau message de contact</h2>
          <p><strong>👤 Nom :</strong> ${payload.fullName}</p>
          <p><strong>📧 Email :</strong> ${payload.email}</p>
          <p><strong>📝 Sujet :</strong> ${payload.subject}</p>
          <p><strong>✉️ Message :</strong><br/>${payload.message}</p>
        `)
    })

    return response.ok({
      message: 'Message envoyé avec succès.',
    })
  }
}