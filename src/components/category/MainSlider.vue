<template>
  <div class="main-slider">
    <div v-if="banners"
         class="main-slider--wrapper"
         :class="{ 'fixed-controls': fixedControls }"
         @mouseenter="showSliderNavs = true"
         @mouseleave="showSliderNavs = false">
      <swiper ref="pageMainSlider" :options="swiperOption">
        <swiper-slide v-for="(sliderImage, i) in banners" :key="i">
          <component :is="isOuter(sliderImage.href) ? 'a' : 'router-link'"
                     :target="isOuter(sliderImage.href) ? '_blank' : '_self'"
                     :href="sliderImage.href"
                     :to="bannerLink(sliderImage)">
            <div class="main-slider--slide"
                 :style="{
                   'background-image': `url(${componentBannerImage(sliderImage)}), url(${sliderImage.versions.original})`
                 }">
            </div>
          </component>
        </swiper-slide>
        <div v-if="banners.length > 1"
             :class="{'lifted-up': liftUpPagination}"
             class="swiper-pagination"
             slot="pagination">
        </div>
      </swiper>

      <div v-if="banners.length > 1" class="buttons-wrap">
        <div class="container">
          <div class="main-slider--buttons">
            <button @click="swipePrev()"
                    :class="{ visible: showSliderNavs }"
                    class="left">
              <svg-arrow-left></svg-arrow-left>
            </button>
            <button @click="swipeNext()"
                    :class="{ visible: showSliderNavs }"
                    class="right">
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
  mixins: [imageSource],
  components: {
    swiper,
    swiperSlide,
    search
  },
  props: ['banners', 'fixedControls', 'liftUpPagination'],
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
        loop: true,
        allowSlidePrev: this.singlePhoto(),
        allowSlideNext: this.singlePhoto()
      }
    }
  },
  computed: {
    pageMainSlider () {
      return this.$refs.pageMainSlider.swiper
    },
    vehicleSearch () {
      return this.$route.query.vehicle
    }
  },
  methods: {
    singlePhoto () {
      console.log(this.banners.length > 1)
      return this.banners.length > 1
    },
    isOuter (link) {
      return link && link.startsWith('http') && !link.includes(window.location.host)
    },
    bannerLink (banner) {
      const parser = document.createElement('a')

      parser.href = banner.href

      return (banner.href && banner.href.includes(window.location.host))
        ? parser.pathname
        : banner.href || this.$route.fullPath
    },
    componentBannerImage (images, onError) {
      let sizeProperty = 'big'

      if (this.$mq === 'md') sizeProperty = 'medium'
      if (this.$mq === 'sm') sizeProperty = 'small'

      return this.serverImageSource(images, sizeProperty, onError, this.SERVER_IMAGE_BANNERS)
    },
    swipeNext () {
      this.pageMainSlider.slideNext()
    },
    swipePrev () {
      this.pageMainSlider.slidePrev()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/scss/mixins";

.padding-none {
  padding: 0;
}

.swiper-pagination {
  bottom: 10px;
  left: 0;
  width: 100%;
  transition: bottom .2s;
  & /deep/ .swiper-pagination-bullet {
    margin: 0 4px;
  }
  &.lifted-up {
    bottom: 85px;
  }
}

@media (max-width: $md) {
  .swiper-pagination {
    display: none;
  }
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
