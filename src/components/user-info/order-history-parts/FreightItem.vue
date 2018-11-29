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

        <shipping-address
          v-if="order.shipping_address"
          :order="order"
        ></shipping-address>
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
              <svg-address></svg-address><span>Look at the map</span>
            </button>
          </div>
        </div>
      </div>

      <div
        class="check-wrap"
        :class="{ abandoned: order.status === 'abandoned' }"
      >
        <div class="check">
          <div class="check--top">
            <div v-if="order.status === 'draft'" class="draft-info">
              <div class="draft-info__flex-wrap">
                <svg-info-outline height="20" width="20"></svg-info-outline>
              </div>
              <span
                >The delivery price is being specified. We will inform you when
                the shipping cost will be calculated and you will be able to pay
                the order.</span
              >
            </div>

            <div v-if="order.status === 'pending_payment'" class="draft-info">
              <div class="draft-info__flex-wrap">
                <svg-info-outline height="20" width="20"></svg-info-outline>
              </div>
              <span
                >Order must be paid within 24 hours, otherwise the order will be
                assigned the Payment Expired status.</span
              >
            </div>

            <div v-if="order.status === 'pending_review'" class="draft-info">
              <div class="draft-info__flex-wrap">
                <svg-info-outline height="20" width="20"></svg-info-outline>
              </div>
              <span
                >We are looking for you the most profitable and fastest way of
                delivery. The shipping cost will be set in 24 hours after what
                you will be able to pay the order.</span
              >
            </div>

            <div v-if="showPayButton(order)" class="check--pay">
              <button
                @click="gotToPaymentMethod"
                class="button-prime left-icon"
                :disabled="
                  order.status === 'draft' || order.status === 'pending_review'
                "
              >
                <svg-payment-icon></svg-payment-icon>
                <span>Pay Now</span>
              </button>
            </div>

            <div v-if="showPrintButton(order)" class="check--print">
              <a target="_blank" :href="order.invoice_url">
                <button class="button-prime left-icon">
                  <svg-print></svg-print><span>Print invoice</span>
                </button>
              </a>
            </div>

            <div v-if="showCancelButton(order)" class="check--cancel">
              <button @click="abandoneOrder(order)" class="button-second">
                abandon
              </button>
            </div>
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
              <span class="label">Products</span
              ><span class="value">$ {{ toDollarDecimal(order.price) }}</span>
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
            <div v-if="order.shipping_fee" class="item">
              <span class="label">Shipping</span>
              <span class="value"
                >$ {{ toDollarDecimal(order.shipping_fee) }}</span
              >
            </div>
            <div class="total">
              <span class="label">Total:</span>
              <div class="total--flex-wrap">
                <span class="value">$ {{ toDollarDecimal(totalCost()) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <order-products :products="order.products"></order-products>
    </div>
  </div>
</template>

<script>
import ShippingAddress from './ShippingAddress'
import OrderHeader from './OrderHeader'
import OrderProducts from './OrderProducts'

export default {
  name: 'freight-item',
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
    totalCost () {
      if (
        this.order.status === 'draft' ||
        this.order.status === 'pending_payment' ||
        this.order.status === 'payment_expired' ||
        this.order.status === 'failed' ||
        this.order.status === 'pending_review'
      ) {
        return this.order.price + this.order.sales_tax_amount
      } else {
        return this.order.total_cost
      }
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
      return (
        order.status === 'pending_payment' ||
        order.status === 'draft' ||
        order.status === 'pending_review'
      )
    },
    showPayButton (order) {
      return (
        order.status === 'pending_payment' ||
        order.status === 'draft' ||
        order.status === 'pending_review'
      )
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
      if (this.order.status !== 'draft') {
        this.$router.push({
          name: 'payment-method',
          query: Object.assign({}, this.$route.query, { order: this.order.id })
        })
      }
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
    ShippingAddress
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
        font: 500 16px $montserrat-font;
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
      padding: 0 16px 16px 16px;
      background: white;
      border: 1px solid $main-color;
      border-radius: 4px;
      &--top {
        padding-top: 16px;
      }
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
        padding-top: 16px;
        &.m-0 {
          padding-top: 0;
        }
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
          &--flex-wrap {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-end;
            text-align: right;
            align-items: center;
            .draft-info-price {
              margin-bottom: 0;
              margin-top: 4px;
              width: 100%;
              font-size: 12px;
              font-family: $sours-sans-p-font;
              color: $main-grey;
            }
          }
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
          }
        }
      }
    }
  }
}

.check-wrap.abandoned {
  .check--top {
    display: none;
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

@media (min-width: $md) {
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

@media (max-width: $sm) {
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
    .item {
      .order--track__title {
        font: 500 14px $montserrat-font;
      }
      .number {
        font: 500 14px $montserrat-font;
      }
    }
    .item + .item {
      margin-top: 16px;
    }
  }
}

@media (min-width: $xs) and (max-width: $md) {
  .order {
    &--track {
      margin-bottom: 30px;
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
    .check-wrap {
      position: relative;
      top: auto;
      right: auto;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .order {
    &--track {
      .item {
        width: 100%;
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
