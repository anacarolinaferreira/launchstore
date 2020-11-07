module.exports = {
    //FORMATANDO A DATA
    date(timestamp) {
        const date = new Date(timestamp)
        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)//pegando os dois ultimos digitos
        const day = `0${date.getUTCDate()}`.slice(-2)
        const hour = date.getHours()
        const minutes = date.getMinutes()

        return {
            year,
            month,
            day,
            hour,
            minutes,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    },
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price / 100)
    },
    formatCpfCnpj(value) {
        value = value.replace(/\D/g, "")//limpa os campos

        if (value.length > 14)
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
    formatCep(value) {
        value = value.replace(/\D/g, "")//limpa os campos

        if (value.length > 8)
            value = value.slice(0, -1)

        value = value.replace(/(\d{5})(\d)/, "$1-$2")

        return value
    }

}