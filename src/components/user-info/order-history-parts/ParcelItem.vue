<template>
  <div
    class="order"
    :class="{
      'grey-out':
        order.status === 'failed' ||
        order.status === 'canceled' ||
        order.status === 'payment_expired'
    }"
  >
    <order-header
      @toggleOrderBody="toggleOrderBody"
      :order="order"
    ></order-header>

    <div class="order__body" v-if="open">
      <div class="order__body--addresses">
        <div class="order--track" v-if="order.tracking_number">
          <div class="item">
            <span class="order--track__title"> Tracking Number </span>
          </div>
          <div class="item">
            <a
              :href="order.tracking_url"
              v-text="order.tracking_number"
              target="_blank"
              class="number"
              :class="{ 'number--link': order.tracking_url }"
            >
            </a>
            <div class="svg-wrap" @click="copyNumber">
              <svg-content-copy></svg-content-copy>
            </div>
            <transition name="fade">
              <div v-if="showNotify" class="notify">Copied</div>
            </transition>
          </div>
        </div>

        <div
          class="order--track"
          v-if="order.shipping_reference && !order.tracking_number"
        >
          <div class="item">
            <span class="order--track__title"> Shipping Reference </span>
          </div>
          <div class="item">
            <span v-text="order.shipping_reference" class="number"> </span>
            <div class="svg-wrap" @click="copyNumber">
              <svg-content-copy></svg-content-copy>
            </div>
            <transition name="fade">
              <div v-if="showNotify" class="notify">Copied</div>
            </transition>
          </div>
        </div>

        <div class="order--payment" v-if="order.payment_instrument">
          <div class="item">
            <span class="order--payment__title">Payment Method</span>
          </div>
          <div class="item">
            <div
              class="order--payment__card-method"
              v-if="order.payment_instrument === 'credit_card'"
            >
              <svg-payment-card></svg-payment-card>
              <span>Credit Card</span>
            </div>
            <div
              class="order--payment__paypal-method"
              v-if="order.payment_instrument === 'paypal_account'"
            >
              <svg-payment-paypal></svg-payment-paypal>
              <span>PayPal</span>
            </div>
          </div>
        </div>

        <shipping-address :order="order"></shipping-address>

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
              <p class="value">
                {{ formatPhoneNumber(order.warehouse.phone) }}
              </p>
            </div>
          </div>
          <div class="address--button">
            <button @click="openWarehouseModal" class="button-second left-icon">
              <svg-address></svg-address>
              <span>Look at the map</span>
            </button>
          </div>
        </div>
      </div>

      <shipping-information
        v-if="showShippingInformation(order)"
        :order="order"
      ></shipping-information>
      <div
        class="check-wrap"
        :class="{
          'check-absolute': showShippingInformation(order),
          abandoned: order.status === 'abandoned'
        }"
      >
        <div class="check">
          <div v-if="order.status === 'pending_payment'" class="draft-info">
            <div class="draft-info__flex-wrap">
              <svg-info-outline height="20" width="20"></svg-info-outline>
            </div>
            <span
              >Order must be paid within 24 hours, otherwise the order will be
              assigned the Payment Expired status.</span
            >
          </div>

          <div v-if="showPayButton(order)" class="check--pay">
            <button class="button-prime" @click="gotToPaymentMethod">
              <svg-payment-icon></svg-payment-icon>
              <span>Pay Now</span>
            </button>
          </div>

          <div v-if="showPrintButton(order)" class="check--print">
            <a target="_blank" :href="order.invoice_url">
              <button class="button-prime">
                <svg-print></svg-print>
                <span>Print invoice</span>
              </button>
            </a>
          </div>

          <div v-if="showPreloader(order)" class="check--preloader">
            <button class="button-prime">
              <span class="proccessing">fetching rates</span>
              <span class="ellipsis-anim"
                ><span></span><span></span><span></span
              ></span>
            </button>
          </div>

          <div v-if="showCancelButton(order)" class="check--cancel">
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
            <div class="item" v-if="order.shipping_fee">
              <span class="label">Shipping</span>
              <span class="value"
                >$ {{ toDollarDecimal(order.shipping_fee) }}</span
              >
            </div>
            <div class="total">
              <span class="label">Total:</span>
              <span class="value">$ {{ toDollarDecimal(totalCost()) }}</span>
            </div>
          </div>
        </div>
      </div>

      <order-products :products="order.products"></order-products>
    </div>
  </div>
</template>

<script>
import ShippingInformation from './ShippingInformation'
import ShippingAddress from './ShippingAddress'
import OrderHeader from './OrderHeader'
import OrderProducts from './OrderProducts'
import VueClipboard from 'vue-clipboard2'
import Vue from 'vue'

