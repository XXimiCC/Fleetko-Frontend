<template>
  <div class="reviews">
    <h3 class="reviews__title">Reviews</h3>
    <reviews-small-action
      v-if="!hideReviewAction"
      :productReviews="productReviews"
      :product="product"
      :purchasedProduct="purchasedProduct"
      @openProductTab="openRelativeTab"
    >
    </reviews-small-action>
    <div v-if="productReviews.length">
      <div
        v-if="product.rating_average"
        class="reviews__rate"
        itemscope
        itemprop="aggregateRating"
        itemtype="http://schema.org/AggregateRating"
      >
        <div class="item">
          <star
            :position="++i"
            :key="i"
            :readOnly="true"
            :size="24"
            :borderWidth="2"
            :padding="0"
            :rating="product.rating_average"
            v-for="(star, i) in 5"
          >
          </star>
        </div>
        <div class="item">
          <span
            @click="
              openRelativeTab({
                tabName: 'TabReviews',
                scroll: true
              })
            "
            class="reviews__rate--text link-quaternary"
            >Based on
            <span itemprop="reviewCount">{{ reviewsPagination.total }}</span>
            reviews</span
          >
        </div>
        <div class="counter">
          <span itemprop="ratingValue">{{
            roundDecimalRating(product.rating_average)
          }}</span>
          <span> out of 5 star</span>
        </div>
      </div>
      <div class="reviews__body">
        <div
          class="review"
          v-for="review in productReviews.slice(0, 3)"
          itemscope
          itemprop="review"
          itemtype="http://schema.org/Review"
        >
          <div class="review--header">
            <div class="review--header--user">
              <img :src="userImageSrc(review.user, 32)" alt="" />
              <span itemprop="author"
                >{{ review.user.first_name }} {{ review.user.last_name }}</span
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
                :size="18"
                :borderWidth="2"
                :padding="0"
                :rating="review.rating"
                v-for="(star, i) in 5"
              ></star>
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
              <h4 class="h4-secondary">{{ review.headline }}</h4>
            </div>
            <div class="review--body--text">
              <span
                v-if="!review.isOpen"
                class="text"
                :class="{ 'blurred-text': review.text.length > 180 }"
                itemprop="description"
                >{{ displayReviewText(review.text) }}
              </span>
              <span v-if="review.isOpen" class="text" itemprop="description"
                >{{ review.text }}
              </span>
              <span
                v-if="review.text.length > 180"
                @click="review.isOpen = !review.isOpen"
                class="more link-quaternary"
                >{{ review.isOpen ? 'Hide' : 'Read More' }}
              </span>
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
      </div>
      <div class="reviews--all">
        <span
          @click.stop="
            openRelativeTab({
              tabName: 'TabReviews',
              scroll: true
            })
          "
          >Read all reviews</span
        >
      </div>
    </div>

    <confirm-dialog
      v-if="showConfirm"
      :type="'deleteReview'"
      :reviewForDelete="reviewForDelete"
      @deleteReview="deleteReview"
      @cancel="cancelDeleteReview"
    >
    </confirm-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Star from '../../common-components/Star'
import ReviewsSmallAction from './ReviewsSmallAction'
import ConfirmDialog from '../../modals/ConfirmDialog'
import utils from '@/mixins/utils'

export default {
  name: 'reviews-small',
  data () {
    return {
      showConfirm: false,
      reviewForDelete: null
    }
  },
  mixins: [utils],
  props: ['productReviews', 'product', 'reviewsPagination', 'purchasedProduct'],
  methods: {
    openRelativeTab (tab) {
      this.$emit('openProductTab', tab)
    },
    roundRatingValue (rate) {
      return parseFloat(rate).toFixed(1)
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
    displayReviewText (text) {
      return text.length > 180 ? this.cutText(text, 162) : text
    }
  },
  components: {
    Star,
    ReviewsSmallAction,
    ConfirmDialog
  },
  computed: {
    ...mapGetters(['userInfo']),
    hideReviewAction () {
      return (
        (!this.purchasedProduct && this.productReviews.length > 0) ||
        (this.purchasedProduct && this.purchasedProduct.review)
      )
    },
    isUserReview () {
      return this.purchasedProduct && this.purchasedProduct.review
    }
  }
}
</script>

<style scoped lang="scss">
.reviews {
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
      cursor: pointer;
      line-height: 17px;
    }
  }
  &__body {
    overflow-x: hidden;
    overflow-y: hidden;
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
        word-break: break-word;
        &--title {
          margin-top: 24px;
        }
        &--text {
          .text {
            font-family: $sours-sans-p-font;
            font-size: 14px;
            color: $paragraph;
            line-height: 19px;
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
  &--all {
    margin: 48px auto 0;
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
}

@media (min-width: $xs) and (max-width: $sm) {
  .reviews {
    &__body {
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
}
</style>
