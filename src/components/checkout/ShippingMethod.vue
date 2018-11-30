<template>
  <div class="shipping-method">
    <loader :position="'fixed'"
            v-if="componentLoader"
            :background="'white'">
    </loader>

    <checkout-header :navs="navs"></checkout-header>

    <div class="container">
      <div class="shipping-method__body">
        <div class="row">
          <div class="shipping-method__body--main col-md-6 col-12 ml-auto">
            <h2 class="h2-secondary title">Choose The Shipping Method</h2>
            <div v-for="(house, key) in shippingWarehousesObject"
                 class="warehouse"
                 :class="{'warehouse--first-item': key === Object.keys(shippingWarehousesObject)[0]}">
              <div class="warehouse__title">
                <span>Warehouse: </span><span>{{ house.warehouseCity }}</span>
              </div>
              <div class="warehouse__method">
                <div class="item radio-default">
                  <input @click="changeMethod($event, key)"
                         v-model="house.shippingMethod"
                         :value="'pickup'"
                         type="radio" />
                  <span class="paragraph-prime radio-label">Pickup</span>
                </div>
                <div class="item radio-default">
                  <input @click="changeMethod($event, key)"
                         v-model="house.shippingMethod"
                         :value="'delivery'"
                         type="radio" />
                  <span class="paragraph-prime radio-label">Delivery</span>
                </div>
              </div>

              <div class="warehouse__body">
                <transition name="fade">
                  <div v-if="house.shippingMethod === 'pickup'"
                       class="warehouse__body--pickup">
                    <h3>Pickup from San Bernardino warehouse</h3>
                    <p class="paragraph-prime">
                      From the store 701 S Gifford Ave # 109, San Bernardino, CA
                      92408, USA. On working days from 10:00 to 21:00, on
                      Saturday from 10:00 to 19:00 and from 10:00 to 17:00 on
                      Sunday, after agreeing with the manager. <br /><br />
                      Since the assortment of the goods is very wide, we can not
                      place it all in the showcases of the exhibition.
                      Therefore, please coordinate your visit in advance.
                    </p>
                  </div>
                </transition>

                <div v-if="house.shippingMethod === 'delivery'"
                     :id="`warehouse-${key}`"
                     class="warehouse__body--delivery">
                  <transition name="fade">
                    <div v-if="!house.editMode && house.defaultAddress">
                      <div v-if="addressPreviewMode(key)"
                           class="address-preview">
                        <div class="address-preview--info"
                             v-if="house.notVerified">
                          <svg-info height="24" width="24"></svg-info>
                          <p>Not verified addresses may not be served by delivery services</p>
                        </div>
                        <app-notification v-if="house.notification || house.error"
                                          @clearNotify="clearNotification(key)"
                                          :notification="house.notification || house.error"
                                          :cancelable="!house.error"
                                          class="notification-wrap">
                        </app-notification>
                        <div class="address-preview__body"
                             :class="{'address-preview--not-verified': !house.defaultAddress.verified}">
                          <div class="active-address">
                            <svg-check></svg-check>
                          </div>
                          <div class="item">
                            <div class="label">Label</div>
                            <span class="value">{{ house.defaultAddress.label }}</span>
                          </div>
                          <div class="item">
                            <div class="label">Name</div>
                            <span class="value">{{ house.defaultAddress.name }}</span>
                          </div>
                          <div class="item">
                            <div class="label">Address</div>
                            <span class="value">{{ house.defaultAddress.addressLine }},
                              <span v-if="house.defaultAddress.addressLine2">
                                {{ house.defaultAddress.addressLine2 }},
                              </span>
                              {{ house.defaultAddress.city }},
                              {{ house.defaultAddress.state }}
                              {{ house.defaultAddress.zip }}, USA
                            </span>
                          </div>
                          <div class="item" v-if="!house.editMode">
                            <div class="label">Phone</div>
                            <span class="value">{{ formatPhoneNumber(house.defaultAddress.phone) }}</span>
                          </div>
                        </div>
                        <div class="address-preview__link"
                             @click="checkIfTemporary(house.defaultAddress, house.warehouseId)">
                          <span class="link-primary">Use a different shipping address</span>
                        </div>
                      </div>
                      <div v-show="addressSelectMode(key)">
                        <div class="form-select" :class="{ 'small-margin': house.notification }">
                          <label>Shipping Address</label>
                          <div class="input-wrap" @click="switchOnSelect($event, house.warehouseId, house)">
                            <v-select @input="changeShippingAddress(house.defaultAddress, key)"
                                      :ref="'select' + house.warehouseId"
                                      :class="{ 'not-verified': house.notVerified }"
                                      v-model="house.defaultAddress"
                                      id="select-shipping-address"
                                      class="vue-select"
                                      :options="selectShippingMethod(house.addressesSelect)"
                                      :searchable="false">
                            </v-select>
                          </div>
                        </div>
                        <div class="alternative">
                          <div class="alternative--pad">
                            <p class="alternative--text"><span>OR</span></p>
                          </div>
                          <button @click="toggleEditMode(key, true)"
                                  class="button-second left-icon">
                            <svg-add></svg-add>
                            <span>Add new address</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </transition>
                  <transition name="fade">
                    <div v-if="addressFormMode(key)">
                      <address-form :relativeComponent="'shipping-method'"
                                    @cancelForm="cancelForm"
                                    @makeMainForWarehouse="setAsDefaultAddress"
                                    :addressesSelect="house.addressesSelect"
                                    :warehouseId="house.warehouseId">
                      </address-form>
                    </div>
                  </transition>
                </div>
              </div>
            </div>

            <confirm-dialog :shippingAddress="shippingAddressConfirm"
                            :type="'shippingAddress'"
                            v-if="showConfirm"
                            @disablePreviewMode="disablePreviewMode"
                            @cancel="hideDialog">
            </confirm-dialog>
          </div>
          <div class="shipping-method__body--check col-md-4 col-12 ml-auto">
            <div class="check" v-sticky="{ zIndex: 100, stickyTop: 32 }">
              <div class="check__header"><h3>Order Summary</h3></div>
              <div class="check__body">
                <div class="check__body--warehouse"
                     v-for="warehouse in warehousesCheck">
                  <div class="title">
                    <span class="title--city">{{ warehouse.city }}</span>
                    <span class="title--price">$ {{ warehouseCountTotalPrice(warehouse) }}</span>
                  </div>
                  <warehouse-products :warehouse="warehouse"></warehouse-products>
                </div>
              </div>
              <div class="check__footer">
                <div class="check__footer--total">
                  <span>Total</span><span>$ {{ toDollarDecimal(getTotalPriceCart) }}</span>
                </div>
                <div class="check__footer--button">
                  <button @click="createPurchase"
                          :disabled="disableStep || openForm"
                          class="button-prime">
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WarehouseProducts from './WarehouseProducts'
import AddressForm from './AddressForm'
import CheckoutHeader from './CheckoutHeader.vue'
import ConfirmDialog from '../modals/ConfirmDialog'
import AppNotification from '../notifications/MainNotify'
import Loader from '@/components/common-components/Loader'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import vSelect from 'vue-select'
import VueSticky from 'vue-sticky'


