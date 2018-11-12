import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import $ from 'jquery'
import {
  CART_CREATE_REQUEST,
  CART_CREATE_WAREHOUSE,
  CART_UPDATE_REQUEST,
  CART_UPDATE_SUCCESS,
  CART_SET_TOTAL_PRICE,
  CART_SET_TOTAL_QUANTITY,
  CART_SET_TOTAL_AMOUNT,
  CART_SET_COUNTERS,
  CART_DELETE_ITEM,
  CART_DELETE_WAREHOUSE_REQUEST,
  CART_DELETE_WAREHOUSE_SUCESS,
  CART_DELETE_WAREHOUSE_ERROR,
  CART_DELETE_ALL_REQUEST,
  CART_DELETE_ALL_SUCESS,
  CART_DELETE_ALL_ERROR,
  CART_CREATE_ITEM,
  CART_DELETE_LOCAL,
  CART_GET_SERVER_REQUEST,
  CART_GET_SERVER_SUCCESS,
  CART_GET_SERVER_ERROR,
  CART_VALIDATION_REQUEST,
  CART_VALIDATION_SUCCESS,
  CART_VALIDATION_ERROR,
  CART_UPDATE_FROM_STORAGE,
  CART_UPDATE_AVAILABLE_QUANTITY_SUCCESS
} from '../mutations'

Vue.use(Vuex)
const state = {
  productID: null,
  cart: {},
  totalPrice: null,
  totalQuantity: null,
  totalAmount: null,
  maxSize: 20,
  loading: false
}

const getters = {
  getUserCart (state) {
    return state
  },
  getCartItems (state) {
    return state.cart
  },
  getTotalPriceCart (state) {
    return state.totalPrice
  },
  getTotalQuantityCart (state) {
    return state.totalQuantity
  },
  getTotalAmountCart (state) {
    return state.totalAmount
  },
  loading (state) {
    return state.loading
  }
}

