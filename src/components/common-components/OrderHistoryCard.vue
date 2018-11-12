<template>
  <router-link :to="{ name: link }" tag="div" class="col-12">
    <div class=" pt-4 border-card row">
      <div class="col-2 p-0 pl-3 pr-3">
        <img class="main_img" :src="imageSrc(picture)" />
      </div>
      <div class="col-7 ">
        <h4 class="name h4-secondary">{{ nameItem }}</h4>
        <p class="description">{{ ItemDescription }}</p>
        <p class="color-price">
          Price:<span>{{ price }}</span>
        </p>
        <p class="color-price">
          Amount:<span>{{ counts }}</span>
        </p>
        <p class="color-price">
          Authorized Dealer <img class="pl-3" :src="imageSrc(logopicture)" />
        </p>
      </div>
      <div class="col-3 pt-3">
        <p class="prise-item text-right">{{ price }}</p>
      </div>
    </div>
  </router-link>
</template>

<script>
import utils from '@/mixins/utils'

export default {
  name: 'OrderHistoryCard',
  props: [
    'link',
    'nameItem',
    'ItemDescription',
    'logopicture',
    'counts',
    'picture',
    'price'
  ],
  mixins: [utils]
}
</script>

<style lang="scss" scoped="">
* {
  color: black;
}
.main_img {
  width: 100%;
}
.name {
  font-size: 18px;
  font-family: $montserrat-font;
  font-weight: bold;
}
.description {
  font-size: $normal-fs-paragraph;
  font-family: $sours-sans-p-font;
}
.color-price {
  color: $caption-text-color;
  font-family: $sours-sans-p-font;
  font-size: $normal-fs-paragraph;
  span {
    font-size: $p-big-fs;
    color: $main-color;
  }
}
.prise-item {
  font-size: $p-big-fs;
  font-family: $montserrat-font;
}
.border-card {
  border-top: 1px solid $border-color;
}
</style>
