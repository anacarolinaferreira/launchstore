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
/* const formDelete = document.querySelector('#form-delete')  
formDelete.addEventListener('submit', function(event){
  const confirmation = confirm('Deseja realmente deletar esse registro?')
  if(!confirmation){
    event.preventDefault()
  }
})
 */
//UPLOAD DE IMAGENS

const PhotosUpload = {
  uploadLimit: 6,

  handleFileInput(event){
    const {files: fileList} = event.target
    const {uploadLimit} = PhotosUpload

    if(fileList.length > uploadLimit){
      alert(`Envie no máximo ${uploadLimit} imagens`)
      event.preventDefault()
      return
    }
  }
}