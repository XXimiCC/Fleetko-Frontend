<template>
  <div class="payment">
    <checkout-header :navs="navs"></checkout-header>
    <div class="container payment__main">
      <loader
        v-if="isCreatingPurchase"
        :position="'fixed'"
        :background="'white'"
      ></loader>

      <div class="row payment__row">
        <div v-if="!renderReady" class="payment__body col-md-6 ml-auto">
          <div class="payment__loader">
            <div class="payment__loader-image">
              <svg-sync-loader></svg-sync-loader>
            </div>

            <h3 class="h3-secondary">Processing Your Order</h3>
          </div>
        </div>

        <div v-if="renderReady" class="payment__body col-md-6 ml-auto">
          <div
            id="notify"
            class="payment__body--notification"
            :class="{ 'animate-validation': animateValidation }"
          >
            <main-notify
              v-if="Object.keys(notification).length"
              class="error-wrap"
              :notification="notification"
            >
            </main-notify>
          </div>
          <payment-carrier
            v-if="!isPickupMethod"
            :order="order"
          ></payment-carrier>
          <payment-service
            v-if="
              !isPickupMethod &&
                !isFreightMethod &&
                paymentServiceReady &&
                renderReady
            "
            :selectedCarrier="selectedCarrier"
            @setCarrierService="setCarrierService"
            @setCarrierActive="setCarrierActive"
            :carriers="carriers"
          >
          </payment-service>
          <div
            class="payment__body--braintree"
            :class="{ 'm-t-o': isPickupMethod }"
          >
            <div class="braintree-title"><h3>Select Payment Method</h3></div>
            <div class="braintree-wraper">
              <div id="dropin-container"></div>
            </div>
          </div>

          <payment-billing
            v-if="renderReady"
            :selectedAddress="selectedAddress"
            :order="order"
            :addresses="addresses"
            @setSelectedAddress="setSelectedAddress"
            @billingAddressChanged="billingAddressChanged"
          >
          </payment-billing>
          <div class="payment__body--message">
            <div class="payment__body--message--title">
              <h3>Comment or Message</h3>
            </div>
            <div class="payment__body--message--textarea">
              <textarea
                name="payment-comment"
                placeholder="Your Message (optional)"
                :class="{ 'error-textarea': !isCommentValid }"
                @input="validateComment"
                v-model="comment"
                cols="30"
                rows="7"
              >
              </textarea>
              <span v-show="!isCommentValid" class="error-message-input">
                Please enter the message less than 500 characters
              </span>
            </div>
          </div>
        </div>
        <div class="payment__check col-md-4 ml-auto">
          <payment-receipt
            v-sticky="{ zIndex: 100, stickyTop: 32 }"
            v-if="order"
            :selectedCarrier="selectedCarrier"
            :selectedService="selectedService"
            :order="order"
          >
            <template slot="treeButton">
              <div class="payment__body--braintree-button">
                <button
                  :brainTreeNonceResponse="!brainTreeNonceResponse"
                  id="braintree-button"
                  :disabled="!brainTreeReady"
                  class="button-prime"
                >
                  Pay Order
                </button>
              </div>
            </template>
          </payment-receipt>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckoutHeader from '../CheckoutHeader'
import PaymentCarrier from './PaymentCarrier'
import PaymentService from './PaymentDelivery'
import PaymentReceipt from './PaymentReceipt'
import PaymentBilling from './PaymentBilling'
import MainNotify from '../../notifications/MainNotify'
import loader from '../../common-components/Loader'
import Vue from 'vue'
import VueSticky from 'vue-sticky'
import toastr from 'toastr'
import _ from 'lodash'
import dropin from 'braintree-web-drop-in'

