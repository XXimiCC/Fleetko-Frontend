<template>
  <div
    class="filter-price"
    :class="{ responsive: $parent.$options.name !== 'catalog' }"
  >
    <div
      v-if="$mq === 'xl' || $mq === 'lg'"
      :class="{ open: showPrice }"
      @click="showPrice = !showPrice"
      class="filter-price--heading"
    >
      <span>Price</span>
      <svg-chevron></svg-chevron>
    </div>

    <transition name="fade">
      <div v-show="showPrice" class="filter-price--body">
        <div class="filter-price--body--input">
          <input
            type="text"
            class="input-default"
            @paste="onPaste"
            ref="minPriceLimit"
            :id="'minPriceLimit'"
            :name="'minPriceLimit'"
            @focus="$refs.minPriceLimit.focus()"
            @input="onlyNumbers($event, 'minPriceLimit')"
            @blur="validPriceInput($event, 'minPriceLimit')"
            :value="prices[0]"
          />
          <span>&minus;</span>
          <input
            type="text"
            class="input-default"
            @paste="onPaste"
            ref="maxPriceLimit"
            :id="'maxPriceLimit'"
            :name="'maxPriceLimit'"
            @focus="$refs.maxPriceLimit.focus()"
            @input="onlyNumbers($event, 'maxPriceLimit')"
            @blur="validPriceInput($event, 'maxPriceLimit')"
            :value="prices[1]"
          />
          <span>&minus;</span>
          <div class="button-wrap">
            <button
              @click.stop="submitPriceChangingByButton(prices)"
              :disabled="preloader"
              class="button-prime ok-button"
            >
              Ok
            </button>
          </div>
        </div>
        <div class="filter-price--body--range">
          <vue-slider
            v-if="showPrice && minPriceSelected && maxPriceSelected"
            @callback="debouncedInput($event)"
            @drag-end="debouncedInput($event.currentValue)"
            ref="rangeSlider"
            :height="4"
            :tooltip="'hover'"
            :bg-style="{ backgroundColor: '#E0E0E0' }"
            :process-style="{ backgroundColor: '#1458EB' }"
            :dot-size="20"
            :max="maxPriceLimit"
            :min="minPriceLimit"
            :value.sync="prices"
          >
          </vue-slider>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import vueSlider from 'vue-slider-component'

export default {
  name: 'filter-price',
  components: {
    vueSlider
  },
  props: [
    'relativePrices',
    'minPriceLimit',
    'maxPriceLimit',
    'dataReady',
    'minPriceSelected',
    'maxPriceSelected'
  ],
  // created () {
  //   console.log('ttetre')
  // },
  data () {
    return {
      showPrice: true,
      validationInputDelay: 600,
      prices: this.relativePrices
    }
  },
  computed: {
    ...mapGetters(['preloader'])
  },
  watch: {
    relativePrices (val, oldVal) {
      if (val[0] !== oldVal[0] || val[1] !== oldVal[1]) {
        this.prices = val
      }
    }
  },
  methods: {
    onlyNumbers ($event) {
      $event.target.value = $event.target.value.replace(/[^\d]/, '')
    },
    onPaste ($event) {
      $event.preventDefault()
    },
    debouncedInput: _.debounce(function (targetValue) {
      if (
        targetValue[0] !== this.prices[0] ||
        targetValue[1] !== this.prices[1]
      ) {
        this.prices.splice(0, 1, targetValue[0])
        this.prices.splice(1, 1, targetValue[1])
        this.$emit('changePrice', this.prices)
      }
    }, 500),
    submitPriceChangingByButton () {
      if (
        parseInt(this.$route.query.selected_min) !== this.prices[0] ||
        parseInt(this.$route.query.selected_max) !== this.prices[1]
      ) {
        this.$emit('changePrice', this.prices)
      }
    },
    validPriceInput ($event, priceInputName) {
      let targetValue = $event.target.value

      if (priceInputName === 'minPriceLimit') {
        if (parseInt(targetValue) < this.minPriceLimit) {
          targetValue = this.minPriceLimit
        } else if (
          !$event.target.value ||
          parseInt(targetValue) > this.maxPriceLimit
        ) {
          targetValue = this.prices[0]
        }
        this.prices.splice(0, 1, targetValue)
      }

      if (priceInputName === 'maxPriceLimit') {
        if (parseInt(targetValue) > this.maxPriceLimit) {
          targetValue = this.maxPriceLimit
        } else if (
          !$event.target.value ||
          parseInt(targetValue) < this.minPriceLimit
        ) {
          targetValue = this.prices[1]
        }
        this.prices.splice(1, 1, targetValue)
      }

      this.prices.sort((a, b) => a - b)
    }
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.filter-price {
  margin-bottom: 24px;

  &.responsive {
    .ok-button {
      &:hover {
        background: linear-gradient(to bottom, #4f82f0 0%, #1458eb 100%);
      }
    }
  }

  &--heading {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;

    span {
      font: 500 16px $montserrat-font;
      color: $main-dark;
    }

    svg {
      transition: all 0.3s;
      transform: rotate(0deg);
      width: 24px;
      height: 24px;
      fill: $main-grey;
    }
  }

  &--body {
    &--input {
      display: flex;
      align-items: center;
      font-family: $sours-sans-p-font;
      font-size: 16px;
      color: $main-dark;

      span {
        margin: 0 12px;
        font-weight: bold;
      }

      input {
        width: 64px;
        height: 40px;
      }

      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      .button-wrap {
        width: 56px;

        button {
          color: white;
          border: none;
          border-radius: 4px;
          height: 40px;
          text-transform: uppercase;
        }
      }
    }

    &--range {
      margin-top: 20px;
    }
  }

  .open {
    svg {
      transform: rotate(180deg);
    }
  }
}

@media (max-width: $md - 1) {
  .filter-price--body--input {
    margin-left: 20px;
  }
  .filter-price--body--range {
    width: 248px;
    margin: 20px auto 0 20px;
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .filter-price {
    &--body {
      &--input {
        input {
          width: 56px;
        }
        span {
          margin: 0 6px;
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $md) {
  .filter-price {
    margin-bottom: 0;
  }
}
</style>
