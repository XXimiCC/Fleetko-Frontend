<template>
  <transition name="fade">
    <div class="back__wrap" v-if="showButton">
      <div class="back__button" @click="scrollToTop">
        <svg-arrow-back></svg-arrow-back>
      </div>
    </div>
  </transition>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'app-to-top',
  data () {
    return {
      showButton: false
    }
  },
  methods: {
    scrollEventInit () {
      $(document).on('scroll', $event => {
        let scrollPos = window.scrollY
        let windowHeight = document.body

        this.showButton = scrollPos > windowHeight.scrollHeight / 4
      })
    },
    scrollToTop () {
      $('html, body').animate({ scrollTop: 0 }, 500)
    }
  },
  mounted () {
    this.scrollEventInit()
  }
}
</script>

<style scoped lang="scss">
.back {
  &__wrap {
    position: fixed;
    display: flex;
    justify-content: center;
    bottom: 108px;
    right: 36px;
    width: 52px;
    height: 52px;
    z-index: 600;
  }
  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    background: white;
    border: 1px solid $main-color;
    border-radius: 100%;
    cursor: pointer;
    svg {
      width: 24px;
      height: 24px;
      fill: $main-color;
      transform: rotate(90deg);
    }
    &:hover {
      background-color: #e7eefd;
      border: 1px solid $main-color;
      svg {
        fill: $main-color;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .back {
    &__wrap {
      height: 32px;
      width: 32px;
    }
    &__button {
      height: 32px;
      width: 32px;
      svg {
        margin-top: 5px;
        width: 18px;
        height: 18px;
      }
    }
  }
}
</style>
