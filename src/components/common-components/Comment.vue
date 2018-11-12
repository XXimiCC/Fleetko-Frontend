<template>
  <div class="row">
    <div class="col-12">
      <div class="comment-cart pb-4">
        <p class="mb-2">
          <svg
            v-for="n in 5"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            class="mr-1"
            viewBox="0 0 53.867 53.867"
          >
            <path
              :fill="comment.rate >= n ? '#EFCE4A' : '#989898'"
              d="M26.934 1.318l8.322 16.864 18.61 2.705L40.4 34.013l3.18 18.536-16.646-8.752-16.646 8.75 3.18-18.535L0 20.887l18.61-2.705"
            />
          </svg>
        </p>
        <p class="name mb-1">{{ comment.authorsName }}</p>
        <p class="data mb-3">{{ comment.date }}</p>
        <p class="emoji mb-2">{{ comment.title }}</p>
        <p class="comment-text">{{ comment.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'comment',
  props: ['comment']
}
</script>

<style lang="scss" scoped="">
.name {
  font-size: $p-big-fs;
  color: $main-color;
  font-family: $montserrat-font;
  font-weight: 600;
}
.data {
  font-size: $normal-fs-paragraph;
  font-family: $sours-sans-p-font;
  color: $caption-text-color;
}
.emoji {
  font-size: $p-big-fs;
  font-family: $montserrat-font;
  font-weight: 600;
}
.comment-text {
  font-size: $p-big-fs;
  font-family: $sours-sans-p-font;
  color: $caption-text-color;
}
</style>
