<template>
  <div class="homepage-category">
    <div class="container">
      <div class="homepage-category__title">
        <div class="homepage-category__title-decoration">
          {{ section.name.substring(0, 2) }}
        </div>
        <h2 class="h2-secondary">{{ section.name }}</h2>
      </div>
      <div
        class="homepage-category__desktop"
        v-if="$mq === 'xl' || $mq === 'lg' || $mq === 'md'"
      >
        <router-link
          :to="{ name: 'catalog', params: { slug: category.slug } }"
          class="homepage-category__category-item"
          v-for="category in section.categories.slice(0, displayedCategories)"
          :key="category.id"
        >
          <category-card
            class="category"
            :category="category"
            :counter="false"
            :picture="randomCategoryImage()"
          ></category-card>
        </router-link>
        <router-link
          :to="{ path: `/section/${section.slug}` }"
          class="homepage-category__category-item--more"
        >
          <div class="homepage-category__more-title">
            <p class="homepage-category__first-heading">More about</p>
            <p class="homepage-category__second-heading">{{ section.name }}</p>
          </div>
          <div class="homepage-category__more-description">
            {{ section.caption }}
          </div>
          <div class="homepage-category__more-button">
            <button class="button-second right-icon">
              <span>Show all</span>
              <svg-arrow-back></svg-arrow-back>
            </button>
          </div>
        </router-link>
      </div>

      <div
        class="homepage-category__responsive row"
        v-show="$mq !== 'xl' && $mq !== 'lg' && $mq !== 'md'"
      >
        <swiper class="col-xl-12" ref="swiperSlider" :options="swiperOption">
          <swiper-slide v-for="(category, i) in section.categories" :key="i">
            <router-link
              ref="categoryCard"
              :to="{ name: 'catalog', params: { slug: category.slug } }"
              class="homepage-category__card-wrap"
              v-if="$mq !== 'xl' && $mq !== 'lg' && $mq !== 'md'"
            >
              <category-card
                class="category"
                :category="category"
                :counter="false"
                :picture="randomCategoryImage()"
              ></category-card>
            </router-link>
          </swiper-slide>

          <swiper-slide>
            <router-link
              :to="{ path: `/section/${section.slug}` }"
              class="homepage-category__category-item--more"
            >
              <div class="homepage-category__more-title">
                <p class="homepage-category__first-heading">More about</p>
                <p class="homepage-category__second-heading">Lighting</p>
              </div>
              <div class="homepage-category__more-button">
                <span>Show all</span>
                <svg-arrow-back></svg-arrow-back>
              </div>
            </router-link>
          </swiper-slide>
          <div
            v-show="displayPagination < section.categories.length + 1"
            class="swiper-pagination"
            slot="pagination"
          ></div>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import categoryCard from '../common-components/CategoryCard'
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'
import $ from 'jquery'
export default {
  name: 'homepage-categories',
  data () {
    return {
      swiperOption: {
        slidesPerView: 3,
        slidesPerColumn: this.section.categories.length < 2 ? 1 : 2,
        spaceBetween: 8,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        breakpoints: {
          530: {
            slidesPerView: 2,
            slidesPerColumn: this.section.categories.length < 2 ? 1 : 2,
            spaceBetween: 8,
            slidesPerGroup: 2
          },
          540: {
            slidesPerView: 2,
            spaceBetween: 8,
            slidesPerGroup: 2
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 8,
            slidesPerGroup: 2
          }
        }
      }
    }
  },
  props: ['section'],
  mixins: [utils, imageSource],
  methods: {
    errorImage (e) {
      this.serverImageSource(
        this.section.image,
        null,
        e,
        this.SERVER_IMAGE_SECTION
      )
    },
    componentSectionImage (onError) {
      let sizeProperty = ''

      if (this.$mq === 'xl' || this.$mq === 'lg' || this.$mq === 'md') {
        sizeProperty = 'medium'
      } else {
        sizeProperty = 'small'
      }

      return this.serverImageSource(
        this.section.image,
        sizeProperty,
        onError,
        this.SERVER_IMAGE_SECTION
      )
    },
    swipeNext () {
      this.swiperSlider.slideNext()
    },
    swipePrev () {
      this.swiperSlider.slidePrev()
    },
    updateSwiper () {
      if (this.section.categories.length < 2) {
        this.swiperOption.slidesPerColumn = 1
        this.swiperOption.slidesPerColumnFill = 'row'
      }

      this.swiperSlider.update()
    }
  },
  components: {
    swiper,
    swiperSlide,
    categoryCard
  },
  computed: {
    swiperSlider () {
      return this.$refs.swiperSlider.swiper
    },
    displayedCategories () {
      if (this.$mq === 'xl') {
        return this.section.categories.length > 4 ? 7 : 3
      } else if (this.$mq === 'lg' || this.$mq === 'md') {
        return this.section.categories.length > 3 ? 7 : 2
      } else if (this.$mq === 'xs' || 'sm') {
        return 3
      }
    },
    displayPagination () {
      return 4
    }
  },
  beforeDestroy () {
    $(window).off('resize')
  },
  mounted () {
    $(window).resize(this.updateSwiper)

    this.updateSwiper()
  }
}
</script>

