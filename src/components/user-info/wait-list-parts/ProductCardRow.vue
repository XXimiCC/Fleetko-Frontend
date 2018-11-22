<template>
  <div class="product-card-row"
       :class="{ catalog: catalog }"
       @mouseenter="hovered = true"
       @mouseleave="hovered = false">
    <div class="flex-item-block">
      <router-link :to="{ name: 'product-page', params: { slug: product.slug } }"
                   class="product-card-row--link-wrap">
        <div class="image-block" :class="{ blurred: noStock }">
          <div v-if="noStock" class="no-stock">
            <div><h1>Out</h1><h2>Of Stock</h2></div>
          </div>

          <div class="product-card--image-wrap">
            <app-image :imagePath="componentProductImage(product.image)"
                       @emitErrorImage="errorImage">
            </app-image>
            <div v-if="product.freight" class="product-card-row__freight-label">
              <svg-freight v-if="$mq === 'xl' || $mq === 'lg' || $mq === 'md'">
              </svg-freight>
              <span>Freight</span>
            </div>
          </div>
        </div>
      </router-link>

      <div class="product-card-row--info-wrap">
        <div class="item text-block">
          <router-link :to="{ name: 'product-page', params: { slug: product.slug } }"
                       class="link-product-name product-name"
                       itemprop="url">
            {{ product.name }}
          </router-link>

          <div class="rating">
            <div class="stars">
              <star v-for="(star, i) in 5"
                    :key="i"
                    :position="++i"
                    :readOnly="true"
                    :size="$mq === 'sm' ? 13 : 18"
                    :rating="product.rating_average">
              </star>
              <span class="value">{{ roundDecimalRating(product.rating_average || 0) }}</span>
            </div>
            <router-link class="reviews"
                         :to="{
                           name: 'product-page',
                           params: { slug: product.slug },
                           query: { tab: 'reviews' }
                         }">
              <span>({{ product.rating_count }} reviews)</span>
            </router-link>
          </div>

          <div class="product-card-row--dealer">
            <span class="product-card-row--dealer-label">Dealer:</span>
            <router-link :to="{ name: 'dealer', params: { slug: product.dealer_slug } }">
              <span class="link-quaternary">{{ product.dealer_name }}</span>
            </router-link>
          </div>
          <div class="responsive-price">
            <span class="responsive-price--available" v-if="product.price">${{ toDollarDecimal(product.price) }}</span>
            <span class="responsive-price--blurred" v-else>Unavailable</span>
          </div>
          <p class="product-card-row--description">{{ cutText(product.description, 135) }}</p>
        </div>
        <div class="item button-block">
          <h4 v-if="product.price" :class="{ 'blurred-price': !product.quantity }">
            $ {{ toDollarDecimal(product.price) }}
          </h4>
          <div class="blurred-price__wrap" v-if="!product.price">
            <h4 :class="{ 'blurred-price': !product.price }" class="price">Unavailable</h4>
            <div class="blurred-price__wrap--help"
                 @mouseleave="showInfoBlock = false"
                 @mouseenter="showInfoBlock = true">
              <svg-help></svg-help>
            </div>
            <div class="blurred-price__wrap--info" v-show="showInfoBlock">
              <p>
                The good will soon be shipped to the warehouses. Add the good to
                the Wait List and we will notify you as soon as the good arrives
              </p>
            </div>
          </div>

          <button v-if="!catalog"
                  @click="openModalCart"
                  :class="{ 'button-prime': inStockProduct, 'button-second': !inStockProduct }"
                  :disabled="disabledAddToCart"
                  class="button-block--buy left-icon">
            <svg-basket></svg-basket>
            <span>Add to cart</span>
          </button>

          <router-link :to="{ name: 'product-page', params: { slug: product.slug } }">
            <button v-if="!catalog" class="button-block--details button-second left-icon">
              <svg-eye-show></svg-eye-show>
              <span>View details</span>
            </button>
          </router-link>

          <div v-if="!catalog" class="delete-block" @click="deleteProductFromWaitList">
            <svg-delete></svg-delete>
            <span>Delete</span>
          </div>

          <button v-if="catalog && product.quantity && product.price"
                  @click="openModalCart"
                  :class="{ 'button-prime': inStockProduct, 'button-second': !inStockProduct }"
                  :disabled="disabledAddToCart"
                  class="button-block--buy left-icon">
            <svg-basket></svg-basket>
            <span>Add to cart</span>
          </button>

          <button v-if="catalog && (!product.quantity || !product.price)"
                  @click="addToWaitList"
                  class="button-add button-second">
            <svg-wishlist v-if="!inWaitList"></svg-wishlist>
            <svg-check-xl v-if="inWaitList"></svg-check-xl>
            <p v-if="inWaitList">{{ 'In Wait List' }}</p>
            <p v-if="!inWaitList">Add to <span class="break-point">wait list</span></p>
          </button>
        </div>
      </div>

      <div class="product-card-row--responsive-info">
        <button v-if="!catalog" @click="openModalCart"
                :class="{ 'button-prime': inStockProduct, 'button-second': !inStockProduct }"
                :disabled="disabledAddToCart"
                class="button-block--buy left-icon">
          <svg-basket></svg-basket>
          <span>Add to cart</span>
        </button>

        <button v-if="catalog && product.quantity && product.price"
                @click="openModalCart"
                :class="{ 'button-prime': inStockProduct, 'button-second': !inStockProduct }"
                :disabled="disabledAddToCart"
                class="button-block--buy left-icon">
          <svg-basket></svg-basket>
          <span>Add to cart</span>
        </button>

        <button v-if="catalog && (!product.quantity || !product.price)"
                @click="addToWaitList"
                class="button-add button-second">
          <svg-wishlist v-if="!inWaitList"></svg-wishlist>
          <svg-check-xl v-if="inWaitList"></svg-check-xl>
          <p v-if="inWaitList">{{ 'In Wait List' }}</p>
          <p v-if="!inWaitList">Add to <span class="break-point">wait list</span></p>
        </button>

        <router-link :to="{ name: 'product-page', params: { slug: product.slug } }">
          <button v-if="!catalog" class="button-block--details button-second left-icon">
            <svg-eye-show></svg-eye-show>
            <span>View details</span>
          </button>
        </router-link>

        <div v-if="!catalog"
             class="delete-block"
             @click="deleteProductFromWaitList">
          <svg-delete></svg-delete>
          <span>Delete</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppImage from '../../parts/AppImage'
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'
import Star from '../../common-components/Star'
import { mapGetters } from 'vuex'

