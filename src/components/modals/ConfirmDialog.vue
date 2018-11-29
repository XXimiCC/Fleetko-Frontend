<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" v-on-clickaway="closeModal">
          <div class="modal-header">
            <slot>
              <div class="modal-header--close" @click="closeModal">
                <svg-close></svg-close>
              </div>
            </slot>
          </div>
          <div>
            <div class="modal-header--title" :class="{ 'svg-shipping': shippingAddress }">
              <div class="item svg-wrap">
                <svg-trash v-if="!shippingAddress" viewBox="7.5 2 9 19"></svg-trash>
                <svg-edit-location v-if="shippingAddress"></svg-edit-location>
              </div>
              <div class="item text" v-if="addressName">
                Are you sure you want to delete the
                <span class="bold">"{{ addressName }}"</span> address?
              </div>
              <div class="item text" v-if="productForDelete">
                Are you sure you want to delete the
                <span class="bold">"{{ productForDelete.productBrandName }} {{ productForDelete.name }}"</span>
                from {{ productForDelete.warehouseCity }}?
              </div>
              <div class="item text" v-if="warehouseForDelete">
                Are you sure you want to delete all items from <span class="bold">{{ warehouseForDelete.city }}</span>warehouse?
              </div>
              <div class="item text" v-if="clearCartDialog">
                Are you sure you want to delete all items from the cart?
              </div>
              <div class="item text" v-if="shippingAddress">
                The current address would be lost. Are you sure you want to
                continue?
              </div>
              <div class="item text" v-if="orderToDelete">
                All order information will be lost. Are you sure you want to
                cancel the order?
              </div>
              <div class="item text" v-if="reviewForDelete">
                Are you sure you want to delete your review ?
              </div>
              <div class="item text" v-if="paymentMethod">
                Are you sure you want to delete this
                <span class="bold" v-if="paymentMethod.type">{{ paymentMethod.type === 'credit_card' ? 'card' : 'account' }}</span>
                <span class="bold" v-else>certificate</span>?
              </div>
              <div class="item text" v-if="type === 'closeBillingForm'">
                All updated information will be lost. Are you sure you want to
                continue?
              </div>
            </div>

            <div class="modal-body">
              <div class="modal-body__buttons">
                <button class="button-second" @click="closeModal">
                  {{ textCancel() }}
                </button>
                <button class="button-normal delete" @click="confirm">
                  {{ textConfirm() }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import utils from '@/mixins/utils'

export default {
  name: 'AppConfirm',
  data () {
    return {
      show: false
    }
  },
  props: [
    'deleteSuccess',
    'addressName',
    'productForDelete',
    'warehouseForDelete',
    'clearCartDialog',
    'shippingAddress',
    'orderToDelete',
    'reviewForDelete',
    'type',
    'paymentMethod'
  ],
  mixins: [clickaway, utils],
  methods: {
    confirm () {
      this.scrollingModalOpen(false)

      switch (this.type) {
        case 'deleteAddress':
        case 'removePaymentMethod':
        case 'closeBillingForm':
          this.$emit('confirm')
          break
        case 'cartDeleteProduct':
          this.$emit('confirmDeleteProduct')
          break
        case 'cartDeleteWarehouse':
          this.$emit('confirmDeleteWarehouse')
          break
        case 'cartClearAll':
          this.$emit('confirmDeleteCart')
          break
        case 'shippingAddress':
          this.$emit('disablePreviewMode', this.shippingAddress)
          break
        case 'orderDelete':
          this.$emit('abandoneOrder', this.orderToDelete)
          break
        case 'deleteReview':
          this.$emit('deleteReview', this.reviewForDelete.id)
      }
    },
    closeModal () {
      this.scrollingModalOpen(false)

      this.$emit('cancel')
    },
    textCancel () {
      if (this.shippingAddress) {
        return 'Leave current address'
      } else if (this.orderToDelete) {
        return 'Back to Order'
      } else {
        return 'Cancel'
      }
    },
    textConfirm () {
      if (this.shippingAddress) {
        return 'Change Address'
      } else if (this.orderToDelete || this.type === 'closeBillingForm') {
        return 'I am sure'
      } else {
        return 'Delete'
      }
    }
  },
  computed: {
    ...mapGetters({
      hasToken: 'hasToken'
    })
  },
  mounted () {
    this.scrollingModalOpen(true)
  }
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 512px;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header {
  padding: 15px;
  display: flex;
  flex-direction: row-reverse;
  border-bottom: none;
  &--close {
    width: 16px;
    height: 16px;
    svg {
      fill: $main-grey;
      height: 100%;
      width: 100%;
      cursor: pointer;
    }
  }
  &--title {
    padding: 0 36px;
    display: flex;
    align-items: center;
    .svg-wrap {
      width: 40px;
      height: 50px;
      svg {
        width: 39px;
        height: 49px;
        fill: $main-dark;
      }
    }

    .text {
      margin-left: 36px;
      color: $main-dark;
      font-family: $montserrat-font;
      font-size: 24px;
      font-weight: 400;
      line-height: 31px;
      .bold {
        font-weight: 600;
      }
    }
  }
}
.svg-shipping {
  .svg-wrap {
    width: 64px;
    height: 64px;
    svg {
      width: 64px;
      height: 64px;
      fill: $main-dark;
    }
  }
  .text {
    margin-left: 16px;
  }
}
.modal-body {
  padding: 0 16px 32px 16px;
  &__buttons {
    margin-top: 32px;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    button {
      width: 208px;
      height: 48px;
      border-radius: 4px;
      cursor: pointer;
    }
    .delete {
      background-color: $danger;
      &:hover {
        background-color: #ff5757;
      }
    }
    .change {
      background-color: $main-color;
      &:hover {
        background-color: $main-hover;
        color: white;
      }
    }
  }
}
.success-delete {
  &--title {
    padding: 16px 64px 32px 64px;
    h3 {
      margin-bottom: 18px;
      font-family: $montserrat-font;
      color: $main-dark;
      font-size: 24px;
      font-weight: 600;
    }
    p {
      font-family: $sours-sans-p-font;
      font-size: 14px;
      color: $main-dark;
      margin-bottom: 0;
      line-height: 18px;
    }
  }
  &__buttons {
    padding-bottom: 32px;
    display: flex;
    justify-content: center;
    button {
      width: 208px;
    }
  }
}

.modal-footer {
  border-top: none;
}

/*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

@media (min-width: $xs) and (max-width: 540px) {
  .modal-mask {
    display: flex;
    align-items: center;
  }
  .modal-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-container {
    width: calc(100% - 16px);
    .modal-header {
      &--title {
        padding: 0 16px 0 32px;
        .text {
          margin-left: 16px;
          font-size: 16px;
          font-weight: 400;
          line-height: 22px;
        }
      }
    }
    .modal-body {
      &__buttons {
        padding: 0;
        button {
          width: 49%;
        }
      }
    }
  }
}
</style>
