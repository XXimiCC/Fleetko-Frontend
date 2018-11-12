import moment from 'moment'

export default {
  methods: {
    cutText (text, symbols) {
      if (text) {
        if (text.length <= symbols) {
          return text.slice(0, symbols)
        } else {
          return text.slice(0, symbols) + '...'
        }
      }
    },
    /**
     * @return {string}
     */
    toDollarDecimal (price) {
      if (price) return (price / 100).toLocaleString('en', {minimumFractionDigits: 2, maximumFractionDigits: 2})
      else return '0.00'
    },
    toFormatedDate (date, format) {
      if (date) return moment(date).format(format)
      else return ''
    },
    roundDecimalRating (rating) {
      const roundRate = parseFloat(rating).toFixed(1)
      const posHalf = roundRate.toString().split('.')[0]

      if (rating % 1 === 0) {
        return `${posHalf}.0`
      } else {
        const roundRate = parseFloat(rating).toFixed(1)
        const posHalf = roundRate.toString().split('.')[0]

        return `${posHalf}.5`
      }
    }
  }
}
