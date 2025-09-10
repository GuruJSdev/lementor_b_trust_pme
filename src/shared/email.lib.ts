import 'dotenv/config';
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars"
// import { config } from "../../config";
// import { emailOption } from "../../types/email";
import Handlebars from 'handlebars';
import path from "path"



/**
 * @author tony mavoungou yavich
 * @version 0.0.1
 */
export class Email{

    /**
     * 
     * @param {emailOption} option 
     */
    static  send(option:any):boolean  {

        /**
         * status de l'envoie du mail
         */
        let status:boolean =true;

        let transporter = nodemailer.createTransport({
            port:process.env.STMP_PORT,
            host:process.env.STMP_HOST,
            auth: {
              user:process.env.STMP_AUTH_USER,
              pass: process.env.STMP_AUTH_PASSWORD
            }
          });
        
        // Ajout du helper des dates
        Handlebars.registerHelper('currentYear', function () {
          return new Date().getFullYear();
        });

        Handlebars.registerHelper('lastYear', function () {
          return Number(new Date().getFullYear())-1;
        });

          transporter.use('compile',hbs({
              viewEngine:{
                extname:'.handlebars',
                partialsDir:path.resolve("./app/views/"),
                defaultLayout:false
              },
              viewPath:path.resolve('./app/views/'),
              extName:".handlebars"
          }));

        transporter.sendMail(option, function (error, info) {
            if (error) {
              //console.log(error);
              status=false
              //console.log('Email: ' + error.message);
            } else {
                status=true
              //console.log('Email: ' + info.response);
            }
        });

        return  status;

    }
}
