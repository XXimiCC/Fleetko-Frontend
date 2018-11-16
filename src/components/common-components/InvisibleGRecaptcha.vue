<template>
  <button id="g-recaptcha" class="g-recaptcha" :data-sitekey="recaptcha"></button>
</template>

<script>
import config from '../../config'

export default {
  name: 'invisible-g-recaptcha',
  props: ['noReset', 'delayedRender'],
  data () {
    return {
      recaptcha: config.gRecaptcha,
      widgetId: 0,
      timer: null
    }
  },
  mounted () {
    this.delayedRender ? this.timer = setTimeout(() => this.render(), 1000) : this.render()
  },
  methods: {
    execute () {
      window.grecaptcha.execute(this.widgetId)
    },
    reset () {
      window.grecaptcha.reset(this.widgetId)

      const captchaEl = 'div[style^="visibility: hidden; position: absolute; width:100%; top: -10000px;"]'
      const captchaContainers = document.querySelectorAll(captchaEl)

      if (captchaContainers.length) captchaContainers.forEach(el => el.parentNode.removeChild(el))
    },
    render () {
      if (window.grecaptcha) {
        this.widgetId = window.grecaptcha.render('g-recaptcha', {
          sitekey: this.recaptcha,
          size: 'invisible',
          badge: 'bottomleft',
          callback: resp => {
            if (!this.noReset) this.reset()
            this.$emit('verify', resp)
          }
        })
      }
    }
  },
  beforeDestroy () {
    this.timer = null
  }
}
</script>

<style scoped lang="scss">
.g-recaptcha {
  display: none;
}
</style>
