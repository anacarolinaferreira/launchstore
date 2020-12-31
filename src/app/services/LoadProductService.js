const Product = require('../models/Product')

const { formatPrice, date } = require('../../lib/utils')

async function getImages(productId) {
  let files = await Product.files(productId)
  files = files.map(file => ({
    ...file,
    src: `${file.path.replace("public", "")}`,
  }))
  
  for (let index = 0; index < files.length; index++) {
    files[index].src = files[index].src.replace(/[\\"]/g, '/')
  }
 
  return files
}

async function format(product) {

  const files = await getImages(product.id)
  product.img = files[0].src
  product.files = files
  product.formattedOldPrice = formatPrice(product.old_price)
  product.formattedPrice = formatPrice(product.price)

  const { day, hour, minutes, month, year } = date(product.updated_at)
  product.published = {
    day: `${day}/${month}/${year}`,
    hour: `${hour}:${minutes}`
  }
  return product
}

const LoadService = {
  load(service, filter) {//método
    this.filter = filter
    return this[service]()
  },
  async product() {
    try {
      const product = await Product.findOne(this.filter)
      return format(product)

    } catch (error) {
      console.error(`Erro LoadProductService.js -> product ${error}`);
    }
  },
  async products() {
    try {
      const products = await Product.findAll(this.filter)
      const productsPromise = products.map(format)
      return Promise.all(productsPromise)

    } catch (error) {
      console.error(`Erro LoadProductService.js -> products ${error}`);
    }
  },
  format,//passando a função
}

module.exports = LoadService