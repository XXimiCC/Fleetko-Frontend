<template>
  <div class="main-slider">
    <div class="main-slider--wrapper" :class="{ 'no-pattern': !getVehicle.banner_image}" :style="getBg()"></div>
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
    },
    getBg () {
      const banner = this.getVehicle.banner_image

      return banner
        ? `background-image: url(${this.componentBannerImage(banner)}), url(${banner.versions.original});` : ''
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
    background-color: #f5f5f5;
    background-size: cover;
    background-repeat: no-repeat;
    height: 544px;
    background-position: center;
    overflow: hidden;
    &:before { @include bgPattern() }
    .swiper-container {
      height: 544px;
    }
    &.no-pattern {
      &:before { display: none }}
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
