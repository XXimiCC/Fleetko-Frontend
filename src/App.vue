<template>
  <div
    class="container-fluid"
    itemscope
    itemtype="http://schema.org/Organization"
  >
    <meta itemprop="name" :content="organization.name" />
    <meta itemprop="url" :content="organization.url" />
    <meta itemprop="faxNumber" :content="organization.faxNumber" />
    <router-view></router-view>
    <add-to-cart v-if="addToCartModal"></add-to-cart>
    <live-search v-if="liveSearchModal"></live-search>
    <email-confirm-success v-if="emailConfirmModal"></email-confirm-success>
    <main-modal
      class="main-modal"
      :modalInner="'SignIn'"
      v-if="loginModal"
      @close="toggleLoginModal(false)"
    ></main-modal>
    <app-to-top v-if="$mq === 'xl'"></app-to-top>
  </div>
</template>

<script>
import utils from '@/mixins/utils'
import { mapActions, mapGetters } from 'vuex'
import AddToCart from '@/components/modals/AddToCart'
import LiveSearch from '@/components/modals/LiveSearch'
import EmailConfirmSuccess from '@/components/modals/EmailConfirm'
import MainModal from '@/components/modals/MainModal'
import organizationData from './organization-data'
import { driftChat } from '@/mixins/driftChat'
import appToTop from '../src/components/parts/AppToTop'
import { Validator } from 'vee-validate'
import { dictionary } from './dictionary'
import Vue from 'vue'
import { GoogleApi } from '@/mixins/GoogleApi'

Validator.localize(dictionary)

export default {
  name: 'App',
  mixins: [utils, driftChat, GoogleApi],
  watch: {
    hasToken (v) {
      if (v) this.initTokenHeader()
    },
    isAuth (v) {
      if (!v) this.$store.dispatch('toggleEmailConfirmModal', false)
    },
    $route (to, from) {
      this.setCanonicalLink()

      if (this.responsiveSidebar) {
        this.$store.dispatch('toggleResponsiveSidebar', {
          isOpen: false,
          isOpenUser: false
        })

        this.scrollingModalOpen(false)
      }
    }
  },
  methods: {
    ...mapActions([
      'initTokenHeader',
      'setTotalCounters',
      'initAjaxErrorHandling'
    ]),

    localStorageSubscriber () {
      Vue.ls.on('cart', () => this.$store.dispatch('fetchCartFromStorage'))
      Vue.ls.on('waitList', () => this.$store.dispatch('fetchListFromStorage'))
    },
    checkTokenFromCookie () {
      this.initTokenHeader()
    },

    toggleLoginModal (open) {
      this.$store.dispatch('toggleLoginModal', {
        open: open,
        authGuard: false
      })
    },
    setCanonicalLink () {
      document
        .querySelector("link[rel='canonical']")
        .setAttribute('href', window.location.href)
    }
  },
  computed: {
    ...mapGetters([
      'getUserCart',
      'addToCartModal',
      'hasToken',
      'liveSearchModal',
      'loginModal',
      'responsiveSidebar',
      'emailConfirmModal',
      'isAuth'
    ]),
    organization () {
      return organizationData
    }
  },
  components: {
    AddToCart,
    LiveSearch,
    MainModal,
    appToTop,
    EmailConfirmSuccess
  },
  created () {
    this.setCanonicalLink()
    this.checkTokenFromCookie()
    this.availableKeysArray()
    this.$store.dispatch('fetchSections')
    this.$store.dispatch('fetchSearch')
    this.$store.dispatch('setTotalCounters')
    this.$store.dispatch('fetchCartFromStorage')
    this.$store.dispatch('fetchListFromStorage')
    this.initAjaxErrorHandling()
    this.initTokenHeader()
    this.localStorageSubscriber()
  },
  mounted () {
    // TODO delete mixin
    this.hiddingNavbarFunction()
    this.initDtift()
    this.initGoogleTagScript()
  }
}
</script>
<style lang="scss">
@import 'scss/style';
.container-fluid {
  height: 100%;
}
</style>
