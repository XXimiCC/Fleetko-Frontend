<template>
  <router-link tag="a" :to="{ path: `/section/${sectionItem.slug}` }">
    <div class="section">
      <div class="section__wrap">
        <div class="section--info">
          <h4 class="h4-secondary">{{ sectionItem.name }}</h4>
        </div>
        <div
          class="section--image"
          :style="{ 'background-image': `url(${randomProductImage()})` }"
        ></div>
      </div>
    </div>
  </router-link>
</template>

<script>
import utils from '../../mixins/utils'
export default {
  name: 'section-item',
  data () {
    return {}
  },
  props: ['sectionItem'],
  mixins: [utils]
}
</script>

<style scoped lang="scss">
.section {
  display: flex;
  &__wrap {
    position: relative;
    width: 256px;
    height: 184px;
    border-radius: 4px;
    background-color: white;
  }
  &--info {
    position: absolute;
    top: 24px;
    left: 24px;
    h4 {
      margin-bottom: 0;
    }
  }
  &--image {
    width: 256px;
    height: 184px;
    border-radius: 4px;
    background-repeat: no-repeat;
    background-position: 95px 64px;
    background-size: 70%;
  }
}

@media (max-width: $lg) {
  .section {
    &__wrap {
      width: 220px;
      height: 160px;
    }
    &--image {
      width: 220px;
      height: 160px;
    }
  }
}

@media (min-width: $lg) {
}

@media (min-width: $md) and (max-width: $lg) {
}

@media (min-width: $sm) and (max-width: $md) {
  .section {
    &__wrap {
      width: 100%;
    }
    &--image {
      width: 100%;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .section {
    &__wrap {
      width: 192px;
      height: 128px;
    }
    &--image {
      width: 192px;
      height: 128px;
    }
  }
}
</style>
