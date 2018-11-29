<template>
  <div class="user" :class="{ 'user--open': openAccount }">
    <button v-if="!isAuth" class="user__sign" @click="openLoginModal">Sign In</button>

    <div v-if="isAuth" @click="openAccount = !openAccount" class="user__header">
      <div class="user__avatar">
        <img :src="userImageSrc(userInfo, 100)" alt="avatar" />
      </div>
      <div class="user__info">
        <div class="user__name">{{ fullName(userInfo) }}</div>
        <div class="user__mail">{{ userInfo.email }}</div>
      </div>
      <div v-if="!everOpen"
           class="user__toggle"
           :class="{ 'user__toggle--open': openAccount }">
        <svg-chevron></svg-chevron>
      </div>
    </div>

    <div v-if="openAccount || everOpen" class="user__links">
      <router-link class="user__link" :to="{ name: 'orderHistory' }" tag="div">
        <svg-history class="user__icon"></svg-history>
        <span>Order History</span>
        <svg-chevron class="user__chevron"></svg-chevron>
      </router-link>

      <router-link class="user__link" :to="{ name: 'addressBook' }" tag="div">
        <svg-address class="user__icon"></svg-address>
        <span>Address Book</span>
        <svg-chevron class="user__chevron"></svg-chevron>
      </router-link>

      <router-link class="user__link" :to="{ name: 'settings' }" tag="div">
        <svg-settings class="user__icon"></svg-settings>
        <span>Account Settings</span>
        <svg-chevron class="user__chevron"></svg-chevron>
      </router-link>

      <router-link class="user__link" :to="{ name: 'waitList' }" tag="div">
        <svg-wishlist class="user__icon"></svg-wishlist>
        <span>Wait List</span>
        <svg-chevron class="user__chevron"></svg-chevron>
      </router-link>

      <router-link class="user__link" :to="{ name: 'purchases' }" tag="div">
        <svg-purchased-circle class="user__icon"></svg-purchased-circle>
        <span>Purchased Goods</span>
        <svg-chevron class="user__chevron"></svg-chevron>
      </router-link>

      <router-link class="user__link" :to="{ name: 'viewed' }" tag="div">
        <svg-eye-show class="user__icon"></svg-eye-show>
        <span>Viewed Goods</span>
        <svg-chevron class="user__chevron"></svg-chevron>
      </router-link>

      <router-link class="user__link" :to="{ name: 'billing' }" tag="div">
        <svg-billing-icon class="user__icon"></svg-billing-icon>
        <span>Billing</span>
        <svg-chevron class="user__chevron"></svg-chevron>
      </router-link>

      <div v-if="openAccount || everOpen"
           @click="logout"
           class="user__link user__out">
        <svg-log-out class="user__icon"></svg-log-out>
        <span>Sign out</span>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/mixins/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'section-user',
  mixins: [utils],
  props: ['everOpen'],
  data () {
    return {
      openAccount: false
    }
  },
  created () {
    this.openAccount = this.responsiveSidebar.isOpenUser
  },
  computed: {
    ...mapGetters(['isAuth', 'userInfo', 'responsiveSidebar'])
  },
  methods: {
    openLoginModal () {
      this.$store.dispatch('toggleResponsiveSidebar', {
        isOpen: false,
        isOpenUser: false
      })

      this.$store.dispatch('toggleLoginModal', {
        open: true,
        authGuard: false
      })
    },
    logout () {
      this.$store.dispatch('toggleResponsiveSidebar', {
        isOpen: false,
        isOpenUser: false
      })
      this.scrollingModalOpen(false)

      if (this.$route.name === 'home') {
        this.$store.dispatch('logout')
      } else {
        this.$router.push({ name: 'home' })
        this.$store.dispatch('logout')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.user {
  padding: 16px 0 16px 0;
  border-top: 1px solid $light-grey;
  border-bottom: 1px solid $light-grey;
  &--open {
    border-bottom: none;
  }

  &__header {
    display: flex;
    cursor: pointer;
  }

  &__info {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    margin-right: 16px;
    img {
      max-height: 100%;
      max-width: 100%;
      border-radius: 100%;
    }
  }

  &__name,
  &__mail {
    max-width: 165px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__name {
    font: 500 16px/22px $montserrat-font;
    color: $main-dark;
  }

  &__mail {
    font: 12px/16px $sours-sans-p-font;
    color: $main-grey;
  }

  &__toggle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 26px;
    margin-left: auto;
    &:hover svg {
      fill: $dark-grey;
    }
    svg {
      width: 24px;
      fill: $main-grey;
      transition: transform 0.2s, fill 0.2s;
    }
    &--open svg {
      transform: rotate(180deg);
    }
  }

  &__links {
    padding-top: 24px;
    margin: 0 -16px;
  }

  &__link {
    display: flex;
    align-items: center;
    padding: 8px 16px 8px 32px;
    transition: background-color 0.3s;
    cursor: pointer;
    &:hover {
      background-color: rgba(20, 88, 235, 0.1);
    }
    &:hover .user__icon {
      fill: $main-color;
    }
    span {
      font: 12px/16px $montserrat-font;
      color: $main-dark;
    }
  }

  &__icon {
    width: 20px;
    margin-right: 18px;
    fill: $dark-grey;
    transition: fill 0.2s;
  }

  &__chevron {
    width: 16px;
    margin-left: auto;
    fill: $main-grey;
    transform: rotate(-90deg);
  }

  &__out {
    position: relative;
    margin-top: 8px;
    padding: 16px 16px 16px 32px;
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 16px;
      width: calc(100% - 32px);
      height: 1px;
      background-color: $light-grey;
    }
  }

  &__sign {
    width: 100%;
    padding: 12px;
    border-radius: 4px;
    background-color: $success;
    font: 500 12px/16px $montserrat-font;
    text-transform: uppercase;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s;
    &,
    &:focus,
    &:hover,
    &:active {
      outline: none;
      border: none;
      box-shadow: none;
    }
    &:hover {
      background-color: #0cc087;
    }
  }
}
</style>
