<template>
  <div class="cart">
    <div class="flex-table">
      <div class="flex-table--row">
        <div class="products column">
          <div class="flex-row-item" v-for="product in products">
            <router-link
              :to="{ name: 'product-page', params: { slug: product.slug } }"
              tag="a"
            >
              <div class="image-wrap">
                <app-image
                  :imageObject="product.image"
                  :imagePath="componentProductImage(product.image)"
                  @emitErrorImage="errorImage"
                ></app-image>
              </div>
            </router-link>
            <router-link
              class="name-link"
              :to="{ name: 'product-page', params: { slug: product.slug } }"
              tag="a"
            >
              <span class="link-tertiary">{{ product.name }}</span>
            </router-link>
            <div class="responsive-info">
              <p class="responsive-info--total">
                $ {{ toDollarDecimal(product.price * product.quantity) }}
              </p>
              <p class="responsive-info--price">
                <span>$ {{ toDollarDecimal(product.price) }}</span>
                <span>/ {{ product.quantity }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="dealer column margin-next">
          <div class="flex-row-item image-wrap" v-for="product in products">
            <app-image
              :imageObject="product.dealer_image"
              :imagePath="componentDealerImage(product.dealer_image)"
              @emitErrorImage="errorImage"
            ></app-image>
          </div>
        </div>
        <div class="sku column margin-next">
          <div class="flex-row-item" v-for="product in products">
            <span># {{ product.sku }}</span>
          </div>
        </div>
        <div class="price column margin-next">
          <div class="flex-row-item" v-for="product in products">
            <span>$ {{ toDollarDecimal(product.price) }}</span>
          </div>
        </div>
        <div class="amount column margin-next">
          <div class="flex-row-item" v-for="product in products">
            <span>x {{ product.quantity }}</span>
          </div>
        </div>
        <div class="column total margin-next">
          <div class="flex-row-item" v-for="product in products">
            <span
              >$ {{ toDollarDecimal(product.price * product.quantity) }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppImage from '../../parts/AppImage'
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'
export default {
  name: 'order-products',
  props: ['products'],
  mixins: [utils, imageSource],
  methods: {
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_CATEGORY)
    },
    componentProductImage (image, onError) {
      let sizeProperty = ''

      if (this.$mq === 'xl' || this.$mq === 'lg') {
        sizeProperty = 'small'
      } else {
        sizeProperty = 'tiny'
      }

      return this.serverImageSource(
        image,
        sizeProperty,
        onError,
        this.SERVER_IMAGE_PRODUCT
      )
    },
    componentDealerImage (image, onError) {
      let sizeProperty = 'tiny'

      return this.serverImageSource(
        image,
        sizeProperty,
        onError,
        this.SERVER_IMAGE_DEALER
      )
    }
  },
  components: {
    AppImage
  }
}
</script>

