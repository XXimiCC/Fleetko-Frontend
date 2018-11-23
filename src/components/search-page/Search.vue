<template>
  <div class="search">
    <div class="relative-wrap">
      <main-slider></main-slider>
      <transition name="fade">
        <search
          :position="$mq === 'xs' || $mq === 'sm' || $mq === 'md' ? 0 : -121"
          @search="fetchData"
          @closeSearch="openSearch = false"
          class="search-common"
          v-if="openSearch"
        ></search>
      </transition>
    </div>
    <div class="search__info" :class="{ 'search__info--large': openSearch }">
      <div class="container container-flex">
        <div class="search__info--text">
          <p v-if="loaded">
            {{ getVehicle.year }} {{ getVehicle.vehicle_brand_name }}
            {{ getVehicle.name }}
          </p>
          <p>Accessories & Parts</p>
        </div>
        <div class="search__info--button">
          <button
            class="button-prime"
            v-if="!openSearch"
            @click="openSearch = true"
          >
            Change Vehicle
          </button>
        </div>
      </div>
    </div>
    <div class="container">
      <div
        class="search__breadcrumbs breadcrumb-links"
        itemscope
        itemtype="http://schema.org/BreadcrumbList"
        v-if="getVehicle.slug"
        :class="{ 'large-top': openSearch }"
      >
        <router-link
          itemprop="itemListElement"
          itemtype="http://schema.org/ListItem"
          itemscope
          :to="{ name: 'home' }"
          tag="a"
        >
          <span itemprop="name">Home</span>
          <meta itemprop="position" content="1" />
        </router-link>
        <span class="breadcrumbs-slash">/</span>
        <span class="active"
          >{{ getVehicle.year }} {{ getVehicle.vehicle_brand_name }}
          {{ getVehicle.name }}</span
        >
      </div>
    </div>
    <div class="container">
      <div class="search__empty" v-if="!getVehicleSections">
        <div class="item search__empty--text">
          <h1 class="h1-secondary">This List Is Empty!</h1>
          <p>
            There are no products for this category for the selected vehicle.
            Choose another category, or another car. You can see the goods in
            other categories for your car.
          </p>
        </div>
        <div class="item search__empty--image">
          <img src="@/assets/images/empty-back.png" alt="" />
        </div>
      </div>
      <div
        class="search__categories"
        v-for="section in getVehicleSections"
        v-else
      >
        <h2 class="h2-secondary search__categories__title">
          {{ section.name }}
        </h2>
        <h3 class="search__categories__subtitle" v-if="loaded">
          {{ getVehicle.year }} {{ getVehicle.vehicle_brand_name }}
          {{ getVehicle.name }}
        </h3>
        <div class="search__categories--item-wrap">
          <router-link
            :to="{
              name: 'catalog',
              params: { slug: category.slug },
              query: { vehicle: getVehicle.slug }
            }"
            class="search__categories--item"
            v-for="category in section.categories"
            :key="category.id"
            tag="a"
          >
            <categoryCard
              :category="category"
              :counter="true"
              :textMaxWidth="$mq === 'sm' || $mq === 'md' ? '120px' : '100%'"
              :picture="randomImage()"
            >
            </categoryCard>
          </router-link>
        </div>
      </div>
      <best-sellers-slider
        :options="swiperOption"
        v-if="bestSellers.length"
        :bestSellersCollection="bestSellers"
      ></best-sellers-slider>
      <div class="search__categories--brands row">
        <h2 class="h2-secondary search__categories--brands__title">
          Featured Brands
        </h2>
        <brands-slider
          :swiperOptions="swiperOptionBrands"
          class="dealers-slider"
        ></brands-slider>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/mixins/utils'
import MainSlider from '@/components/search-page/MainSlider'
import categoryCard from '@/components/common-components/CategoryCard'
import BrandsSlider from '../common-components/BrandsSlider'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import search from '@/components/parts/SearchCommon'
import { mapGetters, mapActions } from 'vuex'
import BestSellersSlider from '../common-components/BestSellersSlider'

