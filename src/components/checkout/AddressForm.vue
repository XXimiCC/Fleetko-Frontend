<template>
  <div>
    <div
      class="form-edit"
      :class="relativeComponent"
      :id="`form-anchor-${warehouseId}`"
    >
      <div class="form-edit__item">
        <label class="form-edit__label">Label</label>
        <div class="input-wrap">
          <input
            ref="label"
            :class="{ 'input-error': errors.has(`label`) }"
            v-validate="'required|max:19'"
            class="input-default"
            name="label"
            :data-vv-name="`label`"
            v-model="edit.label"
            placeholder="House, Work, etc."
            type="text"
          />
          <span v-show="errors.has(`label`)" class="error-message-input">
            {{ errors.first(`label`) }}
          </span>
        </div>
      </div>
      <div class="form-edit__item">
        <label class="form-edit__label">First Name</label>
        <div class="input-wrap">
          <input
            :class="{ 'input-error': errors.has('first-name') }"
            class="input-default"
            v-validate="'required|max:20'"
            name="first-name"
            v-model="edit.firstName"
            placeholder="John"
            type="text"
          />
          <span v-show="errors.has('first-name')" class="error-message-input">
            {{ errors.first('first-name') }}
          </span>
        </div>
      </div>
      <div class="form-edit__item">
        <label class="form-edit__label">Last Name</label>
        <div class="input-wrap">
          <input
            :class="{ 'input-error': errors.has('last-name') }"
            class="input-default"
            v-validate="'required|max:20'"
            name="last-name"
            v-model="edit.lastName"
            placeholder="Doe"
            type="text"
          />
          <span v-show="errors.has('last-name')" class="error-message-input">
            {{ errors.first('last-name') }}
          </span>
        </div>
      </div>
      <div class="form-edit__item">
        <label class="form-edit__label">Address Line 1</label>
        <div class="input-wrap">
          <input
            :class="{ 'input-error': errors.has('address') }"
            class="input-default"
            v-validate="'required'"
            name="address"
            placeholder="Street address"
            v-model="edit.addressFirst"
            type="text"
          />
          <span v-show="errors.has('address')" class="error-message-input">
            {{ errors.first('address') }}</span
          >
        </div>
      </div>
      <div class="form-edit__item">
        <label class="form-edit__label">Address Line 2</label>
        <div class="input-wrap">
          <input
            class="input-default"
            placeholder="Apt, Suite, Unit, Bldg, etc. (optional)"
            name="address-2"
            v-model="edit.addressSecond"
            type="text"
          />
        </div>
      </div>
      <div class="form-edit__item">
        <label class="form-edit__label">City</label>
        <div class="input-wrap">
          <input
            :class="{ 'input-error': errors.has('city') }"
            class="input-default"
            v-validate="'required'"
            name="city"
            placeholder="Anytown"
            v-model="edit.city"
            type="text"
          />
          <span v-show="errors.has('city')" class="error-message-input">
            {{ errors.first('city') }}</span
          >
        </div>
      </div>
      <div class="form-edit__item">
        <label class="form-edit__label">State</label>
        <div class="input-wrap">
          <v-select
            id="select-state"
            data-vv-value-path="selectedState"
            data-vv-name="state"
            v-validate:selectedState="'required||custom_validation'"
            class="vue-select"
            v-model="selectedState"
            :class="{
              'select-valid-error': errors.has('state'),
              'select-placeholder': selectedState && !selectedState.value
            }"
            :searchable="false"
            :options="selectStates"
          ></v-select>
          <span v-show="errors.has('state')" class="error-message-input">
            {{ errors.first('state') }}</span
          >
        </div>
      </div>
      <div class="form-edit__item">
        <label class="form-edit__label">ZIP Code</label>
        <div class="input-wrap">
          <input
            @keydown="keyHandler($event)"
            :class="{ 'input-error': errors.has('zip') }"
            class="input-default zip-input"
            v-validate="'required|min:5|max:5'"
            v-model="edit.zip"
            name="zip"
            placeholder="#####"
            type="number"
          />
          <div
            class="counter"
            :class="{
              'counter--error': edit.zip.length !== 12 && errors.has('zip')
            }"
          >
            <span>{{ edit.zip.length }} / 5</span>
          </div>
          <span v-show="errors.has('zip')" class="error-message-input">
            {{ errors.first('zip') }}
          </span>
        </div>
      </div>
      <div class="form-edit__item">
        <label class="form-edit__label">Phone</label>
        <div class="input-wrap">
          <masked-input
            :class="{ 'input-error': errors.has('phone') }"
            class="input-default"
            v-model="edit.phone"
            :mask="[
              '+',
              '1',
              '(',
              /[1-9]/,
              /\d/,
              /\d/,
              ')',
              ' ',
              /\d/,
              /\d/,
              /\d/,
              '-',
              /\d/,
              /\d/,
              /\d/,
              /\d/
            ]"
            placeholder="+1(201) 555-0123"
            type="tel"
            v-validate:phoneNumber="'required|min:12'"
            data-vv-name="phone"
            data-vv-value-path="phoneNumber"
          ></masked-input>
          <div
            class="counter"
            :class="{
              'counter--error': phoneNumber.length !== 12 && errors.has('phone')
            }"
          >
            <span>{{ phoneNumber.length }} / 12</span>
          </div>
          <span v-show="errors.has('phone')" class="error-message-input">
            {{ errors.first('phone') }}</span
          >
        </div>
      </div>
      <div class="form-edit__item m-0">
        <div class="checkbox">
          <div class="item">
            <label>
              <input
                v-model="assignToUser"
                class="checkbox-default input-checkbox"
                checked
                type="checkbox"
              />
            </label>
            <span class="checkbox--name">Save in Address Book</span>
          </div>
        </div>
      </div>
      <app-notification
        @clearNotify="formWarning = null"
        :notification="formWarning"
        v-if="formWarning"
        class="notification-wrap"
      ></app-notification>
      <div class="form-edit__item flex-wrap">
        <button
          @click="validateAddress"
          :disabled="loading"
          class="button-prime button-save"
        >
          Create new address
        </button>
        <button
          v-if="addressesSelect.length"
          @click="$emit('cancelForm', warehouseId)"
          class="button-second button-cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AppNotification from '../notifications/MainNotify'