<style scoped lang="scss">
.cart {
  width: 100%;
  .flex-table {
    margin-top: 92px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .column {
      display: flex;
      flex-direction: column;
    }
    .flex-row-item {
      width: 100%;
      height: 80px;
      display: flex;
      align-items: center;
      .responsive-info {
        display: none;
      }
    }
    &--row {
      padding: 0 8px;
      width: 100%;
      display: flex;
      .products {
        display: flex;
        align-items: center;
        flex-grow: 1;
        .image-wrap {
          display: flex;
          align-items: center;
          padding: 8px 0;
          width: 64px;
          height: 100%;
          img {
            max-width: 100%;
            max-height: 80px;
          }
        }
        span {
          max-width: 180px;
          margin-left: 40px;
          line-height: 19px;
        }
      }
      .dealer {
        display: flex;
        align-items: center;
        .image-wrap {
          width: 104px;
          display: flex;
          align-items: center;
          img {
            max-width: 100%;
            max-height: 32px;
          }
        }
      }
      .sku {
        display: flex;
        align-items: center;
        span {
          font-family: $montserrat-font;
          font-size: 12px;
          font-weight: 500;
          color: $main-dark;
        }
      }
      .price {
        display: flex;
        align-items: center;
        span {
          font-family: $montserrat-font;
          font-size: 12px;
          font-weight: 500;
          color: $main-dark;
        }
      }
      .amount {
        display: flex;
        align-items: center;
        span {
          font-family: $montserrat-font;
          font-size: 12px;
          font-weight: 500;
          color: $main-dark;
        }
      }
      .total {
        display: flex;
        align-items: center;
        .flex-row-item {
          justify-content: flex-end;
        }
        span {
          font-family: $montserrat-font;
          font-size: 16px;
          font-weight: 500;
          color: $main-color;
        }
      }
      .grow {
        flex-grow: 1;
        padding-right: 64px;
      }
      .margin-next + .margin-next {
        margin-left: 64px;
      }
      &:first-child {
        position: relative;
        &:before {
          position: absolute;
          content: '';
          top: -16px;
          height: 1px;
          width: 100%;
          left: 0;
          background: $border-color;
        }
        .products {
          position: relative;
          &:before {
            position: absolute;
            content: 'products';
            display: flex;
            left: 8px;
            top: -40px;
            font-family: $sours-sans-p-font;
            color: $main-grey;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 14px;
            line-height: 1;
          }
        }
        .name-link {
          display: flex;
        }
        .dealer {
          position: relative;
          &:before {
            position: absolute;
            content: 'dealer';
            display: flex;
            left: 0;
            top: -40px;
            font-family: $sours-sans-p-font;
            color: $main-grey;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 14px;
            line-height: 1;
          }
        }
        .sku {
          position: relative;
          &:before {
            position: absolute;
            content: 'sku';
            display: flex;
            left: 0;
            top: -40px;
            font-family: $sours-sans-p-font;
            color: $main-grey;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 14px;
            line-height: 1;
          }
        }
        .price {
          position: relative;
          &:before {
            position: absolute;
            content: 'price';
            display: flex;
            left: 0;
            top: -40px;
            font-family: $sours-sans-p-font;
            color: $main-grey;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 14px;
            line-height: 1;
          }
        }
        .amount {
          position: relative;
          &:before {
            position: absolute;
            content: 'amount';
            display: flex;
            left: 0;
            top: -40px;
            font-family: $sours-sans-p-font;
            color: $main-grey;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 14px;
            line-height: 1;
          }
        }
        .total {
          position: relative;
          &:before {
            position: absolute;
            content: 'total';
            display: flex;
            right: 0;
            top: -40px;
            font-family: $sours-sans-p-font;
            color: $main-grey;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 14px;
            line-height: 1;
          }
        }
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $lg) {
  .cart {
    .flex-table {
      &--row {
        justify-content: space-between;
      }
    }
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .cart {
    .flex-table {
      &--row {
        .products {
          padding-right: 16px;
          flex: 0 0 200px;
        }
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .cart {
    .flex-table {
      &--row {
        justify-content: space-between;
        .products {
          padding-right: 16px;
          flex: 0 0 50%;
        }
        .dealer {
          display: none;
        }
        .sku {
          display: none;
        }
        .margin-next + .margin-next {
          margin-left: 0;
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .cart {
    margin-top: 40px;
    .flex-table {
      margin-top: 46px;
      .flex-row-item {
        padding-top: 8px;
        position: relative;
        padding-bottom: 8px;
        flex-wrap: wrap;
        align-items: center;
        height: 100%;
        &:first-child {
          padding-top: 0;
        }
        &:after {
          position: absolute;
          content: '';
          bottom: 0;
          height: 1px;
          width: 100%;
          left: 0;
          background: $border-color;
        }
        .responsive-info {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          margin-left: calc(48px + 16px);
          &--total {
            margin-bottom: 0;
            font-family: $montserrat-font;
            font-size: 16px;
            font-weight: 500;
            color: $main-color;
            line-height: 1;
          }
          &--price {
            margin-bottom: 0;
            margin-top: 6px;
            width: 100%;
            line-height: 1;
            span {
              font-family: $montserrat-font;
              font-size: 12px;
              color: $main-dark;
              &:first-child {
                margin-left: 0;
              }
              &:last-child {
                margin-left: 0;
                color: $main-grey;
              }
            }
          }
        }
      }
      &--row {
        &:first-child {
          &:before {
            top: -8px;
          }
          .products {
            span {
              max-width: 150px;
              margin-left: 16px;
            }
            &:before {
              top: -32px;
            }
          }
        }
        .products {
          .image-wrap {
            width: 48px;
            height: 48px;
          }
        }
        .dealer {
          display: none;
        }
        .sku {
          display: none;
        }
        .price {
          display: none;
        }
        .amount {
          display: none;
        }
        .total {
          display: none;
        }
      }
    }
  }
}
</style>
