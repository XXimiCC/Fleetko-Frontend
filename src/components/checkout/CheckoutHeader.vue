<template>
  <div>
    <div
      class="shipping-method__header"
      :class="{ 'header-large': navs.length > 3 }"
    >
      <div class="container">
        <div class="item" id="step-item" v-for="item in navs">
          <div
            class="icon"
            :class="{ active: item.active, disabled: item.disabled }"
          >
            <component :is="item.icon"></component>
            <div class="decorator-wrap">
              <div
                :class="{
                  item__decorator: item.decoration,
                  item__disabled: item.decorationDisabled
                }"
                class="decorator"
              >
                <div id="decorator-line" class="line"></div>
              </div>
            </div>
          </div>
          <h3 :class="{ 'grey-out': item.disabled }">{{ item.name }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'Checkout',
  data () {
    return {}
  },
  props: ['navs'],
  methods: {
    setDecoratorWidth () {
      let newWidth = $('#step-item').width()

      $('.line').width(newWidth)
    }
  },
  computed: {},
  beforeDestroy () {
    $(window).off('resize')
  },
  mounted () {
    this.setDecoratorWidth()

    $(window).resize(() => {
      this.setDecoratorWidth()
    })
  }
}
</script>

<style lang="scss" scoped="">
.shipping-method {
  padding-top: 34px;
  &__header {
    position: relative;
    padding-bottom: 33px;
    .container {
      display: flex;
      justify-content: center;
    }
    .item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 33.3%;
      .decorator-wrap {
        position: absolute;
        top: 0;
        width: 64px;
        height: 64px;
      }
      &__decorator {
        position: relative;
        .line {
          position: absolute;
          left: 100%;
          top: 28px;
          width: 372px;
          height: 4px;
          background: $main-color;
        }
      }
      &__disabled {
        position: relative;
        .line {
          background: $grey;
        }
      }
      .icon {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 64px;
        height: 64px;
        border-radius: 100%;
        border: 1px solid $main-color;
        background: white;
        svg {
          width: 24px;
          height: 24px;
          fill: $main-color;
        }
        &.active {
          background: $main-color;
          svg {
            fill: white;
          }
        }
        &.disabled {
          border: 1px solid $grey;
          svg {
            fill: $grey;
          }
        }
      }
      h3 {
        margin-top: 24px;
        margin-bottom: 0;
        color: $main-color;
      }
      .grey-out {
        color: $grey;
      }
    }
    &:after {
      position: absolute;
      content: '';
      bottom: 0;
      height: 1px;
      width: 100%;
      left: 0;
      background: $interface-decoration-color;
    }
  }
}

.header-large {
  .item {
    width: 25%;
    &__decorator {
      .line {
        width: 280px;
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .shipping-method {
    &__header {
      .item {
        .icon {
          width: 48px;
          height: 48px;
        }
        h3 {
          font-size: 14px;
          text-align: center;
        }
        .decorator-wrap {
          position: absolute;
          top: 0;
          width: 48px;
          height: 48px;
        }
        &__decorator {
          position: relative;
          .line {
            top: 20px;
          }
        }
      }
    }
  }
  .header-large {
    .item {
      .decorator-wrap {
      }
      &__decorator {
        &:after {
        }
      }
    }
  }
}

@media (min-width: $xssm) and (max-width: $sm) {
  .shipping-method {
    &__header {
      .item {
        .icon {
          width: 48px;
          height: 48px;
        }
        h3 {
          font-size: 14px;
        }
        .decorator-wrap {
          position: absolute;
          top: 0;
          width: 48px;
          height: 48px;
        }
        &__decorator {
          position: relative;
          .line {
            top: 20px;
          }
        }
      }
      .item + .item {
        margin-left: auto;
      }
    }
  }
  .header-large {
    .item {
      h3 {
        font-size: 12px;
      }
      .decorator-wrap {
      }
      &__decorator {
        &:after {
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .shipping-method {
    &__header {
      .item {
        text-align: center;
        .icon {
          width: 48px;
          height: 48px;
        }
        h3 {
          max-width: 80px;
          font-size: 12px;
        }
        .decorator-wrap {
          position: absolute;
          top: 0;
          width: 48px;
          height: 48px;
        }
        &__decorator {
          position: relative;
          .line {
            top: 20px;
          }
        }
      }
      .item + .item {
        margin-left: auto;
      }
    }
  }
  .header-large {
    .item {
      .icon {
        width: 32px;
        height: 32px;
        svg {
          width: 16px;
          height: 16px;
        }
      }
      h3 {
        margin-top: 8px;
      }
      .decorator-wrap {
        width: 32px !important;
        height: 32px !important;
      }
      &__decorator {
        position: relative;
        .line {
          top: 12px;
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: 440px) {
  .shipping-method {
    &__header {
      .item {
        text-align: center;
        .icon {
          width: 48px;
          height: 48px;
        }
        .decorator-wrap {
          position: absolute;
          top: 0;
          width: 48px;
          height: 48px;
        }
        &__decorator {
          position: relative;
          &:after {
            content: '';
            position: absolute;
            left: 100%;
            top: 20px;
            height: 4px;
            background: $main-color;
          }
        }
        &__disabled {
          position: relative;
          &:after {
            background: $grey;
          }
        }
      }
      .item + .item {
        margin-left: auto;
      }
    }
  }
  .header-large {
    .item {
      .icon {
        width: 32px;
        height: 32px;
        svg {
          width: 16px;
          height: 16px;
        }
      }
      h3 {
        margin-top: 8px;
      }
      .decorator-wrap {
        width: 32px !important;
        height: 32px !important;
      }
      &__decorator {
        &:after {
          top: 12px !important;
        }
      }
    }
  }
}
</style>
