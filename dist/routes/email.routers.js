"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRouters = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const express_1 = require("express");
exports.emailRouters = (0, express_1.Router)({});
exports.emailRouters.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: ''
        }
    });
    const mailOptions = {
        from: 'clampbeer@google.com',
        to: 'kv.streltsov@yandex.ru',
        subject: 'Subject',
        text: 'Email content'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
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
}));
//# sourceMappingURL=email.routers.js.map