export default {
  name: 'payment-method',
  directives: {
    sticky: VueSticky
  },
  data () {
    return {
      renderReady: false,
      isCreatingPurchase: false,
      order: null,
      animateValidation: false,
      navs: [
        {
          name: 'Shopping Cart',
          active: true,
          disabled: false,
          icon: 'svg-basket',
          decoration: true
        },
        {
          name: 'Shipping Method',
          active: true,
          disabled: false,
          icon: 'svg-freight',
          decoration: true,
          decorationDisabled: false
        },
        {
          name: 'Review & Method',
          active: false,
          disabled: false,
          icon: 'svg-credit-card',
          decoration: true,
          decorationDisabled: true
        },
        {
          name: 'Order Review',
          active: false,
          disabled: true,
          icon: 'svg-event-note',
          decoration: false
        }
      ],
      carriers: {},
      addresses: [],
      selectedCarrier: null,
      selectedService: null,
      selectedAddress: null,
      brainTreeToken: null,
      brainTreeNonceResponse: null,
      brainTreeReady: false,
      notification: {},
      paymentServiceReady: false,
      comment: '',
      isCommentValid: true,
      previousRoute: '',
      updateOrderInterval: null,
      isBillingChanged: false
    }
  },
  methods: {
    validateComment () {
      this.isCommentValid = this.comment.length <= 500

      return this.isCommentValid
    },
    billingAddressChanged () {
      this.isBillingChanged = true
    },
    createProcessingOrder () {
      this.isCreatingPurchase = true

      let order = {
        id: this.order.id,
        shipping_rate_id: this.isParcelMethod ? this.selectedService.id : '',
        payment_method_nonce: this.brainTreeNonceResponse,
        user_comment: this.comment,
        billing_address: {
          name: this.selectedAddress.name,
          address_line_1: this.selectedAddress.address_line_1,
          address_line_2: this.selectedAddress.address_line_2
            ? this.selectedAddress.address_line_2
            : '',
          city: this.selectedAddress.city,
          state: this.selectedAddress.state,
          zip: this.selectedAddress.zip,
          phone: this.selectedAddress.phone
        }
      }

      if (!this.isBillingChanged) order.billing_address = null

      this.$store.dispatch('createOrderPayment', order).then(
        response => {
          if (response) {
            this.isCreatingPurchase = false

            this.$router.push({
              name: 'order-review',
              query: { order: order.id }
            })
          }
        },
        error => {
          this.isCreatingPurchase = false

          console.error(error)

          this.brainTreeReady = true

          this.notifyError('Payment Method Invalid')
        }
      )
    },
    fetchOrder () {
      this.$store.dispatch('fetchOrder', this.$route.query.order).then(
        response => {
          this.order = response.data

          if (this.order.shipping_method !== 'pickup') {
            this.selectedAddress = {
              label: this.order.shipping_address.label,
              value: this.order.shipping_address.id,
              verified: this.order.shipping_address.verified,
              name: this.order.shipping_address.name,
              phone: this.order.shipping_address.phone,
              address_line_1: this.order.shipping_address.address_line_1,
              address_line_2: this.order.shipping_address.address_line_2,
              city: this.order.shipping_address.city,
              state: this.order.shipping_address.state,
              zip: this.order.shipping_address.zip
            }
          }

          this.groupOrderProducts(response.data)
          this.beforeComponentEnterHook()
        },
        error => {
          console.error(error)
        }
      )
    },
    fetchUserAddresses () {
      this.$store.dispatch('fetchAddresses').then(
        response => {
          this.addresses = response.data
          // eslint-disable-next-line
        },
        error => {
          console.error(error)
        }
      )
    },
    groupOrderProducts (order) {
      let group = _.groupBy(order.order_items, 'product_id')
      let products = []

      // eslint-disable-next-line
      for (let [key, value] of Object.entries(group)) {
        products.push({
          dealer_id: value[0].product.dealer_id,
          dealer_name: value[0].product.dealer_name,
          description: value[0].product.description,
          id: value[0].product.id,
          freight: value[0].product.freight,
          name: value[0].product.name,
          price: value[0].price,
          part_number: value[0].product.part_number,
          sku: value[0].product.sku,
          quantity: value.length
        })
      }
      this.order.products = products
    },
    groupShippingRates () {
      let carriers = _.groupBy(this.order.shipping_rates, 'carrier')

      for (let [key, value] of Object.entries(carriers)) {
        Vue.set(this.carriers, key, value)
      }

      if (Object.keys(this.carriers).length < 2) {
        let objectKey = Object.keys(this.carriers)[0]

        this.selectedCarrier = {}

        Vue.set(this.selectedCarrier, objectKey, this.carriers[objectKey])
      }

      this.paymentServiceReady = true
    },
    setCarrierService (service) {
      this.selectedService = service

      this.updateOrderRates()
    },
    updateOrderRates () {
      this.$store
        .dispatch('userUpdateOrder', {
          id: this.order.id,
          rateId: this.selectedService.id
        })
        .then(
          response => {
            this.order.price = response.data.price
            this.order.sales_tax_amount = response.data.sales_tax_amount
            this.order.sales_tax_rate = response.data.sales_tax_rate
            this.order.shipping_fee = response.data.shipping_fee
            this.order.total_cost = response.data.total_cost
          },
          error => {
            console.error(error)
          }
        )
    },
    setCarrierActive (carrierKey) {
      this.selectedCarrier = {}
      Vue.set(this.selectedCarrier, carrierKey, this.carriers[carrierKey])
    },
    setSelectedAddress (address) {
      this.selectedAddress = address

      this.fetchUserAddresses()
    },
    fetchBraintreeToken () {
      this.$store.dispatch('fetchBraintreeToken').then(
        response => {
          this.brainTreeToken = response.data.token
          this.initBraintreeDropin()
        },
        error => {
          console.error(error)
        }
      )
    },
    beforeComponentEnterHook () {
      const countingRates = this.order.status === 'draft'

      if (countingRates) {
        this.waitOrderUpdate()
      } else if (this.order.status !== 'pending_payment' && !countingRates) {
        this.$router.push({ name: 'orderHistory' })
      } else {
        this.groupShippingRates()
        this.renderReady = true
        this.fetchBraintreeToken()
      }
    },
    waitOrderUpdate () {
      this.updateOrderInterval = setInterval(
        this.changeOrderStatus.bind(this),
        3000
      )
    },
    changeOrderStatus () {
      this.$store.dispatch('listOrderUpdates', this.order.id).then(resp => {
        resp.data.forEach(order => {
          if (order.status === 'pending_payment') {
            this.$store.dispatch('updateUserPendingCounter', 'increase')

            clearInterval(this.updateOrderInterval)
            this.fetchOrder()
          } else if (order.status === 'failed') {
            this.$router.push({ name: 'orderHistory' })

            toastr.warning(
              'Sorry the technical error prevented the execution of the order. Please contact the support center for additional details.',
              '',
              this.setToastr('warning')
            )
          }
        })
      })
    },
    notifyError (message) {
      this.notification = {
        type: 'error',
        text: message
      }

      Vue.nextTick(() => this.$scrollTo('#notify', 500, { offset: -32 }))
    },
    initBraintreeDropin () {
      let button = document.querySelector('#braintree-button')
      let self = this

      dropin.create(
        {
          authorization: self.brainTreeToken,
          selector: '#dropin-container',
          paypal: {
            flow: 'vault',
            buttonStyle: {
              color: 'gold',
              shape: 'pill',
              size: 'medium'
            }
          },
          card: {
            overrides: {
              styles: {}
            }
          }
        },
        function (err, instance) {
          if (err) {
            // An error in the create call is likely due to incorrect configuration values or network issues
            return
          }

          self.brainTreeReady = true

          button.addEventListener('click', function () {
            if (!self.validateComment()) return

            self.animateValidation = true
            self.brainTreeReady = false

            instance.requestPaymentMethod(function (err, payload) {
              if (err) {
                self.brainTreeReady = true

                self.notifyError(err.message)

                setTimeout(() => {
                  self.animateValidation = false
                }, 200)
                // An appropriate error will be shown in the UI
                return
              } else {
                self.brainTreeNonceResponse = payload.nonce
                if (self.isPickupMethod || self.isFreightMethod) {
                  if (!self.selectedAddress) {
                    self.notifyError('Please select a billing address')

                    self.brainTreeReady = true
                  } else {
                    self.notification = {}

                    self.createProcessingOrder()
                  }
                } else {
                  if (_.isEmpty(self.selectedCarrier)) {
                    self.notifyError('Please select a carrier')

                    self.brainTreeReady = true
                  } else if (!self.selectedAddress) {
                    self.notifyError('Please select a billing address')

                    self.brainTreeReady = true
                  } else if (!self.selectedService) {
                    self.notifyError('Please select a carrier service')

                    self.brainTreeReady = true
                  } else {
                    self.notification = {}

                    self.createProcessingOrder()
                  }
                }
              }
              setTimeout(() => {
                self.animateValidation = false
              }, 500)
            })
          })
        }
      )
    }
  },
  computed: {
    isPickupMethod () {
      if (this.order) return this.order.shipping_method === 'pickup'
    },
    isParcelMethod () {
      if (this.order) return this.order.shipping_method === 'parcel'
    },
    isFreightMethod () {
      if (this.order) return this.order.shipping_method === 'freight'
    }
  },
  created () {
    this.fetchOrder()
    this.fetchUserAddresses()
  },
  beforeDestroy () {
    clearInterval(this.updateOrderInterval)
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.previousRoute = from.name
    })
  },
  components: {
    CheckoutHeader,
    PaymentCarrier,
    PaymentService,
    PaymentReceipt,
    PaymentBilling,
    MainNotify,
    loader
  }
}
</script>

