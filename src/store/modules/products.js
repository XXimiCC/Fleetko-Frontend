import Vue from 'vue'
import Vuex from 'vuex'
import $ from 'jquery'
import {
  PRODUCTS_TOGGLE_CART_MODAL,
  PRODUCTS_SET_MODAL_PRODUCT_ID,
  PRODUCTS_SET_PRODUCT_VIEW,
  PRODUCTS_GET_SECTIONS_REQUEST,
  PRODUCTS_GET_SECTIONS_SUCCESS,
  PRODUCTS_GET_SECTIONS_ERROR,
  PRODUCTS_GET_SECTION_REQUEST,
  PRODUCTS_GET_SECTION_SUCCESS,
  PRODUCTS_GET_SECTION_ERROR,
  PRODUCTS_GET_CATEGORY_REQUEST,
  PRODUCTS_GET_CATEGORY_SUCCESS,
  PRODUCTS_GET_CATEGORY_ERROR,
  PRODUCTS_GET_BRANDS_REQUEST,
  PRODUCTS_GET_BRANDS_SUCCESS,
  PRODUCTS_GET_BRANDS_ERROR,
  PRODUCTS_GET_VEHICLE_REQUEST,
  PRODUCTS_GET_VEHICLE_SUCCESS,
  PRODUCTS_GET_VEHICLE_ERROR,
  PRODUCTS_GET_VEHICLE_SECTIONS_REQUEST,
  PRODUCTS_GET_VEHICLE_SECTIONS_SUCCESS,
  PRODUCTS_GET_VEHICLE_SECTIONS_ERROR,
  PRODUCTS_GET_REQUEST,
  PRODUCTS_GET_SUCCESS,
  PRODUCTS_GET_ERROR,
  PRODUCTS_GET_SINGLE_REQUEST,
  PRODUCTS_GET_SINGLE_SUCCESS,
  PRODUCTS_GET_SINGLE_ERROR,
  PRODUCTS_GET_FILTERS_REQUEST,
  PRODUCTS_GET_FILTERS_SUCCESS,
  PRODUCTS_GET_FILTERS_ERROR,
  PRODUCTS_SET_FILTERS_REQUEST,
  PRODUCTS_SET_FILTERS_SUCCESS,
  PRODUCTS_SET_FILTERS_ERROR,
  PRODUCTS_GET_DEALER_FILTERS_REQUEST,
  PRODUCTS_GET_DEALER_FILTERS_SUCCESS,
  PRODUCTS_GET_DEALER_FILTERS_ERROR,
  PRODUCTS_GET_DEALER_SECTIONS_REQUEST,
  PRODUCTS_GET_DEALER_SECTIONS_SUCCESS,
  PRODUCTS_GET_DEALER_SECTIONS_ERROR,
  PRODUCTS_SET_DEALER_VIEW,
  PRODUCTS_GET_DEALER_INFO_REQUEST,
  PRODUCTS_GET_DEALER_INFO_SUCCESS,
  PRODUCTS_GET_DEALER_INFO_ERROR,
  PRODUCTS_GET_RELATED_PRODUCTS_REQUEST,
  PRODUCTS_GET_RELATED_PRODUCTS_SUCCESS,
  PRODUCTS_GET_RELATED_PRODUCTS_ERROR,
  PRODUCTS_GET_BESTSELLERS_PRODUCTS_REQUEST,
  PRODUCTS_GET_BESTSELLERS_PRODUCTS_SUCCESS,
  PRODUCTS_GET_BESTSELLERS_PRODUCTS_ERROR,
  PRODUCTS_GET_PURCHASED_PRODUCTS_REQUEST,
  PRODUCTS_GET_PURCHASED_PRODUCTS_SUCCESS,
  PRODUCTS_GET_PURCHASED_PRODUCTS_ERROR,
  PRODUCTS_GET_REVIEWS_REQUEST,
  PRODUCTS_GET_REVIEWS_SUCCESS,
  PRODUCTS_GET_REVIEWS_ERROR,
  PRODUCTS_GET_FEATURED_PRODUCTS_REQUEST,
  PRODUCTS_GET_FEATURED_PRODUCTS_SUCCESS,
  PRODUCTS_GET_FEATURED_PRODUCTS_ERROR,
  PRODUCTS_GET_VIEWED_REQUERST,
  PRODUCTS_GET_VIEWED_SUCCESS,
  PRODUCTS_GET_VIEWED_ERROR,
  PRODUCTS_CREATE_VIEWED_REQUERST,
  PRODUCTS_CREATE_VIEWED_SUCCESS,
  PRODUCTS_CREATE_VIEWED_ERROR,
  PRODUCTS_DELETE_VIEWED_REQUERST,
  PRODUCTS_DELETE_VIEWED_SUCCESS,
  PRODUCTS_DELETE_VIEWED_ERROR,
  PRODUCTS_DELETE_ALL_VIEWED_REQUERST,
  PRODUCTS_DELETE_ALL_VIEWED_SUCCESS,
  PRODUCTS_DELETE_ALL_VIEWED_ERROR,
  PRODUCTS_GET_WAREHOUSE_REQUERST,
  PRODUCTS_GET_WAREHOUSE_SUCCESS,
  PRODUCTS_GET_WAREHOUSE_ERROR,
  PRODUCTS_GET_LIST_WAREHOUSES_REQUERST,
  PRODUCTS_GET_LIST_WAREHOUSES_SUCCESS,
  PRODUCTS_GET_LIST_WAREHOUSES_ERROR
} from '../mutations'

