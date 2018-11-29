<template>
  <div class="slider">
    <div class="slider__wrapper" :class="{ 'slider__wrapper--single': limitedImageQty.length < 2}">
      <div class="slider__counter">
        Image {{ activeSlide + 1}} of {{ images.length }}
      </div>

      <swiper ref="sliderEl" :options="sliderOpts" @slideChange="slideChanged">
        <swiper-slide class="swiper-slide" v-for="(img, i) in limitedImageQty" :key="i">
          <div class="slider__slide" :data-index="i">
          <app-image class="image-main"
                     :imageObject="img"
                     :imagePath="sliderImageMain(img)"
                     @emitErrorImage="errorImage"
                     :data-index="i">
          </app-image>
          </div>
        </swiper-slide>
      </swiper>

      <div v-if="images.length > 1" class="buttons-wrap">
        <div class="slider__arrows">
          <button @click="swipePrev()" class="left">
            <svg-arrow-left></svg-arrow-left>
          </button>
          <button @click="swipeNext()" class="right">
            <svg-arrow-right></svg-arrow-right>
          </button>
        </div>
      </div>

    </div>
    <div class="gallery__wrapper">
      <div v-for="(img, i) in limitedImageQty" :key="i"
           @click="goToSlide(i)"
           class="gallery__image"
           :class="{'gallery__image--active': activeSlide === i}">
        <img :src="$mq === 'sm' ? img.versions.tiny : img.versions.small" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import AppImage from '../parts/AppImage'
  import utils from '@/mixins/utils'
  import imageSource from '@/mixins/imagesSource'

  export default {
    name: 'GallerySlider',
    mixins: [utils, imageSource],
    components: { swiper, swiperSlide, AppImage },
    props: ['images'],
    data () {
      return {
        activeSlide: 0,
        counterValue: 0,
        startPos: 0,
        sliderOpts: {
          loop: false,
          initialSlide: 0,
          on: {
            touchEnd: e => this.touchEndHandler(e),
            touchStart: e => this.touchStartHandler(e)
          }
        }
      }
    },
    computed: {
      sliderEl () {
        return this.$refs.sliderEl.swiper
      },
      limitedImageQty () {
        return this.images.length <= 10 ? this.images : this.images.slice(0, 9)
      },
      lastIndex () {
        return this.limitedImageQty.length - 1
      }
    },
    methods: {
      touchStartHandler (event) {
        const { target: { dataset: slide }, clientX } = event

        if (slide.index < 1 || slide.index >= this.lastIndex) this.startPos = clientX
      },
      touchEndHandler (event) {
        const { target: { dataset: slide }, clientX } = event
        const dist = this.startPos - clientX
        const hold = 85

        if (slide.index < 1 && dist < -hold) this.swipePrev()
        else if (slide.index >= this.lastIndex && dist > hold) setTimeout(() => this.swipeNext(), 10)
        else this.sliderEl.update()
      },
      slideChanged () {
        this.activeSlide = this.sliderEl.activeIndex
      },
      goToSlide (index) {
        this.activeSlide = index
        this.sliderEl.slideTo(this.activeSlide)
      },
      swipeNext () {
        if (this.activeSlide >= this.lastIndex) this.activeSlide = -1
        this.sliderEl.slideTo(this.activeSlide + 1)
      },
      swipePrev () {
        if (this.activeSlide < 1) this.activeSlide = this.lastIndex + 1

        this.sliderEl.slideTo(this.activeSlide - 1)
      },
      sliderImageMain (images, onError) {
        return this.serverImageSource(images, 'big', onError, this.SERVER_IMAGE_PRODUCT)
      },
      errorImage (e, image) {
        this.serverImageSource(image, null, e, this.SERVER_IMAGE_PRODUCT)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .slider {
    display: flex;
    height: 100%;
    width: 100%;
    opacity: 1;
    transition: opacity .5s;
    &__wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 70%;
      .swiper-container {
        height: 100%;
      }
      &--single {
        .swiper-container {
          width: 100%;
        }
        .slider__slide {
          width: 100%;
          max-width: 100%;
        }
      }
    }
    &__counter {
      position: absolute;
      top: -19px;
      left: 0;
      font: 14px $sours-sans-p-font;
      color: $main-grey;
    }
    .swiper-slide {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &__slide {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 90%;
      height: 100%;
      max-height: 100%;
      max-width: 90%;
      img {
        max-width: 90%;
        min-height: 90%;
      }
    }
    .buttons-wrap {
      position: absolute;
      top: 50%;
      width: 100%;
      z-index: 2;
    }
    &__arrows {
      button {
        position: absolute;
        top: -32px;
        left: -24px;
        background: none;
        border: none;
        opacity: .2;
        transition: 0.25s;
        &:hover {
          opacity: .9;
        }
      }
      svg {
        width: 64px;
        height: 64px;
        fill: $main-color;
        cursor: pointer;
      }
      .right {
        left: calc(100% - 52px);
      }
    }
  }
  .gallery {
    &__wrapper {
      transform: translateY(-16px);
      width: 198px;
      margin-left: auto;
      font-size: 1.75rem;
      text-align: left;
    }
    &__image {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 96px;
      height: 96px;
      border: 1px solid transparent;
      border-radius: 4px;
      transition: border .2s;
      cursor: pointer;
      background: transparent;

      &:nth-of-type(odd) {
        margin: 0 6px 0 0;
      }
      img {
        position: relative;
        max-width: 95%;
        min-height: 95%;
      }
      &:hover {
        background: rgba(20, 88, 235, .2);
      }
      &--active {
        border: 1px solid $main-color;
        background-color: rgba(20, 88, 235, .2);
      }

      &:after {
        position: absolute;
        content: '';
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 0;
        background: url('~@/assets/search.svg') center/35px no-repeat;
        transition: .2s;
        filter: invert(1);
        pointer-events: none;
      }
      &:hover:after {
        opacity: .9;
      }
    }
  }

  @media (max-width: $md) {
    .slider {
      &__wrapper {
        margin-right: 16px;
      }
    }
    .gallery {
      &__wrapper {
        width: 150px;
      }
      &__image  {
        width: 72px;
        height: 72px;
      }
    }
  }

  @media (max-width: $sm) {
    .slider {
      &__wrapper {
        width: 100%;
        margin-right: 0;
      }
      &__slide {
        width: 100%;
        max-width: 100%;
      }
      .buttons-wrap {
        top: calc(100% + 32px);
        left: 0;
        svg {
          width: 32px;
          height: 32px;
        }
        .left {
          left: calc(50% - 116px);
        }
        .right {
          left: calc(50% + 72px);
        }
      }
    }
    .gallery__wrapper {
      display: none;
    }
  }
</style>
