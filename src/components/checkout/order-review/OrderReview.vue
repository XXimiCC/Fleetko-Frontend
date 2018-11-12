<template>
  <div class="order-review">
    <checkout-header :navs="navs"></checkout-header>
    <div class="order-review__body">
      <div class="order-review__body--title">
        <h2>Thank You For Ordering With Us</h2>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-md-6 order-review__body--info">
            <div class="order-review__body--info-title">
              <h3>Information</h3>
            </div>
            <div class="order-review__body--info-body" v-if="order">
              <div class="info-row">
                <div class="label">Payment method</div>
                <div
                  class="value"
                  v-if="order.payment_instrument === 'paypal_account'"
                ></div>
                <div
                  class="value order-review__card-method"
                  v-if="order.payment_instrument === 'credit_card'"
                >
                  <svg-payment-card></svg-payment-card>
                  <span>Credit Card</span>
                </div>
                <div
                  class="value order-review__paypal-method"
                  v-if="order.payment_instrument === 'paypal_account'"
                >
                  <svg-payment-paypal></svg-payment-paypal>
                  <span>PayPal</span>
                </div>
              </div>
              <div
                class="info-row"
                v-if="
                  order.shipping_method !== 'pickup' &&
                    order.shipping_method !== 'freight'
                "
              >
                <div class="label">Delivery</div>
                <div class="value">
                  {{ order.shipping_rate.carrier }}
                  {{ order.shipping_rate.name }} $
                  {{ toDollarDecimal(order.shipping_rate.price) }}
                </div>
              </div>
              <div class="info-row">
                <div class="label">Billing Address</div>
                <div class="value">{{ billingAddress }}</div>
              </div>
              <div class="description" v-if="order.user_comment">
                <p>{{ order.user_comment }}</p>
              </div>
              <div class="print-invoice">
                <a target="_blank" :href="order.invoice_url">
                  <button class="button-prime">
                    <svg-print></svg-print>
                    <span>Print Invoice</span>
                  </button>
                </a>
              </div>
              <div class="to-order-history">
                <router-link :to="{ name: 'orderHistory' }">
                  <button class="button-second">
                    Proceed to Order history
                  </button>
                </router-link>
              </div>
            </div>
          </div>
          <div class="col-md-6 order-review__body--summary">
            <div class="order-review__body--info-summary">
              <h3>Order Summary</h3>
            </div>
            <div class="order-review__body--summary-body" v-if="order">
              <div class="warehouse">
                <div class="warehouse__heading">
                  <span class="name">{{ order.warehouse.city }}</span>
                  <!--
                    <span class="price">$ {{toDollarDecimal(order.price)}}</span>
                  -->
                </div>
                <div class="warehouse__products">
                  <div
                    class="warehouse--product"
                    v-for="product in order.products"
                  >
                    <div class="item">
                      <p class="name">{{ product.name }}</p>
                    </div>
                    <div class="item">
                      <p class="total">
                        $
                        {{ toDollarDecimal(product.price * product.quantity) }}
                      </p>
                      <p class="quantity">
                        $ {{ toDollarDecimal(product.price) }} *
                        {{ product.quantity }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="prices">
                <div class="prices--row">
                  <span class="label">Subtotal</span>
                  <span class="value main-color"
                    >$ {{ toDollarDecimal(order.price) }}</span
                  >
                </div>
                <div class="prices--row">
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
                <div class="prices--row">
                  <span class="label">Shipping</span>
                  <span class="value"
                    >$ {{ toDollarDecimal(order.shipping_fee) }}</span
                  >
                </div>
              </div>
              <div class="total-block">
                <span class="label">Total</span>
                <span class="value"
                  >$ {{ toDollarDecimal(order.total_cost) }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import CheckoutHeader from '../CheckoutHeader'
export default {
  name: 'order-review',
  data () {
    return {
      order: null,
      enableInvoiceButton: false,
      invoiceToken: '',
      navs: [
        {
          name: 'Shopping Cart',
          active: true,
          disabled: false,
          icon: 'svg-basket',
          decoration: true
        },
        {
          name: 'Shipping Method',
          active: true,
          disabled: false,
          icon: 'svg-freight',
          decoration: true,
          decorationDisabled: false
        },
        {
          name: 'Review & Method',
          active: true,
          disabled: false,
          icon: 'svg-credit-card',
          decoration: true,
          decorationDisabled: false
        },
        {
          name: 'Order Review',
          active: true,
          disabled: false,
          icon: 'svg-event-note',
          decoration: false
        }
      ]
    }
  },
  methods: {
    checkOrderStatus () {
      if (this.order.status !== 'processing') {
        this.$router.push({ name: 'not-found' })
      }
    },
    fetchOrder () {
      this.$store
        .dispatch('fetchOrder', this.$route.query.order)
        .then(response => {
          this.order = response.data

          this.checkOrderStatus()
          this.groupOrderProducts(response.data)
        })
    },
    groupOrderProducts (order) {
      let group = _.groupBy(order.order_items, 'product_id')
      let products = []

      // eslint-disable-next-line
      for (let [key, value] of Object.entries(group)) {
        products.push({
          dealer_id: value[0].product.dealer_id,
          dealer_name: value[0].product.dealer_name,
          description: value[0].product.description,
          id: value[0].product.id,
          freight: value[0].product.freight,
          name: value[0].product.name,
          price: value[0].price,
          part_number: value[0].product.part_number,
          sku: value[0].product.sku,
          quantity: value.length
        })
      }
      this.order.products = products
    }
  },
  computed: {
    billingAddress () {
      return `${this.order.billing_address.address_line_1}
         ${
           this.order.billing_address.address_line_2
             ? this.order.billing_address.address_line_2
             : ''
         },
         ${this.order.billing_address.state}, ${this.order.billing_address.zip}`
    }
  },
  components: {
    CheckoutHeader
  },
  created () {
    this.fetchOrder()
  }
}
</script>

<style scoped lang="scss">
.order-review {
  margin-bottom: 120px;
  margin-top: 32px;
  &__card-method {
    display: flex;
    align-items: center;
    svg {
      width: 32px;
      height: 32px;
    }
    span {
      margin-left: 16px;
      font-family: $sours-sans-p-font;
      font-size: 16px;
      color: $main-dark;
      font-weight: 600;
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
      font-family: $sours-sans-p-font;
      font-size: 16px;
      color: $main-dark;
      font-weight: 600;
    }
  }
  &__body {
    margin-top: 64px;
    &--title {
      margin-bottom: 78px;
      text-align: center;
      h2 {
        margin-bottom: 0;
        color: $main-dark;
      }
    }
    &--info {
    }
    &--info-title {
      h3 {
        margin-bottom: 32px;
        color: $main-dark;
      }
    }
    &--info-body {
      padding: 36px 32px;
      border: 1px solid $interface-decoration-color;
      border-radius: 4px;
      .info-row {
        display: flex;
        align-items: center;
        line-height: 1;
        .label {
          margin-right: 46px;
          width: 120px;
          font-family: $sours-sans-p-font;
          font-size: 14px;
          font-weight: 600;
          color: $main-dark;
        }
        .value {
          font-family: $sours-sans-p-font;
          font-size: 16px;
          color: $main-dark;
        }
      }
      .info-row + .info-row {
        margin-top: 24px;
      }
      .description {
        margin-top: 32px;
        p {
          margin-bottom: 0;
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $main-dark;
        }
      }
      .print-invoice {
        margin-top: 28px;
        button {
          display: flex;
          align-items: center;
          justify-content: center;
          svg {
            margin-right: 16px;
            fill: white;
          }
        }
      }
      .to-order-history {
        margin-top: 8px;
        button {
          height: 40px;
        }
      }
    }
    &--summary {
    }
    &--info-summary {
      h3 {
        margin-bottom: 32px;
        color: $main-dark;
      }
    }
    &--summary-body {
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: #eceff1;
      }
      .warehouse {
        padding: 32px;
        &__heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .name {
            font-family: $montserrat-font;
            font-size: 20px;
            font-weight: 500;
            color: $main-dark;
          }
          .price {
            font-family: $montserrat-font;
            font-size: 16px;
            font-weight: 500;
            color: $main-color;
          }
        }
        &__products {
        }
        &--product {
          padding-top: 16px;
          padding-bottom: 16px;
          padding-left: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 1;
          .name {
            max-width: 170px;
            color: $main-dark;
            font-family: $montserrat-font;
            font-size: 12px;
            margin-bottom: 0;
            line-height: 19px;
          }
          .total {
            margin-bottom: 6px;
            font-family: $montserrat-font;
            font-size: 12px;
            color: $main-dark;
            text-align: right;
          }
          .quantity {
            margin-bottom: 0;
            font-family: $montserrat-font;
            font-size: 12px;
            color: $paragraph;
            text-align: right;
          }
        }
      }
      .prices {
        position: relative;
        padding: 32px 32px;
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: #eceff1;
        }
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: #eceff1;
        }
        &--row {
          display: flex;
          justify-content: space-between;
          .label {
            color: $main-dark;
            font-family: $montserrat-font;
            font-size: 16px;
          }
          .value {
            font-size: 16px;
            font-weight: 500;
            font-family: $montserrat-font;
            color: $main-dark;
          }
          .main-color {
            color: $main-color;
          }
        }
        .prices--row + .prices--row {
          margin-top: 16px;
        }
      }
      .total-block {
        position: relative;
        padding: 16px 32px 24px 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: #eceff1;
        }
        .label {
          font-size: 34px;
          font-family: $montserrat-font;
          font-weight: 500;
          color: $main-dark;
          text-transform: uppercase;
        }
        .value {
          font-size: 34px;
          font-family: $montserrat-font;
          font-weight: 500;
          color: $main-color;
        }
      }
    }
  }
}
@media (min-width: 767px) and (max-width: $md) {
  .order-review {
    &__body {
      &--info-body {
        padding: 32px;
        .info-row {
          .label {
            margin-right: 16px;
            flex: 0 0 80px;
            font-size: 14px;
          }
        }
      }
      &--summary-body {
        .total-block {
          .label {
            font-size: 24px;
          }
          .value {
            font-size: 24px;
          }
        }
      }
    }
  }
}
@media (min-width: $sm) and (max-width: 767px) {
  .order-review {
    &__body {
      &--title {
        margin-bottom: 64px;
      }
      &--info {
        max-width: 100%;
        flex: 0 0 100%;
      }
      &--summary {
        margin-top: 64px;
        max-width: 100%;
        flex: 0 0 100%;
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $lg) {
  .order-review {
    &__body {
      &--summary-body {
        .warehouse {
          &--product {
            .name {
              font-size: 16px;
              line-height: 21px;
            }
            .total {
              font-size: 16px;
            }
            .quantity {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .order-review {
    &__body {
      margin-top: 32px;
      &--title {
        margin-bottom: 32px;
        padding: 0 42px;
        h2 {
          font-size: 24px;
        }
      }
      &--info {
        max-width: 100%;
        flex: 0 0 100%;
      }
      &--info-title {
        h3 {
          margin-bottom: 16px;
        }
      }
      &--info-body {
        padding: 16px;
        .info-row {
          .label {
            margin-right: 16px;
            flex: 0 0 60px;
            font-size: 14px;
            line-height: 18px;
          }
        }
      }
      &--summary {
        margin-top: 48px;
        max-width: 100%;
        flex: 0 0 100%;
        h3 {
          margin-bottom: 28px;
        }
      }
      &--summary-body {
        .warehouse {
          padding: 16px 16px 0 16px;
        }
        .prices {
          padding: 16px 16px;
        }
        .total-block {
          padding: 16px;
          .label {
            font-size: 20px;
          }
          .value {
            font-size: 20px;
          }
        }
      }
      &--info-summary {
        padding: 0;
      }
    }
  }
}
</style>
