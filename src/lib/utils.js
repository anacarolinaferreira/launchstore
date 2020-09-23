module.exports = {
    //FORMATANDO A DATA
    date(timestamp){
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()

        const month = `0${date.getUTCMonth() + 1}`.slice(-2)//pegando os dois ultimos digitos

        const day = `0${date.getUTCDate()}`.slice(-2)

        return{
            year,
            month,
            day,
            iso:`${year}-${month}-${day}`,
            birthDay:`${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    },
    formatPrice(price){
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price/100)
    }

}