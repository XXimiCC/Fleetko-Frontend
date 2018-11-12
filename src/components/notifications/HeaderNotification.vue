<template>
  <div class="notification" :class="getSystemNotification.type">
    <div class="container">
      <p>{{ getSystemNotification.message }}</p>
    </div>
    <div class="notification--item" @click="closeNotification">
      <svg-close></svg-close>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'header-notification',
  data () {
    return {}
  },
  methods: {
    closeNotification () {
      this.$store.dispatch('deleteSystemNotification')
    }
  },
  computed: {
    ...mapGetters(['getSystemNotification'])
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
.error {
  border: 1px solid $main-red;
  background: $main-red;
}
.success {
  border: 1px solid $success;
  background: $success;
}
.warning {
  border: 1px solid $warning;
  background: $warning;
}
.info {
  border: 1px solid $main-color;
  background: $main-color;
}
.notification {
  height: 48px;
  display: flex;
  align-items: center;
  .container {
    position: relative;
    text-align: center;
    p {
      margin-left: 8px;
      line-height: 1;
      font-family: $montserrat-font;
      font-size: 14px;
      color: white;
    }
  }
  &--item {
    position: absolute;
    right: 24px;
    top: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    svg {
      width: 16px;
      height: 16px;
      fill: white;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .notification {
    padding: 8px 0;
    height: 100%;
    &--item {
      right: 16px;
    }
    .container {
      p {
        margin-left: auto;
        margin-right: auto;
        max-width: 80%;
        font-size: 12px;
        line-height: 17px;
      }
    }
  }
}
</style>
