<template>
  <div>
    <div class="products" v-if="open" v-for="product in warehouse.products">
      <div class="item">
        <span class="product-name">{{ product.name }}</span>
      </div>
      <div class="item">
        <p class="product-total">
          $ {{ toDollarDecimal(product.price * product.quantity) }}
        </p>
        <p class="product-price">
          $ {{ toDollarDecimal(product.price) }} * {{ product.quantity }}
        </p>
      </div>
    </div>
    <div class="show-hide" :class="{ 'show-hide--margin': !open }">
      <span class="link-primary" v-if="open" @click="open = !open">Hide</span>
      <span class="link-primary" v-if="!open" @click="open = !open">
        View {{ Object.keys(warehouse.products).length }} more
        {{
          Object.keys(warehouse.products).length > 1 ? 'items' : 'item'
        }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'warehouse-products',
  data () {
    return {
      open: false
    }
  },
  props: ['warehouse']
}
</script>

<style scoped lang="scss">
.products {
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
        font-family: $montserrat-font;
        color: $main-dark;
        font-size: 12px;
      }
      .product-price {
        margin-bottom: 0;
        font-family: $montserrat-font;
        color: $paragraph;
        font-size: 12px;
      }
    }
  }
  .product-name {
    color: $main-dark;
    font-family: $montserrat-font;
    font-size: 12px;
    line-height: 19px;
  }
}
.show-hide {
  text-align: center;
  &--margin {
    margin-top: 16px;
  }
}
</style>
