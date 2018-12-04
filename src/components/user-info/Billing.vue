<template>
  <div class="billing">
    <loader class="loader" v-if="!renderReady"> </loader>

    <div v-if="renderReady">
      <p class="billing__title">Billing</p>

      <div class="billing__methods">
        <p class="methods__title">Payment Methods</p>

        <billing-stub v-if="!paymentMethods.length" :type="'payment'">
        </billing-stub>

        <router-link :to="{ name: 'home' }">
          <div
            v-if="!paymentMethods.length"
            class="button-prime resale__button"
          >
            Keep Shopping
          </div>
        </router-link>
      </div>

      <payment-method
        v-if="paymentMethods.length"
        v-for="method in paymentMethods"
        :method="method"
        :key="method.token"
        @deleteHandler="confirmRemovingItem(method)"
      >
      </payment-method>

      <div id="resale-certificate" class="billing__resale">
        <p class="resale__title">Resale Certificate</p>

        <div v-if="permits.length" class="resale__caption">
          <svg-info></svg-info>
          <p>
            By adding resale certificate you agree that you will only buy items
            that you intend to resell
          </p>
        </div>

        <resale-table
          v-if="permits.length && isDesktop"
          :permits="permits"
          :formatDate="formatDate"
          :formatStatus="formatStatus"
          @delHandler="confirmRemovingItem"
          @editHandler="openBillingForm"
        >
        </resale-table>

        <resale-cell
          v-if="permits.length && !isDesktop"
          :permits="permits"
          :formatDate="formatDate"
          :formatStatus="formatStatus"
          @delHandler="confirmRemovingItem"
          @editHandler="openBillingForm"
        >
        </resale-cell>

        <billing-stub v-if="!permits.length" :type="'resale'"> </billing-stub>

        <div
          v-if="permitsLastPage > permitsCurrentPage || isLoading"
          class="load-more"
        >
          <button
            v-if="!isLoading"
            class="button-second resale__button"
            @click="loadMore"
          >
            Load more
          </button>

          <loader v-if="isLoading" class="loader"></loader>
        </div>

        <button class="button-prime resale__button" @click="openBillingForm">
          Add Resale Certificate
        </button>
      </div>

      <confirm-dialog
        v-if="showConfirm"
        :type="'removePaymentMethod'"
        :paymentMethod="itemToDelete"
        @confirm="deleteItem"
        @cancel="showConfirm = false"
      >
      </confirm-dialog>

      <app-notification
        v-if="notification"
        @clearNotify="notification = null"
        :notification="notification"
        :cancelable="true"
        solid="true"
        class="notification-wrap"
      >
      </app-notification>

      <resale-form
        v-if="showBillingForm"
        :permit="itemToEdit"
        @cancel="closeBillingForm"
        @createSuccess="permitAdded"
        @updateSuccess="permitUpdated"
      >
      </resale-form>
    </div>
  </div>
</template>

<script>
import PaymentMethod from './billing-parts/PaymentMethod'
import ResaleTable from './billing-parts/ResaleTable'
import ResaleCell from './billing-parts/ResaleCell'
import BillingStub from './billing-parts/BillingStub'
import ResaleForm from './billing-parts/ResaleForm'
import NewModal from '../modals/NewModal'
import ConfirmDialog from '../modals/ConfirmDialog'
import AppNotification from '../notifications/MainNotify'
import loader from '../common-components/Loader'

