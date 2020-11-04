const Product = require('../models/Product')
const File = require('../models/File')

const { formatPrice } = require('../../lib/utils')

module.exports = {
  async index(req, res) {
    try {

      let { filter, category } = req.query

      if (!filter || filter.toLowerCase() == 'todos os produtos') filter = null

      results = await Product.search({filter, category})

      async function getImage(productId) {
        let results = await Product.files(productId)
        const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
        return files[0]
      }

      const productsPromise = results.rows.map(async product => {
        product.img = await getImage(product.id)
        product.oldPrice = formatPrice(product.old_price)
        product.price = formatPrice(product.price)
        return product
      })
      const products = await Promise.all(productsPromise)

      const search = {
        term: filter || 'Todos os produtos',
        total: products.length
      }

      const categories = products.map(product => ({
        id: product.category_id,
        name: product.category_name
      })).reduce((categoriesFiltered, category) => {
        const found = categoriesFiltered.some(cat => cat.id == category.id)
        
        if(!found)
          categoriesFiltered.push(category)
        
        return categoriesFiltered
      }, [])//retorno de array de categorias a fim de evitar rerpetiçaõ
      return res.render("search/index", { products, search, categories })

    } catch (err) {
      console.log(err)
    }
  }
}