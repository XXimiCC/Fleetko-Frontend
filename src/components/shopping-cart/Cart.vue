<template>
  <div>
    <div class="cart-page">
      <div class="container">
        <div id="cart-page-title" class="cart-page__title">
          <h1 class="h1-secondary">Shopping Cart</h1>
          <button
            :disabled="loading"
            @click="validateCartItem"
            v-if="getTotalAmountCart > 0"
            class="button-prime responsive-checkout-button"
          >
            <span v-if="isAuth">Proceed to checkout</span>
            <span v-else>Login to checkout</span>
          </button>
        </div>
        <div v-if="getTotalAmountCart > 0" class="cart-page__body">
          <div class="items-wrap">
            <cart-freight-info v-if="freightProduct"></cart-freight-info>
            <div
              v-for="(warehouse, key) in clientProducts"
              :id="`anchor-warehouse-${key}`"
              class="cart-page__body--warehouse"
            >
              <div class="cart-page__body--warehouse--title">
                <span>Warehouse: </span><span>{{ warehouse.city }}</span>
              </div>

              <app-notification
                :notification="shippingErrorNotification"
                v-if="shippingError"
                class="notification-wrap">
              </app-notification>

              <app-notification
                :notification="invalidWarehouseNotification"
                v-if="invalidWarehouses.includes(key) && !isAnimateWarehouseWarning"
                class="notification-wrap">
              </app-notification>

              <div class="cart-page__body--warehouse__labels">
                <div class="item"><span>item</span></div>
                <div class="item">
                  <div class="flex-half">
                    <span class="cart-page__body--warehouse__labels--quantity"
                      >quantity</span
                    >
                    <span class="cart-page__body--warehouse__labels--price"
                      >price</span
                    >
                  </div>
                  <div class="flex-half">
                    <span class="cart-page__body--warehouse__labels--remove"
                      >remove</span
                    >
                  </div>
                </div>
              </div>
              <div
                v-for="(product, i) in warehouse.products"
                :id="`p-${product.productId}w-${product.warehouseId}`"
                :class="{ 'cart-page__body--product--bordered-top': i === '1' }"
                :ref="isError(product)"
                class="cart-page__body--product"
              >
                <div class="item-flex-info">
                  <div class="cart-page__body--product--image">
                    <router-link
                      :to="{
                        name: 'product-page',
                        params: { slug: product.slug }
                      }"
                      tag="a"
                    >
                      <app-image
                        class="img"
                        :imagePath="componentProductImage(product.image)"
                        @emitErrorImage="errorImage"
                      >
                      </app-image>
                    </router-link>
                    <div
                      v-if="product.freight"
                      class="cart-page__body--product--image__freight"
                    >
                      <svg-freight></svg-freight>
                    </div>
                  </div>
                  <div class="cart-page__body--product--info">
                    <router-link
                      :to="{
                        name: 'product-page',
                        params: { slug: product.slug }
                      }"
                    >
                      <span class="link-product-name name">{{
                        product.name
                      }}</span>
                    </router-link>
                  </div>
                </div>
                <div class="item-flex-counts cart-page__body--product--counts">
                  <div class="flex-block">
                    <div class="item-flex">
                      <div class="input-wrap">
                        <error-box
                          v-if="
                            (product.quantity > WAREHOUSE_MAX_QUANTITY ||
                              product.quantity > product.available) &&
                              !loading
                          "
                          top="-44"
                          :allignRight="['xs', 'sm'].includes($mq)"
                          :notification="{
                            type: 'error-toolbox',
                            text: `Maximum available quantity is
                                      ${
                                        product.quantity >
                                          WAREHOUSE_MAX_QUANTITY &&
                                        product.available >
                                          WAREHOUSE_MAX_QUANTITY
                                          ? WAREHOUSE_MAX_QUANTITY
                                          : product.available
                                      }`
                          }"
                        >
                        </error-box>

                        <error-box
                          v-if="showWarningNotification(warning, product)"
                          v-for="(warning, i) in warningBag"
                          top="-57"
                          allignBottom="true"
                          arrowFixedBottom="true"
                          :allignRight="['xs', 'sm'].includes($mq)"
                          :key="i"
                          :notification="{
                            type: 'warning-toolbox',
                            text:
                              'Sorry, the quantity limits are from 1 to 50 units'
                          }"
                        >
                        </error-box>
                        <input
                          v-model="product.quantity"
                          @click="deleteWarning(warehouse, product)"
                          @blur="setCartQuantity($event, warehouse, product)"
                          @input="setQuantity($event, warehouse, product)"
                          type="text"
                          class="input-default"
                          :class="{
                            warning: product.corrected,
                            'input-error':
                              product.quantity > WAREHOUSE_MAX_QUANTITY ||
                              (product.quantity > product.available &&
                                product.available)
                          }"
                        />
                      </div>
                    </div>
                    <div class="item-flex flex-block--price">
                      <div class="flex-block--price--total">
                        $
                        {{ toDollarDecimal(product.price * product.quantity) }}
                      </div>
                      <div class="flex-block--price--each">
                        <span>$ {{ toDollarDecimal(product.price) }} </span
                        ><span>/ each</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="cart-page__body--product--close"
                  :class="{
                    'cart-page__body--product--close-freight': product.freight
                  }"
                >
                  <button @click="openConfirmDialog(product, warehouse)">
                    <svg-close></svg-close>
                  </button>
                </div>
              </div>
              <div class="cart-page__body--warehouse__footer">
                <div class="item">
                  <div
                    class="cart-page__body--warehouse__footer--item subtotal"
                  >
                    Subtotal
                  </div>
                  <div
                    class="cart-page__body--warehouse__footer--item subtotal-numbers"
                  >
                    $ {{ warehouseCountTotalPrice(warehouse) }}
                  </div>
                  <div
                    class="cart-page__body--warehouse__footer--item delete-warehouse"
                  >
                    <button
                      @click="openWarehouseDeleteDialog(warehouse, key)"
                      class="button-icon-second"
                    >
                      <svg-delete></svg-delete>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="cart-page__body--button">
              <div class="flex-wrap-buttons">
                <button
                  @click="openClearCartDialog"
                  class="button-second left-icon"
                >
                  <svg-remove-shopping-cart></svg-remove-shopping-cart>
                  <span>Clear Cart</span>
                </button>
              </div>
            </div>
          </div>

          <div class="check-wrap">
            <div class="check" v-sticky="{ zIndex: 100, stickyTop: 32 }">
              <div class="check__header"><h3>Cart</h3></div>
              <div class="check__body">
                <div
                  class="check__body--warehouse"
                  v-for="(warehouse, key, index) in clientProducts"
                >
                  <div class="name">{{ warehouse.city }}</div>
                  <div class="price">
                    $ {{ warehouseCountTotalPrice(warehouse) }}
                  </div>
                </div>
              </div>
              <div class="check__footer">
                <div class="check__footer--total">
                  <span>Total</span
                  ><span>$ {{ toDollarDecimal(getTotalPriceCart) }}</span>
                </div>
                <div class="check__footer--button">
                  <button
                    :disabled="localLoader"
                    @click="validateCartItem"
                    class="button-prime"
                  >
                    <span v-if="isAuth">Proceed to checkout</span>
                    <span v-else>Login to checkout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <confirm-dialog
            :productForDelete="productForDelete"
            :warehouseForDelete="warehouseForDelete"
            :clearCartDialog="clearCartDialog"
            :type="confirmType"
            v-if="showConfirm"
            @confirmDeleteWarehouse="deleteWarehouse"
            @confirmDeleteCart="clearCart"
            @confirmDeleteProduct="deleteCartItem"
            @cancel="hideDialog"
          ></confirm-dialog>
        </div>
        <div class="empty-cart" v-if="!getTotalAmountCart">
          <div class="cart-page__keep-shop-image">
            <svg-keep-shopping></svg-keep-shopping>
          </div>
          <div class="cart-page__keep-shop-text">
            <h3 class="h3-secondary">The Cart Is Empty</h3>
            <p class="paragraph-tertiary">
              There is a huge amount of products in our store. Click on the
              button below and use the search or go through categories and add
              needed products to the cart.
            </p>
          </div>
          <div class="cart-page__keep-shop-button">
            <button @click="redirectToHome" class="button-prime">
              Keep shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorBox from '@/components/notifications/ErrorBox'
