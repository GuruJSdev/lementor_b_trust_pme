"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
// import { config } from "../../config";
// import { emailOption } from "../../types/email";
const handlebars_1 = __importDefault(require("handlebars"));
const path_1 = __importDefault(require("path"));
/**
 * @author tony mavoungou yavich
 * @version 0.0.1
 */
class Email {
    /**
     *
     * @param {emailOption} option
     */
    static send(option) {
        /**
         * status de l'envoie du mail
         */
        let status = true;
        let transporter = nodemailer_1.default.createTransport({
            port: process.env.STMP_PORT,
            host: process.env.STMP_HOST,
            auth: {
                user: process.env.STMP_AUTH_USER,
                pass: process.env.STMP_AUTH_PASSWORD
            }
        });
        // Ajout du helper des dates
        handlebars_1.default.registerHelper('currentYear', function () {
            return new Date().getFullYear();
        });
        handlebars_1.default.registerHelper('lastYear', function () {
            return Number(new Date().getFullYear()) - 1;
        });
        transporter.use('compile', (0, nodemailer_express_handlebars_1.default)({
            viewEngine: {
                extname: '.handlebars',
                partialsDir: path_1.default.resolve("./app/views/"),
                defaultLayout: false
            },
            viewPath: path_1.default.resolve('./app/views/'),
            extName: ".handlebars"
        }));
        transporter.sendMail(option, function (error, info) {
            if (error) {
                //console.log(error);
                status = false;
                //console.log('Email: ' + error.message);
            }
            else {
                status = true;
                //console.log('Email: ' + info.response);
            }
        });
        return status;
    }
}
exports.Email = Email;
