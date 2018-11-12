<template>
  <div class="house" :style="bgColor" @click="toggleView">
    <span class="state">{{ house.state }}</span>
    <span class="name">
      {{ house.city }}
      <p class="address">
        {{ house.address_line_1 }} {{ house.city }}, {{ house.state }}
        {{ house.zip }}
      </p>
    </span>
    <div class="amount-controls">
      <quantity-input
        ref="quantityInput"
        :warehouse="house"
        :initialValue="expectedQuantity || house.userQuantity"
        :product="product"
        :userCart="userCart"
        :manual="manual"
        @setQuantity="calcPrice"
      >
      </quantity-input>
    </div>

    <span v-if="price > 0" class="subtotal">${{ toDollarDecimal(price) }}</span>

    <div v-if="price > 0" @click.stop="warehouseReset" class="reset">
      <button class="button-prime"><svg-close></svg-close></button>
    </div>
  </div>
</template>

<script>
import QuantityInput from '../shopping-modal-parts/QuantityInput'

export default {
  name: 'InStockHouse',
  props: ['house', 'product', 'expectedQuantity', 'userCart', 'manual'],
  data () {
    return {
      price: 0
    }
  },
  components: { QuantityInput },
  computed: {
    toggleable () {
      return this.manual && ['xs', 'sm'].includes(this.$mq)
    },
    bgColor () {
      return this.price > 0
        ? 'background: rgba(20, 88, 235, .2)'
        : 'background: #fff'
    }
  },
  methods: {
    calcPrice (qty, id, expectedQty) {
      this.price = expectedQty * this.product.price
      this.$emit('setQuantity', qty, id, this.price)
    },
    warehouseReset () {
      this.$refs.quantityInput.resetQuantity()
    },
    toggleView (click) {
      this.$emit('moveMarker', this.house)

      if (!this.toggleable || click.target.tagName === 'INPUT') return

      this.$emit('collapseWarehouses', this.house.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.house {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 0 8px 16px;
  border: 1px solid $light-grey;
  border-radius: 4px;
  margin-bottom: 4px;
  transition: background-color 0.15s;

  &:hover {
    border: 1px solid $main-color;
  }

  .state {
    width: 36px;
    margin-right: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #bdd1f9;
    font: 500 10px/17px $montserrat-font;
    color: $main-color;
    text-align: center;
  }

  .address {
    display: none;
  }

  .name {
    flex-basis: 142px;
    font: 500 12px/17px $montserrat-font;
  }

  .subtotal {
    display: block;
    margin: 0 48px 0 auto;
    font: 500 12px/17px $montserrat-font;
  }

  .reset {
    position: absolute;
    right: -1px;
    top: -1px;
    display: block;
    width: 32px;
    height: 100%;
    .button-prime {
      height: calc(100% + 2px);
      width: 100%;
      background: $main-color;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      &:hover {
        background: #1445eb;
      }
    }
    svg {
      width: 18px;
      height: 18px;
      fill: #fff;
    }
  }
}

@media (max-width: 648px) {
  .house {
    cursor: pointer;
    .name {
      flex-basis: 150px;
    }
    .state {
      display: none;
    }
    .amount-controls {
      display: none;
    }
    .reset {
      display: block;
      svg {
        margin-top: 3px;
      }
    }
  }

  .house.opened {
    border: 1px solid $main-color;
    .address {
      display: block;
      padding-top: 4px;
      font: 10px/15px $montserrat-font;
      color: $main-grey;
    }

    .amount-controls {
      display: block;
      position: absolute;
      bottom: 8px;
      right: 16px;
    }

    .subtotal {
      position: absolute;
      top: 8px;
      right: 16px;
      margin: 0;
      font-size: 10px;
    }

    .reset {
      display: none;
    }
  }
}
</style>