import MaskedInput from 'vue-text-mask'
import vSelect from 'vue-select'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import states from '../../json/states.json'
import toastr from 'toastr'
import { mapGetters } from 'vuex'
import _ from 'lodash'

Vue.use(VeeValidate)

VeeValidate.Validator.extend('custom_validation', value => {
  return value.value !== 0
})

export default {
  data () {
    return {
      states: states,
      notification: null,
      formWarning: null,
      selectedState: {
        label: 'Alabama',
        value: 0
      },
      assignToUser: true,
      loading: false,
      edit: {
        label: '',
        value: '',
        verified: '',
        name: '',
        phone: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip: ''
      }
    }
  },
  name: 'AddressForm',
  props: ['warehouse', 'relativeComponent', 'addressesSelect', 'warehouseId'],
  methods: {
    keyHandler ($event) {
      if (
        $event.keyCode === this.EVENT_KEY_SPACE ||
        !_.includes(this.NUMBER_INPUT_AVAILABLE_KEYS, $event.keyCode)
      ) {
        $event.preventDefault()
      }
    },
    createAddress () {
      let address = {
        disposable: !this.assignToUser,
        label: this.edit.label,
        firstName: this.edit.firstName,
        lastName: this.edit.lastName,
        addressFirst: this.edit.addressFirst,
        addressSecond: this.edit.addressSecond,
        city: this.edit.city,
        state: this.selectedState.value,
        zip: this.edit.zip,
        phoneNumber: this.phoneNumber,
        addressID: null
      }

      this.loading = true

      this.$store.dispatch('saveAddress', { address: address }).then(
        response => {
          if (response.meta.messages.address_correction) {
            toastr.info(
              response.meta.messages.address_correction[0],
              '',
              this.setToastr('warning', 5000)
            )
          }
          if (response.meta.messages.address_warning) {
            this.notification = {
              text: response.meta.messages.address_warning[0],
              timeout: null,
              cancelable: true,
              type: 'info',
              show: true
            }
          }

          /**
            If this form from shipping Method
           */
          if (this.warehouseId) {
            let addAsDefaultToAll = false

            // Check if Address Select are empty
            if (!this.addressesSelect.length && this.assignToUser) {
              addAsDefaultToAll = true
            }

            this.$emit(
              'makeMainForWarehouse',
              this.warehouseId,
              response.data,
              this.notification,
              this.assignToUser,
              addAsDefaultToAll
            )
          } else {
            this.$emit('setNewAddress', response.data, !this.assignToUser)
          }

          this.loading = false
          // eslint-disable-next-line
        },
        error => {
          // eslint-disable-next-line
          console.error(error)
        }
      )
    },
    validateAddress () {
      this.$validator.validateAll().then(result => {
        if (
          this.addressesSelect.length >= this.ADDRESS_BOOK_MAX &&
          this.assignToUser
        ) {
          this.formWarning = {
            text:
              'You have exceeded the allowable limit of addresses in the Address Book. Please, create the temporary address or delete out-of-date address from the Address Book ',
            timeout: null,
            type: 'warning',
            show: true
          }
        } else {
          if (result) {
            this.createAddress()
          }
        }
      })
    }
  },
  mounted () {
    const formAnchor = this.warehouseId
      ? `#form-anchor-${this.warehouseId}`
      : `#form-anchor`

    if (this.$mq === 'lg' || this.$mq === 'xl') {
      this.$refs.label.focus()
    }
    this.$scrollTo(formAnchor, 1500, { offset: -400 })
  },
  beforeDestroy () {},
  computed: {
    phoneNumber () {
      return this.edit.phone.replace(/[^0-9a-zA-Z+]/g, '')
    },
    selectStates () {
      return this.states.map(g => ({ label: g.name, value: g.abbreviation }))
    },
    ...mapGetters(['preloader'])
  },
  components: {
    MaskedInput,
    vSelect,
    AppNotification
  }
}
</script>

