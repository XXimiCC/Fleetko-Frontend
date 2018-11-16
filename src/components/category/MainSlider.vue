<template>
  <div class="main-slider">
    <div
      v-if="banners"
      class="main-slider--wrapper"
      :class="{ 'fixed-controls': fixedControls }"
      @mouseenter="showSliderNavs = true"
      @mouseleave="showSliderNavs = false"
    >
      <swiper ref="pageMainSlider" :options="swiperOption">
        <swiper-slide v-for="(sliderImage, i) in banners" :key="i">
          <component
            :is="isExternalLink(sliderImage.href)"
            :href="sliderImage.href"
            :target="isTargetBlank(sliderImage)"
            :to="bannerLink(sliderImage)"
          >
            <div
              class="main-slider--slide"
              :style="{
                'background-image': `url(${componentBannerImage(
                  sliderImage
                )}), url(${sliderImage.versions.original})`
              }"
            ></div>
          </component>
        </swiper-slide>
        <div
          v-if="fixedControls"
          class="swiper-pagination"
          slot="pagination"
        ></div>
      </swiper>

      <div class="buttons-wrap">
        <div class="container">
          <div class="main-slider--buttons">
            <button
              @click="swipePrev()"
              :class="{ visible: showSliderNavs }"
              class="left"
            >
              <svg-arrow-left></svg-arrow-left>
            </button>
            <button
              @click="swipeNext()"
              :class="{ visible: showSliderNavs }"
              class="right"
            >
              <svg-arrow-right></svg-arrow-right>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import imageSource from '@/mixins/imagesSource'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import search from '@/components/parts/SearchCommon'

export default {
  name: 'MainSlider',
  data () {
    return {
      filterSearch: true,
      showSliderNavs: false,
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 0,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        loop: true
      }
    }
  },
  props: ['banners', 'fixedControls'],
  mixins: [imageSource],
  components: {
    swiper,
    swiperSlide,
    search
  },
  watch: {
    $route (val, oldVal) {
      if (val.params.slug !== oldVal.params.slug) this.pageMainSlider.init()
    }
  },
  methods: {
    isExternalLink (link) {
      return link &&
        link.startsWith('http') &&
        !link.includes(window.location.host)
        ? 'a'
        : 'router-link'
    },
    bannerLink (banner) {
      let parser = document.createElement('a')

      parser.href = banner.href

      if (banner.href && banner.href.includes(window.location.host)) {
        return parser.pathname
      } else {
        return banner.href || this.$route.fullPath
      }
    },
    componentBannerImage (images, onError) {
      let sizeProperty = ''

      if (this.$mq === 'xl' || this.$mq === 'lg') {
        sizeProperty = 'big'
      } else if (this.$mq === 'md') {
        sizeProperty = 'medium'
      } else {
        sizeProperty = 'small'
      }

      return this.serverImageSource(
        images,
        sizeProperty,
        onError,
        this.SERVER_IMAGE_BANNERS
      )
    },
    isTargetBlank (sliderImage) {
      // eslint-disable-next-line
      return '_blank'
        ? sliderImage.href && !sliderImage.href.includes(window.location.host)
        : '_self'
    },
    swipeNext () {
      this.pageMainSlider.slideNext()
    },
    swipePrev () {
      this.pageMainSlider.slidePrev()
    }
  },
  computed: {
    pageMainSlider () {
      return this.$refs.pageMainSlider.swiper
    },
    vehicleSearch () {
      return this.$route.query.vehicle
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/scss/mixins";

.padding-none {
  padding: 0;
}

.fixed-controls {
  .main-slider--buttons {
    .left {
      left: 40px;
      opacity: 1;
      pointer-events: all;
      &.visible {
        left: 40px;
      }
    }
    .right {
      right: 40px;
      opacity: 1;
      pointer-events: all;
      &.visible {
        right: 40px;
      }
    }
  }
}

.main-slider {
  position: relative;
  &--wrapper {
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    height: 544px;
    background-position: center;
    background-color: #f5f5f5;
    overflow: hidden;
    .swiper-container {
      height: 544px;
    }
  }
  &--slide {
    position: relative;
    height: 100%;
    background-size: cover;
    background-position: center;
    &:before { @include bgPattern() }
  }
  .buttons-wrap {
    position: absolute;
    top: 50%;
    width: 100%;
    z-index: 10;
    .container {
      position: relative;
    }
  }
  &--buttons {
    button {
      background: none;
      border: none;
    }
    svg {
      width: 64px;
      height: 64px;
      fill: white;
      cursor: pointer;
    }
    .left {
      position: absolute;
      top: calc(50% - 32px);
      left: -120px;
      opacity: 0;
      pointer-events: none;
      transition: all 0.7s;
      &.visible {
        left: -80px;
        opacity: 1;
        pointer-events: all;
      }
    }
    .right {
      position: absolute;
      top: 50%;
      right: -120px;
      opacity: 0;
      pointer-events: none;
      transition: all 0.7s;
      &.visible {
        right: -80px;
        opacity: 1;
        pointer-events: all;
      }
    }
  }
  &__info {
    padding: 40px;
    padding-left: 96px;
    padding-top: 128px;
    color: white;
    .main-text-slider {
      font-size: 34px;
      font-family: $montserrat-font;
      margin-bottom: 32px;
    }
    .text-slider {
      font-size: 16px;
      font-family: $sours-sans-p-font;
      line-height: 24px;
    }
  }
}

@media (max-width: $xl) {
  .main-slider {
    &--buttons {
      .left {
        position: absolute;
        top: calc(50% - 32px);
        left: -120px;
        opacity: 0;
        pointer-events: none;
        transition: all 0.7s;
        &.visible {
          left: 40px;
          opacity: 1;
          pointer-events: all;
        }
      }
      .right {
        position: absolute;
        top: 50%;
        right: -120px;
        opacity: 0;
        pointer-events: none;
        transition: all 0.7s;
        &.visible {
          right: 40px;
          opacity: 1;
          pointer-events: all;
        }
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .main-slider {
    &--wrapper {
      height: 300px;
    }
    .swiper-container {
      height: 300px;
    }
    .buttons-wrap {
      display: none;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .main-slider {
    &--wrapper {
      height: 250px;
    }
    .swiper-container {
      height: 250px;
    }
    .buttons-wrap {
      display: none;
    }
  }
}
</style>
