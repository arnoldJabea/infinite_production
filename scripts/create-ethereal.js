import nodemailer from 'nodemailer'

async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount()

  console.log('✅ Compte Ethereal généré avec succès :')
  console.log('Username:', testAccount.user)
  console.log('Password:', testAccount.pass)
  console.log('🔗 Aperçu des mails envoyés :', testAccount.web)
}

createTestAccount()