<template>
  <div class="product-page">
    <meta itemprop="image" :content="product.image ? product.image.versions.original : ''"/>
    <transition name="slide-fade">
      <product-responsive-bar v-if="['md', 'sm', 'xs'].includes($mq) && showResponsiveBar"
        @openModalCart="openModalCart"
        :product="product"
        :waitListProgress="waitListProgress"
        @addToWaitList="addToWaitList"
        :waitListIncludesProduct="waitListIncludesProduct">
      </product-responsive-bar>
    </transition>
    <div class="container">
      <div v-if="Object.keys(product).length"
           class="product-page__breadcrumbs breadcrumb-links"
           itemscope
           itemtype="http://schema.org/BreadcrumbList">
        <router-link itemprop="itemListElement"
                     itemtype="http://schema.org/ListItem"
                     itemscope
                     :to="{ name: 'home' }">
          <span itemprop="name">Home</span>
          <meta itemprop="position" content="1" />
        </router-link>
        <span class="breadcrumbs-slash">/</span>
        <router-link itemprop="itemListElement"
                     itemtype="http://schema.org/ListItem"
                     itemscope
                     :to="{ name: 'section', params: { slug: product.category.section.slug } }">
          <span itemprop="name">{{ product.category.section.name }}</span>
          <meta itemprop="position" content="2" />
        </router-link>
        <span class="breadcrumbs-slash">/</span>
        <router-link itemprop="itemListElement"
                     itemtype="http://schema.org/ListItem"
                     itemscope
                     :to="{ name: 'catalog', params: { slug: product.category.slug } }">
          <span itemprop="name">{{ product.category.name }}</span>
          <meta itemprop="position" content="3" />
        </router-link>
        <span class="breadcrumbs-slash">/</span>
        <span class="active">{{ product.name }}</span>
      </div>
      <div class="product-page__info">
        <div class="product-page__info--title">
          <span itemprop="name">{{ product.name }}</span>
        </div>
        <div class="product-page__info--rate">
          <span v-if="product.part_number" class="product-page__info--rate-mpn">
            mpn: {{ product.part_number }}
          </span>
          <star v-for="(star, i) in 5"
                :position="++i"
                :key="i"
                :readOnly="true"
                :size="14"
                :borderWidth="1"
                :padding="0"
                :rating="product.rating_average">
          </star>
          <span v-if="product.rating_average"
                class="product-page__info--rate-counter">
            {{ roundDecimalRating(product.rating_average) }}</span>
          <span v-if="!product.rating_average"
                class="product-page__info--rate-counter product-page__info-unrated">Unrated</span>
          <div @click="$emit('openReviewsTab')"
               class="product-page__info--rate-reviews link-quaternary">
            <span itemprop="reviewCount">{{ product.rating_count }}</span>
            reviews
          </div>

          <span v-if="product.sku" class="product-page__info--rate-sku">
            sku: {{ product.sku }}
          </span>
        </div>
        <div class="product-info-wrap row">
          <div @click="openGallery" class="col-xl-6 col-md-6 product-page__info--slider">
            <product-slider v-if="contentInfoReady"
                            @slideChangeHandler="slideChangeHandler"
                            :loop="true"
                            :productImages="productImages"
                            :product="product">
            </product-slider>
          </div>
          <div class="product-page__info--text col-xl-6 col-md-6">
            <div class="info-row price-row">
              <div class="info-row--label">Price:</div>
              <div class="info-row--body">
                <span v-if="product.price">
                  <span>$</span>
                  <span>{{ toDollarDecimal(product.price) }}</span>
                </span>
                <div v-else class="price-row--unavailable">
                  <span>Unavailable</span>
                  <div @mouseenter="unavailablePrice = true"
                       @mouseleave="unavailablePrice = false">
                    <tooltip v-if="unavailablePrice"
                             class="price-row--unavailable--tooltip"
                             :allignRight="true"
                             :allignBottom="true"
                             :notification="{
                                type: 'info-toolbox',
                                text:
                                  'The good will soon be shipped to the warehouses. Add the good to the Wait List and we will notify you as soon as the good arrives.'
                             }">
                    </tooltip>
                    <div class="svg-wrap" @click="unavailablePrice = !unavailablePrice">
                      <svg-help></svg-help>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="info-row discount-price" v-if="discount">
              <div class="info-row--label">Discount price:</div>
              <div class="info-row--body"><span>$95.92 + Tax</span></div>
            </div>
            <div class="info-row discount-save" v-if="discount">
              <div class="info-row--label">You save:</div>
              <div class="info-row--body"><span>$10</span></div>
            </div>
            <div v-for="(option, optionKey) in optionsObject"
                 v-if="optionsObject.opt1.length"
                 class="info-row options-row">
              <div class="info-row--label">{{ optionTypes[optionKey] }}:</div>
              <div class="info-row--body m-0">
                <div class="button-wrap" v-for="buttonName in option">
                  <button v-if="selectedOptions[optionKey] === buttonName"
                          :class="checkActive(buttonName, optionKey)"
                          :disabled="checkDisabled(buttonName)"
                          class="options-row--button">
                    {{ buttonName }}
                  </button>
                  <router-link v-else
                               :to="{
                                name: 'product-page',
                                params: { slug: createRouteForOption(optionKey, buttonName) }
                              }">
                    <button :class="checkActive(buttonName, optionKey)"
                            :disabled="checkDisabled(buttonName)"
                            class="options-row--button">
                      {{ buttonName }}
                    </button>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="info-row dealer-row">
              <div class="info-row--label">Dealer:</div>
              <div class="info-row--body">
                <router-link :to="{ name: 'dealer', params: { slug: product.dealer_slug } }">
                  <app-image :imagePath="componentDealerImage(product.dealer_image)"
                             @emitErrorImage="errorImage">
                  </app-image>
                </router-link>
              </div>
            </div>
            <div class="info-row warehouses-row">
              <div class="info-row--label info-row--label--availability">Availability:</div>
              <div class="info-row--body">
                <div class="warehouses-responsive"
                     @click="showResponsiveWarehouses = !showResponsiveWarehouses"
                     v-show="$mq === 'sm' || $mq === 'md' || $mq === 'xs'">
                  <span :class="{
                          green: product.quantity && product.status === 'active',
                          grey: !product.quantity || product.status !== 'active'
                        }"
                        v-text="product.quantity && product.status === 'active'? 'In Stock' : 'Out of Stock'">
                  </span>
                  <svg-chevron v-if="product.quantity && product.status === 'active'"></svg-chevron>
                  <product-responsive-warehouses v-if="showResponsiveWarehouses && product.quantity"
                                                 v-on-clickaway="closeResponsiveWarehouses"
                                                 :warehouses="product.warehouses"
                                                 :product="product">
                  </product-responsive-warehouses>
                </div>
                <div v-if="$mq === 'lg' || $mq === 'xl'"
                     class="warehouses-list"
                     v-for="warehouse in product.warehouses">
                  <div class="warehouses-list--label">
                    {{ warehouse.city }}:
                  </div>
                  <div
                    :class="{
                      green: warehouse.product.quantity > 20 && product.status === 'active',
                      grey: !warehouse.product.quantity || product.status !== 'active'
                    }"
                    class="warehouses-list--body">
                    {{ productQuantity(warehouse) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="info-row fit-row">
              <div class="info-row--label">Fit:</div>
              <div class="info-row--body">
                <div v-if="product.unifit"
                     class="fit-row--unifit"
                     id="unifit-tooltip">
                  <span>Unifit</span>
                  <div @mouseenter="toggleUnifitInfoHover(true)" @mouseleave="toggleUnifitInfoHover(false)">
                    <tooltip
                      v-if="unifitInfo"
                      class="fit-row--unifit--tooltip"
                      :notification="{
                        type: 'info-toolbox',
                        text: 'Product is universal for all vehicles'
                      }"
                      :allignRight="true"
                      :allignBottom="true">
                    </tooltip>
                    <div @click="unifitInfo = !unifitInfo">
                      <svg-help></svg-help>
                    </div>
                  </div>
                </div>
                <div v-else class="fit-row--vehicle">
                  <span>Vehicle Specific</span>
                  <span class="link-quaternary" @click="$emit('openFitTab')">See Suitable Cars ></span>
                </div>
              </div>
            </div>
            <div class="info-row action-row" id="actions-anchor">
              <div
                class="buttons-block"
                v-if="
                  product.quantity &&
                    product.price &&
                    (product.status !== 'disabled' &&
                      product.status !== 'archived')
                ">
                <button @click="openModalCart"
                        class="button-prime warehouses-row--add">
                  <svg-shopping-cart></svg-shopping-cart>
                  <span>Add to cart</span>
                </button>
              </div>
              <div class="buttons-block" v-else>
                <p v-if="product.status !== 'disabled' && product.status !== 'archived'"
                   class="product-page__available-text">
                  Currently product is not available for order. You can add it
                  to Wait List and we will notify you as soon as the product
                  becomes available for the order. For more information please
                  contact our
                  <router-link :to="{ name: 'contactUs' }" target='_blank'>Support centre</router-link>.
                </p>
                <p v-if="product.status === 'disabled'"
                   class="product-page__available-text">
                  The product is temporarily unavailable. For more information
                  please contact our Support centre
                </p>
                <p v-if="product.status === 'archived'"
                   class="product-page__available-text">
                  Sorry, but the product is no longer delivered to our
                  warehouses or had been taken out of production. For more
                  information please contact our Support centre
                </p>
                <button v-if="product.status !== 'archived' && product.status !== 'disabled'"
                        @click="addToWaitList"
                        class="button-prime warehouses-row--add">
                  <svg-wishlist v-if="!waitListIncludesProduct"></svg-wishlist>
                  <svg-check-xl v-if="waitListIncludesProduct"></svg-check-xl>
                  <span v-if="!waitListProgress">
                    {{ waitListIncludesProduct ? 'In Wait List' : 'Add to wait list'}}
                  </span>
                  <span v-if="waitListProgress" class="ellipsis-anim"><span></span><span></span><span></span></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <new-modal v-if="galleryIsVisible" @cancel="closeGallery" class="gallery">
          <template slot="header">
            <div class="gallery__header">
              <div class="gallery__header-name">{{ product.name }}</div>
            </div>
          </template>
          <template slot="body">
            <div class="gallery__slider">
              <gallery-slider :images="productImages"></gallery-slider>
            </div>
          </template>
      </new-modal>
      <!-- <div class="row"> -->
      <!-- <div class="product-page__video col-xl-12"> -->
      <!--
        <div v-for="video in videos" class="col-md-4 product-page__video&#45;&#45;column">
      -->
      <!--
        <div class="product-page__video&#45;&#45;wrap"  :style="{'background-image': `url(${imageSrc(video)})`}">
      -->
      <!-- <div class="product-page__video&#45;&#45;wrap&#45;&#45;play"> -->
      <!-- Play -->
      <!-- </div> -->
      <!-- <div class="product-page__video&#45;&#45;wrap&#45;&#45;text"> -->
      <!-- How to change the mirror -->
      <!-- </div> -->
      <!-- </div> -->
      <!-- </div> -->
      <!-- </div> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import Star from '../common-components/Star'
import ProductResponsiveBar from './ProductResponsiveBar'
import ProductSlider from './ProductSlider'
import ProductResponsiveWarehouses from './ProductResponsiveWarehouses'
import NewModal from '@/components/modals/NewModal'
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'
import Tooltip from '../notifications/ErrorBox'
import GallerySlider from './GallerySlider'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import $ from 'jquery'
import AppImage from '../parts/AppImage'

export default {
  name: 'ProductInfo',
  mixins: [utils, clickaway, imageSource],
  components: {
    Tooltip,
    ProductSlider,
    ProductResponsiveWarehouses,
    ProductResponsiveBar,
    NewModal,
    GallerySlider,
    Star,
    AppImage
  },
  props: [
    'product',
    'optionsObject',
    'rate',
    'optionTypes',
    'disabledButtons',
    'selectedOptions',
    'contentInfoReady',
    'productImages'
  ],
  data () {
    return {
      modalCart: false,
      productId: null,
      discount: false,
      currentImage: 0,
      unifitInfo: false,
      waitListProgress: false,
      showResponsiveWarehouses: false,
      showResponsiveBar: false,
      unavailablePrice: false,
      videos: ['video-1.png', 'video-2.png', 'video-3.png'],
      limit: 5,
      galleryIsVisible: false,
      sliderIsMoving: false
    }
  },
  computed: {
    ...mapGetters(['userWaitList', 'isAuth']),
    waitListIncludesProduct () {
      if (this.userWaitList) {
        return this.userWaitList.some(product => product.id === this.product.id)
      }
    }
  },
  watch: {},
  mounted () {
    if (this.product.status === 'active') {
      window.addEventListener('scroll', this.scrollHandler, { passive: true })
    }

    window.addEventListener('touchend', this.clickAwayFunction)
  },
  methods: {
    slideChangeHandler (switching) {
      this.sliderIsMoving = switching
    },
    openGallery ({ target: { parentElement: { className } } }) {
      if (!['slider__wrap--panel', 'slider__wrap'].includes(className) || this.sliderIsMoving) return

      this.galleryIsVisible = true
    },
    closeGallery () {
      this.galleryIsVisible = false
    },
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_PRODUCT)
    },
    componentDealerImage (images, onError) {
      return this.serverImageSource(
        images,
        'tiny',
        onError,
        this.SERVER_IMAGE_PRODUCT
      )
    },
    clickAwayFunction (e) {
      if (this.product.unifit && !document.getElementById('unifit-tooltip').contains(e.target)) {
        this.unifitInfo = false
      }
    },
    toggleUnifitInfoHover (show) {
      if (this.$mq === 'lg' || this.$mq === 'xl') this.unifitInfo = show
    },
    closeResponsiveWarehouses () {
      this.showResponsiveWarehouses = false
    },
    addToWaitList () {
      if (this.isAuth) {
        if (!this.waitListIncludesProduct) {
          this.waitListProgress = true

          this.$store
            .dispatch('createWaitListedProduct', this.product.id)
            .then(() => {
              this.waitListProgress = false
            })
        }
      } else {
        this.$store.dispatch('toggleLoginModal', {
          open: true,
          authGuard: false
        })
        this.$store.dispatch('setTemporaryProductId', this.product.id)
      }
    },
    createRouteForOption (optionKey, buttonName) {
      let link = _.cloneDeep(this.selectedOptions)
      let slug = null
      let coincidenceLevel = 0

      link[optionKey] = buttonName

      for (let i = 0; i < this.product.product_group.products.length; i++) {
        let product = this.product.product_group.products[i]

        if (
          link.opt1 === product.opt1 &&
          link.opt2 === product.opt2 &&
          link.opt3 === product.opt3
        ) {
          slug = product.slug
          break
        } else if (link.opt1 === product.opt1 && link.opt2 === product.opt2) {
          coincidenceLevel = 2
          slug = product.slug
        } else if (coincidenceLevel < 2 && link.opt1 === product.opt1) {
          slug = product.slug
        }
      }
      return slug
    },
    checkDisabled (buttonKey) {
      if (_.includes(this.disabledButtons, buttonKey)) {
        return true
      }
    },
    checkActive (buttonKey, optionKey) {
      if (this.product[optionKey] === buttonKey) {
        return 'active'
      }
    },
    openModalCart () {
      this.$store.dispatch('setModalProductId', this.product.slug)
        .then(() => this.$store.dispatch('toggleCartModal', true))
    },
    productQuantity (warehouse) {
      if (this.product.status !== 'active' || !warehouse.product.quantity) {
        return 'Out of stock'
      }
      if (warehouse.product.quantity > this.WAREHOUSE_RANGE_MAX) {
        return 'In stock'
      }
      if (
        warehouse.product.quantity <= this.WAREHOUSE_RANGE_MAX &&
        warehouse.product.quantity
      ) {
        return warehouse.product.quantity
      }
    },
    scrollHandler () {
      let divPosition = $('#actions-anchor').offset().top
      let scrollPos = window.scrollY

      this.showResponsiveBar = divPosition && scrollPos > divPosition
    }
  },
  beforeDestroy () {
    if (this.product.status === 'active') {
      window.removeEventListener('scroll', this.scrollHandler)
    }

    window.removeEventListener('touchend', this.clickAwayFunction)
  }
}
</script>
<style lang="scss" scoped="">
.gallery {

  & /deep/ .modal__container {
    max-width: 1120px;
    max-height: 734px;
    width: 100%;
  }

  & /deep/ .modal__body {
    padding: 32px;
  }

  & /deep/ .modal__info {
    position: relative;
    padding-top: calc(65% - 74px);
  }

  &__slider {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
  }

  &__header-name {
    font: 500 20px $montserrat-font;
  }
}