const actions = {
  setCartStorage ({commit, state, dispatch}, cart) {
    Vue.ls.set('cart', state)
  },
  fetchCartFromStorage ({commit}) {
    let cart = Vue.ls.get('cart')

    if (cart) {
      commit(CART_UPDATE_FROM_STORAGE, cart)
    }
  },
  updateCartItem ({commit, dispatch, rootGetters, state}, {cartItem}) {
    if (rootGetters.isAuth) {
      return new Promise((resolve, reject) => {
        $.ajax({
          method: 'PATCH',
          url: `/api/cart_items/${state.cart[cartItem.warehouseId].products[cartItem.productId].itemId}`,
          data: JSON.stringify({
            'quantity': cartItem.quantity
          })
        }).then(
          (resp) => {
            commit(CART_UPDATE_SUCCESS, cartItem)

            dispatch('setTotalCounters')

            resolve(resp)
          },
          (err) => {
            reject(err)
          }
        )
      })
    } else {
      commit(CART_UPDATE_SUCCESS, cartItem)
    }
  },
  createCartItem ({commit, dispatch, rootGetters, state}, {cartItem, mutationConst}) {
    if (rootGetters.isAuth) {
      return new Promise((resolve, reject) => {
        $.ajax({
          method: 'POST',
          url: `/api/cart_items`,
          data: JSON.stringify({
            'product_id': cartItem.productId,
            'warehouse_id': cartItem.warehouseId,
            'quantity': cartItem.quantity
          })
        }).then(
          (resp) => {
            commit(mutationConst, {
              cartItem: cartItem,
              id: resp.data.id
            })

            dispatch('setTotalCounters')

            resolve(resp)
          },
          (err) => {
            reject(err)
          }
        )
      })
    } else {
      commit(mutationConst, {
        cartItem: cartItem,
        id: false
      })
    }
  },
  addProductToCart ({commit, dispatch, state, rootGetters}, cartItem) {
    commit(CART_CREATE_REQUEST, cartItem)

    let warehouseExists = state.cart[cartItem.warehouseId]
    let warehouseHasSameProduct = warehouseExists
                                  ? state.cart[cartItem.warehouseId].products[cartItem.productId]
                                  : false

    if (rootGetters.isAuth) {
      return new Promise((resolve, reject) => {
        if (warehouseHasSameProduct) {
          dispatch('updateCartItem', {cartItem})
        } else if (warehouseExists) {
          dispatch('createCartItem', {cartItem, mutationConst: CART_CREATE_ITEM})
        } else {
          dispatch('createCartItem', {cartItem, mutationConst: CART_CREATE_WAREHOUSE})
        }

        resolve(true)
      })
    } else {
      return new Promise((resolve, reject) => {
        if (warehouseExists && warehouseHasSameProduct) {
          dispatch('updateCartItem', {cartItem})
        } else if (warehouseExists && !warehouseHasSameProduct && state.maxSize !== state.totalAmount) {
          dispatch('createCartItem', {cartItem, mutationConst: CART_CREATE_ITEM})
        } else if (!warehouseExists && !warehouseHasSameProduct && state.maxSize !== state.totalAmount) {
          dispatch('createCartItem', {cartItem, mutationConst: CART_CREATE_WAREHOUSE})
        }

        dispatch('setTotalCounters')
        resolve(true)
      })
    }
  },
  deleteUserCartItem ({commit, state, rootGetters, dispatch}, cartItem) {
    if (rootGetters.isAuth) {
      $.ajax({
        method: 'DELETE',
        url: `/api/cart_items/${cartItem.itemId}`
      }).then(
        (resp) => {
          commit(CART_DELETE_ITEM, cartItem)

          dispatch('setTotalCounters')
          dispatch('setCartStorage')
        },
        (err) => {
          console.log(err)
        }
      )
    } else {
      commit(CART_DELETE_ITEM, cartItem)

      dispatch('setTotalCounters')
      dispatch('setCartStorage')
    }
  },

  deleteWarehouseFromCart ({commit, state, rootGetters, dispatch}, warehouseId) {
    if (rootGetters.isAuth) {
      commit(CART_DELETE_WAREHOUSE_REQUEST)

      $.ajax({
        method: 'DELETE',
        url: `/api/cart_warehouses/${warehouseId}`
      }).then(
        (resp) => {
          commit(CART_DELETE_WAREHOUSE_SUCESS, warehouseId)

          dispatch('setTotalCounters')
          dispatch('setCartStorage')
        },
        (err) => {
          commit(CART_DELETE_WAREHOUSE_ERROR, err)
        }
      )
    } else {
      commit(CART_DELETE_WAREHOUSE_SUCESS, warehouseId)
      dispatch('setTotalCounters')
      dispatch('setCartStorage')
    }
  },
  deleteWholeCart ({commit, state, rootGetters, dispatch}) {
    if (rootGetters.isAuth) {
      commit(CART_DELETE_ALL_REQUEST)

      $.ajax({
        method: 'DELETE',
        url: `/api/cart_items`
      }).then(
        (resp) => {
          commit(CART_DELETE_ALL_SUCESS)
          dispatch('setTotalCounters')
          dispatch('setCartStorage')
        },
        (err) => {
          commit(CART_DELETE_ALL_ERROR, err)
        }
      )
    } else {
      commit(CART_DELETE_ALL_SUCESS)
      dispatch('setTotalCounters')
      dispatch('setCartStorage')
    }
  },
  updateQuantityCartItem ({commit, dispatch, state, rootState}, cartItem) {
    return new Promise((resolve, reject) => {
      commit(CART_UPDATE_SUCCESS, cartItem)

      dispatch('setTotalCounters')

      resolve(true)
    })
  },
  setTotalCounters ({commit, dispatch, state}) {
    let counts = 0
    let quantity = 0
    let price = 0

    if (!_.isEmpty(state.cart)) {
      _.forEach(state.cart, function (value, product) {
        counts = counts + _.size(value.products)
        _.forEach(state.cart[product].products, function (value, key) {
          price = price + value.quantity * value.price
          quantity = quantity + value.quantity
        })
      })

      commit(CART_SET_COUNTERS, {counts, quantity, price})

      dispatch('setCartStorage')
    } else {
      commit(CART_SET_COUNTERS, {counts, quantity, price})
    }
  },
  mergeServerCart ({commit, state, dispatch}) {
    if (_.isEmpty(state.cart)) {
      return new Promise((resolve, reject) => {
        dispatch('getServerCart').then((resp) => {
          resolve(true)
          dispatch('setTotalCounters')
        }, (err) => {
          reject(err)
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        commit(CART_GET_SERVER_REQUEST)

        let cart_items = []

        _.forEach(state.cart, function (value, product) {
          _.forEach(state.cart[product].products, function (value, key) {
            cart_items.push({
              product_id: value.productId,
              warehouse_id: value.warehouseId,
              quantity: value.quantity
            })
          })
        })

        $.ajax({
          method: 'PATCH',
          url: '/api/cart_items',
          data: JSON.stringify({
            'cart_items': cart_items
          })
        }).then(
          (resp) => {
            resolve(resp)
            commit(CART_GET_SERVER_SUCCESS, resp.data)
            dispatch('setTotalCounters')
          },
          (err) => {
            reject(err)
            commit(CART_GET_SERVER_ERROR)
          }
        )
      })
    }
  },
  getServerCart ({state, commit, dispatch}, updateCartQuantity) {
    let mutationConst = updateCartQuantity ? CART_UPDATE_AVAILABLE_QUANTITY_SUCCESS : CART_GET_SERVER_SUCCESS

    commit(CART_GET_SERVER_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: '/api/cart_items',
        data: {
          include: 'warehouse'
        }
      }).then(
        (resp) => {
          commit(mutationConst, resp.data)
          dispatch('setTotalCounters')
          resolve(resp)
        },
        (err) => {
          commit(CART_GET_SERVER_ERROR, err)
          reject(err)
        }
      )
    })
  },
  deleteLocalCart ({state, commit, dispatch}) {
    commit(CART_DELETE_LOCAL)

    dispatch('setTotalCounters')
  },
  validateUserCart ({state, commit}) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: '/api/cart/validation'
      }).then(
        (resp) => {
          resolve(resp)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }
}

