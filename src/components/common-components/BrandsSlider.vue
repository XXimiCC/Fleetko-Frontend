<template>
  <div class="col-xl-12 slider">
    <swiper :options="swiperOptions || optionsDefault"
            ref="brandsSwiper"
            class="col-xl-12">

      <swiper-slide v-for="(brand, i) in brands" :key="i">
        <div class="item"><img :src="brandImage(brand.name)" alt="brand-logo" /></div>
        <p class="slider__caption">{{ brand.name }}</p>
      </swiper-slide>

      <div class="brands-pagination" slot="pagination"></div>

    </swiper>

    <div class="slider--buttons">
      <button @click="swipePrev()" class="left">
        <svg-arrow-left></svg-arrow-left>
      </button>
      <button @click="swipeNext()" class="right">
        <svg-arrow-right></svg-arrow-right>
      </button>
    </div>

  </div>
</template>

<script>
import utils from '@/mixins/utils'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import $ from 'jquery'

export default {
  name: 'brands-slider',
  mixins: [utils],
  components: {
    swiper,
    swiperSlide
  },
  props: ['swiperOptions'],
  data () {
    return {
      brands: [
        { name: 'Freightliner' },
        { name: 'Volvo' },
        { name: 'International' },
        { name: 'Kenworth' },
        { name: 'Mack' }
      ],
      optionsDefault: {
        slidesPerView: 4,
        spaceBetween: 30,
        pagination: {
          el: '.brands-pagination',
          clickable: true
        },
        slidesPerGroup: 4,
        loopFillGroupWithBlank: true,
        breakpoints: {
          640: {
            slidesPerView: 2,
            slidesPerColumn: 2,
            slidesPerColumnFill: 'row'
          },
          960: {
            slidesPerView: 3
          }
        }
      }
    }
  },
  computed: {
    brandsSwiper () {
      return this.$refs.brandsSwiper.swiper
    }
  },
  mounted () {
    let swiperSlider = this.brandsSwiper

    $(window).resize(function () {
      swiperSlider.update()
    })
  },
  methods: {
    swipeNext () {
      console.log(this.brandsSwiper.params)
      this.brandsSwiper.slideNext()
    },
    swipePrev () {
      this.brandsSwiper.slidePrev()
    }
  }
}
</script>

<style scoped lang="scss">
.brands-pagination {
  display: flex;
  justify-content: center;
  width: 100%;
}
.swiper-container {
  padding-left: 0;
  padding-right: 0;
  height: 100%;
  padding-bottom: 43px;
}
.swiper-wrapper {
  padding: 0 16px;
  height: 100%;
}
.item {
  border-radius: 4px;
  height: 128px;
  box-shadow: 0 3px 8.55px 0.45px rgba(6, 26, 70, 0.3);
  img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
}
.slider {
  &__caption {
    margin-top: 24px;
    font-family: $montserrat-font;
    font-size: 20px;
    font-weight: 500;
    color: $main-dark;
    margin-bottom: 0;
    text-align: center;
  }
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
      top: 22%;
      left: -64px;
    }
    .right {
      position: absolute;
      top: 22%;
      right: -64px;
    }
  }
}

@media (max-width: $xl) {
  .slider {
    &--buttons {
      display: none;
    }
  }
}
@media (min-width: $xs) and (max-width: $sm) {
  .swiper-container {
    padding-left: 0;
    padding-right: 0;
    height: auto;
    padding-bottom: 30px;
    padding-top: 10px;
  }
}
</style>
