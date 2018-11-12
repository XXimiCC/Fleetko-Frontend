<template>
  <div>
    <div class="col-xl-12 p-0 account-info__orders">
      <h1 class="account-info__orders--title">Order History</h1>

      <loader :position="'buildin'" class="loader" v-if="!renderReady"></loader>

      <div v-if="orders.length" class="account-info__orders--body">
        <transition-group name="list" tag="div">
          <div
            class="account-info__orders--body--item list"
            v-for="order in orders"
            :key="order.id"
          >
            <component
              @openWarehouseModal="openWarehouseModal"
              @abandoneOrder="openDialog"
              :order="order"
              v-bind:is="orderType(order.shipping_method)"
            >
            </component>
          </div>
        </transition-group>

        <confirm-dialog
          v-if="confirmDialog"
          :orderToDelete="orderToDelete"
          :type="'orderDelete'"
          @abandoneOrder="abandoneOrder"
          @cancel="hideDialog"
        >
        </confirm-dialog>

        <warehouse-map
          v-if="warehouseModal.show"
          :address="warehouseModal.warehouseAddress"
          @closeWarehouseModal="closeWarehouseModal"
        >
        </warehouse-map>

        <transition name="fade">
          <div
            v-if="pagination.currentPage < pagination.lastPage && buttonReady"
            class="account-info__orders--body--more"
          >
            <button @click="loadMoreOrders" class="button-second">
              Load More
            </button>
          </div>
        </transition>
      </div>

      <div
        v-if="!orders.length && renderReady"
        class="account-info__orders-empty"
      >
        <div class="account-info__empty-image">
          <svg-playlist-add></svg-playlist-add>
        </div>

        <h3 class="h3-secondary">There Are No Orders Yet</h3>
        <p class="paragraph-tertiary">
          You have no orders yet. Click the button below, select products you
          need from the offered categories and create your first order.
        </p>
        <router-link :to="{ name: 'home' }" tag="a">
          <button class="button-prime">Keep Shopping</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import pickupItem from './order-history-parts/PickupItem'
import freightItem from './order-history-parts/FreightItem'
import parcelItem from './order-history-parts/ParcelItem'
import ConfirmDialog from '../modals/ConfirmDialog'
import WarehouseMap from '../modals/WarehouseMap'
import utils from '@/mixins/utils'
import loader from '../common-components/Loader'
import _ from 'lodash'

