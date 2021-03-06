const express = require('express');
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ProductController = require('../app/controllers/ProductController')
const SearchController = require('../app/controllers/SearchController')

const { onlyUsersDo } = require('../app/middlewares/session')

const Validator = require('../app/validators/product')

//SEARCH
routes.get('/search', SearchController.index)

//PRODUCTS
routes.get('/create', onlyUsersDo, ProductController.create);
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', onlyUsersDo, ProductController.edit);
routes.post('/', onlyUsersDo, multer.array('photos', 6), Validator.post, ProductController.post)
routes.put('/', onlyUsersDo, multer.array('photos', 6), ProductController.put)
routes.delete('/', onlyUsersDo, ProductController.delete)

module.exports = routes
