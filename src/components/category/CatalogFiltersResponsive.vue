<template>
  <div class="filters">
    <div class="filters--scroll">
      <div class="filters--body">
        <div class="filters--header">
          <div class="item">
            <h3>Filter</h3>
            <div class="filter-counter" v-if="tags.length">
              {{ tags.length }}
            </div>
          </div>
          <div class="item">
            <button
              :ref="'clearButton'"
              @click="clearAll"
              class="button-second button-clear"
            >
              Clear
            </button>
            <button
              @click="$emit('toggleResponsiveFilters', false)"
              class="button-prime"
            >
              Done
            </button>
          </div>
        </div>

        <div v-if="preloader" class="preloader-wrap">
          <loader class="loader"></loader>
        </div>

        <div class="content-wrap" v-else>
          <div class="filters__tags">
            <filter-tag
              @deleteTag="deleteTag"
              :key="i"
              :tag="tag"
              v-for="(tag, i) in tags"
            ></filter-tag>
          </div>
          <div class="filters--body--section-wrap">
            <div
              class="filters--body--section"
              @click="openSortBy = !openSortBy"
              :class="{ 'filters--body--section--active': openSortBy }"
            >
              <div class="item"><span>Sort By</span></div>
              <div class="item">
                <div
                  class="toggle-caret"
                  :class="{ 'toggle-caret--close': !openSortBy }"
                >
                  <svg-chevron></svg-chevron>
                </div>
              </div>
            </div>
            <div class="sorting-wrap" v-show="openSortBy">
              <div
                class="sorting-wrap--item radio-default"
                v-for="sortOption in sorting"
              >
                <label @click="changeSortMethod(sortOption)">
                  <input
                    :checked="sortOption === selectedSorting"
                    :value="sortOption"
                    type="radio"
                  />
                  <span class="radio-label">{{
                    sortingOptionLabelText(sortOption)
                  }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="filters--body--section-wrap">
            <div
              class="filters--body--section"
              @click="openPrice = !openPrice"
              :class="{ 'filters--body--section--active': openPrice }"
            >
              <div class="item"><span>Price</span></div>
              <div class="item">
                <div
                  class="toggle-caret"
                  :class="{ 'toggle-caret--close': !openPrice }"
                >
                  <svg-chevron></svg-chevron>
                </div>
              </div>
            </div>
            <div class="price-wrap" v-if="openPrice">
              <filter-price
                :relativePrices="prices"
                @changePrice="$emit('changePrice', prices)"
                :dataReady="dataReady"
                :minPriceSelected="minPriceSelected"
                :maxPriceSelected="maxPriceSelected"
                :minPriceLimit="minPriceLimit"
                :maxPriceLimit="maxPriceLimit"
              >
              </filter-price>
            </div>
          </div>
          <div
            class="filters--body--section-wrap"
            v-for="(filter, i) in filters"
            v-if="!catalogDealer"
          >
            <options-filter
              @checkbox-false="checkboxFalse"
              @checkbox="checkboxTrue"
              @openedByUser="openedByUser"
              :filtersOpenedByUser="filtersOpenedByUser"
              :relative="filters[i]"
              :filter="filter"
            >
            </options-filter>
          </div>
          <div class="filters--body--section-wrap" v-if="!catalogDealer">
            <options-dealers
              :openResponsiveDealers="openResponsiveDealers"
              @dealerOpenedByUser="dealerOpenedByUser"
              @checkbox-dealer-false="deleteDealerCheckbox"
              @checkbox-dealer="setDealerCheckbox"
              :filter="dealers"
            >
            </options-dealers>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Loader from '../common-components/Loader'
import OptionsFilter from '../common-components/filters/OptionsFilter'
import FilterPrice from '../common-components/filters/FilterPrice'
import OptionsDealers from '../common-components/filters/OptionsDealers'
import FilterTag from '../common-components/filters/FilterTag'

export default {
  name: 'catalog-filters-responsive',
  components: {
    FilterPrice,
    OptionsFilter,
    Loader,
    OptionsDealers,
    FilterTag
  },
  props: [
    'relativePrices',
    'filtersOpenedByUser',
    'openResponsiveDealers',
    'minPriceLimit',
    'maxPriceLimit',
    'dataReady',
    'sorting',
    'tags',
    'filters',
    'dealers',
    'minPriceSelected',
    'maxPriceSelected',
    'catalogDealer',
    'selectedSorting'
  ],
  data () {
    return {
      openSortBy: true,
      openPrice: false,
      prices: this.relativePrices,
      openOptions: false
    }
  },
  computed: {
    ...mapGetters(['preloader'])
  },
  activated () {
    this.prices = this.relativePrices
    this.openPrice = true
  },
  deactivated () {
    this.openPrice = false
  },
  methods: {
    clearAll () {
      this.prices = [this.minPriceLimit, this.maxPriceLimit]
      this.$emit('clearAll')
    },
    deleteTag (tag) {
      if (tag.filterName === 'Price') {
        this.prices = [this.minPriceLimit, this.maxPriceLimit]
      }

      this.$emit('deleteTag', tag)
    },
    openedByUser (open, filter) {
      this.$emit('openedByUser', open, filter)
    },
    dealerOpenedByUser (open) {
      this.$emit('dealerOpenedByUser', open)
    },
    checkboxFalse (item, filter) {
      this.$emit('checkbox-false', item, filter)
    },
    checkboxTrue (item, filter) {
      this.$emit('checkbox', item, filter)
    },
    deleteDealerCheckbox (item) {
      this.$emit('checkbox-dealer-false', item)
    },
    setDealerCheckbox (item) {
      this.$emit('checkbox-dealer', item)
    },
    changeSortMethod (sortOption) {
      this.$emit('cheangeSortinnMethod', sortOption)
    },
    sortingOptionLabelText (sortOption) {
      if (sortOption === 'New') {
        return 'New'
      } else if (sortOption === 'Old') {
        return 'Old'
      } else if (sortOption === 'Expensive') {
        return 'Expensive'
      } else if (sortOption === 'Cheap') {
        return 'Cheap'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.filters {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 3000;

  .preloader-wrap {
    position: absolute;
    top: 47%;
    left: 50%;
  }

  &--scroll {
    width: 100%;
    height: 100%;
  }

  &__tags {
    padding: 8px 16px;
    display: flex;
    flex-wrap: wrap;
    border-top: 1px solid $light-grey;
  }

  .button-clear {
    border-color: $main-grey;
    color: $main-grey;
    &:hover {
      border: 1px solid #828ca2 !important;
      color: #828ca2 !important;
    }
  }

  &--body {
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 0;
    height: 100%;
    padding-bottom: 18px;

    &--section {
      padding-left: 16px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .item {
        display: flex;
        align-items: center;

        .toggle-caret {
          width: 48px;
          height: 48px;
          justify-content: center;
          align-items: center;
          display: flex;
          cursor: pointer;

          svg {
            width: 16px;
            fill: $main-grey;
            transition: all 0.5s;
            transform: rotate(180deg);
          }

          &--close {
            svg {
              transform: rotate(0deg);
            }
          }
        }

        span {
          font-weight: 500;
          font-family: $montserrat-font;
          color: $main-dark;
          font-size: 16px;
        }
      }
    }

    .filters--body--section-wrap {
      cursor: pointer;
      & + & {
        margin-top: 2px;
      }
    }

    .price-wrap {
      padding: 32px 16px;
    }

    .sorting-wrap {
      padding: 16px;

      &--item {
        position: relative;
        height: 48px;
        input[type='radio']:checked + .radio-label {
          color: $main-dark;
        }
        .radio-label {
          font: 500 12px/24px $montserrat-font;
          color: $dark-grey;
          cursor: pointer;
        }
      }
    }
  }

  &--header {
    padding: 16px;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .item {
      display: flex;
      align-items: center;

      h3 {
        margin-right: 8px;
        margin-bottom: 0;
      }

      .button-second {
        &:hover {
          background: white;
          cursor: pointer;
          border: 1px solid $main-color;
          border-radius: 4px;
          color: $main-color;
          box-shadow: none;
        }
      }

      .filter-counter {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        height: 24px;
        border-radius: 4px;
        background: $success;
        font: 12px/16px $sours-sans-p-font;
        color: white;
      }

      .button-prime {
        width: 80px;
        height: 32px;
      }

      .button-second {
        margin-right: 8px;
        width: 80px;
        height: 32px;
      }
    }
  }
}
</style>
