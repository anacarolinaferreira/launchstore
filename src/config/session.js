const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const db = require('./db')

module.exports = session({
  store: new pgSession({
    pool: db
  }),//criar a seção e gravar no banco
  secret: 'iabadabaduuuuu', //chave secreta
  resave: false,
  saveUninitialized: false, //salvar sem dados
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000//quanto tempo a seção ficará ativa(transformando 30 dias em milisegundos)
  }
})