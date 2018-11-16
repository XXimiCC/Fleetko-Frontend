<template>
  <div class="col-xl-12 p-0 user-purchases">
    <div class="user-purchases__title">
      <p class="purchases__title--main" :class="{ '$h3-size': $mq === 'sm', '$h2-size': $mq !== 'sm' }">
        Purchased Goods
      </p>
    </div>

    <div class="user-purchases__loader">
      <loader v-if="localLoader" :position="'buildin'" class="loader"></loader>
    </div>

    <div class="user-purchases__body">
      <transition-group name="list" tag="div">
        <profile-good :key="purchased.id"
                      :good="purchased"
                      v-for="purchased in purchases"
                      @showConfirmForDelete="showConfirmForDelete"
                      @openModalForCreateReview="openModalForCreateReview"
                      @makeEditable="makeEditable">
        </profile-good>
      </transition-group>
    </div>

    <transition name="fade">
      <div v-if="pagination.currentPage < pagination.lastPage && !localLoader"
           class="user-purchases__more">
        <button @click="loadMorePurchases" class="button-second">
          Load More
        </button>
      </div>
    </transition>

    <div v-if="!purchases.length && !localLoader" class="user-purchases__empty">
      <purchased-empty></purchased-empty>
    </div>

    <update-review-modal v-if="updateReviewModal.open"></update-review-modal>

    <confirm-dialog v-if="showConfirm"
                    :type="'deleteReview'"
                    :reviewForDelete="reviewForDelete"
                    @deleteReview="userDeleteReview"
                    @cancel="cancelDeleteReview">
    </confirm-dialog>
  </div>
</template>

<script>
import UpdateReviewModal from '../modals/UpdateReviewModal'
import ConfirmDialog from '../modals/ConfirmDialog'
import loader from '../common-components/Loader'
import { mapGetters } from 'vuex'
import ProfileGood from './purchases-parts/ProfileGood'
import PurchasedEmpty from './purchases-parts/PurchasedEmpty'
import { EventBus } from '../../event-bus'

export default {
  name: 'Purchases',
  components: {
    ConfirmDialog,
    UpdateReviewModal,
    loader,
    ProfileGood,
    PurchasedEmpty
  },
  data () {
    return {
      purchases: [],
      localLoader: false,
      reviewForDelete: null,
      showConfirm: false,
      pagination: {
        ready: false,
        lastPage: 0,
        currentPage: 1,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters(['updateReviewModal'])
  },
  mounted () {
    this.fetchPurchases()
    this.updateReviewEventListener()
    this.createReviewEventListener()
  },
  methods: {
    fetchPurchases () {
      this.localLoader = true

      this.$store
        .dispatch('fetchPurchasedProducts', {
          id: null,
          page: this.pagination.currentPage
        })
        .then(
          resp => {
            this.purchases = resp.data

            this.pagination = {
              ready: true,
              currentPage: resp.meta.current_page,
              lastPage: resp.meta.last_page,
              total: resp.meta.total
            }

            this.localLoader = false
          },
          () => {
            this.localLoader = false
          }
        )
    },
    loadMorePurchases () {
      this.localLoader = true

      this.$store
        .dispatch('fetchPurchasedProducts', {
          id: null,
          page: ++this.pagination.currentPage
        })
        .then(
          resp => {
            this.purchases = [...this.purchases, ...resp.data]

            this.pagination = {
              ready: true,
              currentPage: resp.meta.current_page,
              lastPage: resp.meta.last_page,
              total: resp.meta.total
            }

            this.localLoader = false
          },
          () => {
            this.localLoader = false
          }
        )
    },
    showConfirmForDelete (review) {
      this.reviewForDelete = review
      this.showConfirm = true
    },
    cancelDeleteReview () {
      this.reviewForDelete = null
      this.showConfirm = false
    },
    userDeleteReview (id) {
      this.localLoader = true

      this.$store.dispatch('userDeleteReview', id).then(
        () => {
          let reviewForDelete = this.purchases.findIndex(good => good.review && good.review.id === id)

          this.purchases[reviewForDelete].review = null

          this.cancelDeleteReview()
          this.localLoader = false
        },
        () => {
          this.localLoader = false
        }
      )
    },
    updateProductReview (review) {
      this.localLoader = true

      this.$store.dispatch('userUpdateReview', review).then(
        response => {
          let reviewForUpdate = this.purchases.findIndex(good => good.review && good.review.id === good.data.id)

          delete response.data.product

          this.purchases[reviewForUpdate].review = response.data
          this.localLoader = false
        },
        () => {
          this.localLoader = false
        }
      )

      this.$store.dispatch('toggleUpdateReviewModal', { open: false })
    },
    userCreateReview (review) {
      this.localLoader = true

      this.$store.dispatch('userCreateReview', review).then(
        response => {
          let productForCreate = this.purchases.findIndex(good => good.id === good.data.product_id)

          this.purchases[productForCreate].review = response.data
          this.localLoader = false
        },
        () => {
          this.localLoader = false
        }
      )

      this.$store.dispatch('toggleUpdateReviewModal', { open: false })
    },
    openModalForCreateReview (productId) {
      this.$store.dispatch('toggleUpdateReviewModal', {
        open: true,
        reviewId: null,
        review: null,
        productId: productId
      })
    },
    makeEditable (review) {
      this.$store.dispatch('toggleUpdateReviewModal', {
        open: true,
        reviewId: review.id,
        review: review
      })
    },
    updateReviewEventListener (destroy) {
      if (destroy) return EventBus.$off('updateUserReview')

      EventBus.$on('updateUserReview', review => this.updateProductReview(review))
    },
    createReviewEventListener (destroy) {
      if (destroy) EventBus.$off('createUserReview')

      EventBus.$on('createUserReview', review => this.userCreateReview(review))
    }
  },
  beforeDestroy () {
    this.updateReviewEventListener(true)
    this.createReviewEventListener(true)
  }
}
</script>

<style scoped lang="scss">
.purchases {
  &__title--main {
    margin-bottom: 32px;
    font-family: $montserrat-font;
    font-size: 34px;
    font-weight: 500;
    line-height: 1;
    color: $main-dark;
  }
}

.user-purchases {
  &__more {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    button {
      width: 252px;
    }
  }
}

@media (max-width: $xssm) {
  .user-purchases {
    &__more {
      button {
        width: 100%;
      }
    }
  }
}

@media (max-width: $sm) {
  .purchases__title--main {
    font-size: 20px;
  }
}
</style>
