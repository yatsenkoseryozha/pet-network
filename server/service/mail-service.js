const nodemailer = require('nodemailer')

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async changePasswordNotification(email) {
        await this.transporter.sendMail({
            from: `"PET-NETWORK" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'PET-NETWORK - Ваш пароль был изменен!',
            text: '',
            html:
                `
                    <div>
                        <p>Ваш пароль был изменен!</p>
                        <p>Если вы не меняли пароль, напишите по адресу <b>byys.development@gmail.com</b></p>
                    </div>
                `
        })
    }
}

module.exports = new MailService()