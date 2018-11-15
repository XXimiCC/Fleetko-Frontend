<template>
  <div class="slider">
    <div class="slider__wrapper">
      <div class="slider__counter">
        image {{ defineCounter(activeSlide) + 1}} of {{ images.length }}
      </div>

      <swiper ref="sliderEl" :options="sliderOpts" @slideChange="slideChanged">
        <swiper-slide class="swiper-slide" v-for="(img, i) in limitedImageQty" :key="i">
          <div class="slider__slide">
            <img :src="img.versions.big" alt="">
          </div>
        </swiper-slide>
      </swiper>

      <div class="buttons-wrap">
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
           :class="{'gallery__image--active': defineActive(i)}">
        <img :src="img.versions.tiny" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  export default {
    name: 'GallerySlider',
    components: { swiper, swiperSlide },
    props: ['images'],
    data () {
      return {
        activeSlide: 1,
        counterValue: 0,
        sliderOpts: {
          loop: true
        }
      }
    },
    computed: {
      sliderEl () {
        return this.$refs.sliderEl.swiper
      },
      limitedImageQty () {
        return this.images.length <= 10 ? this.images : this.images.slice(0, 9)
      }
    },
    mounted () {
      this.sliderEl.slidePrev(0)
    },
    methods: {
      defineActive (index) {
        return this.activeSlide === index || this.activeSlide - this.limitedImageQty.length === index
      },
      defineCounter () {
        if (this.activeSlide > this.limitedImageQty.length - 1) {
          return this.activeSlide - this.limitedImageQty.length
        } else {
          return this.activeSlide
        }
      },
      slideChanged () {
        this.activeSlide = this.sliderEl.activeIndex
      },
      goToSlide (index) {
        this.activeSlide = index
        this.sliderEl.slideTo(index)
      },
      swipeNext () {
        this.sliderEl.slideNext()
      },
      swipePrev () {
        this.sliderEl.slidePrev()
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
          opacity: .5;
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
      width: 208px;
      margin-left: auto;
      font-size: 1.75rem;
      text-align: right;
      overflow: hidden;
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
