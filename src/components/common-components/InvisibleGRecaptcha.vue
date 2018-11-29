<template>
  <button id="g-recaptcha" class="g-recaptcha" :data-sitekey="recaptcha"></button>
</template>

<script>
import config from '../../config'

export default {
  name: 'invisible-g-recaptcha',
  data () {
    return {
      recaptcha: config.gRecaptcha,
      widgetId: 0
    }
  },
  mounted () {
    this.render()
  },
  methods: {
    execute () {
      window.grecaptcha.execute(this.widgetId)
    },
    render () {
      if (window.grecaptcha) {
        this.widgetId = window.grecaptcha.render('g-recaptcha', {
          sitekey: this.recaptcha,
          size: 'invisible',
          badge: 'bottomleft',
          callback: resp => this.$emit('verify', resp)
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.g-recaptcha {
  display: none;
}
</style>
