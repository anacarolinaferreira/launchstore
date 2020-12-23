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
  },
  cpfCnpj(value) {
    value = value.replace(/\D/g, "")//limpa os campos

    if(value.length >14)
    value = value.slice(0, -1)

    //check if cnpj
    if (value.length > 11) {
      //11.222333000111
      value = value.replace(/(\d{2})(\d)/, "$1.$2")

      //11.222.333000111
      value = value.replace(/(\d{3})(\d)/, "$1.$2")

      //11.222.333/000111
      value = value.replace(/(\d{3})(\d)/, "$1/$2")

      //11.222.333/0001-11
      value = value.replace(/(\d{4})(\d)/, "$1-$2")
    
    } else {
      //cpf 111.222.333-44
      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1-$2")

    }
    return value
  },
  cep(value){
    value = value.replace(/\D/g, "")//limpa os campos

    if(value.length > 8)
    value = value.slice(0, -1)

    value = value.replace(/(\d{5})(\d)/, "$1-$2")

    return value
  }
}

const Validate = {
  apply(input, func) {
      Validate.clearErrors(input)

      let results = Validate[func](input.value)
      input.value = results.value

      if(results.error)
        Validate.displayError(input, results.error)
  },
  displayError(input, error){
    const div = document.createElement('div')
    div.classList.add('error')
    div.innerHTML = error
    input.parentNode.appendChild(div)
    input.focus()
  },
  clearErrors(input){
    const errorDiv = input.parentNode.querySelector(".error")
    if(errorDiv)
    errorDiv.remove()
  },
  isEmail(value){
      let error = null

      const mailFormat =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

      if(!value.match(mailFormat))
        error = "Email inválido"

      return{
        error,
        value
      }
  },
  isCpfCnpj(value){
    let error = null

    const cleanValues = value.replace(/\D/g, "")

    if(cleanValues.length > 11 && cleanValues.length !== 14){
      error = "CNPJ incorreto"
    }
    else if(cleanValues.length < 12 && cleanValues.length !== 11){
      error = "CPF incorreto"
    }

    return {
      error,
      value
    }
  },
  isCep(value){
    let error = null

    const cleanValues = value.replace(/\D/g, "")

    if(cleanValues.length !== 8){
      error = "CEP Incorreto"
    }

    return {
      error,
      value
    }

  },
  allFields(event){
    //Seleciona todos os itens do form, sendo .item a classe e em seguida os elementos
    const items =  document.querySelectorAll('.item input, .item select, .item textarea')

    for(item of items){
      if(item.value == ""){
        const message = document.createElement('div')
        message.classList.add('messages')
        message.classList.add('error')
        message.innerHTML = 'Todos os campos são obrigatórios!'
        message.style.position='fixed'
        document.querySelector('body').append(message)
        event.preventDefault()
      }
    }
  }
}
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
    const { files: fileList } = input

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} imagens`)
      event.preventDefault()
      return true
    }
    const photosDiv = []
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == "photo") {
        photosDiv.push(item)
      }
    })
    const totalPhotos = fileList.length + photosDiv.length

    if (totalPhotos > uploadLimit) {
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
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode

    if (photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]')
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`
      }
    }
    photoDiv.remove()
  }
}
const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage(event) {
    const { target } = event

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
    target.classList.add('active')

    ImageGallery.highlight.src = target.src
    Lightbox.image.src = target.src
  }
}
const Lightbox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
  open() {
    Lightbox.target.style.opacity = 1
    Lightbox.target.style.top = 0
    Lightbox.target.style.bottom = 0
    Lightbox.closeButton.style.top = 0
  },
  close() {
    Lightbox.target.style.opacity = 0
    Lightbox.target.style.top = "-100%"
    Lightbox.target.style.bottom = "initial"
    Lightbox.closeButton.style.top = "-80px"
    Lightbox.target.style.transition = "400ms"
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