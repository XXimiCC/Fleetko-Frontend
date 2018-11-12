<template>
  <div class="homepage__sections">
    <div class="container">
      <div class="homepage__sections--slider">
        <swiper ref="sectionsSLider" :options="swiperOption">
          <swiper-slide
            class="homepage__sections--slider-item"
            v-for="(sectionItem, i) in sections"
            :key="i"
          >
            <section-item :sectionItem="sectionItem"></section-item>
          </swiper-slide>
          <div
            class="swiper-pagination"
            v-show="displayPagination < Object.keys(sections).length"
            slot="pagination"
          ></div>
        </swiper>
        <div class="homepage__sections--buttons">
          <button
            v-show="displayPagination < Object.keys(sections).length"
            @click="swipePrev()"
            class="left"
          >
            <svg-arrow-left></svg-arrow-left>
          </button>
          <button
            v-show="displayPagination < Object.keys(sections).length"
            @click="swipeNext()"
            class="right"
          >
            <svg-arrow-right></svg-arrow-right>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import SectionItem from '../common-components/Section'
import $ from 'jquery'
export default {
  name: 'homepage-sections',
  data () {
    return {
      sectionsSliderLength: 4,
      swiperOption: {
        slidesPerView: 4,
        spaceBetween: 32,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        loopFillGroupWithBlank: true,
        breakpoints: {
          320: {
            slidesPerView: 'auto',
            loopFillGroupWithBlank: false,
            spaceBetween: 16
          },
          648: {
            slidesPerView: 'auto',
            loopFillGroupWithBlank: false,
            spaceBetween: 16
          },
          960: {
            slidesPerView: 3
          }
        }
      }
    }
  },
  props: ['sections'],
  methods: {
    swipeNext () {
      this.sectionsSLider.slideNext()
    },
    swipePrev () {
      this.sectionsSLider.slidePrev()
    }
  },
  computed: {
    sectionsSLider () {
      return this.$refs.sectionsSLider.swiper
    },
    displayPagination () {
      if (this.$mq === 'xl' || this.$mq === 'lg') {
        return 4
      } else if (this.$mq === 'md') {
        return 3
      } else if (this.$mq === 'xs' || this.$mq === 'sm') {
        return 2
      }
    }
  },
  components: {
    swiper,
    swiperSlide,
    SectionItem
  },
  mounted () {
    let swiperSlider = this.sectionsSLider

    $(window).resize(function () {
      swiperSlider.update()
    })
  }
}
</script>

<style scoped lang="scss">
.homepage {
  &__sections {
    padding-top: 32px;
    padding-bottom: 32px;
    background: #f2f5f7;
    &--slider {
      position: relative;
      .swiper-container {
        padding: 8px 0 50px 0;
        .swiper-pagination {
          bottom: 0;
        }
      }
    }
    &--slider-item {
      transition: all 0.2s;
      &:hover {
        margin-top: -4px;
        box-shadow: 0px 1px 4.75px 0.25px rgba(102, 102, 102, 0.2);
      }
    }
    &--buttons {
      button {
        background: none;
        border: none;
      }
      svg {
        width: 32px;
        height: 32px;
        fill: $paragraph;
        cursor: pointer;
        &:hover {
          fill: $main-color;
        }
      }
      .left {
        position: absolute;
        top: calc(50% - 32px);
        left: -120px;
      }
      .right {
        position: absolute;
        top: calc(50% - 32px);
        right: -120px;
      }
    }
    &--break {
      height: 120px;
      background: #f5f5f5;
    }
  }
}
@media (max-width: 1400px) {
  .homepage {
    &__sections {
      &--buttons {
        display: none;
        .left {
          left: -80px;
        }
        .right {
          right: -80px;
        }
      }
    }
  }
}

@media (min-width: $lg) {
}

@media (min-width: $md) and (max-width: $lg) {
}

@media (min-width: $sm) and (max-width: $md) {
}

@media (min-width: $xs) and (max-width: $sm) {
  .swiper-slide {
    width: 192px;
  }
}
</style>
