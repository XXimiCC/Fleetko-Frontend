<template>
  <div class="header">
    <transition name="fade">
      <header-notification
        v-if="getSystemNotification.message"
      ></header-notification>
    </transition>
    <div class="col-xl-12 border-bottom">
      <div class="container scoped-response scoped-response-support ">
        <div class="header__top">
          <div class="item"><span>800.505.3274</span></div>
          <div class="item">
            <span>Shipping and payment</span> <span>Sell</span>
            <span>Support</span> <span>Help Center</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="container header__main scoped-response padding-header style-mobile"
      :class="{ 'header__main__sections-open': dropdownShow }"
    >
      <div class="flex-item">
        <div class="header__main--logo">
          <router-link :to="{ name: 'home' }">
            <img itemprop="logo" class="logo-img" src="~@/assets/logo.svg" />
          </router-link>
        </div>
        <div class="header__main--search">
          <div class="input-wrap">
            <input
              @click="openSearchModal"
              id="search-input"
              @input="$event.target.value = ''"
              class="input-default"
              placeholder="Find Products, Categories, Dealers and more..."
            />
            <div class="header__main--search--icon">
              <svg-search></svg-search>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-item">
        <div class="header__main--controls">
          <div
            class="hover-wrap"
            @mouseenter="showInfo = true"
            @mouseleave="showInfo = false"
          >
            <button
              :class="{
                'login-hover': isAuth && showInfo,
                'guest-hover': !isAuth && showInfo
              }"
              @click="loginAction"
              class="login-button"
            >
              <span>{{ checkButtonStatus() }}</span>
              <img
                v-if="isAuth"
                :src="userImageSrc(userInfo, 64)"
                alt="user-avatar"
              />
              <svg-user v-if="!isAuth"></svg-user>
              <i
                v-if="isAuth"
                :class="{ rotate: showInfo }"
                class="fa fa-angle-down"
                aria-hidden="true"
              ></i>
            </button>
            <div class="info-wrap" v-if="showInfo && isAuth">
              <user-info @logout="logout"></user-info>
            </div>
          </div>
          <div
            class="cart-wrap"
            @mouseenter="showBasket = true"
            @mouseleave="showBasket = false"
          >
            <button
              :class="{ 'cart-hover': showBasket }"
              class="cart-wrap--button"
              @click="goToCart"
            >
              <span>$ {{ toDollarDecimal(getTotalPriceCart) }}</span>
              <svg-basket></svg-basket>
              <div class="cart-wrap--button__counter">
                {{ getTotalQuantityCart }}
              </div>
            </button>
            <dropdown-shopping-cart v-if="showBasket"></dropdown-shopping-cart>
          </div>
        </div>
      </div>
      <div class="header__bottom" @mouseleave="hideSectionDropdown">
        <div
          @mouseenter="openSectionDropdown(section)"
          v-for="section in getSections"
          :class="{
            'section-hover': dropdownShow && dropdownSection.id === section.id
          }"
          class="header__bottom--section"
        >
          <router-link :to="{ path: `/section/${section.slug}` }">
            <span>{{ section.name }}</span>
          </router-link>
        </div>
        <transition name="bounce">
          <section-dropdown
            v-if="dropdownShow"
            :sectionProp="dropdownSection"
          ></section-dropdown>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import userInfo from '../common-components/UserInfo'
import DropdownShoppingCart from '../common-components/DropdownShoppingCart'
import HeaderNotification from '../notifications/HeaderNotification'
import _ from 'lodash'
import Vuebar from 'vuebar'
import { mapGetters } from 'vuex'
import MainModal from '@/components/modals/MainModal'
import Vue from 'vue'
import utils from '@/mixins/utils'
import SectionDropdown from './SectionDropdown.vue'

Vue.use(Vuebar)

