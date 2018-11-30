<template>
  <div id="anchor-scrolling">
    <div v-if="!editMode" class="col-xl-12 p-0 account-info__orders">
      <p class="account-info__orders--title">Address Book</p>
      <div class="row">
        <app-notification v-if="notification"
                          @clearNotify="notification = null"
                          :notification="notification"
                          :cancelable="true"
                          class="notification-wrap col-md-6">
        </app-notification>
      </div>

      <div class="account-info__orders--description">
        <div class="item"><svg-info height="24" width="24"></svg-info></div>
        <div class="item">
          <p>To select the current address, click on the card with this address</p>
          <p v-if="notVerifiedOne">Not verified addresses may not be served by delivery services</p>
        </div>
      </div>

      <div v-if="addressbookLoader" class="address__preloader"><loader class="address__preloader--cube"></loader></div>

      <transition-group v-if="!addressbookLoader"
                        mode="out-in"
                        name="list"
                        tag="div"
                        class="account-info__orders--body row">
        <div v-for="(address, i) in addresses"
             :key="address.id"
             class="col-xl-6 col-md-6 address-wrap">
          <div class="account-info__orders--body--address"
               @click.prevent="makeActive(address, i)"
               :class="{
                 'account-info__orders--body--address--address-main': address.default,
                 'account-info__orders--body--address--address-not-verify':  address.default && !address.verified
               }">

            <div v-if="address.default" class="active-address"><svg-check></svg-check></div>
            <div v-if="!address.verified" class="address-not-verified">
              <div class="relative"><div class="rotate">Not Verified</div></div>
            </div>
            <div class="line label-line"><span>Label</span><span>{{ address.label }}</span></div>
            <div class="line"><span>Full Name</span><span>{{ address.name }}</span></div>
            <div class="line">
              <span v-text="$mq === 'sm' ? 'Address' : 'Address Line 1'"></span>
              <span>{{ address.address_line_1 }}</span>
            </div>
            <div class="line">
              <span v-text="$mq === 'sm' ? 'Address 2' : 'Address Line 2'"></span>
              <span>{{ address.address_line_2 }}</span>
            </div>
            <div class="line"><span>City</span><span>{{ address.city }}</span></div>
            <div class="line"><span>State</span><span v-text="StateName(address.state)"></span></div>
            <div class="line"><span>ZIP</span><span>{{ address.zip }}</span></div>
            <div class="line"><span>Phone</span><span>{{ formatPhoneNumber(address.phone) }}</span>
            </div>
            <div class="actions">
              <div @click.stop="makeEditable(address, i)" class="item">
                <svg-edit class="edit"></svg-edit>
                <span>Edit</span>
              </div>
              <div class="item" @click.stop="showDialog(address, i)">
                <svg-delete class="delete"></svg-delete>
                <span>Delete</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="addresses.length > 0"
             :key="-1"
             class="col-xl-6 col-md-6 address-wrap">
          <div class="account-info__orders--body--address">
            <div class="add-new" @click="addNew">
              <svg-plus></svg-plus>
              <h3>Add New Shipping Address</h3>
            </div>
          </div>
        </div>
      </transition-group>
      <confirm-dialog :addressName="addressName"
                      :type="'deleteAddress'"
                      v-if="showConfirm"
                      @confirm="deleteAddress"
                      @cancel="hideDialog">
      </confirm-dialog>
    </div>
    <!-- If edit mode is enable -->
    <div v-else class="account-info__orders account-info__edit">
      <div class="account-info__edit-address">
        <p class="account-info__orders--title">Address Book</p>
        <div class="account-info__edit-address--form-item">
          <label>Label</label>
          <div class="input-wrap">
            <input :class="{ 'input-error': errors.has('label') }"
                   v-validate="'required|max:19'"
                   class="input-default"
                   name="label"
                   v-model="edit.label"
                   @input="formInputHandler"
                   placeholder="House, Work, etc."
                   type="text" />
            <span v-show="errors.has('label')" class="error-message-input">{{ errors.first('label') }}</span>
          </div>
        </div>

        <div class="account-info__edit-address--form-item">
          <label>First Name</label>
          <div class="input-wrap">
            <input :class="{ 'input-error': errors.has('first-name') }"
                   class="input-default"
                   v-validate="'required|max:20'"
                   name="first-name"
                   v-model="edit.firstName"
                   @input="formInputHandler"
                   placeholder="John"
                   type="text" />
            <span v-show="errors.has('first-name')" class="error-message-input">{{ errors.first('first-name') }}</span>
          </div>
        </div>

        <div class="account-info__edit-address--form-item">
          <label>Last Name</label>
          <div class="input-wrap">
            <input :class="{ 'input-error': errors.has('last-name') }"
                   class="input-default"
                   v-validate="'required|max:20'"
                   name="last-name"
                   v-model="edit.lastName"
                   @input="formInputHandler"
                   placeholder="Doe"
                   type="text" />
            <span v-show="errors.has('last-name')" class="error-message-input">{{ errors.first('last-name') }}</span>
          </div>
        </div>

        <div class="account-info__edit-address--form-item">
          <label>Address Line 1</label>
          <div class="input-wrap">
            <input :class="{ 'input-error': errors.has('address') }"
                   class="input-default"
                   v-validate="'required|max:100'"
                   name="address"
                   placeholder="Street address"
                   v-model="edit.addressFirst"
                   @input="formInputHandler"
                   type="text" />
            <span v-show="errors.has('address')" class="error-message-input">
              {{ errors.first('address') ? errors.first('address').slice(0, -1) : '' }}
            </span>
          </div>
        </div>

        <div class="account-info__edit-address--form-item">
          <label>Address Line 2</label>
          <div class="input-wrap">
            <input class="input-default"
                   :class="{ 'input-error': errors.has('address-2') }"
                   v-validate="'max:100'"
                   placeholder="Apt, Suite, Unit, Bldg, etc. (optional)"
                   @input="formInputHandler"
                   name="address-line"
                   v-model="edit.addressSecond"
                   type="text" />
            <span v-show="errors.has('address-2')" class="error-message-input">
              {{ errors.first('address-line') ? errors.first('address-line').split('-').join('').slice(0, -1) : ''}}
            </span>
          </div>
        </div>

        <div class="account-info__edit-address--form-item">
          <label>City</label>
          <div class="input-wrap">
            <input :class="{ 'input-error': errors.has('city') }"
                   class="input-default"
                   v-validate="'required|max:50'"
                   name="city"
                   placeholder="Anytown"
                   v-model="edit.city"
                   @input="formInputHandler"
                   type="text" />
            <span v-show="errors.has('city')" class="error-message-input">
              {{ errors.first('city') ? errors.first('city').slice(0, -1) : '' }}</span>
          </div>
        </div>

        <div class="account-info__edit-address--form-item">
          <label>State</label>
          <div class="input-wrap">
            <div>
              <v-select id="select-state"
                        data-vv-value-path="selectedState"
                        data-vv-name="state"
                        @input.self="formInputHandler($event)"
                        v-validate:selectedState="'required||custom_validation'"
                        class="vue-select"
                        :searchable="false"
                        v-model="selectedState"
                        :class="{
                          'select-valid-error': errors.has('state'),
                          'select-placeholder': selectedState && !selectedState.value
                        }"
                        :options="selectStates">
              </v-select>
            </div>
            <span v-show="errors.has('state')" class="error-message-input">{{ errors.first('state') }}</span>
          </div>
        </div>

        <div class="account-info__edit-address--form-item">
          <label>ZIP Code</label>
          <div class="input-wrap">
            <input @keydown="keyHandler($event)"
                   :class="{ 'input-error': errors.has('zip') }"
                   class="input-default zip-input"
                   v-validate="'required|min:5|max:5'"
                   v-model="edit.zip"
                   @input="formInputHandler"
                   name="zip"
                   placeholder="#####"
                   type="number"/>
            <div class="counter" :class="{ 'counter--error': edit.zip.length !== 12 && errors.has('zip') }">
              <span>{{ edit.zip.length }} / 5</span>
            </div>
            <span v-show="errors.has('zip')" class="error-message-input">{{ errors.first('zip') }}</span>
          </div>
        </div>
        <div class="account-info__edit-address--form-item">
          <label>Phone</label>
          <div class="input-wrap">
            <div>
              <masked-input :class="{ 'input-error': errors.has('phone') }"
                            class="input-default"
                            @input="formInputHandler($event)"
                            v-model="edit.phone"
                            :mask="['+', '1','(',/[1-9]/,/\d/,/\d/,')',' ',/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/]"
                            placeholder="+1(201) 555-0123"
                            type="tel"
                            v-validate:phoneNumber="'required|min:12'"
                            data-vv-name="phone"
                            data-vv-value-path="phoneNumber">
              </masked-input>
            </div>
            <div class="counter"
                 :class="{ 'counter--error': phoneNumber.length !== 12 && errors.has('phone') }">
              <span>{{ phoneNumber.length }} / 12</span>
            </div>
            <span v-show="errors.has('phone')" class="error-message-input">{{ errors.first('phone') }}</span>
          </div>
        </div>

        <div class="account-info__edit-address--form-item button-margin">
          <app-notification v-if="maxAddresses && !editable"
                            :notification="{
                            text: 'You have exceeded the allowable limit of addresses in the Address Book. Please, delete or edit out-of-date addresses from the Address Book',
                            type: 'warning',
                            show: true
                          }"
                            class="notification-wrap max-addresses">
          </app-notification>
          <button @click.stop="validateAddress"
                  :disabled="(!editable && maxAddresses) || preloader || (editable && !wasChanged)"
                  v-text="!editable ? 'create address' : 'Update information'"
                  class="button-prime">
          </button>
        </div>
        <div v-if="addresses.length > 0" class="account-info__edit-address--form-item">
          <button @click="editMode = false"
                  :disabled="addresses.length < 1"
                  class="button-second cancel-form">
            Cancel
          </button>
        </div>
      </div>
      <div class="account-info__stub">
        <img :src="imageSrc('address-book-illustration.svg')" alt="" />
        <h3 class="h3-secondary">Useful Tips And Information</h3>
        <p class="paragraph-tertiary">
          Adresses from the Address Book will be used in the checkout process.
          You will be able to use address from the address book to select
          delivery and billing adderess.
        </p>
        <br />
        <p class="paragraph-tertiary">
          Better use some short and understandable label so that you can easily
          understand what address you need to select through the checkout
          process.
        </p>
        <br />
        <p class="paragraph-tertiary">
          You could add up to ten addresses in the Address Book.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import MaskedInput from 'vue-text-mask'
