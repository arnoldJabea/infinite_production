// config/mail.ts
import { defineConfig, transports } from '@adonisjs/mail'

export default defineConfig({
  default: 'smtp',
  mailers: {
    smtp: transports.smtp({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        type: 'login',
        user: 'xjycacfogrgaw2fr@ethereal.email',
        pass: 'CTBdsqS2tZ2gUuApgP',
      },
    }),
  },
})