<template>
  <div
    class="review-action"
    :class="{ 'review-action--single': !this.productReviews.length }"
  >
    <h4 class="h4-secondary">Do you like the product?</h4>

    <p class="paragraph-tertiary">
      Write a review about the product. Help other customers make their choice.
    </p>

    <div class="review-action__button">
      <button
        @click.stop="openRelativeTab('TabReviews')"
        class="button-prime left-icon"
      >
        <svg-create-comment></svg-create-comment>
        <span>Leave a review</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'reviews-small-action',
  props: ['purchasedProduct', 'productReviews', 'product'],
  methods: {
    openRelativeTab (tab) {
      this.$emit('openProductTab', {
        tabName: 'TabReviews',
        scroll: true
      })
    },
    openModalCart () {
      this.$store
        .dispatch('setModalProductId', this.product.slug)
        .then(response => {
          this.$store.dispatch('toggleCartModal', true)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.review-action {
  padding: 48px 0 64px 0;
  &--single {
    padding: 48px 0 0 0;
  }
  h4 {
    margin-bottom: 16px;
    text-align: center;
  }
  p {
    margin-left: auto;
    margin-right: auto;
    max-width: 80%;
    margin-bottom: 32px;
    text-align: center;
  }
  &__button {
    display: flex;
    justify-content: center;
    button {
      width: 250px;
    }
  }
}
</style>
