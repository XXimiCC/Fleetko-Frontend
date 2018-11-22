<template>
  <div class="form" :class="{ manual: manualMode, stub: !cartIsReady }">
    <new-modal @cancel="closeModal" :isLoading="!renderReady">
      <template v-if="cartIsReady" slot="header">
        <shopping-header :product="product" :manual="manualMode"></shopping-header>
      </template>

      <template v-if="renderReady && (cartIsFull || productIsExceeded)" slot="body">
        <shopping-stub :cartIsFull="cartIsFull" @closeModal="closeModal"></shopping-stub>
      </template>

      <template v-if="cartIsReady" slot="body">
        <div class="form__body">
          <div v-if="!manualMode && !proposalWarehouse" class="info">
            Enter the ZIP and the quantity and we will find the nearest
            warehouse for the order. Also you can choose manually the warehouse
            you need by clicking Manual Selection link.
          </div>

          <div v-if="!manualMode && !proposalWarehouse" class="inputs">
            <div class="inputs__zip">
              <p class="label">ZIP</p>
              <input class="input-default-new-design zip-input"
                     v-model="zipValue"
                     @input="zipInputHandler"
                     @blur="validateZip"
                     :class="{ 'input-error': zipIsTooLong || zipNonExist }"
                     type="number"
                     placeholder="51543"/>

              <span v-show="zipIsTooLong || zipNonExist" class="error-message-input">
                {{ zipNonExist ? zipErrors.nonExist : zipErrors.tooLong }}
              </span>
            </div>

            <div class="qty-input">
              <p class="label">Quantity</p>
              <quantity-input :initialValue="1"
                              :product="product"
                              :userCart="getUserCart"
                              :min="2"
                              @setQuantity="setQuantity">
              </quantity-input>
            </div>

            <button @click="validateZip" class="button-prime">add</button>
          </div>

          <proposal-warehouse v-if="proposalWarehouse && !manualMode"
                              :warehouse="proposalWarehouse"
                              :quantity="proposalWarehouseQty"
                              @editProposal="editProposal"
                              @showLargeForm="showLargeForm">
          </proposal-warehouse>

          <div v-if="!manualMode"
               @click="showAllWarehouses"
               class="show-manual">
            <div class="show-manual__content">
              <svg-assigment></svg-assigment>
              <span class="show-manual__text">Manual Selection</span>
            </div>
          </div>

          <div v-if="manualMode" class="in-stock">
            <div class="label label--in">In Stock</div>
            <in-stock-house v-for="house in inStockHouses"
                            ref="house"
                            :key="house.id"
                            :house="house"
                            :expectedQuantity="setInitialQuantity(house.id)"
                            :product="product"
                            :userCart="getUserCart"
                            :manual="manualMode"
                            @collapseWarehouses="collapseWarehouses"
                            @setQuantity="setQuantity"
                            @moveMarker="moveMarker">
            </in-stock-house>
          </div>

          <shopping-actions @add="addToCart"
                            @proceed="proceedToCheckout"
                            :price="toDollarDecimal(totalPrice || subTotalPrice)"
                            :manual="manualMode"
                            :notValid="shoppingActionsError"
                            :exceededCart="exceededCart"
                            :cartMaxSize="CART_MAX_SIZE">
          </shopping-actions>

          <div v-if="manualMode && ['md', 'lg', 'xl'].includes($mq)" class="out-stock">
            <div class="label label--out">Out of Stock</div>
            <out-stock-house v-for="house in outStockHouses"
                             :key="house.id"
                             :house="house">
            </out-stock-house>
          </div>
        </div>
      </template>

      <template v-if="manualMode && ['lg', 'xl'].includes($mq)" slot="map">
        <shopping-map :inStockHouses="inStockHouses"
                      :markerPosition="markerPosition">
        </shopping-map>
      </template>
    </new-modal>
  </div>
</template>

<script>
import NewModal from './NewModal'
import ShoppingHeader from './shopping-modal-parts/ShoppingHeader'
import QuantityInput from './shopping-modal-parts/QuantityInput'
import ShoppingActions from './shopping-modal-parts/ShoppingActions'
import ShoppingMap from './shopping-modal-parts/ShoppingMap'
import ProposalWarehouse from './shopping-modal-parts/ProposalWarehouse'
import InStockHouse from './shopping-modal-parts/InStockHouse'
import OutStockHouse from './shopping-modal-parts/OutStockHouse'
import ShoppingStub from './shopping-modal-parts/ShoppingStub'