export default {
  name: 'SearchVehicle',
  data () {
    return {
      openSearch: false,
      brand: '',
      year: '',
      model: '',
      loaded: false,
      bestSellers: [],
      swiperOptionBrands: {
        slidesPerView: 4,
        spaceBetween: 30,
        pagination: '.brands-pagination',
        paginationClickable: true,
        slidesPerGroup: 4,
        loopFillGroupWithBlank: true,
        breakpoints: {
          // when window width is <= 940
          640: {
            slidesPerView: 2,
            slidesPerColumn: 2,
            slidesPerColumnFill: 'row'
          },
          960: {
            slidesPerView: 3
          }
        }
      },
      swiperOption: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        pagination: '.best-sellers-pagination',
        paginationClickable: true,
        spaceBetween: 0,
        height: 'auto',
        onInit: function (swiper) {
          let slidesOutsideEvenGrid =
            swiper.slides.length % swiper.params.slidesPerColumn

          if (slidesOutsideEvenGrid !== 0) {
            let slidesNeededToFillGrid =
              swiper.params.slidesPerColumn - slidesOutsideEvenGrid

            for (let i = 0; i < slidesNeededToFillGrid; i++) {
              swiper.appendSlide('<div class="swiper-slide"></div>')
            }
          }
        },
        breakpoints: {
          648: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 0
          },
          900: {
            slidesPerView: 3,
            slidesPerGroup: 3
          }
        }
      }
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'searchPage') {
        this.fetchData()
        this.fetchBestSellersProducts()
      }
    }
  },
  mixins: [utils],
  methods: {
    swipeNext (slider) {
      this[slider].slideNext()
    },
    swipePrev (slider) {
      this[slider].slidePrev()
    },
    randomImage () {
      let arr = [
        'category-1',
        'category-2',
        'category-3',
        'category-4',
        'category-5',
        'category-6',
        'category-7',
        'category-8'
      ]
      let item = arr[Math.floor(Math.random() * arr.length)]
      return this.imageSrc(`category/${item}.png`)
    },
    ...mapActions(['setYearSearch', 'setBrandSearch', 'setModelSearch']),
    fetchSearch () {
      this.$store.dispatch('fetchSearch').then(() => this.checkRouteQuery())
    },
    checkRouteQuery () {
      this.setYearSearch(this.year)
        .then(result => {
          if (result) {
            this.setBrandSearch(this.brand)
            this.setModelSearch(this.model)
          } else {
            this.$store.dispatch('clearSearch', { year: true, brand: true, model: true })
          }
        })
    },
    fetchData () {
      this.$store
        .dispatch('fetchVehicle', this.$route.params.slug)
        .then(resp => {
          resp.vehicle_brand_name ? (this.loaded = true) : (this.loaded = false)
          this.model = {
            value: resp.id,
            label: resp.name
          }
          this.brand = resp.vehicle_brand_name
          this.year = resp.year

          this.fetchSearch()
        })
      this.$store.dispatch('fetchVehicleSections', this.$route.params.slug)
    },
    fetchBestSellersProducts () {
      this.$store
        .dispatch('fetchBestsellersProducts', {
          slug: this.$route.params.slug,
          type: 'vehicles'
        })
        .then(response => {
          this.bestSellers = response
        })
    }
  },
  components: {
    MainSlider,
    categoryCard,
    search,
    swiper,
    swiperSlide,
    BrandsSlider,
    BestSellersSlider
  },
  computed: {
    ...mapGetters(['getSearchOptions', 'getVehicleSections', 'getVehicle']),
    swiperPopular () {
      return this.$refs.swiperPopular.swiper
    },
    brandsSwiper () {
      return this.$refs.brandsSwiper.swiper
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.fetchData()
      vm.fetchSearch()
      vm.fetchBestSellersProducts()
    })
  },
  created () {}
}
</script>
<style lang="scss" scoped>
.relative-wrap {
  position: relative;
}
.search-wrap {
  position: relative;
}
.search {
  .swiper-popular {
    position: relative;
    padding-top: 16px;
    padding-bottom: 43px;
    .swiper-pagination {
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .large-top {
    margin-top: 142px;
  }
  &__info {
    position: relative;
    padding: 30px 0 26px 0;
    background: #f5f5f5;
    transition: padding 0.5s;
    .container-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &--text {
      line-height: 1;
      p {
        margin-bottom: 0;
        width: 100%;
        font-family: $montserrat-font;
        font-size: 34px;
        color: $main-dark;
        /*line-height: 1;*/
        &:first-child {
          font-weight: normal;
        }
        &:last-child {
          margin-top: 18px;
          font-size: 20px;
          font-weight: 200;
        }
      }
    }
    &--button {
      flex: 0 0 224px;
      display: flex;
      justify-content: flex-end;
      button {
        height: 40px;
        width: 160px;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: $montserrat-font;
        font-size: 12px;
        font-weight: 500;
        line-height: 18px;
        text-transform: uppercase;
      }
    }
    &--large {
      padding: 158px 0 32px 0;
    }
  }
  &__breadcrumbs {
    margin-top: 24px;
    flex: 0 0 100%;
    line-height: 1;
  }
  &__categories {
    display: flex;
    flex-wrap: wrap;
    &__title {
      width: 100%;
      margin-top: 64px;
      margin-bottom: 16px;
      text-align: center;
      line-height: 1;
    }
    &__subtitle {
      margin-bottom: 24px;
      width: 100%;
      font-family: $sours-sans-p-font;
      font-size: 14px;
      color: $caption-text-color;
      text-align: center;
      line-height: 1;
    }
    &--item {
      margin-right: 16px;
      flex: 0 0 256px;
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
    &--item-wrap {
      padding: 0 24px;
      display: flex;
      flex-flow: row wrap;
      width: 100%;
    }
    &--best {
      &-wrap {
        position: relative;
      }
      .slider-buttons {
        button {
          background: none;
          border: none;
        }
        svg {
          width: 32px;
          height: 32px;
          fill: $main-color;
          cursor: pointer;
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
      &__title {
        margin-top: 64px;
        margin-bottom: 32px;
        text-align: center;
      }
      .swiper-slide {
        height: auto;
      }
    }
    &--brands {
      position: relative;
      margin-top: 64px;
      margin-bottom: 143px;
      &__title {
        width: 100%;
        margin-bottom: 32px;
        font-family: $montserrat-font;
        text-align: center;
      }
    }
  }
}
.search__categories--item + .search__categories--item {
  margin-bottom: 16px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

@media (max-width: $xl) {
  .search {
    &__categories {
      &--best-wrap {
        .slider-buttons {
          display: none;
        }
      }
      &--brands {
        &--slider {
          &--buttons {
            display: none;
          }
        }
      }
    }
  }
}

@media (min-width: 1100px) and (max-width: $lg) {
  .search {
    &__categories {
      &--item {
        margin-right: 0px;
        flex: 0 0 24%;
        display: flex;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $lg) {
  .search {
    &__breadcrumbs {
      display: none;
    }
  }
}

@media (min-width: $md) and (max-width: 1180px) {
  .search {
    &__categories {
      &--item {
        margin-right: 0px;
        flex: 0 0 24%;
        display: flex;
        justify-content: center;
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .search {
    &__categories {
      &--item {
        margin-right: 0px;
        flex: 0 0 25%;
        display: flex;
        justify-content: center;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $md) {
  .search {
    .search__categories--item + .search__categories--item {
      margin-bottom: 0;
    }
    &__categories {
      &__title {
        margin-top: 32px;
        font-size: 20px;
      }
      &--item-wrap {
        padding: 0;
      }
    }
    &__info {
      &--large {
        padding: 48px 0 62px 0;
      }
      .container-flex {
        flex-wrap: wrap;
      }
      &--text {
        width: 100%;
      }
      &--button {
        margin-top: 16px;
        justify-content: flex-start;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .search {
    &__info {
      &--text {
        line-height: 1;
        p {
          font-size: 20px;
          &:first-child {
            font-weight: 500;
          }
          &:last-child {
            margin-top: 18px;
            font-size: 16px;
            font-weight: 300;
          }
        }
      }
    }
    &__categories {
      &--item {
        margin-right: 0px;
        flex: 0 0 33.3%;
        display: flex;
        justify-content: center;
      }
      &--item-wrap {
        padding: 0;
      }
    }
  }
}
</style>
