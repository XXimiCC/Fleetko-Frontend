<template>
  <transition name="fade">
    <div class="tab-features row">
      <div
        class="tab-features__half col-md-5"
        :class="{ 'col-md-7': !similar.length }"
      >
        <div v-if="product.description" class="description">
          <h3>Description</h3>
          <p itemprop="description">{{ product.description }}</p>
        </div>
        <div
          v-if="mergedFeatures.length"
          class="specification"
          :class="{ 'margin-top': product.description }"
        >
          <h3>Specification</h3>
          <div class="specification--card">
            <div class="specification--card--row header">
              <div class="attribute table-text">Attribute</div>
              <div class="value  table-text">Value</div>
            </div>
            <div
              class="specification--card--row combine"
              v-for="feature in mergedFeatures"
            >
              <div class="attribute table-text">{{ feature.name }}</div>
              <div class="value  table-text">
                <div
                  :class="{ 'large-value': feature.value.length > 1 }"
                  class="item table-text"
                  v-for="value in feature.value"
                >
                  {{ value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tab-features__half reviews-wrap col-md-5">
        <reviews-small
          :reviewsPagination="reviewsPagination"
          :product="product"
          :purchasedProduct="purchasedProduct"
          :productReviews="productReviews"
          @userDeleteReview="userDeleteReview"
          @openProductTab="openRelativeTab"
        >
        </reviews-small>
      </div>
      <div
        v-if="(similar.length && $mq === 'xl') || $mq === 'lg'"
        class="tab-features__similar col-md-2"
      >
        <product-similar-vertical :similar="similar"></product-similar-vertical>
      </div>
    </div>
  </transition>
</template>

<script>
import ReviewsSmall from './ReviewsSmall'
import ProductSimilarVertical from '../ProductSimilarVertical'

export default {
  name: 'tab-characteristic',
  props: [
    'product',
    'mergedFeatures',
    'similar',
    'productReviews',
    'productSmallReviews',
    'purchasedProduct',
    'reviewsPagination'
  ],
  methods: {
    userDeleteReview (id) {
      this.$emit('userDeleteReview', id)
    },
    openRelativeTab (tab) {
      this.$emit('openProductTab', tab)
    }
  },
  components: {
    ReviewsSmall,
    ProductSimilarVertical
  }
}
</script>

<style scoped lang="scss">
.review-test {
  margin-top: 24px;
  width: 100px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

/* .fade-leave-active до версии 2.1.8 */
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.tab-features {
  margin-top: 32px;
  display: flex;
  .description {
    h3 {
      margin-bottom: 16px;
      color: $main-dark;
    }
    p {
      margin-bottom: 0;
      font-family: $sours-sans-p-font;
      color: $main-dark;
      font-size: 14px;
    }
  }
  .specification {
    &.margin-top {
      margin-top: 48px;
    }
    h3 {
      margin-bottom: 16px;
      color: $main-dark;
    }
    &--card {
      border-radius: 4px;
      overflow: hidden;
      &--row {
        padding: 10px 0 10px 16px;
        display: flex;
        justify-content: space-between;
        .table-text {
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $main-dark;
          font-weight: 600;
          line-height: 1;
        }
        .value {
          width: 55%;
          .table-text {
            font-weight: 400;
          }
        }
        .attribute {
          width: 45%;
        }
        .large-value + .large-value {
          margin-top: 8px;
        }
        &.header {
          background: $main-color;
          .table-text {
            color: white;
            font-size: 12px;
            font-weight: 500;
            font-family: $montserrat-font;
          }
        }
      }
      .combine {
        &:nth-child(2n) {
          background: #f5f7fc;
        }
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .tab-features {
    &__half {
      flex: 0 0 100%;
      max-width: 100%;
    }
    .reviews-wrap {
      margin-top: 64px;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .tab-features {
    &__half {
      flex: 0 0 100%;
      max-width: 100%;
    }
    .reviews-wrap {
      margin-top: 64px;
    }
  }
}
</style>
