<template>
  <div class="payment-billing">
    <div class="payment-billing--title"><h3>Select Billing Address</h3></div>
    <div class="payment-billing__preview" v-if="selectedAddress">
      <div class="address-preview">
        <div class="address-preview__body">
          <div class="active-address"><svg-check></svg-check></div>
          <div class="item">
            <div class="label">Name</div>
            <span class="value">{{ selectedAddress.name }}</span>
          </div>
          <div class="item">
            <div class="label">Address</div>
            <span class="value"
              >{{ selectedAddress.address_line_1 }},
              <span v-if="selectedAddress.address_line_2"
                >{{ selectedAddress.address_line_2 }},
              </span>
              {{ selectedAddress.city }}, {{ selectedAddress.state }}
              {{ selectedAddress.zip }}, USA
            </span>
          </div>
          <div class="item">
            <div class="label">Phone</div>
            <span class="value">{{
              formatPhoneNumber(selectedAddress.phone)
            }}</span>
          </div>
        </div>
        <div class="address-preview__link" @click="toggleConfirmDialog(true)">
          <span class="link-primary"> Use a different billing address </span>
        </div>
      </div>
    </div>

    <div
      class="payment-billing__select"
      v-show="!selectedAddress && viewMode !== 'addressForm'"
    >
      <div>
        <div class="form-select">
          <div class="input-wrap" @click="switchOnSelect">
            <v-select
              :placeholder="'Please select an address from address book'"
              :disabled="!addresses.length"
              @input="changeAddressSelect($event)"
              id="select-shipping-address"
              class="vue-select select-payment-address"
              :options="addressesForSelect"
              :searchable="false"
            ></v-select>
          </div>
        </div>
        <div class="alternative">
          <div class="alternative--pad">
            <p class="alternative--text"><span>OR</span></p>
          </div>
          <button
            class="button-second left-icon"
            @click="changeViewMode('addressForm')"
          >
            <svg-add></svg-add>
            <span>Add new address</span>
          </button>
        </div>
      </div>
    </div>

    <div class="payment-billing__form" v-if="viewMode === 'addressForm'">
      <address-form
        @cancelForm="changeViewMode('selectMode')"
        @setNewAddress="setSelectedAddress"
        :addressesSelect="addresses"
      ></address-form>
    </div>

    <confirm-dialog
      :shippingAddress="true"
      :type="'shippingAddress'"
      v-if="showConfirm"
      @disablePreviewMode="changeViewMode('selectMode')"
      @cancel="showConfirm = false"
    ></confirm-dialog>
  </div>
</template>

<script>
import AddressForm from '../AddressForm'
import vSelect from 'vue-select'
import ConfirmDialog from '../../modals/ConfirmDialog'
export default {
  name: 'payment-billing',
  data () {
    return {
      addressesForSelect: [],
      addressInSelectActive: null,
      showConfirm: false,
      viewMode: null,
      enableSelectChange: false
    }
  },
  watch: {
    addresses (val) {
      this.mappingSelectAddresses()
    }
  },
  props: ['order', 'selectedAddress', 'addresses'],
  methods: {
    formatPhoneNumber (s) {
      if (s) {
        let firstDigits = s.slice(2, 5)
        let secondDigits = s.slice(5, 8)
        let thirdDigits = s.slice(8, 12)

        return `+1 (${firstDigits}) ${secondDigits}-${thirdDigits}`
      }
    },
    toggleConfirmDialog (open) {
      if (this.selectedAddress.temp) {
        this.showConfirm = open
      } else {
        this.changeViewMode('selectMode')
      }
    },
    changeViewMode (mode) {
      if (mode === 'selectMode') {
        this.setSelectedAddress(null)

        this.viewMode = mode
        this.showConfirm = false
      } else if (mode === 'addressForm') {
        this.viewMode = mode
      }

      this.$emit('billingAddressChanged')
      this.enableSelectChange = false
    },
    switchOnSelect () {
      this.enableSelectChange = true
    },
    changeAddressSelect ($event) {
      if (this.viewMode === 'selectMode' && this.enableSelectChange) {
        if ($event) this.addressInSelectActive = $event

        this.setSelectedAddress(this.addressInSelectActive)
      }
    },
    setSelectedAddress (address, temp) {
      if (temp) address.temp = true
      this.$emit('setSelectedAddress', address)

      this.viewMode = null
    },
    mappingSelectAddresses () {
      if (this.addresses.length) {
        this.addressesForSelect = this.addresses.map(g => ({
          label: g.label,
          value: g.id,
          default: g.default,
          verified: g.verified,
          name: g.name,
          phone: g.phone,
          address_line_1: g.address_line_1,
          address_line_2: g.address_line_2,
          city: g.city,
          state: g.state,
          zip: g.zip
        }))

        this.addressInSelectActive = this.addressesForSelect[0]
      }
    }
  },
  computed: {
    isPickupMethod () {
      if (this.order) return this.order.shipping_method === 'pickup'
    }
  },
  mounted () {
    this.mappingSelectAddresses()

    if (this.isPickupMethod) this.changeViewMode('selectMode')
  },
  components: {
    vSelect,
    ConfirmDialog,
    AddressForm
  }
}
</script>

<style scoped lang="scss">
.payment-billing {
  margin-bottom: 64px;
  &--title {
    h3 {
      text-align: center;
      margin-bottom: 32px;
      color: $main-dark;
    }
  }
  &__preview {
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
        line-height: 1;
      }
    }
  }
  &__select {
    .form-select {
      margin-top: 42px;
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
      }
      .input-wrap {
        position: relative;
        width: 100%;
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
      overflow: hidden;
      text-align: center;
      &--pad {
        padding: 0 15px;
      }
      &--text {
        margin: 24px 0;
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

@media (min-width: $xs) and (max-width: $md) {
  .payment-billing {
    &__preview {
      .address-preview {
        &__link {
          span {
            border-bottom: 1px dashed $main-dark;
          }
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .payment-billing {
    &__preview {
      .address-preview {
        &__body {
          .item {
            .label {
              flex: 0 0 80px;
            }
          }
        }
      }
    }
  }
}
</style>
