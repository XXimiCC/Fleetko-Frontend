<template>
  <div class="sidebar" v-on-clickaway="() => $emit('closeSidebar')">
    <div class="sidebar__body">
      <div class="header">
        <a href="tel: +13605677873" class="header__link" tag="div">
          <svg-phone class="header__icon"></svg-phone>
          <span class="header__phone">(360) 567-7873</span>
        </a>

        <div class="header__close" @click="() => $emit('closeSidebar')">
          <svg-close></svg-close>
        </div>
      </div>

      <div v-if="1" class="sections">
        <section-list
          :section="section"
          v-for="section in getSections"
          :key="section.id"
        >
        </section-list>
      </div>

      <section-user class="account"></section-user>
    </div>
  </div>
</template>

<script>
import sectionUser from './sidebar-parts/sectionUser'
import sectionList from './sidebar-parts/sectionList'
import { mixin as clickaway } from 'vue-clickaway'
import utils from '@/mixins/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'app-sidebar',
  mixins: [clickaway, utils],
  computed: {
    ...mapGetters(['getSections', 'responsiveSidebar'])
  },
  mounted () {
    this.openAccount = this.responsiveSidebar.isOpenUser
  },
  components: {
    sectionUser,
    sectionList
  }
}
</script>

<style scoped lang="scss">
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 3000;
  overflow-y: auto;
  background-color: #fff;

  svg {
    fill: $main-grey;
    transition: 0.2s;
  }

  &__body {
    min-width: 288px;
    max-width: 288px;
    padding: 4px 16px 0 16px;
  }
}

.header {
  display: flex;
  border-bottom: 1px solid $light-grey;
  &__link {
    display: flex;
    align-items: center;
    width: 200px;
    padding: 0 16px 4px 16px;
    &:hover svg {
      fill: $main-color;
    }
  }
  &__icon {
    width: 24px;
    margin-right: 16px;
  }
  &__phone {
    font: 500 16px $montserrat-font;
    color: $main-dark;
  }
  &__close {
    display: flex;
    align-items: center;
    margin-left: auto;
    cursor: pointer;
    &:hover svg {
      fill: $dark-grey;
    }
  }
}

.sections {
  padding: 11px 0;
}
</style>
