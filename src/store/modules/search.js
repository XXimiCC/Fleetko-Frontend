import Vue from 'vue'
import Vuex from 'vuex'
import $ from 'jquery'
import {
  SEARCH_GET_REQUEST,
  SEARCH_GET_SUCCESS,
  SEARCH_GET_ERROR,
  SEARCH_SET_YEAR,
  SEARCH_SET_BRAND,
  SEARCH_SET_MODEL,
  SEARCH_CLEAR_MODEL,
  SEARCH_SUBMIT_REQUEST,
  SEARCH_SUBMIT_SUCCESS,
  SEARCH_SUBMIT_ERROR,
  SEARCH_TOGGLE_MODAL
} from '../mutations'

Vue.use(Vuex)

const state = {
  mainSearch: {
    selectedYear: null,
    selectedBrand: null,
    selectedModel: null,
    years: [],
    brands: [],
    models: []
  },
  searchMatrix: {},
  liveSearchModal: false
}

const getters = {
  getSearchOptions (state) {
    return state.mainSearch
  },
  enableSearch (state) {
    return !!state.mainSearch.selectedModel
  },
  liveSearchModal (state) {
    return state.liveSearchModal
  }
}

const actions = {
  toggleSearchModal ({commit}, open) {
    commit(SEARCH_TOGGLE_MODAL, open)
  },
  clearSearch ({commit, state}, {brand, model, year}) {
    commit(SEARCH_CLEAR_MODEL, {brand, model, year})
  },
  fetchSearch ({commit, state}) {
    commit(SEARCH_GET_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/vehicle_search`,
        method: 'GET'
      }).then(
        (resp) => {
          commit(SEARCH_GET_SUCCESS, resp.data)
          resolve(resp)
        },
        (err) => {
          commit(SEARCH_GET_ERROR)
          reject(err)
        }
      )
    })
  },
  setYearSearch ({commit}, year) {
    commit(SEARCH_SET_YEAR, year)
  },
  setBrandSearch ({commit}, brand) {
    commit(SEARCH_SET_BRAND, brand)
  },
  setModelSearch ({commit, dispatch}, model) {
    commit(SEARCH_SET_MODEL, model)
  }
}

const mutations = {
  [SEARCH_TOGGLE_MODAL] (state, payload) {
    state.liveSearchModal = payload
  },
  [SEARCH_GET_REQUEST] (state, payload) {
    state.loading = true
  },
  [SEARCH_GET_SUCCESS] (state, payload) {
    state.loading = false
    state.searchMatrix = payload

    if (!state.mainSearch.years.length) {
      for (let year in state.searchMatrix) {
        state.mainSearch.years.push(year)
      }
      state.mainSearch.years.reverse()
    }
  },
  [SEARCH_GET_ERROR] (state, payload) {
    state.loading = false
  },
  [SEARCH_SET_YEAR] (state, payload) {
    state.mainSearch.selectedYear = payload
    if (payload) state.mainSearch.brands = Object.keys(state.searchMatrix[payload])
  },
  [SEARCH_SET_BRAND] (state, payload) {
    state.mainSearch.selectedBrand = payload

    if (payload) {
      state.mainSearch.models = state.searchMatrix[state.mainSearch.selectedYear][payload]
      state.mainSearch.models = state.mainSearch.models.map(g => ({
        label: g.name,
        value: g.id
      }))
    }
  },
  [SEARCH_SET_MODEL] (state, payload) {
    state.mainSearch.selectedModel = payload

    if (payload) {
      const year = state.mainSearch.selectedYear
      const brand = state.mainSearch.selectedBrand

      state.searchMatrix[year][brand].find(vehicle => {
        if (vehicle.id === payload.value) {
          state.mainSearch.slug = vehicle.slug
        }
      })
    }
  },
  [SEARCH_CLEAR_MODEL] (state, payload) {
    if (payload.year) {
      state.mainSearch.selectedYear = null
      state.mainSearch.slug = null
    }
    if (payload.brand) {
      state.mainSearch.selectedBrand = null
    }
    if (payload.model) {
      state.mainSearch.selectedModel = null
    }
  },
  [SEARCH_SUBMIT_REQUEST] (state, payload) {
    state.loading = true
  },
  [SEARCH_SUBMIT_SUCCESS] (state, payload) {
    state.loading = false
  },
  [SEARCH_SUBMIT_ERROR] (state, payload) {
    state.loading = false
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