Vue.use(Vuex)

const state = {
  addToCartModal: false,
  modalProductId: null,
  sections: [],
  section: {},
  brands: [],
  vehicle: [],
  vehicleSections: [],
  productView: 'column',
  dealerView: 'column'
}

const getters = {
  addToCartModal (state) {
    return state.addToCartModal
  },
  modalProductId (state) {
    return state.modalProductId
  },
  getSections (state) {
    return state.sections
  },
  getSection (state) {
    return state.section
  },
  getBrands (state) {
    return state.brands
  },
  getVehicle (state) {
    return state.vehicle
  },
  getVehicleSections (state) {
    return state.vehicleSections
  },
  getProductView (state) {
    return state.productView
  },
  getDealerView (state) {
    return state.dealerView
  }
}

const actions = {
  toggleCartModal ({commit}, open) {
    commit(PRODUCTS_TOGGLE_CART_MODAL, open)
  },
  setModalProductId ({commit}, productId) {
    return new Promise((resolve, reject) => {
      commit(PRODUCTS_SET_MODAL_PRODUCT_ID, productId)
      resolve()
    })
  },
  setProductView ({commit}, view) {
    commit(PRODUCTS_SET_PRODUCT_VIEW, view)
  },
  setDealerView ({commit}, view) {
    commit(PRODUCTS_SET_DEALER_VIEW, view)
  },
  fetchSections ({commit}) {
    commit(PRODUCTS_GET_SECTIONS_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/sections',
        method: 'GET',
        data: {
          include: 'categories'
        }
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_SECTIONS_SUCCESS, resp.data)
          resolve(resp)
        },
        (err) => {
          reject(err)
        }
      )
    })
  },
  fetchSection ({commit}, slug) {
    commit(PRODUCTS_GET_SECTION_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/sections/${slug}`,
        method: 'GET',
        data: {
          include: 'categories'
        }
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_SECTION_SUCCESS, resp.data)
          resolve(resp)
        },
        (err) => {
          commit(PRODUCTS_GET_SECTION_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchCategory ({commit}, slug) {
    commit(PRODUCTS_GET_CATEGORY_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/categories/${slug}`,
        method: 'GET'
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_CATEGORY_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(PRODUCTS_GET_CATEGORY_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchDealers ({commit}) {
    commit(PRODUCTS_GET_BRANDS_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/dealers',
        method: 'GET'
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_BRANDS_SUCCESS, resp.data)
          resolve(resp)
        },
        (err) => {
          commit(PRODUCTS_GET_BRANDS_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchVehicle ({commit}, slug) {
    commit(PRODUCTS_GET_VEHICLE_REQUEST)
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/vehicles/${slug}`,
        method: 'GET',
        data: {
          include: 'vehicle_brand'
        }
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_VEHICLE_SUCCESS, resp.data)
          resolve(resp.data)
        },
        (err) => {
          commit(PRODUCTS_GET_VEHICLE_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchVehicleSections ({commit, state}, slug) {
    commit(PRODUCTS_GET_VEHICLE_SECTIONS_REQUEST)

    $.ajax({
      url: `/api/vehicles/${slug}/sections`,
      method: 'GET'
    }).then(
      (resp) => {
        commit(PRODUCTS_GET_VEHICLE_SECTIONS_SUCCESS, resp.data)
      },
      (err) => {
        commit(PRODUCTS_GET_VEHICLE_SECTIONS_ERROR, err)
      }
    )
  },
  fetchProducts ({commit}, options) {
    commit(PRODUCTS_GET_REQUEST)
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/products',
        method: 'GET',
        data: {
          category: options.category ? options.category : '',
          price_range: options.price ? options.price : '',
          filter_options: options.filters === 'no' ? '' : options.filters,
          page: options.page,
          dealers: options.dealers,
          vehicle: options.vehicle === 'no' ? '' : options.vehicle,
          sort: options.sort
        }
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_SUCCESS, resp.data)
          resolve(resp)
        },
        (err) => {
          commit(PRODUCTS_GET_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchDealerInfo ({commit}, slug) {
    commit(PRODUCTS_GET_DEALER_INFO_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/dealers/${slug}`,
        method: 'GET'
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_DEALER_INFO_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(PRODUCTS_GET_DEALER_INFO_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchDealerSections ({commit}, slug) {
    commit(PRODUCTS_GET_DEALER_SECTIONS_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/dealers/${slug}/sections`,
        method: 'GET'
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_DEALER_SECTIONS_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(PRODUCTS_GET_DEALER_SECTIONS_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchDealerFilters ({commit}, slug) {
    commit(PRODUCTS_GET_DEALER_FILTERS_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/dealers/${slug}/filtering`,
        method: 'GET'
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_DEALER_FILTERS_SUCCESS, resp)
          resolve(resp)
        },
        (err) => {
          commit(PRODUCTS_GET_DEALER_FILTERS_ERROR)
          reject(err)
        }
      )
    })
  },
  filterProducts ({commit}, {slug, options}) {
    options.prices = options.prices || ''
    options.filter_options = options.filter_options || ''
    options.dealers = options.dealers || ''

    commit(PRODUCTS_SET_FILTERS_REQUEST)
    let categoryUrl = `/api/categories/${slug}/filtering?price_range=${options.prices}&filter_options=${options.filter_options}&dealers=${options.dealers}&vehicle=${options.vehicle}`
    let dealerUrl = `/api/dealers/${slug}/filtering?price_range=${options.prices}`

    return new Promise((resolve, reject) => {
      $.ajax({
        url: options.dealerFilters ? dealerUrl : categoryUrl,
        method: 'GET'
      }).then(
        (resp) => {
          commit(PRODUCTS_SET_FILTERS_SUCCESS, resp)
          resolve(resp)
        },
        (err) => {
          reject(err)
        }
      )
    })
  },
  fetchProduct ({commit}, id) {
    commit(PRODUCTS_GET_SINGLE_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/products/${id}`,
        method: 'GET'
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_SINGLE_SUCCESS, resp.data)
          resolve(resp.data)
        },
        (err) => {
          commit(PRODUCTS_GET_SINGLE_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchRelatedProduct ({commit}, slug) {
    commit(PRODUCTS_GET_RELATED_PRODUCTS_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/products/${slug}/related_products`,
        method: 'GET'
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_RELATED_PRODUCTS_SUCCESS)
          resolve(resp.data)
        },
        (err) => {
          commit(PRODUCTS_GET_RELATED_PRODUCTS_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchFeaturedProducts ({commit}, {slug, type}) {
    let link = ''

    commit(PRODUCTS_GET_FEATURED_PRODUCTS_REQUEST)

    switch (type) {
      case 'categories':
        link = `/api/categories/${slug}/featured_products`
        break

      default:
        link = `/api/featured_products`
        break
    }

    return new Promise((resolve, reject) => {
      $.ajax({
        url: link,
        method: 'GET'
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_FEATURED_PRODUCTS_SUCCESS)
          resolve(resp.data)
        },
        (err) => {
          commit(PRODUCTS_GET_FEATURED_PRODUCTS_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchBestsellersProducts ({commit}, {slug, type}) {
    let link = ''

    commit(PRODUCTS_GET_BESTSELLERS_PRODUCTS_REQUEST)

    switch (type) {
      case 'sections':
        link = `/api/sections/${slug}/bestselling_products`
        break

      case 'vehicles':
        link = `/api/vehicles/${slug}/bestselling_products`
        break

      case 'categories':
        link = `/api/categories/${slug}/bestselling_products`
        break

      case 'dealers':
        link = `/api/dealers/${slug}/bestselling_products`
        break
    }

    return new Promise((resolve, reject) => {
      $.ajax({
        url: link,
        method: 'GET'
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_BESTSELLERS_PRODUCTS_SUCCESS)
          resolve(resp.data)
        },
        (err) => {
          commit(PRODUCTS_GET_BESTSELLERS_PRODUCTS_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchPurchasedProducts ({commit}, {id, page}) {
    commit(PRODUCTS_GET_PURCHASED_PRODUCTS_REQUEST)

    let url = id ? `/api/purchased_products?id=${id}` : `/api/purchased_products`

    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        method: 'GET',
        data: {
          page: page || 1
        }
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_PURCHASED_PRODUCTS_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(PRODUCTS_GET_PURCHASED_PRODUCTS_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchProductReviews ({commit}, {slug, page}) {
    commit(PRODUCTS_GET_REVIEWS_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/products/${slug}/reviews`,
        method: 'GET',
        data: {
          page: page
        }
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_REVIEWS_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(PRODUCTS_GET_REVIEWS_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchViewedProducts ({commit}) {
    commit(PRODUCTS_GET_VIEWED_REQUERST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/viewed_products',
        method: 'GET'
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_VIEWED_SUCCESS, resp.data)
          resolve(resp)
        },
        (err) => {
          commit(PRODUCTS_GET_VIEWED_ERROR)
          reject(err)
        }
      )
    })
  },
  createViewedProduct ({commit}, productId) {
    commit(PRODUCTS_CREATE_VIEWED_REQUERST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/viewed_products',
        method: 'POST',
        data: JSON.stringify({
          'product_id': productId
        })
      }).then(
        (resp) => {
          commit(PRODUCTS_CREATE_VIEWED_SUCCESS, resp.data)
          resolve(resp)
        },
        (err) => {
          commit(PRODUCTS_CREATE_VIEWED_ERROR)
          reject(err)
        }
      )
    })
  },
  deleteViewedProduct ({commit}, productId) {
    commit(PRODUCTS_DELETE_VIEWED_REQUERST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/viewed_products/${productId}`,
        method: 'DELETE'
      }).then(
        (resp) => {
          commit(PRODUCTS_DELETE_VIEWED_SUCCESS, resp.data)
          resolve(resp)
        },
        (err) => {
          commit(PRODUCTS_DELETE_VIEWED_ERROR)
          reject(err)
        }
      )
    })
  },
  deleteAllViewedProducts ({commit}, productId) {
    commit(PRODUCTS_DELETE_ALL_VIEWED_REQUERST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/viewed_products`,
        method: 'DELETE'
      }).then(
        (resp) => {
          commit(PRODUCTS_DELETE_ALL_VIEWED_SUCCESS, resp.data)
          resolve(resp)
        },
        (err) => {
          commit(PRODUCTS_DELETE_ALL_VIEWED_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchWarehouse ({commit}, warehouseId) {
    commit(PRODUCTS_GET_WAREHOUSE_REQUERST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/warehouses/${warehouseId}`,
        method: 'GET'
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_WAREHOUSE_SUCCESS, resp.data)
          resolve(resp.data)
        },
        (err) => {
          commit(PRODUCTS_GET_WAREHOUSE_ERROR)
          reject(err)
        }
      )
    })
  },

  fetchListWarehouses ({commit}) {
    commit(PRODUCTS_GET_LIST_WAREHOUSES_REQUERST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/warehouses`,
        method: 'GET'
      }).then(
        (resp) => {
          commit(PRODUCTS_GET_LIST_WAREHOUSES_SUCCESS, resp.data)
          resolve(resp.data)
        },
        (err) => {
          commit(PRODUCTS_GET_LIST_WAREHOUSES_ERROR)
          reject(err)
        }
      )
    })
  }
}

const mutations = {
  [PRODUCTS_TOGGLE_CART_MODAL] (state, payload) {
    state.addToCartModal = payload
  },
  [PRODUCTS_SET_MODAL_PRODUCT_ID] (state, payload) {
    state.modalProductId = payload
  },
  [PRODUCTS_SET_PRODUCT_VIEW] (state, payload) {
    state.productView = payload
  },
  [PRODUCTS_SET_DEALER_VIEW] (state, payload) {
    state.dealerView = payload
  },
  [PRODUCTS_GET_SECTIONS_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_SECTIONS_SUCCESS] (state, payload) {
    state.loading = false
    state.sections = {
      ...payload
    }
  },
  [PRODUCTS_GET_SECTIONS_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_SECTION_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_SECTION_SUCCESS] (state, payload) {
    state.loading = false
    state.section = {
      ...payload
    }
  },
  [PRODUCTS_GET_SECTION_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_BRANDS_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_BRANDS_SUCCESS] (state, payload) {
    state.loading = false
    state.brands = {
      ...payload
    }
  },
  [PRODUCTS_GET_BRANDS_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_VEHICLE_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_VEHICLE_SUCCESS] (state, payload) {
    payload.year = payload.year.toString()
    state.loading = false
    state.vehicle = {
      ...payload
    }
  },
  [PRODUCTS_GET_VEHICLE_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_VEHICLE_SECTIONS_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_VEHICLE_SECTIONS_SUCCESS] (state, payload) {
    state.loading = false
    state.vehicleSections = {
      ...payload
    }
  },
  [PRODUCTS_GET_VEHICLE_SECTIONS_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_SUCCESS] (state, payload) {
    state.loading = false
  },
  [PRODUCTS_GET_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_SINGLE_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_SINGLE_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_SINGLE_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_DEALER_INFO_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_DEALER_INFO_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_DEALER_INFO_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_DEALER_FILTERS_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_DEALER_FILTERS_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_DEALER_FILTERS_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_FILTERS_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_DEALER_SECTIONS_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_DEALER_SECTIONS_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_DEALER_SECTIONS_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_FILTERS_SUCCESS] (state, payload) {
    state.productPrices = payload.data.price_range
  },
  [PRODUCTS_GET_FILTERS_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_SET_FILTERS_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_SET_FILTERS_SUCCESS] (state, payload) {
    state.loading = false
  },
  [PRODUCTS_SET_FILTERS_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_CATEGORY_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_CATEGORY_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_CATEGORY_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_RELATED_PRODUCTS_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_RELATED_PRODUCTS_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_RELATED_PRODUCTS_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_BESTSELLERS_PRODUCTS_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_BESTSELLERS_PRODUCTS_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_BESTSELLERS_PRODUCTS_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_PURCHASED_PRODUCTS_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_PURCHASED_PRODUCTS_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_PURCHASED_PRODUCTS_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_REVIEWS_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_REVIEWS_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_REVIEWS_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_FEATURED_PRODUCTS_REQUEST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_FEATURED_PRODUCTS_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_FEATURED_PRODUCTS_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_VIEWED_REQUERST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_VIEWED_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_VIEWED_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_CREATE_VIEWED_REQUERST] (state) {
    state.loading = true
  },
  [PRODUCTS_CREATE_VIEWED_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_CREATE_VIEWED_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_DELETE_VIEWED_REQUERST] (state) {
    state.loading = true
  },
  [PRODUCTS_DELETE_VIEWED_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_DELETE_VIEWED_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_DELETE_ALL_VIEWED_REQUERST] (state) {
    state.loading = true
  },
  [PRODUCTS_DELETE_ALL_VIEWED_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_DELETE_ALL_VIEWED_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_WAREHOUSE_REQUERST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_WAREHOUSE_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_WAREHOUSE_ERROR] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_LIST_WAREHOUSES_REQUERST] (state) {
    state.loading = true
  },
  [PRODUCTS_GET_LIST_WAREHOUSES_SUCCESS] (state) {
    state.loading = false
  },
  [PRODUCTS_GET_LIST_WAREHOUSES_ERROR] (state) {
    state.loading = false
  }

}

export default {
  state,
  actions,
  mutations,
  getters
}
