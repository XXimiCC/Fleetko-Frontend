<template>
  <div class="section-dropdown" @mouseleave="$emit('hideDropdownSection')">
    <div class="section-dropdown__wrap">
      <transition-group mode="out-in"
                        name="list"
                        tag="div"
                        class="section-dropdown__body">

        <router-link v-for="(category, i) in checkLenghtCategories(sectionProp.categories)"
                     :key="i"
                     class="section-dropdown__body--category"
                     :to="{ name: 'catalog', params: { slug: category.slug } }">
          <div class="image-wrap">
            <img :src="componentCategoryImage(category.image)"
                 @error="errorSrc($event, category)"
                 alt="dropdown-category" />
          </div>
          <div class="info">
            <p class="paragraph-prime">{{ category.name }}</p>
          </div>
        </router-link>

        <div class="section-dropdown__body--category view-all"
             v-if="sectionProp.categories.length >= 20">
          View All
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'

export default {
  name: 'SectionDropdown',
  mixins: [utils, imageSource],
  props: ['sectionProp'],
  methods: {
    errorSrc (e, category) {
      this.serverImageSource(category.image, null, e, this.SERVER_IMAGE_CATEGORY)
    },
    componentCategoryImage (images, onError) {
      return this.serverImageSource(images, 'tiny', onError, this.SERVER_IMAGE_CATEGORY)
    },
    checkLenghtCategories (section) {
      return section.length >= 20 ? section.slice(0, 19) : section
    }
  }
}
</script>
<style lang="scss" scoped>
.section-dropdown {
  position: absolute;
  left: 0;
  top: 13px;
  width: 100%;
  z-index: 100;
  &__wrap {
    padding-top: 23px;
  }
  &__body {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    padding: 32px;
    height: auto;
    max-height: 368px;
    transition: all 0.5s;
    background: white;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    box-shadow: 0 10px 14.1px 0.9px rgba(0, 0, 0, 0.14),
      0 4px 19.6px 0.4px rgba(0, 0, 0, 0.06);
    &--category {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      width: 264px;
      cursor: pointer;
      &:hover {
        background: #f5f8ff;
        .paragraph-prime {
          color: $main-color;
        }
      }
      a {
        display: flex;
        align-items: center;
      }
      .paragraph-prime {
        font-family: $montserrat-font;
        color: $main-dark;
      }
      .image-wrap {
        margin-right: 8px;
        width: 64px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}

.list-enter {
  opacity: 0;
  height: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(30px);
}
</style>
