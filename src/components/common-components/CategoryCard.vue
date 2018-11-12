<template>
  <div class="category-card">
    <div class="category-card__content">
      <div class="category-card__image">
        <app-image
          :imageObject="category.image"
          :imagePath="componentCategoryImage(category.image)"
          @emitErrorImage="errorImage"
        >
        </app-image>
      </div>
      <div class="category-card__info">
        <router-link
          :to="{ name: 'catalog', params: { slug: category.slug } }"
          class="category-card--name"
        >
          {{ category.name }}
        </router-link>
        <p :style="{ 'max-width': textMaxWidth }">{{ category.caption }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import AppImage from '../parts/AppImage'
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'

export default {
  data () {
    return {
      imageLoaded: false,
      allow: true
    }
  },
  components: {
    AppImage
  },
  name: 'Category-card',
  props: ['picture', 'category', 'counter', 'textMaxWidth'],
  mixins: [utils, imageSource],
  methods: {
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_CATEGORY)
    },
    componentCategoryImage (images, onError) {
      let sizeProperty =
        ['xl', 'lg', 'md'].includes(this.$mq) &&
        this.$route.name !== 'searchResult'
          ? 'medium'
          : 'small'

      return this.serverImageSource(
        images,
        sizeProperty,
        onError,
        this.SERVER_IMAGE_CATEGORY
      )
    }
  }
}
</script>

<style lang="scss" scoped="">
.category-card {
  position: relative;
  padding-top: 100%;
  width: 100%;
  &__content {
    padding: 8px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  &:hover {
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 4.75px 0.25px rgba(102, 102, 102, 0.2);
    .category-card--name {
      color: $main-color;
    }
  }
  &__image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 66.5%;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  &--name {
    display: inline-block;
    margin-bottom: 0;
    font: 500 16px/22px $montserrat-font;
    color: $main-dark;
    cursor: pointer;
  }
  &__info {
    margin-top: 10%;
    height: 23.5%;
    text-align: center;
    p {
      max-width: 90%;
      margin: 6px auto 0 auto;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font: 14px/19px $sours-sans-p-font;
      color: $main-grey;
      text-align: center;
    }
  }
}

@media (max-width: $sm) {
  .category-card {
    &__info {
      p {
        display: none;
      }
    }
  }
}

@media (max-width: 540px) {
  .category-card {
    &--name {
      font-size: 12px;
      line-height: 17px;
    }
    &__info {
      margin-top: 5%;
      p {
        display: none;
      }
    }
  }
}
</style>
