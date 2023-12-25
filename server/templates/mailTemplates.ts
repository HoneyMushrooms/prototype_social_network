import { ITemplateHTML } from "./mail.interface.js";

export default class MailTemplate {
    
    static registerHTML(link: string): ITemplateHTML {
        return {
            subject: 'Aктивация аккаунта на сайте CherryConnect',
            html: `
                <div>
                    <p style="font-size: medium;">
                        Для подтверждения адреса почтового ящика перейдите по <a href="${link}">ссылке</a>.
                    <p>
                </div>`
        };
    }

    static resetHTML(link: string): ITemplateHTML {
        return {
            subject: 'Сброс пароля на сайте CherryConnect',
            html:  `
                <div>
                    <p style="font-size: medium;">
                        Для сброса пороля перейдите по <a href="${link}">ссылке</a>.
                        Если вы не запрашивали сброс пароля, для вашей безопасности смените текущий пароль.
                    <p>
                </div>`
        };
    }
}