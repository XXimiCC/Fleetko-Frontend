<template>
  <div class="product">
    <div class="item">
      <router-link
        :to="{ name: 'product-page', params: { slug: result.slug } }"
        tag="a"
      >
        <div class="product--image-wrap">
          <app-image
            itemprop="image"
            :imageObject="result.image"
            :imagePath="componentProductImage(result.image)"
            @emitErrorImage="errorImage"
          ></app-image>
        </div>
      </router-link>
      <div class="product--info">
        <div class="product--info--row product-name">
          <router-link
            :to="{ name: 'product-page', params: { slug: result.slug } }"
            tag="a"
          >
            <span class="name link-product-name">{{ result.name }}</span>
          </router-link>
        </div>

        <div v-if="result.part_number" class="product--info--row mpn">
          <span class="label">mpn:</span>
          <span class="value">{{ result.part_number }}</span>
          <div class="svg-wrap" @click="copyNumber">
            <svg-content-copy></svg-content-copy>
          </div>
          <transition name="fade">
            <div v-if="showNotify" class="notify">Copied</div>
          </transition>
        </div>

        <div class="product--info--row dealer">
          <span class="label">Dealer:</span>
          <span class="value">{{ result.dealer_name }}</span>
          <router-link
            :to="{ name: 'dealer', params: { slug: result.dealer_slug } }"
            tag="a"
          >
            See all dealers products
          </router-link>
        </div>
        <div class="product--info--row description">
          <p>{{ cutText(result.description, 156) }}</p>
        </div>
      </div>
    </div>
    <div class="item">
      <span class="product--price" v-if="result.price">
        $ {{ toDollarDecimal(result.price) }}
      </span>
      <span class="product--price product--price--blurred" v-if="!result.price">
        Unavailable
      </span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'
import AppImage from '../../parts/AppImage'

Vue.use(VueClipboard)
export default {
  name: 'result-products',
  data () {
    return {
      showNotify: false
    }
  },
  props: ['result'],
  methods: {
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_PRODUCT)
    },
    componentProductImage (images, onError) {
      let sizeProperty = ''

      if (this.$mq === 'xl' || this.$mq === 'lg') {
        sizeProperty = 'small'
      } else {
        sizeProperty = 'tiny'
      }

      return this.serverImageSource(
        images,
        sizeProperty,
        onError,
        this.SERVER_IMAGE_PRODUCT
      )
    },
    copyNumber () {
      this.$copyText(this.result.part_number)
      this.showNotify = true

      setTimeout(() => {
        this.showNotify = false
      }, 3000)
    }
  },
  components: {
    AppImage
  },
  mixins: [utils, imageSource]
}
</script>

<style scoped lang="scss">
.product {
  position: relative;
  padding: 16px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .item {
    display: flex;
  }
  &--image-wrap {
    width: 96px;
    height: 96px;
    display: flex;
    align-items: center;
    img {
      max-width: 100%;
    }
  }
  &--info {
    margin-left: 16px;
    padding-top: 8px;
    .product-name {
      margin-bottom: 16px;
    }
    .name {
      margin-bottom: 0;
    }
    &--row {
      display: flex;
      align-items: center;
      .label {
        font-family: $sours-sans-p-font;
        font-size: 14px;
        font-weight: 600;
        color: $main-grey;
      }
      .value {
        margin-left: 8px;
        font-family: $sours-sans-p-font;
        font-size: 14px;
        font-weight: 600;
        color: $main-dark;
      }
    }
    .mpn {
      margin-top: 12px;
      .svg-wrap {
        margin-left: 8px;
        display: flex;
        cursor: pointer;
        &:hover {
          svg {
            fill: $main-color;
          }
        }
      }
      svg {
        width: 18px;
        fill: $svg-fill-tertiary;
      }
      .notify {
        margin-left: 7px;
        font-size: 14px;
        color: $paragraph;
        font-family: $sours-sans-p-font;
      }
    }
    .dealer {
      a {
        margin-left: 16px;
        font-family: $sours-sans-p-font;
        font-size: 12px;
        color: $main-color;
        border-bottom: 1px solid transparent;
        &:hover {
          border-bottom: 1px dashed $main-color;
        }
      }
    }
    .description {
      margin-top: 16px;
      max-width: 350px;
      p {
        margin-bottom: 0;
        font-family: $sours-sans-p-font;
        color: $main-grey;
        font-size: 14px;
      }
    }
  }
  &--price {
    color: $main-color;
    font-family: $montserrat-font;
    font-size: 20px;
    font-weight: 600;
    &--blurred {
      color: $grey;
    }
  }
  &:before {
    position: absolute;
    content: '';
    right: 0;
    width: 100%;
    height: 1px;
    background: $light-grey;
    top: 0;
  }
  &:last-child {
    &:after {
      position: absolute;
      content: '';
      right: 0;
      width: 100%;
      height: 1px;
      background: $light-grey;
      bottom: 0;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .product {
    flex-wrap: wrap;
    .item {
      &:last-child {
        margin-left: 92px;
        width: 100%;
      }
    }
    &--image-wrap {
      width: 76px;
      height: 76px;
    }
    &--info {
      .name {
        font-weight: 600;
        font-size: 12px;
      }
      .dealer {
        a {
          display: none;
        }
      }
      .description {
        display: none;
      }
      .mpn {
        .svg-wrap {
          display: none;
        }
      }
    }
    &--price {
      font-size: 16px;
      font-weight: 500;
    }
  }
}

@media (min-width: $xs) and (max-width: $lg) {
  .product {
    &--info {
      .dealer {
        a {
          border-bottom: 1px dashed $main-color;
        }
      }
    }
  }
}
</style>
