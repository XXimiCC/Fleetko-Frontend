<template>
  <div itemscope itemtype="http://schema.org/Product">
    <div class="product-preloader" v-if="!contentInfoReady">
      <loader></loader>
    </div>
    <product-info
      v-if="contentInfoReady"
      :optionsObject="optionsObject"
      :optionTypes="optionTypes"
      :contentInfoReady="contentInfoReady"
      :selectedOptions="selectedOptions"
      :disabledButtons="disabledButtons"
      :productImages="productImages"
      :rate="rate"
      @openFitTab="
        openTab({
          tabName: 'TabFit',
          scroll: true
        })
      "
      @openReviewsTab="
        openTab({
          tabName: 'TabReviews',
          scroll: true
        })
      "
      :product="product"
    ></product-info>

    <product-similar-horizontal
      v-if="relatedProducts.length && $mq !== 'xl' && $mq !== 'lg'"
      :simmilar="relatedProducts"
      :product="product"
    ></product-similar-horizontal>

    <div class="product-tabs" id="vehicle-fit-tab">
      <div class="product-tabs__header">
        <div class="container">
          <div
            class="product-tabs__header--item"
            :class="{ active: tab.active }"
            @click="
              openTab({
                tabName: tab.componentName
              })
            "
            v-for="tab in tabs"
          >
            {{ tab.name }}
          </div>
        </div>
      </div>
      <div class="container">
        <div class="product-tabs__body">
          <component
            :reviewsPagination="reviewsPagination"
            :mergedFeatures="mergedFeatures"
            :productReviews="productReviews"
            :productSmallReviews="productSmallReviews"
            :reviewLoader="reviewLoader"
            :purchasedProduct="purchasedProduct"
            :similar="relatedProducts"
            v-if="getActiveTab"
            @openProductTab="openTab"
            @loadMoreReviews="loadMoreReviews"
            @createUserReview="createProductReview"
            @userDeleteReview="userDeleteReview"
            :product="product"
            v-bind:is="getActiveTab.componentName"
          ></component>
        </div>
      </div>
    </div>
    <update-review-modal v-if="updateReviewModal.open"></update-review-modal>
  </div>
</template>

<script>
import Loader from '@/components/common-components/Loader'
import { EventBus } from '../../event-bus'
import ProductSimilarHorizontal from './ProductSimilarHorizontal.vue'
import ProductInfo from '@/components/product-page/ProductInfo'
import TabCharacteristic from './tabs/TabCharacteristic'
import TabFit from './tabs/TabFit'
import TabReviews from './tabs/TabReviews'
import utils from '@/mixins/utils'
import Vue from 'vue'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import UpdateReviewModal from '../modals/UpdateReviewModal'

