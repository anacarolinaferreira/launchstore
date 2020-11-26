const nodemailer =  require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "c511c414800238",
    pass: "e3daebba7425d3"
  }
});