<template>
  <div class="good" @mouseenter="hovered = true" @mouseleave="hovered = false">
    <div class="good__main">
      <div class="good__image" :class="{ 'good__image--blurred': showNoStock }">
        <router-link
          :to="{ name: 'product-page', params: { slug: good.slug } }"
        >
          <div v-if="showNoStock" class="good__no-stock">
            <span class="out">Out</span><span class="of-stock">Of Stock</span>
          </div>
          <app-image
            :imagePath="componentProductImage(good.image)"
            @emitErrorImage="errorImage"
          >
          </app-image>
        </router-link>
      </div>

      <div class="good__info">
        <router-link
          class="good__name"
          :to="{ name: 'product-page', params: { slug: good.slug } }"
        >
          {{ good.name }}
        </router-link>

        <div class="good__rating">
          <div class="stars">
            <star
              v-for="i in 5"
              :key="i"
              :position="++i"
              :readOnly="true"
              :size="$mq === 'sm' ? 13 : 18"
              :rating="good.rating_average"
            >
            </star>
            <span class="value">{{
              roundDecimalRating(good.rating_average || 0)
            }}</span>
          </div>
          <router-link
            class="reviews"
            :to="{
              name: 'product-page',
              params: { slug: good.slug },
              query: { tab: 'reviews' }
            }"
          >
            <span>({{ good.rating_count }} reviews)</span>
          </router-link>
        </div>

        <div class="good__dealer">
          <span class="label">Dealer:</span>
          <router-link
            class="link"
            :to="{ name: 'dealer', params: { slug: good.dealer_slug } }"
          >
            {{ good.dealer_name }}
          </router-link>
        </div>

        <div class="good__price" :class="{ 'good__price--grey': isPriceGrey }">
          <span v-if="good.price">${{ toDollarDecimal(good.price) }}</span>
          <span v-if="!good.price">Unavailable</span>
        </div>
      </div>
    </div>

    <div class="good__actions">
      <div v-if="!viewedMode" class="reviews">
        <div v-if="good.review" class="review">
          <div class="review__header">
            <div class="review__author">
              <img :src="userImageSrc(good.review.user, 32)" alt="" />
              <span itemprop="author"
                >{{ good.review.user.first_name }}
                {{ good.review.user.last_name }}</span
              >
            </div>
            <div
              class="good__rating"
              itemprop="reviewRating"
              itemscope
              itemtype="http://schema.org/Rating"
            >
              <div class="stars">
                <star
                  v-for="i in 5"
                  :key="i"
                  :position="++i"
                  :readOnly="true"
                  :size="$mq === 'sm' ? 13 : 18"
                  :rating="good.rating_average"
                >
                </star>
                <span class="value">{{
                  roundDecimalRating(good.rating_average || 0)
                }}</span>
              </div>
              <meta itemprop="worstRating" content="1" />
              <meta itemprop="ratingValue" :content="good.review.rating" />
              <meta itemprop="bestRating" content="5" />
            </div>
            <div class="review__date">
              <span itemprop="datePublished">{{
                toFormatedDate(good.review.published_at, 'L')
              }}</span>
            </div>
          </div>

          <div class="review__title">{{ good.review.headline }}</div>

          <p class="review__text" itemprop="description">
            {{ good.review.text }}
          </p>

          <div class="review__actions">
            <div @click.stop="makeEditable(good.review)" class="edit">
              <svg-edit></svg-edit>
              <span>Edit</span>
            </div>
            <div @click.stop="showConfirmForDelete(good.review)" class="delete">
              <svg-delete></svg-delete>
              <span>Delete</span>
            </div>
          </div>
        </div>

        <div v-if="!good.review" class="leave">
          <button
            @click="openModalForCreateReview(good.review)"
            class="button-prime"
          >
            <svg-create-comment></svg-create-comment>
            <span>Leave a review</span>
          </button>
        </div>
      </div>

      <div v-if="viewedMode" class="buy">
        <button
          v-if="good.quantity && good.price && good.purchasable"
          @click="openModalCart"
          class="button-second"
        >
          <svg-basket></svg-basket>
          <span>Add to cart</span>
        </button>

        <button
          v-if="(!good.quantity || !good.price) && good.status !== 'archived'"
          @click="addToWaitList"
          class="button-second"
        >
          <svg-wishlist v-if="!waitListIncludesProduct"></svg-wishlist>
          <svg-check-xl
            v-if="waitListIncludesProduct"
            class="small-svg"
          ></svg-check-xl>
          <span>{{
            waitListIncludesProduct ? 'In Wait List' : 'Add to wait list'
          }}</span>
        </button>
      </div>
    </div>

    <div v-if="viewedMode" @click="deleteFromViewed" class="good__delete">
      <svg-close></svg-close>
    </div>
  </div>
