<template>
  <div class="search-result">
    <div class="container">
      <div class="search-result__header">
        <div class="search-result__header--info">
          <span class="counts">{{ resultTotalCounter }}</span>
          <span> results found for </span>
          <span class="search-query">"{{ searchQuery }}"</span>
        </div>
      </div>
      <div class="search-result__body">
        <div
          class="search-result__body--products"
          id="products"
          :class="{ 'no-indent': !this.searchProducts._results.length }"
        >
          <ais-index
            :index-name="'products'"
            :search-store="searchProducts"
            :query="searchQuery"
          >
            <ais-results :results-per-page="productsLimit">
              <div
                class="search-result__body--products--stats"
                id="products-anchor"
                slot="header"
              >
                <ais-stats>
                  <template
                    slot-scope="{
                      totalResults,
                      processingTime,
                      query
                    }"
                  >
                    <span class="title">Products </span>
                    <span class="total"
                      >({{ (productTotal = totalResults) }})</span
                    >
                  </template>
                </ais-stats>
              </div>

              <template slot-scope="{ result }">
                <result-product :result="result"></result-product>
              </template>
            </ais-results>

            <div
              class="pagination"
              v-show="
                searchProducts._results.length && productTotal > productsLimit
              "
            >
              <div class="pagination__info">
                <p>
                  Showing <span>{{ productPaginationInfo }}</span> of
                  <span>{{ productTotal }}</span> results
                </p>
              </div>
              <div class="pagination__main">
                <ais-pagination :padding="2">
                  <div class="first-test" slot="first">
                    <i class="fa fa-angle-double-left" aria-hidden="true"></i>
                  </div>
                  <div class="prev-test" slot="previous">
                    <i class="fa fa-angle-left" aria-hidden="true"></i>
                  </div>
                  <div class="next-test" slot="next">
                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                  </div>
                  <div class="last-test" slot="last">
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                  </div>
                </ais-pagination>
              </div>
            </div>
          </ais-index>
        </div>

        <div
          class="search-result__body--categories"
          id="categories"
          :class="{ 'no-indent': !this.searchCategories._results.length }"
        >
          <ais-index
            :index-name="'categories'"
            :search-store="searchCategories"
            :query="searchQuery"
          >
            <ais-results>
              <div
                class="search-result__body--categories--stats"
                id="categories-anchor"
                slot="header"
              >
                <ais-stats>
                  <template
                    slot-scope="{
                      totalResults,
                      processingTime,
                      query
                    }"
                  >
                    <span class="title">Categories </span>
                    <span class="total"
                      >({{ (categoryTotal = totalResults) }})</span
                    >
                  </template>
                </ais-stats>
              </div>

              <template slot-scope="{ result }">
                <router-link
                  :to="{ name: 'catalog', params: { slug: result.slug } }"
                  class="search-result__body--categorie-wrap"
                >
                  <category-card :category="result"></category-card>
                </router-link>
              </template>
            </ais-results>
          </ais-index>
        </div>

        <div
          class="search-result__body--dealers"
          id="dealers"
          :class="{ 'no-indent': !this.searchDealers._results.length }"
        >
          <ais-index
            :index-name="'dealers'"
            :search-store="searchDealers"
            :query="searchQuery"
          >
            <ais-results>
              <div
                class="search-result__body--dealers--stats"
                id="dealers-anchor"
                slot="header"
              >
                <ais-stats>
                  <template
                    slot-scope="{
                      totalResults,
                      processingTime,
                      query
                    }"
                  >
                    <span class="title">Dealers </span>
                    <span class="total"
                      >({{ (dealerTotal = totalResults) }})</span
                    >
                  </template>
                </ais-stats>
              </div>

              <template slot-scope="{ result }">
                <result-dealer
                  class="dealer-wrap"
                  :result="result"
                ></result-dealer>
              </template>
            </ais-results>
          </ais-index>
        </div>

        <div
          class="search-result__body--vehicles"
          id="vehicles"
          :class="{ 'no-indent': !this.searchVehicles._results.length }"
        >
          <ais-index
            :index-name="'vehicles'"
            :search-store="searchVehicles"
            :query="searchQuery"
          >
            <ais-results :results-per-page="21">
              <div
                class="search-result__body--dealers--stats"
                id="vehicles-anchor"
                slot="header"
              >
                <ais-stats>
                  <template
                    slot-scope="{
                      totalResults,
                      processingTime,
                      query
                    }"
                  >
                    <span class="title">Vehicles </span>
                    <span class="total"
                      >({{ (vehicleTotal = totalResults) }})</span
                    >
                  </template>
                </ais-stats>
              </div>

              <template slot-scope="{ result }">
                <result-vehicle
                  class="vehicle-wrap"
                  :result="result"
                ></result-vehicle>
              </template>
            </ais-results>

            <div
              class="pagination"
              v-show="
                searchVehicles._results.length && vehicleTotal > vehicleLimit
              "
            >
              <div class="pagination__info">
                <p>
                  Showing <span>{{ vehiclePaginationInfo }}</span> of
                  <span>{{ vehicleTotal }}</span> results
                </p>
              </div>
              <div class="pagination__main">
                <ais-pagination :padding="2">
                  <div class="first-test" slot="first">
                    <i class="fa fa-angle-double-left" aria-hidden="true"></i>
                  </div>
                  <div class="prev-test" slot="previous">
                    <i class="fa fa-angle-left" aria-hidden="true"></i>
                  </div>
                  <div class="next-test" slot="next">
                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                  </div>
                  <div class="last-test" slot="last">
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                  </div>
                </ais-pagination>
              </div>
            </div>
          </ais-index>
        </div>
      </div>

      <div class="search-result__navigation">
      <div v-if="searchNavigation.length"
           class="search-result__navigation--sticky"
           :key="searchQuery"
           v-sticky="{ zIndex: 100, stickyTop: 150 }">
        <div class="search-result__navigation--body">
          <div :class="{ 'search-result__navigation--arrow--disabled': searchNavigation[0].active }"
               @click="changeActiveIndex('up', !searchNavigation[0].active)"
               class="search-result__navigation--arrow up">
            <svg-chevron></svg-chevron>
          </div>

          <div class="item"
               @click="changeActiveNav(nav)"
               :class="{ 'item--active': nav.active }"
               v-for="nav in searchNavigation">
            <span class="name">{{ nav.name }}</span>
            <div class="decorator"></div>
          </div>
          <div :class="{ 'search-result__navigation--arrow--disabled':  searchNavigation[searchNavigation.length - 1].active }"
               @click="changeActiveIndex('down', !searchNavigation[searchNavigation.length - 1].active)"
               class="search-result__navigation--arrow down">
            <svg-chevron></svg-chevron>
          </div>
        </div>
      </div>
    </div>

    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import categoryCard from '@/components/common-components/CategoryCard'
