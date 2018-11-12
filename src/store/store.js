import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import createMutationsSharer from 'vuex-shared-mutations'
import * as Cookies from 'js-cookie'
import user from './modules/user'
import cart from './modules/cart'
import products from './modules/products'
import search from './modules/search'
import waitList from './modules/waitList'
import {
  CREATE_SYSTEM_NOTIFICATION,
  DELETE_SYSTEM_NOTIFICATION,
  USER_TOGGLE_LOGIN_MODAL,
  USER_TOGGLE_RESPONSIVE_SIDEBAR,
  TOGGLE_BACK_TO_TOP_VISIBILITY,
  USER_TOGGLE_EMAIL_CONFIRM_MODAL,
  USER_TOGGLE_UPDATE_REVIEW_MODAL,
  USER_TOGGLE_CHANGE_EMAIL_MODAL
} from './mutations'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'
const debug = true

const state = {
  appName: 'Fleetko',
  systemNotification: {},
  loginModalOpen: false,
  changeEmailModalOpen: false,
  emailVerification: null,
  updateReviewModal: {
    open: false,
    reviewId: null,
    review: null,
    productId: null
  },
  emailConfirmModalOpen: false,
  authGuardModalOpen: false,
  responsiveSidebar: {
    isOpen: false,
    isOpenUser: false
  },
  backToTopVisible: false
}

const getters = {
  authGuardModal (state) {
    return state.authGuardModalOpen
  },
  loginModal (state) {
    return state.loginModalOpen
  },
  changeEmailModalOpen (state) {
    return state.changeEmailModalOpen
  },
  updateReviewModal (state) {
    return state.updateReviewModal
  },
  emailConfirmModal (state) {
    return state.emailConfirmModalOpen
  },
  responsiveSidebar (state) {
    return state.responsiveSidebar
  },
  isAuth (state) {
    return state.user.model !== null
  },
  getSystemNotification (state) {
    return state.systemNotification
  },
  // TODO delete mutation
  backToTopVisible (state) {
    return state.backToTopVisible
  },
  tempEmailVerification (state) {
    return state.emailVerification
  }
}

const actions = {
  toggleResponsiveSidebar ({commit}, {isOpen, isOpenUser}) {
    commit(USER_TOGGLE_RESPONSIVE_SIDEBAR, {isOpen, isOpenUser})
  },
  toggleEmailConfirmModal ({commit}, open) {
    commit(USER_TOGGLE_EMAIL_CONFIRM_MODAL, open)
  },
  toggleChangeEmailModal ({commit}, open) {
    commit(USER_TOGGLE_CHANGE_EMAIL_MODAL, open)
  },
  toggleLoginModal ({commit, dispatch}, {open, authGuard, emailVerification}) {
    commit(USER_TOGGLE_LOGIN_MODAL, {open, authGuard, emailVerification})
  },
  toggleUpdateReviewModal ({commit, dispatch}, {open, reviewId, review, productId}) {
    commit(USER_TOGGLE_UPDATE_REVIEW_MODAL, {open, reviewId, review, productId})
  },
  createSystemNotification ({commit}, notify) {
    commit(CREATE_SYSTEM_NOTIFICATION, notify)
  },
  deleteSystemNotification ({commit}) {
    commit(DELETE_SYSTEM_NOTIFICATION)
  },
  changeBackToTopVisibility ({commit}, visibility) {
    commit(TOGGLE_BACK_TO_TOP_VISIBILITY, visibility)
  }
}

const mutations = {
  [USER_TOGGLE_RESPONSIVE_SIDEBAR] (state, payload) {
    state.responsiveSidebar.isOpen = payload.isOpen
    state.responsiveSidebar.isOpenUser = payload.isOpenUser
  },
  [USER_TOGGLE_LOGIN_MODAL] (state, payload) {
    state.authGuardModalOpen = payload.authGuard
    state.loginModalOpen = payload.open
    payload.emailVerification ? state.emailVerification = payload.emailVerification : state.emailVerification = null
  },
  [CREATE_SYSTEM_NOTIFICATION] (state, payload) {
    state.systemNotification = payload
  },
  [DELETE_SYSTEM_NOTIFICATION] (state, payload) {
    state.systemNotification = {}
  },
  [TOGGLE_BACK_TO_TOP_VISIBILITY] (state, payload) {
    state.backToTopVisible = payload
  },
  [USER_TOGGLE_EMAIL_CONFIRM_MODAL] (state, payload) {
    state.emailConfirmModalOpen = payload
  },
  [USER_TOGGLE_UPDATE_REVIEW_MODAL] (state, payload) {
    if (payload.open) {
      state.updateReviewModal = {
        open: payload.open,
        reviewId: payload.reviewId,
        review: payload.review,
        productId: payload.productId
      }
    } else {
      state.updateReviewModal = {
        open: false,
        reviewId: null,
        review: null,
        productId: null
      }
    }
  },
  [USER_TOGGLE_CHANGE_EMAIL_MODAL] (state, payload) {
    state.changeEmailModalOpen = payload
  }
}

const modules = {
  user,
  products,
  search,
  cart,
  waitList
}

export default new Vuex.Store({
  strict: debug,
  state,
  actions,
  mutations,
  getters,
  modules,
  plugins: [
    createMutationsSharer({
      predicate: [
        'USER_LOGOUT',
        'USER_LOGIN_SUCCESS',
        'USER_GET_AUTH_SUCCESS',
        'CART_GET_SERVER_SUCCESS'
      ] }),
    createPersistedState({
      paths: ['user'],
      getState: (key) => Cookies.getJSON(key),
      setState: (key, state) => {
        // eslint-disable-next-line
        let {loading, ...model} = state.user

        state.user = model

        Cookies.set(key, state, {expires: 3})
      }
    })
  ]
})
