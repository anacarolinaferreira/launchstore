const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')//habilitar o PUT e o DELETE no method
const session = require('./config/session')

//*************************************************************************/

const server = express()//CRIAÇÃO DO SERVIDOR

//*************************************************************************/

//INTERCEPTADORES

//criando a seção do usuário
server.use(session)

//VARIAVEL GLOBAL com node
server.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

//Habilita o uso do req.body
server.use(express.urlencoded({extended:true}))

server.use(express.static('public'))

//DEPENDENCIA QUE VAI SOBREESCREVER O MÉTODO
server.use(methodOverride('_method'))//sobreescreve o metodo antes chama antes de chamar a rota

server.use(routes)

//configurando a template engine
server.set("view engine", "njk")

nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
})

//*************************************************************************/

server.listen(5000, function () {
    console.log('Server is running')
}) 