export default {
  name: 'app-header',
  data () {
    return {
      name: '',
      names: [],
      dropdownSelected: 'All Departments',
      dropdownShow: false,
      showSearchOptions: false,
      dropdownSection: [],
      showBasket: false,
      showInfo: false,
      buttonName: 'Sign In'
    }
  },
  mixins: [utils],
  watch: {
    $route (to, from) {
      this.showBasket = false
      this.dropdownShow = false
      this.showInfo = false
    },
    isAuth (Vuebar) {
      this.checkButtonStatus()
    }
  },
  computed: {
    ...mapGetters([
      'isAuth',
      'userInfo',
      'getUserCart',
      'getTotalPriceCart',
      'getTotalQuantityCart',
      'getTotalAmountCart',
      'loginModal',
      'getSections',
      'getSystemNotification'
    ])
  },
  methods: {
    openSearchModal () {
      this.$store.dispatch('toggleSearchModal', true)
    },
    hideSectionDropdown () {
      this.dropdownShow = false
    },
    openSectionDropdown (section) {
      this.dropdownShow = true
      this.dropdownSection = _.find(
        this.getSections,
        stateSection => stateSection.id === section.id
      )
    },
    goToCart () {
      if (this.getTotalAmountCart > 0) {
        this.$router.push({ name: 'cartPage' })
        this.showBasket = false
      }
    },
    toggleLoginModal (open) {
      this.$store.dispatch('toggleLoginModal', {
        open: open,
        authGuard: false
      })
    },
    loginAction () {
      if (this.isAuth) {
        this.$router.push({ name: 'orderHistory' })
      } else {
        this.$store.dispatch('toggleLoginModal', {
          open: true,
          authGuard: false
        })
      }
    },
    checkButtonStatus () {
      if (!this.isAuth) {
        return 'Sign In'
      } else {
        return this.fullName(this.userInfo).length > 13
          ? this.fullName(this.userInfo).slice(0, 12) + '...'
          : this.fullName(this.userInfo)
      }
    },
    logout () {
      /*
        if we dont use if statement logout will not work in callback
        at homepage
         */
      if (this.$route.name === 'home') {
        this.$store.dispatch('logout')
      } else {
        this.$router.push({ name: 'home' })
        this.$store.dispatch('logout')
      }
    },
    deleteCartItem (product) {
      this.$store.dispatch('deleteUserCartItem', product)
    }
  },
  components: {
    DropdownShoppingCart,
    SectionDropdown,
    MainModal,
    HeaderNotification,
    userInfo
  },
  created () {
    this.checkButtonStatus()
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
.relative {
  position: relative;
}

.inline {
  display: inline-block;
  line-height: 1;
}

.header {
  width: 100%;
  -webkit-transform: translateZ(0);
  box-shadow: 0px 0px 9.5px 0.5px rgba(102, 102, 102, 0.2);
  transition: transform 0.5s;
  background: white;
  z-index: 600;
  &.transition {
    /*transition: transform 0.5s;*/
  }
  &.scrollup {
    /*transform: translateY(-157px)*/
  }
}

.support-phone,
.support-button {
  color: $caption-text-color;
  font-size: $small-fs-paragraph;
  font-family: $sours-sans-p-font;
  padding-top: 6px;
  padding-bottom: 6px;
  float: left;
}

.support-button {
  float: right;
  img {
    padding-right: 8px;
  }
}

.search-btn {
  width: 45%;
  border-radius: 0px 5px 5px 0px;
}

.user-name {
  text-transform: none;
}

.hover-wrap {
  width: 186px;
  position: relative;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  .login-button {
    position: relative;
    height: 40px;
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 15px;
      font-family: $montserrat-font;
      color: $main-dark;
      font-size: 12px;
      font-weight: 500;
    }
    svg {
      width: 28px;
      height: 28px;
      fill: $main-dark;
    }
    img {
      width: 28px;
      height: 28px;
      border-radius: 100%;
    }
    i {
      margin-left: 7px;
      transition: all 0.3s ease;
    }
    .rotate {
      transform: rotate(180deg);
    }
    &.login-hover {
      &:before {
        position: absolute;
        content: '';
        width: 0;
        bottom: -4px;
        left: calc(50% - 8px);
        height: 0;
        border-style: solid;
        border-width: 5px 3.5px 0 3.5px;
        transition: all 0.4s;
        border-color: $main-color transparent transparent transparent;
      }
      &:after {
        position: absolute;
        content: '';
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        transition: width 0.3s;
        background: $main-color;
      }
    }
    &.guest-hover {
      span {
        color: $main-color;
      }
      svg {
        fill: $main-color;
      }
    }
  }
}

.cart-wrap {
  margin-left: 32px;
  width: 150px;
  display: flex;
  justify-content: flex-end;
  position: relative;
  z-index: 900;
  &--button {
    position: relative;
    height: 40px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 200;
    svg {
      width: 28px;
      height: 28px;
      fill: $main-dark;
    }
    span {
      max-width: 70px;
      margin-right: 16px;
      font-family: $montserrat-font;
      color: $main-dark;
      font-size: 12px;
      font-weight: 500;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &__counter {
      position: absolute;
      top: -4px;
      right: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 20px;
      width: 20px;
      background: $main-color;
      border-radius: 2px;
      font-family: $sours-sans-p-font;
      font-size: 12px;
      line-height: 1;
      color: white;
      span {
      }
    }
  }
  .cart-hover {
    position: relative;
    &:before {
      position: absolute;
      content: '';
      width: 0;
      bottom: -4px;
      left: calc(50% - 8px);
      height: 0;
      border-style: solid;
      border-width: 5px 3.5px 0 3.5px;
      transition: all 0.4s;
      border-color: $main-color transparent transparent transparent;
    }
    &:after {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      transition: width 0.3s;
      background: $main-color;
    }
  }
}

.info-wrap {
  position: absolute;
  top: 38px;
  right: 0;
  z-index: 9999;
}

.header {
  &__top {
    display: flex;
    height: 31px;
    align-items: center;
    justify-content: space-between;
    .item {
      display: inline-flex;
      span {
        font-family: $sours-sans-p-font;
        color: #74858e;
        font-size: 12px;
        cursor: pointer;
      }
      span + span {
        margin-left: 31px;
      }
    }
  }
  &__main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 16px 0 16px;
    flex-wrap: wrap;
    .flex-item {
      display: flex;
      align-items: center;
    }
    &__sections-open {
      position: relative;
      &:after {
        position: absolute;
        content: '';
        bottom: -1px;
        left: 16px;
        right: 16px;
        height: 2px;
        width: calc(100% - 32px);
        background: $main-color;
      }
    }
    &--logo {
      margin-right: 66px;
      img {
        cursor: pointer;
        height: 30px;
        width: 125px;
      }
    }
    &--search {
      display: flex;
      .input-wrap {
        display: flex;
        position: relative;
      }
      input {
        padding: 16px;
        width: 490px;
        height: 40px;
        border-radius: 4px 0px 0px 4px;
      }
      button {
        display: flex;
        align-items: center;
        padding: 0 15px;
        width: 145px;
        height: 40px;
        background: transparent;
        border-bottom: 1px solid #dddde9;
        border-right: 1px solid #dddde9;
        border-top: 1px solid #dddde9;
        border-left: none;
        cursor: pointer;
        span {
          font-family: $sours-sans-p-font;
          color: $main-dark;
          font-size: 14px;
        }
        i {
          transition: all 0.3s ease;
          margin-left: 8px;
        }
        .rotate {
          transform: rotate(180deg);
        }
      }
      &--icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        border-radius: 0 4px 4px 0;
        background: $main-gradient;
        svg {
          width: 20px;
          fill: white;
        }
      }
    }
    &--controls {
      display: flex;
      align-items: center;
      .fix-hover {
        position: absolute;
        width: 100%;
        height: 15px;
        opacity: 0;
        left: 0;
      }

      .logged {
        background: white;
        box-shadow: 0 0 12px rgba(21, 101, 192, 0.15);
        color: #5e92f3 !important;
        svg {
          fill: #5e92f3;
        }
        i {
          margin-left: 15px;
          font-size: 20px;
        }
      }
    }
  }
  &__bottom {
    position: relative;
    padding: 0 16px;
    display: flex;
    align-items: center;
    margin-top: 32px;
    flex: 0 0 100%;
    line-height: 1;
    &--section {
      padding-bottom: 13px;
      position: relative;
      cursor: pointer;
      z-index: 200;
      &:hover {
      }
      span {
        font-family: $montserrat-font;
        color: $main-dark;
        font-size: 12px;
        text-transform: capitalize;
      }
    }
    .section-hover {
      &:before {
        position: absolute;
        content: '';
        width: 0;
        bottom: -6px;
        left: calc(50% - 4px);
        height: 0;
        border-style: solid;
        border-width: 5px 3.5px 0 3.5px;
        transition: all 0.4s;
        border-color: $main-color transparent transparent transparent;
      }
      span {
        color: $main-color;
      }
    }
    .header__bottom--section + .header__bottom--section {
      margin-left: 46px;
    }
  }
}

@media (max-width: $xl) {
  .header {
    &__top {
    }
    &__main {
      &--logo {
        margin-right: 55px;
      }
      &--controls {
        .hover-wrap {
          width: 160px;
        }
        .cart-wrap {
          margin-left: 16px;
        }
      }
      &--search {
        .input-wrap {
        }
        input {
          padding: 16px;
          width: 400px;
        }
      }
    }
  }
}

@media (max-width: $lg) {
  .header {
    &__top {
    }
    &__main {
      &--logo {
        margin-right: 55px;
      }
      &--controls {
        .hover-wrap {
          width: 160px;
        }
        .cart-wrap {
          margin-left: 16px;
        }
      }
      &--search {
        .input-wrap {
        }
        input {
          padding: 16px;
          width: 257px;
        }
      }
    }
  }
}

@media (min-width: $lg) {
}

@media (min-width: $md) and (max-width: $lg) {
}

@media (min-width: $sm) and (max-width: $md) {
}

@media (min-width: $xs) and (max-width: $sm) {
}
</style>
