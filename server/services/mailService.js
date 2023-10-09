import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

export default new class MailService {
    
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
              user: process.env.SMTP_USER, 
              pass: process.env.SMTP_PASSWORD, 
            },
        });
    }
    
    async sendActivationMail(to, template) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: template.subject,
            text: '',
            html: template.html,
        });
    }
}