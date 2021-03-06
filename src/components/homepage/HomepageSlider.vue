<template>
  <div class="homepage__slider">
    <div class="homepage__slider--wrapper" @mouseenter="showSliderNavs = true" @mouseleave="showSliderNavs = false">

      <swiper ref="sliderEl" :options="swiperOption">

        <swiper-slide v-for="(img, i) in banners" :key="i">
          <component :is="isOuter(img.href) ? 'a' : 'router-link'"
                     :target="isOuter(img.href) ? '_blank' : '_self'"
                     :href="img.href"
                     :to="bannerLink(img)">
            <div class="homepage__slider--slide"
                 :style="{ 'background-image': `url(${componentBannerImage(img)}), url(${img.versions.original})` }">
            </div>
          </component>
        </swiper-slide>

        <div v-if="singlePhoto()"
             :class="{ 'visible': showSliderNavs }"
             class="container homepage-slider-pagination swiper-pagination"
             slot="pagination">
        </div>
      </swiper>

      <div v-if="singlePhoto()" class="buttons-wrap">
        <div class="container">
          <div class="homepage__slider--buttons">
            <button @click="swipePrev()"
                    :class="{ 'visible': showSliderNavs }"
                    class="left">
              <svg-arrow-left></svg-arrow-left>
            </button>
            <button @click="swipeNext()"
                    :class="{ 'visible': showSliderNavs }"
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
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'

export default {
  name: 'homepage-slider',
  mixins: [utils, imageSource],
  components: {
    swiper,
    swiperSlide
  },
  props: ['banners'],
  data () {
    return {
      testPromo: [
        'https://fleetko-api-dev.s3.amazonaws.com/media/1888/versions/homepage-slider-2-big.jpg',
        'https://fleetko-api-dev.s3.amazonaws.com/media/1889/versions/homepage-slider-3-big.jpg'
      ],
      swiperOption: {
        lazy: true,
        slidesPerView: 1,
        spaceBetween: 0,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        loop: true,
        allowSlidePrev: this.singlePhoto(),
        allowSlideNext: this.singlePhoto()
      },
      showSliderNavs: false
    }
  },
  computed: {
    sliderEl () {
      return this.$refs.sliderEl.swiper
    }
  },
  methods: {
    singlePhoto () {
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
    swipeNext () {
      this.sliderEl.slideNext()
    },
    swipePrev () {
      this.sliderEl.slidePrev()
    },
    componentBannerImage (images, onError) {
      let sizeProperty = 'big'

      if (this.$mq === 'md') sizeProperty = 'medium'
      if (this.$mq === 'sm') sizeProperty = 'small'

      return this.serverImageSource(images, sizeProperty, onError, this.SERVER_IMAGE_BANNERS)
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/scss/mixins";

.homepage {
  &__slider {
    position: relative;
    &--wrapper {
      position: relative;
      width: 100%;
      height: 550px;
      overflow: hidden;
      .swiper-container {
        height: 544px;
      }
      .swiper-pagination-bullet {
        display: none;
      }
      .swiper-pagination {
        margin-top: -70px;
        position: relative;
        text-align: center;
        opacity: 0;
        pointer-events: none;
        transition: all 0.7s;
        &.visible {
          margin-top: -132px;
          opacity: 1;
          pointer-events: all;
        }
      }
    }
    &--slide {
      position: relative;
      height: 100%;
      background-size: cover;
      &:before {
        @include bgPattern();
      }
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
    &--search {
      z-index: 20;
    }
  }
}

@media (max-width: $xl) {
  .homepage {
    &__slider {
      position: relative;
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
}

@media (max-width: $lg) {
  .homepage {
    &__slider {
      position: relative;
      &--wrapper {
        height: 320px;
        .swiper-container {
          height: 320px;
        }
        .swiper-pagination {
          display: none;
        }
      }
      &--buttons {
        display: none;
      }
      &--slide {
        height: 100%;
        background-size: contain;
      }
    }
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .homepage {
    &__slider {
      position: relative;
      &--slide {
        height: 100%;
        background-size: cover;
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .homepage {
    &__slider {
      position: relative;
      &--slide {
        height: 100%;
        background-size: cover;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .homepage {
    &__slider {
      position: relative;
      &--wrapper {
        height: 250px;
        .swiper-container {
          height: 250px;
        }
      }
      &--slide {
        height: 100%;
        background-size: cover;
      }
    }
  }
}
</style>
