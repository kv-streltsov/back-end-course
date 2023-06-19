import nodemailer from "nodemailer";
import {usersRepository} from "../repositories/users-repository";


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRES,
        pass: process.env.EMAIL_PASS
    }
});

export const emailService = {
    sendMailRegistration: async (email: string, uuid: string) => {
        const mailOptions = {
            from: process.env.EMAIL_ADDRES,
            to: email,
            subject: 'registration confirm',
            html:
                `<h1>Thank for your registration</h1>
                 <p>To finish registration please follow the link below:
                    <a href='http://localhost:5001/auth/registration-confirmation?code=${uuid}'>complete registration</a>
                 </p>`
        };
        return transporter.sendMail(mailOptions);

    },
    sendMailPasswordRecovery: async (email: string) => {
        if(!emailService._validatorEmail(email)){
            return false
        }
        const passwordRecovery: number = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

        await usersRepository.updateRecoveryCode(email,passwordRecovery)

        const mailOptions = {
            from: process.env.EMAIL_ADDRES,
            to: email,
            subject: 'Password recovery',
            html:
                ` <h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://localhost:5001/password-recovery?recoveryCode=${passwordRecovery}'>Password recovery</a>
      </p>
    `
        };
        return transporter.sendMail(mailOptions);

    },
    _validatorEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email)
    }
}
