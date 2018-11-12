<template>
  <div>
    <div class="responsive-wrap">
      <transition name="fade">
        <keep-alive>
          <catalog-filters-responsive
            @clearAll="clearAll(true)"
            @dealerOpenedByUser="dealerOpenedByUser"
            @deleteTag="deleteTag"
            @changePrice="setPrices"
            @cheangeSortinnMethod="changeResponsiveSortingMethod"
            @checkbox-false="deleteFilterCheckbox"
            @checkbox="setFilterCheckbox"
            @checkbox-dealer-false="deleteDealerCheckbox"
            @checkbox-dealer="setDealerCheckbox"
            @openedByUser="openedByUser"
            :relativePrices="[minPriceSelected, maxPriceSelected]"
            :minPriceSelected="minPriceSelected"
            :maxPriceSelected="maxPriceSelected"
            :filtersOpenedByUser="filtersOpenedByUser"
            :openResponsiveDealers="openResponsiveDealers"
            :dataReady="dataReady"
            :minPriceLimit="minPriceLimit"
            :maxPriceLimit="maxPriceLimit"
            :selectedSorting="selectedSorting"
            :sorting="sorting"
            :tags="tags"
            :filters="filters"
            :dealers="dealers"
            :catalogDealer="catalogDealer"
            @toggleResponsiveFilters="toggleResponsiveFilters"
            v-if="openResponsiveFilters"
          ></catalog-filters-responsive>
        </keep-alive>
      </transition>
    </div>
    <empty-result-vehicle
      @changeEmptyVehicle="$emit('changeEmptyVehicle')"
      v-if="filtersResponseEmpty"
    ></empty-result-vehicle>
    <!-- Here Empty Vehicle component if filtersResponseEmpty -->
    <!-- End empty Vehicle Component -->
    <div class="container" v-else>
      <div class="row">
        <transition name="fade">
          <div
            :class="{ 'opacity-fade': preloader }"
            class="category-filters col-xl-3 col-lg-3 d-lg-block d-md-none d-sm-none d-xs-none"
          >
            <div class="filter-info">
              <div class="filter-info--text">
                <span>Showing</span>
                <span class="category-filters__pagination--black"
                  >{{ pagination.from || 0 }} - {{ pagination.to }}</span
                >
                <span>of</span>
                <span class="category-filters__pagination--black">{{
                  pagination.total
                }}</span>
                <span>results</span>
              </div>
              <div class="filter-info--button">
                <button @click="clearAll(true)" class="button-second left-icon">
                  <svg-delete-forever></svg-delete-forever>
                  <span>CLEAR FILTERS</span>
                </button>
              </div>
            </div>
            <filter-price
              @changePrice="setPrices"
              :relativePrices="[minPriceSelected, maxPriceSelected]"
              :minPriceSelected="minPriceSelected"
              :maxPriceSelected="maxPriceSelected"
              :dataReady="dataReady"
              :minPriceLimit="minPriceLimit"
              v-if="minPriceSelected && maxPriceSelected"
              :maxPriceLimit="maxPriceLimit"
            ></filter-price>
            <div
              class="filter-group"
              v-for="(filter, i) in filters"
              v-if="!catalogDealer"
            >
              <options-filter
                @checkbox-false="deleteFilterCheckbox"
                @checkbox="setFilterCheckbox"
                :relative="filters[i]"
                :filter="filter"
              >
              </options-filter>
            </div>
            <div class="filter-group" v-if="!catalogDealer">
              <options-dealers
                @checkbox-dealer-false="deleteDealerCheckbox"
                @checkbox-dealer="setDealerCheckbox"
                :filter="dealers"
              >
              </options-dealers>
            </div>
          </div>
        </transition>
        <transition name="fade">
          <div
            class="category-filters__body col-xl-9 col-lg-9 col-md-12 col-sm-12 col-xs-12"
            id="anchor-scroll"
          >
            <div v-if="preloader" class="col-xl-12">
              <loader :position="'buildin'"></loader>
            </div>
            <div v-else class="col-xl-12">
              <div class="row view-block">
                <div
                  v-if="$mq === 'xl' || $mq === 'lg'"
                  class="view-block--item"
                  @click="switchOnSelect"
                >
                  <span class="label">Sort By:</span>
                  <v-select
                    id="select-sorting-filters"
                    class="vue-select"
                    :debounce="250"
                    :placeholder="'select option'"
                    :options="sorting"
                    :searchable="false"
                    v-model="selectedSorting"
                    :on-change.self="sortBy"
                  ></v-select>
                </div>
                <div
                  class="view-block--item"
                  v-if="$mq === 'md' || $mq === 'sm' || $mq === 'xs'"
                >
                  <button
                    class="button-filter"
                    @click="toggleResponsiveFilters(true)"
                  >
                    <svg-filter-list></svg-filter-list>
                    <span>Filter</span>
                  </button>
                </div>
                <div class="view-block--item">
                  <span class="label">View:</span>
                  <svg-row-view
                    :class="{ 'active-view': getProductView === 'row' }"
                    @click.native="setProductView('row')"
                  ></svg-row-view>
                  <svg-column-view
                    :class="{ 'active-view': getProductView === 'column' }"
                    @click.native="setProductView('column')"
                  ></svg-column-view>
                </div>
              </div>
              <div class="row" v-if="tags.length">
                <div class="category-filters__body--tags">
                  <filter-tag
                    @deleteTag="deleteTag"
                    :key="i"
                    :tag="tag"
                    v-for="(tag, i) in tags"
                  ></filter-tag>
                </div>
              </div>
              <div class="row">
                <div
                  class="responsive-filter-info"
                  v-if="$mq === 'sm' || $mq === 'xs'"
                >
                  Showing {{ pagination.from }} - {{ pagination.to }} of
                  {{ pagination.total }} results
                </div>
              </div>
              <div class="row" itemscope itemtype="http://schema.org/ItemList">
                <div
                  class="flex-wrap-center"
                  v-if="!products.length && !preloader"
                >
                  <empty-result
                    @clearEmptyFilters="clearAll(true)"
                  ></empty-result>
                </div>
                <product-card
                  v-for="(product, i) in products"
                  :key="i"
                  :position="i + 1"
                  :rate="4"
                  v-if="!preloader"
                  :good="product"
                  :view="getProductView"
                ></product-card>
              </div>
              <div class="row">
                <div
                  class="col-xl-12 category-filters__pagination"
                  v-if="products.length"
                >
                  <div class="item">
                    <span>Showing</span>
                    <span class="category-filters__pagination--black"
                      >{{ pagination.from }} - {{ pagination.to }}</span
                    >
                    <span>of</span>
                    <span class="category-filters__pagination--black">{{
                      pagination.total
                    }}</span>
                    <span>results</span>
                  </div>
                  <div class="item" v-show="pagination.lastPage > 1">
                    <pagination
                      ref="paginate"
                      v-if="pagination.ready"
                      :click-handler="paginationHandler"
                      :page-count="pagination.lastPage"
                      :initial-page="pagination.currentPage - 1"
                    ></pagination>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import CatalogFiltersResponsive from './CatalogFiltersResponsive'