export default {
  name: 'ProductPage',
  data () {
    return {
      rate: 4,
      product: {},
      optionsObject: {},
      disabledButtons: [],
      selectedOptions: {},
      optionTypes: {},
      mergedFeatures: [],
      productImages: [],
      relatedProducts: [],
      purchasedProduct: null,
      productReviews: [],
      reviewLoader: false,
      viewedGoodsTimer: null,
      reviewsPagination: {
        lastPage: 0,
        currentPage: 1,
        total: 0
      },
      productSmallReviews: [],
      contentInfoReady: false,
      tabs: []
    }
  },
  watch: {
    isAuth (val) {
      if (val) {
        this.fetchProductReviews(this.$route.params.slug)
      }
    }
  },
  mixins: [utils],
  methods: {
    clearAll () {
      this.contentInfoReady = false
      this.productImages = []
      this.optionsObject = {}
      this.selectedOptions = {}
      this.disabledButtons = []
      this.optionTypes = {}
      this.tabs = []
      this.purchasedProduct = null
      this.productReviews = []
    },
    mapImagesArray () {
      this.productImages = this.product.images.map((image, index) => {
        return {
          versions: image.versions,
          index: index
        }
      })
    },
    createOptionsArray () {
      if (this.product.product_group) {
        let uniqueOpt1 = [
          ...new Set(
            this.product.product_group.products.map(unique => unique.opt1)
          )
        ]
        let uniqueOpt2 = [
          ...new Set(
            this.product.product_group.products.map(unique => unique.opt2)
          )
        ]
        let uniqueOpt3 = [
          ...new Set(
            this.product.product_group.products.map(unique => unique.opt3)
          )
        ]

        for (let [key, value] of Object.entries(this.product.product_group)) {
          if (key.match(/^opt\d$/) && value) {
            Vue.set(this.optionsObject, key, [])
            this.optionTypes[key] = value
          }
        }
        uniqueOpt1.forEach(item => {
          this.optionsObject['opt1'].push(item)
        })

        if (uniqueOpt2[0]) {
          uniqueOpt2.forEach(item => {
            this.optionsObject['opt2'].push(item)
          })
          this.checkOptions(2)
        }

        if (uniqueOpt3[0]) {
          uniqueOpt3.forEach(item => {
            this.optionsObject['opt3'].push(item)
          })
          this.checkOptions(3)
        }

        this.selectedOptions = {
          opt1: this.product.opt1,
          opt2: this.product.opt2,
          opt3: this.product.opt3
        }
      }
    },
    checkOptions (optionOrder) {
      let enabledButtons = []
      let checkSameOptions =
        optionOrder === 1
          ? ['opt2', 'opt3']
          : optionOrder === 2
          ? ['opt1', 'opt3']
          : optionOrder === 3
          ? ['opt1', 'opt2']
          : []
      let optionToCheck = 'opt' + optionOrder

      this.product.product_group.products.forEach(product => {
        if (optionOrder === 3) {
          if (
            product[checkSameOptions[0]] ===
              this.product[checkSameOptions[0]] &&
            product[checkSameOptions[1]] === this.product[checkSameOptions[1]]
          ) {
            enabledButtons.push(product[optionToCheck])
          }
        } else if (optionOrder === 2) {
          if (
            product[checkSameOptions[0]] === this.product[checkSameOptions[0]]
          ) {
            enabledButtons.push(product[optionToCheck])
          }
        }
      })
      _.forEach(this.optionsObject[optionToCheck], value => {
        if (!_.includes(enabledButtons, value)) {
          this.disabledButtons.push(value)
        }
      })
    },
    fetchProduct (slug) {
      this.$store.dispatch('fetchProduct', slug).then(response => {
        this.product = response
        this.createOptionsArray()
        this.mergeProductFeatures()
        this.mapImagesArray()
        this.fetchRelatedProduct(slug)
        this.fetchProductReviews(slug).then(reviewsResp => {
          this.checkVehicleTab()
        })
        if (this.isAuth) this.createViewedProduct()

        this.contentInfoReady = true
        if (this.$route.query.tab) {
          setTimeout(() => {
            this.openTab({
              tabName: 'TabReviews',
              scroll: true,
              offset: -50,
              responsiveOffset: -50
            })
          }, 1000)
        }
      })
    },
    fetchRelatedProduct (slug) {
      this.$store.dispatch('fetchRelatedProduct', slug).then(response => {
        this.relatedProducts = response
      })
    },
    fetchPurchasedProducts () {
      this.$store
        .dispatch('fetchPurchasedProducts', {
          id: this.product.id
        })
        .then(response => {
          response = response.data

          this.purchasedProduct = response[0]

          if (
            response.length &&
            response[0].review &&
            !response[0].review.published_at
          ) {
            Vue.set(this.purchasedProduct.review, 'isOpen', false)

            this.productReviews.unshift(response[0].review)
          }
        })
    },
    fetchProductReviews (slug) {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('fetchProductReviews', {
            slug: slug,
            page: this.reviewsPagination.currentPage
          })
          .then(response => {
            response.data.forEach(review => {
              review.isOpen = false
            })

            this.reviewsPagination = {
              currentPage: response.meta.current_page,
              lastPage: response.meta.last_page,
              total: response.meta.total
            }
            this.productReviews = response.data

            if (this.isAuth) this.fetchPurchasedProducts()

            this.reviewLoader = false

            resolve(true)
          })
      })
    },
    createProductReview (review) {
      this.reviewLoader = true

      this.$store.dispatch('userCreateReview', review).then(
        response => {
          this.fetchProductReviews(this.$route.params.slug)
          // eslint-disable-next-line
        },
        error => {
          this.reviewLoader = false
        }
      )
    },
    userDeleteReview (id) {
      this.reviewLoader = true

      this.$store.dispatch('userDeleteReview', id).then(
        response => {
          this.fetchProductReviews(this.$route.params.slug)
          // eslint-disable-next-line
        },
        error => {
          this.reviewLoader = false
        }
      )
    },
    updateProductReview (review) {
      this.reviewLoader = true

      this.$store.dispatch('userUpdateReview', review).then(
        response => {
          this.fetchProductReviews(this.$route.params.slug)
          // eslint-disable-next-line
        },
        error => {
          this.reviewLoader = false
        }
      )

      this.$store.dispatch('toggleUpdateReviewModal', {
        open: false
      })
    },
    loadMoreReviews () {
      this.$store
        .dispatch('fetchProductReviews', {
          slug: this.$route.params.slug,
          page: ++this.reviewsPagination.currentPage
        })
        .then(response => {
          response.data.forEach(review => {
            review.isOpen = false
          })

          this.reviewsPagination = {
            currentPage: response.meta.current_page,
            lastPage: response.meta.last_page,
            total: response.meta.total
          }
          this.productReviews = [...this.productReviews, ...response.data]
        })
    },
    mergeProductFeatures () {
      this.mergedFeatures = this.groupBy(
        this.product.product_features,
        'name',
        function (singleFeature, multipleFeatures) {
          if (multipleFeatures.value) {
            multipleFeatures.value.push(singleFeature.value)
          } else {
            multipleFeatures.value = []
            multipleFeatures.value.push(singleFeature.value)
          }
        }
      )
    },
    openTab (payloadTab) {
      let tab = this.tabs.find(
        relativeTab => relativeTab.componentName === payloadTab.tabName
      )

      this.tabs.forEach(tabLoop => {
        tabLoop.active = false
      })

      tab.active = true

      if (scroll) {
        if (this.$mq === 'sm' || this.$mq === 'xs' || this.$mq === 'md') {
          this.$scrollTo(`#vehicle-fit-tab`, payloadTab.delay || 1000, {
            offset: payloadTab.responsiveOffset || -50
          })
        } else {
          this.$scrollTo(`#vehicle-fit-tab`, payloadTab.delay || 1000, {
            offset: payloadTab.offset || -50
          })
        }
      }

      if (tab.componentName === 'TabReviews') {
        this.$router.replace({ query: null })
      }
    },
    checkVehicleTab () {
      let tabCharachteristic =
        this.product.product_features.length || this.product.description

      if (tabCharachteristic) {
        this.tabs.push({
          name: 'Characteristics',
          componentName: 'TabCharacteristic',
          active: true
        })
      }

      if (this.product.vehicle_models.length) {
        this.tabs.push({
          name: 'Vehicle Fit',
          componentName: 'TabFit',
          active: !tabCharachteristic
        })
      }

      this.tabs.push({
        name: 'All Reviews',
        componentName: 'TabReviews',
        active: !tabCharachteristic && !this.product.vehicle_models.length
      })
    },
    openedTabEventListener (destroy) {
      if (destroy) return EventBus.$off('openProductTab')

      EventBus.$on(' ', tab => {
        this.openTab(
          this.tabs.find(relativeTab => relativeTab.componentName === tab),
          true,
          -50,
          -50
        )
      })
    },
    updateReviewEventListener (destroy) {
      if (destroy) EventBus.$off('updateUserReview')

      EventBus.$on('updateUserReview', review => {
        this.updateProductReview(review)
      })
    },
    createViewedProduct (destroy) {
      if (destroy) {
        return clearTimeout(this.viewedGoodsTimer)
      }

      this.viewedGoodsTimer = setTimeout(() => {
        this.$store.dispatch('createViewedProduct', this.product.id)

        clearTimeout(this.viewedGoodsTimer)
      }, 2000)
    }
  },
  computed: {
    ...mapGetters(['isAuth', 'updateReviewModal']),
    getActiveTab () {
      return this.tabs.find(tab => tab.active)
    }
  },
  beforeDestroy () {
    this.openedTabEventListener(true)
    this.updateReviewEventListener(true)
    this.createViewedProduct(true)
  },
  beforeRouteUpdate (to, from, next) {
    if (to.params.slug !== from.params.slug) {
      this.createViewedProduct(true)
      this.clearAll()
      this.fetchProduct(to.params.slug)
      next()
    } else {
      next()
    }
  },
  mounted () {
    this.fetchProduct(this.$route.params.slug)
    this.openedTabEventListener()
    this.updateReviewEventListener()
  },
  components: {
    ProductInfo,
    ProductSimilarHorizontal,
    TabCharacteristic,
    TabFit,
    TabReviews,
    Loader,
    UpdateReviewModal
  }
}
</script>
<style lang="scss" scoped>
.product-preloader {
  padding: 10% 0;
  width: 100%;
  height: 100%;
}
.product-tabs {
  margin-top: 64px;
  &__header {
    position: relative;
    .container {
      display: flex;
    }
    &:after {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: $interface-decoration-color;
    }
    &--item {
      padding: 0 8px 16px 8px;
      display: flex;
      align-items: flex-start;
      font-family: $montserrat-font;
      font-size: 16px;
      color: $main-dark;
      line-height: 1;
      cursor: pointer;
      &.active {
        position: relative;
        color: $main-color;
        &:after {
          position: absolute;
          content: '';
          bottom: 1px;
          width: 100%;
          height: 2px;
          left: 0;
          background: $main-color;
        }
      }
    }
  }
  .product-tabs__header--item + .product-tabs__header--item {
    margin-left: 16px;
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .product-tabs {
    &__header {
      &--item {
        padding: 0 8px 8px 8px;
        font-size: 12px;
      }
    }
  }
}
</style>
