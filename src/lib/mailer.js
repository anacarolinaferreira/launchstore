const nodemailer =  require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "ae2632e17b3ddf",
    pass: "850329475d3ad2"
  }
});