import Vue from 'vue'
import Vuex from 'vuex'
import $ from 'jquery'
import {
  WAIT_LIST_FETCH_REQUEST,
  WAIT_LIST_FETCH_SUCCESS,
  WAIT_LIST_FETCH_ERROR,
  WAIT_LIST_CREATE_PRODUCT_REQUEST,
  WAIT_LIST_CREATE_PRODUCT_SUCCESS,
  WAIT_LIST_CREATE_PRODUCT_ERROR,
  WAIT_LIST_UPDATE_FROM_STORAGE,
  WAIT_LIST_DELETE_PRODUCT_REQUEST,
  WAIT_LIST_DELETE_PRODUCT_SUCCESS,
  WAIT_LIST_DELETE_PRODUCT_ERROR,
  WAIT_LIST_CLEAR,
  WAIT_LIST_SET_TEMPORARY_PRODUCT
} from '../mutations'

Vue.use(Vuex)

const state = {
  list: null,
  temporaryProductId: null
}

const getters = {
  userWaitList (state) {
    return state.list
  },
  waitListTempProduct (state) {
    return state.temporaryProductId
  }
}

const actions = {
  setTemporaryProductId ({commit}, productId) {
    commit(WAIT_LIST_SET_TEMPORARY_PRODUCT, productId)
  },
  setListStorage ({commit, state, dispatch}, cart) {
    Vue.ls.set('waitList', state)
  },

  clearWaitList ({commit}) {
    commit(WAIT_LIST_CLEAR)
  },

  fetchListFromStorage ({commit}) {
    let waitList = Vue.ls.get('waitList')

    if (waitList) {
      commit(WAIT_LIST_UPDATE_FROM_STORAGE, waitList)
    }
  },
  fetchWaitList ({commit, dispatch}) {
    commit(WAIT_LIST_FETCH_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `/api/waitlisted_products`
      }).then(
        (resp) => {
          commit(WAIT_LIST_FETCH_SUCCESS, resp.data)
          dispatch('setListStorage')
          resolve(resp)
        },
        (err) => {
          commit(WAIT_LIST_FETCH_ERROR)
          reject(err)
        }
      )
    })
  },
  createWaitListedProduct ({state, commit, dispatch}, productId) {
    if (!state.list.some(product => product.id === productId)) {
      commit(WAIT_LIST_CREATE_PRODUCT_REQUEST)

      return new Promise((resolve, reject) => {
        $.ajax({
          method: 'POST',
          url: `/api/waitlisted_products`,
          data: JSON.stringify({
            'product_id': productId
          })
        }).then(
          (resp) => {
            commit(WAIT_LIST_CREATE_PRODUCT_SUCCESS, resp.data)
            dispatch('fetchWaitList')
            resolve(resp)
          },
          (err) => {
            commit(WAIT_LIST_CREATE_PRODUCT_ERROR)
            reject(err)
          }
        )
      })
    }
  },
  deleteWaitListedProduct ({commit, dispatch}, productId) {
    commit(WAIT_LIST_DELETE_PRODUCT_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'DELETE',
        url: `/api/waitlisted_products/${productId}`
      }).then(
        (resp) => {
          commit(WAIT_LIST_DELETE_PRODUCT_REQUEST, resp.data)
          resolve(resp)
        },
        (err) => {
          commit(WAIT_LIST_DELETE_PRODUCT_ERROR)
          reject(err)
        }
      )
    })
  }
}

const mutations = {
  [WAIT_LIST_SET_TEMPORARY_PRODUCT] (state, payload) {
    state.temporaryProductId = payload
  },
  [WAIT_LIST_FETCH_REQUEST] (state) {
    state.loading = true
  },
  [WAIT_LIST_FETCH_SUCCESS] (state, payload) {
    state.loading = false
    state.list = payload
  },
  [WAIT_LIST_FETCH_ERROR] (state) {
    state.loading = false
  },
  [WAIT_LIST_CREATE_PRODUCT_REQUEST] (state) {
    state.loading = false
  },
  [WAIT_LIST_CREATE_PRODUCT_SUCCESS] (state) {
    state.loading = false
  },
  [WAIT_LIST_CREATE_PRODUCT_ERROR] (state) {
    state.loading = false
  },
  [WAIT_LIST_UPDATE_FROM_STORAGE] (state, payload) {
    Vue.set(state, 'list', payload.list)
  },
  [WAIT_LIST_DELETE_PRODUCT_REQUEST] (state) {
    state.loading = false
  },
  [WAIT_LIST_DELETE_PRODUCT_SUCCESS] (state) {
    state.loading = false
  },
  [WAIT_LIST_DELETE_PRODUCT_ERROR] (state) {
    state.loading = false
  },
  [WAIT_LIST_CLEAR] (state) {
    state.list = null
    Vue.ls.remove('waitList')
  }
}

const modules = {}

export default {
  state,
  actions,
  mutations,
  getters,
  modules
}
