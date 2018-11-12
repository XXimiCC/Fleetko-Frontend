<template>
  <button
    id="g-recaptcha"
    class="g-recaptcha"
    :data-sitekey="recaptcha"
  ></button>
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
  watch: {},
  props: ['noReset', 'delayedRender'],
  methods: {
    execute () {
      window.grecaptcha.execute(this.widgetId)
    },
    reset () {
      window.grecaptcha.reset(this.widgetId)

      const captchaContainerSelector =
        'div[style^="visibility: hidden; position: absolute; width:100%; top: -10000px;"]'
      const captchaDialogContainers = document.querySelectorAll(
        captchaContainerSelector
      )

      // Remove existing wrappers
      if (captchaDialogContainers.length) {
        captchaDialogContainers.forEach(dialog => {
          dialog.parentNode.removeChild(dialog)
        })
      }
    },
    render () {
      if (window.grecaptcha) {
        this.widgetId = window.grecaptcha.render('g-recaptcha', {
          sitekey: this.recaptcha,
          size: 'invisible',
          badge: 'bottomleft',
          // the callback executed when the user solve the recaptcha
          callback: response => {
            // reset the recaptcha widget so you can execute it again
            if (!this.noReset) {
              this.reset()
            }
            // emit an event called verify with the response as payload
            this.$emit('verify', response)
          }
        })
      }
    }
  },
  mounted () {
    this.delayedRender ? setTimeout(() => this.render(), 1000) : this.render()
  }
}
</script>

<style scoped lang="scss">
.g-recaptcha {
  display: none;
}
</style>