import VeeValidate from 'vee-validate'
import states from '../../json/states.json'
import vSelect from 'vue-select'
import AppNotification from '../notifications/MainNotify.vue'
import ConfirmDialog from '../modals/ConfirmDialog.vue'
import toastr from 'toastr'
import _ from 'lodash'
import Loader from '@/components/common-components/Loader'
import utils from '@/mixins/utils'

Vue.use(VeeValidate, {
  locale: 'en'
})

VeeValidate.Validator.extend('custom_validation', value => value.value !== 0)

export default {
  name: 'AddressBokk',
  mixins: [utils],
  components: {
    MaskedInput,
    vSelect,
    AppNotification,
    ConfirmDialog,
    Loader
  },
  data () {
    return {
      addressbookLoader: false,
      firstName: '',
      lastName: '',
      email: 'test@gmail.com',
      editMode: null,
      editable: false,
      states: states,
      addressID: null,
      addressName: '',
      selectedState: {
        label: 'Alabama',
        value: 0
      },
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
      phoneOldValue: '',
      selectedStateOldValue: null,
      addresses: [],
      showConfirm: false,
      deleteSuccess: false,
      notification: null,
      notVerifiedOne: false,
      wasChanged: false
    }
  },
  computed: {
    maxAddresses () {
      return this.addresses.length >= 10
    },
    selectStates () {
      return this.states.map(g => ({ label: g.name, value: g.abbreviation }))
    },
    preloader () {
      return this.$store.getters.preloader
    },
    phoneNumber () {
      return this.edit.phone.replace(/[^0-9a-zA-Z+]/g, '')
    },
    currentPage () {
      return this.$route.name
    },
    ...mapGetters(['isAuth', 'userInfo', 'preloader'])
  },
  watch: {
    editMode (v) {
      if (!v) {
        this.addressID = null
        this.wasChanged = false
        this.phoneOldValue = ''
        this.selectedStateOldValue = null
      }

      this.$scrollTo(`#anchor-scrolling`, 1500, { offset: -200 })
    }
  },
  mounted () {
    this.getAllAddresses(true)
  },
  methods: {
    formInputHandler (e) {
      if (!e.target) return

      this.wasChanged = true
    },
    keyHandler (e) {
      if (e.keyCode === this.EVENT_KEY_SPACE || !_.includes(this.NUMBER_INPUT_AVAILABLE_KEYS, e.keyCode)) {
        e.preventDefault()
      }
    },
    clearForm () {
      this.edit = {
        label: '',
        firstName: '',
        lastName: '',
        addressFirst: '',
        addressSecond: '',
        city: '',
        zip: '',
        phone: ''
      }
      this.selectedState = {
        label: 'Alabama',
        value: 0
      }
    },
    checkVerified () {
      this.notVerifiedOne = this.addresses.some(address => !address.verified)
    },
    getAllAddresses (cancelable) {
      this.addressbookLoader = true
      this.$store.dispatch('fetchAddresses')
        .then(response => {
          this.editMode = !cancelable || !response.data.length
          this.addresses = response.data
          this.checkVerified()
          this.addressbookLoader = false
        },
        () => {
          this.addressbookLoader = false
        }
      )
      if (cancelable) this.editable = false
    },
    validateAddress () {
      this.$validator.validateAll().then(result => {
        if (result) this.createNewAddress()
      })
    },
    createNewAddress () {
      let address = {
        disposable: false,
        label: this.edit.label,
        firstName: this.edit.firstName,
        lastName: this.edit.lastName,
        addressFirst: this.edit.addressFirst,
        addressSecond: this.edit.addressSecond,
        city: this.edit.city,
        state: this.selectedState.value,
        zip: this.edit.zip,
        phoneNumber: this.phoneNumber,
        addressID: this.addressID
      }

      this.$store.dispatch('saveAddress', { address: address })
        .then(response => {
          if (response.meta.messages.address_correction) {
            toastr.info(response.meta.messages.address_correction[0], '', this.setToastr('warning', 5000))
          } else if (response.meta.messages.address_warning) {
            this.notification = {
              text: response.meta.messages.address_warning[0],
              timeout: null,
              type: 'info',
              cancelable: true,
              show: true
            }
          }

          this.getAllAddresses(true)
        }
      )
    },
    makeActive (address) {
      if (!address.default && !this.preloader) {
        this.$store.dispatch('setAddressMain', { id: address.id })
          .then(() => {
              this.addresses.forEach(localAddresses => {
                localAddresses.default = false

                if (localAddresses.id === address.id) address.default = true
              })
            }
          )
      }
    },
    makeEditable (address) {
      this.edit = {
        firstName: address.name.substr(0, address.name.indexOf(' ')),
        lastName: address.name.substr(address.name.indexOf(' ') + 1),
        addressFirst: address.address_line_1,
        addressSecond: address.address_line_2,
        city: address.city,
        zip: address.zip,
        phone: address.phone,
        label: address.label
      }

      this.editMode = true
      this.selectedState = this.stateCode(address.state)
      this.phoneOldValue = address.phone
      this.selectedStateOldValue = this.selectedState.value
      this.addressID = address.id
      this.editable = true
    },
    showDialog (address) {
      this.showConfirm = true
      this.addressID = address.id
      this.addressName = address.label
    },
    hideDialog () {
      this.showConfirm = false
      this.addressID = null
      this.deleteSuccess = false
      this.addressName = ''
    },
    deleteAddress () {
      if (!this.preloader) {
        this.$store.dispatch('deleteAddress', { id: this.addressID })
          .then(() => {
            this.addressID = null
            this.addressName = ''
            this.showConfirm = false
            this.clearForm()
            this.getAllAddresses(true)
            }
          )
      }
    },
    StateName (abbr) {
      return this.states.find(state => state.abbreviation === abbr).name
    },
    stateCode (abbr) {
     const st = this.states.find(state => state.abbreviation === abbr)

     return { label: st.name, value: st.abbreviation }
    },
    addNew () {
      this.clearForm()
      this.editMode = true
      this.editable = false
    },
    formatPhoneNumber (s) {
      let firstDigits = s.slice(2, 5)
      let secondDigits = s.slice(5, 8)
      let thirdDigits = s.slice(8, 12)
      return `+1 (${firstDigits}) ${secondDigits}-${thirdDigits}`
    }
  }
}
</script>

