<template>
  <div>
    <div class="relative-wrap">
      <dealer-slider
        v-if="dealer"
        :banners="dealer.banner_images"
      ></dealer-slider>
      <search
        :position="$mq === 'xs' || $mq === 'sm' || $mq === 'md' ? 0 : -124"
        :negativeMargin="true"
        class="search-common"
      ></search>
    </div>
    <dealer-info :dealer="dealer"></dealer-info>
    <dealer-sections
      class="dealer-section"
      :firstSection="!i"
      :section="section"
      v-for="(section, i) in sections"
      :key="i"
    ></dealer-sections>
    <catalog class="dealer-catalog" :type="'dealer'"> </catalog>

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
import Catalog from '@/components/category/Catalog'
import BestSellersSlider from '../common-components/BestSellersSlider'
import DealerSlider from '../category/MainSlider'
import DealerInfo from './DealerInfo'
import DealerSections from './DealerSections'
import DealerReviews from './DealerReviews'
import BrandsSlider from '../common-components/BrandsSlider'
import search from '@/components/parts/SearchCommon'
import utils from '@/mixins/utils'

export default {
  name: 'DealerPage',
  data () {
    return {
      dealer: null,
      dealerSlug: this.$route.params.slug,
      sections: [],
      bestSellersCollection: [],
      swiperOptionBrands: {
        slidesPerView: 6,
        spaceBetween: 0,
        pagination: '.brands-pagination',
        paginationClickable: true,
        slidesPerGroup: 6,
        loopFillGroupWithBlank: true,
        breakpoints: {
          // when window width is <= 940
          640: {
            slidesPerView: 2,
            slidesPerColumn: 2,
            slidesPerColumnFill: 'row'
          },
          960: {
            slidesPerView: 4
          }
        }
      },
      swiperOption: {
        slidesPerView: 4,
        spaceBetween: 16,
        pagination: '.best-sellers-pagination',
        paginationClickable: true,
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
  mixins: [utils],
  watch: {
    $route (to, from) {
      /**
       * Проверка для смены дилера с модалки
       */
      if (to.params.slug !== from.params.slug) {
        this.dealerSlug = to.params.slug
        this.fetchDealerInfo()
        this.fetchDealerSections()
        this.fetchBestSellersProducts()
      }
    }
  },
  methods: {
    fetchDealerInfo () {
      this.$store.dispatch('fetchDealerInfo', this.dealerSlug).then(
        response => {
          this.dealer = response.data
        },
        error => {
          console.error(error)
        }
      )
    },
    fetchDealerSections () {
      this.$store.dispatch('fetchDealerSections', this.dealerSlug).then(
        response => {
          this.sections = response.data
        },
        error => {
          console.error(error)
        }
      )
    },
    fetchBestSellersProducts () {
      this.$store
        .dispatch('fetchBestsellersProducts', {
          slug: this.$route.params.slug,
          type: 'dealers'
        })
        .then(response => {
          this.bestSellersCollection = response
        })
    }
  },
  components: {
    DealerSlider,
    DealerInfo,
    DealerSections,
    DealerReviews,
    BrandsSlider,
    search,
    Catalog,
    BestSellersSlider
  },
  beforeRouteLeave (to, from, next) {
    this.scrollingModalOpen(false)
    next()
  },
  mounted () {
    this.fetchDealerInfo()
    this.fetchDealerSections()
    this.fetchBestSellersProducts()
  }
}
</script>
<style lang="scss" scoped>
.dealer-catalog {
  margin-top: 48px;
}
.relative-wrap {
  position: relative;
}
.featured-brands {
  margin-top: 64px;
  margin-bottom: 86px;
  h2 {
    margin-bottom: 22px;
    text-align: center;
  }
}
.dealer-caption {
  margin-top: 86px;
  margin-bottom: 70px;
  p {
    margin-bottom: 0;
    color: $paragraph;
    font-family: $sours-sans-p-font;
    font-size: 14px;
    line-height: 19px;
  }
  p + p {
    margin-top: 24px;
  }
}
@media (min-width: $xs) and (max-width: $sm) {
  .first-section {
    margin-top: 32px;
  }
}
</style>
