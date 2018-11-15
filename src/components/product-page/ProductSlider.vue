<template>
  <div class="slider">
    <div
      class="slider__main"
      :style="{ height: `${sliderHeight}px` }"
      :ref="'sliderWrap'"
    >
      <div
        v-if="productImages.length"
        :ref="'sliderEl'"
        class="slider__wrap"
        :style="{ width: `calc(100% * ${productImages.length}` }"
      >
        <div v-for="slide in productImages" class="slider__wrap--panel">
          <app-image
            class="image-main"
            :imageObject="slide"
            :imagePath="sliderImageMain(slide)"
            @emitErrorImage="errorImage"
          >
          </app-image>
        </div>
      </div>
      <div v-if="!productImages.length" class="slider__error">
        <app-image
          class="image-main"
          :imageObject="null"
          :imagePath="sliderImageMain(null)"
          @emitErrorImage="errorImage"
        >
        </app-image>
      </div>

      <div v-if="product.freight" class="slider__freight-label">
        <svg-freight
          v-if="$mq === 'xl' || $mq === 'lg' || $mq === 'md'"
        ></svg-freight>
        <span>Freight</span>
      </div>
    </div>

    <div v-if="displayedThumbs.length > 1" class="slider__thumbnails">
      <div class="slider__thumbnails--prev">
        <button
          :disabled="disablePrevButton"
          @click="switchSlide(--currentImage)"
        >
          <svg-arrow-left></svg-arrow-left>
        </button>
      </div>
      <div class="wrap">
        <div
          :class="{ active: thumb.index === currentImage }"
          @click="switchSlide(thumb.index)"
          class="image-wrap"
          v-for="(thumb, i) in displayedThumbs"
        >
          <app-image
            class="image-main"
            :imageObject="thumb"
            :imagePath="sliderImageThumbnail(thumb)"
            @emitErrorImage="errorImage"
          >
          </app-image>
        </div>
      </div>
      <div class="slider__thumbnails--next">
        <button
          :disabled="disableNextButton"
          @click="switchSlide(++currentImage)"
        >
          <svg-arrow-right></svg-arrow-right>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AppImage from '../parts/AppImage'
import Hammer from 'hammerjs'
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'
import _ from 'lodash'

export default {
  name: 'product-slider',
  data () {
    return {
      timer: null,
      sensitivity: 5,
      slideCount: 0,
      limit: 4,
      currentImage: 0,
      sliderManager: null,
      sliderHeight: 0,
      sliderReady: false,
      isScrolling: false
    }
  },
  watch: {
    sliderReady (v) {
      if (v) this.sliderHeight.update()
    },
    $route (val, oldVal) {
      if (val.query.id !== oldVal.query.id) {
        this.currentImage = 0

        this.switchSlide(this.currentImage)
      }
    },
    productImages (val) {
      this.sliderHeight.update()
    }
  },
  mixins: [utils, imageSource],
  props: ['loop', 'productImages', 'product'],
  methods: {
    sliderImageMain (images, onError) {
      let sizeProperty = ''

      if (this.$mq === 'xl' || this.$mq === 'lg') {
        sizeProperty = 'big'
      } else {
        sizeProperty = 'medium'
      }

      return this.serverImageSource(
        images,
        sizeProperty,
        onError,
        this.SERVER_IMAGE_PRODUCT
      )
    },
    sliderImageThumbnail (images, onError) {
      let sizeProperty = 'tiny'

      return this.serverImageSource(
        images,
        sizeProperty,
        onError,
        this.SERVER_IMAGE_PRODUCT
      )
    },
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_PRODUCT)
    },
    addScrollEvents () {
      window.addEventListener('scroll', this.scrollHandler, { passive: true })

      window.addEventListener('touchend', this.touchHandler)

      window.addEventListener('resize', this.countResponsiveSliderWarpHeight)
    },
    scrollHandler: _.debounce(function ($event) {
      this.isScrolling = true

      setTimeout(() => {
        this.isScrolling = false
      }, 50)
    }, 200),
    touchHandler: _.debounce(function () {
      this.isScrolling = false
    }, 200),
    removeScrollEvents () {
      window.removeEventListener('scroll', this.scrollHandler)
      window.removeEventListener('touchend', this.touchHandler)
      window.removeEventListener('resize', this.countResponsiveSliderWarpHeight)
    },
    countResponsiveSliderWarpHeight () {
      if (window.innerWidth > this.TABLET_MAX_WIDTH) {
        this.sliderHeight = this.$refs.sliderWrap.clientWidth
      } else if (
        window.innerWidth > this.TABLET_MIN_WIDTH &&
        window.innerWidth < this.TABLET_MAX_WIDTH
      ) {
        this.sliderHeight = 320
      } else if (
        window.innerWidth >= this.MOBILE_MIN_WIDTH &&
        window.innerWidth < this.TABLET_MIN_WIDTH
      ) {
        this.sliderHeight = 288
      }
    },
    makeImage (thumb) {
      this.currentImage = thumb.index
    },
    nextImage () {
      this.currentImage++
    },
    prevImage () {
      this.currentImage--
    },
    transformSlide () {
      const sliderEl = this.$refs.sliderEl

      this.sliderManager = new Hammer.Manager(sliderEl)
      this.sliderManager.add(
        new Hammer.Pan({
          threshold: 0,
          pointers: 0,
          direction: Hammer.DIRECTION_HORIZONTAL
        })
      )

      this.sliderManager.on('panleft panright', e => {
        if (!this.isScrolling) {
          // 4e. Calculate pixel movements into 1:1 screen percents so gestures track with motion
          let percentage =
            ((100 / this.productImages.length) * e.deltaX) / window.innerWidth

          // 4f. Multiply percent by # of slide we’re on
          let percentageCalculated =
            percentage - (100 / this.productImages.length) * this.currentImage

          // 4g. Apply transformation
          sliderEl.style.transform =
            'translateX( ' + percentageCalculated + '% )'

          if (e.isFinal) {
            if (e.velocity > 1) {
              this.switchSlide(this.currentImage - 1)
            } else if (e.velocity < -1) {
              this.switchSlide(this.currentImage + 1)
            } else {
              if (
                percentage <= -(this.sensitivity / this.productImages.length)
              ) {
                this.switchSlide(this.currentImage + 1)
              } else if (
                percentage >=
                this.sensitivity / this.productImages.length
              ) {
                this.switchSlide(this.currentImage - 1)
              } else {
                this.switchSlide(this.currentImage)
              }
            }
          }
        }
      })
    },
    switchSlide (number) {
      this.$emit('slideChangeHandler', true)
      if (this.loop) {
        if (number < 0) {
          this.currentImage = this.productImages.length - 1
        } else if (number > this.productImages.length - 1) {
          this.currentImage = 0
        } else {
          this.currentImage = number
        }
      } else {
        if (number < 0) {
          this.currentImage = 0
        } else if (number > this.productImages.length - 1) {
          this.currentImage = this.productImages.length - 1
        } else {
          this.currentImage = number
        }
      }

      this.$refs.sliderEl.classList.add('is-animating')
      let percentage = -(100 / this.productImages.length) * this.currentImage
      this.$refs.sliderEl.style.transform = 'translateX( ' + percentage + '% )'
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.sliderEl.classList.remove('is-animating')
        this.$emit('slideChangeHandler', false)
      }, 400)
    }
  },
  computed: {
    disablePrevButton () {
      return this.loop ? false : this.currentImage === 0
    },
    disableNextButton () {
      return this.loop
        ? false
        : this.currentImage === this.productImages.length - 1
    },
    displayedThumbs () {
      if (this.$mq === 'lg' || this.$mq === 'xl') {
        let curr = this.currentImage
        let arrays = _.chunk(this.productImages, this.limit)
        let currentArray = []

        arrays.forEach(arr => {
          if (arr.find(indexImage => indexImage.index === curr)) {
            currentArray = arr
          }
        })

        if (currentArray.length < this.limit) {
          if (arrays.length < 2) {
            return this.productImages.slice(0, this.productImages.length)
          } else {
            return this.productImages.slice(
              this.productImages.length - this.limit,
              this.productImages.length
            )
          }
        }
        return currentArray
      } else {
        return this.productImages
      }
    }
  },
  components: {
    AppImage
  },
  mounted () {
    if (this.productImages.length) this.transformSlide()

    this.countResponsiveSliderWarpHeight()

    this.addScrollEvents()
  },
  beforeDestroy () {
    this.removeScrollEvents()
  }
}
</script>

