import nodemailer from "nodemailer";
import {usersRepository} from "../repositories/users-repository";
import {InterfaceError} from "../dto/Interface-error";


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
    sendMailPasswordRecovery: async (email: string):Promise<boolean | InterfaceError> => {

        const validResult = emailService._validatorEmail(email)
        if(validResult !== true){
            return validResult
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

        try {
            await transporter.sendMail(mailOptions)
            return true;
        }
        catch (e) {
            return { errorsMessages: [{ message: "ERROR MAIL SEND", field: "500" }] }
        }


    },
    _validatorEmail: (email: string): boolean | InterfaceError => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const result = emailRegex.test(email)

        if(!result){
            return { errorsMessages: [{ message: "Invalid value", field: "email" }] }
        }
        return true
    }
}