import _ from 'lodash'
import utils from '@/mixins/utils'
import converterUnit from '@/mixins/converterUnit'
import { mapGetters } from 'vuex'
import Vue from 'vue'
import Geocoder from '@pderas/vue2-geocoder'
import config from '../../config'

Vue.use(Geocoder, { googleMapsApiKey: config.googleMapApi })
Vue.$geocoder.setDefaultCountryCode('US')

export default {
  name: 'AddToCart',
  components: {
    NewModal,
    ShoppingHeader,
    QuantityInput,
    ShoppingActions,
    ProposalWarehouse,
    InStockHouse,
    OutStockHouse,
    ShoppingMap,
    ShoppingStub
  },

  mixins: [utils, converterUnit],

  data () {
    return {
      product: null,
      zipValue: '',
      zipNonExist: false,
      zipIsTooLong: false,
      zipErrors: {
        tooLong: 'The ZIP code must be 5 characters long',
        nonExist: 'You entered a nonexistent ZIP code'
      },
      userQuantity: 1,
      proposalWarehouse: null,
      proposalWarehouseQty: 0,
      totalPrice: 0,
      inStockHouses: null,
      outStockHouses: null,
      markerPosition: null,
      WAREHOUSE_MAX_SIZE: 50,
      CART_MAX_SIZE: 20,
      shoppingActionsError: false,
      productIsExceeded: false,
      cartIsFull: false,
      exceededCart: false,
      renderReady: false,
      manualMode: false
    }
  },

  computed: {
    ...mapGetters({
      modalProductId: 'modalProductId',
      getUserCart: 'getUserCart',
      getTotalAmountCart: 'getTotalAmountCart'
    }),
    subTotalPrice () {
      if (!this.manualMode) {
        return this.product.price * this.userQuantity
      }
    },
    cartIsReady () {
      return this.renderReady && (!this.cartIsFull && !this.productIsExceeded)
    }
  },

  created () {
    this.fetchProduct()
  },

  methods: {
    fetchProduct () {
      this.$store.dispatch('fetchProduct', this.modalProductId).then(
        resp => {
          this.product = resp
          if (
            this.getUserCart.totalAmount >= this.CART_MAX_SIZE ||
            !this.checkStock(resp.warehouses)
          ) {
            this.cartIsFull = true
          }
          this.renderReady = true
        },
        () => {
          this.renderReady = true
        }
      )
    },

    zipInputHandler (event) {
      event.target.value = event.target.value.replace(/^0+/, '')
      event.target.value = event.target.value.replace(/\D/g, '')
      if (event.target.value.length > 5) { this.zipValue = event.target.value.substr(0, 5) }

      this.shoppingActionsError = false
      this.zipNonExist = false
      this.zipIsTooLong = false
    },

    editProposal () {
      this.product.warehouses.find(e => e.id === this.proposalWarehouse.id)
        .userQuantity -= this.proposalWarehouseQty

      this.proposalWarehouse = null
      this.proposalWarehouseQty = 0
      this.userQuantity = 1
    },

    validateZip ({ type: eventType }) {
      if (eventType === 'blur') {
        if (this.zipValue.length !== 5) this.zipIsTooLong = true
        return
      }

      if (this.zipValue.length !== 5) {
        this.zipIsTooLong = true
      } else if (this.userQuantity <= 0) {
        this.userQuantity = 1
      } else {
        this.fetchZipCode()
      }

      this.shoppingActionsError = false
    },

    fetchZipCode () {
      this.isLoading = true

      Vue.$geocoder.send({ zip_code: this.zipValue },
        response => {
          const result = response.results[0]

          if (result.types.includes('postal_code')) {
            this.findClosestWarehouse(result.geometry.location)
          } else {
            this.zipNonExist = true
          }

          this.isLoading = false
        },
        () => {
          this.isLoading = false
        }
      )
    },

    productQtyInWarehouse (house) {
      return _.get(this.getUserCart.cart[house.id], `products[${this.product.id}].quantity`, 0)
    },

    totalQtyInWarehouse (house) {
      let houseInCart = this.getUserCart.cart[house.id]

      return houseInCart
        ? Object.keys(houseInCart.products).reduce((totalQty, product) => {
            return totalQty + houseInCart.products[product].quantity
          }, 0)
        : 0
    },

    showAllWarehouses () {
      this.shoppingActionsError = false
      this.manualMode = true
    },

    checkStock (warehouses) {
      this.inStockHouses = warehouses.filter(house => {
        return (
          house.product.quantity &&
          (this.totalQtyInWarehouse(house) < this.WAREHOUSE_MAX_SIZE &&
            this.productQtyInWarehouse(house) < house.product.quantity)
        )
      })

      const spareCarts = warehouses.filter(
        house => this.totalQtyInWarehouse(house) < this.WAREHOUSE_MAX_SIZE
      )
      const spareStock = warehouses.filter(
        house => this.productQtyInWarehouse(house) < house.product.quantity
      )

      this.outStockHouses = this.product.warehouses.filter(
        house => !this.inStockHouses.includes(house)
      )
      this.productIsExceeded = !spareStock.length
      this.cartIsFull = !spareCarts.length

      return this.inStockHouses.length
    },

    showLargeForm () {
      this.proposalWarehouse.userQuantity = this.userQuantity
      this.manualMode = true
    },

    findClosestWarehouse (userCoords) {
      const distances = []

      this.product.warehouses.forEach(house => {
        const coordinates = {
          lat1: userCoords.lat,
          lon1: userCoords.lng,
          lat2: house.latitude,
          lon2: house.longitude
        }

        distances.push(
          Object.assign({
            distance: this.calcDistance(coordinates),
            warehouse: house
          })
        )
      })

      const sortedByDistance = distances
        .sort((a, b) => a.distance - b.distance)
        .map(item => item.warehouse)

      this.checkStock(sortedByDistance)

      const closestFullAmount = this.inStockHouses.find(house => {
        return (
          house.product.quantity >=
          this.userQuantity + this.productQtyInWarehouse(house)
        )
      })

      this.proposalWarehouse = closestFullAmount || this.inStockHouses[0]
      this.proposalWarehouse.userQuantity =
        this.userQuantity + this.productQtyInWarehouse(this.proposalWarehouse)

      this.proposalWarehouseQty = this.userQuantity

      if (
        this.proposalWarehouse.product.quantity <
        this.proposalWarehouse.userQuantity
      ) {
        this.proposalWarehouseQty =
          this.proposalWarehouse.product.quantity -
          this.productQtyInWarehouse(this.proposalWarehouse)
        this.manualMode = true
      }
    },

    calcDistance ({ lat1, lat2, lon1, lon2 }) {
      const EARTH_RADIUS = 6371
      const dLat = ((lat2 - lat1) * Math.PI) / 180
      const dLon = ((lon2 - lon1) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)

      return 2 * Math.asin(Math.sqrt(a)) * EARTH_RADIUS
    },

    setQuantity (quantity, warehouse, subTotalPrice) {
      if (!this.manualMode) {
        this.userQuantity = quantity
        this.totalPrice = this.product.price * this.userQuantity
      } else {
        this.inStockHouses.find(house => {
          return house.id === warehouse.id
        }).userQuantity = quantity

        this.setTotalPrice(subTotalPrice)
      }
    },

    setInitialQuantity (id) {
      if (this.proposalWarehouse && this.proposalWarehouse.id === id) {
        return this.proposalWarehouseQty
      }
    },

    setTotalPrice (subTotalPrice) {
      this.totalPrice = this.$refs.house
        ? this.$refs.house.reduce((total, location) => {
            return total + (location.price ? location.price : 0)
          }, 0)
        : subTotalPrice
    },

    collapseWarehouses (id) {
      this.$refs.house.forEach(ref => {
        if (ref.house.id === id) {
          ref.$el.classList.toggle('opened')
        } else {
          ref.$el.classList.remove('opened')
        }
      })
    },

    moveMarker (house) {
      this.markerPosition = house
    },

    proceedToCheckout () {
      this.addToCart(true)
    },

    addToCart (proceed) {
      if (!this.manualMode && !this.proposalWarehouse) {
        this.shoppingActionsError = true
      } else if (this.manualMode && !this.totalPrice) {
        this.shoppingActionsError = true
      } else {
        this.shoppingActionsError = false

        let newItems = this.inStockHouses.filter(
          e => e.userQuantity && !this.productQtyInWarehouse(e)
        )

        if (
          newItems.length + this.getUserCart.totalAmount >
          this.CART_MAX_SIZE
        ) {
          this.exceededCart = newItems.length + this.getUserCart.totalAmount
          return
        } else {
          this.exceededCart = false
        }

        this.inStockHouses.forEach(warehouse => {
          if (warehouse.userQuantity) {
            this.$store
              .dispatch('addProductToCart', {
                productId: this.product.id,
                warehouseId: parseInt(warehouse.id),
                quantity: parseInt(warehouse.userQuantity),
                freight: this.product.freight,
                price: this.product.price,
                name: this.product.name,
                image: this.product.image,
                slug: this.product.slug,
                description: this.product.description,
                productBrandName: this.product.dealer_name,
                city: warehouse.city
              })
              .then(resolve => {
                if (resolve) {
                  this.closeModal()
                  if (proceed) this.$router.push({ name: 'cartPage' })
                  this.$store.dispatch('setTotalCounters')
                }
              })
          }
        })
      }
    },

    closeModal () {
      this.$store.dispatch('toggleCartModal', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  & /deep/ .modal__body {
    width: 320px;
    min-height: 420px;
    padding: 32px;
  }
  & /deep/ .modal__header {
    margin-bottom: 16px;
    border-bottom: 1px solid $light-grey;
  }
  & /deep/ .modal__close {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  &.manual /deep/ .modal__body {
    width: 928px;
    padding: 32px;
  }
  &.manual /deep/ .modal__header {
    width: 512px;
    border: none;
  }
  &.manual /deep/ .modal__info {
    width: 512px;
  }

  &.stub /deep/ .modal__container {
    min-width: 288px;
    height: 333px;
  }
  &.stub /deep/ .modal__header {
    border-bottom: none;
  }
  &.stub /deep/ .modal__body {
    width: 288px;
    min-height: 333px;
  }

  & /deep/ .loader--modal {
    padding: 163px 8px;
    background-color: transparent;
  }
}

.info {
  margin-bottom: 12px;
  font: 10px/13px $montserrat-font;
  color: $main-grey;
}

.inputs {
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-bottom: 21px;
  &__zip {
    min-width: 72px;
    .zip-input {
      padding: 0 15px;
      &[type='number']::-webkit-outer-spin-button,
      &[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &[type='number'] {
        -moz-appearance: textfield;
      }
    }
    .label {
      font: 600 14px/17px $sours-sans-p-font;
      margin-bottom: 7px;
    }
  }
}

.qty-input {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  margin: 0 16px;

  .label {
    font: 600 14px/17px $sours-sans-p-font;
    margin-bottom: 8px;
  }
}

.label {
  margin-bottom: 14px;
  font: 500 14px/17px $montserrat-font;
  &--in {
    color: #0bb07b;
  }
  &--out {
    color: #b4bac7;
  }
}

.show-manual {
  display: flex;
  justify-content: center;
  padding-bottom: 13px;
  border-bottom: 1px solid $light-grey;
  cursor: pointer;
  svg {
    width: 18px;
    margin-right: 3px;
    fill: $main-color;
  }
  &__content {
    display: flex;
    align-items: flex-end;
    border-bottom: 1px solid transparent;
    transition: border 0.15s;
    &:hover {
      border-bottom: 1px solid $main-color;
    }
  }
  &__text {
    padding: 0 2px 2px 0;
    font: 500 14px/19px $sours-sans-p-font;
    color: $main-color;
  }
}

@media (max-width: 960px) {
  .form {
    &.manual /deep/ .modal__body {
      width: 616px;
      min-height: 200px;
    }
    &.manual /deep/ .modal__header {
      width: 100%;
    }
    &.manual /deep/ .modal__info {
      width: 100%;
    }
  }
}

@media (max-width: 648px) {
  .form {
    & /deep/ .modal__container {
      min-width: 288px;
    }
    &.manual /deep/ .modal__body {
      width: 288px;
      min-height: auto;
      padding: 16px;
    }
  }
}

@media (max-width: 368px) {
  .form {
    & /deep/ .modal__container {
      width: 288px;
    }
    & /deep/ .modal__body {
      width: 100%;
      padding: 16px;
    }
  }
}
</style>
