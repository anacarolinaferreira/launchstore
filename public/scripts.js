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
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 6,
  files: [],
  input: "",
  handleFileInput(event) {
    const { files: fileList } = event.target
    PhotosUpload.input = event.target

    if (PhotosUpload.hasLimite(event)) return

    Array.from(fileList).forEach(file => {

      //criando o array com o tipo file
      PhotosUpload.files.push(file)

      const reader = new FileReader()

      //executa quando o arquivo estiver pronto
      reader.onload = () => {
        const image = new Image() // == <img/>
        image.src = String(reader.result)

        const container = PhotosUpload.getContainer(image)
        PhotosUpload.preview.appendChild(container)
      }
      //leitura do file
      reader.readAsDataURL(file)
    })

    //substituindo o do HTML pelo do getAllFiles
    PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  hasLimite(event) {
    const { uploadLimit, input, preview } = PhotosUpload
    const{files: fileList} = input

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} imagens`)
      event.preventDefault()
      return true
    }
    const photosDiv = []
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == "photo"){
        photosDiv.push(item)
      }
    })
    const totalPhotos = fileList.length + photosDiv.length

    if(totalPhotos > uploadLimit){
      alert(`Você atingiu o limite máximo de ${uploadLimit} imagens`)
      event.preventDefault()
      return true
    }
    return false
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  getContainer(image) {
    const container = document.createElement('div')

    container.classList.add('photo')

    container.onclick = PhotosUpload.removePhoto

    container.appendChild(image)

    container.appendChild(PhotosUpload.getRemoveButton())

    return container
  },
  getRemoveButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = "delete_forever"
    return button
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode // <div class="photo"
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)

    PhotosUpload.files.splice(index, 1)

    PhotosUpload.input.files = PhotosUpload.getAllFiles()//atualizando o input

    photoDiv.remove()
  },
  removeOldPhoto(event){
    const photoDiv = event.target.parentNode

    if(photoDiv.id){
      const removedFiles = document.querySelector('input[name="removed_files"]')
      if(removedFiles){
        removedFiles.value += `${photoDiv.id},`
      }
    }
    photoDiv.remove()
  }
}