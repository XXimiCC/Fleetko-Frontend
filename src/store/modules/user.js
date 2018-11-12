import Vue from 'vue'
import Vuex from 'vuex'
import router from '../../router/router'
import $ from 'jquery'

import {
  USER_CREATE_REQUEST,
  USER_CREATE_SUCCESS,
  USER_CREATE_FAILURE,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_GET_AUTH_REQUEST,
  USER_GET_AUTH_SUCCESS,
  USER_GET_AUTH_FAILURE,
  USER_LOGOUT,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_ERROR,
  USER_GET_ADDRESS_REQUEST,
  USER_GET_ADDRESS_SUCCESS,
  USER_GET_ADDRESS_ERROR,
  USER_DELETE_ADDRESS_REQUEST,
  USER_DELETE_ADDRESS_SUCCESS,
  USER_DELETE_ADDRESS_ERROR,
  USER_SET_ADDRESS_MAIN_REQUEST,
  USER_SET_ADDRESS_MAIN_SUCCESS,
  USER_SET_ADDRESS_MAIN_ERROR,
  USER_SAVE_ADDRESS_REQUEST,
  USER_SAVE_ADDRESS_SUCCESS,
  USER_SAVE_ADDRESS_ERROR,
  USER_SUBMIT_EMAIL_REQUEST,
  USER_SUBMIT_EMAIL_SUCCESS,
  USER_SUBMIT_EMAIL_ERROR,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_ERROR,
  USER_RESET_PASSWORD_VALIDATION_REQUEST,
  USER_RESET_PASSWORD_VALIDATION_SUCCESS,
  USER_RESET_PASSWORD_VALIDATION_ERROR,
  USER_GET_ORDERS_REQUEST,
  USER_GET_ORDERS_SUCCESS,
  USER_GET_ORDERS_ERROR,
  USER_UPDATE_ORDERS_REQUEST,
  USER_UPDATE_ORDERS_SUCCESS,
  USER_UPDATE_ORDERS_ERROR,
  USER_UPDATE_ORDER_REQUEST,
  USER_UPDATE_ORDER_SUCCESS,
  USER_UPDATE_ORDER_ERROR,
  USER_DELETE_ORDER_REQUEST,
  USER_DELETE_ORDER_SUCCESS,
  USER_DELETE_ORDER_ERROR,
  USER_CREATE_PURCHASE_REQUEST,
  USER_CREATE_PURCHASE_SUCCESS,
  USER_CREATE_PURCHASE_ERROR,
  USER_SET_PRELOADER_MANUAL,
  USER_GET_ORDER_REQUEST,
  USER_GET_ORDER_SUCCESS,
  USER_GET_ORDER_ERROR,
  USER_GET_PAYMENT_METHODS_REQUEST,
  USER_GET_PAYMENT_METHODS_SUCCESS,
  USER_GET_PAYMENT_METHODS_ERROR,
  USER_DELETE_PAYMENT_METHOD_REQUEST,
  USER_DELETE_PAYMENT_METHOD_SUCCESS,
  USER_DELETE_PAYMENT_METHOD_ERROR,
  USER_GET_RESELLER_PERMITS_REQUEST,
  USER_GET_RESELLER_PERMITS_SUCCESS,
  USER_GET_RESELLER_PERMITS_ERROR,
  USER_CREATE_RESELLER_PERMITS_REQUEST,
  USER_CREATE_RESELLER_PERMITS_SUCCESS,
  USER_CREATE_RESELLER_PERMITS_ERROR,
  USER_UPDATE_RESELLER_PERMITS_REQUEST,
  USER_UPDATE_RESELLER_PERMITS_SUCCESS,
  USER_UPDATE_RESELLER_PERMITS_ERROR,
  USER_DELETE_RESELLER_PERMIT_REQUEST,
  USER_DELETE_RESELLER_PERMIT_SUCCESS,
  USER_DELETE_RESELLER_PERMIT_ERROR,
  USER_FETCH_BRAINTREE_TOKEN_REQUEST,
  USER_FETCH_BRAINTREE_TOKEN_SUCCESS,
  USER_FETCH_BRAINTREE_TOKEN_ERROR,
  USER_CREATE_ORDER_PROCESSING_REQUEST,
  USER_CREATE_ORDER_PROCESSING_SUCCESS,
  USER_CREATE_ORDER_PROCESSING_ERROR,
  USER_CREATE_INVOICE_TOKEN_REQUEST,
  USER_CREATE_INVOICE_TOKEN_SUCCESS,
  USER_CREATE_INVOICE_TOKEN_ERROR,
  USER_CREATE_FEEDBACK_REQUEST,
  USER_CREATE_FEEDBACK_SUCCESS,
  USER_CREATE_FEEDBACK_ERROR,
  USER_UPDATE_PENDING_COUNTER,
  USER_CREATE_REVIEW_REQUEST,
  USER_CREATE_REVIEW_SUCCESS,
  USER_CREATE_REVIEW_ERROR,
  USER_DELETE_REVIEW_REQUEST,
  USER_DELETE_REVIEW_SUCCESS,
  USER_DELETE_REVIEW_ERROR,
  USER_UPDATE_REVIEW_REQUEST,
  USER_UPDATE_REVIEW_SUCCESS,
  USER_UPDATE_REVIEW_ERROR,
  USER_EMAIL_VERIFIED_SUCCESS,
  USER_UPDATE_EMAIL_REQUEST,
  USER_UPDATE_EMAIL_SUCCESS,
  USER_UPDATE_EMAIL_ERROR
} from '../mutations'

