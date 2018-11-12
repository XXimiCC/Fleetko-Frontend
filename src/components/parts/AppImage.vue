<template>
  <transition name="fade">
    <img
      v-show="imageLoaded || forceLoading"
      :src="imagePath"
      @error="errorImage"
      alt=""
      @load="imageLoading"
    />
  </transition>
</template>

<script>
export default {
  name: 'app-image',
  data () {
    return {
      imageLoaded: false
    }
  },
  props: ['imagePath', 'imageObject', 'forceLoading'],
  methods: {
    imageLoading () {
      this.imageLoaded = true
    },
    errorImage (error) {
      this.$emit('emitErrorImage', error, this.imageObject)
    }
  }
}
</script>