<style lang="scss" scoped="">
.form-edit {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .notification-wrap {
    margin-top: 16px;
    margin-left: 122px;
  }
  .button-save {
    margin: 16px 0;
    height: 40px;
    width: 100%;
    margin-left: 122px;
  }
  .button-second {
    height: 40px;
    width: 100%;
    margin-left: 122px;
  }
  &__item {
    flex: 0 0 100%;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    #select-state {
      width: 100%;
    }
  }
  .zip-input {
    padding-right: 60px;
  }
  &__label {
    width: 90px;
    margin-right: 32px;
    margin-bottom: 0;
    text-align: right;
    font-weight: 600;
    font-family: $sours-sans-p-font;
    color: $main-dark;
    font-size: 14px;
    line-height: 1;
  }
  .input-wrap {
    position: relative;
    width: calc(100% - 122px);
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
    .vue-select[data-vv-name] {
      & /deep/ .vs__selected-options {
        & .selected-tag {
          margin: 0 0 0 11px !important;
        }
      }
    }
  }
  .checkbox {
    margin-left: 122px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
    justify-content: space-between;
    .item {
      flex: 0 0 100%;
      display: flex;
      align-items: center;
    }
    .item + .item {
      margin-top: 8px;
    }
    label {
      margin-bottom: 0;
      height: 24px;
    }
    &--name {
      margin-left: 17px;
      font-family: $sours-sans-p-font;
      font-size: 16px;
      color: $main-dark;
    }
    .disabled {
      input {
        background-color: #f5f5f5;
        cursor: not-allowed;
      }
      span {
        color: #d1d1d1;
      }
    }
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .shipping-method {
    .form-edit {
      &__item {
        width: 100%;
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .shipping-method {
    .form-edit {
      .input-wrap {
        width: 100%;
      }
      &__item {
        width: 100%;
      }
    }
  }
}

@media (min-width: $xssm) and (max-width: $sm) {
  .shipping-method {
    .form-edit {
      .input-wrap {
        width: 100%;
      }
      &__item {
        width: 100%;
        flex-wrap: wrap;
      }
      &__label {
        margin-bottom: 12px;
        width: 100%;
        text-align: left;
      }
      .checkbox {
        margin-left: 0;
      }
      .button-save {
        margin-left: 0;
      }
      .button-cancel {
        margin-left: 0;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .shipping-method {
    .form-edit {
      .input-wrap {
        width: 100%;
      }
      &__item {
        width: 100%;
        flex-wrap: wrap;
      }
      &__label {
        margin-bottom: 12px;
        width: 100%;
        text-align: left;
      }
      .checkbox {
        margin-left: 0;
      }
      .button-save {
        margin-left: 0;
      }
      .button-cancel {
        margin-left: 0;
      }
    }
  }
}
</style>
