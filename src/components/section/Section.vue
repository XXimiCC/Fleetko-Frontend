<template>
  <div class="section">
    <div class="relative-wrap">
      <main-slider
        v-if="section"
        :banners="section.banner_images"
      ></main-slider>
      <search
        :position="$mq === 'xs' || $mq === 'sm' || $mq === 'md' ? 0 : -124"
        class="search-common"
      ></search>
    </div>
    <div class="container">
      <div
        class="section__breadcrumbs breadcrumb-links"
        itemscope
        itemtype="http://schema.org/BreadcrumbList"
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
        <span itemprop="name" class="active">{{ getSection.name }}</span>
      </div>
      <div class="section__categories">
        <h2 class="h2-secondary section__categories__title">
          {{ getSection.name }}
        </h2>
        <div class="section__categories--item-wrap">
          <router-link
            :to="{ name: 'catalog', params: { slug: category.slug } }"
            :key="category.id"
            class="section__categories--item"
            v-for="category in getSection.categories"
            tag="a"
          >
            <categoryCard
              :category="category"
              :counter="enableCounters()"
              :textMaxWidth="
                $mq === 'sm' || $mq === 'md' || $mq === 'lg' ? '120px' : '100%'
              "
            >
            </categoryCard>
          </router-link>
        </div>
      </div>
      <div class="section__seo-text" v-if="getSection.description">
        <p class="paragraph-secondary">{{ getSection.description }}</p>
      </div>
      <div v-if="bestSellersCollection.length">
        <best-sellers-slider
          :options="swiperOptionBestSellers"
          :bestSellersCollection="bestSellersCollection"
        ></best-sellers-slider>
      </div>
      <div class="section__categories--brands row">
        <h2 class="h2-secondary section__categories--brands__title">
          Featured Brands
        </h2>
        <brands-slider :swiperOptions="swiperOptionBrands"></brands-slider>
      </div>
    </div>
  </div>
</template>

<script>
import search from '@/components/parts/SearchCommon'
import BrandsSlider from '@/components/common-components/BrandsSlider'
import BestSellersSlider from '../common-components/BestSellersSlider'
import MainSlider from '@/components/category/MainSlider'
import categoryCard from '@/components/common-components/CategoryCard'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from 'vuex'
import utils from '@/mixins/utils'
import Vue from 'vue'
import Meta from 'vue-meta'

Vue.use(Meta)

export default {
  name: 'Section',
  data () {
    return {
      section: null,
      sectionSlug: null,
      bestSellersCollection: [],
      swiperOptionBestSellers: {
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
      },
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
      }
    }
  },
  metaInfo () {
    return {
      title: `Fleetko`
    }
  },
  watch: {},
  mixins: [utils],
  methods: {
    enableCounters () {
      return !!this.$route.query.model
    },
    fetchSection (update) {
      this.sectionSlug = update ? update : this.$route.params.slug
      this.$store.dispatch('fetchSection', this.sectionSlug).then(
        resp => {
          this.section = resp.data
          // eslint-disable-next-line
        },
        error => {
          console.error(error)
        }
      )
    },
    fetchBestSellersProducts () {
      this.$store
        .dispatch('fetchBestsellersProducts', {
          slug: this.sectionSlug,
          type: 'sections'
        })
        .then(response => {
          this.bestSellersCollection = response
        })
    }
  },
  components: {
    MainSlider,
    categoryCard,
    BrandsSlider,
    swiper,
    swiperSlide,
    BestSellersSlider,
    search
  },
  computed: {
    ...mapGetters(['getSection', 'enableSearch'])
  },
  beforeRouteUpdate (to, from, next) {
    this.fetchSection(to.params.slug)
    this.fetchBestSellersProducts()
    next()
  },
  mounted () {
    this.fetchSection()
    this.fetchBestSellersProducts()
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
.section {
  &__breadcrumbs {
    margin-top: 145px;
  }
  &__description {
    margin-top: 24px;
    margin-bottom: 0;
    font-family: $sours-sans-p-font;
    font-size: 14px;
    line-height: 19px;
    color: $dark-grey;
  }
  &__seo-text {
    margin-top: calc(64px - 16px);
    p {
      margin-bottom: 0;
    }
  }
  &__categories {
    display: flex;
    flex-wrap: wrap;
    &__title {
      margin-top: 32px;
      margin-bottom: 0;
      flex: 0 0 50%;
    }
    &__counter {
      margin-top: 32px;
      margin-bottom: 64px;
      flex: 0 0 50%;
      text-align: right;
      font-family: $montserrat-font;
      font-weight: 500;
      font-size: 14px;
      color: #a1a1a1;
      line-height: 18px;
    }
    &--item {
      margin-right: 16px;
      flex: 0 0 256px;
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
    &--item-wrap {
      margin-top: 40px;
      padding: 0 24px;
      display: flex;
      flex-flow: row wrap;
      width: 100%;
    }
    &--best {
      position: relative;
      &__title {
        margin-top: 64px;
        margin-bottom: 32px;
        text-align: center;
      }
      .swiper-container {
        padding-bottom: 50px;
      }
      .swiper-pagination {
        bottom: -3px;
      }
      &--slider {
        &--buttons {
          button {
            background: none;
            border: none;
          }
          svg {
            width: 32px;
            height: 32px;
            fill: $main-grey;
            cursor: pointer;
            &:hover {
              fill: $main-color;
            }
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
      }
    }
    &--brands {
      position: relative;
      margin-top: 64px;
      margin-bottom: 143px;
      .swiper-pagination {
        bottom: 0px;
      }
      .swiper-container {
        height: 166px;
        padding-bottom: 10px;
        padding-top: 10px;
      }
      .swiper-wrapper {
        padding: 0 16px;
        height: 110px;
      }
      &__title {
        width: 100%;
        margin-bottom: 32px;
        text-align: center;
      }
      &--item {
        height: 104px;
        padding: 2px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          box-shadow: 0px 10px 14.1px 0.9px rgba(0, 0, 0, 0.14),
            0px 4px 19.6px 0.4px rgba(0, 0, 0, 0.06);
        }
        img {
          max-width: 80%;
        }
      }
      &--slider {
        &--buttons {
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
            top: 45%;
            left: -64px;
          }
          .right {
            position: absolute;
            top: 45%;
            right: -64px;
          }
        }
      }
    }
  }
}
.section__categories--item + .section__categories--item {
  margin-bottom: 16px;
}

@media (max-width: $xl) {
  .section {
    &__categories {
      &--best {
        &--slider {
          &--buttons {
            display: none;
          }
        }
      }
    }
  }
}
@media (min-width: $sm) and (max-width: 961px) {
  .section {
    &__categories {
      &--item {
        padding: 0 8px;
        flex: 0 0 25%;
        margin-right: 0;
        flex-shrink: 2;
      }
    }
  }
}
@media (min-width: $xssm) and (max-width: $sm) {
  .section {
    &__categories {
      &--item {
        padding: 0 8px;
        flex: 0 0 33.3%;
        margin-right: 0;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .section {
    &__categories {
      &--item {
        padding: 0 8px;
        flex: 0 0 50%;
        margin-right: 0;
      }
      &--item-wrap {
        padding: 0;
      }
    }
  }
  .section__categories--item + .section__categories--item {
    margin-bottom: 0;
  }
}
</style>
