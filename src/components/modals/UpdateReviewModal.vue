<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container update-review">
          <div class="modal-wrap" v-on-clickaway="closeModal">
            <div class="update-review__header">
              <div class="update-review__close" @click="closeModal">
                <svg-close></svg-close>
              </div>
            </div>

            <div class="update-review__title">
              <div class="update-review__icon"><svg-edit></svg-edit></div>
              <h3
                :class="{
                  'h3-secondary': $mq !== 'sm',
                  'h4-secondary': $mq === 'sm'
                }"
                v-text="reviewId ? 'Edit Review' : 'Leave Review'"
              ></h3>
            </div>

            <div class="modal-body update-review__body">
              <div class="update-review__form">
                <div class="update-review__form-item">
                  <label>Rating</label>
                  <div class="item-flex input-wrap">
                    <div
                      class="update-review__stars-wrap"
                      @mouseleave="clearRating"
                    >
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
                      ></star>
                    </div>
                    <span class="update-review__rating-count"
                      >{{ userRating }} out of 5 stars</span
                    >
                    <span v-show="!isValidRating" class="error-message-input">
                      Please choose the rating from 1 to 5
                    </span>
                  </div>
                </div>
                <div class="update-review__form-item">
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
                    >
                      {{ errors.first('review-heading') }}</span
                    >
                  </div>
                </div>

                <div class="update-review__form-item">
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
                    ></textarea>
                    <span
                      v-show="errors.has('review-message')"
                      class="error-message-input error-text-area"
                    >
                      {{ errors.first('review-message') }}</span
                    >
                  </div>
                </div>

                <div class="update-review__form-item update-review__buttons">
                  <button
                    class="button-second button-second--tertiary"
                    @click="closeModal"
                  >
                    <span>Cancel</span>
                  </button>
                  <button class="button-prime" @click="updateReview">
                    <span
                      v-text="reviewId ? 'Edit Review' : 'Leave Review'"
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import Star from '../common-components/Star'
import utils from '@/mixins/utils'
import { EventBus } from '../../event-bus'
import { mapGetters } from 'vuex'
import _ from 'lodash'

Vue.use(VeeValidate)

export default {
  name: 'update-review-modal',
  data () {
    return {
      userRating: 0,
      reviewHeading: '',
      reviewMessage: '',
      isValidRating: true,
      reviewId: null,
      productId: null,
      selectedRate: {
        state: false,
        position: 0
      }
    }
  },
  watch: {
    userRating (val) {
      this.isValidRating = true
    }
  },
  mixins: [clickaway, utils],
  methods: {
    closeModal () {
      this.$store.dispatch('toggleUpdateReviewModal', false)
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
    updateReview () {
      this.$validator.validateAll().then(result => {
        this.isValidRating = this.selectedRate.position > 0

        if (result && this.isValidRating) {
          let review = Object.assign(
            {},
            {
              reviewId: this.reviewId,
              rating: this.selectedRate.position,
              headline: this.reviewHeading,
              text: this.reviewMessage,
              productId: this.productId
            }
          )

          this.productId
            ? EventBus.$emit('createUserReview', review)
            : EventBus.$emit('updateUserReview', review)
        }
      })
    }
  },
  created () {
    this.scrollingModalOpen(true)
    let cloneOfStateReview = _.cloneDeep(this.updateReviewModal)

    if (cloneOfStateReview.productId) {
      this.setRating(0)
      this.reviewHeading = ''
      this.reviewMessage = ''
      this.productId = cloneOfStateReview.productId
    } else {
      this.setRating(cloneOfStateReview.review.rating)
      this.reviewHeading = cloneOfStateReview.review.headline
      this.reviewMessage = cloneOfStateReview.review.text
      this.reviewId = cloneOfStateReview.review.id
    }
  },
  beforeDestroy () {
    this.scrollingModalOpen(false)
  },
  components: {
    Star
  },
  computed: {
    ...mapGetters(['updateReviewModal'])
  }
}
</script>

<style scoped lang="scss">
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.modal-mask {
  position: fixed;
  z-index: 9998 !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  overflow-y: auto;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
}

.modal-container {
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0 auto;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.modal-wrap {
  width: 544px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  border-radius: 4px;
}

.modal-body {
  padding: 0;
}

.modal-footer {
  border-top: none;
}
.update-review {
  position: relative;
  &__header {
    display: flex;
    flex-direction: row-reverse;
    width: 100%;
  }
  &__close {
    display: flex;
    cursor: pointer;
    z-index: 100;
    svg {
      fill: $main-grey;
      width: 18px;
      height: 18px;
    }
  }
  &__title {
    margin-bottom: 22px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    h3 {
      margin-bottom: 0;
    }
  }
  &__icon {
    margin-right: 16px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    background: #d0defb;
    svg {
      width: 21px;
      height: 21px;
      fill: $main-color;
    }
  }
  &__body {
    padding: 0 16px 16px 16px;
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
      left: 0;
      bottom: -18px;
      font-size: 12px;
      line-height: 1;
    }
    .error-text-area {
      position: relative;
      top: 0;
      margin-bottom: -15px;
      display: block;
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
      width: 120px;
    }
    button + button {
      margin-left: 16px;
    }
    .item-flex {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }
  }
  &__buttons {
    justify-content: flex-end;
  }
  &__rating-count {
    font-family: $montserrat-font;
    font-size: 16px;
    font-weight: 500;
    color: $main-dark;
    line-height: 21px;
  }
  &__stars-wrap {
    display: flex;
    align-items: center;
    margin-right: 16px;
    cursor: pointer;
  }
}
.update-review__form-item + .update-review__form-item {
  margin-top: 24px;
}

@media (max-width: $sm) {
  .modal-container {
    min-width: 288px;
    width: calc(100% - 32px);
  }

  .update-review__form-item {
    button {
      min-width: 120px;
      width: calc(50% - 8px);
    }
  }

  .update-review {
    &__header {
      position: absolute;
      right: 16px;
    }

    &__title,
    &__body {
      padding: 0;
    }
  }
}

@media (max-width: 375px) {
  .update-review__rating-count {
    margin-top: 8px;
  }
}
</style>
