<template>
  <div
    class="card"
    :class="{ 'card--block': view === 'column' }"
    itemscope
    itemprop="itemListElement"
    itemtype="http://schema.org/ListItem"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <router-link
      v-if="view === 'column'"
      class="card__image"
      :to="{ name: 'product-page', params: { slug: good.slug } }"
      :class="{ 'card__image--blurred': showNoStock }"
    >
      <div class="image">
        <app-image
          :imagePath="componentProductImage(good.image)"
          @emitErrorImage="errorImage"
          itemprop="image"
        >
        </app-image>
        <div v-if="good.freight" class="freight">
          <svg-freight></svg-freight>
          <p>Freight</p>
        </div>
      </div>
      <transition name="stock">
        <div class="no-stock" v-if="showNoStock">
          <p>Out</p>
          <p>Of Stock</p>
        </div>
      </transition>
    </router-link>

    <div v-if="view === 'column'" class="card__info">
      <router-link
        :to="{ name: 'product-page', params: { slug: good.slug } }"
        itemprop="url"
        class="name"
      >
        <span class="name--wrap">{{ good.name }}</span>
      </router-link>

      <div class="rating">
        <div class="stars">
          <star
            v-for="(star, i) in 5"
            :position="++i"
            :key="i"
            readOnly="true"
            smallMargin="true"
            size="13"
            :rating="good.rating_average"
          >
          </star>
        </div>
        <router-link
          :to="{
            name: 'product-page',
            params: { slug: good.slug },
            query: { tab: 'reviews' }
          }"
        >
          <span
            >({{
              `${good.rating_count} review${good.rating_count > 1 ? 's' : ''}`
            }})</span
          >
        </router-link>
      </div>

      <div class="dealer">
        <span class="dealer__label">Dealer:</span>
        <router-link
          :to="{ name: 'dealer', params: { slug: good.dealer_slug } }"
          class="dealer__name"
        >
          {{ good.dealer_name }}
        </router-link>
      </div>
    </div>

    <div v-if="view === 'column'" class="card__actions">
      <div v-if="good.price"
           class="price"
           :class="{ 'price--grey': good.quantity < 1 }">
        ${{ toDollarDecimal(good.price) }}
      </div>

      <div v-if="!good.price" class="no-price">
        <p class="no-price__title">Unavailable</p>
        <div
          class="no-price__help"
          @mouseenter="showInfo = true"
          @mouseleave="showInfo = false"
        >
          <svg-help></svg-help>
        </div>
        <transition name="stock">
          <div v-if="showInfo" class="no-price__info">
            The good will soon be shipped to the warehouses. Add the good to the
            Wait List and we will notify you as soon as the good arrives
          </div>
        </transition>
      </div>

      <button
        v-if="good.quantity && good.price"
        @click="openModalCart"
        :class="{
          'button-prime': view === 'row',
          'button-second': view !== 'row'
        }"
      >
        <svg-basket></svg-basket>
        <span>Add to cart</span>
      </button>
      <button @click="addToWaitList" class="button-add button-second" v-else>
        <svg-wishlist v-if="!inWaitList"></svg-wishlist>
        <svg-check-xl v-if="inWaitList"></svg-check-xl>
        <p v-if="inWaitList">{{ 'In Wait List' }}</p>
        <p v-if="!inWaitList">
          Add to <span class="break-point">wait list</span>
        </p>
      </button>

      <button class="button-second details">
        <router-link
          :to="{ name: 'product-page', params: { slug: good.slug } }"
        >
          View details
        </router-link>
      </button>
    </div>

    <product-card-row
      @addTo="addToWaitList"
      v-if="view !== 'column'"
      :product="good"
      catalog="true"
    ></product-card-row>
  </div>
</template>

<script>
import ProductCardRow from '../user-info/wait-list-parts/ProductCardRow'
import AppImage from '../parts/AppImage'
import { mapGetters } from 'vuex'
import utils from '@/mixins/utils'
import imageSource from '@/mixins/imagesSource'
import Star from './Star'