import ResultProduct from './result-components/ResultProducts'
import ResultDealer from './result-components/ResultDealers'
import ResultVehicle from './result-components/ResultVehicles'
import { AlgoliaApi } from '@/mixins/AlgoliaApi'
import VueSticky from 'vue-sticky'
import config from '../../config'
import utils from '@/mixins/utils'
import { createFromAlgoliaCredentials } from 'vue-instantsearch'
import { EventBus } from '../../event-bus'

export default {
  name: 'search-result',
  components: {
    ResultProduct,
    categoryCard,
    ResultDealer,
    ResultVehicle
  },
  mixins: [AlgoliaApi, utils],
  directives: {
    sticky: VueSticky
  },
  data () {
    return {
      searchQuery: this.$route.query.q,
      productsLimit: 8,
      vehicleLimit: 21,
      productTotal: null,
      categoryTotal: null,
      dealerTotal: null,
      vehicleTotal: null,
      searchProducts: createFromAlgoliaCredentials(
        config.algoliaApiId,
        config.algoliaApiKey
      ),
      searchCategories: createFromAlgoliaCredentials(
        config.algoliaApiId,
        config.algoliaApiKey
      ),
      searchDealers: createFromAlgoliaCredentials(
        config.algoliaApiId,
        config.algoliaApiKey
      ),
      searchVehicles: createFromAlgoliaCredentials(
        config.algoliaApiId,
        config.algoliaApiKey
      )
    }
  },
  computed: {
    resultTotalCounter () {
      let productCount = this.searchProducts._results.length
        ? this.productTotal
        : 0
      let categoryCount = this.searchCategories._results.length
        ? this.categoryTotal
        : 0
      let dealerCount = this.searchDealers._results.length
        ? this.dealerTotal
        : 0
      let vehicleTotal = this.searchVehicles._results.length
        ? this.vehicleTotal
        : 0

      return productCount + categoryCount + dealerCount + vehicleTotal
    },
    currentPaginationPage () {
      return this.searchProducts._helper.state.page
    },
    productPaginationInfo () {
      let page = this.searchProducts._helper.state.page + 1

      if (page === 1) {
        if (this.productTotal < this.productsLimit) {
          return `1 - ${this.productTotal}`
        } else {
          return `1 - ${this.productsLimit}`
        }
      } else {
        return `${page * this.productsLimit - this.productsLimit} - ${
          page * this.productsLimit > this.productTotal
            ? this.productTotal
            : page * this.productsLimit
          }`
      }
    },
    vehiclePaginationInfo () {
      let page = this.searchVehicles._helper.state.page + 1

      if (page === 1) {
        if (this.vehicleTotal < this.vehicleLimit) {
          return `1 - ${this.vehicleTotal}`
        } else {
          return `1 - ${this.vehicleLimit}`
        }
      } else {
        return `${page * this.vehicleLimit - this.vehicleLimit} - ${
          page * this.vehicleLimit > this.vehicleTotal
            ? this.vehicleTotal
            : page * this.vehicleLimit
          }`
      }
    },
    searchNavigation () {
      let arr = []

      if (this.searchProducts._results.length) {
        arr.push({
          name: 'products',
          active: this.$route.query.entity === 'products'
        })
      }
      if (this.searchCategories._results.length) {
        arr.push({
          name: 'categories',
          active: this.$route.query.entity === 'categories'
        })
      }
      if (this.searchDealers._results.length) {
        arr.push({
          name: 'dealers',
          active: this.$route.query.entity === 'dealers'
        })
      }
      if (this.searchVehicles._results.length) {
        arr.push({
          name: 'vehicles',
          active: this.$route.query.entity === 'vehicles'
        })
      }
      return arr
    },
  },
  watch: {
    currentPaginationPage () {
      this.$scrollTo(`#products`, 1500, { offset: -180 })
    }
  },
  created () {
    EventBus.$on('changeQueryFromSearchModal', () =>
      this.scrollFromModalComponent()
    )

    document.addEventListener('scroll', this.scrollHandler)

    if (this.$route.query.entity) {
      setTimeout(() => {
        this.$scrollTo(`#${this.$route.query.entity}`, 1500, { offset: -180 })
      }, 1000)
    }
  },
  methods: {
    scrollFromModalComponent () {
      /**
       * Таймаут необходим для коректного скрола, у нас может менятся высота блока в связи с тем что контент динамический
       * тоесть скрол может сработать на том этапе когда нету данных, к сожалению алголиевский компонент не дает хука что все прогрузилось
       */
      setTimeout(() => {
        this.$scrollTo(`#${this.$route.query.entity}`, 1500, { offset: 0 })
      }, 1000)
    },
    scrollHandler: _.throttle(function () {
      this.checkProductsViewport()
    }, 200),
    checkProductsViewport () {
      let productViewport = document.getElementById('products')
      let categoryViewport = document.getElementById('categories')
      let vehiclesViewport = document.getElementById('vehicles')
      let dealerViewport = document.getElementById('dealers')

      if (
        this.searchDealers._results.length &&
        this.isElementInView(dealerViewport, false, 200)
      ) {
        this.$router.replace({
          query: { q: this.searchQuery, entity: 'dealers' }
        })
      }

      if (
        this.searchProducts._results.length &&
        this.isElementInView(productViewport, false, 200)
      ) {
        this.$router.replace({
          query: { q: this.searchQuery, entity: 'products' }
        })
      }

      if (
        this.searchCategories._results.length &&
        this.isElementInView(categoryViewport, false, 200)
      ) {
        this.$router.replace({
          query: { q: this.searchQuery, entity: 'categories' }
        })
      }

      if (
        this.searchVehicles._results.length &&
        this.isElementInView(vehiclesViewport, false, 270)
      ) {
        this.$router.replace({
          query: { q: this.searchQuery, entity: 'vehicles' }
        })
      }
    },
    changeActiveNav ({ name }) {
      this.$scrollTo(`#${name}`, 1500, { offset: -180 })
    },
    changeActiveIndex (direction, enabled) {
      let nextName = null
      let index = null

      if (enabled) {
        if (direction === 'up') {
          index = this.searchNavigation.findIndex(nav => nav.active)
          nextName = this.searchNavigation[index - 1].name
        } else if (direction === 'down') {
          index = this.searchNavigation.findIndex(nav => nav.active)
          nextName = this.searchNavigation[index + 1].name
        }

        this.$scrollTo(`#${nextName}`, 100, { offset: -180 })
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (to.query.q !== from.query.q) {
      this.updateAlgoly()
      this.searchQuery = to.query.q
    }
    next()
  },
  beforeDestroy () {
    EventBus.$off('changeQueryFromSearchModal')
    document.removeEventListener('scroll', this.scrollHandler)
  }
}
</script>

<style scoped lang="scss">
.search-result {
  position: relative;

  .no-indent {
    margin: 0;
    padding: 0;
  }

  &__navigation {
    position: absolute;
    right: 5%;
    top: -80px;
    height: 100%;
    width: 125px;

    &--arrow {
      position: absolute;

      svg {
        fill: $svg-fill-tertiary;
        width: 25px;
      }

      &.up {
        top: -44px;
        right: -5px;
        transform: rotate(180deg);
        cursor: pointer;
      }

      &.down {
        bottom: -44px;
        right: -5px;
        cursor: pointer;
      }

      &:hover {
        svg {
          fill: $main-color;
        }
      }

      &--disabled {
        &:hover {
          svg {
            fill: $svg-fill-tertiary;
          }
        }
      }
    }

    &--body {
      position: relative;
      top: 150px;

      .item {
        display: flex;
        align-items: center;
        text-align: right;
        justify-content: flex-end;
        cursor: pointer;
        .name {
          font: 12px $montserrat-font;
          color: $main-grey;
          text-transform: capitalize;
        }
        .decorator {
          transition: 0.5s;
          margin-left: 16px;
          width: 16px;
          height: 4px;
          border-radius: 4px;
          background: $main-grey;
        }

        &--active {
          margin-right: -8px;

          .name {
            color: $main-color;
            font-weight: 500;
            font-size: 16px;
          }
          .decorator {
            width: 32px;
            background: $main-color;
          }
        }
      }

      .item + .item {
        margin-top: 16px;
      }
    }
  }

  &__header {
    padding-top: 25px;
    padding-bottom: 64px;

    &--breadcrumbs {
      span {
        font: 11px $montserrat-font;
        color: $caption-text-color;
        cursor: pointer;
      }
      .active {
        color: $main-dark;
      }
    }

    &--info {
      span {
        font: 500 16px $montserrat-font;
        color: $main-grey;
      }
      .counts {
        color: $main-dark;
      }
      .search-query {
        color: $main-color;
      }
    }
  }

  &__body {
    &--products {
      margin-bottom: 80px;

      &--stats {
        margin-bottom: 32px;
        text-align: center;

        span {
          font: 500 34px $montserrat-font;
          color: $main-dark;

          &.total {
            color: $main-grey;
          }
        }
      }

      .pagination {
        position: relative;
        margin-top: 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        &__info {
          position: absolute;
          left: 0;
          top: 8px;

          p {
            margin-bottom: 0;
            font: 14px $sours-sans-p-font;
            color: $main-grey;
            span {
              color: $main-dark;
              font-weight: 600;
            }
          }
        }

        &__main {
          position: relative;

          .ais-pagination {
            margin-bottom: 0;
          }
        }
      }
    }

    &--categories {
      margin-bottom: 80px;
      padding: 0 24px;

      .ais-index {
        width: 100%;
      }

      .ais-results {
        display: flex;
        flex-wrap: wrap;
      }

      .category-card {
        margin-top: 8px;
      }

      &--stats {
        margin-bottom: 16px;
        width: 100%;
        text-align: center;

        span {
          font: 500 34px $montserrat-font;
          color: $main-dark;
          &.total {
            color: $main-grey;
          }
        }
      }
    }

    &--categorie-wrap {
      flex: 0 0 25%;
    }

    &--dealers {
      margin: 0 -16px 48px -16px;

      .ais-index {
        width: 100%;
      }

      .ais-results {
        display: flex;
        flex-wrap: wrap;
      }

      .dealer-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-basis: 25%;
        padding: 16px;
      }

      &--stats {
        width: 100%;
        margin-bottom: 24px;
        text-align: center;
        line-height: 1;
        span {
          font: 500 34px $montserrat-font;
          color: $main-dark;
          &.total {
            color: $main-grey;
          }
        }
      }
    }

    &--vehicles {
      margin-bottom: 200px;

      .pagination {
        position: relative;
        margin-top: 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        &__info {
          position: absolute;
          left: 0;
          top: 8px;

          p {
            margin-bottom: 0;
            font: 14px $sours-sans-p-font;
            color: $main-grey;
            span {
              color: $main-dark;
              font-weight: 600;
            }
          }
        }

        &__main {
          position: relative;
          .ais-pagination {
            margin-bottom: 0;
          }
        }
      }

      &--stats {
        margin-bottom: 24px;
        text-align: center;

        span {
          font: 500 34px $montserrat-font;
          color: $main-dark;
          &.total {
            color: $main-grey;
          }
        }
      }

      .ais-index {
        width: 100%;
      }

      .ais-results {
        display: flex;
        flex-wrap: wrap;
      }

      .vehicle-wrap {
        width: 352px;
        padding: 16px;
      }
    }
  }
}

@media (max-width: 1600px) {
  .search-result {
    &__navigation {
      display: none;
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .search-result {
    &__body {
      &--categorie-wrap {
        flex: 0 0 33.3%;
      }

      &--products {
        .pagination {
          margin-top: 32px;
          flex-direction: column;
          &__info {
            margin-bottom: 24px;
            position: relative;
          }
        }
      }

      &--vehicles {
        .vehicle-wrap {
          width: 50%;
        }
      }
    }
  }
}

@media (max-width: $sm) {
  .search-result {
    &__header {
      padding-bottom: 40px;
    }

    &__body {
      &--categories {
        margin-bottom: 40px;
        padding: 0;
        &--stats {
          text-align: left;
          span {
            font-size: 20px;
          }
        }
      }

      &--categorie-wrap {
        flex: 0 0 50%;
      }

      &--products {
        margin-bottom: 40px;

        &--stats {
          margin-bottom: 16px;
          text-align: left;

          span {
            font-size: 20px;
          }
        }

        .pagination {
          margin-top: 32px;
          flex-direction: column;

          &__info {
            margin-bottom: 24px;
            position: relative;
          }
        }
      }

      &--dealers {
        margin-bottom: 40px;
        &--stats {
          text-align: left;
          span {
            font-size: 20px;
          }
        }

        .dealer-wrap {
          margin-right: 0;
          flex: 0 0 50%;
          display: flex;
          justify-content: center;
        }
      }

      &--vehicles {
        .vehicle-wrap {
          width: 100%;
        }
      }
    }
  }
}
</style>
