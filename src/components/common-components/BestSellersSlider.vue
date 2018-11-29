<template>
  <div class="bestsellers">
    <h2 class="h2-secondary bestsellers__title">Best Sellers</h2>
    <div class="bestsellers--wrap row">
      <swiper class="col-xl-12 swiper-popular"
              ref="swiperPopular"
              :options="options || swiperOption">
        <swiper-slide v-for="(product, i) in bestSellersCollection" :key="i">
          <product-card link="dealer"
                        class-response="col-xl-12"
                        view="column"
                        :good="product"
                        item-description="werwefwwerfqwefqwdfqwfdqwf">
          </product-card>
        </swiper-slide>
        <div class="best-sellers-pagination" slot="pagination"></div>
      </swiper>
      <div class="slider-buttons">
        <button @click="swipePrev('swiperPopular')" class="left">
          <svg-arrow-left></svg-arrow-left>
        </button>
        <button @click="swipeNext('swiperPopular')" class="right">
          <svg-arrow-right></svg-arrow-right>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from '@/components/common-components/ProductCard'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'best-sellers-slider',
  components: {
    swiper,
    swiperSlide,
    ProductCard
  },
  props: ['options', 'bestSellersCollection'],
  data () {
    return {
      swiperOption: {
        slidesPerView: 4,
        spaceBetween: 16,
        pagination: {
          el: '.best-sellers-pagination',
          clickable: true
        },
        slidesPerGroup: 4,
        loopFillGroupWithBlank: true,
        breakpoints: {
          648: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 0
          },
          900: {
            slidesPerView: 3,
            slidesPerGroup: 3
          }
        }
      }
    }
  },
  computed: {
    sliderBestSellers () {
      return this.$refs.swiperPopular.swiper
    }
  },
  methods: {
    swipeNext () {
      this.sliderBestSellers.slideNext()
    },
    swipePrev () {
      this.sliderBestSellers.slidePrev()
    }
  }
}
</script>

<style scoped lang="scss">
.bestsellers {
  &--wrap {
    position: relative;
  }
  .slider-buttons {
    button {
      background: none;
      border: none;
    }
    svg {
      width: 32px;
      height: 32px;
      fill: $main-grey;
      cursor: pointer;
      &:hover {
        fill: $main-color;
      }
    }
    .left {
      position: absolute;
      top: 50%;
      left: -64px;
    }
    .right {
      position: absolute;
      top: 50%;
      right: -64px;
    }
  }
  &__title {
    margin-top: 64px;
    margin-bottom: 32px;
    text-align: center;
  }
  .swiper-slide {
    height: auto;
  }
  .swiper-popular {
    position: relative;
    padding-top: 16px;
    padding-bottom: 43px;
  }
}

.best-sellers-pagination {
  bottom: 10px;
  left: 0;
  width: 100%;
  height: 30px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

@media (max-width: $xl) {
  .bestsellers {
    &--wrap {
      .slider-buttons {
        display: none;
      }
    }
  }
}

@media (max-width: $sm) {
  .bestsellers {
    & /deep/ .card--block {
      padding: 16px;
      margin: 0 !important;
    }
  }
}
</style>
