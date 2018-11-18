<template>
  <div>
    <div class="relative-wrap">
      <main-slider
        v-if="category"
        :liftUpPagination="openSearch"
        fixedControls="true"
        :key="category.id"
        :banners="category.banner_images"
      ></main-slider>
      <div id="search-form-anchor"></div>
      <transition name="fade">
        <search
          v-if="openSearch"
          :filterSearch="filterSearch"
          @search="setVehicle()"
          :negativeMargin="true"
          @closeSearch="toggleSearchForm(false)"
          :position="$mq === 'xs' || $mq === 'sm' || $mq === 'md' ? 0 : -124"
          class="search-common"
        ></search>
      </transition>
    </div>
    <category-info
      @toggleSearchForm="toggleSearchForm"
      :category="category"
      :openSearch="openSearch"
    />
    <catalog
      @changeEmptyVehicle="toggleSearchForm(true, true)"
      class="filters"
      :type="'category'"
    >
    </catalog>
    <div class="container" v-if="featuredProductsCollection.length">
      <featured-product
        :options="featuredSliderOptions"
        :featuredProductsCollection="featuredProductsCollection"
      ></featured-product>
    </div>
    <div class="container">
      <best-sellers-slider
        :options="swiperOption"
        v-if="bestSellersCollection.length"
        :bestSellersCollection="bestSellersCollection"
      ></best-sellers-slider>
    </div>
  </div>
</template>

<script>
import search from '@/components/parts/SearchCommon'
import BestSellersSlider from '../common-components/BestSellersSlider'
import FeaturedProduct from '../common-components/FeaturedProductsSlider'
import MainSlider from '@/components/category/MainSlider'
import CategoryInfo from '@/components/category/CategoryInfo'
import Catalog from '@/components/category/Catalog'
import Brand from '@/components/common-components/Brand'
import utils from '@/mixins/utils'
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  name: 'Category',
  data () {
    return {
      openSearch: null,
      category: null,
      filterSearch: true,
      bestSellersCollection: [],
      featuredProductsCollection: [],
      swiperOption: {
        slidesPerView: 4,
        spaceBetween: 16,
        pagination: {
          el: '.best-sellers-pagination',
          clickable: true
        },
        slidesPerGroup: 4,
        loopFillGroupWithBlank: true,
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
      },
      featuredSliderOptions: {
        slidesPerView: 4,
        spaceBetween: 16,
        pagination: {
          el: '.featured-pagination',
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
      }
    }
  },
  mixins: [utils],
  watch: {
    '$route' (val, oldVal) {
      if (val.params.slug !== oldVal.params.slug) {
        this.fetchCategory()
        this.fetchBestSellersProducts()
        this.fetchFeaturedProducts()
      }

      this.toggleSearchForm(!val.query.vehicle)
    }
  },
  methods: {
    toggleSearchForm (open, scroll) {
      this.openSearch = open

      if (scroll) this.$scrollTo('#search-form-anchor', 1500, { offset: -200 })
    },
    fetchCategory () {
      this.$store
        .dispatch('fetchCategory', this.$route.params.slug)
        .then(resp => {
          this.category = resp.data
        })
    },
    setVehicle () {
      if (this.vehicleSearch && this.getSearchOptions.selectedModel.value) {
        let id = this.getSearchOptions.selectedModel.value

        this.$store.dispatch('fetchVehicle', parseInt(id)).then(resp => {
          resp.vehicle_brand_name ? (this.loaded = true) : (this.loaded = false)
        })

        this.toggleSearchForm(false)
      }
    },
    fetchBestSellersProducts () {
      this.$store.dispatch('fetchBestsellersProducts', {
          slug: this.$route.params.slug,
          type: 'categories'
        })
        .then(response => {
          this.bestSellersCollection = response
        })
    },
    fetchFeaturedProducts () {
      this.$store
        .dispatch('fetchFeaturedProducts', {
          slug: this.$route.params.slug,
          type: 'categories'
        })
        .then(response => {
          this.featuredProductsCollection = response
        })
    }
  },
  computed: {
    ...mapGetters(['getVehicle', 'getSearchOptions']),
    vehicleSearch () {
      return (
        this.$route.query.vehicle && !_.isUndefined(this.$route.query.vehicle)
      )
    }
  },
  components: {
    MainSlider,
    CategoryInfo,
    Brand,
    Catalog,
    search,
    BestSellersSlider,
    FeaturedProduct
  },
  created () {
    this.fetchCategory()
    this.fetchBestSellersProducts()
    this.fetchFeaturedProducts()
  },
  mounted () {
    this.toggleSearchForm(!this.vehicleSearch)
  },
  beforeDestroy () {},
  beforeRouteLeave (to, from, next) {
    this.scrollingModalOpen(false)
    next()
  }
}
</script>
<style lang="scss" scoped="true">
.relative-wrap {
  position: relative;
}
.filters {
  margin-top: 24px;
  margin-bottom: 80px;
}
.large-top {
  margin-top: 110px;
}
.select-search {
  bottom: 0;
  z-index: 100;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

@media (min-width: $md) and (max-width: $lg) {
  .filters {
    padding: 0;
  }
}
</style>
