<template>
  <div class="main-slider">
    <div
      class="main-slider--wrapper"
      v-if="getVehicle.banner_image"
      :style="{
        'background-image': `url(${componentBannerImage(
          getVehicle.banner_image
        )}), url(${getVehicle.banner_image.versions.original})`
      }"
    ></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import imageSource from '@/mixins/imagesSource'

export default {
  name: 'vehiclePageSlider',
  mixins: [imageSource],
  methods: {
    componentBannerImage (images, onError) {
      let size = 'big'

      if (this.$mq === 'md') size = 'medium'
      if (this.$mq === 'sm') size = 'small'

      return this.serverImageSource(images, size, onError, this.SERVER_IMAGE_BANNERS
      )
    }
  },
  computed: {
    ...mapGetters(['getVehicle'])
  }
}
</script>

<style lang="scss" scoped>
@import "~@/scss/mixins";

.main-slider {
  position: relative;
  &--wrapper {
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    height: 544px;
    background-position: center;
    overflow: hidden;
    &:before { @include bgPattern() }
    .swiper-container {
      height: 544px;
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .main-slider {
    &--wrapper {
      height: 300px;
    }
    .swiper-container {
      height: 300px;
    }
  }
}
@media (min-width: $xs) and (max-width: $sm) {
  .main-slider {
    &--wrapper {
      height: 250px;
    }
    .swiper-container {
      height: 250px;
    }
  }
}
</style>