import AppNotification from '../notifications/MainNotify.vue'
import ConfirmDialog from '@/components/modals/ConfirmDialog'
import CartFreightInfo from './CartFreightInfo'
import Vue from 'vue'
import VueSticky from 'vue-sticky'
import _ from 'lodash'
import utils from '@/mixins/utils'
import { mapGetters } from 'vuex'
import imageSource from '@/mixins/imagesSource'
import AppImage from '../parts/AppImage'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'ShoppingCart',
  components: {
    ErrorBox,
    ConfirmDialog,
    swiper,
    swiperSlide,
    AppImage,
    CartFreightInfo,
    AppNotification
  },
  directives: {
    sticky: VueSticky
  },
  mixins: [utils, imageSource],
  data () {
    return {
      allowInput: true,
      disableCheckout: false,
      validationError: false,
      errorBag: [],
      warningBag: [],
      invalidWarehouses: [],
      shippingError: false,
      shippingErrorNotification: {
        type: 'warning',
        cancelable: true,
        text: 'There was a conflict in the shopping cart. Please check goods in the cart and try again.'
      },
      invalidWarehouseNotification: {
        type: 'warning',
        cancelable: false,
        text: [
          'More than 50 units were added for the warehouse.',
          'Please, edit the quantity of products so that the amount of products',
          'was equal or less than 50 units. If you want to order more,',
          ' you have the opportunity to create another order with needed products.'
        ].join(' ')
      },
      showConfirm: false,
      confirmType: '',
      productForDelete: null,
      warehouseForDelete: null,
      freightProduct: false,
      clearCartDialog: false,
      clientProducts: {},
      loggedFromCart: false,
      responsiveFullFreightInfo: false,
      isAnimateWarehouseWarning: false,
      localLoader: false
    }
  },
  computed: {
    ...mapGetters([
      'getUserCart',
      'getTotalPriceCart',
      'getTotalQuantityCart',
      'getTotalAmountCart',
      'isAuth',
      'loading',
      'enableSearch',
      'getSearchOptions'
    ]),
    swiperPopular () {
      return this.$refs.swiperPopular.swiper
    }
  },
  watch: {
    getTotalPriceCart () {
      this.clientProducts = _.cloneDeep(this.getUserCart.cart)
      this.freightInfoBox()
    },
    isAuth (value) {
      if (value) {
        if (this.loggedFromCart) {
          this.$store
            .dispatch('mergeServerCart')
            .then(() => this.validateCartItem())
        } else {
          this.$store.dispatch('getServerCart', true)
            .then(() => {
              this.clientProducts = _.cloneDeep(this.getUserCart.cart)
            })
        }
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.dispatch('deleteSystemNotification')
    next()
  },
  mounted () {
    this.clientProducts = _.cloneDeep(this.getUserCart.cart)
    this.freightInfoBox()

    if (this.$route.query.merge) {
      this.validateCartItem()
      this.shippingError = true
    }
  },
  methods: {
    showWarningNotification (warning, product) {
      const sameWarehouse =
        warning.productId === product.productId &&
        warning.warehouseId === product.warehouseId
      const errorShow =
        product.available && parseInt(product.quantity) > product.available

      return sameWarehouse && !errorShow
    },
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_PRODUCT)
    },
    componentProductImage (images, onError) {
      return this.serverImageSource(
        images,
        'tiny',
        onError,
        this.SERVER_IMAGE_PRODUCT
      )
    },
    swipeNext (slider) {
      this[slider].slideNext()
    },
    swipePrev (slider) {
      this[slider].slidePrev()
    },
    warehouseCountTotalPrice (warehouse) {
      let price = 0

      _.forEach(warehouse.products, value => {
        price = price + value.quantity * value.price
      })

      return this.toDollarDecimal(price)
    },
    openConfirmDialog (product, warehouse) {
      this.confirmType = 'cartDeleteProduct'
      this.productForDelete = product
      this.productForDelete.warehouseCity = warehouse.city
      this.showConfirm = true
    },
    openWarehouseDeleteDialog (warehouse, key) {
      this.confirmType = 'cartDeleteWarehouse'
      this.warehouseForDelete = {
        city: warehouse.city,
        id: key
      }
      this.showConfirm = true
    },
    openClearCartDialog () {
      this.confirmType = 'cartClearAll'
      this.clearCartDialog = true
      this.showConfirm = true
    },
    hideDialog () {
      this.showConfirm = false
      this.productForDelete = null
      this.warehouseForDelete = null
      this.clearCartDialog = false
    },
    isError (product) {
      if (product.quantity > product.available) { return `p-${product.productId}w-${product.warehouseId}` }
    },
    redirectToHome () {
      this.$router.push({ name: 'home' })
    },
    deleteWarning (warehouse, product) {
      let index = this.warningBag.find(
        warning =>
          warning.productId === product.productId &&
          warning.warehouseId === product.warehouseId
      )
      if (index) this.warningBag.splice(index)
    },
    setQuantity ($event, warehouse, product) {
      $event.target.value = $event.target.value.replace(/^0+/, '')
      $event.target.value = $event.target.value.replace(/\D/g, '')
      $event.target.value = $event.target.value.substring(0, 2)

      if ($event.target.value === '' || $event.target.value === '0') {
        this.warningBag.push({
          productId: product.productId,
          warehouseId: product.warehouseId
        })

        setTimeout(() => {
          let index = this.warningBag.find(
            warning =>
              warning.productId === product.productId &&
              warning.warehouseId === product.warehouseId
          )
          this.warningBag.splice(index)
        }, 15000)
      } else {
        let index = this.warningBag.find(
          warning =>
            warning.productId === product.productId &&
            warning.warehouseId === product.warehouseId
        )
        this.warningBag.splice(index)
      }

      if (parseInt($event.target.value) > 50 && !product.available) {
        $event.target.value = 50

        this.warningBag.push({
          productId: product.productId,
          warehouseId: product.warehouseId
        })

        setTimeout(() => {
          let index = this.warningBag.find(
            warning =>
              warning.productId === product.productId &&
              warning.warehouseId === product.warehouseId
          )
          this.warningBag.splice(index)
        }, 15000)
      }

      Vue.set(
        this.clientProducts[product.warehouseId].products[product.productId],
        'quantity',
        $event.target.value
      )
    },
    setCartQuantity ($event, warehouse, product) {
      if ($event.target.value === '' || $event.target.value === '0') {
        $event.target.value = 1

        Vue.set(
          this.clientProducts[product.warehouseId].products[product.productId],
          'quantity',
          '1'
        )
      }

      let cartItem = {
        warehouseId: product.warehouseId,
        quantity: parseInt($event.target.value),
        productId: product.productId
      }

      this.$store.dispatch('updateQuantityCartItem', cartItem)
    },
    deleteCartItem () {
      this.$store.dispatch('deleteUserCartItem', this.productForDelete)
      this.showConfirm = false
      this.productForDelete = null
    },
    deleteWarehouse () {
      this.$store.dispatch(
        'deleteWarehouseFromCart',
        this.warehouseForDelete.id
      )
      this.showConfirm = false
      this.warehouseForDelete = null
    },
    clearCart () {
      this.$store.dispatch('deleteWholeCart')
      this.showConfirm = false
      this.clearCartDialog = false
      this.$scrollTo(`#cart-page-title`, 1500, { offset: -200 })
    },
    freightInfoBox () {
      this.freightProduct = false

      for (let warehouse of Object.values(this.clientProducts)) {
        if (_.some(warehouse.products, { freight: true })) { this.freightProduct = true }
      }
    },
    validateWarehouse (warehouse) {
      let warehouseQuantity = 0

      _.forEach(this.clientProducts[warehouse].products, value => {
        warehouseQuantity = warehouseQuantity + parseInt(value.quantity)
      })

      if (
        warehouseQuantity > 50 &&
        !this.invalidWarehouses.includes(warehouse)
      ) {
        this.invalidWarehouses.push(warehouse)
      } else {
        let invalidWarehouseHas = this.invalidWarehouses.findIndex(
          invalidWarehouse => invalidWarehouse === warehouse
        )
        if (invalidWarehouseHas > -1 && warehouseQuantity <= 50) { this.invalidWarehouses.splice(invalidWarehouseHas, 1) }
      }

      this.invalidWarehouses = [...new Set(this.invalidWarehouses)]
    },
    validateCartItem () {
      this.isAnimateWarehouseWarning = true
      this.localLoader = true

      if (this.isAuth) {
        this.$store.dispatch('getServerCart', true).then(() => {
          this.validationError = false
          this.warningBag = []

          _.forEach(this.getUserCart.cart, (value, product) => {
            this.validateWarehouse(product)
            _.forEach(this.getUserCart.cart[product].products, value => {
              if (value.quantity > value.available) {
                this.errorBag.push({
                  productId: value.productId,
                  warehouseId: value.warehouseId
                })
                this.validationError = true
              }
            })
          })

          this.clientProducts = _.cloneDeep(this.getUserCart.cart)

          if (this.validationError) {
            let scroll = `p-${this.errorBag[0].productId}w-${
              this.errorBag[0].warehouseId
            }`
            this.$scrollTo(`#${scroll}`, 1500, { offset: -300 })
            this.errorBag = []
            this.localLoader = false
          } else if (this.invalidWarehouses.length) {
            this.$scrollTo(
              `#anchor-warehouse-${this.invalidWarehouses[0]}`,
              1500,
              { offset: -300 }
            )
            this.localLoader = false
          } else if (!this.$route.query.merge) this.checkout()
        })
      } else {
        this.$store.dispatch('toggleLoginModal', {
          open: true,
          authGuard: false
        })

        this.loggedFromCart = true
        this.localLoader = false
      }

      setTimeout(() => {
        this.isAnimateWarehouseWarning = false
      }, 1000)
    },
    checkout () {
      this.$store.dispatch('mergeServerCart')
        .then(() => {
          this.localLoader = false
          this.$router.push({ name: 'shipping-method' })
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-page {
  padding-top: 64px;
  padding-bottom: 100px;
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
  &__title {
    text-align: center;
    margin-bottom: 64px;
    .responsive-checkout-button {
      display: none;
    }
    h1 {
      margin-bottom: 0;
      line-height: 1;
    }
  }
  .notification-wrap {
    margin-bottom: 32px;
  }
  &__keep-shop {
    width: 100%;
    margin-top: 128px;
    display: flex;
    flex-direction: column;
    align-items: center;
    &--small-margin {
      margin-top: 80px;
    }
  }
  &__keep-shop-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background: #d0defb;
    border-radius: 100%;
    svg {
      height: 28px;
      fill: $main-color;
    }
  }
  &__keep-shop-text {
    margin-top: 32px;
    max-width: 376px;
    text-align: center;
    h3 {
      margin-bottom: 16px;
    }
    p {
      margin-bottom: 34px;
    }
  }
  &__keep-shop-button {
    width: 352px;
  }
  &__body {
    display: flex;
    .check-wrap {
      width: 352px;
      margin-left: 16px;
    }
    .items-wrap {
      width: calc(100% - 384px);
      margin-right: 16px;
    }
    &--warehouse {
      margin-top: 64px;
      &--title {
        display: flex;
        align-items: baseline;
        margin-bottom: 40px;
        position: relative;
        line-height: 1;
        span {
          &:first-child {
            margin-right: 54px;
            font-family: $montserrat-font;
            font-size: 20px;
            color: $paragraph;
            line-height: 44px;
          }
          &:last-child {
            font-family: $montserrat-font;
            font-size: 34px;
            color: $main-dark;
            font-weight: 500;
            line-height: 44px;
          }
        }
      }
      &__labels {
        position: relative;
        display: flex;
        align-items: center;
        line-height: 1;
        padding-bottom: 12px;
        &:after {
          position: absolute;
          content: '';
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: $interface-decoration-color;
        }
        .item {
          span {
            font-family: $montserrat-font;
            font-size: 12px;
            text-transform: uppercase;
            color: $main-grey;
          }
          &:first-child {
            width: 60%;
          }
          &:last-child {
            width: 40%;
            display: flex;
            justify-content: space-between;
          }
        }
        &--price {
          margin-left: 46px;
        }
      }
      &:first-child {
        margin-top: 0;
      }
      &__footer {
        height: 40px;
        position: relative;
        margin-top: 16px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .item {
          display: flex;
          width: 292px;
        }
        .subtotal {
          margin-right: 43px;
          font-family: $montserrat-font;
          font-size: 16px;
          color: $main-dark;
        }
        .subtotal-numbers {
          font-family: $montserrat-font;
          font-size: 16px;
          font-weight: 500;
          color: $main-color;
        }
        .delete-warehouse {
          position: absolute;
          top: 0;
          right: 0;
          button {
            padding: 0;
            width: 46px;
            svg {
              margin: auto;
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }
    &--product {
      position: relative;
      padding: 16px 0;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .item-flex-info {
        display: flex;
        align-items: center;
        width: 60%;
        .cart-page__body--product--info {
          margin-left: 32px;
        }
      }
      .item-flex-counts {
      }
      &--image {
        position: relative;
        display: flex;
        align-items: center;
        flex-direction: column;
        a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 96px;
          height: 96px;
          border-radius: 4px;
          overflow: hidden;
        }
        .img {
          max-width: 100%;
          max-height: 100%;
        }
        &__freight {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(20, 88, 235, 0.8);
          border-radius: 0 0 4px 4px;
          svg {
            width: 16px;
            height: 16px;
            fill: white;
          }
        }
      }
      &--info {
        .name {
          margin-bottom: 0;
        }
        p {
          margin-bottom: 20px;
        }
        .small-p {
          line-height: 18px;
          color: $paragraph;
        }
      }
      &--counts {
        width: 256px;
        .flex-block {
          display: flex;
          .item-flex {
            display: flex;
          }
          &--price {
            display: flex;
            flex-direction: column;
            justify-content: center;
            &--total {
              font: 500 16px $montserrat-font;
              color: $main-color;
            }
            &--each {
              span {
                &:first-child {
                  font: 12px $montserrat-font;
                  color: $main-dark;
                }
                &:last-child {
                  font-family: $montserrat-font;
                  color: $paragraph;
                  font-size: 12px;
                }
              }
            }
          }
        }
        .input-wrap {
          display: flex;
          align-items: center;
          position: relative;
          margin-right: 63px;
        }

        input {
          padding: 4px;
          width: 48px;
          height: 24px;
          text-align: center;
          font-size: 14px;
          &.validation-error {
            border: 1px solid #f44336 !important;
          }
          &.warning {
            border: 1px solid $warning;
          }
        }
        .total-price {
          font-family: $montserrat-font;
          color: $main-color;
          font-size: 18px;
          line-height: 1;
        }
      }
      &--close {
        position: absolute;
        top: calc(50% - 12px);
        right: 0;
        &-freight {
          top: calc((50% - 19px) - 12px);
        }
        button {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 2px;
          background: $grey;
          border: none;
          cursor: pointer;
          svg {
            width: 24px;
            height: 24px;
            fill: white;
          }
          &:hover {
            background: $main-color;
          }
        }
      }
      .item {
      }
      .item + .item {
        margin-left: 32px;
      }
      &:after {
        position: absolute;
        content: '';
        width: 100%;
        height: 1px;
        left: 0;
        bottom: 0;
        background: $interface-decoration-color;
      }
    }
    .check {
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
      &__header {
        height: 75px;
        box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        background: $main-color;
        justify-content: center;
        h3 {
          margin-bottom: 0;
          font-size: 20px;
          font-weight: 500;
          font-family: $montserrat-font;
          color: white;
        }
      }
      &__body {
        padding: 0 32px;
        &--warehouse {
          padding-top: 32px;
          padding-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          &:after {
            position: absolute;
            content: '';
            bottom: 0;
            width: 100%;
            height: 1px;
            background: #eceff1;
          }
          .name {
            font-size: 16px;
            line-height: 22px;
            font-weight: 500;
            font-family: $montserrat-font;
            color: $main-dark;
          }
          .price {
            font-size: 16px;
            font-weight: 500;
            font-family: $montserrat-font;
            color: $main-color;
          }
        }
      }
      &__footer {
        padding: 24px 32px 32px 32px;
        &--total {
          display: flex;
          align-items: center;
          justify-content: space-between;
          line-height: 1;
          span {
            &:first-child {
              font-family: $montserrat-font;
              font-size: 20px;
              font-weight: 600;
              color: $main-dark;
              text-transform: uppercase;
            }
            &:last-child {
              font-family: $montserrat-font;
              font-size: 20px;
              font-weight: 500;
              color: $main-color;
            }
          }
        }
        &--button {
          margin-top: 24px;
          button {
            height: 40px;
          }
        }
      }
    }
    &--button {
      margin-top: 64px;
      display: flex;
      justify-content: center;
      .flex-wrap-buttons {
        display: flex;
        justify-content: center;
      }
      .button-second {
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
          margin-top: -2px;
          width: 19px;
        }
      }
      button {
        width: 352px;
      }
      button + button {
        margin-left: 32px;
      }
    }
  }
  &-popular {
    margin-top: 128px;
    .swiper-container {
      padding-bottom: 50px;
    }
    h2 {
      margin-bottom: 32px;
      text-align: center;
    }
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
    .swiper-slide {
      height: auto;
    }
  }
}

.empty-cart {
  padding-top: 64px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:before {
    position: absolute;
    content: '';
    top: 0;
    width: 100%;
    height: 1px;
    background: #eceff1;
  }
}

@media (max-width: $xl) {
  .cart-page-popular {
    .slider-buttons {
      display: none;
    }
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .cart-page {
    &__body {
      &--warehouse {
        &__labels {
          .item {
            &:last-child {
              width: 50%;
            }
            &:last-child {
              width: 50%;
            }
          }
          &--price {
            margin-left: 24px;
          }
        }
      }
      &--product {
        &--counts {
          margin-left: 32px;
          width: auto;
          .flex-block {
            .input-wrap {
              margin-right: 32px;
            }
          }
        }
      }
      .item-flex-info {
        display: flex;
        align-items: center;
        width: 50%;
        .cart-page__body--product--info {
          margin-left: 32px;
        }
      }
      &--button {
        .flex-wrap-buttons {
          width: 100%;
        }
      }
    }
  }
}

@media (min-width: 720px) and (max-width: $md) {
  .cart-page {
    &__title {
      .responsive-checkout-button {
        margin-top: 32px;
        display: block;
      }
    }
    &__body {
      flex-wrap: wrap;
      .items-wrap {
        width: 100%;
      }
      .check-wrap {
        margin-top: 32px;
        width: 100%;
        margin-left: 0;
      }
      &--warehouse {
        &__labels {
          .item {
            &:first-child {
              width: 60%;
            }
            &:last-child {
              width: 40%;
            }
          }
        }
      }
      &--button {
        .flex-wrap-buttons {
          width: 100%;
          justify-content: center;
        }
      }
    }
  }
}

@media (min-width: $sm - 1) and (max-width: 720px) {
  .cart-page {
    &__title {
      .responsive-checkout-button {
        margin-top: 32px;
        display: block;
      }
    }
    &__body {
      flex-wrap: wrap;
      .items-wrap {
        width: 100%;
      }
      .check-wrap {
        margin-top: 32px;
        width: 100%;
        margin-left: 0;
      }
      &--warehouse {
        &__labels {
          .item {
            &:first-child {
              width: 50%;
            }
            &:last-child {
              width: 50%;
            }
          }
        }
      }
      &--product {
        .item-flex-info {
          width: 50%;
        }
      }
      &--button {
        .flex-wrap-buttons {
          width: 100%;
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm - 1) {
  .cart-page {
    padding-top: 32px;
    &__keep-shop {
      margin-top: 80px;
    }
    &__keep-shop-button {
      width: 290px;
    }
    &__title {
      margin-bottom: 32px;
      h1 {
        font-size: 24px;
      }
      .responsive-checkout-button {
        margin-top: 32px;
        display: block;
      }
    }
    &__body {
      flex-wrap: wrap;
      .items-wrap {
        width: 100%;
        margin-right: 0;
      }
      .check-wrap {
        margin-top: 48px;
        width: 100%;
        margin-left: 0;
        .check {
          &__header {
            background: $main-color;
            box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
            h3 {
              color: white;
            }
          }
        }
      }
      &--warehouse {
        &__labels {
          display: none;
        }
        &__footer {
          justify-content: space-between;
        }
      }
      &--product {
        padding: 8px 0;
        .item-flex-info {
          width: 80%;
        }
        &--image {
          a {
            width: 48px;
            height: 48px;
          }
          &__freight {
            bottom: -24px;
            left: 0;
            width: 100%;
            height: 24px;
            svg {
              width: 14px;
              height: 14px;
            }
          }
        }
        &--info {
          margin-left: 16px !important;
        }
        &--close {
          top: 8px;
        }
        &--counts {
          width: 100%;
          margin-left: 64px;
          .input-wrap {
            margin-right: 16px;
          }
        }
        &--bordered-top {
          &:before {
            position: absolute;
            content: '';
            width: 100%;
            height: 1px;
            left: 0;
            top: 0;
            background: $interface-decoration-color;
          }
        }
      }
      &--button {
        margin-top: 32px;
        .flex-wrap-buttons {
          width: 100%;
        }
      }
    }
    .empty-cart {
      padding-top: 32px;
      &:before {
        display: none;
      }
    }
    .cart-page-popular {
      margin-top: 64px;
    }
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .cart-page {
    &__title {
      margin-bottom: 32px;
      .responsive-checkout-button {
        margin-top: 24px;
        display: block;
      }
    }
    &__keep-shop-button {
      width: 100%;
    }
    &__body {
      .check {
        &__body {
          &--warehouse {
            .name {
              max-width: 100px;
              font-size: 16px;
            }
          }
        }
      }
      .check-wrap {
        margin-top: 32px;
        width: 100%;
        margin-left: 0;
      }
      &--warehouse {
        &--title {
          flex-wrap: wrap;
          span {
            &:first-child {
              width: 100%;
              line-height: 1;
              font-size: 16px;
            }
            &:last-child {
              margin-top: 16px;
              margin-left: 0;
              width: 100%;
              line-height: 1;
              font-size: 24px;
              font-weight: 500;
            }
          }
        }
      }
      &--product {
        &--info {
          .name {
            font-size: 12px;
          }
        }
      }
      &--button {
        margin-top: 32px;
        button {
          width: 100%;
        }
        .flex-wrap-buttons {
          width: 100%;
          flex-wrap: wrap;
          .button-normal {
            margin-bottom: 8px;
          }
          .button-second {
            height: 40px;
            margin-left: 0;
          }
        }
      }
    }
  }
  .cart-page-popular {
    h2 {
      font-size: 20px;
    }
  }
}
</style>