export default {
  name: 'Billing',
  components: {
    PaymentMethod,
    ResaleTable,
    ResaleCell,
    BillingStub,
    ResaleForm,
    NewModal,
    ConfirmDialog,
    AppNotification,
    loader
  },
  data () {
    return {
      paymentMethods: [],
      permits: [],
      permitsCurrentPage: 1,
      permitsLastPage: 0,
      itemToDelete: null,
      itemToEdit: null,
      showConfirm: false,
      showBillingForm: false,
      notification: null,
      isLoading: false,
      renderReady: false,
      toasterOpts: {
        timeout: 5000,
        cancelable: true,
        show: true
      },
      windowWidth: window.innerWidth
    }
  },

  created () {
    this.fetchPaymentMethods()
    this.fetchResellerPermits()

    window.addEventListener('resize', this.setWindowWidth)
  },

  mounted () {
    window.addEventListener('load', () => {
      if (this.$route.hash === '#resale-certificate') {
        this.$scrollTo('#resale-certificate', 500)
      }
    })
  },

  computed: {
    isDesktop () {
      return this.windowWidth >= 768
    }
  },

  methods: {
    deleteItem () {
      let action
      let itemId
      let itemName

      this.showConfirm = false

      if (this.itemToDelete.permit_number) {
        action = 'deleteResellerPermit'
        itemId = this.itemToDelete.id
        itemName = 'certificate'
      } else {
        action = 'deletePaymentMethod'
        itemId = this.itemToDelete.token
        itemName = this.itemToDelete.type.split('_').join(' ')
      }

      this.$store.dispatch(action, itemId).then(
        () => {
          this.notification = {
            text: `${itemName.charAt(0).toUpperCase() +
              itemName.slice(1)} was deleted`,
            timeout: 5000,
            cancelable: true,
            type: 'info',
            show: true
          }

          if (this.itemToDelete.permit_number) {
            this.permits = this.permits.filter(permit => {
              return permit.id !== this.itemToDelete.id
            })
          } else {
            this.paymentMethods = this.paymentMethods.filter(method => {
              return method.token !== this.itemToDelete.token
            })
          }

          this.itemToDelete = null
        },
        () => {
          this.notification = Object.assign(this.toasterOpts, {
            text: 'Something went wrong',
            type: 'error'
          })

          this.itemToDelete = null
        }
      )
    },

    openBillingForm (permit) {
      if (permit.permit_number) this.itemToEdit = permit

      this.showBillingForm = true
    },

    closeBillingForm () {
      this.itemToEdit = null
      this.showBillingForm = false
    },

    fetchPaymentMethods () {
      this.renderReady = false

      this.$store.dispatch('fetchPaymentMethods').then(
        resp => {
          this.paymentMethods = resp.data
          this.renderReady = true
        },
        () => {
          this.renderReady = true
        }
      )
    },

    permitAdded (permit) {
      this.closeBillingForm()
      this.permits.unshift(permit)

      this.notification = Object.assign(this.toasterOpts, {
        text: 'Certificate has been successfully added',
        type: 'success'
      })
    },

    permitUpdated (permit) {
      this.closeBillingForm()

      const foundIndex = this.permits.findIndex(item => item.id === permit.id)

      this.permits.splice(foundIndex, 1, permit)

      this.notification = Object.assign(this.toasterOpts, {
        text: 'Certificate has been successfully updated',
        type: 'success'
      })
    },

    fetchResellerPermits () {
      this.renderReady = false

      this.$store
        .dispatch('fetchResellerPermits', this.permitsCurrentPage)
        .then(
          resp => {
            resp.data.forEach(permit => {
              permit.showReason = false
              permit.showActions = false
              permit.showNumber = false
              permit.showName = false
            })
            this.permits = resp.data

            this.permitsLastPage = resp.meta.last_page
            this.renderReady = true
          },
          () => {
            this.renderReady = true
          }
        )
    },

    loadMore () {
      this.isLoading = true
      this.permitsCurrentPage += 1

      this.$store
        .dispatch('fetchResellerPermits', this.permitsCurrentPage)
        .then(
          resp => {
            resp.data.forEach(permit => this.permits.push(permit))

            this.permitsLastPage = resp.meta.last_page
            this.isLoading = false
          },
          () => {
            this.isLoading = false
          }
        )
    },

    confirmRemovingItem (item) {
      this.itemToDelete = item
      this.showConfirm = true
    },

    formatDate (date) {
      if (!date) return ''

      const d = date.split('-')
      return [d[1], d[2], d[0]].join('/')
    },
    formatStatus (status) {
      return status
        ? status
            .split('_')
            .join(' ')
            .toUpperCase()
        : ''
    },

    setWindowWidth () {
      this.windowWidth = window.innerWidth
    }
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.setWindowWidth)
  }
}
</script>

<style lang="scss" scoped>
.billing {
  &__title {
    margin-bottom: 24px;
    font: 500 34px/44px $montserrat-font;
    color: $main-dark;
  }
  &__methods {
    .methods__title {
      margin-bottom: 16px;
      font: 500 20px/26px $montserrat-font;
      color: $main-dark;
    }
  }

  &__resale {
    margin-top: 64px;
  }
}

.resale {
  &__title {
    margin-bottom: 8px;
    font: 500 20px/26px $montserrat-font;
    color: $main-dark;
  }
  &__caption {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    svg {
      width: 24px;
      height: 24px;
      min-width: 24px;
      margin-right: 8px;
      fill: $main-grey;
    }
    p {
      font: 500 14px/19px $sours-sans-p-font;
      color: $main-dark;
    }
  }
  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 224px;
    margin: 0 auto;
    &.button-prime {
      margin-top: 32px;
    }
  }
}

.billing /deep/ .modal__container {
  max-width: 352px;
}

.load-more {
  position: relative;
  margin-top: 32px;
  max-height: 40px;
  .loader {
    height: 40px;
  }
}

.notification-wrap {
  position: fixed;
  border-radius: 4px;
  top: 16px;
  right: 16px;
  width: 288px;
  margin-top: 16px;
  margin-left: 122px;
  background-color: #fff;
  z-index: 9999;
}

@media (max-width: $sm) {
  .billing {
    &__title {
      margin-bottom: 8px;
      font: 500 20px/26px $montserrat-font;
    }
    &__methods {
      .methods__title {
        max-width: 184px;
        margin-bottom: 16px;
        font: 500 16px/22px $montserrat-font;
      }
    }
    &__resale {
      margin-top: 32px;
    }
  }
}
</style>
