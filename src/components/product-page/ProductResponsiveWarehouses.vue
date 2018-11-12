<template>
  <transition name="fade">
    <div class="toolbox">
      <div class="close-wrap"><svg-close></svg-close></div>
      <div class="warehouses-list" v-for="warehouse in warehouses">
        <div class="warehouses-list--label">{{ warehouse.city }}:</div>
        <div
          :class="{
            green:
              warehouse.product.quantity > WAREHOUSE_RANGE_MAX &&
              product.status === 'active',
            grey: !product.quantity || product.status !== 'active'
          }"
          class="warehouses-list--body"
        >
          {{ productQuantity(warehouse) }}
        </div>
      </div>
      <div class="arrow"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'product-responsive-warehouses',
  data () {
    return {}
  },
  props: ['warehouses', 'product'],
  methods: {
    productQuantity (warehouse) {
      if (this.product.status !== 'active' || !warehouse.product.quantity) {
        return 'Out of stock'
      }
      if (warehouse.product.quantity > this.WAREHOUSE_RANGE_MAX) {
        return 'In stock'
      }
      if (
        warehouse.product.quantity <= this.WAREHOUSE_RANGE_MAX &&
        warehouse.product.quantity
      ) {
        return warehouse.product.quantity
      }
    }
  }
}
</script>

<style scoped lang="scss">
.toolbox {
  position: absolute;
  width: 300px;
  border-radius: 4px;
  box-shadow: 0 2px 3px 0 rgba(102, 102, 102, 0.2);
  background: #fcfcfc;
  padding: 8px 15px;
  left: 0;
  bottom: 29px;
  font-size: 12px;
  line-height: 1;
  font-family: $sours-sans-p-font;
  border: 1px solid #d6d6d6;
  color: white;
  z-index: 20;
  .close-wrap {
    display: none;
  }
  .arrow {
    position: relative;
    &:after {
      position: absolute;
      content: '';
      width: 15px;
      height: 15px;
      background: #fcfcfc;
      transform: rotate(45deg);
      bottom: -16px;
      border-style: solid;
      border-width: 1px;
      border-color: transparent #d6d6d6 #d6d6d6 transparent;
    }
  }
  .warehouses-list {
    display: flex;
    line-height: 1;
    &--label {
      width: 125px;
      font-family: $sours-sans-p-font;
      color: $main-dark;
      font-size: 14px;
    }
    &--body {
      margin-left: 32px;
      font-family: $sours-sans-p-font;
      color: $main-dark;
      font-size: 16px;
    }
    .green {
      color: $success;
    }
    .grey {
      color: $interface-decoration-color;
    }
  }
  .warehouses-list + .warehouses-list {
    margin-top: 8px;
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
</style>
