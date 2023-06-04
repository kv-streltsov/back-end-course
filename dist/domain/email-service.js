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
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRES,
        pass: process.env.EMAIL_PASS
    }
});
exports.emailService = {
    sendMailRegistration: (email, uuid) => __awaiter(void 0, void 0, void 0, function* () {
        const mailOptions = {
            from: process.env.EMAIL_ADDRES,
            to: email,
            subject: 'registration confirm',
            html: `<h1>Thank for your registration</h1>
                 <p>To finish registration please follow the link below:
                    <a href='http://localhost:5001/auth/registration-confirmation?code=${uuid}'>complete registration</a>
                 </p>`
        };
        yield transporter.sendMail(mailOptions, (error, info) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        }));
    })
};
//# sourceMappingURL=email-service.js.map