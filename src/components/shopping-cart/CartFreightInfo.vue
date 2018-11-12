<template>
  <div class="freight-info">
    <div class="freight-info--text freight-info--text-desktop">
      <span>Products with such a label</span><svg-freight></svg-freight
      ><span
        >are too large for transportation by delivery services. Therefore, we
        provide freight delivery services. The shipping price will be set after
        you create the order. Also you can pick up the goods yourself from the
        warehouse. If there are small items in the shopping cart, they will be
        placed in a separate order.</span
      >
    </div>

    <div class="freight-info--text freight-info--text-mobile">
      <span>Products with such a label</span><svg-freight></svg-freight
      ><span>{{ displayedText() }}</span>
      <span
        v-if="!responsiveFullFreightInfo"
        @click="responsiveFullFreightInfo = true"
        class="more"
        >More</span
      >
      <span v-else @click="responsiveFullFreightInfo = false" class="more"
        >Hide</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'cart-freight-info',
  data () {
    return {
      responsiveFullFreightInfo: false
    }
  },
  methods: {
    displayedText () {
      const text =
        'are too large for transportation by delivery services. Therefore, we provide\n' +
        '                                        freight delivery services. The shipping price will be set after you create the order. Also you can pick up the goods\n' +
        '                                        yourself from the warehouse. If there are small items in the shopping cart, they will be placed in a separate order.'

      return this.responsiveFullFreightInfo
        ? this.cutText(text, text.length)
        : this.cutText(text, 162)
    }
  }
}
</script>

<style scoped lang="scss">
.freight-info {
  padding: 16px;
  width: 100%;
  flex: 0 0 100%;
  display: flex;
  border-radius: 4px;
  background: #e7eefd;
  border: 1px solid $main-color;
  &--text {
    span {
      margin-bottom: 0;
      font-family: $sours-sans-p-font;
      font-size: 14px;
      color: $main-dark;
      line-height: 21px;
    }
    svg {
      margin: -3px 8px;
      width: 18px;
      height: 18px;
      fill: $main-dark;
    }
  }
  &--text-mobile {
    display: none;
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .freight-info {
    background: #e7eefd;
    &--text-desktop {
      display: none;
    }
    &--text-mobile {
      display: block;
      .more {
        color: $main-color;
        cursor: pointer;
      }
    }
  }
}
</style>
