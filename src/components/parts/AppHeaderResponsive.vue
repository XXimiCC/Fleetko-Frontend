<template>
  <div class="header-wrap">
    <transition name="fade">
      <header-notification
        v-if="getSystemNotification.message"
      ></header-notification>
    </transition>

    <div class="header-resp">
      <div class="header-resp__item">
        <div class="header-resp--burger" @click="toggleSidebar(true)">
          <div class="burger-line"></div>
          <div class="burger-line"></div>
          <div class="burger-line"></div>
        </div>

        <div class="header-resp--logo">
          <router-link :to="{ name: 'home' }">
            <img class="logo-img" src="~@/assets/logo.png" />
          </router-link>
        </div>
      </div>

      <div class="header-resp__item">
        <div class="header-resp--search" @click="openSearchModal">
          <svg-search></svg-search>
        </div>
        <router-link :to="{ name: 'cartPage' }">
          <div class="header-resp--cart">
            <svg-basket></svg-basket>
            <div v-if="getTotalQuantityCart" class="header-resp--cart--counter">
              {{ getTotalQuantityCart }}
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <div v-if="responsiveSidebar.isOpen" class="sidebar--overlay"></div>

    <div class="sidebar-wrap">
      <transition name="slide">
        <app-sidebar
          v-if="responsiveSidebar.isOpen"
          @closeSidebar="toggleSidebar(false)"
        >
        </app-sidebar>
      </transition>
    </div>
  </div>
</template>

<script>
import AppSidebar from './AppSidebar'
import utils from '@/mixins/utils'
import { mapGetters } from 'vuex'
import HeaderNotification from '../notifications/HeaderNotification'

export default {
  name: 'app-header-responsive',
  mixins: [utils],
  methods: {
    toggleSidebar (open) {
      this.$store.dispatch('toggleResponsiveSidebar', {
        isOpen: open,
        isOpenUser: false
      })

      this.scrollingModalOpen(open)
    },
    openSearchModal () {
      this.$store.dispatch('toggleSearchModal', true)
    }
  },
  computed: {
    ...mapGetters([
      'responsiveSidebar',
      'loginModal',
      'getTotalQuantityCart',
      'getSystemNotification'
    ])
  },
  components: {
    AppSidebar,
    HeaderNotification
  },
  beforeDestroy () {
    this.scrollingModalOpen(false)
  }
}
</script>

<style scoped lang="scss">
.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}

.slide-enter {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

.sidebar {
  &--overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.35);
    z-index: 1000;
  }
}

.sidebar-wrap {
  position: relative;
}

.header-wrap {
  width: 100%;
}

.header-resp {
  width: 100%;
  padding: 12px 16px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 0px 9.5px 0.5px rgba(102, 102, 102, 0.2);
  &__item {
    display: flex;
    align-items: center;
  }
  &--burger {
    margin-right: 16px;
    cursor: pointer;
    .burger-line {
      width: 18px;
      height: 2px;
      background: $main-dark;
    }
    .burger-line + .burger-line {
      margin-top: 3px;
    }
  }
  &--logo {
    img {
      cursor: pointer;
      height: 30px;
      width: 125px;
    }
  }
  &--search {
    margin-right: 16px;
    display: flex;
    svg {
      fill: $main-dark;
    }
  }
  &--cart {
    display: flex;
    position: relative;
    svg {
      fill: $main-dark;
    }
    &--counter {
      position: absolute;
      top: -8px;
      right: -7px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 18px;
      width: 18px;
      background: $main-color;
      border-radius: 2px;
      font-family: $sours-sans-p-font;
      font-size: 12px;
      line-height: 1;
      color: white;
    }
  }
}
</style>
