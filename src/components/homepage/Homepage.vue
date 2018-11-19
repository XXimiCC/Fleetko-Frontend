<template>
  <div>
    <div class="relative-block">
      <homepage-slider :banners="homepageBanners"></homepage-slider>
      <homepage-search></homepage-search>
    </div>
    <homepage-categories
      v-if="Object.keys(getSections).length"
      :section="section"
      :key="i"
      v-for="(section, i) in getSections"
    ></homepage-categories>
    <div class="featured-products" v-if="featuredProducts.length">
      <div class="container">
        <featured-product
          :options="featuredSliderOptions"
          :featuredProductsCollection="featuredProducts"
        ></featured-product>
      </div>
    </div>
    <div class="featured-brands">
      <div class="container">
        <h2 class="featured-brands--title">Featured Brands</h2>
        <brands-slider
          :swiperOptions="swiperOptionBrands"
          class="dealers-slider"
        ></brands-slider>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import HomepageSlider from './HomepageSlider'
import HomepageSearch from './HomepageSearch'
import HomepageCategories from './HomepageCategories'
import BrandsSlider from '../common-components/BrandsSlider'
import FeaturedProduct from '../common-components/FeaturedProductsSlider'
import Vue from 'vue'
import Meta from 'vue-meta'
import utils from '@/mixins/utils'

Vue.use(Meta)

export default {
  name: 'Homepage',
  mixins: [utils],
  components: {
    HomepageSlider,
    HomepageCategories,
    HomepageSearch,
    BrandsSlider,
    FeaturedProduct
  },
  data: function () {
    return {
      sections: [],
      featuredProducts: [],
      homepageBanners: [],
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
  computed: {
    ...mapState({
      loading: state => state.user.loading
    }),
    ...mapGetters(['isAuth', 'getSections'])
  },
  metaInfo () {
    return {
      title: 'Fleetko'
    }
  },
  mounted () {
    this.fetchFeaturedProducts()
    this.fetchHomepageBanners()
  },
  methods: {
    fetchFeaturedProducts () {
      this.$store.dispatch('fetchFeaturedProducts', { slug: null, type: null })
        .then(response => {
          this.featuredProducts = response
        })
    },
    fetchHomepageBanners () {
      this.$store.dispatch('fetchHomepageBanners')
        .then(resp => {
          this.homepageBanners = resp.data
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.relative-block {
  margin-bottom: 186px;
  position: relative;
}
.featured-brands {
  position: relative;
  margin-top: 64px;
  &--title {
    margin-bottom: 32px;
    text-align: center;
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .relative-block {
    margin-bottom: 0;
    position: relative;
  }
  .featured-brands {
    margin-top: 32px;
    &--title {
      font-size: 20px;
    }
  }
}
</style>