Vue.use(Vuex)

const state = {
  loading: false,
  token: {
    access_token: null,
    expires_in: null,
    refresh_token: null,
    token_type: null
  },
  model: null,
  error: ''
}

const getters = {
  hasToken (state) {
    return state.token
  },
  userInfo (state) {
    return state.model
  },
  preloader (state) {
    return state.loading
  }
}

const actions = {
  setLoaderManual ({commit}, loading) {
    commit(USER_SET_PRELOADER_MANUAL, loading)
  },

  fetchPaymentMethods ({commit}) {
    commit(USER_GET_PAYMENT_METHODS_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: '/api/payment_methods'
      }).then(
        (resp) => {
          commit(USER_GET_PAYMENT_METHODS_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_GET_PAYMENT_METHODS_ERROR)
          reject(err)
        }
      )
    })
  },

  deletePaymentMethod ({commit}, id) {
    commit(USER_DELETE_PAYMENT_METHOD_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'DELETE',
        url: `/api/payment_methods/${id}`
      }).then(
        (resp) => {
          commit(USER_DELETE_PAYMENT_METHOD_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_DELETE_PAYMENT_METHOD_ERROR)
          reject(err)
        }
      )
    })
  },

  fetchResellerPermits ({commit}, page) {
    commit(USER_GET_RESELLER_PERMITS_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `/api/reseller_permits?page=${page}`
      }).then(
        (resp) => {
          commit(USER_GET_RESELLER_PERMITS_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_GET_RESELLER_PERMITS_ERROR)
          reject(err)
        }
      )
    })
  },

  deleteResellerPermit ({commit}, id) {
    commit(USER_DELETE_RESELLER_PERMIT_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'DELETE',
        url: `/api/reseller_permits/${id}`
      }).then(
        (resp) => {
          commit(USER_DELETE_RESELLER_PERMIT_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_DELETE_RESELLER_PERMIT_ERROR)
          reject(err)
        }
      )
    })
  },

  updateResellerPermit ({state, commit}, {permit, id, myFormData}) {
    commit(USER_UPDATE_RESELLER_PERMITS_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'PATCH',
        url: `/api/reseller_permits/${id}`,
        data: JSON.stringify(permit)
      }).then(
        (response) => {
          if (!myFormData) {
            resolve(response.data)
            commit(USER_UPDATE_RESELLER_PERMITS_SUCCESS)

            return
          }

          const xhr = new XMLHttpRequest()

          xhr.open(
            'POST',
            `https://api-dev.fleetko.com/api/reseller_permits/${id}/document`,
            true
          )

          xhr.setRequestHeader(
            'Authorization',
            `Bearer ${state.token.access_token}`
          )

          xhr.onload = event => {
            const documentObj = JSON.parse(event.target.response)

            response.data.document = documentObj.data
            resolve(response.data)
            commit(USER_UPDATE_RESELLER_PERMITS_SUCCESS)
          }

          xhr.onerror = error => {
            commit(USER_UPDATE_RESELLER_PERMITS_ERROR)
            reject(error)
          }

          xhr.send(myFormData)
        },
        (err) => {
          commit(USER_UPDATE_RESELLER_PERMITS_ERROR)
          reject(err)
        }
      )
    })
  },

  createResellerPermit ({state, commit}, {permit, myFormData}) {
    commit(USER_CREATE_RESELLER_PERMITS_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: `/api/reseller_permits`,
        data: JSON.stringify(permit)
      }).then(
        (response) => {
          return $.ajax({
            method: 'POST',
            url: `/api/reseller_permits/${response.data.id}/document`,
            data: myFormData,
            processData: false,
            contentType: false
          }).then(
            (resp) => {
              Object.assign(response.data, {
                document: resp.data,
                status: 'pending_review'
              })

              commit(USER_CREATE_RESELLER_PERMITS_SUCCESS)
              resolve(response.data)
            },
            (err) => {
              commit(USER_CREATE_RESELLER_PERMITS_ERROR)
              reject(err)
            }
          )
        },
        (error) => {
          commit(USER_CREATE_RESELLER_PERMITS_ERROR)
          reject(error)
        }
      )
    })
  },

  initTokenHeader ({state, dispatch}) {
    if (state.token) {
      $.ajaxSetup({
        headers: {'Authorization': `Bearer ${state.token.access_token}`}
      })
    }
  },
  initAjaxErrorHandling ({dispatch, rootGetters}) {
    $.ajaxSetup({
      error: function (x, status, error) {
        if (x.status === 401 && !rootGetters.loginModal) {
          dispatch('logout')
        }
        if (x.status === 404 || x.status === 403) {
          router.replace({name: 'not-found'})
        }
      }
    })
  },
  registration ({commit, dispatch}, {email, password, firstName, lastName, recaptcha}) {
    commit(USER_CREATE_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: '/api/account',
        data: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          'g-recaptcha-response': recaptcha
        })
      }).then(
        () => {
          let grant_type = 'password'

          commit(USER_CREATE_SUCCESS)

          dispatch('login', {
            email,
            password,
            grant_type
          })
          resolve()
        },
        (error) => {
          reject(error)
          commit(USER_CREATE_FAILURE)
        })
    })
  },
  login ({commit, rootGetters, dispatch, state}, {email, password, grant_type, provider, token}) {
    commit(USER_LOGIN_REQUEST)

    let dataUserLogin = JSON.stringify({
      'username': email,
      'password': password,
      'grant_type': grant_type,
      'provider': provider,
      'access_token': token
    })
    let dataLoginAs = JSON.stringify({
      'grant_type': grant_type,
      'sudosu_token': token
    })

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: '/api/auth/token',
        data: grant_type === 'sudosu' ? dataLoginAs : dataUserLogin,
        include: grant_type === 'sudosu' ? 'user' : ''
      }).then(
        (resp) => {
          commit(USER_LOGIN_SUCCESS, resp)
          dispatch('initTokenHeader')
          resolve()
        },
        (error) => {
          commit(USER_LOGIN_FAILURE)
          reject(error)
        }
      )
    })
  },
  getAuthUser ({commit, state, rootGetters, dispatch}) {
    commit(USER_GET_AUTH_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/account'
      }).then(
        (resp) => {
          commit(USER_GET_AUTH_SUCCESS, resp.data)

          dispatch('fetchWaitList', {root: true}).then(resp => {
            if (rootGetters.waitListTempProduct) {
              dispatch('createWaitListedProduct', rootGetters.waitListTempProduct, { root: true })
            }

            resolve(true)
          })
        },
        (error) => {
          commit(USER_GET_AUTH_FAILURE)
          reject(error)
        }
      )
    })
  },
  logout ({commit, dispatch}) {
    dispatch('toggleEmailConfirmModal', false, { root: true })

    dispatch('deleteSystemNotification', {root: true})

    commit(USER_LOGOUT)

    return new Promise((resolve, reject) => {
      dispatch('clearWaitList', { root: true })
      resolve(true)
    })
  },
  updateUser ({commit, state}, {firstName, lastName, phone}) {
    commit(USER_UPDATE_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'PATCH',
        url: '/api/account',
        data: JSON.stringify({
          'first_name': firstName,
          'last_name': lastName,
          'phone': phone
        })
      }).then(
        (resp) => {
          commit(USER_UPDATE_SUCCESS, resp.data)
          resolve(resp)
        },
        (err) => {
          commit(USER_UPDATE_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchAddresses ({commit, dispatch, state}) {
    commit(USER_GET_ADDRESS_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: '/api/user_addresses'
      }).then(
        (response) => {
          commit(USER_GET_ADDRESS_SUCCESS, response.data)
          resolve(response)
        },
        (error) => {
          commit(USER_GET_ADDRESS_ERROR)
          reject(error)
        }
      )
    })
  },
  deleteAddress ({commit, dispatch, state}, {id}) {
    commit(USER_DELETE_ADDRESS_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'DELETE',
        url: `/api/user_addresses/${id}`
      }).then(
        (response) => {
          commit(USER_DELETE_ADDRESS_SUCCESS, response.data)
          resolve(response)
        },
        (error) => {
          commit(USER_DELETE_ADDRESS_ERROR)
          reject(error)
        }
      )
    })
  },
  setAddressMain ({commit, dispatch, state}, {id}) {
    commit(USER_SET_ADDRESS_MAIN_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'PATCH',
        url: `/api/user_addresses/default`,
        data: JSON.stringify({
          'user_address_id': id
        })
      }).then(
        (response) => {
          commit(USER_SET_ADDRESS_MAIN_SUCCESS, response.data)
          resolve(response)
        },
        (error) => {
          commit(USER_SET_ADDRESS_MAIN_ERROR)
          reject(error)
        }
      )
    })
  },
  saveAddress ({commit, dispatch, state}, {address}) {
    commit(USER_SAVE_ADDRESS_REQUEST)

    let url, method

    if (address.addressID) {
      url = `/api/user_addresses/${address.addressID}`
      method = 'PATCH'
    } else {
      url = `/api/user_addresses`
      method = 'POST'
    }

    return new Promise((resolve, reject) => {
      $.ajax({
        method: method,
        url: url,
        data: JSON.stringify({
          'disposable': address.disposable,
          'label': address.label,
          'name': address.firstName + ' ' + address.lastName,
          'address_line_1': address.addressFirst,
          'address_line_2': address.addressSecond,
          'city': address.city,
          'state': address.state,
          'zip': address.zip,
          'phone': address.phoneNumber
        })
      }).then(
        (resp) => {
          commit(USER_SAVE_ADDRESS_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_SAVE_ADDRESS_ERROR)
          reject(err)
        }
      )
    })
  },
  submitEmailPassword ({commit}, {email}) {
    commit(USER_SUBMIT_EMAIL_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/password_resets',
        method: 'POST',
        data: JSON.stringify({
          'email': email
        })
      }).then(
        (resp) => {
          commit(USER_SUBMIT_EMAIL_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_SUBMIT_EMAIL_ERROR)
          reject(err)
        }
      )
    })
  },
  resetPasswordValidate ({commit}, {email, token}) {
    commit(USER_RESET_PASSWORD_VALIDATION_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/password_reset_validations',
        method: 'POST',
        data: JSON.stringify({
          'email': email,
          'token': token
        })
      }).then(
        (resp) => {
          commit(USER_RESET_PASSWORD_VALIDATION_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_RESET_PASSWORD_VALIDATION_ERROR)
          reject(err)
        }
      )
    })
  },
  resetPassword ({commit}, {token, email, password}) {
    commit(USER_RESET_PASSWORD_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: '/api/reset_passwords',
        data: JSON.stringify({
          'token': token,
          'email': email,
          'password': password
        })
      }).then(
        (resp) => {
          commit(USER_RESET_PASSWORD_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_RESET_PASSWORD_ERROR)
          reject(err)
        }
      )
    })
  },
  createPurchase ({commit}, {purchase}) {
    commit(USER_CREATE_PURCHASE_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: `/api/purchase`,
        data: JSON.stringify({
          'purchase': purchase
        })
      }).then(
        (resp) => {
          commit(USER_CREATE_PURCHASE_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_CREATE_PURCHASE_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchOrders ({commit}, page) {
    commit(USER_GET_ORDERS_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `/api/orders?page=${page}`
      }).then(
        (resp) => {
          commit(USER_GET_ORDERS_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_GET_ORDERS_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchOrder ({commit}, id) {
    commit(USER_GET_ORDER_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `/api/orders/${id}`
      }).then(
        (resp) => {
          commit(USER_GET_ORDER_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_GET_ORDER_ERROR)
          reject(err)
        }
      )
    })
  },
  listOrderUpdates ({commit}, orders) {
    commit(USER_UPDATE_ORDERS_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `/api/order_updates?orders=${orders}`
      }).then(
        (resp) => {
          commit(USER_UPDATE_ORDERS_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_UPDATE_ORDERS_ERROR)
          reject(err)
        }
      )
    })
  },
  abandoneOrder ({commit}, orderId) {
    commit(USER_DELETE_ORDER_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: `/api/abandoned_orders`,
        data: JSON.stringify({
          'order_id': orderId
        })
      }).then(
        (resp) => {
          commit(USER_DELETE_ORDER_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_DELETE_ORDER_ERROR)
          reject(err)
        }
      )
    })
  },
  fetchBraintreeToken ({commit}) {
    commit(USER_FETCH_BRAINTREE_TOKEN_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `/api/braintree/client_token`
      }).then(
        (resp) => {
          commit(USER_FETCH_BRAINTREE_TOKEN_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_FETCH_BRAINTREE_TOKEN_ERROR)
          reject(err)
        }
      )
    })
  },
  createOrderPayment ({commit}, order) {
    commit(USER_CREATE_ORDER_PROCESSING_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: `/api/orders/${order.id}/payments`,
        data: JSON.stringify({
          'order_id': order.id,
          'user_comment': order.user_comment,
          'payment_method_nonce': order.payment_method_nonce,
          'billing_address': order.billing_address
        })
      }).then(
        (resp) => {
          commit(USER_CREATE_ORDER_PROCESSING_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_CREATE_ORDER_PROCESSING_ERROR)
          reject(err)
        }
      )
    })
  },
  createInvoiceToken ({commit}, id) {
    commit(USER_CREATE_INVOICE_TOKEN_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: `/api/orders/${id}/invoice_token`
      }).then(
        (resp) => {
          commit(USER_CREATE_INVOICE_TOKEN_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_CREATE_INVOICE_TOKEN_ERROR)
          reject(err)
        }
      )
    })
  },
  userUpdateOrder ({commit}, order) {
    commit(USER_UPDATE_ORDER_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'PATCH',
        url: `/api/orders/${order.id}/shipping_rate`,
        data: JSON.stringify({
          'shipping_rate_id': order.rateId
        })
      }).then(
        (resp) => {
          commit(USER_UPDATE_ORDER_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_UPDATE_ORDER_ERROR)
          reject(err)
        }
      )
    })
  },
  userCreateFeedback ({commit}, feedback) {
    commit(USER_CREATE_FEEDBACK_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: `/api/feedback`,
        data: JSON.stringify({
          'name': feedback.name,
          'email': feedback.email,
          'phone': feedback.phone,
          'message': feedback.message
        })
      }).then(
        (resp) => {
          commit(USER_CREATE_FEEDBACK_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_CREATE_FEEDBACK_ERROR)
          reject(err)
        }
      )
    })
  },
  userCreateReview ({commit}, review) {
    commit(USER_CREATE_REVIEW_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: `/api/reviews`,
        data: JSON.stringify({
          'product_id': review.productId,
          'rating': review.rating,
          'headline': review.headline,
          'text': review.text
        })
      }).then(
        (resp) => {
          commit(USER_CREATE_REVIEW_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_CREATE_REVIEW_ERROR)
          reject(err)
        }
      )
    })
  },
  userUpdateReview ({commit}, review) {
    commit(USER_UPDATE_REVIEW_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'PATCH',
        url: `/api/reviews/${review.reviewId}`,
        data: JSON.stringify({
          'rating': review.rating,
          'headline': review.headline,
          'text': review.text
        })
      }).then(
        (resp) => {
          commit(USER_UPDATE_REVIEW_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_UPDATE_REVIEW_ERROR)
          reject(err)
        }
      )
    })
  },
  userDeleteReview ({commit}, id) {
    commit(USER_DELETE_REVIEW_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'DELETE',
        url: `/api/reviews/${id}`
      }).then(
        (resp) => {
          commit(USER_DELETE_REVIEW_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_DELETE_REVIEW_ERROR)
          reject(err)
        }
      )
    })
  },
  updateUserPendingCounter ({commit}, action) {
    commit(USER_UPDATE_PENDING_COUNTER, action)
  },
  successEmailVerification ({commit}) {
    commit(USER_EMAIL_VERIFIED_SUCCESS)
  },
  userUpdateEmail ({commit}, formFields) {
    commit(USER_UPDATE_EMAIL_REQUEST)

    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'PATCH',
        url: `/api/email`,
        data: JSON.stringify({
          'email': formFields.email,
          'password': formFields.password
        })
      }).then(
        (resp) => {
          commit(USER_UPDATE_EMAIL_SUCCESS)
          resolve(resp)
        },
        (err) => {
          commit(USER_UPDATE_EMAIL_ERROR)
          reject(err)
        }
      )
    })
  }
}

