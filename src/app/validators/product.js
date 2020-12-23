async function post(req, res, next) {
  const keys = Object.keys(req.body)
  for (key of keys) {
    if (req.body[key] == "") {
      return res.send('Por favor volte e preencha todos os campos')
    }
  }

  if (req.files.length == "") {
    return res.send('Por favor, envie ao menos uma imagem.')
  }
}

module.exports = {
  post
}