<style lang="scss" scoped>

.address {
  &__preloader {
    margin: 100px 0;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 1s;
}

.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.no-pad-hint {
  padding: 0;
}

.account-info {
  &__orders {
    &--title {
      margin-bottom: 32px;
      font-family: $montserrat-font;
      font-size: 34px;
      font-weight: 500;
      line-height: 1;
      color: $main-dark;
    }
    &--subtitle {
      margin-top: 13px;
      margin-bottom: 0;
      font-family: $sours-sans-p-font;
      font-size: 14px;
      line-height: 1;
      color: #9e9e9e;
    }
    &--description {
      margin-bottom: 0;
      display: flex;
      align-items: center;
      .item {
        &:first-child {
          display: flex;
          align-items: center;
        }
        p {
          color: $main-grey;
          &:first-child {
            margin-bottom: 8px;
            font-family: $montserrat-font;
            font-size: 14px;
            font-weight: 600;
            line-height: 1;
          }
          &:last-child {
            margin-top: 0;
            margin-bottom: 0;
            font-family: $montserrat-font;
            font-size: 14px;
            font-weight: 400;
            line-height: 1;
          }
        }
      }
      svg {
        margin-right: 16px;
        height: 24px;
        width: 24px;
        fill: $main-grey;
      }
    }
    &--body {
      margin-top: 19px;
      .col-xl-6 {
        margin-bottom: 32px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      &--address {
        position: relative;
        height: 373px;
        padding: 29px 37px 32px 33px;
        background-color: #ffffff;
        border: 1px solid $grey;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        .address-not-verified {
          position: absolute;
          top: 104px;
          right: 0;
          width: 32px;
          height: 135px;
          .relative {
            width: 32px;
            height: 135px;
            position: relative;
          }
          .rotate {
            display: flex;
            justify-content: center;
            align-items: center;
            right: 32px;
            width: 135px;
            top: 135px;
            height: 32px;
            transform: rotate(90deg) translate(0, -100%);
            transform-origin: 100% 0;
            position: absolute;
            border-radius: 0 0 4px 4px;
            font-family: $montserrat-font;
            font-size: 12px;
            color: white;
            font-weight: 500;
            background: #eceff1;
          }
        }
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
        &--address-main {
          border: 1px solid #052af0;
        }
        &--address-not-verify {
          border: 1px solid $warning;
          box-shadow: 0 0 12px 2px rgba(0, 0, 0, 0.05);
          .active-address {
            background-color: $warning;
          }
          .address-not-verified {
            .rotate {
              background: $warning;
            }
          }
        }
        .add-new {
          padding: 77px 22px;
          display: flex;
          align-items: center;
          flex-direction: column;
          cursor: pointer;
          svg {
            height: 64px;
            fill: $main-grey;
          }
          h3 {
            margin-top: 32px;
            font-family: $montserrat-font;
            font-size: 24px;
            color: $main-grey;
            line-height: 1;
          }
        }
        .line {
          display: flex;
          span {
            display: block;
            font: 16px/28px $sours-sans-p-font;
            &:first-child {
              min-width: 100px;
              color: $main-dark;
              font-weight: 600;
            }
            &:last-child {
              width: 213px;
              margin-left: 63px;
              color: $dark-grey;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        .label-line + .line {
          margin-top: 16px;
        }
        .label-line {
          height: 24px;
          align-items: center;
          span {
            &:last-child {
              font-family: $montserrat-font;
              font-size: 20px;
              font-weight: 500;
              color: $main-dark;
            }
          }
        }
        .actions {
          margin-top: 30px;
          display: flex;
          padding-left: 160px;
          .item {
            display: flex;
            align-items: center;
            cursor: pointer;
            .edit {
              height: 16px;
              fill: #989898;
            }
            .delete {
              height: 16px;
              fill: #989898;
            }
            span {
              margin-left: 3px;
              font-family: $sours-sans-p-font;
              font-size: 14px;
              line-height: 1;
              color: #989898;
            }
            &:hover {
              span {
                color: $main-color;
              }
              svg {
                fill: $main-color;
              }
            }
          }
          .item + .item {
            margin-left: 31px;
          }
        }
        &:hover {
          box-shadow: 0 5px 6.58px 0.42px rgba(0, 0, 0, 0.05),
            0 2px 9.8px 0.2px rgba(0, 0, 0, 0.02);
        }
      }
    }
  }
  &__edit {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  &__stub {
    flex: 0 0 360px;
    text-align: center;
    img {
      margin-bottom: 32px;
      width: 100%;
    }

    h3 {
      margin-bottom: 20px;
    }

    p {
      margin-bottom: 0;
    }
  }
  &__edit-address {
    &--form-item {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      position: relative;
      margin-bottom: 25px;
      .zip-input {
        padding-right: 60px;
      }
      .error-message-input {
        position: absolute;
        bottom: -18px;
        left: 0;
        line-height: 1;
      }
      label {
        width: 96px;
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
        width: 352px;
        .counter {
          position: absolute;
          bottom: 10px;
          right: 14px;
          span {
            font-family: $sours-sans-p-font;
            color: $paragraph;
            font-size: 14px;
          }
          &--error {
            span {
              color: $input-error-border;
            }
          }
        }
      }
      .vue-select {
        width: 544px;
        border-radius: 4px;
        & /deep/ .selected-tag {
          height: 100%;
          padding: 0;
          margin: 0 0 0 14px !important;
        }

        & /deep/ .vs__selected-options {
          border-radius: 4px;
          padding: 0 !important;
        }
        &.select-valid-error {
          & /deep/ .dropdown-toggle {
            background-color: transparent;
          }
        }
      }
      .select-wrap {
        width: 544px;
        position: relative;
        svg {
          position: absolute;
          right: 18px;
          top: 12px;
          width: 24px;
          fill: #1565c0;
        }
      }
    }
    .button-margin {
      max-width: 480px;
      display: flex;
      flex-flow: column nowrap;
      margin-bottom: 16px;
    }
    .button-wrap {
      width: 753px;
    }
    button {
      margin-left: 127px;
      height: 40px;
      width: 352px;
    }
  }
}

.notification-wrap {
  margin-bottom: 24px;
  width: 100%;
  margin-left: 0;
  &.max-addresses {
    align-self: flex-end;
    max-width: 352px;
    & /deep/ .notification__body--info {
      padding: 16px;
    }
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .account-info {
    &__orders {
      &--body {
        &--address {
          .add-new {
            h3 {
              font-size: 20px;
            }
          }
        }
      }
    }
  }
}

@media (min-width: 850px) and (max-width: $md) {
  .account-info {
    &__orders {
      &--body {
        &--address {
          .add-new {
            padding: 77px 16px;
            h3 {
              font-size: 20px;
            }
          }
        }
      }
    }
  }
}

@media (min-width: $sm) and (max-width: 850px) {
  .account-info {
    &__orders {
      &--body {
        .address-wrap {
          width: 100%;
          max-width: 100%;
          flex: 0 0 100%;
        }
        &--address {
          .add-new {
            padding: 77px 16px;
            h3 {
              font-size: 20px;
            }
          }
        }
      }
    }
  }
  .notification-wrap {
    width: 100%;
    max-width: 100%;
    flex: 0 0 100%;
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .account-info {
    &__orders {
      &--body {
        .address-wrap {
          width: 100%;
          max-width: 100%;
          flex: 0 0 100%;
        }
        &--address {
          height: 100%;
          padding: 16px;
          .address-not-verified {
            .rotate {
              top: 113px;
            }
          }
          .line {
            span {
              font-size: 14px;
              &:first-child {
                width: 65px;
              }
              &:last-child {
                margin-left: 40px;
              }
            }
          }
          .label-line {
            span {
              &:last-child {
                font-size: 16px;
              }
            }
          }
          .actions {
            padding-left: 108px;
          }
          .add-new {
            padding: 0;
            svg {
              height: 50px;
              width: 50px;
            }
            h3 {
              margin-top: 24px;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .account-info {
    &__stub {
      margin: 40px auto auto 127px;
      flex: 0 0 352px;
    }
    &__edit-address {
      flex: 0 0 100%;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .account-info {
    &__orders {
      &--body {
        &--address {
          .add-new {
            svg {
              width: 100%;
            }
          }
        }
      }
      &--title {
        font-size: 20px;
      }
    }
    &__stub {
      margin-top: 14px;
      flex: 0 0 100%;
    }
    &__edit-address {
      flex: 0 0 100%;
      &--form-item {
        .input-wrap {
          width: 100%;
        }
        label {
          margin-bottom: 12px;
          width: 100%;
          text-align: left;
        }
      }
      button {
        margin-left: 0;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .account-info__edit-address {
    .button-prime,
    .button-second {
      width: 100%;
    }
  }
}

@media (max-width: 375px) {
  .account-info__edit-address {
    &--form-item {
      .counter {
        top: 8px;
      }

      .error-message-input {
        position: relative;
        bottom: 0;
        display: block;
        margin-top: 8px;
        line-height: 16px;
      }
    }
  }
}
</style>
