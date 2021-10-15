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

    async sendActivationMail(email, username, password) {
        await this.transporter.sendMail({
            from: `"PET-NETWORK" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'PET-NETWORK - Спасибо за регистрацию!',
            text: '',
            html:
                `
                    <div>
                        <p>Спасибо за регистрацию!</p>
                        <p>Ваши данные для входа:<br>
                        Логин: <b>${username}</b><br>
                        Пароль: <b>${password}</b></p>
                    </div> 
                `
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