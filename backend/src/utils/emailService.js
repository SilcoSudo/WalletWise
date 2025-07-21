const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Hoặc SMTP khác
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendVerificationEmail = async (to, link) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Xác thực email WalletWise',
    html: `<p>Nhấn vào link để xác thực email:</p><a href="${link}">${link}</a>`,
  });
};

exports.sendResetPasswordEmail = async (to, link) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Đặt lại mật khẩu WalletWise',
    html: `<p>Nhấn vào link để đặt lại mật khẩu:</p><a href="${link}">${link}</a>`,
  });
}; 