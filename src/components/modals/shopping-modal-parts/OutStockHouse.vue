<template>
  <div class="house">
    <div class="house__state">{{ house.state }}</div>
    <div class="house__city">{{ house.city }}</div>
  </div>
</template>

<script>
export default {
  name: 'OutStockHouse',
  props: ['house']
}
</script>

<style lang="scss" scoped>
.house {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid #b4bac7;
  border-radius: 4px;
  background-color: $light-grey;
  font: 500 10px/17px $montserrat-font;
  & + & {
    margin-top: 4px;
  }

  &__state {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    margin-right: 8px;
    border-radius: 2px;
    background-color: $grey;
    color: #5c6578;
  }

  &__city {
    color: #b4bac7;
  }
}
</style>
