<template>
  <div
    class="order"
    :class="{
      'grey-out':
        order.status === 'failed' ||
        order.status === 'canceled' ||
        order.status === 'payment_expired' ||
        order.status === 'abandoned'
    }"
  >
    <order-header
      @toggleOrderBody="toggleOrderBody"
      :order="order"
    ></order-header>

    <div v-if="open" class="order__body">
      <div v-if="order.payment_instrument" class="order--payment">
        <div class="item">
          <span class="order--payment__title">Payment Method</span>
        </div>

        <div class="item">
          <div
            v-if="order.payment_instrument === 'credit_card'"
            class="order--payment__card-method"
          >
            <svg-payment-card></svg-payment-card>
            <span>Credit Card</span>
          </div>
          <div
            v-if="order.payment_instrument === 'paypal_account'"
            class="order--payment__paypal-method"
          >
            <svg-payment-paypal></svg-payment-paypal>
            <span>PayPal</span>
          </div>
        </div>
      </div>

      <div class="address">
        <h3 class="address--title">Warehouse Address:</h3>

        <div class="address--info">
          <div class="item">
            <label class="label">City</label>
            <p class="value">{{ order.warehouse.city }}</p>
          </div>
          <div class="item">
            <label class="label">State</label>
            <p class="value">{{ order.warehouse.state }}</p>
          </div>
          <div class="item">
            <label class="label">Address</label>
            <p class="value">
              {{ order.warehouse.address_line_1 }}
              {{ order.warehouse.address_line_2 }}
            </p>
          </div>
          <div class="item">
            <label class="label">ZIP</label>
            <p class="value">{{ order.warehouse.zip }}</p>
          </div>
          <div class="item">
            <label class="label">Phone</label>
            <p class="value">{{ formatPhoneNumber(order.warehouse.phone) }}</p>
          </div>
        </div>

        <div class="address--button">
          <button @click="openWarehouseModal" class="button-second left-icon">
            <svg-address></svg-address>
            <span>Look at the map</span>
          </button>
        </div>
      </div>

      <div
        class="check-wrap"
        :class="{
          'check-absolute': showShippingInformation(order),
          abandoned: order.status === 'abandoned'
        }"
      >
        <div class="check">
          <div class="draft-info" v-if="order.status === 'pending_payment'">
            <div class="draft-info__flex-wrap">
              <svg-info-outline height="20" width="20"></svg-info-outline>
            </div>
            <span
              >Order must be paid within 24 hours, otherwise the order will be
              assigned the Payment Expired status.</span
            >
          </div>

          <div class="check--pay" v-if="showPayButton(order)">
            <button class="button-prime" @click="gotToPaymentMethod">
              <svg-payment-icon></svg-payment-icon>
              <span>Pay Now</span>
            </button>
          </div>

          <div class="check--print" v-if="showPrintButton(order)">
            <a target="_blank" :href="order.invoice_url">
              <button class="button-prime">
                <svg-print></svg-print>
                <span>Print invoice</span>
              </button>
            </a>
          </div>

          <div class="check--cancel" v-if="showCancelButton(order)">
            <button @click="abandoneOrder(order)" class="button-second">
              abandon
            </button>
          </div>

          <div
            class="check--info"
            :class="{
              'm-0':
                order.status === 'failed' ||
                order.status === 'canceled' ||
                order.status === 'payment_expired'
            }"
          >
            <div class="item">
              <span class="label">Products</span>
              <span class="value">$ {{ toDollarDecimal(order.price) }}</span>
            </div>
            <div class="item">
              <span class="label"
                >Tax ({{
                  (order.sales_tax_rate * 100).toLocaleString('en', {
                    minimumFractionDigits: 2
                  })
                }}%)</span
              >
              <span class="value"
                >$ {{ toDollarDecimal(order.sales_tax_amount) }}</span
              >
            </div>
            <div class="total">
              <span class="label">Total:</span>
              <span class="value"
                >$ {{ toDollarDecimal(order.total_cost) }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <order-products
        v-if="order.products.length"
        :order="order"
        :products="order.products"
      ></order-products>
    </div>
  </div>
</template>

<script>
import OrderHeader from './OrderHeader'
import OrderProducts from './OrderProducts'

export default {
  name: 'pickup-item',
  data () {
    return {
      open: false
    }
  },
  props: ['order'],
  methods: {
    showShippingInformation (order) {
      return (
        order.status === 'processing' ||
        order.status === 'processed' ||
        order.status === 'fulfilled'
      )
    },
    openWarehouseModal () {
      this.$emit('openWarehouseModal', this.order.warehouse)
    },
    toggleOrderBody () {
      if (!this.isSingleOrder) this.open = !this.open
    },
    showPrintButton (order) {
      return (
        order.status === 'processing' ||
        order.status === 'processed' ||
        order.status === 'fulfilled'
      )
    },
    showCancelButton (order) {
      return order.status === 'pending_payment'
    },
    showPayButton (order) {
      return order.status === 'pending_payment'
    },
    abandoneOrder (order) {
      this.$emit('abandoneOrder', order.id)
    },
    formatPhoneNumber (s) {
      let firstDigits = s.slice(2, 5)
      let secondDigits = s.slice(5, 8)
      let thirdDigits = s.slice(8, 12)
      return `+1 (${firstDigits}) ${secondDigits}-${thirdDigits}`
    },
    gotToPaymentMethod () {
      this.$router.push({
        name: 'payment-method',
        query: Object.assign({}, this.$route.query, { order: this.order.id })
      })
    }
  },
  computed: {
    isSingleOrder () {
      return this.$route.name === 'singleOrder'
    }
  },
  components: {
    OrderHeader,
    OrderProducts
  },
  mounted () {
    this.open = this.isSingleOrder
  }
}
</script>

<style scoped lang="scss">
.order {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border: 1px solid $interface-decoration-color;
  border-radius: 4px;
  &--payment {
    width: 100%;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    &__title {
      margin-right: 64px;
      font-family: $montserrat-font;
      font-size: 16px;
      font-weight: 500;
      color: $paragraph;
    }
    .item {
      display: flex;
      align-items: center;
    }
    &__card-method {
      display: flex;
      align-items: center;
      svg {
        width: 32px;
        height: 32px;
      }
      span {
        margin-left: 16px;
        font-size: 16px;
        font-family: $montserrat-font;
        font-weight: 500;
        color: $main-dark;
      }
    }
    &__paypal-method {
      display: flex;
      align-items: center;
      svg {
        width: 20px;
        height: 32px;
      }
      span {
        margin-left: 16px;
        font-size: 16px;
        font-family: $montserrat-font;
        font-weight: 500;
        color: $main-dark;
      }
    }
  }
  &__body {
    width: 100%;
    position: relative;
    padding: 32px 32px 32px 32px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    &:before {
      position: absolute;
      content: '';
      height: 1px;
      width: 100%;
      left: 0;
      top: 0;
      background: $interface-decoration-color;
    }
    .address {
      margin-top: 0;
      &--title {
        margin-bottom: 0;
        line-height: 1;
        color: $main-dark;
      }
      &--info {
        margin-top: 16px;
        padding-left: 8px;
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
      &--button {
        margin-top: 24px;
        button {
          display: flex;
          align-items: center;
          width: 150px;
          height: 32px;
          svg {
            width: 17px;
          }
          span {
            text-transform: none;
          }
        }
      }
    }
    .check {
      width: 320px;
      padding: 16px;
      background: white;
      border: 1px solid $main-color;
      border-radius: 4px;
      .draft-info {
        margin-bottom: 16px;
        display: flex;
        &--flex-wrap {
          width: 22px;
        }
        svg {
          width: 22px;
          fill: $svg-fill-tertiary;
        }
        span {
          margin-top: -4px;
          margin-left: 14px;
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $main-grey;
          line-height: 18px;
        }
      }
      &--info {
        margin-top: 32px;
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 1;
          .label {
            font-family: $montserrat-font;
            font-size: 16px;
            color: $main-dark;
          }
          .value {
            font-family: $montserrat-font;
            font-size: 16px;
            color: $main-dark;
          }
        }
        .item + .item {
          margin-top: 16px;
        }
        .total {
          margin-top: 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 1;
          .label {
            font-family: $montserrat-font;
            font-size: 20px;
            font-weight: 500;
            color: $main-color;
            text-transform: uppercase;
          }
          .value {
            font-family: $montserrat-font;
            font-size: 20px;
            font-weight: 500;
            color: $main-color;
          }
        }
      }
      &--print {
        button {
          display: flex;
          align-items: center;
          justify-content: center;
          svg {
            width: 22px;
            fill: white;
          }
          span {
            margin-left: 14px;
          }
        }
      }
      &--cancel {
        margin-top: 8px;
        button {
          height: 40px;
        }
      }
      &--pay {
        button {
          display: flex;
          align-items: center;
          justify-content: center;
          svg {
            width: 22px;
            fill: white;
          }
          span {
            margin-left: 14px;
          }
        }
      }
    }
    .check-absolute {
      position: absolute;
      right: 32px;
    }
  }
}

.check-wrap.abandoned {
  .check--info {
    margin: 0;
  }
}

.grey-out {
  background: #f7fafc;
  .check-wrap {
    position: absolute;
    right: 32px;
    top: 32px;
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .order {
    &__body {
      .check {
        width: 290px;
      }
      &--addresses {
        width: calc(100% - 300px);
      }
      .address {
        &--info {
          .item {
            display: flex;
          }
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $md) {
  .order {
    &__body {
      .check-absolute {
        margin-bottom: 24px;
        position: relative;
        right: auto;
        width: 100%;
        order: 1;
      }
      .check-wrap {
        width: 100%;
        order: 1;
      }
      .check {
        width: 100%;
      }
      .address {
        margin-top: 24px;
        order: 2;
      }
      .shipping-information {
        order: 3;
      }
      .cart {
        order: 4;
      }
    }
  }

  .grey-out {
    .check-wrap {
      position: relative;
      top: auto;
      right: auto;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .order {
    &__body {
      padding: 16px;
      &--addresses {
        flex-wrap: wrap;
      }
      .shipping-address {
        margin-bottom: 40px;
      }
      .address {
        width: 100%;
        &--info {
          .item {
            display: flex;
          }
        }
      }
    }
  }
}
</style>
