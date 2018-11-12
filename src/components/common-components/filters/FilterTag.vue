<template>
  <div class="tag">
    <span>{{ tag.filterName }}: {{ tag.optionName }}</span>
    <svg-close @click.native="deleteTag(tag)"></svg-close>
  </div>
</template>

<script>
export default {
  name: 'filter-tag',
  props: ['tag'],
  methods: {
    deleteTag () {
      this.$emit('deleteTag', this.tag)
    }
  }
}
</script>

<style scoped lang="scss">
.tag {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  margin-right: 8px;
  padding: 0 7px;
  height: 24px;
  background-color: #447fff;
  border-radius: 4px;
  span {
    font: 12px/16px $sours-sans-p-font;
    color: white;
  }
  svg {
    cursor: pointer;
    margin-left: 15px;
    width: 15px;
    fill: white;
  }
}
</style>