<style scoped lang="scss">
.slider {
  &__error {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__freight-label {
    border-radius: 4px;
    padding: 8px;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 0;
    right: 0;
    background: $main-color;
    cursor: default;
    pointer-events: none;
    svg {
      margin-bottom: 4px;
      width: 16px;
      fill: white;
    }
    span {
      font-family: $montserrat-font;
      font-size: 10px;
      color: white;
      font-weight: 500;
    }
  }
  &__main {
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    width: 100%;
    &--back {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
    }
  }
  &__wrap {
    height: 100%;
    display: flex;
    &--panel {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .image-main {
        -webkit-user-drag: none;
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
  .is-animating {
    transition: transform 400ms;
  }
  &__thumbnails {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    &--prev {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
      cursor: pointer;
      button {
        border: none;
        background: transparent;
        cursor: pointer;
        svg {
          width: 20px;
          fill: $main-grey;
          &:hover {
            fill: $main-color;
          }
        }
      }
    }
    &--next {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8px;
      button {
        border: none;
        background: transparent;
        cursor: pointer;
        svg {
          width: 20px;
          fill: $main-grey;
          &:hover {
            fill: $main-color;
          }
        }
      }
    }
    .wrap {
      display: flex;
      align-items: center;
      .image-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        border-radius: 4px;
        cursor: pointer;
        img {
          width: 100%;
          max-height: 100%;
        }
      }
      .image-wrap + .image-wrap {
        margin-left: 8px;
      }
    }
    .active {
      border: 1px solid $main-color;
    }
  }
}

@media (min-width: $xs) and (max-width: $md) {
  .slider {
    position: relative;
    margin-right: -16px;
    margin-left: -16px;
    &__thumbnails {
      position: absolute;
      width: 100%;
      bottom: 18px;
      &--prev {
        display: none;
      }
      &--next {
        display: none;
      }
      .wrap {
        justify-content: center;
        width: 100%;
        .image-wrap {
          width: 12px;
          height: 12px;
          border: 1px solid $border-color;
          background: white;
          border-radius: 100%;
          img {
            display: none;
          }
          &.active {
            border: none;
            background: $main-color;
          }
        }
      }
    }
    &__wrap {
      &--panel {
        background-size: 30%;
      }
    }
  }
}

@media (min-width: $xssm) and (max-width: $sm) {
  .slider {
    &__wrap {
      &--panel {
        background-size: 40%;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .slider {
    &__wrap {
      &--panel {
        background-size: 50%;
      }
    }
  }
}
</style>
