const nodeMailer = require("nodemailer");

function sendMail(mailOptions) {
  return new Promise((resolve, reject) => {
    const transporter = nodeMailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: process.env.MAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME || "communitycoder3@gmail.com",
        pass: process.env.MAIL_PASSWORD || "hqzktxjzejygqrve",
      },
    });
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error in sending mail", error);
        reject(error);
      } else {
        console.log("Mail sent successfully", info);
        resolve(info);
      }
    });
  });
}

module.exports = {
  sendMail,
};
