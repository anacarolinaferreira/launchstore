const LoadProductService = require('../services/LoadProductService')
const User = require('../models/User')

const mailer = require('../../lib/mailer')

const email = (seller, product, buyer)=> `
<h2> Olá ${seller.name} </h2>
<p>Você tem um novo pedido de compra do seu produto</p>
<p>PRODUTO: ${product.name}</p>
<p>PREÇO: ${product.formattedPrice}</p>
<p></br></br></p>

<h3>Dados do Comprador</h3>
<p>${buyer.name}</p>
<p>${buyer.email}</p>
<p>${buyer.address}</p>
<p>${buyer.cep}</p>
<p></br></br></p>

<p><strong>Entre em contato com o comprador para finalizar a venda!</strong></p>
<p></br></br></p>

<p>Atenciosamente, Equipe Launchstore</p>
`

module.exports = {
  async post(req, res) {
    try {

      //pegar os dados do produto
      const product = await LoadProductService.load('product', {
        where: { id: req.body.id }
      })

      //dados do vendedor
      const seller = await User.findOne({ where: { id: product.user_id } })

      //dados do comprador
      const buyer = await User.findOne({ where: { id: req.session.userId } })

      //enviar o email com dados da compra para o vendedor
      await mailer.sendMail({
        to: seller.email,
        from: 'no-replay@launchstore.com.br',
        subject: 'Novo Pedido de Compra',
        html: email(seller, product, buyer)
      })

      //notificar o usuário com a mensagem de sucesso ou erro
      return res.render('orders/sucess')

    } catch (error) {
      console.log(`ERROR OrderController.js -> post : ${error}`)
      return res.render('orders/error')
    }
  }
}