export default {
  name: 'product-card-row',
  components: {
    AppImage,
    Star
  },
  mixins: [utils, imageSource],
  props: [
    'product',
    'view',
    'rate',
    'disabledAddToCart',
    'inStockProduct',
    'catalog'
  ],
  data () {
    return {
      showInfoBlock: false,
      hovered: false
    }
  },
  computed: {
    noStock () {
      if (['md', 'lg', 'xl'].includes(this.$mq)) {
        return this.product.quantity < 1 && this.hovered
      } else {
        return this.product.quantity < 1
      }
    },
    ...mapGetters(['userWaitList', 'isAuth']),
    inWaitList () {
      if (this.userWaitList) {
        return this.userWaitList.some(item => item.id === this.product.id)
      }
    }
  },
  methods: {
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_PRODUCT)
    },
    componentProductImage (images, onError) {
      return this.serverImageSource(
        images,
        this.$mq === 'sm' ? 'tiny' : 'medium',
        onError,
        this.SERVER_IMAGE_PRODUCT
      )
    },
    openModalCart () {
      this.$store
        .dispatch('setModalProductId', this.product.slug)
        .then(() => this.$store.dispatch('toggleCartModal', true))
    },
    deleteProductFromWaitList () {
      this.$emit('deleteProductFromWaitList', this.product.id)
    },
    addToWaitList () {
      if (this.$parent.$options.name === 'ProductCard') {
        this.$emit('addTo', window.scrollY)

        return
      }

      if (!this.isAuth) {
        this.$store.dispatch('toggleLoginModal', {
          open: true,
          authGuard: false
        })
        this.$store.dispatch('setTemporaryProductId', this.product.id)
        return
      }

      if (!this.inWaitList) { this.$store.dispatch('createWaitListedProduct', this.product.id) }
    }
  }
}
</script>

