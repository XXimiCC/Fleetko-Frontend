<template>
  <div class="relative-wrap">
    <transition name="fade">
      <div v-if="!reviewLoader" class="row">
        <div
          v-if="productReviews.length"
          class="tab-reviews"
          :class="{
            'col-md-7': isReviewAction,
            'col-md-9': !isReviewAction,
            'col-md-12': windowWidth <= FORM_BREAKPOINT
          }"
        >
          <h3 class="tab-reviews__title">All Reviews</h3>
          <div
            v-if="product.rating_average"
            class="tab-reviews__rate"
            itemprop="aggregateRating"
            itemscope
            itemtype="http://schema.org/AggregateRating"
          >
            <div class="item">
              <star
                :position="++i"
                :key="i"
                :readOnly="true"
                :size="24"
                :borderWidth="3"
                :padding="0"
                :rating="product.rating_average"
                v-for="(star, i) in 5"
              >
              </star>
            </div>
            <div class="item">
              <span class="tab-reviews__rate--text">
                Based on
                <span itemprop="reviewCount">{{
                  reviewsPagination.total
                }}</span>
                reviews
              </span>
            </div>
            <div class="counter">
              <span itemprop="ratingValue">{{
                roundDecimalRating(product.rating_average)
              }}</span>
              <span>out of 5 star</span>
            </div>
          </div>

          <div v-if="!isUserReview && windowWidth <= 768" class="col-md-12">
            <reviews-large-action
              :product="product"
              :productReviews="productReviews"
              :purchasedProduct="purchasedProduct"
              @createUserReview="createUserReview"
            >
            </reviews-large-action>
          </div>

          <div
            v-for="review in productReviews"
            class="review"
            itemscope
            itemprop="review"
            itemtype="http://schema.org/Review"
          >
            <div class="review--header">
              <div class="review--header--user">
                <img :src="userImageSrc(review.user, 32)" alt="" />
                <span itemprop="author"
                  >{{ review.user.first_name }}
                  {{ review.user.last_name }}</span
                >
              </div>
              <div
                class="review--header--rate"
                itemscope
                itemprop="reviewRating"
                itemtype="http://schema.org/Rating"
              >
                <star
                  :position="++i"
                  :key="i"
                  :readOnly="true"
                  :size="16"
                  :borderWidth="2"
                  :padding="0"
                  :rating="review.rating"
                  v-for="(star, i) in 5"
                >
                </star>
                <meta itemprop="worstRating" content="1" />
                <meta itemprop="ratingValue" :content="review.rating" />
                <meta itemprop="bestRating" content="5" />
              </div>
              <div class="review--header--date">
                <span itemprop="datePublished">{{
                  toFormatedDate(review.published_at, 'L')
                }}</span>
              </div>
            </div>
            <div class="review--body">
              <div class="review--body--title">
                <h4>{{ review.headline }}</h4>
              </div>
              <div class="review--body--text">
                <span class="text" itemprop="description">{{
                  review.text
                }}</span>
              </div>
              <div
                v-if="userInfo && review.user_id === userInfo.id"
                class="review--body--actions"
              >
                <div @click.stop="makeEditable(review)" class="item">
                  <svg-edit class="edit"></svg-edit>
                  <span>Edit</span>
                </div>
                <div class="item" @click.stop="showConfirmForDelete(review)">
                  <svg-delete class="delete"></svg-delete>
                  <span>Delete</span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="reviewsPagination.currentPage < reviewsPagination.lastPage"
            class="tab-reviews__more"
          >
            <span @click="loadMoreReviews">Load More</span>
          </div>
        </div>

        <h3
          v-if="!productReviews.length && !isUserReview"
          class="tab-reviews tab-reviews__title col-md-12"
        >
          All Reviews
        </h3>

        <div
          v-if="
            (!isUserReview && windowWidth > FORM_BREAKPOINT) ||
              !productReviews.length
          "
          :class="{
            'col-md-7':
              !productReviews.length && windowWidth >= FORM_BREAKPOINT,
            'col-md-12':
              !productReviews.length && windowWidth < FORM_BREAKPOINT,
            'col-md-5': productReviews.length,
            'mx-auto': !productReviews.length,
            'large-action-single': windowWidth <= FORM_BREAKPOINT,
            'not-rated-yet': !purchasedProduct && !productReviews.length
          }"
        >
          <reviews-large-action
            :product="product"
            :productReviews="productReviews"
            :purchasedProduct="purchasedProduct"
            @createUserReview="createUserReview"
          >
          </reviews-large-action>
        </div>
      </div>
    </transition>
    <confirm-dialog
      v-if="showConfirm"
      :type="'deleteReview'"
      :reviewForDelete="reviewForDelete"
      @cancel="cancelDeleteReview"
      @deleteReview="deleteReview"
    >
    </confirm-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ReviewsLargeAction from './ReviewsLargeAction'
import Star from '../../common-components/Star'
import ConfirmDialog from '../../modals/ConfirmDialog'
import utils from '@/mixins/utils'

