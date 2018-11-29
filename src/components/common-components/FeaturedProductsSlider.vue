<template>
  <div class="bestsellers">
    <h2 class="h2-secondary bestsellers__title">Featured Products</h2>
    <div class="bestsellers--wrap row">
      <swiper class="col-xl-12 swiper-popular"
              ref="swiperFeatured"
              :options="options">
        <swiper-slide v-for="(product, i) in featuredProductsCollection" :key="i">
          <product-card :good="product" view="column" item-description="legacy">
          </product-card>
        </swiper-slide>
        <div class="featured-pagination" slot="pagination"></div>
      </swiper>
      <div class="slider-buttons">
        <button @click="swipePrev('swiperFeatured')" class="left">
          <svg-arrow-left></svg-arrow-left>
        </button>
        <button @click="swipeNext('swiperFeatured')" class="right">
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
  name: 'featured-products-slider',
  data () {
    return {}
  },
  watch: {
    $route (val, oldVal) {
      if (val.params.slug !== oldVal.params.slug) {
        this.sliderFeaturedProducts.init()
      }
    }
  },
  props: ['options', 'featuredProductsCollection'],
  methods: {
    swipeNext () {
      this.sliderFeaturedProducts.slideNext()
    },
    swipePrev () {
      this.sliderFeaturedProducts.slidePrev()
    }
  },
  components: {
    swiper,
    swiperSlide,
    ProductCard
  },
  computed: {
    sliderFeaturedProducts () {
      return this.$refs.swiperFeatured.swiper
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

.featured-pagination {
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
    &__title {
      margin-bottom: 16px;
      font-size: 20px;
    }
  }
}
</style>
