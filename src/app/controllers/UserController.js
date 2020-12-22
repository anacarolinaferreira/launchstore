const User = require('../models/User')
const Product = require('../models/Product')

const { hash } = require('bcryptjs')
const { unlinkSync } = require('fs')
const { formatCpfCnpj, formatCep } = require("../../lib/utils")

module.exports = {
  registerForm(req, res) {
    return res.render("user/register")
  },
  async post(req, res) {
    try {

      let { name, email, password, cpf_cnpj, cep, address } = req.body

      //criptografia
      password = await hash(password, 8)
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
      cep = cep.replace(/\D/g, "")

      const userId = await User.create({
        name,
        email,
        password,
        cpf_cnpj,
        cep,
        address
      })

      req.session.userId = userId

      return res.redirect('/users')
    } catch (error) {
      console.error(error);
    }

  },
  async show(req, res) {
    try {
      const { user } = req

      user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
      user.cep = formatCep(user.cep)

      res.render('user/index', { user })

    } catch (error) {
      console.error(error);
    }
  },
  async update(req, res) {
    try {
      const { user } = req

      let { name, email, cpf_cnpj, cep, address } = req.body
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
      cep = cep.replace(/\D/g, "")

      await User.update(user.id, {
        name,
        email,
        cpf_cnpj,
        cep,
        address
      })

      return res.render("user/index", {
        user: req.body,
        success: "Conta atualizada com sucesso"
      })

    } catch (error) {
      console.error(error)
      return res.render("user/index", {
        error: "Algum erro ocorreu ao tentar atualizar o cadastro."
      })
    }
  },
  async delete(req, res) {
    try {
      const products = await Product.findAll({ where: { user_id: req.body.id } })

      //dos produtos, pegar todas as imagens
      const allFilesPromise = products.map(product => Product.files(product.id))
      
      let promiseResults = await Promise.all(allFilesPromise)

      //rodar a remoção do usuário
      await User.delete(req.body.id)
      req.session.destroy()

      //remover as imagens da pasta public
      promiseResults.map(files => {
        files.map(file => {
          try {
            unlinkSync(file.path)
          } catch (error) {
            console.error(error);
          }
        })
      })

      return res.render("session/login", {
        success: "Conta deletada com sucesso!"
      })

    } catch (error) {
      console.error(error)
      return res.render("user/index", {
        user: req.body,
        error: `Erro ao tentar deletar sua conta ${error}`
      })

    }
  }
}