const mutations = {
  [CART_UPDATE_FROM_STORAGE] (state, payload) {
    Vue.set(state, 'cart', payload.cart)
    Vue.set(state, 'totalPrice', payload.totalPrice)
    Vue.set(state, 'totalAmount', payload.totalAmount)
    Vue.set(state, 'totalQuantity', payload.totalQuantity)
  },
  [CART_VALIDATION_REQUEST] (state, payload) {
    state.loading = true
  },
  [CART_VALIDATION_SUCCESS] (state, payload) {
    state.loading = false
  },
  [CART_VALIDATION_ERROR] (state, payload) {
    state.loading = false
  },
  [CART_CREATE_REQUEST] (state, payload) {
    state.loading = true
  },
  [CART_CREATE_WAREHOUSE] (state, payload) {
    let warehouse = state.cart[payload.cartItem.warehouseId] = {}

    warehouse.city = payload.cartItem.city
    warehouse.products = {}
    warehouse.products[payload.cartItem.productId] = payload.cartItem

    if (payload.id) warehouse.products[payload.cartItem.productId].itemId = payload.id

    state.loading = false
  },
  [CART_CREATE_ITEM] (state, payload) {
    if (payload.id) {
      state.cart[payload.cartItem.warehouseId].products[payload.cartItem.productId] = payload.cartItem
      state.cart[payload.cartItem.warehouseId].products[payload.cartItem.productId].itemId = payload.id
    } else {
      state.cart[payload.cartItem.warehouseId].products[payload.cartItem.productId] = payload.cartItem
    }

    state.loading = false
  },
  [CART_UPDATE_REQUEST] (state, payload) {
    state.loading = true
  },
  [CART_UPDATE_SUCCESS] (state, payload) {
    state.cart[payload.warehouseId].products[payload.productId].quantity = payload.quantity
    state.loading = false
  },
  [CART_SET_COUNTERS] (state, payload) {
    state.totalPrice = payload.price
    state.totalAmount = payload.counts
    state.totalQuantity = payload.quantity
  },
  [CART_SET_TOTAL_PRICE] (state, payload) {
    state.totalPrice = payload
  },
  [CART_SET_TOTAL_AMOUNT] (state, payload) {
    state.totalAmount = payload
  },
  [CART_SET_TOTAL_QUANTITY] (state, payload) {
    state.totalQuantity = payload
  },
  [CART_DELETE_ITEM] (state, payload) {
    Vue.delete(state.cart[payload.warehouseId].products, payload.productId)

    if (_.isEmpty(state.cart[payload.warehouseId].products)) {
      Vue.delete(state.cart, payload.warehouseId)
    }
  },
  [CART_DELETE_ALL_REQUEST] (state, payload) {
    state.loading = true
  },
  [CART_DELETE_ALL_SUCESS] (state, payload) {
    state.loading = false
    state.cart = {}
  },
  [CART_DELETE_ALL_ERROR] (state, payload) {
    state.loading = false
  },
  [CART_DELETE_WAREHOUSE_SUCESS] (state, payload) {
    Vue.delete(state.cart, payload)
    state.loading = false
  },
  [CART_DELETE_WAREHOUSE_REQUEST] (state, payload) {
    state.loading = true
  },
  [CART_DELETE_WAREHOUSE_ERROR] (state, payload) {
    state.loading = false
  },
  [CART_GET_SERVER_REQUEST] (state, payload) {
    state.loading = true
  },
  [CART_GET_SERVER_SUCCESS] (state, payload) {
    payload.forEach(cartItem => {
      let productObj = {
        available: cartItem.available,
        name: cartItem.product.name,
        freight: cartItem.product.freight,
        slug: cartItem.product.slug,
        price: cartItem.product.price,
        productBrandName: cartItem.product.dealer_name,
        productId: cartItem.product_id,
        image: cartItem.product.image,
        quantity: cartItem.quantity,
        warehouseId: cartItem.warehouse_id,
        itemId: cartItem.id
      }

      let isWarehouse = _.has(state.cart, cartItem.warehouse_id)

      if (isWarehouse) {
        state.cart[cartItem.warehouse_id].products[cartItem.product_id] = productObj
      } else {
        state.cart[cartItem.warehouse_id] = {}
        state.cart[cartItem.warehouse_id].city = cartItem.warehouse.city
        state.cart[cartItem.warehouse_id].products = {}
        state.cart[cartItem.warehouse_id].products[cartItem.product_id] = productObj
      }
    })
    state.loading = false
  },
  [CART_GET_SERVER_ERROR] (state, payload) {
    state.loading = false
  },
  [CART_DELETE_LOCAL] (state, payload) {
    state.cart = {}
  },
  [CART_UPDATE_AVAILABLE_QUANTITY_SUCCESS] (state, payload) {
    state.loading = false

    payload.forEach(cartItem => {
      const hasProduct = state.cart[cartItem.warehouse_id] && state.cart[cartItem.warehouse_id].products[cartItem.product_id]

      if (hasProduct) state.cart[cartItem.warehouse_id].products[cartItem.product_id].available = cartItem.available
    })
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
