// const { x } = require("joi");
const nodemailer = require("nodemailer");
require('dotenv').config();
const { NODEMAILER_USER, NODEMAILER_PASSWORD, SITE_DOMAIN } = process.env;

async function sendVerificationEmail(recipientEmail, token) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'https://esputnik.com/api/v1/message/email',
        // host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: NODEMAILER_USER,
            // pass: NODEMAILER_PASSWORD
            pass: '98EE73DAC4B09A8EB34E33DEBD58F933'
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"hw-06"' + `${NODEMAILER_USER}`, // sender address
        to: recipientEmail,
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<html>
                    <head>
                        <style>
                            .one:hover{color:#887766}
                        </style>
                    </head>
                    <div>
                        <a class="one" href="${SITE_DOMAIN}/auth/verify/${token}">Welcome to our application. You can ferify you email by click this link</a>
                    </div>
        </html>`
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = sendVerificationEmail;
