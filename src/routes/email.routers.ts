import nodemailer from "nodemailer";
import {Router} from "express";

export const emailRouters = Router({})

emailRouters.post('/',async (req, res) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'clampbeer@gmail.com',
            pass: 'essydfnwanivnavo'
        }
    });
    const mailOptions = {
        from: 'clampbeer@google.com',
        to: 'kv.streltsov@yandex.ru',
        subject: 'Subject',
        text: 'Email content'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });

    // console.log(123)
    // const transporter = nodemailer.createTransport({
    //     service: 'google',
    //     auth: {
    //         user: "clampbeer@google.com", // generated ethereal user
    //         pass: "rqtnwkfsjwivehkl" // generated ethereal password
    //     }
    // });
    //
    // const mail = await transporter.sendMail({
    //     from: '"🌏 world" <clampbeer@gmail.com>', // sender address
    //     to: "kv.streltsov@yandex.ru", // list of receivers
    //     subject: "Hello", // Subject line
    //     html: "<b>Hello World</b>", // html body
    // });
    // console.log(mail)

})