import Vue from 'vue'
import Meta from 'vue-meta'
import { mapGetters, mapActions } from 'vuex'
import vSelect from 'vue-select'
import { EventBus } from '../../event-bus'
import EmptyResult from '../common-components/filters/EmptyResult'
import EmptyResultVehicle from '../common-components/filters/EmptyResultVehicle'
import Pagination from './Pagination'
import ProductCard from '@/components/common-components/ProductCard'
import FilterTag from '../common-components/filters/FilterTag'
import FilterPrice from '../common-components/filters/FilterPrice'
import Loader from '@/components/common-components/Loader'
import OptionsFilter from '../common-components/filters/OptionsFilter'
import OptionsDealers from '../common-components/filters/OptionsDealers'
import utils from '@/mixins/utils'

Vue.use(Meta)

export default {
  name: 'catalog',
  components: {
    FilterTag,
    FilterPrice,
    Pagination,
    ProductCard,
    EmptyResult,
    Loader,
    OptionsFilter,
    OptionsDealers,
    vSelect,
    CatalogFiltersResponsive,
    EmptyResultVehicle
  },
  mixins: [utils],
  props: ['type'],
  data () {
    return {
      openResponsiveFilters: false,
      openResponsiveDealers: false,
      dataReady: false,
      minPriceLimit: 0,
      maxPriceLimit: 0,
      minPriceSelected: 0,
      maxPriceSelected: 0,
      prices: [],
      tags: [],
      filters: [],
      vehicleSlug: '',
      selectedFilters: [],
      dealers: [],
      selectedDealers: [],
      products: [],
      filtersOpenedByUser: [],
      filtersResponseEmpty: false,
      catalogSlug: this.$route.params.slug,
      enableSortingSelect: false,
      sorting: ['New', 'Old', 'Expensive', 'Cheap'],
      selectedSorting: this.$route.query.sort_by || 'New',
      paginationMetaLinks: [],
      pagination: {
        ready: false,
        currentPage: 1,
        total: 1000,
        pageSize: 50,
        from: 0,
        to: 0,
        lastPage: 0
      }
    }
  },
  metaInfo () {
    return {
      link: this.paginationMetaLinks,
      title: 'Fleetko'
    }
  },
  watch: {
    $route (to, from) {
      let differentVehicle =
        to.query.vehicle && to.query.vehicle !== from.query.vehicle

      to.query.vehicle
        ? this.$store.dispatch('fetchVehicle', to.query.vehicle)
        : (this.vehicleSlug = '')

      this.checkSearchByVehicle()

      if (!to.query.available_max && !to.query.sort_by) {
        this.catalogSlug = to.params.slug
        this.vehicleSlug = to.query.vehicle || ''
        this.clearAll(differentVehicle)
        this.fetchFilters()

        setTimeout(() => {
          if (to.params.slug === from.params.slug) { this.$scrollTo('#anchor-scroll', 1500, { offset: -200 }) }
        }, 1000)
      } else {
        this.parseQueryParams()
      }
    }
  },
  computed: {
    ...mapGetters(['preloader', 'getProductView', 'getSearchOptions']),
    catalogDealer () {
      return this.$route.name === 'dealer'
    }
  },
  methods: {
    ...mapActions([
      'setYearSearch',
      'setBrandSearch',
      'setModelSearch',
      'setProductView'
    ]),
    dealerOpenedByUser (open) {
      this.openResponsiveDealers = open
    },
    openedByUser (open, filter) {
      if (open) {
        this.filtersOpenedByUser.push(filter)
      } else {
        let indexOfOpenedFilter = this.filtersOpenedByUser.findIndex(
          openedID => openedID === filter
        )

        this.filtersOpenedByUser.splice(indexOfOpenedFilter, 1)
      }
    },
    changeResponsiveSortingMethod (option) {
      this.selectedSorting = option

      this.changeRouterQuery(true)
    },
    toggleResponsiveFilters (open) {
      if (!open) {
        this.$scrollTo('#anchor-scroll', 0, { offset: -100 })
      }
      this.openResponsiveFilters = open

      this.scrollingModalOpen(open)
    },
    sortBy (option) {
      if (this.enableSortingSelect) {
        this.selectedSorting = option

        this.changeRouterQuery(true)
      }
    },
    switchOnSelect () {
      this.enableSortingSelect = true
    },
    fetchFromRoute () {
      this.pagination.ready = false

      this.checkSearchByVehicle()
      /**
       * Проверки для трекинга изменений тегов, были ли это пользовательские изминения если да то
       */
      this.parseQueryParams()
    },

    processingServerFilters (slug, options) {
      this.filtersResponseEmpty = false

      this.$store.dispatch('filterProducts', { slug, options }).then(
        response => {
          let minPriceSelected = response.data.price_range.min.selected
          let maxPriceSelected = response.data.price_range.max.selected
          let minPriceAvailable = response.data.price_range.min.available
          let maxPriceAvailable = response.data.price_range.max.available

          if (minPriceAvailable && maxPriceAvailable) {
            if (minPriceAvailable > minPriceSelected) {
              this.minPriceSelected = Math.floor(minPriceAvailable / 100)
            } else {
              this.minPriceSelected = Math.floor(minPriceSelected / 100)
            }

            if (maxPriceAvailable < maxPriceSelected) {
              this.maxPriceSelected = Math.ceil(maxPriceAvailable / 100)
            } else {
              this.maxPriceSelected = Math.ceil(maxPriceSelected / 100)
            }

            this.minPriceLimit = Math.floor(minPriceAvailable / 100)
            this.maxPriceLimit = Math.ceil(maxPriceAvailable / 100)

            this.dataReady = true

            this.filters = response.data.filters
            this.dealers = response.data.dealers

            this.setTags()
            this.fetchProducts()
          } else {
            this.dataReady = true

            this.maxPriceSelected = null
            this.minPriceSelected = null
            this.filters = response.data.filters
            this.dealers = response.data.dealers
            this.setTags()

            this.fetchProducts().then(response => {
              if (!response.data.length) this.filtersResponseEmpty = true
            })
          }
        },
        error => {
          console.error(error)
        }
      )
    },
    fetchFilters () {
      if (this.$route.query.vehicle) { this.vehicleSlug = this.$route.query.vehicle }

      this.$store.dispatch('setLoaderManual', true)

      let slug = this.catalogSlug
      let options = {
        vehicle: this.vehicleSlug,
        dealers: this.$route.query.dealers ? this.$route.query.dealers : ''
      }

      if (this.catalogDealer) {
        options.dealerFilters = true
      }

      this.processingServerFilters(slug, options)
    },

    parseQueryParams () {
      this.catalogSlug = this.$route.params.slug
      this.pagination.ready = false
      this.minPriceLimit = parseInt(this.$route.query.available_min)
      this.maxPriceLimit = parseInt(this.$route.query.available_max)
      this.minPriceSelected = parseInt(this.$route.query.selected_min)
      this.maxPriceSelected = parseInt(this.$route.query.selected_max)
      this.selectedFilters =
        this.$route.query.filter_options &&
        this.$route.query.filter_options.length
          ? this.$route.query.filter_options.split(',').map(Number)
          : []
      this.selectedDealers =
        this.$route.query.dealers && this.$route.query.dealers.length
          ? this.$route.query.dealers.split(',').map(String)
          : []
      this.vehicleSlug = this.$route.query.vehicle
        ? this.$route.query.vehicle
        : ''
      this.pagination.currentPage = this.$route.query.page
      this.selectedSorting = this.$route.query.sort_by

      let slug = this.catalogSlug
      let options = {
        prices: this.toCent().join(),
        filter_options: this.$route.query.filter_options
          ? this.$route.query.filter_options
          : '',
        vehicle: this.vehicleSlug,
        dealers: this.$route.query.dealers ? this.$route.query.dealers : ''
      }

      if (this.catalogDealer) {
        options.dealerFilters = true
      }

      this.checkSearchByVehicle()
      this.processingServerFilters(slug, options)
    },
    fetchProducts () {
      let options = {
        category: this.type === 'category' ? this.catalogSlug : '',
        price: this.toCent().join(),
        filters: this.$route.query.filter_options
          ? this.$route.query.filter_options
          : '',
        page: this.$route.query.page,
        productBrand: '',
        vehicle: this.vehicleSlug,
        sort:
          this.transformSortingOption(this.$route.query.sort_by) ||
          this.transformSortingOption(this.SELECTED_SORTING_NEW)
      }

      if (this.catalogDealer) {
        options.dealers = this.catalogSlug
      } else {
        options.dealers = this.$route.query.dealers
          ? this.$route.query.dealers
          : ''
      }

      return this.$store.dispatch('fetchProducts', options).then(
        response => {
          this.products = response.data
          this.pagination.total = response.meta.total
          this.pagination.pageSize = response.meta.per_page
          this.pagination.from = response.meta.from
          this.pagination.to = response.meta.to
          this.pagination.lastPage = response.meta.last_page
          this.pagination.ready = true

          this.setPaginationMetaLinks()

          this.$store.dispatch('setLoaderManual', false)
          this.enableSortingSelect = false

          return response
          // eslint-disable-next-line
        },
        error => {
          console.error(error)
        }
      )
    },
    changeRouterQuery (defaultPaginationPage) {
      if (defaultPaginationPage) {
        this.pagination.ready = false
        this.pagination.currentPage = 1
      }

      let routeQuery = {}

      if (this.catalogDealer) {
        routeQuery = {
          selected_min: this.minPriceSelected,
          selected_max: this.maxPriceSelected,
          available_min: this.minPriceLimit,
          available_max: this.maxPriceLimit,
          page: this.pagination.currentPage,
          sort_by: this.selectedSorting
        }
      } else {
        routeQuery = {
          selected_min: this.minPriceSelected,
          selected_max: this.maxPriceSelected,
          available_min: this.minPriceLimit,
          available_max: this.maxPriceLimit,
          page: defaultPaginationPage ? 1 : this.pagination.currentPage,
          filter_options: this.selectedFilters.length
            ? this.selectedFilters.join()
            : '',
          dealers: this.selectedDealers.length
            ? this.selectedDealers.join()
            : '',
          vehicle: this.vehicleSlug,
          sort_by: this.selectedSorting
        }
      }

      this.$store.dispatch('setLoaderManual', true)

      this.$router.push({
        name: this.catalogDealer ? 'dealer' : 'catalog',
        params: { slug: this.catalogSlug },
        query: Object.assign({}, this.$route.query, routeQuery)
      })
    },
    paginationHandler: function (pageNum) {
      this.pagination.currentPage = pageNum
      this.changeRouterQuery()

      this.fetchProducts()

      this.$scrollTo('#anchor-scroll', 1500, { offset: -200 })
    },
    setPrices (prices) {
      this.minPriceSelected = prices[0]
      this.maxPriceSelected = prices[1]
      /**
       * Передаем параметр для сброса пагинации до дефолтного состояния для того чтобы не было конфузов
       * с выбраными фильтрами
       */
      this.changeRouterQuery(true)
    },
    setFilterCheckbox (item) {
      this.selectedFilters.push(item.id)

      this.changeRouterQuery(true)
    },
    deleteFilterCheckbox (item) {
      this.selectedFilters = this.selectedFilters.filter(obj => obj !== item.id)

      this.changeRouterQuery(true)
    },
    setDealerCheckbox (item) {
      this.selectedDealers.push(item.slug)

      this.changeRouterQuery(true)
    },
    deleteDealerCheckbox (item) {
      this.selectedDealers = this.selectedDealers.filter(
        obj => obj !== item.slug
      )

      this.changeRouterQuery(true)
    },
    checkSearchByVehicle () {
      if (this.$route.query.vehicle) {
        this.$store.dispatch('fetchSearch').then(resp => {
          this.$store
            .dispatch('fetchVehicle', this.$route.query.vehicle)
            .then(resp => {
              this.setYearSearch(resp.year.toString())
              this.setBrandSearch(resp.vehicle_brand_name)
              this.setModelSearch({
                label: resp.name,
                value: resp.id
              })
            })
        })
      }
    },
    setTags () {
      this.tags = []

      let filterPriceTag =
        (this.$route.query.selected_min &&
          this.$route.query.selected_min !== this.$route.query.available_min) ||
        (this.$route.query.selected_max &&
          this.$route.query.selected_max !== this.$route.query.available_max)
      let filterOptionsTag = this.$route.query.filter_options
      let dealerOptionsTag = this.$route.query.dealers

      if (filterPriceTag) {
        this.tags.push({
          filterName: 'Price',
          optionName: `${this.minPriceSelected} - ${this.maxPriceSelected}`
        })
      }

      if (filterOptionsTag) {
        if (this.$route.query.filter_options.includes(',')) {
          this.selectedFilters = this.$route.query.filter_options
            .split(',')
            .map(Number)
        } else {
          this.selectedFilters.push(parseInt(this.$route.query.filter_options))
          this.selectedFilters = [...new Set(this.selectedFilters)]
        }

        this.selectedFilters.forEach(selectedFilter => {
          this.filters.forEach(options => {
            let selectedFilterOption = options.filter_options.find(
              option => option.id === selectedFilter
            )

            if (selectedFilterOption) {
              this.tags.push({
                filterName: options.name,
                optionName: selectedFilterOption.name,
                id: selectedFilterOption.id,
                type: 'filters'
              })
            }
          })
        })
      } else {
        this.selectedFilters = []
      }

      if (dealerOptionsTag) {
        if (this.$route.query.dealers.includes(',')) {
          this.selectedDealers = this.$route.query.dealers
            .split(',')
            .map(String)
        } else {
          this.selectedDealers = []
          this.selectedDealers.push(this.$route.query.dealers)
          this.selectedDealers = [...new Set(this.selectedDealers)]
        }

        this.selectedDealers.forEach(selectedFilter => {
          this.dealers.forEach(options => {
            if (options.slug === selectedFilter) {
              this.tags.push({
                filterName: 'Dealer',
                optionName: options.name,
                id: options.id,
                type: 'dealers',
                slug: options.slug
              })
            }
          })
        })
      } else {
        this.selectedDealers = []
      }
    },
    deleteTag (tag) {
      if (tag.type === 'filters') {
 this.selectedFilters = this.selectedFilters.filter(
          obj => obj !== tag.id
        )
}
      if (tag.type === 'dealers') {
this.selectedDealers = this.selectedDealers.filter(
          obj => obj !== tag.slug
        )
}

      if (tag.filterName === 'Price') {
        this.minPriceSelected = this.minPriceLimit
        this.maxPriceSelected = this.maxPriceLimit
      }

      this.changeRouterQuery(true)
    },
    clearAll (fromButton) {
      if (fromButton) {
        this.selectedFilters = []
        this.selectedDealers = []
        this.filtersOpenedByUser = []
        this.$router.push({
          name: this.catalogDealer ? 'dealer' : 'catalog',
          params: { slug: this.catalogSlug },
          query: { vehicle: this.vehicleSlug }
        })
      } else {
        this.tags = []
        this.pagination.ready = false
        this.pagination.currentPage = 1
      }

      this.selectedSorting = this.SELECTED_SORTING_NEW
    },
    toCent () {
      return [this.minPriceSelected, this.maxPriceSelected].map(price => {
        return price * 100
      })
    },
    setPaginationMetaLinks () {
      this.paginationMetaLinks = []

      if (this.pagination.lastPage > 1) {
        let routeQuery = {
          selected_min: this.minPriceSelected,
          selected_max: this.maxPriceSelected,
          available_min: this.minPriceLimit,
          available_max: this.maxPriceLimit,
          page: 0,
          filter_options: this.selectedFilters.length
            ? this.selectedFilters.join()
            : '',
          dealers: this.selectedDealers.length
            ? this.selectedDealers.join()
            : '',
          vehicle: this.vehicleSlug,
          sort_by: this.selectedSorting
        }

        if (this.pagination.currentPage > 1) {
          routeQuery.page = this.pagination.currentPage - 1

          let prevLink = this.$router.resolve({
            name: 'catalog',
            params: { slug: this.catalogSlug },
            query: Object.assign({}, this.$route.query, routeQuery)
          })

          let prevLinkHref = `${window.location.origin}${prevLink.href}`

          this.paginationMetaLinks.push({
            rel: 'prev',
            href: prevLinkHref
          })
        }
        if (this.pagination.currentPage !== this.pagination.lastPage) {
          routeQuery.page = this.pagination.currentPage + 1

          let nextLink = this.$router.resolve({
            name: 'catalog',
            params: { slug: this.catalogSlug },
            query: Object.assign({}, this.$route.query, routeQuery)
          })

          let nextLinkHref = `${window.location.origin}${nextLink.href}`

          this.paginationMetaLinks.push({
            rel: 'next',
            href: nextLinkHref
          })
        }
      }
    }
  },
  created () {
    if (this.type === 'category') {
      EventBus.$on('changeQueryFromSearchModal', scroll => {
        this.fetchFilters()
      })

      EventBus.$on('filterCategoryByVehicle', vehicle => {
        if (this.vehicleSlug !== this.getSearchOptions.slug) {
          this.vehicleSlug = this.getSearchOptions.slug
          this.clearAll(true)
        }
      })

      EventBus.$on('filterClearVehicle', vehicle => {
        this.vehicleSlug = ''
        this.clearAll(true)
      })
    }
  },
  mounted () {
    this.$store.dispatch('setLoaderManual', true)

    if (this.$route.query.available_min) {
      this.fetchFromRoute()
      this.fetchProducts()
    } else {
      this.fetchFilters()
      this.checkSearchByVehicle()
    }
  },
  beforeDestroy () {
    if (this.type === 'category') {
      EventBus.$off('filterCategoryByVehicle')
      EventBus.$off('changeQueryFromSearchModal')
      EventBus.$off('filterClearVehicle')
    }

    let nodesToRemove = []

    if (document.querySelector("link[rel='prev']")) {
      nodesToRemove.push(document.querySelector("link[rel='prev']"))
    }
    if (document.querySelector("link[rel='next']")) {
      nodesToRemove.push(document.querySelector("link[rel='next']"))
    }
    this.removeNode(nodesToRemove)
  }
}
</script>