<style scoped lang="scss">
@keyframes rotation {
  from {
    transform: rotateZ(-359deg) rotateY(180deg);
  }
  to {
    transform: rotateZ(0) rotateY(180deg);
  }
}

.payment {
  padding-top: 34px;
  margin-bottom: 140px;
  &__loader {
    max-width: 295px;
    margin: 80px auto 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    h3 {
      margin-bottom: 18px;
    }
  }
  &__loader-image {
    margin-bottom: 32px;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #d0defb;
    border-radius: 100%;
    animation: rotation 2s infinite linear;
    svg {
      width: 30px;
      height: 40px;
      fill: $main-color;
    }
  }
  &__main {
    margin-top: 32px;
  }
  &__body {
    &--notification {
      transition-delay: 0.3s;
      transition-duration: 0.2s;
      &.animate-validation {
        filter: brightness(1.5);
      }
      .error-wrap {
        margin-bottom: 32px;
      }
    }
    &--braintree {
      margin-top: 64px;
      .braintree-title {
        text-align: center;
        h3 {
          color: $main-dark;
          margin-bottom: 32px;
        }
      }
    }
    &--message {
      &--title {
        text-align: center;
        h3 {
          color: $main-dark;
          margin-bottom: 28px;
        }
      }
      &--textarea {
        position: relative;
        textarea {
          padding: 8px 16px;
          resize: none;
          width: 100%;
          height: 160px;
          border-radius: 4px;
          border: 1px solid #b4bac7;
          &:focus {
            outline: none;
          }
          &::placeholder {
            font-size: 14px;
            color: $paragraph;
            font-family: $sours-sans-p-font;
          }
        }

        .error-message-input {
          bottom: -15px;
        }
      }
    }
  }
  .m-t-o {
    margin-top: 32px;
  }
}

@media (min-width: $xs) and (max-width: $md) {
  .payment {
    &__row {
    }
    &__body {
      order: 1;
      flex: 0 0 100%;
      max-width: 100%;
    }
    &__check {
      margin: 36px;
      order: 2;
      flex: 0 0 100%;
      max-width: 100%;
    }
    &__main {
      padding: 0 96px;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .payment {
    &__main {
      padding: 0 16px;
    }
  }
}
</style>
