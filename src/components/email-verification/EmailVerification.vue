<template></template>

<script>
export default {
  name: 'email-verification',
  data () {
    return {}
  },
  methods: {
    proccesingEmailConfirmation () {
      if (this.$route.query.result === 'success') {
        this.$router.push({ name: 'settings', query: { verified: true } })
      } else {
        this.$router.push({ name: 'home' })
      }
    }
  },
  mounted () {
    this.proccesingEmailConfirmation()
  }
}
</script>

<style scoped></style>
