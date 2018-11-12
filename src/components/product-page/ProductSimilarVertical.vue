<template>
  <div class="similar-desktop">
    <div class="similar-desktop__title">
      <h3 class="h3-secondary">Similar Goods</h3>
    </div>
    <div
      class="similar-desktop__slider"
      :class="{ 'similar-desktop__slider--small': similar.length < 2 }"
    >
      <button
        v-if="similar.length > swiperOption.slidesPerView"
        @click="swipePrev"
        class="similar-desktop__slider-button button-second similar-desktop__slider-button--up"
      >
        <svg-arrow-left></svg-arrow-left>
      </button>
      <swiper ref="mySwiper" :options="swiperOption">
        <swiper-slide v-for="(product, i) in similar" :key="i">
          <router-link
            :to="{ name: 'product-page', params: { slug: product.slug } }"
          >
            <div class="similar-card">
              <div class="similar-card__image">
                <app-image
                  :imagePath="componentProductImage(product.image)"
                  :forceLoading="true"
                  @emitErrorImage="errorImage"
                ></app-image>
              </div>
              <div class="similar-card__link">
                <span class="link-tertiary sm-link montserat-link">{{
                  product.name
                }}</span>
              </div>
              <div class="similar-card__price">
                <h4
                  v-if="product.price"
                  :class="{ 'blurred-price': !product.quantity }"
                >
                  $ {{ toDollarDecimal(product.price) }}
                </h4>
              </div>
            </div>
          </router-link>
        </swiper-slide>
      </swiper>
      <button
        v-if="similar.length > swiperOption.slidesPerView"
        @click="swipeNext"
        class="similar-desktop__slider-button button-second similar-desktop__slider-button--down"
      >
        <svg-arrow-left></svg-arrow-left>
      </button>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import AppImage from '../parts/AppImage'
import imageSource from '@/mixins/imagesSource'
import utils from '@/mixins/utils'
export default {
  name: 'product-similar-desktop',
  data () {
    return {
      swiperOption: {
        slidesPerView: 2,
        direction: 'vertical',
        spaceBetween: 16,
        loop: true,
        paginationClickable: true,
        loopFillGroupWithBlank: false
      }
    }
  },
  methods: {
    swipeNext () {
      this.swiper.slideNext()
    },
    swipePrev () {
      this.swiper.slidePrev()
    },
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_PRODUCT)
    },
    componentProductImage (images, onError) {
      let sizeProperty = ''

      if (this.$mq === 'xl' || this.$mq === 'lg' || this.$mq === 'md') {
        sizeProperty = 'small'
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
  mounted () {
    if (this.similar.length < 2) {
      this.swiperOption.slidesPerView = 1
      this.swiper.init()
    }
  },
  props: ['similar'],
  mixins: [utils, imageSource],
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  components: {
    swiper,
    swiperSlide,
    AppImage
  }
}
</script>

<style scoped lang="scss">
.similar-desktop {
  &__title {
  }
  .similar-card {
    height: 264px;
    padding: 8px;
    &__image {
      margin-bottom: 8px;
      width: 100%;
      height: 143px;
      display: flex;
      img {
        max-width: 100%;
      }
    }
    &__link {
      margin-bottom: 16px;
      display: flex;
      height: 63px;
      align-items: center;
      line-height: 16px;
    }
    &__price {
      h4 {
        margin-bottom: 0;
        color: $main-color;
        text-align: left;
        font-weight: 500;
        font-family: $montserrat-font;
        font-size: 20px;
        line-height: 18px;
      }
    }
  }
  &__slider {
    .swiper-container {
      height: 544px;
      overflow-y: hidden;
      overflow-x: visible;
    }
    .swiper-slide {
    }
    &--small {
      .swiper-container {
        height: 264px;
        overflow-y: hidden;
        overflow-x: visible;
      }
    }
  }
  &__slider-button {
    height: 32px;
    &--up {
      margin-bottom: 16px;
      svg {
        transform: rotate(90deg);
        fill: $main-color;
      }
    }
    &--down {
      margin-top: 16px;
      svg {
        transform: rotate(-90deg);
        fill: $main-color;
      }
    }
  }
}
</style>
