<template>
  <router-link :to="{ name: 'product-page', params: { slug: product.slug } }">
    <div class="product-card">
      <div class="product-card__image">
        <app-image
          :imagePath="componentProductImage(product.image)"
          :forceLoading="true"
          @emitErrorImage="errorImage"
        ></app-image>
      </div>
      <div class="product-card__name">
        <h4>{{ product.name }}</h4>
      </div>
      <div class="product-card__price">
        <h3>${{ toDollarDecimal(product.price) }}</h3>
      </div>
      <button @click="openModalCart" class="button-buy button-second left-icon">
        <svg-basket></svg-basket>
        <span>Add to cart</span>
      </button>
    </div>
  </router-link>
</template>

<script>
import utils from '@/mixins/utils'
import AppImage from '../parts/AppImage'
import imageSource from '@/mixins/imagesSource'
export default {
  name: 'simmillar-product-card',
  mixins: [utils, imageSource],
  props: ['product'],
  methods: {
    openModalCart () {
      this.$store
        .dispatch('setModalProductId', this.product.slug)
        .then(response => {
          this.$store.dispatch('toggleCartModal', true)
        })
    },
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_PRODUCT)
    },
    componentProductImage (images, onError) {
      let sizeProperty = ''

      if (this.$mq === 'xl' || this.$mq === 'lg' || this.$mq === 'md') {
        sizeProperty = 'medium'
      } else {
        sizeProperty = 'tiny'
      }

      return this.serverImageSource(
        images,
        sizeProperty,
        onError,
        this.SERVER_IMAGE_PRODUCT
      )
    }
  },
  components: {
    AppImage
  }
}
</script>

<style scoped lang="scss">
.product-card {
  padding: 16px;
  border-radius: 4px;
  &:hover {
    box-shadow: 0px 1px 4.75px 0.25px rgba(102, 102, 102, 0.3);
  }
  &__image {
    width: 144px;
    height: 144px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  &__name {
    display: flex;
    align-items: center;
    margin-top: 16px;
    height: 32px;
    h4 {
      margin-bottom: 0;
      font-size: 12px;
      line-height: 16px;
    }
  }
  &__price {
    margin-top: 16px;
    h3 {
      margin-bottom: 0;
      color: $main-color;
    }
  }
  .button-buy {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    svg {
      width: 20px;
      height: 20px;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .product-card {
    &__image {
      width: 120px;
      height: 120px;
    }
    &__price {
      h3 {
        font-size: 16px;
      }
    }
    .button-buy {
      svg {
        display: none;
      }
      span {
        margin-left: 0;
      }
    }
  }
}
</style>