export default {
  name: 'ProductCard',
  components: {
    ProductCardRow,
    AppImage,
    Star
  },
  mixins: [utils, imageSource],
  props: ['good', 'view'],
  data () {
    return {
      hovered: false,
      showInfo: false,
      resizeTimer: null,
      isDesktop: true
    }
  },
  created () {
    this.resizeHandler()
    window.addEventListener('resize', this.resizeHandler)
  },
  computed: {
    showNoStock () {
      if (this.isDesktop) {
        return this.good.quantity < 1 && this.hovered
      } else {
        return this.good.quantity < 1
      }
    },
    ...mapGetters(['userWaitList', 'isAuth']),
    inWaitList () {
      if (this.userWaitList) {
        return this.userWaitList.some(item => item.id === this.good.id)
      }
    }
  },
  methods: {
    resizeHandler () {
      this.isDesktop = window.innerWidth > 648
    },
    openModalCart () {
      this.$store
        .dispatch('setModalProductId', this.good.slug)
        .then(() => this.$store.dispatch('toggleCartModal', true))
    },
    addToWaitList ($event, scrollY) {
      if (!this.isAuth) {
        this.$emit('beforeLogin', scrollY || window.scrollY)

        this.$store.dispatch('toggleLoginModal', {
          open: true,
          authGuard: false
        })

        this.$store.dispatch('setTemporaryProductId', this.good.id)
        return
      }

      if (!this.inWaitList) this.$store.dispatch('createWaitListedProduct', this.good.id)
    },
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_PRODUCT)
    },
    componentProductImage (images, onError) {
      let sizeProperty = ['xl', 'lg', 'md', 'sm'].includes(this.$mq)
        ? 'medium'
        : 'tiny'

      return this.serverImageSource(
        images,
        sizeProperty,
        onError,
        this.SERVER_IMAGE_PRODUCT
      )
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
  }
}
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 0 0 100%;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 0;
  transition: box-shadow 0.2s;

  &--block {
    flex-direction: column;
    flex: 0 0 calc(100% / 3);
    padding: 16px;
    margin: 0 0 8px 0;
    border-radius: 4px;
    &:hover {
      box-shadow: 0 1px 5px 0.3px rgba(100, 100, 100, 0.3);
      z-index: 2;
    }

    .card__image {
      position: relative;
      width: 100%;
      margin: 0 0 16px 0;
      padding-top: 100%;
    }
    .card__info {
      margin: 0;
      width: 100%;
    }
    .card__actions {
      width: 100%;
      .price {
        text-align: left;
        &--grey {
          color: $main-grey;
        }
      }
      .details {
        display: none;
      }
    }
  }

  &__image {
    position: relative;
    display: flex;
    width: 30%;
    align-items: center;
    justify-content: center;
    margin: 0 32px 0 0;

    .no-stock {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      background: rgba(119, 119, 119, 0.4);
      font-family: $montserrat-font;
      font-weight: 500;
      color: #fff;
      p:nth-child(1) {
        font-size: 48px;
      }
      p:nth-child(2) {
        font-size: 34px;
      }
    }

    .image {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }

    .freight {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      flex-flow: column nowrap;
      padding: 8px;
      border-radius: 4px;
      background-color: $main-color;
      font: 500 10px $montserrat-font;
      fill: #fff;
      color: #fff;
    }

    &--blurred {
      overflow: hidden;
      .image {
        img {
          filter: blur(5px);
        }
      }
    }
  }

  &__info {
    margin-right: auto;
    .name {
      display: flex;
      height: 60px;
      margin-bottom: 16px;
      transition: color 0.2s;

      &--wrap {
        margin: auto 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        font: 500 16px/20px $montserrat-font;
        color: $main-dark;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }

      &:hover {
        color: $main-color;
      }
    }
    .rating {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .stars {
        display: flex;
        margin-right: 8px;
      }
      a {
        font: 14px $sours-sans-p-font;
        color: $caption-text-color;
        transition: color 0.2s;
        &:hover {
          color: $dark-grey;
        }
      }
    }
    .dealer {
      display: flex;
      align-items: center;
      height: 19px;
      margin-bottom: 16px;
      &__label {
        font: 14px $sours-sans-p-font;
        color: $main-grey;
        border-bottom: 1px dashed transparent;
      }
      &__name {
        display: block;
        height: 19px;
        max-width: calc(100% - 8px);
        overflow: hidden;
        margin-left: 7px;
        border-bottom: 1px dashed transparent;
        font: 600 14px/19px $sours-sans-p-font;
        color: $main-color;
        white-space: nowrap;
        text-overflow: ellipsis;
        transition: border 0.2s;
        &:hover {
          border-bottom: 1px dashed $main-color;
        }
      }
    }
  }

  &__actions {
    width: 208px;
    .price {
      margin-bottom: 19px;
      text-align: right;
      font: 500 24px $montserrat-font;
      color: $main-color;
    }

    .no-price {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 19px;
      &__title {
        font: 500 24px $montserrat-font;
        color: $main-grey;
      }
      &__help {
        width: 20px;
        cursor: help;
        svg {
          fill: $main-grey;
        }
      }
      &__info {
        position: absolute;
        bottom: 0;
        right: 28px;
        padding: 16px;
        border: 1px solid $border-color;
        box-shadow: 0 5px 6.58px 0.42px rgba(0, 0, 0, 0.05),
          0 2px 9.8px 0.2px rgba(0, 0, 0, 0.02);
        border-radius: 4px;
        background: #fcfcfc;
        font: 14px/19px $sours-sans-p-font;
        &:after {
          position: absolute;
          bottom: 8px;
          right: -6px;
          width: 12px;
          height: 12px;
          content: '';
          border: 1px solid $border-color;
          border-left: none;
          border-bottom: none;
          background: inherit;
          transform: rotate(45deg);
        }
      }
    }
    .button-add {
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 20px;
        height: 20px;
      }
    }
    .details {
      margin-top: 8px;
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
    }
  }
}

