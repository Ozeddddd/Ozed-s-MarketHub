import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
export function sendEmail(email, title, html){
const transporter = nodemailer.createTransport({
    service: 'gmail', // Email service provider
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD // Your email password or app-specific password
    }
});

// Send email
transporter.sendMail({
    from: `${process.env.ORG_NAME} <${process.env.ORG_EMAIL}>`, // Sender address
    to: email, // Recipient address
    subject: title, // Subject line
    text: html // Plain text body
}, (err, info) => {
    if (err) {
        console.error('Error sending email:', err);
    } else {
        console.log('Email sent:', info);
    }
});
}