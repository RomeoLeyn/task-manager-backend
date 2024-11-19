const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail(to, subject, emailToken) {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_SENDER_USER,
                pass: process.env.EMAIL_SENDER_PASSWORD
            }
        });

        var mailOptions = {
            from: 'BoardMaster',
            to: to,
            subject: subject,
            html: `
        <h1>Welcome</h1>
        <p>Привіт, Дякуємо за реєстрацію! Щоб мати можливість створити свій перший обліковий запис, натисніть кнопку нижче, щоб підтвердити свою адресу електронної пошти.</p>
        <a href="http://localhost:3000/api/users/verify-email?emailToken=${emailToken}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Підтвердити</a>
        <p>Якщо ви не зареєструвалися, жодних додаткових дій не потрібно, ваша електронна адреса буде автоматично видалена через кілька днів.</p>
        <p>З повагою, BoardMaster</p>
        `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            return error ? console.log(error) : console.log('Email sent: ' + info.response);
        });
    } catch (error) {
        return console.log(error);
    }
}

module.exports = sendEmail;