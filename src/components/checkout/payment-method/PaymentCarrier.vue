<template>
  <div class="payment-carrier">
    <div class="payment-carrier--title"><h3>Select Carrier</h3></div>
    <div class="payment-carrier--info">
      <span class="label">Shipping Address</span>
      <span v-if="order" class="value"
        >{{ order.shipping_address.address_line_1 }}
        {{
          order.shipping_address.address_line_2
            ? order.shipping_address.address_line_2
            : ''
        }}
        {{ order.shipping_address.city }}, {{ order.shipping_address.state }}
        {{ order.shipping_address.zip }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'payment-carrier',
  data () {
    return {}
  },
  props: ['order']
}
</script>

<style scoped lang="scss">
.payment-carrier {
  margin-top: 32px;
  &--title {
    text-align: center;
    h3 {
      color: $main-dark;
      margin-bottom: 32px;
    }
  }
  &--info {
    padding: 12px 16px;
    width: 100%;
    box-shadow: 0px 3px 6.58px 0.42px rgba(0, 0, 0, 0.05),
      0px 0px 9.8px 0.2px rgba(0, 0, 0, 0.02);
    line-height: 1;
    .label {
      color: $paragraph;
      font-family: $sours-sans-p-font;
      font-size: 14px;
    }
    .value {
      margin-left: 64px;
      color: $main-dark;
      font-family: $sours-sans-p-font;
      font-size: 14px;
    }
  }
}
@media (min-width: $xs) and (max-width: $sm) {
  .payment-carrier {
    &--info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .label {
        width: 100%;
      }
      .value {
        margin-top: 8px;
        margin-left: 0;
      }
    }
  }
}
</style>
