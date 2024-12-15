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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../config"));
const emailSender = (email, html) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: config_1.default.emailSender.email,
            pass: config_1.default.emailSender.app_pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    const info = yield transporter.sendMail({
        from: '"MartPlex Server" <tonmoytalukder.ai@gmail.com>', // sender address
        replyTo: '"Tonmoy Talukder" <tonmoytalukder2000@gmail.com>',
        to: email, // list of receivers
        subject: 'RESET PASSWORD LINK', // Subject line
        text: 'Reset your password within 10 minutes.', // plain text body
        html, // html body
    });
    console.log('Message sent: %s', info.messageId);
});
exports.default = emailSender;
