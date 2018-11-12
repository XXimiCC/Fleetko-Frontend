<template>
  <div
    class="input"
    :class="{
      manual: manual,
      warning: invalidAmount,
      'input-error': exceededAmount
    }"
  >
    <error-box
      v-if="exceededAmount"
      @hide="clearErrors"
      :notification="{
        type: 'error',
        text: 'Exceeded the allowable limit of items in the warehouse',
        cancelable: true,
        delay: hideErrorTimeout
      }"
    >
    </error-box>
    <error-box
      v-if="invalidAmount && !exceededAmount"
      @hide="clearErrors"
      :notification="{
        type: 'warning',
        text: 'Possible limit was reached',
        cancelable: true,
        delay: hideErrorTimeout
      }"
    >
    </error-box>

    <button
      @click="decreaseQuantity"
      :disabled="min ? inputValue < min : inputValue < 1"
    >
      <svg-remove></svg-remove>
    </button>

    <input
      v-model="inputValue"
      @input="checkQuantity"
      @blur="setMinValue"
      placeholder="0"
      maxlength="2"
      type="text"
    />

    <button @click="increaseQuantity" :disabled="inputValue >= inputMax">
      <svg-add></svg-add>
    </button>
  </div>
</template>

<script>
import ErrorBox from '@/components/notifications/ErrorBox'
import _ from 'lodash'

export default {
  name: 'QuantityInput',

  components: { ErrorBox },

  props: ['initialValue', 'warehouse', 'product', 'userCart', 'min', 'manual'],

  data () {
    return {
      inputValue: this.initialValue || null,
      currentQtyInWarehouse: 0,
      WAREHOUSE_MAX_SIZE: 50,
      inputMax: 50,
      invalidAmount: false,
      exceededAmount: false,
      hideErrorTimeout: 5000
    }
  },

  created () {
    this.checkQuantity()
  },

  methods: {
    increaseQuantity () {
      this.inputValue = Number(this.inputValue) + 1

      if (this.inputValue >= this.inputMax) this.invalidAmount = true

      this.checkQuantity()
    },

    decreaseQuantity () {
      this.inputValue = Number(this.inputValue) - 1

      this.setMinValue()
      this.clearErrors()
      this.checkQuantity()
    },

    resetQuantity () {
      this.inputValue = 0

      this.setMinValue()
      this.clearErrors()
      this.checkQuantity()
    },

    setMinValue () {
      if (!Number(this.inputValue)) { this.inputValue = this.min ? this.min - 1 : null }
    },

    checkQuantity (event) {
      if (event) this.inputValue = event.target.value.replace(/^0+|\D/g, '')

      this.correctQuantity()

      let expectedQty = Number(this.inputValue)

      let warehouseInCart = this.warehouse
        ? this.userCart.cart[this.warehouse.id]
        : null

      this.currentQtyInWarehouse = warehouseInCart
        ? _.get(warehouseInCart, `products[${this.product.id}].quantity`, 0)
        : 0

      let productsInWarehouse = warehouseInCart
        ? Object.keys(warehouseInCart.products).reduce((totalQty, product) => {
            return totalQty + warehouseInCart.products[product].quantity
          }, 0)
        : 0

      let totalQuantity = productsInWarehouse + expectedQty

      if (totalQuantity > this.WAREHOUSE_MAX_SIZE) {
        expectedQty = this.WAREHOUSE_MAX_SIZE - productsInWarehouse

        this.exceededAmount = true
        this.inputValue = expectedQty
      }

      this.$emit(
        'setQuantity',
        this.currentQtyInWarehouse + expectedQty,
        this.warehouse,
        expectedQty
      )
    },

    correctQuantity () {
      if (this.inputValue > this.WAREHOUSE_MAX_SIZE) {
        this.invalidAmount = true
        this.inputValue = this.WAREHOUSE_MAX_SIZE
        this.inputMax = this.WAREHOUSE_MAX_SIZE
      }

      if (!this.warehouse) return

      let spareStock =
        this.warehouse.product.quantity - this.currentQtyInWarehouse

      if (this.inputValue > spareStock) {
        this.invalidAmount = true
        this.inputValue = spareStock
        this.inputMax = spareStock
      }
    },

    clearErrors () {
      this.invalidAmount = false
      this.exceededAmount = false
    }
  }
}
</script>

<style lang="scss" scoped>
.input {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 88px;
  height: 40px;
  padding: 4px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid rgba(180, 186, 199, 0.3);
  background-color: #fff;

  input {
    text-align: center;
    width: 30px;
    font: 16px $sours-sans-p-font;
    color: $main-dark;

    &,
    &:focus {
      border: none;
      outline: none;
    }
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 100%;
    padding: 0;
    border: none;
    border-radius: 4px;
    background-color: rgba(20, 88, 235, 0.1);
    transition: background-color 0.2s;
    cursor: pointer;
    &:hover {
      background-color: rgba(20, 88, 235, 0.3);
    }
    svg {
      fill: $main-color;
      width: 16px;
      height: 16px;
    }
    &[disabled] {
      cursor: not-allowed;
      &:hover {
        background-color: rgba(20, 88, 235, 0.1);
      }
    }
  }
}

@media (max-width: 648px) {
  .input.manual {
    width: 48px;
    height: 24px;
    padding: 0;
    input {
      width: 100%;
      border-radius: 4px;
      font-size: 14px;
      text-align: center;
      &:focus {
        outline: none;
        border: 1px solid $main-color;
      }
    }
    button {
      display: none;
    }
  }
}
</style>
