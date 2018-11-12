<template>
  <router-link
    tag="a"
    :to="{ path: `/section/${section.id}`, params: { section: section } }"
    class="col-md-4 col-xl-3 style-menu padding-none"
  >
    <div
      class="menu-items"
      :style="{ 'background-image': `url(${randomImage()})` }"
    >
      <div class="triangle-topleft">
        <h3 class="text-h3">{{ section.name }}</h3>
        <span class="text-show">show all ></span>
      </div>
    </div>
  </router-link>
</template>

<script>
import utils from '@/mixins/utils'

export default {
  name: 'sectionItem',
  props: ['section'],
  mixins: [utils],
  methods: {
    randomImage () {
      let arr = [
        'section-1',
        'section-2',
        'section-3',
        'section-4',
        'section-5',
        'section-6',
        'section-7',
        'section-8'
      ]
      let item = arr[Math.floor(Math.random() * arr.length)]
      return this.imageSrc(`sections/${item}.png`)
    }
  }
}
</script>

<style lang="scss" scoped>
.style-menu {
}
img {
  max-width: 256px;
}
.menu-items {
  width: 256px;
  height: 160px;
  border-radius: 4px;
  background-size: 100%;
  transition: all 0.3s;
  h3 {
    transition: all 0.3s;
  }

  &:hover {
    margin-top: -4px;
    box-shadow: 0px 10px 14.1px 0.9px rgba(0, 0, 0, 0.14),
      0px 4px 19.6px 0.4px rgba(0, 0, 0, 0.06);
    h3 {
      margin-top: -4px;
    }
    .text-show {
      bottom: 36px;
    }
  }
  img {
  }
}
.text-show {
  transition: all 0.3s;
}
</style>
