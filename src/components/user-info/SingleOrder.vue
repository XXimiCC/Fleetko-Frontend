<template>
  <div class="single-order">
    <div class="container">
      <div class="single-order__back">
        <svg-arrow-back></svg-arrow-back>
        <router-link :to="{ name: 'orderHistory' }">
          <span>Back to order history</span>
        </router-link>
      </div>
      <div class="single-order__title" v-if="order">
        <h2 class="h2-secondary">Order #{{ order.id }}</h2>
      </div>
      <div class="single-order__body" v-if="order">
        <component
          @openWarehouseModal="openWarehouseModal"
          @abandoneOrder="openDialog"
          :order="order"
          v-bind:is="orderType(order.shipping_method)"
        >
        </component>
      </div>

      <confirm-dialog
        :orderToDelete="orderToDelete"
        :type="'orderDelete'"
        v-if="confirmDialog"
        @abandoneOrder="abandoneOrder"
        @cancel="hideDialog"
      ></confirm-dialog>

      <warehouse-map
        :address="warehouseModal.warehouseAddress"
        @closeWarehouseModal="closeWarehouseModal"
        v-if="warehouseModal.show"
      ></warehouse-map>
    </div>
  </div>
</template>

<script>
import pickupItem from './order-history-parts/PickupItem'
import freightItem from './order-history-parts/FreightItem'
import parcelItem from './order-history-parts/ParcelItem'
import ConfirmDialog from '../modals/ConfirmDialog'
import WarehouseMap from '../modals/WarehouseMap'
import _ from 'lodash'
export default {
  name: 'single-order',
  data () {
    return {
      order: null,
      confirmDialog: false,
      orderToDelete: null,
      warehouseModal: {
        show: false,
        warehouseAddress: null
      }
    }
  },
  methods: {
    fetchOrder () {
      this.$store
        .dispatch('fetchOrder', this.$route.params.id)
        .then(response => {
          this.order = response.data

          this.groupOrderProducts(response.data)
        })
    },
    groupOrderProducts (order) {
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
          price: value[0].price,
          part_number: value[0].product.part_number,
          sku: value[0].product.sku,
          slug: value[0].product.slug,
          quantity: value.length
        })
      }
      this.order.products = products
    },
    abandoneOrder (id) {
      this.$store.dispatch('abandoneOrder', id).then(
        resp => {
          this.hideDialog()

          this.$store.dispatch('updateUserPendingCounter', 'decrease')

          this.$router.push({ name: 'orderHistory' })
        },
        error => {
          console.error(error)
        }
      )
    },
    openDialog (id) {
      this.confirmDialog = true
      this.orderToDelete = id
    },
    hideDialog () {
      this.confirmDialog = false
      this.orderToDelete = null
    },
    openWarehouseModal (address) {
      this.warehouseModal.warehouseAddress = address
      this.warehouseModal.show = true
    },
    closeWarehouseModal () {
      this.warehouseModal.show = false
    },
    orderType (type) {
      switch (type) {
        case 'parcel':
          return 'parcel-item'

        case 'freight':
          return 'freight-item'

        case 'pickup':
          return 'pickup-item'
      }
    }
  },
  components: {
    pickupItem,
    freightItem,
    parcelItem,
    WarehouseMap,
    ConfirmDialog
  },
  computed: {},
  created () {
    this.fetchOrder()
  },
  mounted () {}
}
</script>

<style scoped lang="scss">
.single-order {
  &__back {
    display: flex;
    align-items: center;
    margin-top: 32px;
    margin-bottom: 40px;
    a {
      display: flex;
    }
    svg {
      fill: $main-grey;
    }
    span {
      margin-left: 8px;
      color: $main-grey;
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 500;
      line-height: 18px;
    }
  }
  &__title {
    margin-bottom: 40px;
    h2 {
      margin-bottom: 0;
      text-align: center;
    }
  }
  &__body {
    box-shadow: 0px 2px 7px 0px rgba(6, 26, 70, 0.17);
  }
}
</style>
