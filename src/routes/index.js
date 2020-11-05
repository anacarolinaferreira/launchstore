const express = require('express');
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')

const products = require('./product')
const users = require('./users')

routes.get('/', HomeController.index);
routes.use('/products', products)
routes.use('/users', users)

//Alias - atalhos
routes.get('/ads/create', function (req, res) {
    return res.redirect('/products/create')
});


//exportando a rota
module.exports = routes