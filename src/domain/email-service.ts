import nodemailer from "nodemailer";
import {Router} from "express";


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRES,
        pass: process.env.EMAIL_PASS
    }
});
export const emailService = {
    sendMailRegistration: async (email: string,uuid: string) => {
        const mailOptions = {
            from: process.env.EMAIL_ADDRES,
            to: email,
            subject: 'registration confirm',
            html:`Your link <a>http://localhost:5001/auth/registration-confirmation?code=${uuid}</a>`
        };
        await transporter.sendMail(mailOptions, async (error, info) =>
        {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    }
}
