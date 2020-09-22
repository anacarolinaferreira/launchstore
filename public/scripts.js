const Mask = {
  apply(input, func) {
    setTimeout(function () {
      input.value = Mask[func](input.value)
    }, 1)
  },
  //formatação do campo de valor para que o mesmo aceite somente números
  formatBRL(value) {
    value = value.replace(/\D/g, "")
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100)
  }
}