<style scoped lang="scss">
.homepage-category {
  margin-top: 128px;
  position: relative;
  padding-bottom: 128px;
  &:after {
    position: absolute;
    content: '';
    width: 100%;
    bottom: 0;
    height: 1px;
    background: #cfd8dc;
    left: 0;
  }
  &__title {
    display: flex;
    justify-content: center;
    align-items: center;
    h2 {
      margin-bottom: 0;
    }
  }
  &__title-decoration {
    margin-right: 16px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $main-gradient;
    border-radius: 4px;
    font-family: $ibm-font;
    font-size: 24px;
    font-style: italic;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
  }
  &__desktop {
    margin-top: 64px;
    display: grid;
    grid-column-gap: 32px;
    grid-row-gap: 50px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-auto-rows: 1fr;
  }
  &__category-item {
    &--more {
      position: relative;
      padding: 32px;
      border: 1px solid #b4bac7;
      border-radius: 4px;
      &:hover {
        border: 1px solid transparent;
        background: $main-gradient;
        box-shadow: 0px 5px 37.6px 2.4px rgba(20, 88, 235, 0.3);
        .homepage-category__first-heading {
          color: white;
        }
        .homepage-category__second-heading {
          color: white;
        }
        .homepage-category__more-description {
          color: white;
        }
        .homepage-category__more-button {
          button {
            border: 1px solid white;
            background: transparent;
            span {
              color: white;
            }
            svg {
              fill: white;
            }
          }
        }
      }
    }
  }
  &__more-title {
  }
  &__first-heading {
    margin-bottom: 3px;
    font-family: $montserrat-font;
    font-size: 12px;
    font-weight: 300;
    text-transform: uppercase;
    color: $main-color;
  }
  &__second-heading {
    margin-bottom: 0;
    font-family: $montserrat-font;
    font-size: 20px;
    font-weight: 500;
    text-transform: uppercase;
    color: $main-color;
  }
  &__more-description {
    margin-top: 4px;
    font-family: $sours-sans-p-font;
    font-size: 14px;
    color: $main-grey;
  }
  &__more-button {
    position: absolute;
    right: 32px;
    bottom: 32px;
    button {
      width: 112px;
      height: 32px;
      svg {
        transform: rotate(-180deg);
        width: 14px;
      }
    }
  }
  &__responsive {
    margin-top: 16px;
    padding: 0;
    .swiper-container {
      padding-bottom: 48px;
    }
    .swiper-wrapper {
      padding-top: 2px;
      padding-bottom: 2px;
      padding-left: 0;
    }
    .swiper-slide {
      padding: 0 8px;
      height: initial;
    }
  }
  &__card-wrap {
    display: block;
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .homepage-category {
    &__desktop {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
}

@media (min-width: $md) and (max-width: $lg) {
}

@media (min-width: $sm) and (max-width: $md) {
  .homepage-category {
    &__desktop {
      grid-template-columns: 1fr 1fr 1fr;
    }
    &__category-item {
      &--more {
        display: block;
        position: relative;
        padding: 32px;
        width: 100%;
        height: 100%;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .homepage-category {
    padding-bottom: 0;
    margin-top: 32px;
    &:after {
      display: none;
    }
    &__title {
      h2 {
        font-size: 20px;
        font-weight: 500;
      }
    }
    &__title-decoration {
      width: 32px;
      height: 32px;
      font-size: 20px;
    }
    &__desktop {
      grid-template-columns: 1fr 1fr;
    }
    &__responsive {
      .swiper-container {
        padding-bottom: 48px;
      }
    }
    &__category-item {
      &--more {
        display: block;
        position: relative;
        padding: 16px;
        width: 100%;
        height: 100%;
        border: 1px solid transparent;
        background: $main-gradient;
      }
    }
    &__first-heading {
      color: white;
    }
    &__second-heading {
      font-size: 14px;
      text-transform: uppercase;
      font-weight: 600;
      color: white;
    }
    &__more-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      right: 16px;
      left: 16px;
      bottom: 16px;
      span {
        font-family: $montserrat-font;
        font-size: 11px;
        font-weight: 500;
        color: white;
        text-transform: uppercase;
      }
      svg {
        transform: rotate(-180deg);
        width: 22px;
        fill: white;
      }
    }
  }
}
</style>