</template>

<script>
import AppImage from '../../parts/AppImage'
import Star from '../../common-components/Star'
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'
import { mapGetters } from 'vuex'

export default {
  name: 'ProfileGood',
  props: ['good', 'mode'],
  mixins: [utils, imageSource],
  components: { Star, AppImage },
  data () {
    return {
      hovered: false
    }
  },
  computed: {
    ...mapGetters(['userWaitList']),
    viewedMode () {
      return this.mode === 'review'
    },
    showNoStock () {
      if (['md', 'lg', 'xl'].includes(this.$mq)) {
        return this.good.quantity < 1 && this.viewedMode && this.hovered
      } else {
        return this.good.quantity < 1 && this.viewedMode
      }
    },
    waitListIncludesProduct () {
      if (this.userWaitList) {
        return this.userWaitList.some(good => good.id === this.good.id)
      }
    },
    isPriceGrey () {
      return (
        !this.good.quantity ||
        !this.good.price ||
        this.good.status === 'archived'
      )
    }
  },
  methods: {
    errorImage (error, img) {
      this.serverImageSource(img, null, error, this.SERVER_IMAGE_PRODUCT)
    },
    componentProductImage (img, error) {
      let sizeProperty = ['xl', 'lg', 'md'].includes(this.$mq)
        ? 'medium'
        : 'tiny'

      return this.serverImageSource(
        img,
        sizeProperty,
        error,
        this.SERVER_IMAGE_PRODUCT
      )
    },
    showConfirmForDelete (review) {
      this.$emit('showConfirmForDelete', review)
    },
    makeEditable (review) {
      this.$emit('makeEditable', review)
    },
    openModalForCreateReview () {
      this.$emit('openModalForCreateReview', this.good.id)
    },
    addToWaitList () {
      if (!this.waitListIncludesProduct) { this.$store.dispatch('createWaitListedProduct', this.good.id) }
    },
    deleteFromViewed () {
      this.$emit('deleteFromViewed', this.good.id)
    },
    openModalCart () {
      this.$store.dispatch('setModalProductId', this.good.slug).then(() => {
        this.$store.dispatch('toggleCartModal', true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.good {
  position: relative;
  display: flex;
  padding: 32px 0;
  border-bottom: 1px solid $light-grey;
  border-top: 1px solid $light-grey;
  & + & {
    border-top: none;
  }

  &__delete {
    position: absolute;
    right: 8px;
    top: 16px;
    cursor: pointer;
    svg {
      width: 18px;
      height: 18px;
      fill: $main-grey;
      &:hover {
        fill: $main-color;
      }
    }
  }

  &__main,
  &__actions {
    flex-shrink: 0;
    width: 50%;
  }

  &__main {
    display: flex;
  }

  &__image {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 160px;
    width: 160px;
    height: 160px;
    margin-right: 32px;
    img {
      max-width: 100%;
      max-height: 100%;
      width: 100%;
      height: 100%;
    }
    &--blurred {
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      img {
        filter: blur(7px);
        transition: 0.2s;
      }
    }
  }

  &__no-stock {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    z-index: 200;
    background: rgba(119, 119, 119, 0.4);
    .out,
    .of-stock {
      display: block;
      font: 500 40px $montserrat-font;
      color: white;
    }
    .out {
      margin-bottom: 4px;
    }
    .of-stock {
      font-size: 28px;
    }
  }

  &__info {
    padding: 8px 16px 0 0;
  }

  &__name {
    display: block;
    margin-bottom: 16px;
    font: 500 16px/22px $montserrat-font;
    color: $main-dark;
    transition: color 0.15s;
    word-break: break-word;
    &:hover {
      color: $main-color;
    }
  }

  &__rating {
    display: flex;
    margin-bottom: 20px;
    .stars {
      display: flex;
      align-items: center;
    }
    .value {
      margin: 0 8px;
      font: 500 12px $montserrat-font;
      color: $main-dark;
    }
    .reviews {
      font: 14px $sours-sans-p-font;
      color: $caption-text-color;
    }
  }

  &__dealer {
    display: flex;
    margin-bottom: 19px;
    .label {
      display: block;
      margin-right: 8px;
      font: 600 14px $sours-sans-p-font;
      color: $main-dark;
    }
    .link {
      display: block;
      font: 400 14px $sours-sans-p-font;
      color: $main-color;
      cursor: pointer;
      &:hover {
        border-bottom-color: transparent;
        text-decoration: underline;
        text-decoration-style: dashed;
      }
    }
  }

  &__price {
    font: 500 24px $montserrat-font;
    color: $main-color;
  }

  &__actions {
    .reviews {
      height: 100%;
      .review {
        &__header {
          display: flex;
          align-items: center;
          padding: 6px 0;
          margin-bottom: 19px;
        }
        &__author {
          display: flex;
          align-items: center;
          margin-right: 32px;
          img {
            margin-right: 16px;
            width: 24px;
            height: 24px;
            border-radius: 100%;
          }
          span {
            font-family: $montserrat-font;
            font-size: 12px;
            font-weight: 500;
            color: $main-dark;
          }
        }
        .good__rating {
          margin: 0 24px 0 0;
        }
        &__date {
          font: 14px $sours-sans-p-font;
          color: $paragraph;
        }
        &__title {
          margin-bottom: 10px;
          font: 500 16px $montserrat-font;
          color: $main-dark;
        }
        &__text {
          margin-bottom: 21px;
          font: 14px/19px $sours-sans-p-font;
          color: $dark-grey;
          white-space: pre-line;
        }
        &__actions {
          display: flex;
          .edit,
          .delete {
            display: flex;
            align-items: center;
            font: 14px $sours-sans-p-font;
            color: #989898;
            cursor: pointer;
            &:hover {
              color: $main-color;
              svg {
                fill: $main-color;
              }
            }
          }
          .edit {
            margin-right: 30px;
          }
          svg {
            margin-right: 4px;
            width: 16px;
            fill: #989898;
          }
        }
      }

      .leave {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 248px;
        }
        svg {
          margin-right: 8px;
          fill: #fff;
        }
      }
    }

    .buy {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      .small-svg {
        width: 20px;
      }
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 248px;
      }
      svg {
        margin-right: 8px;
        fill: $main-color;
      }
    }
  }
}

@media (max-width: $md) {
  .good {
    flex-flow: column;
    align-items: flex-end;

    &__main {
      width: 100%;
      margin-bottom: 16px;
    }

    &__actions {
      width: calc(100% - 194px);
    }

    &__actions {
      .reviews {
        .review {
          padding-top: 8px;
          border-top: 1px solid $light-grey;
        }
        .leave {
          justify-content: flex-start;
        }
      }
      .buy {
        justify-content: flex-start;
      }
    }
  }
}

@media (max-width: $sm) {
  .good {
    padding: 16px 0;
    &__image {
      flex: 0 0 120px;
      width: 120px;
      height: 120px;
      margin-right: 16px;
    }

    &__name {
      padding-right: 32px;
      margin-bottom: 16px;
      font: 500 12px $montserrat-font;
    }

    &__rating {
      flex-flow: column;
      margin-bottom: 8px;
      .reviews {
        margin-top: 4px;
      }
    }

    &__no-stock {
      .out,
      .of-stock {
        font: 500 26px $montserrat-font;
      }
      .of-stock {
        font-size: 20px;
      }
    }

    &__dealer {
      margin-bottom: 14px;
    }

    &__price {
      font: 500 20px $montserrat-font;
    }

    &__actions {
      width: 100%;
      .reviews {
        .leave {
          button {
            width: 100%;
          }
        }
      }
      .buy {
        button {
          width: 100%;
        }
      }
    }
  }
}
</style>