export default {
  name: 'tab-reviews',
  data () {
    return {
      showConfirm: false,
      reviewForDelete: null,
      FORM_BREAKPOINT: 768,
      windowWidth: window.innerWidth
    }
  },
  mixins: [utils],
  props: [
    'productReviews',
    'product',
    'reviewsPagination',
    'purchasedProduct',
    'reviewLoader'
  ],
  methods: {
    roundRatingValue (rate) {
      return parseFloat(rate).toFixed(1)
    },
    loadMoreReviews () {
      this.$emit('loadMoreReviews')
    },
    createUserReview (review) {
      this.$emit('createUserReview', review)
    },
    showConfirmForDelete (review) {
      this.reviewForDelete = review
      this.showConfirm = true
    },
    cancelDeleteReview () {
      this.reviewForDelete = null
      this.showConfirm = false
    },
    deleteReview (id) {
      this.$emit('userDeleteReview', id)

      this.cancelDeleteReview()
    },
    makeEditable (review) {
      this.$store.dispatch('toggleUpdateReviewModal', {
        open: true,
        reviewId: review.id,
        review: review
      })
    },
    resizeHandler () {
      this.windowWidth = window.innerWidth
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    isReviewAction () {
      return this.purchasedProduct && !this.purchasedProduct.review
    },
    isUserReview () {
      return this.purchasedProduct && this.purchasedProduct.review
    }
  },
  components: {
    Star,
    ReviewsLargeAction,
    ConfirmDialog
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.resizeHandler)
    })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.resizeHandler)
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

/* .fade-leave-active до версии 2.1.8 */
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.relative-wrap {
  position: relative;
}

.tab-reviews {
  margin-top: 32px;
  .not-rated-yet {
    outline: 1px solid red;
  }

  &__title {
    margin-bottom: 16px;
    line-height: 1;
    color: $main-dark;
  }
  &__rate {
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .item {
      display: flex;
      align-items: center;
    }
    .counter {
      margin-top: 16px;
      width: 100%;
      span {
        font-family: $montserrat-font;
        font-size: 16px;
        font-weight: 500;
        color: $main-dark;
      }
    }
    &--text {
      margin-left: 16px;
      font-family: $sours-sans-p-font;
      font-weight: 400;
      font-size: 14px;
      color: $main-dark;
      line-height: 17px;
    }
  }
  &__more {
    margin-top: 60px;
    display: flex;
    justify-content: center;
    span {
      font-family: $montserrat-font;
      font-size: 20px;
      font-weight: 500;
      color: $main-color;
      cursor: pointer;
      border-bottom: 1px dashed transparent;
      &:hover {
        border-bottom: 1px dashed $main-color;
      }
    }
  }
  .review {
    &--header {
      display: flex;
      align-items: center;
      &--user {
        display: flex;
        align-items: center;
        img {
          width: 24px;
          height: 24px;
          border-radius: 100%;
        }
        span {
          margin-left: 16px;
          font-family: $montserrat-font;
          font-size: 12px;
          font-weight: 500;
          color: $main-dark;
        }
      }
      &--rate {
        margin-left: 32px;
        display: flex;
        align-items: center;
        span {
          margin-left: 8px;
          font-family: $montserrat-font;
          color: $main-dark;
          font-size: 12px;
          font-weight: 500;
        }
      }
      &--date {
        margin-left: 32px;
        display: flex;
        span {
          color: $paragraph;
          font-family: $sours-sans-p-font;
          font-size: 14px;
        }
      }
    }
    &--body {
      &--title {
        margin-top: 24px;
        word-break: break-word;
      }
      &--text {
        .text {
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $paragraph;
          line-height: 19px;
          word-break: break-word;
        }
        .blurred-text {
          position: relative;
          &:after {
            position: absolute;
            content: '';
            right: 0;
            height: 15px;
            width: 200px;
            bottom: 0;
            background: linear-gradient(
              to right,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 1) 100%
            ); /* W3C */
          }
        }
        .more {
          margin-left: 8px;
          z-index: 50;
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $main-color;
          cursor: pointer;
        }
      }
      &--actions {
        margin-top: 22px;
        display: flex;
        .item {
          display: flex;
          align-items: center;
          cursor: pointer;
          .edit {
            height: 16px;
            fill: #989898;
          }
          .delete {
            height: 16px;
            fill: #989898;
          }
          span {
            margin-left: 3px;
            font-family: $sours-sans-p-font;
            font-size: 14px;
            line-height: 1;
            color: #989898;
          }
          &:hover {
            span {
              color: $main-color;
            }
            svg {
              fill: $main-color;
            }
          }
        }
        .item + .item {
          margin-left: 31px;
        }
      }
    }
  }
  .review + .review {
    margin-top: 64px;
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .tab-reviews {
    .review {
      &--header {
        flex-wrap: wrap;
        &--user {
          width: 50%;
          order: 1;
        }
        &--date {
          margin-left: 0;
          width: 50%;
          display: flex;
          flex-direction: row-reverse;
          order: 2;
        }
        &--rate {
          margin-top: 8px;
          width: 100%;
          margin-left: 0;
          order: 3;
        }
      }
    }
  }
}
@media (min-width: $xssm) and (max-width: 768px) {
  .not-rated-yet.large-action-single {
    padding: 0 10%;
  }
}
</style>
