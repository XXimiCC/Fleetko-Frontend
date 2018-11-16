<template>
  <div class="bestsellers">
    <h2 class="h2-secondary bestsellers__title">Best Sellers</h2>
    <div class="bestsellers--wrap row">
      <swiper class="col-xl-12 swiper-popular"
              ref="swiperPopular"
              :options="Object.assign(options, {  pagination: { el: '.best-sellers-pagination', clickable: true } })">
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
  data () {
    return {}
  },
  watch: {
    $route (val, oldVal) {
      if (val.params.slug !== oldVal.params.slug) this.sliderBestSellers.init()
    }
  },
  props: ['options', 'bestSellersCollection'],
  methods: {
    swipeNext () {
      this.sliderBestSellers.slideNext()
    },
    swipePrev () {
      this.sliderBestSellers.slidePrev()
    }
  },
  components: {
    swiper,
    swiperSlide,
    ProductCard
  },
  computed: {
    sliderBestSellers () {
      return this.$refs.swiperPopular.swiper
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
    .best-sellers-pagination {
      position: absolute;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
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
