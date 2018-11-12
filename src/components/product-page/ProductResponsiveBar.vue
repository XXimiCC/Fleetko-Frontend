<template>
  <div class="responsive-bar">
    <div class="responsive-bar__content">
      <div class="responsive-bar__content--half">
        <div class="responsive-bar--image">
          <app-image
            :imagePath="componentProductImage(product.image)"
            @emitErrorImage="errorImage"
            itemprop="image"
          >
          </app-image>
        </div>
        <div class="responsive-bar--name">
          <h5 class="h5-secondary">{{ productName }}</h5>
        </div>
      </div>

      <div class="responsive-bar__content--half">
        <div class="responsive-bar--price">
          <h4 v-if="product.price">
            ${{ toDollarDecimal(product.price) }} + Tax
          </h4>
        </div>
        <div v-if="product.quantity && product.price" class="buttons-block">
          <button
            @click="$emit('openModalCart')"
            class="button-prime warehouses-row--add"
          >
            <svg-shopping-cart></svg-shopping-cart>
            <span
              >Add <br />
              to cart</span
            >
          </button>
        </div>
        <div class="buttons-block" v-else>
          <button
            @click="$emit('addToWaitList')"
            class="button-prime warehouses-row--add"
          >
            <svg-wishlist v-if="!waitListIncludesProduct"></svg-wishlist>
            <svg-check-xl v-if="waitListIncludesProduct"></svg-check-xl>
            <span v-if="!waitListProgress">{{
              waitListIncludesProduct ? 'In Wait List' : 'Add to wait list'
            }}</span>
            <span v-if="waitListProgress" class="ellipsis-anim"
              ><span></span><span></span><span></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppImage from '../parts/AppImage'
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'

export default {
  name: 'product-responsive-bar',
  data () {
    return {
      productName: ''
    }
  },
  mixins: [utils, imageSource],
  props: ['product', 'waitListIncludesProduct', 'waitListProgress'],
  methods: {
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_PRODUCT)
    },
    componentProductImage (images, onError) {
      return this.serverImageSource(
        images,
        'tiny',
        onError,
        this.SERVER_IMAGE_PRODUCT
      )
    },
    productNameText () {
      this.productName = this.product.name

      if (
        window.innerWidth > this.MOBILE_MEDIUM_WIDTH &&
        window.innerWidth < this.TABLET_MIN_WIDTH
      ) {
        this.productName = this.cutText(this.product.name, 30)
      }
      if (
        window.innerWidth >= this.MOBILE_MIN_WIDTH &&
        window.innerWidth < this.MOBILE_MEDIUM_WIDTH
      ) {
        this.productName = this.cutText(this.product.name, 26)
      }
    }
  },
  components: {
    AppImage
  },
  mounted () {
    this.productNameText()

    window.addEventListener('resize', this.productNameText)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.productNameText)
  }
}
</script>

<style scoped lang="scss">
.responsive-bar {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  box-shadow: 0 0 9.5px 0.5px rgba(102, 102, 102, 0.2);
  background: white;
  transform: translateZ(0);
  z-index: 2000;

  .ellipsis-anim {
    margin-left: 7px;
    display: flex;
    span + span {
      margin-right: 4px;
    }
  }
  .ellipsis-anim span {
    width: 3px;
    margin-right: 4px;
    height: 3px;
    border-radius: 100%;
    background: white;
    opacity: 0;
    -webkit-animation: ellipsis-dot 1s infinite;
    animation: ellipsis-dot 1s infinite;
  }

  .ellipsis-anim span:nth-child(1) {
    -webkit-animation-delay: 0s;
    animation-delay: 0s;
  }
  .ellipsis-anim span:nth-child(2) {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }
  .ellipsis-anim span:nth-child(3) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }

  @-webkit-keyframes ellipsis-dot {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes ellipsis-dot {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  &--image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  &--name {
    margin-left: 16px;
    h5 {
      margin-bottom: 0;
      font-weight: 500;
      line-height: 17px;
      text-transform: none;
    }
  }
  &--price {
    margin-right: 32px;
    h4 {
      margin-bottom: 0;
      color: $main-color;
      font-weight: 600;
    }
  }
  &__content {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &--half {
      display: flex;
      align-items: center;
    }
  }
  .warehouses-row {
    &--add {
      width: 180px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        margin-right: 16px;
        width: 20px;
        fill: white;
      }
      br {
        display: none;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .responsive-bar {
    &--name {
      max-width: 110px;
      h5 {
        font-size: 11px;
      }
    }
    &--price {
      display: none;
    }
    .warehouses-row {
      &--add {
        width: 108px;
        height: 40px;
        br {
          display: block;
        }
        svg {
          display: none;
        }
        span {
          line-height: 16px;
        }
      }
    }
  }
}
</style>
