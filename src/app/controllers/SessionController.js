const User = require('../models/User')

const crypto = require('crypto')
const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')

module.exports = {
  loginForm(req, res) {
    return res.render("session/login")
  },
  logout(req, res) {
    req.session.destroy()
    return res.redirect('/')
  },
  login(req, res) {
    req.session.userId = req.user.id

    return res.redirect("/users")

  },
  forgotForm(req, res) {
    return res.render("session/forgot-password")
  },
  async forgot(req, res) {
    const user = req.user
    try {
      //um token para esse usuário
      const token = crypto.randomBytes(20).toString("hex")

      //criar uma expiração do token - limite de uma hora
      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      })
      //enviar um email com um link de recuperação de senha
      await mailer.sendMail({
        to: user.email,
        from: 'O EMAIL AQUI',
        subject: 'Recuperação de Senha',
        html: `
      <h2>Perdeu a chave?</h2>
      <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
      <p>
      <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">RECUPERAR SENHA</a>
      </p>
      `
      })

      //avisar o usuário que enviamos o email
      return res.render("session/forgot-password", {
        success: "Verifique seu email para resetar sua senha!"
      })

    } catch (error) {
      console.log(error)
      return res.render("session/forgot-password", {
        error: `Erro ao tentar recuperar senha ERRO: ${error}`
      })
    }
  },
  resetForm(req, res) {
    return res.render("session/password-reset", { token: req.query.token })
  },
  async reset(req, res) {
    const user = req.user
    const { password, token } = req.body

    try {
      //cria um novo hash de senha
      const newPassword = await hash(password, 8)

      //atualiza o usuario
      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: "",
      })

      //avisa o usuario que ele tem uma nova senha
      return res.render("session/login", {
        user: req.body,
        success: "Senha atualizada com sucesso! Faça seu login..."
      })

    } catch (error) {
      console.log(error)
      return res.render("session/password-reset", {
        user: req.body,
        token,
        error: `Erro ao tentar recuperar senha ERRO: ${error}`
      })
    }
  }
}