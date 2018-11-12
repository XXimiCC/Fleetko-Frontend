<template>
  <div class="address shipping-address">
    <h3 class="address--title">Shipping Address:</h3>
    <div class="address--info">
      <div
        class="item"
        :class="{ 'large-name': checkNameLength(order.shipping_address.name) }"
      >
        <label class="label">Full name</label>
        <p class="value">{{ order.shipping_address.name }}</p>
      </div>
      <div class="item">
        <label class="label">Address</label>
        <p class="value">{{ order.shipping_address.address_line_1 }}</p>
      </div>
      <div class="item">
        <label class="label">Address Line 2</label>
        <p class="value">{{ order.shipping_address.address_line_2 }}</p>
      </div>
      <div class="item">
        <label class="label">City</label>
        <p class="value">{{ order.shipping_address.city }}</p>
      </div>
      <div class="item">
        <label class="label">State</label>
        <p class="value">{{ order.shipping_address.state }}</p>
      </div>
      <div class="item">
        <label class="label">ZIP</label>
        <p class="value">{{ order.shipping_address.zip }}</p>
      </div>
      <div class="item">
        <label class="label">Phone</label>
        <p class="value">
          {{ formatPhoneNumber(order.shipping_address.phone) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'shipping-address',
  props: ['order'],
  methods: {
    checkNameLength (name) {
      return name.length > 30
    },
    formatPhoneNumber (s) {
      let firstDigits = s.slice(2, 5)
      let secondDigits = s.slice(5, 8)
      let thirdDigits = s.slice(8, 12)
      return `+1 (${firstDigits}) ${secondDigits}-${thirdDigits}`
    }
  }
}
</script>

<style scoped lang="scss">
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
    .large-name {
      position: relative;
      .label {
        width: 92px;
        position: absolute;
        top: 0;
        left: 0;
      }
      .value {
        margin-top: -2px;
        margin-left: 128px;
        max-width: 200px;
        line-height: 19px;
      }
    }
  }
  &--button {
    margin-top: 24px;
    button {
      padding-left: 14px;
      display: flex;
      align-items: center;
      width: 150px;
      height: 32px;
      svg {
        width: 17px;
        fill: $main-color;
      }
      span {
        margin-left: 6px;
        color: $main-color;
        font-size: 12px;
        font-weight: 500;
        text-transform: initial;
      }
      &:hover {
        svg {
          fill: white;
        }
        span {
          color: white;
        }
      }
    }
  }
}
.shipping-address {
  margin-right: 64px;
  .label {
    min-width: 91px;
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .shipping-address {
    margin-right: 5%;
    width: 45%;
  }
  .address {
    &--info {
      .item {
        display: flex;
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .shipping-address {
    margin-bottom: 40px;
  }
  .address {
    &--info {
      .item {
        display: flex;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .shipping-address {
    margin-right: 0;
  }
  .address {
    &--info {
      .item {
        display: flex;
      }
    }
  }
}
</style>
