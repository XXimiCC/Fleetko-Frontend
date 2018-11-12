<template>
  <div class="col-xl-12 p-0 wait">
    <div class="wait__title"><h2>Wait List</h2></div>
    <div class="wait__stock">
      <div class="wait__stock--title"><h3>Available for Order</h3></div>
      <div v-if="inStockProducts.length" class="wait__stock--body">
        <product-card
          v-for="product in inStockProducts"
          :key="product.id"
          :product="product"
          :inStockProduct="true"
          class="product-card"
          @deleteProductFromWaitList="deleteProductFromWaitList"
        >
        </product-card>
      </div>
      <div v-else class="wait__stock--body--empty">
        <div class="item">
          <div class="empty-image"><svg-keep-shopping></svg-keep-shopping></div>
          <h2 class="title">0 Items In The List</h2>
          <div class="description">
            <p>
              There is no items available to order. Click button below and
              search for other needed products.
            </p>
          </div>
          <div class="button">
            <router-link :to="{ name: 'home' }">
              <button class="button-prime">Start Shopping</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="wait__no-stock">
      <div class="wait__no-stock--title"><h3>Not Available</h3></div>
      <div class="wait__no-stock--body" v-if="outOfStockProducts.length">
        <product-card
          v-for="product in outOfStockProducts"
          :key="product.id"
          :product="product"
          class="product-card"
          :disabledAddToCart="true"
          @deleteProductFromWaitList="deleteProductFromWaitList"
        >
        </product-card>
      </div>
      <div v-else class="wait__no-stock--body--empty">
        <div class="item">
          <div class="empty-image"><svg-keep-shopping></svg-keep-shopping></div>
          <h2 class="title">0 Items In The List</h2>
          <div class="description">
            <p>
              Click button below and search for needed products. If product is
              not available to order, you will be able to add it in the Wait
              List.
            </p>
          </div>
          <div class="button">
            <router-link :to="{ name: 'home' }">
              <button class="button-prime">Start Shopping</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import productCard from './wait-list-parts/ProductCardRow'

export default {
  name: 'wait-list',
  components: {
    productCard
  },
  data () {
    return {
      inStockProducts: [],
      outOfStockProducts: []
    }
  },
  computed: {
    ...mapGetters(['userWaitList'])
  },
  mounted () {
    this.updateWaitList()
  },
  methods: {
    updateWaitList () {
      this.inStockProducts = []
      this.outOfStockProducts = []

      this.$store.dispatch('fetchWaitList').then(
        resp => {
          resp.data.forEach(product => {
            if (product.purchasable) {
              this.inStockProducts.push(product)
            } else {
              this.outOfStockProducts.push(product)
            }
          })
        },
        error => console.error(error)
      )
    },
    deleteProductFromWaitList (productId) {
      this.$store
        .dispatch('deleteWaitListedProduct', productId)
        .then(() => this.updateWaitList())
    }
  }
}
</script>

<style scoped lang="scss">
.wait {
  .product-card {
    &:first-child {
      margin-top: 0;
    }
  }

  &__title {
    margin-bottom: 40px;

    h2 {
      margin-bottom: 0;
      color: $main-dark;
    }
  }

  &__stock {
    margin-bottom: 64px;

    &--title {
      margin-bottom: 20px;

      h3 {
        margin-bottom: 0;
        color: $main-dark;
      }
    }

    &--body {
      padding-top: 24px;
      position: relative;

      &:before {
        position: absolute;
        content: '';
        top: 0;
        width: 100%;
        height: 1px;
        background: #eceff1;
      }

      &--empty {
        position: relative;
        padding: 64px 0;
        display: flex;
        justify-content: center;

        &:before {
          position: absolute;
          content: '';
          top: 0;
          width: 100%;
          height: 1px;
          background: #eceff1;
        }

        &:after {
          position: absolute;
          content: '';
          bottom: 0;
          width: 100%;
          height: 1px;
          background: #eceff1;
        }

        .empty-image {
          margin: 0 auto 32px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: #d0defb;
          border-radius: 100%;

          svg {
            height: 28px;
            fill: $main-color;
          }
        }

        .item {
          text-align: center;
        }

        .title {
          margin-bottom: 16px;
        }

        .description {
          display: flex;
          justify-content: center;
          margin-bottom: 32px;

          p {
            margin-bottom: 0;
            max-width: 290px;
            font-family: $sours-sans-p-font;
            color: $paragraph;
            font-size: 14px;
          }
        }

        .button {
          display: flex;
          justify-content: center;

          button {
            width: 255px;
          }
        }
      }
    }
  }

  &__no-stock {
    &--title {
      margin-bottom: 20px;

      h3 {
        margin-bottom: 0;
        color: $main-dark;
      }
    }

    &--body {
      padding-top: 24px;
      position: relative;

      &:before {
        position: absolute;
        content: '';
        top: 0;
        width: 100%;
        height: 1px;
        background: #eceff1;
      }

      &--empty {
        position: relative;
        padding: 64px 0;
        display: flex;
        justify-content: center;

        &:before {
          position: absolute;
          content: '';
          top: 0;
          width: 100%;
          height: 1px;
          background: #eceff1;
        }

        &:after {
          position: absolute;
          content: '';
          bottom: 0;
          width: 100%;
          height: 1px;
          background: #eceff1;
        }

        .empty-image {
          margin: 0 auto 32px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: #d0defb;
          border-radius: 100%;

          svg {
            height: 28px;
            fill: $main-color;
          }
        }

        .item {
          text-align: center;
        }

        .title {
          margin-bottom: 16px;
          color: $main-dark;
        }

        .description {
          display: flex;
          justify-content: center;
          margin-bottom: 32px;

          p {
            margin-bottom: 0;
            max-width: 290px;
            font-family: $sours-sans-p-font;
            color: $paragraph;
            font-size: 14px;
          }
        }

        .button {
          display: flex;
          justify-content: center;

          button {
            width: 255px;
          }
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .wait {
    &__stock {
      &--body {
        padding-top: 16px;

        &--empty {
          .title {
            margin-bottom: 16px;
          }

          h2 {
            font-size: 24px;
          }
        }
      }
    }

    &__no-stock {
      &--body {
        padding-top: 16px;

        &--empty {
          .title {
            margin-bottom: 16px;
          }

          h2 {
            font-size: 24px;
          }
        }
      }
    }
  }
}
</style>
