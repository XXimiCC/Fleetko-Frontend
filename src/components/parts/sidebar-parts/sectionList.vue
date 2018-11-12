<template>
  <div class="item">
    <div class="item__header" @click="openSection = !openSection">
      <div class="item__title">
        <span>{{ section.name }}</span>
      </div>
      <div class="item__toggle" :class="{ 'item__toggle--open': openSection }">
        <svg-chevron></svg-chevron>
      </div>
    </div>

    <div v-if="openSection" class="item__body">
      <router-link
        :to="{ name: 'catalog', params: { slug: category.slug } }"
        v-if="openSection"
        v-for="category in section.categories"
        :key="category.id"
        class="item__link"
      >
        <div class="item__img">
          <app-image
            :imageObject="category.image"
            :imagePath="componentImage(category.image)"
            @emitErrorImage="errorImage"
          >
          </app-image>
        </div>
        <div class="item__category">{{ category.name }}</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import AppImage from '../../parts/AppImage'
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'

export default {
  name: 'section-list',
  data () {
    return {
      openSection: false,
      openCategory: false
    }
  },
  props: ['section'],
  mixins: [utils, imageSource],
  methods: {
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_CATEGORY)
    },
    componentImage (image, onError) {
      return this.serverImageSource(
        image,
        'tiny',
        onError,
        this.SERVER_IMAGE_SECTION
      )
    }
  },
  components: {
    AppImage
  }
}
</script>

<style scoped lang="scss">
.item {
  display: flex;
  margin: 0 -16px;
  flex-flow: column nowrap;

  &__header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 12px 24px 12px 32px;
    transition: background-color 0.2s;
    cursor: pointer;
    &:hover {
      background-color: $light-grey;
    }
    &:hover .item__title {
      color: $main-dark;
    }
  }

  &__title {
    font: 500 14px/24px $montserrat-font;
    color: $dark-grey;
    transition: color 0.2s;
  }

  &__toggle {
    width: 16px;
    svg {
      fill: $main-grey;
      transition: 0.2s;
    }
    &--open svg {
      transform: rotate(180deg);
    }
  }

  &__link {
    display: flex;
    padding: 12px 4px 12px 48px;
    cursor: pointer;
    &:hover .item__category {
      color: $main-dark;
      text-decoration: underline;
    }
  }

  &__img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 24px;
    margin-right: 8px;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  &__category {
    max-width: 171px;
    font: 12px/24px $montserrat-font;
    color: $main-dark;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s;
  }
}
</style>