@media (max-width: $md) {
  .gallery {
    & /deep/ .modal__info {
      position: relative;
      padding-top: calc(65%);
    }
  }
}

@media (max-width: $sm) {
  .gallery {
    & /deep/ .modal__body {
      padding: 16px 16px 48px 16px;
    }
    & /deep/ .modal__info {
      padding-top: 100%;
    }
    &__header-name {
      font-size: 12px;
    }
  }
}

.product-page {
  .slide-fade-enter-active {transition: all 0.3s ease}
  .slide-fade-leave-active {transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1)}
  .slide-fade-enter, .slide-fade-leave-to {transform: translateY(-10px)}
  &__breadcrumbs {
    padding-top: 24px;
    flex: 0 0 100%;
    line-height: 1;
  }
  &__available-text {
    margin-bottom: 16px;
    padding: 16px;
    background: #e3f2fd;
    border-radius: 4px;
  }
  &__info {
    .ellipsis-anim {
      margin-left: 7px;
      display: flex;
      span + span {
        margin-right: 4px;
      }
    }
    .ellipsis-anim span {
      width: 3px;
      margin-right: 4px;
      height: 3px;
      border-radius: 100%;
      background: white;
      opacity: 0;
      -webkit-animation: ellipsis-dot 1s infinite;
      animation: ellipsis-dot 1s infinite;
    }

    .ellipsis-anim span:nth-child(1) {
      -webkit-animation-delay: 0s;
      animation-delay: 0s;
    }
    .ellipsis-anim span:nth-child(2) {
      -webkit-animation-delay: 0.1s;
      animation-delay: 0.1s;
    }
    .ellipsis-anim span:nth-child(3) {
      -webkit-animation-delay: 0.2s;
      animation-delay: 0.2s;
    }

    @-webkit-keyframes ellipsis-dot {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    @keyframes ellipsis-dot {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
    &--title {
      margin-top: 25px;
      span {
        font-family: $montserrat-font;
        font-weight: 500;
        font-size: 34px;
        color: $main-dark;
        line-height: 44px;
      }
    }
    &--rate {
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    &--rate-mpn {
      margin-right: 24px;
      padding: 4px 16px;
      border-radius: 4px;
      background-color: rgba(20, 88, 235, 0.2);
      font: 600 14px $sours-sans-p-font;
      color: $main-dark;
      text-transform: uppercase;
      white-space: nowrap;
    }
    &--rate-counter {
      margin: 0 8px;
      font-family: $montserrat-font;
      font-size: 16px;
      font-weight: 500;
      color: $main-dark;
      line-height: 21px;
    }
    &--rate-reviews {
      margin-right: 18px;
      white-space: nowrap;
    }
    &--rate-sku {
      padding: 0 16px 2px 16px;
      border-left: 1px solid $grey;
      font: 14px $sours-sans-p-font;
      color: $grey;
      white-space: nowrap;
    }
    &--reviews-counter {
      display: none;
    }
    .product-info-wrap {
      margin-top: 32px;
    }
    &--text {
      .info-row {
        display: flex;
        margin-bottom: 24px;
        &--label {
          min-width: 65px;
          font-family: $sours-sans-p-font;
          font-size: 14px;
          font-weight: 600;
          color: $main-dark;
          line-height: 1;
          display: flex;
          align-items: center;
          &--availability {
            align-self: flex-start;
          }
        }
        &--body {
          width: 100%;
          margin-left: 68px;
        }
        &--body-buttons {
          width: 320px;
        }
      }
      .price-row {
        .info-row--body {
          font-family: $montserrat-font;
          font-size: 24px;
          font-weight: 600;
          color: $main-color;
          line-height: 1;
        }
        &--unavailable {
          display: flex;
          align-items: center;
          position: relative;
          .svg-wrap {
            display: flex;
            align-items: center;
          }
          span {
            color: $main-grey;
          }
          svg {
            margin-left: 22px;
            width: 20px;
            height: 20px;
            fill: $main-grey;
            cursor: pointer;
          }
          &--tooltip {
            transform: translate(104%, -64%);
            .arrow {
              &:after {
                transform: rotate(-45deg);
                bottom: 19px;
                right: -25px;
              }
            }
          }
        }
      }
      .dealer-row {
        margin-top: 16px;
        img {
          height: 24px;
          max-width: 100%;
        }
      }
      .options-row {
        margin-bottom: 0;
        .info-row--label {
          flex: 0 0 128px;
          padding-right: 16px;
        }
        .info-row--body {
          display: flex;
          flex-wrap: wrap;
        }
        .button-wrap {
          padding: 0 8px 0 0;
        }
        &--button {
          height: 27px;
          background: white;
          margin-bottom: 8px;
          padding: 0 15px;
          font-family: $montserrat-font;
          font-size: 12px;
          font-weight: 500;
          color: $main-grey;
          border: 1px solid $main-grey;
          border-radius: 4px;
          line-height: 1;
          cursor: pointer;
          &:disabled {
            background: #e6e7ea;
            border: 1px solid $grey;
            cursor: not-allowed;
          }
        }
        .active {
          border: 1px solid $main-color;
          background: $main-color;
          color: white;
        }
      }
      .fit-row {
        &--unifit {
          position: relative;
          line-height: 1;
          display: flex;
          align-items: center;
          &--tooltip {
            left: 57px;
          }
          svg {
            margin-left: 22px;
            width: 20px;
            height: 20px;
            fill: $main-grey;
            cursor: pointer;
          }
          span {
            &:first-child {
              font-family: $montserrat-font;
              color: $main-dark;
              font-size: 16px;
              font-weight: 600;
            }
          }
        }
        &--vehicle {
          line-height: 1;
          span {
            &:first-child {
              margin-right: 32px;
              font-family: $montserrat-font;
              color: $main-dark;
              font-size: 16px;
              font-weight: 600;
            }
            &:last-child {
              cursor: pointer;
            }
          }
        }
      }
      .warehouses-row {
        .info-row--label {
        }
        .info-row--body {
          .warehouses-list {
            display: flex;
            line-height: 1;
            &--label {
              width: 125px;
              font-family: $sours-sans-p-font;
              color: $main-grey;
              font-size: 16px;
            }
            &--body {
              margin-left: 32px;
              font-family: $sours-sans-p-font;
              color: $main-dark;
              font-size: 16px;
            }
            .green {
              color: $success;
            }
            .grey {
              color: $grey;
            }
          }
          .warehouses-list + .warehouses-list {
            margin-top: 13px;
          }
        }
        &--add {
          display: flex;
          align-items: center;
          justify-content: center;
          svg {
            margin-right: 16px;
            width: 20px;
            fill: white;
          }
        }
      }
      .action-row {
        width: 320px;
        margin-left: 130px;
        .buttons-block {
          width: 100%;
        }
        p {
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $main-dark;
        }
      }
    }
  }
  &__info-unrated {
    font-size: 15px;
    color: $main-grey;
    text-transform: uppercase;
  }
  &__video {
    display: flex;
    margin-top: 60px;
    &--column {
      &:hover {
        margin-top: -4px;
        .product-page__video--wrap--play {
          display: flex;
        }
        .product-page__video--wrap {
          box-shadow: 0 10px 14.1px 0.9px rgba(0, 0, 0, 0.14), 0 4px 19.6px 0.4px rgba(0, 0, 0, 0.06);
        }
      }
    }
    &--wrap {
      position: relative;
      height: 209px;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: inset 0px -120px 120px -82px rgba(0, 0, 0, 0.81);
      transition: all 0.2s;
      img {
        max-width: 100%;
        height: 100%;
      }
      &--play {
        display: none;
        position: absolute;
        top: calc(50% - 32px);
        right: calc(50% - 32px);
        justify-content: center;
        align-items: center;
        width: 64px;
        height: 64px;
        background: $main-color;
        border-radius: 100%;
        color: white;
        text-transform: uppercase;
      }
      &--text {
        padding-left: 25px;
        position: absolute;
        bottom: 24px;
        font-family: $montserrat-font;
        font-size: 14px;
        color: white;
        line-height: 1;
      }
    }
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .product-page {
    &__video {
    }
  }
}

@media (min-width: $xs) and (max-width: $md) {
  .product-page {
    &__info {
      &--slider {
        flex: 0 0 100%;
        max-width: 100%;
      }
      &--text {
        margin-top: 22px;
        flex: 0 0 100%;
        max-width: 100%;
        .price-row {
          .info-row {
            &--label {
              display: none;
            }
            &--body {
              margin-left: 0;
            }
          }
        }
        .options-row {
          &--button {
            margin-bottom: 0;
          }
        }
        .options-row + .options-row {
          margin-top: 24px;
        }
        .dealer-row {
          margin-top: 24px;
        }
        .warehouses-row {
          .warehouses-responsive {
            position: relative;
            display: flex;
            align-items: center;
            line-height: 1;
            .green {
              color: $success;
            }
            .grey {
              color: $interface-decoration-color;
            }
            svg {
              margin-left: 8px;
              width: 16px;
              height: 16px;
              fill: $svg-fill-tertiary;
            }
          }
        }
        .action-row {
          width: 100%;
          margin-left: 0;
        }
      }
    }
    &__video {
      &--column {
        &:hover {
          margin-top: 0;
          .product-page__video--wrap--play {
            display: none;
          }
          .product-page__video--wrap {
            box-shadow: none;
          }
        }
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .product-page {
    &__info {
      &--title {
        span {
          &:first-child {
            font-size: 20px;
          }
          &:last-child {
            font-size: 20px;
            font-weight: 500;
          }
        }
      }
      .price-row {
        &--unavailable {
          &--tooltip {
            left: -3px;
          }
        }
      }
    }
    &__video {
      overflow-x: scroll;
      &--column {
        width: 292px;
        flex: 0 0 292px;
        max-width: 292px;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .product-page {
    &__info {
      &--title {
        span {
          &:first-child {
            font-size: 16px;
          }
          &:last-child {
            font-size: 16px;
            font-weight: 500;
          }
        }
      }
      &--rate-mpn {
        margin-right: 8px;
      }
      &--rate-reviews {
        display: none;
      }
      &--rate-sku {
        display: none;
      }
      &--rate-counter {
        font-size: 12px;
        font-weight: 500;
        margin-right: 0;
      }
      &--reviews-counter {
        display: inline-block;
        margin-left: 16px;
        color: $paragraph;
        font-family: $sours-sans-p-font;
        font-size: 14px;
      }
      &--text {
        .options-row {
          flex-wrap: wrap;
          .button-wrap {
            margin-bottom: 8px;
          }
          .info-row {
            &--label {
              margin-bottom: 12px;
              width: 100%;
            }
          }
        }
        .options-row + .options-row {
          margin-top: 16px;
        }
        .price-row {
          &--unavailable {
            &--tooltip {
              left: -3px;
            }
          }
        }
        .dealer-row {
          flex-wrap: wrap;
          .info-row {
            &--label {
              margin-bottom: 12px;
              width: 100%;
            }
            &--body {
              margin-left: 0;
            }
          }
        }
        .warehouses-row {
          flex-wrap: wrap;
          .info-row {
            &--label {
              margin-bottom: 12px;
              width: 100%;
            }
            &--body {
              margin-left: 0;
            }
          }
        }
        .fit-row {
          flex-wrap: wrap;
          .info-row {
            &--label {
              margin-bottom: 12px;
              width: 100%;
            }
            &--body {
              margin-left: 0;
            }
          }
        }
      }
    }
    &__video {
      overflow-x: scroll;
      &--column {
        width: 230px;
        flex: 0 0 230px;
        max-width: 230px;
      }
      &--wrap {
        height: 128px;
      }
    }
  }
}
</style>
