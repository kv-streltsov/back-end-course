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
const users_repository_1 = require("../repositories/users-repository");
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRES,
        pass: process.env.EMAIL_PASS
    }
});
class emailServiceClass {
    constructor() {
        this.usersRepository = new users_repository_1.UsersRepositoryClass();
    }
    sendMailRegistration(email, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: process.env.EMAIL_ADDRES,
                to: email,
                subject: 'registration confirm',
                html: `<h1>Thank for your registration</h1>
                 <p>To finish registration please follow the link below:
                    <a href='http://localhost:5001/auth/registration-confirmation?code=${uuid}'>complete registration</a>
                 </p>`
            };
            return transporter.sendMail(mailOptions);
        });
    }
    sendMailPasswordRecovery(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const validResult = exports.emailService._validatorEmail(email);
            if (validResult !== true) {
                return validResult;
            }
            const passwordRecovery = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            yield this.usersRepository.updateRecoveryCode(email, passwordRecovery);
            const mailOptions = {
                from: process.env.EMAIL_ADDRES,
                to: email,
                subject: 'Password recovery',
                html: ` <h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://localhost:5001/password-recovery?recoveryCode=${passwordRecovery}'>Password recovery</a>
      </p>
    `
            };
            try {
                yield transporter.sendMail(mailOptions);
                return true;
            }
            catch (e) {
                return { errorsMessages: [{ message: "ERROR MAIL SEND", field: "500" }] };
            }
        });
    }
    _validatorEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const result = emailRegex.test(email);
        if (!result) {
            return { errorsMessages: [{ message: "Invalid value", field: "email" }] };
        }
        return true;
    }
}
exports.emailService = new emailServiceClass();
//# sourceMappingURL=email-service.js.map