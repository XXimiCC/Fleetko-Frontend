<template>
  <div class="viewed">
    <div class="viewed__title">
      <h2 class="h2-secondary">Viewed Goods</h2>
      <button
        v-if="viewedGoods.length"
        @click="deleteAllViewed"
        class="button-second"
      >
        Clear All
      </button>
    </div>

    <div class="viewed__body">
      <loader :position="'buildin'" class="loader" v-if="localLoader"></loader>

      <transition-group v-if="!localLoader" name="list-item" tag="div">
        <profile-good
          :good="viewed"
          :key="viewed.id"
          mode="review"
          @deleteFromViewed="deleteFromViewed"
          v-for="viewed in viewedGoods"
        >
        </profile-good>
      </transition-group>
    </div>

    <div v-if="!viewedGoods.length && !localLoader" class="viewed__empty">
      <div class="viewed__keep-shop-image">
        <svg-keep-shopping></svg-keep-shopping>
      </div>

      <div class="viewed__keep-shop-text">
        <h2 class="h2-secondary">The List Is Empty</h2>
        <p class="paragraph-tertiary">
          There is a huge amount of products in our store. Click on the button
          below and look for needed goods.
        </p>
      </div>
      <div class="viewed__keep-shop-button">
        <router-link :to="{ name: 'home' }">
          <button class="button-prime">Start Shopping</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileGood from './purchases-parts/ProfileGood'
import loader from '../common-components/Loader'

export default {
  name: 'viewed-goods',
  data () {
    return {
      viewedGoods: [],
      componentLoader: false,
      localLoader: false
    }
  },
  methods: {
    fetchViewedGoods () {
      this.localLoader = true

      this.$store.dispatch('fetchViewedProducts').then(
        resp => {
          this.viewedGoods = resp.data
          this.localLoader = false
        },
        error => {
          console.error(error)
          this.localLoader = false
        }
      )
    },
    deleteFromViewed (id) {
      let indexForDelete = this.viewedGoods.findIndex(
        viewedGood => viewedGood.id === id
      )

      this.$store.dispatch('deleteViewedProduct', id).then(
        resp => {
          this.viewedGoods.splice(indexForDelete, 1)
        },
        error => {
          console.error(error)
        }
      )
    },
    deleteAllViewed () {
      this.localLoader = true

      this.$store.dispatch('deleteAllViewedProducts').then(
        resp => {
          this.viewedGoods = []

          this.localLoader = false
        },
        error => {
          console.error(error)

          this.localLoader = false
        }
      )
    }
  },
  components: {
    ProfileGood,
    loader
  },
  created () {
    this.fetchViewedGoods()
  }
}
</script>

<style scoped lang="scss">
/* Vue List Item transition */

.list-item-enter-active,
.list-item-leave-active {
  transition: opacity 0.3s, transform 0.3s;
  opacity: 1;
}

.list-item-enter,
.list-item-leave-to {
  opacity: 0;
}

.viewed {
  &__title {
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    h2 {
      margin-bottom: 0;
    }
    button {
      margin-left: 32px;
      width: 132px;
      height: 32px;
    }
  }
  &__empty {
    padding-top: 64px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__keep-shop {
    width: 100%;
    margin-top: 128px;
    display: flex;
    flex-direction: column;
    align-items: center;
    &--small-margin {
      margin-top: 80px;
    }
  }
  &__keep-shop-image {
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
  &__keep-shop-text {
    margin-top: 32px;
    max-width: 376px;
    text-align: center;
    h3 {
      margin-bottom: 16px;
    }
    p {
      margin-bottom: 34px;
    }
  }
  &__keep-shop-button {
    width: 352px;
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .viewed {
    &__title {
      justify-content: space-between;
      h2 {
        font-size: 20px;
      }
      button {
        margin-left: 16px;
        width: 108px;
      }
    }
    &__empty {
      h2 {
        font-size: 24px;
      }
    }
    &__keep-shop {
      margin-top: 80px;
    }
    &__keep-shop-button {
      width: 290px;
    }
  }
}
</style>
