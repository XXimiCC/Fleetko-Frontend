<template>
  <div class="cart-menu">
    <!-- If cart is empty -->
    <div v-if="getTotalPriceCart < 1" class="cart-menu__body empty-card">
      <div class="empty-card--icon">
        <svg-keep-shopping></svg-keep-shopping>
      </div>
      <h2 class="h3-secondary empty-card--title">The Cart Is Empty</h2>
      <p class="empty-card--subtitle paragraph-tertiary">
        Add the products you like to the shopping cart
      </p>
    </div>
    <!-- If cart is not empty -->
    <div class="cart-menu__body" v-else>
      <div class="cart-menu__header">Cart</div>
      <div
        :ref="'bar'"
        class="cart-menu__body--wrap"
        v-bar="{
          preventParentScroll: true,
          scrollThrottle: 30
        }"
      >
        <div class="cart-menu__body--items">
          <!-- el2 -->
          <div
            v-for="warehouse in getUserCart.cart"
            class="cart-menu__body--warehouse-item"
          >
            <h3 class="warehouse-city">{{ warehouse.city }}</h3>
            <router-link
              :key="i"
              :to="{ name: 'product-page', params: { slug: product.slug } }"
              class="warehouse-product"
              v-for="(product, i) in warehouse.products"
            >
              <div class="warehouse-product--image">
                <app-image
                  class="img"
                  :imagePath="componentProductImage(product.image)"
                  @emitErrorImage="errorImage"
                ></app-image>
              </div>
              <div
                class="warehouse-product--delete"
                @click.prevent.stop="deleteCartItem(product)"
              >
                <svg-close></svg-close>
              </div>
              <div class="warehouse-product--info">
                <p>{{ product.name }}</p>
                <div class="flex-wrap">
                  <div class="warehouse-product--info__price">
                    <span>$ {{ toDollarDecimal(product.price) }}</span>
                    <svg-close></svg-close>
                    <span>{{ product.quantity }}</span>
                  </div>
                  <div class="warehouse-product--info__total">
                    <span
                      >$
                      {{
                        toDollarDecimal(product.price * product.quantity)
                      }}</span
                    >
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <!-- dragger will be automatically added here -->
      </div>
      <div class="cart-menu__body--footer">
        <div class="flex-wrap">
          <div class="item">Total</div>
          <div class="item">
            <span>$ {{ toDollarDecimal(getTotalPriceCart) }}</span>
          </div>
        </div>
        <router-link :to="{ name: 'cartPage' }">
          <button class="button-prime">Cart</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Vuebar from 'vuebar'
import { mapGetters } from 'vuex'
import Vue from 'vue'
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'
import AppImage from '../parts/AppImage'

Vue.use(Vuebar)
export default {
  name: 'dropdown-shopping-cart',
  data () {
    return {}
  },
  mixins: [utils, imageSource],
  methods: {
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_PRODUCT)
    },
    componentProductImage (images, onError) {
      let sizeProperty = 'tiny'

      return this.serverImageSource(
        images,
        sizeProperty,
        onError,
        this.SERVER_IMAGE_PRODUCT
      )
    },
    deleteCartItem (product) {
      this.$store.dispatch('deleteUserCartItem', product)
    }
  },
  components: {
    AppImage
  },
  computed: {
    ...mapGetters([
      'isAuth',
      'userInfo',
      'getUserCart',
      'getTotalPriceCart',
      'getTotalQuantityCart',
      'getTotalAmountCart'
    ])
  }
}
</script>

<style scoped lang="scss">
.cart-menu {
  position: absolute;
  z-index: 100;
  top: -18px;
  padding-top: 67px;
  right: 0-2px;
  width: 383px;
  max-height: 744px;
  &__header {
    padding: 28px 0;
    font-family: $montserrat-font;
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    background: #fafcff;
    color: $main-dark;
    line-height: 1;
    z-index: 200;
    box-shadow: 0px 0px 4.5px 0.5px rgba(102, 102, 102, 0.2);
  }
  &__body {
    padding: 0;
    position: relative;
    background: white;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    border-top: 1px solid $main-color;
    box-shadow: 0px 10px 14.1px 0.9px rgba(0, 0, 0, 0.14),
      0px 4px 19.6px 0.4px rgba(0, 0, 0, 0.06);
    &--footer {
      padding: 32px;
      box-shadow: 0px -3px 5px 0px rgba(0, 0, 0, 0.1);
      .flex-wrap {
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        .item {
          font-family: $montserrat-font;
          font-size: 20px;
          font-weight: 600;
          color: $main-dark;
          text-transform: uppercase;
          line-height: 1;
          &:last-child {
            font-family: $montserrat-font;
            font-size: 24px;
            font-weight: 500;
            color: $main-color;
          }
        }
      }
    }
    &--items {
      max-height: 376px;
    }
    &--warehouse {
      &-item {
        margin-top: 32px;
        .warehouse-city {
          margin-bottom: 16px;
          text-align: center;
          color: $main-dark;
        }
        &:last-child {
          .warehouse-product {
            &:last-child {
              margin-bottom: 16px;
            }
          }
        }
        .warehouse-product {
          position: relative;
          padding: 9px 28px 9px 42px;
          display: flex;
          &:hover {
            background-color: #f5f8ff;
          }
          &--delete {
            display: flex;
            top: 36px;
            left: 16px;
            height: 14px;
            width: 14px;
            position: absolute;
            svg {
              height: 14px;
              width: 14px;
              fill: $main-grey;
            }
            &:hover {
              svg {
                fill: $main-color;
              }
            }
          }
          &--image {
            width: 64px;
            height: 64px;
            display: flex;
            align-items: center;
            img {
              max-width: 100%;
            }
          }
          &--info {
            margin-left: 16px;
            display: flex;
            flex-wrap: wrap;
            width: calc(100% - 64px);
            p {
              max-width: 200px;
              margin-bottom: 0;
              font-family: $montserrat-font;
              color: $main-dark;
              font-weight: 500;
              font-size: 12px;
              line-height: 17px;
            }
            .flex-wrap {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            &__price {
              display: flex;
              align-items: center;
              span {
                line-height: 1;
                font-family: $montserrat-font;
                font-size: 12px;
                font-weight: 500;
                color: $main-dark;
              }
              svg {
                margin: 0 7px;
                fill: $main-dark;
                width: 10px;
                height: 10px;
              }
            }
            &__total {
              span {
                font-family: $montserrat-font;
                font-size: 16px;
                font-weight: 500;
                color: $main-color;
                line-height: 1;
              }
            }
          }
        }
      }
    }
  }
  .empty-card {
    padding: 32px 90px;
    &--icon {
      width: 64px;
      height: 64px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #d0defb;
      border-radius: 100%;
      svg {
        width: 32px;
        fill: $main-color;
      }
    }
    &--title {
      margin-bottom: 12px;
      text-align: center;
      line-height: 1;
    }
    &--subtitle {
      margin-bottom: 0;
      text-align: center;
    }
  }
}
</style>