const mutations = {
  [USER_SET_PRELOADER_MANUAL] (state, payload) {
    state.loading = payload
  },
  [USER_CREATE_REQUEST] (state) {
    state.loading = true
  },
  [USER_CREATE_SUCCESS] (state) {
    state.loading = false
    state.error = ''
  },
  [USER_CREATE_FAILURE] (state) {
    state.loading = false
  },
  [USER_LOGIN_REQUEST] (state) {
    state.loading = true
  },
  [USER_LOGIN_SUCCESS] (state, payload) {
    state.loading = false
    state.token = payload.data
    state.error = ''
  },
  [USER_LOGIN_FAILURE] (state) {
    state.loading = false
  },
  [USER_GET_AUTH_REQUEST] (state) {
    state.loading = true
  },
  [USER_GET_AUTH_SUCCESS] (state, payload) {
    state.loading = false
    state.model = {
      ...payload
    }
  },
  [USER_GET_AUTH_FAILURE] (state) {
    state.loading = false
    state.model = null
  },
  [USER_LOGOUT] (state, payload) {
    state.token = null
    state.model = null
    if (!payload) {
      router.push({'name': 'home'})
    }
  },
  [USER_UPDATE_REQUEST] (state) {
    state.loading = true
  },
  [USER_UPDATE_SUCCESS] (state, payload) {
    state.model = payload
    state.loading = false
  },
  [USER_UPDATE_ERROR] (state) {
    state.loading = false
  },
  [USER_GET_ADDRESS_REQUEST] (state) {
    state.loading = true
  },
  [USER_GET_ADDRESS_SUCCESS] (state, payload) {
    state.loading = false
  },
  [USER_GET_ADDRESS_ERROR] (state) {
    state.loading = false
  },
  [USER_GET_PAYMENT_METHODS_REQUEST] (state) {
    state.loading = true
  },
  [USER_GET_PAYMENT_METHODS_SUCCESS] (state) {
    state.loading = false
  },
  [USER_GET_PAYMENT_METHODS_ERROR] (state) {
    state.loading = false
  },

  [USER_DELETE_PAYMENT_METHOD_REQUEST] (state) {
    state.loading = true
  },
  [USER_DELETE_PAYMENT_METHOD_SUCCESS] (state) {
    state.loading = false
  },
  [USER_DELETE_PAYMENT_METHOD_ERROR] (state) {
    state.loading = false
  },

  [USER_GET_RESELLER_PERMITS_REQUEST] (state) {
    state.loading = true
  },
  [USER_GET_RESELLER_PERMITS_SUCCESS] (state) {
    state.loading = false
  },
  [USER_GET_RESELLER_PERMITS_ERROR] (state) {
    state.loading = false
  },

  [USER_CREATE_RESELLER_PERMITS_REQUEST] (state) {
    state.loading = true
  },
  [USER_CREATE_RESELLER_PERMITS_SUCCESS] (state) {
    state.loading = false
  },
  [USER_CREATE_RESELLER_PERMITS_ERROR] (state) {
    state.loading = false
  },
  [USER_UPDATE_RESELLER_PERMITS_REQUEST] (state) {
    state.loading = true
  },
  [USER_UPDATE_RESELLER_PERMITS_SUCCESS] (state) {
    state.loading = false
  },
  [USER_UPDATE_RESELLER_PERMITS_ERROR] (state) {
    state.loading = false
  },
  [USER_DELETE_RESELLER_PERMIT_REQUEST] (state) {
    state.loading = true
  },
  [USER_DELETE_RESELLER_PERMIT_SUCCESS] (state) {
    state.loading = false
  },
  [USER_DELETE_RESELLER_PERMIT_ERROR] (state) {
    state.loading = false
  },

  [USER_DELETE_ADDRESS_REQUEST] (state) {
    state.loading = true
  },
  [USER_DELETE_ADDRESS_SUCCESS] (state) {
    state.loading = false
  },
  [USER_DELETE_ADDRESS_ERROR] (state) {
    state.loading = false
  },
  [USER_SET_ADDRESS_MAIN_REQUEST] (state) {
    state.loading = true
  },
  [USER_SET_ADDRESS_MAIN_SUCCESS] (state) {
    state.loading = false
  },
  [USER_SET_ADDRESS_MAIN_ERROR] (state) {
    state.loading = false
  },
  [USER_SAVE_ADDRESS_REQUEST] (state) {
    state.loading = true
  },
  [USER_SAVE_ADDRESS_SUCCESS] (state) {
    state.loading = false
  },
  [USER_SAVE_ADDRESS_ERROR] (state) {
    state.loading = false
  },
  [USER_SUBMIT_EMAIL_REQUEST] (state) {
    state.loading = true
  },
  [USER_SUBMIT_EMAIL_SUCCESS] (state) {
    state.loading = false
  },
  [USER_SUBMIT_EMAIL_ERROR] (state) {
    state.loading = false
  },
  [USER_RESET_PASSWORD_REQUEST] (state) {
    state.loading = true
  },
  [USER_RESET_PASSWORD_SUCCESS] (state) {
    state.loading = false
  },
  [USER_RESET_PASSWORD_ERROR] (state) {
    state.loading = false
  },
  [USER_GET_ORDERS_REQUEST] (state) {
    state.loading = true
  },
  [USER_GET_ORDERS_SUCCESS] (state) {
    state.loading = false
  },
  [USER_GET_ORDERS_ERROR] (state) {
    state.loading = false
  },
  [USER_GET_ORDER_REQUEST] (state) {
    state.loading = true
  },
  [USER_GET_ORDER_SUCCESS] (state) {
    state.loading = false
  },
  [USER_GET_ORDER_ERROR] (state) {
    state.loading = false
  },
  [USER_UPDATE_ORDERS_REQUEST] (state) {

  },
  [USER_UPDATE_ORDERS_SUCCESS] (state) {

  },
  [USER_UPDATE_ORDERS_ERROR] (state) {

  },
  [USER_DELETE_ORDER_REQUEST] (state) {
    state.loading = true
  },
  [USER_DELETE_ORDER_SUCCESS] (state) {
    state.loading = false
  },
  [USER_DELETE_ORDER_ERROR] (state) {
    state.loading = false
  },
  [USER_CREATE_PURCHASE_REQUEST] (state) {
    state.loading = true
  },
  [USER_CREATE_PURCHASE_SUCCESS] (state) {
    state.loading = false
  },
  [USER_CREATE_PURCHASE_ERROR] (state) {
    state.loading = false
  },
  [USER_FETCH_BRAINTREE_TOKEN_REQUEST] (state) {
    state.loading = true
  },
  [USER_FETCH_BRAINTREE_TOKEN_SUCCESS] (state) {
    state.loading = false
  },
  [USER_FETCH_BRAINTREE_TOKEN_ERROR] (state) {
    state.loading = false
  },
  [USER_CREATE_ORDER_PROCESSING_REQUEST] (state) {
    state.loading = true
  },
  [USER_CREATE_ORDER_PROCESSING_SUCCESS] (state) {
    state.loading = false
  },
  [USER_CREATE_ORDER_PROCESSING_ERROR] (state) {
    state.loading = false
  },
  [USER_CREATE_INVOICE_TOKEN_REQUEST] (state) {
    state.loading = true
  },
  [USER_CREATE_INVOICE_TOKEN_SUCCESS] (state) {
    state.loading = false
  },
  [USER_CREATE_INVOICE_TOKEN_ERROR] (state) {
    state.loading = false
  },
  [USER_CREATE_FEEDBACK_REQUEST] (state) {
    state.loading = true
  },
  [USER_CREATE_FEEDBACK_SUCCESS] (state) {
    state.loading = false
  },
  [USER_CREATE_FEEDBACK_ERROR] (state) {
    state.loading = false
  },
  [USER_UPDATE_PENDING_COUNTER] (state, payload) {
    if (payload === 'increase') {
      ++state.model.pending_orders_count
    } else {
      --state.model.pending_orders_count
    }
  },
  [USER_RESET_PASSWORD_VALIDATION_REQUEST] (state) {
    state.loading = true
  },
  [USER_RESET_PASSWORD_VALIDATION_SUCCESS] (state) {
    state.loading = false
  },
  [USER_RESET_PASSWORD_VALIDATION_ERROR] (state) {
    state.loading = false
  },
  [USER_CREATE_REVIEW_REQUEST] (state) {
    state.loading = true
  },
  [USER_CREATE_REVIEW_SUCCESS] (state) {
    state.loading = false
  },
  [USER_CREATE_REVIEW_ERROR] (state) {
    state.loading = false
  },
  [USER_DELETE_REVIEW_REQUEST] (state) {
    state.loading = true
  },
  [USER_DELETE_REVIEW_SUCCESS] (state) {
    state.loading = false
  },
  [USER_DELETE_REVIEW_ERROR] (state) {
    state.loading = false
  },
  [USER_UPDATE_REVIEW_REQUEST] (state) {
    state.loading = true
  },
  [USER_UPDATE_REVIEW_SUCCESS] (state) {
    state.loading = false
  },
  [USER_UPDATE_REVIEW_ERROR] (state) {
    state.loading = false
  },
  [USER_EMAIL_VERIFIED_SUCCESS] (state) {
    state.model.email_confirmed = true
  },
  [USER_UPDATE_EMAIL_REQUEST] (state) {
    state.loading = true
  },
  [USER_UPDATE_EMAIL_SUCCESS] (state) {
    state.loading = false
  },
  [USER_UPDATE_EMAIL_ERROR] (state) {
    state.loading = false
  },
  [USER_UPDATE_ORDER_REQUEST] (state) {
    state.loading = true
  },
  [USER_UPDATE_ORDER_SUCCESS] (state) {
    state.loading = false
  },
  [USER_UPDATE_ORDER_ERROR] (state) {
    state.loading = false
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