<style scoped lang="scss">
.no-hover {
  &:first-child {
    position: relative;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      width: 100%;
      height: 1px;
      background: #eceff1;
    }
  }
}

.catalog {
  width: 100%;
  .text-block {
    margin-right: 0 !important;
  }
}

.button-add {
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: $main-color;
    margin-right: 8px;
    width: 20px;
    height: 20px;
  }
}

.product-card-row {
  position: relative;
  padding-bottom: 23px;
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: #eceff1;
  }
  &--responsive-info {
    display: none;
  }
  .responsive-price {
    display: none;
  }
  &--info-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .flex-item-block {
    display: flex;
    width: 100%;
  }
  &--link-wrap {
    display: flex;
    flex: 0 0 208px;
  }
  &__freight-label {
    border-radius: 4px;
    padding: 8px;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 0;
    right: 0;
    background: $main-color;
    cursor: default;
    pointer-events: none;
    z-index: 200;
    svg {
      margin-bottom: 4px;
      width: 16px;
      fill: white;
    }
    span {
      font-family: $montserrat-font;
      font-size: 10px;
      color: white;
      font-weight: 500;
    }
  }
  .blurred {
    height: 100%;
    width: 100%;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    .no-stock {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      z-index: 200;
      color: white;
      background: rgba(119, 119, 119, 0.4);
      h1 {
        margin-bottom: 32px;
        display: block;
        font-family: $montserrat-font;
        font-size: 48px;
        font-weight: 500;
        color: white;
        text-align: center;
        line-height: 18px;
      }
      h2 {
        display: block;
        font-family: $montserrat-font;
        font-size: 34px;
        font-weight: 500;
        color: white;
        text-align: center;
        line-height: 18px;
      }
    }
    img {
      filter: blur(7px);
      transition: 0.2s;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .image-block {
    position: relative;
    flex: 0 0 208px;
    height: 208px;
    display: flex;
    align-items: center;
    overflow: hidden;
    justify-content: center;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .text-block {
    flex: 0 0 378px;
    margin-left: 32px;
    margin-right: 133px;
  }
  &--dealer {
    margin-top: 13px;
    display: flex;
    align-items: center;
    span {
      &:last-child {
        max-width: 188px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-left: 7px;
        color: $main-color;
        font-family: $sours-sans-p-font;
        font-weight: 600;
        font-size: 14px;
        line-height: 1;
        cursor: pointer;
      }
    }
  }
  &--dealer-label {
    color: $main-dark;
    font-family: $sours-sans-p-font;
    font-size: 14px;
    font-weight: 600;
  }
  .button-block {
    position: relative;
    .delete-block {
      position: absolute;
      bottom: 0;
      right: 0;
      display: flex;
      align-items: center;
      cursor: pointer;
      svg {
        width: 22px;
        fill: $svg-fill-tertiary;
      }
      span {
        margin-left: 4px;
        font-family: $sours-sans-p-font;
        color: $paragraph;
        font-size: 14px;
      }
      &:hover {
        svg {
          fill: $main-color;
        }
        span {
          color: $main-color;
        }
      }
    }
    button {
      width: 208px;
      &:disabled {
        cursor: not-allowed;
      }
    }
    h4 {
      margin-bottom: 24px;
      text-align: right;
      color: $main-color;
      font-family: $montserrat-font;
      font-size: 24px;
      font-weight: 500;
      line-height: 18px;
    }
    .blurred-price {
      color: $main-grey !important;
      font-size: 24px;
      &__wrap {
        position: relative;
        display: flex;
        justify-content: space-between;
        &--help {
          display: flex;
          margin-left: 8px;
        }
        &--info {
          position: absolute;
          bottom: 8px;
          right: 36px;
          padding: 16px;
          background: #fcfcfc;
          border-radius: 4px;
          border: 1px solid $border-color;
          box-shadow: 0 5px 6.58px 0.42px rgba(0, 0, 0, 0.05),
            0 2px 9.8px 0.2px rgba(0, 0, 0, 0.02);
          p {
            position: relative;
            margin-bottom: 0;
            line-height: 19px;
            font-size: 14px;
            font-family: $sours-sans-p-font;

            &:after {
              position: absolute;
              content: '';
              bottom: 4px;
              right: -23px;
              width: 12px;
              height: 12px;
              background: #fcfcfc;
              transform: rotate(45deg);
              border-top: 1px solid $border-color;
              border-right: 1px solid $border-color;
            }
          }
        }
        svg {
          width: 20px;
          height: 20px;
          fill: $svg-fill-tertiary;
          cursor: pointer;
        }
      }
    }
    &--details {
      width: 160px;
      height: 40px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
    &--buy {
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
    &--wait {
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      font-weight: 600;
      svg {
        width: 20px;
        height: 20px;
        fill: white;
      }
      span {
        margin-left: 10px;
        font-family: $montserrat-font;
        font-size: 12px;
        font-weight: 500;
        color: white;
      }
    }
  }
  .rating {
    display: flex;
    margin-top: 16px;
    margin-bottom: 20px;
    .stars {
      display: flex;
      align-items: center;
    }
    .value {
      margin: 0 8px;
      font: 500 12px $montserrat-font;
      color: $main-dark;
    }
    .reviews {
      font: 14px $sours-sans-p-font;
      color: $caption-text-color;
    }
  }
  &--title {
    margin-bottom: 14px;
    color: $main-dark;
    line-height: 1;
    font-family: $montserrat-font;
    font-size: 20px;
    font-weight: 500;
  }
  &--subtitle {
    margin-bottom: 12px;
    color: $main-dark;
    line-height: 22px;
    cursor: pointer;
  }
  &--description {
    margin-top: 16px;
    margin-bottom: 0;
    font-size: 14px;
    font-family: $sours-sans-p-font;
    line-height: 19px;
    color: $main-grey;
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .product-card-row {
    &--link-wrap {
      flex: 0 0 200px;
    }
    .image-block {
      flex: 0 0 200px;
      height: 194px;
      img {
        max-height: 100%;
        max-width: 100%;
      }
    }
    &--image-wrap {
      height: 194px;
    }
    .text-block {
      margin-left: 16px;
      margin-right: 32px;
      flex: 0 0 240px;
    }
  }
}

@media (min-width: 750px) and (max-width: $md) {
  .product-card-row {
    &--info-wrap {
      display: flex;
      justify-content: space-between;
    }
    &--link-wrap {
      flex: 0 0 200px;
    }
    .image-block {
      flex: 0 0 200px;
      height: 194px;
      img {
        max-height: 100%;
        max-width: 100%;
      }
    }
    &--image-wrap {
      height: 194px;
    }
    .text-block {
      margin-left: 16px;
      margin-right: 32px;
      flex: 0 0 240px;
    }
  }
}

@media (min-width: $sm) and (max-width: 750px) {
  .product-card-row {
    &--info-wrap {
      padding-left: 16px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    }
    &--link-wrap {
      flex: 0 0 259px;
    }
    .image-block {
      flex: 0 0 100%;
      height: 249px;
      img {
        max-height: 100%;
        min-width: 100%;
      }
    }
    &--image-wrap {
      height: 194px;
    }
    .button-block {
      margin-top: 16px;
      .delete-block {
        position: relative;
      }
      .blurred-price {
        &__wrap {
          justify-content: flex-start;
          h4 {
            margin-bottom: 16px;
          }
        }
      }
      h4 {
        text-align: left;
      }
      &--details {
        display: none;
      }
      &--buy {
        width: 208px;
        height: 40px;
        background: white;
        cursor: pointer;
        border: 1px solid $main-color;
        border-radius: 4px;
        color: $main-color;
        font-size: 12px;
        font-weight: 500;
        font-family: $montserrat-font;
        line-height: 1;
        text-transform: uppercase;
        svg {
          fill: $main-color;
        }
        span {
          color: $main-color;
        }
        &:hover {
          box-shadow: 0 1px 0.94px 0.06px rgba(0, 28, 236, 0.24),
            0 0 0.98px 0.02px rgba(0, 28, 236, 0.16);
          background-color: $main-color;
          border: 1px solid $main-color;
          color: white;
          svg {
            fill: white;
          }
          span {
            color: white;
          }
        }
        &:disabled {
          border: 1px solid #cfd8dc;
          background: #f7fafc;
          color: #cfd8dc;
          &:hover {
            box-shadow: none;
            border: 1px solid #cfd8dc;
            background: #f7fafc;
            span {
              color: #cfd8dc;
            }
            svg {
              fill: #cfd8dc;
            }
          }
        }
      }
    }
    .rating {
      margin-bottom: 0;
    }
    .text-block {
      margin-left: 0;
      margin-right: 0;
      flex: 0 0 auto;
    }
  }
}

@media (max-width: $sm - 1) {
  .product-card-row {
    padding-bottom: 16px;
    &.product-card {
      margin-top: 16px;
    }
    .product-name {
      font-size: 12px;
      line-height: 16px;
    }
    .flex-item-block {
      flex-wrap: wrap;
    }
    .blurred {
      .no-stock {
        h1 {
          margin-bottom: 16px;
          font-size: 24px;
        }
        h2 {
          font-size: 20px;
        }
      }
    }
    .responsive-price {
      margin-top: 8px;
      display: block;
      font: 500 20px/32px $montserrat-font;
      &--available {
        color: $main-color;
      }
      &--blurred {
        color: $paragraph;
      }
    }
    &--responsive-info {
      margin-top: 10px;
      width: 100%;
      display: block;
      .button-block {
        &--details {
          width: 100%;
        }
      }
      .delete-block {
        margin-top: 16px;
        display: flex;
        align-items: center;
        cursor: pointer;
        justify-content: flex-end;
        svg {
          width: 22px;
          fill: $svg-fill-tertiary;
        }
        span {
          margin-left: 4px;
          font-family: $sours-sans-p-font;
          color: $paragraph;
          font-size: 14px;
        }
      }
    }
    &--subtitle {
      margin-bottom: 0;
      font-size: 12px;
      line-height: 1;
    }
    &--dealer {
      display: none;
    }
    &--description {
      display: none;
    }
    &--info-wrap {
      width: calc(100% - 128px);
      padding-left: 8px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    &--link-wrap {
      flex: 0 0 120px;
    }
    .image-block {
      flex: 0 0 100%;
      max-height: 120px;
    }
    &--image-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      max-height: 120px;
      img {
        max-height: 100%;
        max-width: 100%;
      }
    }
    .button-block {
      display: none;
    }
    .rating {
      flex-wrap: wrap;
      margin-top: 16px;
      margin-bottom: 0;
      span {
        margin-top: 8px;
        width: 100%;
        margin-left: 0;
        padding-left: 0;
      }
    }
    .text-block {
      margin-left: 0;
      margin-right: 0;
      flex: 0 0 auto;
    }
  }
  .rating {
    flex-flow: column;
    margin-top: 0;
    margin-bottom: 8px;
    .reviews {
      margin-top: 4px;
    }
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .product-card-row {
    &--info-wrap {
      width: 50%;
    }
  }
}
</style>