Vue.use(VueClipboard)
export default {
  name: 'parcel-item',
  data () {
    return {
      open: false,
      showNotify: false
    }
  },
  props: ['order'],
  methods: {
    copyNumber () {
      this.$copyText(
        this.order.tracking_number || this.order.shipping_reference
      )

      this.showNotify = true

      setTimeout(() => {
        this.showNotify = false
      }, 3000)
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
      return order.status === 'pending_payment' || order.status === 'draft'
    },
    showPayButton (order) {
      return order.status === 'pending_payment'
    },
    showPreloader (order) {
      return order.status === 'draft'
    },
    showShippingInformation ({
      status,
      shipping_carrier: finalCarrier,
      shipping_rate: rate
    }) {
      const rateCarrier = rate ? rate.carrier.toLowerCase() : ''
      const statusMatch = [
        'processing',
        'processed',
        'fulfilled',
        'canceled'
      ].includes(status)
      const carrierMatch =
        rateCarrier &&
        (!finalCarrier || finalCarrier.toLowerCase() === rateCarrier)

      return statusMatch && carrierMatch
    },
    abandoneOrder (order) {
      this.$emit('abandoneOrder', order.id)
    },
    totalCost () {
      if (
        this.order.status === 'pending_payment' ||
        this.order.status === 'payment_expired' ||
        this.order.status === 'failed'
      ) {
        return this.order.price + this.order.sales_tax_amount
      } else {
        return this.order.total_cost
      }
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
    OrderProducts,
    ShippingAddress,
    ShippingInformation
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
    margin-bottom: 24px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    &__title {
      margin-right: 64px;
      font-family: $montserrat-font;
      font-size: 16px;
      font-weight: 500;
      color: $main-grey;
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
  &--track {
    width: 100%;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    &__title {
      width: 206px;
      font: 500 16px $montserrat-font;
      color: $main-grey;
    }
    .item {
      display: flex;
      align-items: center;
      .number {
        font-family: $montserrat-font;
        font-size: 16px;
        font-weight: 500;
        color: $main-dark;
        &--link {
          text-decoration: underline;
        }
      }
      .svg-wrap {
        margin-left: 12px;
        display: flex;
        cursor: pointer;
        &:hover {
          svg {
            fill: $main-color;
          }
        }
      }
      svg {
        width: 16px;
        fill: $svg-fill-tertiary;
      }
      .notify {
        margin-left: 7px;
        font-size: 14px;
        color: $main-grey;
        font-family: $sours-sans-p-font;
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
    &--addresses {
      display: flex;
      flex-wrap: wrap;
      width: calc(100% - 330px);
    }
    .address {
      &--title {
        margin-bottom: 0;
        line-height: 1;
        color: $main-dark;
      }
      &--info {
        margin-top: 16px;
        padding-left: 8px;
        .item {
          display: flex;
          align-items: center;
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
          max-width: 180px;
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
      &--preloader {
        button {
          display: flex;
          align-items: baseline;
          justify-content: center;
        }
        .ellipsis-anim {
          margin-left: 7px;
          display: flex;
          span + span {
            margin-right: 4px;
          }
        }
        .ellipsis-anim span {
          width: 3px;
          margin-right: 4px;
          height: 3px;
          border-radius: 100%;
          background: white;
          opacity: 0;
          -webkit-animation: ellipsis-dot 1s infinite;
          animation: ellipsis-dot 1s infinite;
        }

        .ellipsis-anim span:nth-child(1) {
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }
        .ellipsis-anim span:nth-child(2) {
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }
        .ellipsis-anim span:nth-child(3) {
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
        }

        @-webkit-keyframes ellipsis-dot {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes ellipsis-dot {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
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
    &--track {
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    &__body {
      .check-absolute {
        margin-bottom: 24px;
        position: relative;
        right: auto;
        width: 100%;
        order: 1;
      }
      .check-wrap {
        margin-bottom: 40px;
        width: 100%;
      }
      .check {
        width: 100%;
      }
      &--addresses {
        flex: 0 0 100%;
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
    background: #f7fafc;

    .check-wrap {
      position: relative;
      right: auto;
      top: auto;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .order {
    &--payment {
      flex-wrap: wrap;
      width: 100%;
      .item {
        width: 100%;
        .order--payment__title,
        * {
          font: 500 14px $montserrat-font;
        }
      }
      .item + .item {
        margin-top: 16px;
      }
    }
    &--track {
      .item {
        width: 100%;
        .order--track__title,
        .number {
          font: 500 14px $montserrat-font;
        }
      }
      .item + .item {
        margin-top: 16px;
      }
    }
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
