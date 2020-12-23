const Product = require('../models/Product')
const LoadProductService = require('../services/LoadProductService')

module.exports = {
  async index(req, res) {
    try {
      let params = {}

      const { filter, category } = req.query

      //if (!filter) return res.redirect("/")
      if (!filter || filter.toLowerCase() == 'todos os produtos') filter = null

      params.filter = filter

      if (category) {
        params.category = category
      }

      let products = await Product.search({ filter, category })

      const productsPromise = products.map(LoadProductService.format)
      
      products = await Promise.all(productsPromise)

      const search = {
        term: req.query.filter,
        total: products.length
      }

      const categories = products.map(product => ({
        id: product.category_id,
        name: product.category_name
      })).reduce((categoriesFiltered, category) => {
        const found = categoriesFiltered.some(cat => cat.id == category.id)

        if (!found)
          categoriesFiltered.push(category)

        return categoriesFiltered
      }, [])//retorno de array de categorias a fim de evitar rerpetiçao

      return res.render("search/index", { products, search, categories })

    } catch (err) {
      console.log(`ERRO SearchController.js -> index ${err}`)
    }
  }
}