export default {
  name: 'Checkout',
  directives: {
    sticky: VueSticky
  },
  components: {
    vSelect,
    CheckoutHeader,
    AppNotification,
    AddressForm,
    ConfirmDialog,
    WarehouseProducts,
    Loader
  },
  data () {
    return {
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
          active: false,
          disabled: false,
          icon: 'svg-freight',
          decoration: true,
          decorationDisabled: true
        },
        {
          name: 'Order History',
          active: false,
          disabled: true,
          icon: 'svg-event-note',
          decoration: false
        }
      ],
      shippingWarehousesObject: {},
      enable: true,
      warehousesCheck: [],
      openForm: false,
      disableStep: false,
      showConfirm: false,
      shippingAddressConfirm: null,
      allowLeaveRoute: true,
      componentLoader: false,
      enableWatcherForCart: false
    }
  },
  computed: {
    ...mapGetters([
      'getUserCart',
      'getCartItems',
      'getTotalPriceCart',
      'getTotalQuantityCart',
      'getTotalAmountCart'
    ])
  },
  watch: {
    shippingWarehousesObject: {
      handler: function () {
        this.openForm = _.some(this.shippingWarehousesObject, 'editMode')
      },
      deep: true
    },
    getCartItems: {
      handler: function () {
        if (this.enableWatcherForCart) {
          this.allowLeaveRoute = false
          window.onbeforeunload = null

          this.$store.dispatch('createSystemNotification', {
            type: 'info',
            message: [
              'Products in the cart have been changed.',
              'Please make sure that the products and their',
              'quantity are correct and continue to checkout.'
            ].join(' ')
          })

          this.$router.push({ name: 'cartPage' })
        }
      },
      deep: true
    }
  },
  created () {
    window.onbeforeunload = function () {
      return 'Are you sure?'
    }
  },
  mounted () {
    this.createShippingArray()

    _.forEach(this.getUserCart.cart, (value, key) => {
      this.warehousesCheck.push({
        id: key,
        open: false,
        city: value.city,
        products: value.products
      })
    })

    this.enableWatcherForCart = true
  },
  methods: {
    switchOnSelect (event, key, house) {
      if (!event.target.className) this.changeShippingAddress(house.defaultAddress, key)
      this.$set(this.shippingWarehousesObject[key], 'enableSelect', true)
    },
    setAsDefaultAddress (
      warehouseId,
      address,
      notification,
      assignToUser,
      addAsDefaultToAll
    ) {
      if (assignToUser) {
        _.forEach(this.shippingWarehousesObject, value => {
          value.addressesSelect.push({
            temporary: false,
            label: address.label,
            value: address.token,
            default: address.default,
            verified: address.verified,
            name: address.name,
            phone: address.phone,
            addressLine: address.address_line_1,
            addressLine2: address.address_line_2,
            city: address.city,
            state: address.state,
            zip: address.zip
          })
        })
      }

      this.$set(this.shippingWarehousesObject[warehouseId], 'defaultAddress', {
        temporary: !assignToUser,
        label: address.label,
        value: address.token,
        verified: address.verified,
        name: address.name,
        phone: address.phone,
        addressLine: address.address_line_1,
        addressLine2: address.address_line_2,
        city: address.city,
        state: address.state,
        zip: address.zip
      })

      this.$set(this.shippingWarehousesObject[warehouseId], 'enableSelect', false)

      if (notification) this.$set(this.shippingWarehousesObject[warehouseId], 'notification', notification)

      if (addAsDefaultToAll) this.setAddressToAll(address, null)

      this.cancelForm(warehouseId)
      this.toggleEditMode(warehouseId, false)
      this.enablePreviewMode(warehouseId)

      this.$scrollTo(`#warehouse-${warehouseId}`, 1500, { offset: -400 })
    },
    setAddressToAll (address, notification) {
      _.forEach(this.shippingWarehousesObject, (value, key) => {
        if (!value.defaultAddress) {
          value.defaultAddress = {
            temporary: address.temporary,
            label: address.label,
            value: address.token,
            verified: address.verified,
            notification: notification,
            name: address.name,
            phone: address.phone,
            addressLine: address.address_line_1,
            addressLine2: address.address_line_2,
            city: address.city,
            state: address.state,
            zip: address.zip
          }
        }
        if (notification) this.$set(this.shippingWarehousesObject[key], 'notification', notification)
      })
    },
    changeShippingAddress (value, key) {
      if (!_.some(this.shippingWarehousesObject[key].addressesSelect,
          { value: this.shippingWarehousesObject[key].defaultAddress.value }) &&
          this.shippingWarehousesObject[key].enableSelect
      ) {
        let mainAddress = this.shippingWarehousesObject[key].addressesSelect.find(address => address.default)

        this.shippingWarehousesObject[key].defaultAddress = {
          temporary: mainAddress.temporary,
          label: mainAddress.label,
          value: mainAddress.value,
          default: mainAddress.default,
          verified: mainAddress.verified,
          name: mainAddress.name,
          phone: mainAddress.phone,
          addressLine: mainAddress.addressLine || mainAddress.address_line_1,
          addressLine2: mainAddress.addressLine2 || mainAddress.address_line_2,
          city: mainAddress.city,
          state: mainAddress.state,
          zip: mainAddress.zip
        }
        this.$set(this.shippingWarehousesObject[key], 'enableSelect', false)
      } else {
        if (!value.verified) this.$set(this.shippingWarehousesObject[key], 'notVerified', true)
        else this.$set(this.shippingWarehousesObject[key], 'notVerified', false)

        if (
          !this.shippingWarehousesObject[key].preview &&
          this.shippingWarehousesObject[key].enableSelect
        ) {
          this.shippingWarehousesObject[key].defaultAddress = {
            temporary: value.temporary,
            label: value.label,
            value: value.value,
            default: value.default,
            verified: value.verified,
            name: value.name,
            phone: value.phone,
            addressLine: value.addressLine,
            addressLine2: value.addressLine2,
            city: value.city,
            state: value.state,
            zip: value.zip
          }

          this.enablePreviewMode(key)
        }
      }

      this.checkAlaskaAndHawaii(value, key)
    },
    checkAlaskaAndHawaii (value, key) {
      this.disableStep = false

      if (this.shippingWarehousesObject[key].freight && (value.state === 'AK' || value.state === 'HI')) {
        this.$set(this.shippingWarehousesObject[key], 'error', {
          text: [
            'We are sorry, but one of the items in the',
            ' order can not be delivered by freight to ',
            'Alaska and/or Hawaii.',
            'Please choose other address or delivery method'
          ].join(' '),
          timeout: null,
          type: 'error',
          show: true
        })
      } else {
        this.$set(this.shippingWarehousesObject[key], 'error', null)
      }
      this.validateAlaskaHawaiiGlobal()
    },
    validateAlaskaHawaiiGlobal () {
      this.disableStep = false

      _.forEach(this.shippingWarehousesObject, value => {
        if (
          value.freight &&
          value.shippingMethod === 'delivery' &&
          value.defaultAddress &&
          (value.defaultAddress.state === 'AK' ||
            value.defaultAddress.state === 'HI')
        ) {
          this.disableStep = true
        }
      })
    },
    selectShippingMethod (address) {
      return address.map(g => ({
        label: g.label,
        value: g.value,
        default: g.default,
        verified: g.verified,
        name: g.name,
        phone: g.phone,
        addressLine: g.addressLine,
        addressLine2: g.addressLine2,
        city: g.city,
        state: g.state,
        zip: g.zip
      }))
    },
    fetchAddresses () {
      this.$store.dispatch('fetchAddresses').then(
        response => {
          let mainAddress = response.data.find(address => address.default)

          if (response.data.length) {
            _.forEach(this.shippingWarehousesObject, value => {
              value.addressesSelect = response.data.map(address => ({
                temporary: false,
                label: address.label,
                value: address.token,
                default: address.default,
                verified: address.verified,
                name: address.name,
                phone: address.phone,
                addressLine: address.address_line_1,
                addressLine2: address.address_line_2,
                city: address.city,
                state: address.state,
                zip: address.zip
              }))

              value.defaultAddress = {
                temporary: false,
                label: mainAddress.label,
                value: mainAddress.token,
                default: mainAddress.default,
                verified: mainAddress.verified,
                name: mainAddress.name,
                phone: mainAddress.phone,
                addressLine: mainAddress.address_line_1,
                addressLine2: mainAddress.address_line_2,
                city: mainAddress.city,
                state: mainAddress.state,
                zip: mainAddress.zip
              }
            })
          } else {
            _.forEach(this.shippingWarehousesObject, value => {
              value.addressesSelect = []
            })
          }
        }
      )
    },
    createShippingArray () {
      _.forEach(this.getUserCart.cart, (value, key) => {
        let obj = {
          warehouseId: key,
          warehouseCity: value.city,
          shippingMethod: 'pickup',
          preview: true,
          enableSelect: true,
          editMode: false,
          edit: {
            label: '',
            firstName: '',
            lastName: '',
            addressFirst: '',
            addressSecond: '',
            city: '',
            state: '',
            zip: '',
            phone: ''
          },
          selectedState: {
            label: 'United States',
            value: 0
          }
        }

        _.forEach(value.products, value => {
          if (value.freight) obj.freight = true
        })

        this.$set(this.shippingWarehousesObject, key, obj)
      })
      this.fetchAddresses()
      this.beforeComponentEnterHook()
    },
    changeMethod ($event, key) {
      _.forEach(this.shippingWarehousesObject, (value, key) => {
        this.$set(this.shippingWarehousesObject[key], 'editMode', false)
        if (!value.defaultAddress) {
          this.$set(
            this.shippingWarehousesObject[key],
            'shippingMethod',
            'pickup'
          )
        } else {
          this.$set(this.shippingWarehousesObject[key], 'preview', true)
        }
      })

      this.shippingWarehousesObject[key].shippingMethod = $event.target.value
      this.shippingWarehousesObject[key].editMode = false
      this.shippingWarehousesObject[key].preview = true

      if (
        !this.shippingWarehousesObject[key].addressesSelect.length &&
        $event.target.value !== 'pickup' &&
        !this.shippingWarehousesObject[key].defaultAddress
      ) {
        this.$set(this.shippingWarehousesObject[key], 'editMode', true)
      }

      this.validateAlaskaHawaiiGlobal()
    },
    toggleEditMode (key, enable) {
      _.forEach(this.shippingWarehousesObject, (value, key) => {
        this.$set(this.shippingWarehousesObject[key], 'editMode', false)
        if (value.shippingMethod === 'parcel') {
          this.$set(this.shippingWarehousesObject[key], 'preview', true)
        }
      })

      enable
        ? this.$set(this.shippingWarehousesObject[key], 'editMode', true)
        : this.$set(this.shippingWarehousesObject[key], 'editMode', false)
    },
    checkIfTemporary (address, id) {
      if (address.temporary) {
        this.shippingAddressConfirm = id
        this.showConfirm = true
      } else {
        this.disablePreviewMode(id)
      }
    },
    hideDialog () {
      this.shippingAddressConfirm = null
      this.showConfirm = false
    },
    disablePreviewMode (id) {
      this.$set(this.shippingWarehousesObject[id], 'preview', false)
      if (!this.shippingWarehousesObject[id].addressesSelect.length) {
        this.$set(this.shippingWarehousesObject[id], 'editMode', true)
      } else {
        if (
          !_.some(this.shippingWarehousesObject[id].addressesSelect, {
            value: this.shippingWarehousesObject[id].defaultAddress.value
          })
        ) {
          let mainAddress = this.shippingWarehousesObject[id]
            .addressesSelect.find(address => address.default)

          this.shippingWarehousesObject[id].defaultAddress = {
            temporary: mainAddress.temporary,
            label: mainAddress.label,
            value: mainAddress.value,
            default: mainAddress.default,
            verified: mainAddress.verified,
            name: mainAddress.name,
            phone: mainAddress.phone,
            addressLine: mainAddress.addressLine || mainAddress.address_line_1,
            addressLine2:
              mainAddress.addressLine2 || mainAddress.address_line_2,
            city: mainAddress.city,
            state: mainAddress.state,
            zip: mainAddress.zip
          }
          this.$set(this.shippingWarehousesObject[id], 'enableSelect', false)
        }
      }
      this.hideDialog()
    },
    enablePreviewMode (id) {
      this.$set(this.shippingWarehousesObject[id], 'preview', true)
    },
    clearNotification (key) {
      this.$set(this.shippingWarehousesObject[key], 'notification', null)
    },
    cancelForm (warehouseId) {
      this.shippingWarehousesObject[warehouseId].edit = {
        label: '',
        firstName: '',
        lastName: '',
        addressFirst: '',
        addressSecond: '',
        city: '',
        state: '',
        zip: '',
        phone: ''
      }
      this.shippingWarehousesObject[warehouseId].selectedState = {
        label: 'United States',
        value: 0
      }

      this.toggleEditMode(warehouseId, false)
    },
    formatPhoneNumber (s) {
      if (s) {
        let firstDigits = s.slice(2, 5)
        let secondDigits = s.slice(5, 8)
        let thirdDigits = s.slice(8, 12)
        return `+1 (${firstDigits}) ${secondDigits}-${thirdDigits}`
      }
    },
    addressPreviewMode (warehouseId) {
      return (
        this.shippingWarehousesObject[warehouseId].defaultAddress &&
        !this.shippingWarehousesObject[warehouseId].editMode &&
        this.shippingWarehousesObject[warehouseId].preview
      )
    },
    addressSelectMode (warehouseId) {
      return (
        !this.shippingWarehousesObject[warehouseId].editMode &&
        this.shippingWarehousesObject[warehouseId].addressesSelect.length &&
        !this.shippingWarehousesObject[warehouseId].preview
      )
    },
    addressFormMode (warehouseId) {
      return this.shippingWarehousesObject[warehouseId].editMode
    },
    warehouseCountTotalPrice (warehouse) {
      let price = 0

      _.forEach(warehouse.products, (value, key) => {
        price = price + value.quantity * value.price
      })
      return this.toDollarDecimal(price)
    },
    beforeComponentEnterHook () {
      if (!Object.keys(this.getUserCart.cart).length) {
        this.$router.push({ name: 'orderHistory' })
      }
    },
    createPurchase () {
      let purchase = []

      _.forEach(this.shippingWarehousesObject, value => {
        purchase.push({
          warehouse_id: value.warehouseId,
          shipping_method: value.shippingMethod,
          shipping_address:
            value.shippingMethod === 'delivery'
              ? value.defaultAddress.value
              : null
        })
      })

      this.componentLoader = true
      this.$store.dispatch('createPurchase', { purchase: purchase }).then(
        resp => {
          let redirectPath =
            resp.data.length < 2 && resp.data[0].shipping_method !== 'freight'
              ? 'payment'
              : 'orderHistory '

          setTimeout(() => {
            redirectPath === 'payment'
              ? this.$router.push({
                  name: 'payment-method',
                  query: Object.assign({}, this.$route.query, {
                    order: resp.data[0].id
                  })
                })
              : this.$router.push({ name: 'orderHistory' })

            this.$store.dispatch('deleteWholeCart')
          }, 1000)
        },
        error => {
          this.componentLoader = false
          if (error.status === 422) {
            this.allowLeaveRoute = false
            this.$router.push({ name: 'cartPage', query: { merge: 'conflict' } })
          }
        }
      )
    }
  },
  beforeRouteLeave (to, from, next) {
    if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
      next()
      return
    }

    if (to.name !== 'orderHistory' && to.name !== 'payment-method' && this.allowLeaveRoute) {
      if (confirm('All entered data will be lost. Are you sure you want to refresh the page?')) {
        next()
      } else next('/checkout/shipping-method')
    } else next()
  },
  beforeDestroy () {
    window.onbeforeunload = null
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.notification-wrap {
  margin-top: 16px;
  width: 100%;
  margin-left: 0;
}

.vue-select {
  & /deep/ .vs__selected-options {
    & .selected-tag {
      height: 100%;
      margin: 0 0 0 16px !important;
    }
  }
}

.shipping-method {
  padding-top: 34px;

  &__body {
    padding-top: 32px;
    padding-bottom: 128px;

    &--main {
      padding-top: 22px;

      .title {
        line-height: 1;
        margin-bottom: 29px;
      }

      .warehouse {
        margin-top: 64px;

        &:first-child {
          margin-top: 0;
        }

        &__title {
          span {
            font-family: $montserrat-font;
            font-size: 20px;

            &:first-child {
              color: $paragraph;
            }

            &:last-child {
              font-weight: 500;
              color: $main-dark;
            }
          }
        }

        &__body {
          &--pickup {
            margin-top: 16px;
            padding: 32px;
            background: #e3f2fd;
            border-radius: 4px;

            h3 {
              margin-bottom: 16px;
              color: $main-dark;
            }

            .small-p {
              margin-bottom: 0;
              line-height: 19px;
            }
          }

          &--delivery {
            .address-preview {
              &--info {
                margin-top: 16px;
                display: flex;
                align-items: center;

                p {
                  margin-left: 8px;
                  font-family: $montserrat-font;
                  font-weight: 500;
                  font-size: 12px;
                  line-height: 1;
                  color: $paragraph;
                  margin-bottom: 0;
                }

                svg {
                  fill: $paragraph;
                }
              }

              &__body {
                position: relative;
                padding: 16px;
                margin-top: 24px;
                border-radius: 4px;
                border: 1px solid $main-color;

                .active-address {
                  position: absolute;
                  height: 24px;
                  width: 24px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 100%;
                  background-color: #052af0;
                  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                  top: -12px;
                  right: -12px;

                  svg {
                    height: 13px;
                    width: 13px;
                    fill: white;
                  }
                }

                .item {
                  display: flex;
                  align-items: center;
                  line-height: 1;

                  .label {
                    width: 110px;
                    color: $main-dark;
                    font-weight: 600;
                    font-family: $sours-sans-p-font;
                    font-size: 14px;
                  }

                  .value {
                    color: $main-dark;
                    font-family: $sours-sans-p-font;
                    font-size: 14px;
                    line-height: 19px;
                  }
                }

                .item + .item {
                  margin-top: 16px;
                }
              }

              &--not-verified {
                border: 1px solid $warning;

                .active-address {
                  background-color: $warning;
                }
              }

              &__link {
                margin-top: 16px;
                text-align: center;
              }
            }

            .form-select {
              margin-top: 24px;
              display: flex;
              align-items: center;

              &.small-margin {
                margin-top: 24px;
              }

              label {
                width: 105px;
                margin-right: 32px;
                margin-bottom: 0;
                text-align: right;
                font-weight: 600;
                font-family: $sours-sans-p-font;
                font-size: 14px;
                line-height: 1;
                color: $main-dark;
              }

              .input-wrap {
                position: relative;
                width: 409px;

                #select-shipping-address {
                  width: 100%;
                }
              }

              .not-verified {
                .selected-tag {
                  color: red !important;
                }
              }
            }

            .alternative {
              margin-left: 135px;
              overflow: hidden;
              text-align: center;

              &--pad {
                padding: 0 15px;
              }

              &--text {
                margin: 8px 0;
                overflow: hidden;

                span {
                  display: inline-block;
                  position: relative;
                  font-family: $sours-sans-p-font;
                  font-size: 12px;
                  color: $paragraph;

                  &:before,
                  &:after {
                    content: '';
                    position: absolute;
                    height: 1px;
                    border-bottom: 1px solid $interface-decoration-color;
                    top: 50%;
                    width: 600px;
                  }

                  &:before {
                    right: 100%;
                    margin-right: 15px;
                  }

                  &:after {
                    left: 100%;
                    margin-left: 15px;
                  }
                }
              }

              .button-second {
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;

                svg {
                  margin-top: -2px;
                  width: 18px;
                  height: 18px;
                }
              }
            }
          }
        }

        &__method {
          margin-top: 24px;
          display: flex;

          .item {
            margin-right: 64px;
          }
        }
      }
    }

    &--check {
      margin-left: 16px;

      .check {
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);

        &__header {
          height: 75px;
          box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          background: $main-color;
          justify-content: center;

          h3 {
            margin-bottom: 0;
            font-size: 20px;
            font-weight: 500;
            font-family: $montserrat-font;
            color: white;
          }
        }

        &__body {
          padding: 32px 32px 0 32px;

          &--warehouse {
            margin-top: 34px;
            position: relative;
            padding-bottom: 16px;

            &:after {
              position: absolute;
              content: '';
              bottom: 0;
              height: 1px;
              width: 100%;
              background-color: #eceff1;
              left: 0;
            }

            &:first-child {
              margin-top: 0;
            }

            .title {
              display: flex;
              justify-content: space-between;
              align-items: center;

              &--city {
                font-size: 16px;
                line-height: 22px;
                font-weight: 500;
                font-family: $montserrat-font;
                color: $main-dark;
              }

              &--price {
                font-size: 16px;
                font-family: $montserrat-font;
                color: $main-color;
                font-weight: 500;
              }
            }

            &--products {
              padding: 16px 0 0 16px;
              display: flex;
              align-items: center;
              justify-content: space-between;

              .item {
                &:first-child {
                  max-width: 170px;
                  line-height: 1;
                }

                &:last-child {
                  text-align: right;

                  p {
                    line-height: 1;
                  }

                  .product-total {
                    margin-bottom: 6px;
                    font-family: $montserrat-font;
                    color: $main-dark;
                    font-size: 12px;
                  }

                  .product-price {
                    margin-bottom: 0;
                    font-family: $montserrat-font;
                    color: $paragraph;
                    font-size: 12px;
                  }
                }
              }

              .product-name {
                color: $main-dark;
                font-family: $montserrat-font;
                font-size: 12px;
                line-height: 19px;
              }
            }
          }
        }

        &__footer {
          padding: 24px 32px 32px 32px;

          &--total {
            display: flex;
            align-items: center;
            justify-content: space-between;
            line-height: 1;

            span {
              &:first-child {
                font-family: $montserrat-font;
                font-size: 20px;
                font-weight: 600;
                color: $main-dark;
                text-transform: uppercase;
              }

              &:last-child {
                font-family: $montserrat-font;
                font-size: 20px;
                font-weight: 500;
                color: $main-color;
              }
            }
          }

          &--button {
            margin-top: 24px;

            button {
              height: 40px;
            }
          }
        }
      }
    }
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .shipping-method {
    &__body {
      &--main {
        .title {
          font-size: 26px;
        }
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .shipping-method {
    &__body {
      &--main {
        width: 100%;
        max-width: 100%;
        flex: 0 0 100%;

        .title {
          font-size: 34px;
          text-align: center;
        }

        .warehouse {
          &__body {
            &--delivery {
              .alternative {
                width: 409px;
              }
            }
          }
        }
      }

      &--check {
        margin-top: 64px;
        width: 100%;
        max-width: 100%;
        flex: 0 0 100%;

        .check {
          &__header {
            background: #fafcff;

            h3 {
              color: $main-dark;
            }
          }
        }
      }
    }
  }
}

@media (min-width: $xssm) and (max-width: $sm) {
  .shipping-method {
    &__body {
      &--main {
        width: 100%;
        max-width: 100%;
        flex: 0 0 100%;

        .title {
          font-size: 20px;
          text-align: center;
        }

        .warehouse {
          &__body {
            &--delivery {
              .form-select {
                flex-wrap: wrap;

                label {
                  margin-bottom: 8px;
                  width: 100%;
                  text-align: left;
                }

                .input-wrap {
                  width: 100%;
                }
              }

              .alternative {
                margin-left: 0;
                width: 100%;

                &--text {
                  span {
                    font-size: 16px;
                    text-transform: uppercase;
                  }
                }
              }

              .address-preview {
                &__body {
                  .item {
                    .label {
                      width: 80px;
                    }
                  }
                }
              }
            }
          }
        }
      }

      &--check {
        margin-top: 64px;
        width: 100%;
        max-width: 100%;
        flex: 0 0 100%;

        &__body {
          &--warehouse {
            .title {
              span {
                font-size: 16px;
              }
            }
          }
        }
      }

      .check {
        &__header {
          background: #fafcff;

          h3 {
            color: $main-dark;
          }
        }

        &__body {
          &--warehouse {
            .title {
              span {
                font-size: 16px;
              }
            }
          }
        }
      }
    }

    .form-edit {
      &__item {
        width: 100%;
      }

      .input-wrap {
        width: 100%;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .shipping-method {
    &__body {
      padding-top: 0;

      &--main {
        width: 100%;
        max-width: 100%;
        flex: 0 0 100%;

        .title {
          margin-bottom: 0;
          font-size: 20px;
          text-align: center;
        }

        .warehouse {
          margin-top: 48px;

          &--first-item {
            margin-top: 24px;
          }

          &__title {
            display: flex;
            flex-wrap: wrap;

            span {
              &:first-child {
                width: 100%;
                font-size: 16px;
              }

              &:last-child {
                font-size: 24px;
              }
            }
          }

          &__body {
            &--delivery {
              .form-select {
                flex-wrap: wrap;

                label {
                  margin-bottom: 8px;
                  width: 100%;
                  text-align: left;
                }

                .input-wrap {
                  width: 100%;
                }
              }

              .alternative {
                margin-left: 0;
                width: 100%;

                &--text {
                  span {
                    font-size: 16px;
                    text-transform: uppercase;
                  }
                }
              }

              .address-preview {
                &__body {
                  .item {
                    .label {
                      width: 80px;
                    }

                    .value {
                      width: calc(100% - 80px);
                    }
                  }
                }
              }
            }
          }

          &__method {
            margin-top: 24px;

            .item {
              margin-right: 62px;
            }
          }
        }
      }

      &--check {
        margin-top: 64px;
        width: 100%;
        max-width: 100%;
        flex: 0 0 100%;
      }

      .check {
        &__header {
          background: #fafcff;

          h3 {
            color: $main-dark;
          }
        }

        &__body {
          &--warehouse {
            .title {
              span {
                font-size: 16px;
              }
            }
          }
        }
      }
    }

    .form-edit {
      &__item {
        width: 100%;
      }

      .input-wrap {
        width: 100%;
      }
    }
  }
}
</style>
