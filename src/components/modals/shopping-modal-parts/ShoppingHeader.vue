<template>
  <div class="header" :class="{ manual: manual }">
    <div class="wrap">
      <div class="image">
        <app-image
          itemprop="image"
          :imagePath="componentProductImage(product.image)"
          @emitErrorImage="errorImage"
        >
        </app-image>
      </div>
      <div class="header--right">
        <div class="name">{{ product.name }}</div>
        <div class="price">${{ toDollarDecimal(product.price) }}</div>
      </div>
    </div>
    <p class="caption">Tap on the warehouse to input needed quantity.</p>
  </div>
</template>

<script>
import AppImage from '../../parts/AppImage'
import imageSource from '@/mixins/imagesSource'

export default {
  name: 'ShoppingHeader',
  props: ['product', 'manual'],
  components: { AppImage },
  mixins: [imageSource],
  methods: {
    errorImage (e, img) {
      this.serverImageSource(img, null, e, this.SERVER_IMAGE_PRODUCT)
    },
    componentProductImage (images, onError) {
      return this.serverImageSource(
        images,
        'tiny',
        onError,
        this.SERVER_IMAGE_PRODUCT
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  padding-bottom: 11px;
  .wrap {
    display: flex;
  }
  &--right {
    margin-bottom: 6px;
  }
  .image {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    max-width: 40px;
    height: 40px;
    margin-right: 16px;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .name {
    font: 500 12px/17px $montserrat-font;
    margin-bottom: 16px;
    padding-right: 16px;
  }
  .price {
    font: 500 16px/17px $montserrat-font;
  }
}

.caption {
  display: none;
}

.header.manual {
  width: 100%;
  padding-bottom: 0;
  border: none;
  .header--right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .name {
      max-width: 176px;
    }
  }
}

@media (max-width: 648px) {
  .header.manual {
    .caption {
      display: block;
      font: 10px $montserrat-font;
      color: $main-grey;
    }
    .price {
      display: none;
    }
  }
}
</style>
