import nodemailer, { Transporter } from "nodemailer";
import dotenv from 'dotenv';
import { ITemplateHTML } from "../templates/mail.interface.js";

dotenv.config();

export default new class MailService {

    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT as unknown as number,
            secure: false,
            auth: {
              user: process.env.SMTP_USER, 
              pass: process.env.SMTP_PASSWORD, 
            },
        });
    }
    
    async sendActivationMail(to: string, template: ITemplateHTML) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: template.subject,
            text: '',
            html: template.html,
        });
    }
}