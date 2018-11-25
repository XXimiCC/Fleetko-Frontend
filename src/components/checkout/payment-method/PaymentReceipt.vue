<template>
  <div class="check">
    <div class="check__header"><h3>Order Summary</h3></div>
    <div class="check__body">
      <div class="check__body--warehouse">
        <div class="title">
          <span class="title--city">{{ order.warehouse.city }}</span>
          <span class="title--price">$ {{ toDollarDecimal(order.price) }}</span>
        </div>
        <payment-products :products="order.products"></payment-products>
      </div>
    </div>

    <div class="check__footer">
      <div v-if="order.shipping_method !== 'pickup' && selectedService" class="check__footer--subtotal">
        <span>Shipping Price</span>
        <span>$ {{ toDollarDecimal(order.shipping_fee) }}</span>
      </div>

      <div class="check__footer--subtotal">
        <span>Tax ({{ (order.sales_tax_rate * 100).toLocaleString('en', { minimumFractionDigits: 2 })}}%)</span>
        <span>$ {{ countSalesTaxAmount() }}</span>
      </div>

      <div class="check__footer--total"><span>Total</span><span>$ {{ countTotalPrice() }}</span></div>

      <div class="check__footer--button"><slot name="treeButton"></slot></div>
    </div>
  </div>
</template>

<script>
import PaymentProducts from './PaymentProducts'

export default {
  name: 'payment-receipt',
  components: {
    PaymentProducts
  },
  props: ['order', 'selectedCarrier', 'selectedService'],
  methods: {
    countTotalPrice () {
      return this.toDollarDecimal(this.order.total_cost)
    },
    countSalesTaxAmount () {
      return this.toDollarDecimal(this.order.sales_tax_amount)
    }
  }
}
</script>

<style scoped lang="scss">
.check {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);

  &__header {
    height: 75px;
    background-color: $main-color;
    display: flex;
    align-items: center;
    justify-content: center;

    h3 {
      margin-bottom: 0;
      font: 500 20px $montserrat-font;
      color: white;
    }
  }

  &__body {
    padding: 32px 32px 0 32px;

    &--warehouse {
      margin-top: 34px;
      position: relative;
      padding-bottom: 16px;

      &:after {
        position: absolute;
        content: '';
        bottom: 0;
        height: 1px;
        width: 100%;
        background-color: #eceff1;
        left: 0;
      }

      &:first-child {
        margin-top: 0;
      }

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          width: 49%;
          white-space: pre-wrap;
          line-height: 1;
        }

        &--city {
          font: 500 16px/22px $montserrat-font;
          color: $main-dark;
        }

        &--price {
          font: 500 16px $montserrat-font;
          color: $main-color;
          text-align: right;
        }
      }

      &--products {
        padding: 16px 0 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .item {
          &:first-child {
            max-width: 170px;
            line-height: 1;
          }

          &:last-child {
            text-align: right;

            p {
              line-height: 1;
            }

            .product-total {
              margin-bottom: 6px;
              font: 12px $montserrat-font;
              color: $main-dark;
            }

            .product-price {
              margin-bottom: 0;
              font: 12px $montserrat-font;
              color: $paragraph;
            }
          }
        }

        .product-name {
          font: 12px/19px $montserrat-font;
          color: $main-dark;
        }
      }

      .show-hide {
        text-align: center;

        span {
          font: 500 12px $montserrat-font;
          color: $main-dark;
          cursor: pointer;
        }

        &--margin {
          margin-top: 16px;
        }
      }
    }
  }

  &__footer {
    padding: 24px 32px 32px 32px;

    &--total {
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 1;

      span {
        &:first-child {
          font: 600 20px $montserrat-font;
          color: $main-dark;
          text-transform: uppercase;
        }

        &:last-child {
          font: 500 20px $montserrat-font;
          color: $main-color;
        }
      }
    }

    &--subtotal {
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 1;

      span {
        &:first-child {
          font: 16px $montserrat-font;
          color: $main-dark;
        }

        &:last-child {
          font: 500 16px $montserrat-font;
          color: $main-color;
        }
      }
    }

    &--button {
      margin-top: 24px;
    }
  }
}

@media (min-width: $xs) and (max-width: $md) {
  .check {
    &__header {
      background-color: #fafcff;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);

      h3 {
        color: $main-dark;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .check {
    &__body {
      &--warehouse {
        .title {
          &--city {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
