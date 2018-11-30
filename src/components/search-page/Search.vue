<template>
  <div class="search">
    <div class="relative-wrap">
      <main-slider :key="getVehicle.slug"></main-slider>
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
      >
        <router-link
          itemprop="itemListElement"
          itemtype="http://schema.org/ListItem"
          itemscope
          :to="{ name: 'home' }"
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
      <div class="search__empty" v-if="!Object.keys(this.getVehicleSections).length">
        <div class="item search__empty--text">
          <div class="item search__empty--image">
            <img :src="imageSrc('svg-empty-box.svg')" alt="" />
          </div>
          <h2 :class="{'h3-secondary': $mq !== 'md', 'h2-secondary': $mq === 'md'}">This List Is Empty!</h2>
          <p>
            There are no products for this vehicle. <br />
            Choose another vehicle.
          </p>
        </div>
        <div class="empty__row">
          <div class="empty__row-element">
            <div class="empty__row-image">
              <svg-envelope-fill></svg-envelope-fill>
            </div>
            <h3 class="h3-secondary">Have Any Questions</h3>
            <p class="paragraph-tertiary">
              Use our feedback form and we will answer any questions you are
              interested in.
            </p>

            <router-link :to="{ name: 'contactUs' }">
              <button class="button-prime">Contact us</button>
            </router-link>
          </div>

          <div class="empty__row-element">
            <div class="empty__row-image"><svg-home></svg-home></div>
            <h3 class="h3-secondary">Go Back To The Home Page</h3>
            <p class="paragraph-tertiary">
              You will be able to view all sections and categories and re-search
              for needed vehicle.
            </p>

            <router-link :to="{ name: 'home' }">
              <button class="button-prime">Go to the home page</button>
            </router-link>
          </div>
        </div>
      </div>

      <div v-else
           class="search__categories"
           v-for="section in getVehicleSections">

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
        :key="$route.path"
        v-if="bestSellers.length"
        :bestSellersCollection="bestSellers"
      ></best-sellers-slider>
      <div class="search__categories--brands row">
        <h2 class="h2-secondary search__categories--brands__title">
          Featured Brands
        </h2>
        <brands-slider :key="$route.path" class="dealers-slider"></brands-slider>
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
        pagination: {
          el: '.swiper-pagination',
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
      },
      swiperOption: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        pagination: {
          el: '.best-sellers-pagination',
          clickable: true
        },
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
    $route (to) {
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
          this.loaded = !!resp.vehicle_brand_name
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
  }
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
  &__empty {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    padding: 64px 0;
    h2 {
      margin: 24px 0;
    }
    h3 {
      margin-bottom: 24px;
    }
    p {
      padding: 0 8px;
      text-align: center;
      color: $main-grey;
    }
    &--text {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      margin-bottom: 64px;
    }
    .empty__row {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-around;
      width: 100%;
      &-element {
        max-width: 330px;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

        button {
          margin-top: 24px;
          width: 200px;
        }
      }
      &-image {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 22px;
        width: 48px;
        height: 48px;
        border-radius: 100%;
        background: #d0defb;
        svg {
          width: 24px;
          fill: $main-color;
        }
      }
    }
  }
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

@media (max-width: $sm) {
  .search__empty {
    &--text {
      margin-bottom: 0;
    }
    h3 {
      text-align: center;
    }
    .empty__row {
      flex-flow: column nowrap;
      align-items: center;
      &-element {
        margin-top: 36px;
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
