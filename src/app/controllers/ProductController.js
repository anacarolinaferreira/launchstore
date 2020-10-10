const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

const { formatPrice, date } = require('../../lib/utils')

module.exports = {
  create(req, res) {
    //Pegar categorias
    Category.all()
      .then(function (results) {
        const categories = results.rows
        return res.render("products/create.njk", { categories })

      }).catch(function (err) {
        throw new Error(err)
      })
  },
  async post(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Por favor preencha todos os campos')
      }
    }

    if (req.files.length == "") {
      return res.send('Por favor, selecione ao menos uma imagem.')
    }

    let results = await Product.create(req.body)
    const productId = results.rows[0].id


    //array de promessas
    const filesPromise = req.files.map(file => File.create({ ...file, product_id: productId }))

    await Promise.all(filesPromise)

    return res.redirect(`/products/${productId}`)

  },
  async show(req, res) {

    let results = await Product.find(req.params.id)
    const product = results.rows[0]

    if (!product) return res.send('Produto não encontrado')

    const { day, hour, minutes, month, year } = date(product.updated_at)
    
    product.published = {
      day:`${day}/${month}/${year}`,
      hour: `${hour}:${minutes}`
    }

    product.oldPrice = formatPrice(product.old_price)
    product.price = formatPrice(product.price)


    return res.render("products/show", { product })
  },
  async edit(req, res) {
    let results = await Product.find(req.params.id)
    const product = results.rows[0]

    if (!product) return res.send("Produto não encontrado")

    product.old_price = formatPrice(product.old_price)
    product.price = formatPrice(product.price)

    //get categories
    results = await Category.all()
    const categories = results.rows

    //get images
    results = await Product.files(product.id)
    let files = results.rows
    //adicionando o endereço correto para cada imagem
    files = files.map(file => ({
      ...file,
      //     http ou https   ex:localhost:3000 end.arquivo sem o publict(public\images\1601817847129-119236-OQ05QX-268.png)
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))

    return res.render("products/edit.njk", { product, categories, files })
  },
  async put(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files" && key != "old_price") {
        return res.send('Por favor preencha todos os campos')
      }
    }

    if (req.files.length != 0) {
      const newFilesPromise = req.files.map(file =>
        File.create({ ...file, product_id: req.body.id }))

      await Promise.all(newFilesPromise)
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",") // [1,2,3,]
      const lasIndex = removedFiles.length - 1
      removedFiles.splice(lasIndex, 1)// [1,2,3]

      //array de promessas 
      const removedFilesPromise = removedFiles.map(id => File.delete(id))
      //que aguardará o processo de delete terminar para cada imagem
      await Promise.all(removedFilesPromise)
    }

    req.body.price = req.body.price.replace(/\D/g, "")

    if (req.body.old_price != req.body.price) {
      const oldProduct = await Product.find(req.body.id)

      req.body.old_price = oldProduct.rows[0].price
    }
    await Product.update(req.body)

    return res.redirect(`/products/${req.body.id}`)

  },
  async delete(req, res) {

    await Product.delete(req.body.id)

    return res.redirect('/products/create')
  }
}