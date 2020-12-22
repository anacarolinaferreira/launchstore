const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

const { unlinkSync } = require('fs')

const { formatPrice, date } = require('../../lib/utils')

module.exports = {
  async create(req, res) {

    try {
      const categories = await Category.findAll()
      return res.render("products/create", { categories })

    } catch (error) {
      console.error(error)
    }
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body)
      for (key of keys) {
        if (req.body[key] == "") {
          return res.send('Por favor preencha todos os campos')
        }
      }

      if (req.files.length == "") {
        return res.send('Por favor, selecione ao menos uma imagem.')
      }

      let { category_id, name, description, price,
        old_price, quantity, status } = req.body

      price = price.replace(/\D/g, "")
      const product_id = await Product.create({
        category_id,
        user_id: req.session.userId,
        name,
        description,
        price,
        old_price: old_price || price,
        quantity,
        status: status || 1
      })
      const filesPromise = req.files.map(file => File.create({ name: file.filename, path: file.path, product_id }))
      await Promise.all(filesPromise)

      return res.redirect(`/products/${product_id}`)

    } catch (error) {
      console.error(error);
    }

  },
  async show(req, res) {
    try {
      const product = await Product.find(req.params.id)

      if (!product) return res.send('Produto não encontrado')

      const { day, hour, minutes, month, year } = date(product.updated_at)

      product.published = {
        day: `${day}/${month}/${year}`,
        hour: `${hour}:${minutes}`
      }

      product.oldPrice = formatPrice(product.old_price)
      product.price = formatPrice(product.price)

      let files = await Product.files(product.id)
      files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
      }))

      return res.render("products/show", { product, files })
    } catch (error) {
      console.error(error);
    }
  },
  async edit(req, res) {
    try {
      const product = await Product.find(req.params.id)

      if (!product) return res.send("Produto não encontrado")

      product.old_price = formatPrice(product.old_price)
      product.price = formatPrice(product.price)

      //get categories
      const categories = await Category.findAll()

      //get images
      let files = await Product.files(product.id)
      //adicionando o endereço correto para cada imagem
      files = files.map(file => ({
        ...file,
        //     http ou https   ex:localhost:3000 end.arquivo sem o publict(public\images\1601817847129-119236-OQ05QX-268.png)
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
      }))

      return res.render("products/edit", { product, categories, files })
    } catch (error) {
      console.error(error);
    }
  },
  async put(req, res) {
    try {
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
      await Product.update(req.body.id, {
        category_id: req.body.category_id,
        name: req.body.name,
        description: req.body.description,
        old_price: req.body.old_price,
        price: req.body.price,
        quantity: req.body.quantity,
        status: req.body.status,
      })

      return res.redirect(`/products/${req.body.id}`)
    } catch (error) {
      console.error(error);
    }
  },
  async delete(req, res) {
    try {
      const files = await Product.files(req.body.id)

      await Product.delete(req.body.id)

      files.map(file => {
        try {
          unlinkSync(file.path)
        } catch (error) {
          console.error(error);
        }
      })

      return res.redirect('/products/create')
    } catch (error) {
      console.error(error);
    }
  }
}