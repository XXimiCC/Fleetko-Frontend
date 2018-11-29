<template>
  <div class="product-details">
    <div class="container">
      <div class="product-details__similar">
        <h2 class="h2-secondary title">Similar products</h2>
        <swiper ref="mySwiper" :options="swiperOption">
          <swiper-slide v-for="(product, i) in simmilar" :key="i">
            <div class="swiper-slide-wrap">
              <product-card :classResponse="'col-xl-12'"
                            :product="product"
                            :counter="false">
              </product-card>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div class="product-details__similar--slider--buttons">
          <button @click="swipePrev" class="left">
            <svg-arrow-left></svg-arrow-left>
          </button>
          <button @click="swipeNext" class="right">
            <svg-arrow-right></svg-arrow-right>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import utils from '@/mixins/utils'
import ProductCard from '../common-components/SimmillarProductCard'

export default {
  name: 'ProductDetails',
  data () {
    return {
      limit: 8,
      currentSlide: 0,
      swiperOption: {
        slidesPerView: 6,
        spaceBetween: 0,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        slidesPerGroup: 6,
        loopFillGroupWithBlank: true,
        breakpoints: {
          648: {
            slidesPerView: 2,
            slidesPerGroup: 2
          },
          800: {
            slidesPerView: 3,
            slidesPerGroup: 3
          },
          968: {
            slidesPerView: 4,
            slidesPerGroup: 4
          }
        }
      }
    }
  },
  mixins: [utils],
  props: ['simmilar'],
  methods: {
    swipeNext () {
      this.swiper.slideNext()
    },
    swipePrev () {
      this.swiper.slidePrev()
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted () {},
  components: {
    swiper,
    swiperSlide,
    ProductCard
  }
}
</script>

<style lang="scss" scoped>
.product-details {
  .swiper-slide-wrap {
    padding: 2px;
  }
  &__similar {
    position: relative;
    margin-top: 64px;
    .swiper-container {
      padding-bottom: 48px;
      .swiper-pagination-bullets {
        bottom: 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .title {
      margin-bottom: 40px;
      line-height: 1;
      text-transform: capitalize;
    }
    &--slider {
      &--buttons {
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
    }
  }
}

@media (min-width: $xs) and (max-width: $lg) {
  .product-details {
    &__similar {
      &--slider {
        &--buttons {
          display: none;
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .product-details {
    .container {
    }
    &__similar {
      .title {
        font-size: 24px;
      }
    }
  }
}
</style>
