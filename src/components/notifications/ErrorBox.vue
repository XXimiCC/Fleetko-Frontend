<template>
  <transition name="fade">
    <div
      :style="{ top: top + 'px' }"
      :class="{
        'filter-toolbox': filtersInfo,
        'right-align': allignRight,
        error: notification.type === 'error',
        warning: notification.type === 'warning',
        'error-toolbox': notification.type === 'error-toolbox',
        'warning-toolbox': notification.type === 'warning-toolbox',
        'order-toolbox': notification.type === 'order-toolbox',
        'arrow-fixed-bottom': this.arrowFixedBottom,
        'info-toolbox': notification.type === 'info-toolbox',
        'arrow-bottom': this.arrowBottom,
        'arrow-right': this.arrowRight,
        'arrow-top': this.arrowTop,
        'delivery-tooltip': deliveryTooltip
      }"
      class="toolbox"
    >
      <div v-if="!allignBottom" class="arrow"></div>

      <div v-if="notification.cancelable" @click.stop="hide" class="close-wrap">
        <svg-close></svg-close>
      </div>

      <p>{{ notification.text }}</p>

      <div v-if="allignBottom" class="arrow"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Error',
  data () {
    return {
      timer: null
    }
  },
  props: [
    'notification',
    'top',
    'allignRight',
    'allignBottom',
    'arrowBottom',
    'arrowFixedBottom',
    'arrowRight',
    'arrowTop',
    'filtersInfo',
    'arrowPosition',
    'deliveryTooltip'
  ],
  methods: {
    hide () {
      if (this.timer) clearTimeout(this.timer)

      this.$emit('hide')
    }
  },

  created () {
    if (this.notification.delay) {
      this.timer = setTimeout(() => {
        this.$emit('hide')
      }, this.notification.delay)
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbox {
  z-index: 98;
  &.error {
    bottom: 110%;
    top: auto;
    background-color: $main-red;
    .arrow {
      position: absolute;
      bottom: 0;
      right: 10%;
      &:after {
        top: 0;
      }
    }
  }
  &.warning {
    bottom: 110%;
    top: auto;
    background-color: $warning;
    .arrow {
      position: absolute;
      bottom: 0;
      right: 10%;
      &:after {
        top: 0;
        border-color: $warning transparent transparent transparent;
      }
    }
  }
}

.toolbox {
  position: absolute;
  width: 150px;
  border-radius: 4px;
  box-shadow: 0 2px 3px 0 rgba(102, 102, 102, 0.2);
  padding: 8px 15px;
  right: 0;
  top: -56px;
  font-size: 12px;
  line-height: 1;
  font-family: $sours-sans-p-font;
  color: white;
  .arrow {
    position: relative;
    &:after {
      position: absolute;
      right: 4px;
      bottom: -41px;
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 5px 5px 0 5px;
      border-color: #f44336 transparent transparent transparent;
    }
  }
}

.close-wrap {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 12px;
  height: 12px;
  cursor: pointer;
  svg {
    width: 12px;
    height: 12px;
    fill: white;
  }
}

.error-toolbox {
  position: absolute;
  width: 150px;
  background: #f44336;
  box-shadow: 0 2px 3px 0 rgba(102, 102, 102, 0.2);
  border-radius: 4px;
  padding: 8px 15px;
  right: 0;
  top: -56px;
  font-size: 12px;
  line-height: 1;
  font-family: $sours-sans-p-font;
  color: white;
  p {
    margin-bottom: 0;
    font-family: $sours-sans-p-font;
    font-size: 14px;
  }
  .arrow {
    position: relative;
    &:after {
      position: absolute;
      right: 4px;
      bottom: -41px;
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 5px 5px 0 5px;
      border-color: #f44336 transparent transparent transparent;
    }
  }
}

.warning-toolbox {
  max-width: 172px;
  background: $warning;
  p {
    margin-bottom: 0;
    font-family: $sours-sans-p-font;
    font-size: 14px;
  }
  .arrow {
    &:after {
      border-color: $warning transparent transparent transparent;
    }
  }
}

.info-toolbox {
  position: absolute;
  width: 150px;
  border-radius: 4px;
  padding: 8px 16px;
  right: 0;
  font-size: 14px;
  line-height: 19px;
  font-family: $sours-sans-p-font;
  background: #fcfcfc;
  box-shadow: none;
  border: 1px solid #d6d6d6;
  z-index: 20;
  top: -68px;
  color: $main-dark;
  p {
    margin-bottom: 0;
    font-family: $sours-sans-p-font;
    font-size: 14px;
    color: $main-dark;
    font-weight: 400;
  }
  &__small {
    top: -34px;
  }
  .arrow {
    &:after {
      position: absolute;
      content: '';
      width: 15px;
      height: 15px;
      background: #fcfcfc;
      transform: rotate(45deg);
      bottom: -16px;
      border-width: 1px;
      border-color: transparent #d6d6d6 #d6d6d6 transparent;
    }
    &:before {
    }
  }
}

.filter-toolbox {
  bottom: 30px;
  top: auto;
}

.order-toolbox {
  position: absolute;
  width: 330px;
  border-radius: 4px;
  padding: 8px 16px;
  right: -17px;
  font-size: 14px;
  line-height: 19px;
  font-family: $sours-sans-p-font;
  background: #fcfcfc;
  box-shadow: none;
  border: 1px solid #d6d6d6;
  z-index: 20;
  top: 34px;
  color: $main-dark;
  p {
    margin-bottom: 0;
    font-family: $sours-sans-p-font;
    font-size: 14px;
  }
  .arrow {
    &:after {
      position: absolute;
      content: '';
      width: 15px;
      height: 15px;
      background: #fcfcfc;
      right: 2px;
      transform: rotate(45deg);
      top: -16px;
      border-width: 1px;
      border-color: #d6d6d6 transparent transparent #d6d6d6;
    }
    &:before {
    }
  }
}

.delivery-tooltip {
  right: -8px;
  text-transform: initial;
}

.arrow-bottom {
  .arrow {
    &:after {
      bottom: 20px;
    }
  }
}

.arrow-right {
  .arrow {
    &:after {
      right: -25px;
      transform: rotate(-45deg);
    }
  }
}

.arrow-top {
  .arrow {
    &:after {
      bottom: 0;
      transform: rotate(-135deg);
    }
  }
}

.arrow-fixed-bottom {
  .arrow {
    &:after {
      bottom: -13px;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.left-allign {
  right: 0;
}

.right-align {
  left: 0;
  .arrow {
    &:after {
      right: 90%;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .order-toolbox {
    width: 230px;
  }
}
</style>