<style scoped lang="scss">
#select-sorting-filters /deep/ .selected-tag {
  margin: 0 !important;
}
.responsive-wrap {
  position: relative;
}
.opacity-fade {
  opacity: 0.4;
  pointer-events: none;
}
.category-filters {
  &__pagination {
    margin-top: 36px;
    padding: 0;
    display: flex;
    align-items: center;
    span {
      font-family: $sours-sans-p-font;
      font-size: 14px;
      color: $main-grey;
    }
    &--black {
      color: $main-dark !important;
      font-weight: 600;
    }
  }
  .filter-info {
    margin-bottom: 24px;
    &--text {
      margin-top: 11px;
      font-family: $sours-sans-p-font;
      color: $main-grey;
      line-height: 1;
      font-size: 14px;
    }
    &--button {
      margin-top: 35px;
      button {
        height: 40px;
      }
      svg {
        width: 21px;
        height: 21px;
        fill: $main-color;
      }
      span {
        margin-top: 2px;
      }
    }
  }
  &__body {
    .view-block {
      margin-bottom: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 1;
      &--item {
        display: flex;
        align-items: center;
        #select-sorting-filters {
          margin-left: 8px;
        }
        .button-filter {
          width: 180px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid $border-color;
          background: transparent;
          cursor: pointer;
          border-radius: 4px;
          svg {
            margin-left: 0;
            width: 18px;
            fill: $svg-fill-tertiary;
          }
          span {
            margin-left: 16px;
            font-family: $montserrat-font;
            color: $main-dark;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
          }
        }
      }
      .label {
        font-family: $sours-sans-p-font;
        font-size: 14px;
        color: $main-dark;
      }
      svg {
        margin-left: 8px;
        fill: $svg-fill-tertiary;
        cursor: pointer;
        &:last-child {
          margin-left: 8px;
        }
      }
      .active-view {
        fill: $main-color;
      }
    }
    .flex-wrap-center {
      margin-top: 22px;
      display: flex;
      width: 100%;
      justify-content: center;
    }
    &--tags {
      margin-bottom: 16px;
      display: flex;
      flex-wrap: wrap;
    }
  }
}

@media (min-width: $xs) and (max-width: $md) {
  .responsive-filter-info {
    width: 100%;
    margin-top: 0;
    margin-bottom: 12px;
    font-family: $sours-sans-p-font;
    color: $caption-text-color;
    line-height: 1;
    font-size: 14px;
  }
  .category-filters {
    &__pagination {
      flex-wrap: wrap;
      .item {
        &:first-child {
          width: 100%;
          margin-bottom: 16px;
          text-align: center;
        }
        &:last-child {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        ul {
          margin-left: 0;
        }
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .category-filters {
    &__body {
      .view-block {
        &--item {
          .button-filter {
            width: 470px;
          }
        }
      }
    }
  }
}

@media (min-width: $xssm) and (max-width: $sm + 1) {
  .product__column-wrap {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .category-filters {
    &__body {
      .view-block {
        &--item {
          .button-filter {
            width: 150px;
          }
        }
      }
    }
  }
}
</style>
