<template>
  <div class="review-action">
    <div
      v-if="!purchasedProduct && !productReviews.length"
      class="review-action__stub"
    >
      <div class="review-action__stub-image">
        <img :src="imageSrc('review-stub.svg')" alt="" />
      </div>
      <h2
        class="h2-secondary review-action__stub-heading"
        :class="{ 'review-action__stub-heading--small': productReviews.length }"
      >
        This Product Is Not Yet Rated
      </h2>
      <p
        class="paragraph-tertiary review-action__stub-text paragraph-lg"
        :class="{ 'review-action__stub-text--small': productReviews.length }"
      >
        Buy the product and be the first to leave a review. If you have any
        questions about the product, please use our contact form. Also if you
        have products for which it is possible to leave review, you could look
        through them in your profile.
      </p>
    </div>

    <div v-if="purchasedProduct" class="review-action__form">
      <h3 class="review-action__title">Rate This Item!</h3>
      <div class="review-action__form-item">
        <label>Rating</label>
        <div class="item-flex input-wrap">
          <div class="review-action__stars-wrap" @mouseleave="clearRating">
            <star
              :position="++i"
              :key="i"
              :readOnly="false"
              :size="24"
              :borderWidth="2"
              :padding="0"
              :rating="userRating"
              @setRating="setRating"
              @changeRatingByHover="changeRatingByHover"
              v-for="(star, i) in 5"
            >
            </star>
          </div>
          <span class="review-action__rating-count"
            >{{ userRating }} out of 5 stars</span
          >
          <span v-show="!isValidRating" class="error-message-input"
            >Please choose the rating from 1 to 5
          </span>
        </div>
      </div>
      <div class="review-action__form-item">
        <label>Caption</label>
        <div class="input-wrap">
          <input
            :class="{ 'input-error': errors.has('review-heading') }"
            v-validate="'max:100'"
            class="input-default"
            name="review-heading"
            v-model="reviewHeading"
            placeholder="Awesome"
            type="text"
          />
          <span
            v-show="errors.has('review-heading')"
            class="error-message-input"
            >{{ errors.first('review-heading') }}
          </span>
        </div>
      </div>

      <div class="review-action__form-item">
        <label>Message</label>
        <div class="input-wrap">
          <textarea
            name="review-message"
            :class="{ 'error-textarea': errors.has('review-message') }"
            v-model="reviewMessage"
            v-validate="'required|max:2000'"
            placeholder="Your message"
            id=""
            cols="30"
            rows="10"
          >
          </textarea>
          <span
            v-show="errors.has('review-message')"
            class="error-message-input"
            >{{ errors.first('review-message') }}
          </span>
        </div>
      </div>

      <div class="review-action__form-item">
        <button class="button-prime left-icon" @click="createReview">
          <svg-create-comment></svg-create-comment>
          <span>Leave a review</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import Star from '../../common-components/Star'
import utils from '@/mixins/utils'

Vue.use(VeeValidate)

export default {
  name: 'reviews-large-action',
  data () {
    return {
      userRating: 0,
      reviewHeading: '',
      reviewMessage: '',
      isValidRating: true,
      selectedRate: {
        state: false,
        position: 0
      }
    }
  },
  watch: {
    userRating () {
      this.isValidRating = true
    }
  },
  mixins: [utils],
  props: ['purchasedProduct', 'productReviews', 'product'],
  methods: {
    createReview () {
      this.$validator.validateAll().then(result => {
        this.isValidRating = this.selectedRate.position > 0

        if (result && this.isValidRating) {
          let review = {
            productId: this.product.id,
            rating: this.selectedRate.position,
            headline: this.reviewHeading,
            text: this.reviewMessage
          }

          this.$emit('createUserReview', review)
        }
      })
    },
    changeRatingByHover (position) {
      this.userRating = position
    },
    clearRating () {
      if (!this.selectedRate.state) {
        this.userRating = 0
      } else {
        this.userRating = this.selectedRate.position
      }
    },
    setRating (position) {
      this.userRating = position
      this.selectedRate.state = true
      this.selectedRate.position = position
    },
    openModalCart () {
      this.$store
        .dispatch('setModalProductId', this.product.slug)
        .then(response => {
          this.$store.dispatch('toggleCartModal', true)
        })
    }
  },
  components: {
    Star
  }
}
</script>

<style scoped lang="scss">
.review-action {
  margin-top: 32px;
  &__title {
    margin-bottom: 16px;
  }
  &__stub {
    text-align: center;
  }
  &__stub-image {
    width: 100%;
    img {
      width: 100%;
    }
  }
  &__stub-heading {
    margin-top: 32px;
    margin-bottom: 0;
    &--small {
      font-size: 24px;
    }
  }
  &__stub-text {
    margin-bottom: 0;
    margin-top: 32px;
    &--small {
      margin-top: 8px;
    }
  }
  &__button {
    display: flex;
    justify-content: center;
    button {
      width: 250px;
    }
  }
  &__form-item {
    display: flex;
    flex-wrap: wrap;
    label {
      margin-bottom: 8px;
      flex: 0 0 100%;
      font-family: $sours-sans-p-font;
      font-size: 14px;
      font-weight: 600;
      color: $main-dark;
    }
    .input-wrap {
      width: 100%;
      position: relative;
    }
    .error-message-input {
      position: absolute;
      bottom: -18px;
      left: 0;
      font-size: 12px;
      line-height: 1;
    }
    textarea {
      padding: 15px;
      width: 100%;
      height: 120px;
      &:focus {
        outline: none;
      }
    }
    button {
      width: 255px;
      margin-left: auto;
      margin-top: 8px;
    }
    .item-flex {
      display: flex;
      align-items: center;
    }
  }
  &__rating-count {
    margin-left: 16px;
    font-family: $montserrat-font;
    font-size: 16px;
    font-weight: 500;
    color: $main-dark;
    line-height: 21px;
  }
  &__stars-wrap {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .review-action__form-item + .review-action__form-item {
    margin-top: 24px;
  }
}

@media all and (max-width: $md) {
  .review-action {
    &__stub-heading {
      margin-top: 16px;
      font-size: 20px;
    }
    &__stub-text {
      margin-top: 0;
      font-size: 14px;
    }
  }
}

@media all and (max-width: $xssm) {
  .review-action {
    margin-top: 32px;
  }
}

@media all and (max-width: 768px) {
  .review-action {
    margin: 0 -16px 64px;
    &__title {
      margin-bottom: 16px;
    }
    &__form {
      &-item .button-prime {
        width: 100%;
      }
    }
  }
  .large-action-single {
    .review-action {
      margin: 64px 0 0 0;
      width: 100%;
    }
  }
}
</style>
