<template>
  <router-link :to="{ name: 'home' }">
    <div class="dealer">
      <router-link :to="{ name: 'dealer', params: { slug: result.slug } }">
        <div class="dealer__image-wrap">
          <app-image
            itemprop="image"
            :imageObject="result.image"
            :imagePath="componentDealerImage(result.image)"
            @emitErrorImage="errorImage"
          >
          </app-image>
        </div>
      </router-link>
    </div>
  </router-link>
</template>

<script>
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'
import AppImage from '../../parts/AppImage'

export default {
  name: 'result-dealers',
  props: ['result'],
  components: {
    AppImage
  },
  mixins: [utils, imageSource],
  methods: {
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_DEALER)
    },
    componentDealerImage (images, onError) {
      let sizeProperty = ['xl', 'lg', 'md'].includes(this.$mq)
        ? 'small'
        : 'tiny'

      return this.serverImageSource(
        images,
        sizeProperty,
        onError,
        this.SERVER_IMAGE_DEALER
      )
    }
  }
}
</script>

<style scoped lang="scss">
.dealer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;

  &__image-wrap {
    display: flex;
    align-items: center;
    height: 44px;

    img {
      margin: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }

  &:hover {
    cursor: pointer;
    box-shadow: 0 2px 7px 0 rgba(6, 26, 70, 0.17);
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .dealer {
    width: 136px;
    height: 48px;

    a {
      display: flex;
      justify-content: center;
    }

    &__image-wrap {
      justify-content: center;
      width: 90%;
    }
  }
}
</style>
