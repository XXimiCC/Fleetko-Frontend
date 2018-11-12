<template>
  <div class="address shipping-information">
    <div class="shipping-information--main">
      <h3>Shipping Information:</h3>
      <div class="shipping-information--main__body">
        <div class="column">
          <div class="item carrier">
            <label class="label">Carrier</label>
            <p class="value">
              <svg-ups
                v-if="order.shipping_rate.carrier === 'UPS'"
                class="ups"
                :viewBox="
                  $mq === 'sm' || $mq === 'xs' ? '0 0 60 60' : '-3 0 60 60'
                "
              >
              </svg-ups>
              <svg-usps
                v-if="order.shipping_rate.carrier === 'USPS'"
                class="usps"
              >
              </svg-usps>
              <svg-fedex
                v-if="order.shipping_rate.carrier === 'FEDEX'"
                class="fedex"
              >
              </svg-fedex>
            </p>
          </div>
          <div class="item" v-if="order.shipping_rate.name">
            <label class="label">Name</label>
            <p class="value">{{ order.shipping_rate.name }}</p>
          </div>
          <div class="item" v-if="order.shipping_rate.days">
            <label class="label">Days</label>
            <p class="value">{{ order.shipping_rate.days }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'shipping-information',
  props: ['order'],
  data () {
    return {
      showNotify: false
    }
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.address {
  margin-top: 32px;
}

.shipping-information {
  width: 100%;
  &--main {
    margin-bottom: 10px;
    h3 {
      margin-bottom: 18px;
      color: $main-dark;
    }

    &__body {
      display: flex;
      .carrier {
        display: flex;
        align-items: center;
        .ups {
          width: 27px;
          height: 32px;
        }
        .usps {
          width: 128px;
        }
        .fedex {
          width: 40px;
          margin-left: 4px;
          opacity: 0.8;
        }
      }

      .column {
        &:first-child {
          padding-left: 8px;
        }
        .item {
          line-height: 1;
        }
        .item + .item {
          margin-top: 12px;
        }
        .label {
          margin-bottom: 0;
          min-width: 50px;
          color: $main-grey;
          font-size: 14px;
          font-family: $sours-sans-p-font;
          font-weight: 600;
          line-height: 1;
        }
        .value {
          margin-bottom: 0;
          display: inline-block;
          margin-left: 36px;
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $main-dark;
          line-height: 1;
        }
      }

      .description {
        margin-left: 100px;
        max-width: 385px;
        &--title {
          font-family: $montserrat-font;
          font-size: 14px;
          font-weight: 600;
          color: $main-dark;
        }
        &--text {
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: #455a64;
        }
      }
    }
  }
}
</style>
