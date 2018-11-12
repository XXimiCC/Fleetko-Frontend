export default {
  methods: {
    enterKeyHandler () {}
  },
  created () {
    document.addEventListener('keydown', this.enterKeyHandler)
  },
  destroyed () {
    document.removeEventListener('keydown', this.enterKeyHandler)
  }
}
