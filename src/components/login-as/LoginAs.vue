<script>
import Vue from 'vue'
export default {
  name: 'login-as',
  methods: {
    loginAs () {
      Vue.ls.remove('waitList')
      Vue.ls.remove('cart')

      if (this.$route.query.token) {
        this.$store.dispatch('login', {
            email: null,
            password: null,
            grant_type: 'sudosu',
            provider: '',
            token: this.$route.query.token
          }).then(() => {
            this.$store.dispatch('getAuthUser').then(() => this.$store.dispatch('mergeServerCart'))

            this.$router.push({ name: 'home' })
          })
      }
    }
  },
  mounted () {
    this.loginAs()
  }
}
</script>
