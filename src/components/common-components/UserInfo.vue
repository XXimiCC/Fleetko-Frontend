<template>
  <div class="drop"><section-user :everOpen="true"></section-user></div>
</template>

<script>
import sectionUser from '../parts/sidebar-parts/sectionUser'

export default {
  name: 'user-info',
  components: {
    sectionUser
  },
  data () {
    return {
      openAccount: true
    }
  }
}
</script>

<style scoped lang="scss">
.drop {
  position: relative;
  top: 8px;
  box-shadow: 0 8px 10px rgba(6, 26, 70, 0.1), 0 0 1px rgba(6, 26, 70, 0.1);
  background-color: #fff;
  border-radius: 4px;
  &:before {
    content: '';
    display: block;
    width: calc(100% - 6px);
    position: absolute;
    left: 3px;
    height: 1px;
    background-color: $main-color;
  }

  & /deep/ .user {
    width: 288px;
    padding: 16px 16px 0 16px;
    border-top: none;
    &__header {
      cursor: default;
      padding: 16px 0 0 16px;
    }
  }
}
</style>