export default {
  name: 'order-history',
  mixins: [utils],
  data () {
    return {
      renderReady: false,
      buttonReady: true,
      warehouseModal: {
        show: false,
        warehouseAddress: null
      },
      orders: [],
      draftProductsArray: [],
      intervalFunc: null,
      confirmDialog: false,
      orderToDelete: null,
      pagination: {
        ready: false,
        lastPage: 0,
        currentPage: 1,
        total: 0
      }
    }
  },
  components: {
    pickupItem,
    freightItem,
    parcelItem,
    ConfirmDialog,
    WarehouseMap,
    loader
  },
  mounted () {
    this.fetchOrders()
  },
  computed: {
    currentPage () {
      return this.$route.name
    },
    ...mapGetters(['isAuth', 'userInfo', 'preloader'])
  },
  methods: {
    openWarehouseModal (address) {
      this.warehouseModal.warehouseAddress = address
      this.warehouseModal.show = true
    },
    closeWarehouseModal () {
      this.warehouseModal.show = false
    },
    openDialog (id) {
      this.confirmDialog = true
      this.orderToDelete = id
    },
    hideDialog () {
      this.confirmDialog = false
      this.orderToDelete = null
    },
    abandoneOrder (id) {
      this.buttonReady = false

      this.$store.dispatch('abandoneOrder', id).then(
        () => {
          let index = this.orders.findIndex(order => order.id === id)
          let order = this.orders.find(item => item.id === id)

          this.orders.splice(index, 1)
          this.hideDialog()
          this.findAllDraftProducts()

          if (order.status === 'pending_payment') {
            this.$store.dispatch('updateUserPendingCounter', 'decrease')
          }

          this.buttonReady = true
        },
        error => {
          console.error(error)
          this.buttonReady = true
        }
      )
    },
    findAllDraftProducts () {
      this.draftProductsArray = []

      this.orders.forEach(order => {
        if (order.status === 'draft') this.draftProductsArray.push(order.id)
      })
    },
    orderUpdateInterval (clear) {
      if (clear) {
        clearInterval(this.intervalFunc)
      } else {
        this.intervalFunc = setInterval(() => {
          if (this.draftProductsArray.length) {
            this.$store
              .dispatch('listOrderUpdates', this.draftProductsArray.join())
              .then(resp => {
                resp.data.forEach(order => {
                  if (
                    ['pending_payment', 'failed', 'pending_review'].includes(
                      order.status
                    )
                  ) {
                    let index = this.orders.findIndex(
                      localOrder => localOrder.id === order.id
                    )
                    let draftIndex = this.draftProductsArray.findIndex(
                      id => id === order.id
                    )

                    this.orders[index].status = order.status
                    this.orders[index].shipping_taxable = order.shipping_taxable
                    this.orders[index].sales_tax_rate = order.sales_tax_rate
                    this.orders[index].sales_tax_amount = order.sales_tax_amount
                    this.orders[index].total_cost = order.total_cost

                    this.draftProductsArray.splice(draftIndex, 1)

                    if (order.status === 'pending_payment') {
 this.$store.dispatch(
                        'updateUserPendingCounter',
                        'increase'
                      )
}
                  }
                })
              })
          } else clearInterval(this.intervalFunc)
        }, 3000)
      }
    },
    groupPreparedProducts (order) {
      let group = _.groupBy(order.order_items, 'product_id')
      let products = []
      // eslint-disable-next-line
      for (let [key, value] of Object.entries(group)) {
        products.push({
          dealer_id: value[0].product.dealer_id,
          dealer_name: value[0].product.dealer_name,
          dealer_image: value[0].product.dealer_image,
          description: value[0].product.description,
          id: value[0].product.id,
          image: value[0].product.image,
          freight: value[0].product.freight,
          name: value[0].product.name,
          slug: value[0].product.slug,
          price: value[0].price,
          part_number: value[0].product.part_number,
          sku: value[0].product.sku,
          quantity: value.length
        })
      }

      return products
    },
    loadMoreOrders () {
      this.buttonReady = false

      this.$store.dispatch('fetchOrders', ++this.pagination.currentPage).then(
        resp => {
          resp.data.forEach(order => {
            order.products = this.groupPreparedProducts(order)
          })

          this.orders = [...this.orders, ...resp.data]
          this.pagination = {
            ready: true,
            currentPage: resp.meta.current_page,
            lastPage: resp.meta.last_page,
            total: resp.meta.total
          }

          this.findAllDraftProducts()

          this.buttonReady = true
        },
        error => {
          console.error(error)
          this.buttonReady = true
        }
      )
    },
    fetchOrders () {
      this.$store.dispatch('setLoaderManual', true)

      this.$store.dispatch('fetchOrders', this.pagination.currentPage).then(
        resp => {
          resp.data.forEach(order => {
            order.products = this.groupPreparedProducts(order)
          })

          this.orders = resp.data
          this.pagination = {
            ready: true,
            currentPage: resp.meta.current_page,
            lastPage: resp.meta.last_page,
            total: resp.meta.total
          }

          this.findAllDraftProducts()
          this.orderUpdateInterval()

          this.renderReady = true
        },
        error => console.error(error)
      )
    },
    orderType (type) {
      if (['parcel', 'freight', 'pickup'].includes(type)) return `${type}-item`
    }
  },
  beforeDestroy () {
    this.orderUpdateInterval(true)
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* base */
.list {
  backface-visibility: hidden;
  z-index: 1;
}

/* moving */
.list-move {
  transition: all 600ms ease-in-out 50ms;
}

/* appearing */
.list-enter-active {
  transition: all 400ms ease-out;
}

/* disappearing */
.list-leave-active {
  transition: all 200ms ease-in;
  position: absolute;
  z-index: 0;
}

/* appear at / disappear to */
.list-enter,
.list-leave-to {
  opacity: 0;
}

.no-pad-hint {
  padding: 0;
}

.account-info {
  padding: 24px 0 32px 0;
  background-color: #f5f5f5;
  &--line {
    display: none;
  }
  &__orders {
    &--title {
      margin-bottom: 25px;
      font-family: $montserrat-font;
      font-size: 34px;
      font-weight: 500;
      line-height: 1;
      color: $main-dark;
    }
    &--body {
      &--item {
      }
      &--more {
        margin-top: 32px;
        display: flex;
        justify-content: center;
        button {
          width: 252px;
        }
      }
    }
  }
  &__orders-empty {
    margin-top: 64px;
    margin-bottom: 128px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    h3 {
      margin-bottom: 16px;
    }
    p {
      max-width: 390px;
      margin-bottom: 32px;
      text-align: center;
    }
    button {
      width: 200px;
    }
  }
  &__empty-image {
    margin-bottom: 32px;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    background: #d0defb;
    svg {
      width: 32px;
      height: 32px;
      fill: $main-color;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .account-info {
    &__orders {
      &--title {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: $xssm) {
  .account-info {
    &__orders--body--more {
      button {
        width: 100%;
      }
    }
  }
}
</style>
