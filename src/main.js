import Vue from 'vue'
import App from './App'
import router from './router/router'
import store from './store/store'
import config from './config'

import $ from 'jquery'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import VueScrollTo from 'vue-scrollto'
import VueMq from 'vue-mq'

import '../src/scss/style.scss'

import toastrOptions from './mixins/toastrOptions'
import converterUnit from './mixins/converterUnit'
import VueLocalStorage from 'vue-ls'

import InstantSearch from 'vue-instantsearch'
import { EventBus } from './event-bus'

let options = {
  namespace: 'vuejs__'
}

Vue.use(VueLocalStorage, options)

require('./facebook-init')
require('./constants')
require('./global-components')

Vue.mixin(toastrOptions)
Vue.mixin(converterUnit)

Vue.use(VueAwesomeSwiper)
Vue.use(VueScrollTo)
Vue.use(InstantSearch)
Vue.use(VueMq, {
  breakpoints: {
    xs: 320,
    sm: 648,
    md: 960,
    lg: 1120,
    xl: Infinity
  }
})
Vue.component('icon', Icon)

Vue.config.productionTip = false

$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
  options.url = config.serverUrl + options.url
  options.dataType = originalOptions.dataType !== undefined ? originalOptions.dataType : 'json'
  options.contentType = originalOptions.contentType !== undefined ? originalOptions.contentType : 'application/json'
  options.crossDomaint = {
    crossDomain: true
  }
})

/*
Проверка для роутера, если юзер не авторизирован то запретить переходить на роуты которые приватные
 */
router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some((route) => route.meta.auth)
  const authorized = store.state.user.token

  if (authRequired && !authorized) {
    store.dispatch('toggleLoginModal', {
      open: true,
      authGuard: true,
      emailVerification: from.name === 'emailVerification' && from.query.email ? from.query.email : null
    })

    EventBus.$on('successLogin', login => {
      next()
    })
    EventBus.$on('loginFailure', login => {
      next('/')
    })
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

