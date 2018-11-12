<template>
  <transition name="fade">
    <div class="notification" :class="{ solid: solid }">
      <div class="notification__body" :class="notification.type">
        <div
          class="notification__body--close"
          v-if="cancelable"
          @click="$emit('clearNotify')"
        >
          <svg-close fill="#fff"></svg-close>
        </div>
        <div class="item notification__body--status">
          <div class="icon-wrap">
            <svg-success
              v-if="notification.type == 'success'"
              height="24"
              width="24"
            ></svg-success>
            <svg-error
              v-if="notification.type == 'error' || notification.type == 'info'"
            ></svg-error>
            <svg-warning v-if="notification.type == 'warning'"></svg-warning>
          </div>
        </div>
        <div class="item notification__body--info">
          <h2
            v-if="!solid"
            v-text="notification.type === 'info' ? 'Notice' : notification.type"
          ></h2>
          <p>{{ notification.text }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'notification',
  data () {
    return {}
  },
  props: ['notification', 'id', 'cancelable', 'solid'],
  watch: {},
  methods: {},
  computed: {},
  components: {},
  created () {
    if (this.notification.timeout) {
      setTimeout(() => {
        this.$emit('clearNotify')
      }, this.notification.timeout)
    }
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
.error {
  border: 1px solid $main-red;
  .notification__body--status {
    background: $main-red;
  }
}

.info {
  border: 1px solid $light-blue;
  .notification__body--status {
    background: $light-blue;
    svg {
      height: 30px;
    }
  }
}

.icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.solid .notification__body {
  &--status {
    flex: 0 0 52px;
    justify-content: center;
    margin-right: -16px;
  }
}

.solid .notification__body {
  p {
    color: #fff;
  }
  .notification__body--close {
    top: 12px;
    svg {
      width: 24px;
      height: 24px;
      fill: #fff;
    }
  }
}

.solid .notification__body.info {
  background-color: $light-blue;
}

.solid .notification__body.success {
  background-color: $success;
}

.solid {
  .notification__body.success {
    .icon-wrap {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #fff;
      svg {
        fill: $success;
      }
    }
  }
}

.success {
  border: 1px solid $success;
  .notification__body--status {
    background: $success;
  }
}

.warning {
  border: 1px solid $warning;
  .notification__body--status {
    background: $warning;
  }
}

.notification__body {
  position: relative;
  display: flex;
  border-radius: 4px;
  &--close {
    top: 16px;
    right: 16px;
    position: absolute;
    display: flex;
    cursor: pointer;
    svg {
      width: 16px;
      height: 16px;
      fill: $main-grey;
    }
  }
  &--status {
    display: flex;
    flex: 0 0 58px;
    align-items: center;
    svg {
      width: 100%;
      fill: white;
    }
  }
  &--info {
    padding: 16px 56px 16px 16px;
    h2 {
      margin-bottom: 11px;
      color: $main-dark;
      font-size: 14px;
      font-weight: 600;
      font-family: $montserrat-font;
      text-transform: uppercase;
      line-height: 1;
    }
    p {
      margin-bottom: 0;
      font-family: $sours-sans-p-font;
      font-size: 14px;
      color: $main-dark;
      line-height: 18px;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
