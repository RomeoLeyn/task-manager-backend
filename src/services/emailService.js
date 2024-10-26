const nodemailer = require('nodemailer');

async function sendEmail(to, subject, emailToken) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'romaonlain1@gmail.com',
            pass: 'lpta qnog hjlg ykor'
        }
    });

    var mailOptions = {
        from: 'BoardMaster',
        to: to,
        subject: subject,
        html: `
    <h1>Welcome</h1>
    <p>Привіт, Дякуємо за реєстрацію! Щоб мати можливість створити свій перший обліковий запис, натисніть кнопку нижче, щоб підтвердити свою адресу електронної пошти.</p>
    <a href="http://localhost:3000/api/user/verify-email?emailToken=${emailToken}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Підтвердити</a>
    <p>Якщо ви не зареєструвалися, жодних додаткових дій не потрібно, ваша електронна адреса буде автоматично видалена через кілька днів.</p>
    <p>З повагою, BoardMaster</p>
    `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendEmail;