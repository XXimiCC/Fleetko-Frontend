<template>
  <transition name="fade">
    <div class="tab-fit">
      <h3 class="tab-fit--title">Coming to</h3>
      <div class="row">
        <div v-for="vehicle in mergedFit" class="tab-fit--make col-md-6">
          <div class="border-hint">
            <div
              class="tab-fit--make--image"
              :style="{
                'background-image': `url(${componentBannerImage(
                  vehicle.banner_image
                )}), url(${componentBannerImage(vehicle.banner_image)})`
              }"
            ></div>
            <div class="tab-fit--make--info">
              <h2 class="h2-secondary">{{ vehicle.vehicle_brand_name }}</h2>
              <h4>{{ vehicle.name }}</h4>
              <div class="years">{{ returnYear(vehicle) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import imageSource from '@/mixins/imagesSource'
import utils from '@/mixins/utils'

export default {
  name: 'tab-fit',
  data () {
    return {
      mergedFit: []
    }
  },
  mixins: [utils, imageSource],
  props: ['product'],
  methods: {
    componentBannerImage (images, onError) {
      let sizeProperty = ''

      if (this.$mq === 'xl' || this.$mq === 'lg' || this.$mq === 'md') {
        sizeProperty = 'medium'
      } else {
        sizeProperty = 'small'
      }

      return this.serverImageSource(
        images,
        sizeProperty,
        onError,
        this.SERVER_IMAGE_BANNERS
      )
    },
    mergeVehicleFit () {
      this.mergedFit = this.product.vehicle_models
    },
    returnYear (vehicle) {
      if (vehicle.years.length > 1) {
        return `${vehicle.years[0]} - ${
          vehicle.years[vehicle.years.length - 1]
        }`
      } else {
        return vehicle.years[0]
      }
    }
  },
  created () {
    this.mergeVehicleFit()
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */
 {
  opacity: 0;
}

.tab-fit {
  margin-top: 32px;
  &--title {
    margin-bottom: 16px;
    color: $main-dark;
  }
  &--make {
    margin-bottom: 32px;
    border-radius: 4px;
    .border-hint {
      border-radius: 4px;
      overflow: hidden;
    }
    &--image {
      height: 160px;
      background-size: cover;
      background-position: center;
    }
    &--info {
      position: relative;
      padding: 32px 0 25px 32px;
      background: #edf2fc;
      h2 {
        font-size: 24px;
        margin-bottom: 24px;
        line-height: 1;
      }
      h4 {
        margin-bottom: 0;
        line-height: 1;
      }
      .years {
        position: absolute;
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 32px;
        right: 0;
        bottom: 44px;
        font-family: $montserrat-font;
        font-size: 16px;
        font-weight: 500;
        color: white;
        background: $main-color;
        border-radius: 4px 0 0 4px;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $md) {
  .tab-fit {
    &--make {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .tab-fit {
    &--title {
      display: none;
    }
    &--make {
      margin-bottom: 16px;
      &--image {
        height: 120px;
      }
      &--info {
        padding: 32px 0 32px 16px;
        h2 {
          margin-bottom: 16px;
          font-size: 20px;
        }
        h4 {
          font-size: 12px;
        }
        .years {
          bottom: 37px;
          font-size: 12px;
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: 480px) {
  .tab-fit {
    &--make {
      &--info {
        h2 {
          max-width: 70%;
        }
      }
    }
  }
}
</style>