@media (max-width: $sm) {
  .card {
    padding: 0;
    &--block {
      flex-direction: column;
      flex: 0 0 calc(100% / 2);
      padding: 16px;
    }
    &__image {
      .no-stock {
        p:nth-child(1) {
          font-size: 24px;
        }
        p:nth-child(2) {
          font-size: 20px;
        }
      }
      .freight {
        svg {
          display: none;
        }
      }
    }
  }
}

@media (max-width: $xssm) {
  .card {
    svg {
      display: none;
    }

    padding: 0;
    margin: 0;

    &:nth-of-type(odd) {
      margin: 0 8px 8px 0;
    }

    &--block {
      flex: 0 0 calc(50% - 4px);
      margin: 0 0 8px 0;
      padding: 8px;
      .card__image {
        margin: 0 0 8px 0;
      }
      .rating {
        display: none;
      }
    }
    &__image {
      margin: 0 16px 0 0;
    }
    &__info {
      .name {
        height: 48px;
        font: 500 12px/16px $montserrat-font;
      }
      .dealer {
        display: none;
      }
      .rating {
        flex-direction: column;
        align-items: flex-start;
        .stars {
          margin-bottom: 8px;
        }
      }
    }
    &__actions {
      .price {
        font: 500 16px/22px $montserrat-font;
        margin-bottom: 11px;
      }
    }
    .no-price {
      margin-bottom: 11px;
      &__title {
        font: 500 16px/22px $montserrat-font;
      }
    }
  }
}

@media (max-width: 380px) {
  .break-point {
    display: block;
    line-height: 1.1;
  }
}

@media (min-width: 481px) and (max-width: 648px) {
  .card__image {
    .no-stock {
      p:nth-child(1) {
        font-size: 40px;
      }
      p:nth-child(2) {
        font-size: 32px;
      }
    }
  }
}

@media (max-width: 480px) {
  .card__image {
    .no-stock {
      p:nth-child(1) {
        font-size: 32px;
      }
      p:nth-child(2) {
        font-size: 24px;
      }
    }
  }
}

svg {
  width: 20px;
  height: 20px;
}

.button-prime,
.button-second {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  svg {
    margin-right: 8px;
  }
}

.button-prime {
  svg {
    fill: #fff;
  }
}

.button-second {
  svg {
    fill: $main-color;
  }
}

.stock-enter-active,
.stock-leave-active {
  transition: opacity 0.2s;
}
.stock-enter,
.stock-leave-to {
  opacity: 0;
}
</style>
