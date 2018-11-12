<template>
  <div
    :style="{ bottom: position + 'px' }"
    :class="{ 'negative-margin': negativeMargin }"
    class="select-search"
  >
    <div class="select-search__body">
      <div class="item select-search__title">
        <div class="svg-wrap">
          <div
            v-if="showArrowBackResponsive"
            class="svg-wrap--arrow"
            @click="$emit('closeSearch')"
          >
            <svg-arrow-back></svg-arrow-back>
          </div>
          <div class="svg-wrap--truck"><svg-truck></svg-truck></div>
        </div>
        <h2 class="h2-primary">Select vehicle</h2>
      </div>
      <div class="item item-flex">
        <div class="select-search__body--select">
          <v-select
            id="select-year-home"
            class="vue-select"
            :debounce="250"
            :disabled="!getSearchOptions.years.length"
            :on-change.capture="changeYear"
            :placeholder="'Select Year'"
            :options="getSearchOptions.years"
            :value.sync="getSearchOptions.selectedYear"
            :searchable="false"
          ></v-select>
        </div>
        <div class="select-search__body--select">
          <v-select
            id="select-brand-home"
            class="vue-select"
            :disabled="!getSearchOptions.selectedYear"
            :debounce="250"
            :on-change.self="changeBrand"
            :placeholder="'Select Brand'"
            :options="getSearchOptions.brands"
            :value.sync="getSearchOptions.selectedBrand"
            :searchable="false"
          ></v-select>
        </div>
        <div class="select-search__body--select">
          <v-select
            id="select-model-home"
            class="vue-select"
            :disabled="!getSearchOptions.selectedBrand"
            :searchable="false"
            :on-change.self="changeModel"
            :debounce="250"
            :options="getSearchOptions.models"
            :value.sync="getSearchOptions.selectedModel"
            :placeholder="'Select Model'"
          ></v-select>
        </div>
        <div class="select-search__body--select">
          <button
            @click="submit"
            :disabled="!enableSearch"
            class="button-prime"
          >
            GO
          </button>
        </div>
      </div>
      <div
        class="select-search__footer"
        :style="{
          visibility: getSearchOptions.selectedModel ? 'visible' : 'hidden'
        }"
      >
        <div class="select-search__footer--delete" @click="clearSearch">
          <svg-delete-forever></svg-delete-forever>
          <span>Clear Vehicle</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import utils from '@/mixins/utils'
import { EventBus } from '../../event-bus'
import $ from 'jquery'

export default {
  name: 'SearchCommon',
  data () {
    return {
      search: false,
      selectReady: false,
      allowRouterChange: false
    }
  },
  props: ['position', 'filterSearch', 'negativeMargin'],
  watch: {},
  mixins: [utils],
  methods: {
    ...mapActions(['setYearSearch', 'setBrandSearch', 'setModelSearch']),
    changeYear (year) {
      if (year !== this.getSearchOptions.selectedYear) {
        this.$store.dispatch('clearSearch', {
          brand: true,
          model: true
        })
        this.setYearSearch(year)
      }
    },
    changeBrand (brand) {
      if (brand === null) {
        this.$store.dispatch('clearSearch', {
          brand: false,
          model: true
        })
        this.setBrandSearch(brand)
      }
      if (brand !== this.getSearchOptions.selectedBrand && brand !== null) {
        this.$store.dispatch('clearSearch', {
          brand: false,
          model: true
        })
        this.setBrandSearch(brand)
      }

      Vue.nextTick(() => {
        const selectedBrandSpan = $('#select-brand .selected-tag')

        if (selectedBrandSpan.text().length) {
          selectedBrandSpan.addClass('selected-tag--overflow')
        } else {
          selectedBrandSpan.removeClass('selected-tag--overflow')
        }
      })
    },
    changeModel (model) {
      this.selectedModel = model
      model !== null ? this.setModelSearch(model) : this.setModelSearch(null)
      this.selectReady = true
      this.search = true

      Vue.nextTick(() => {
        const selectedModelSpan = $('#select-model .selected-tag')

        if (selectedModelSpan.text().length) {
          selectedModelSpan.addClass('selected-tag--overflow')
        } else {
          selectedModelSpan.removeClass('selected-tag--overflow')
        }
      })
    },
    changeView (tab) {
      this.show = tab
    },
    submit () {
      if (this.enableSearch) {
        if (this.filterSearch) {
          EventBus.$emit('filterCategoryByVehicle', true)
        } else {
          this.$router.push({
            name: 'searchPage',
            params: { slug: this.getSearchOptions.slug }
          })
        }
        this.$emit('search')
        Vue.nextTick(() => {
          this.search = false
        })
      }
      this.$emit('closeSearch')
    },
    clearSearch () {
      this.$store.dispatch('clearSearch', {
        brand: true,
        model: true,
        year: true
      })

      EventBus.$emit('filterClearVehicle', true)
    }
  },
  computed: {
    ...mapGetters(['getSearchOptions', 'enableSearch']),
    showArrowBackResponsive () {
      return (
        (this.$route.name === 'catalog' && this.$route.query.vehicle) ||
        this.$route.name === 'searchPage'
      )
    }
  },
  components: {
    vSelect
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
}
.padding-none {
  padding: 0;
}
.select-search {
  position: absolute;
  width: 100%;
  z-index: 20;
  display: flex;
  justify-content: center;
  &__body {
    width: 1248px;
    display: flex;
    flex-wrap: wrap;
    padding: 21px 64px 21px 64px;
    background: white;
    box-shadow: 0px 0px 5.7px 0.3px rgba(102, 102, 102, 0.5);
    border-radius: 4px;
    z-index: 99;
    .item {
      width: 100%;
      .svg-wrap {
        display: none;
      }
      &:last-child {
        display: flex;
      }
    }
    .item-flex {
      display: flex;
    }
    &--select {
      width: 25%;
      flex: 0 0 25%;
      .v-select {
        width: 274px;
      }
      button {
        width: 274px;
        height: 56px;
        color: white;
        font-family: $montserrat-font;
        font-size: 12px;
        font-weight: 500;
        line-height: 18px;
        &:disabled {
          opacity: 1;
          background: #e6e7ea;
          color: #263238;
        }
      }
    }
  }
  &__footer {
    margin-top: 24px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    &--delete {
      display: flex;
      align-items: center;
      cursor: pointer;
      svg {
        fill: $main-grey;
      }
      span {
        margin-left: 8px;
        color: $dark-grey;
        font-size: 12px;
        font-weight: 500;
      }
      &:hover {
        svg {
          fill: $main-color;
        }
        span {
          color: $main-color;
        }
      }
    }
  }
}
.select-search__body--select + .select-search__body--select {
  margin-left: 8px;
}

@media (max-width: 1248px) {
  .select-search {
    &__body {
      width: 100%;
      &--select {
        .v-select {
          width: 100%;
        }
        button {
          width: 100%;
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $md) {
  .select-search {
    position: relative;
    width: calc(100% - 32px);
    left: 16px;
    padding-left: 0;
    padding-right: 0;
    .container {
      padding-left: 0;
      padding-right: 0;
    }
    &__title {
      h2 {
        margin-left: 8px;
        color: $main-color;
        margin-bottom: 0;
        font-size: 16px;
        font-weight: 500;
        text-transform: capitalize;
      }
    }
    &__body {
      padding: 16px;
      .item {
        &:first-child {
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          .svg-wrap {
            display: flex;
            align-items: center;
            &--arrow {
              margin-right: 12px;
              cursor: pointer;
              svg {
                width: 26px;
                fill: $main-dark;
              }
            }
            &--truck {
              svg {
                width: 26px;
                fill: $main-color;
              }
            }
          }
        }
      }
      .item-flex {
        flex-wrap: wrap;
      }
      &--select {
        width: 100%;
        flex: 0 0 100%;
        max-width: 100%;
        .v-select {
          width: 100%;
        }
        button {
          width: 100%;
          height: 40px;
        }
      }
    }
    .select-search__body--select + .select-search__body--select {
      margin-top: 8px;
      margin-left: 0;
    }
    &__footer {
      &--delete {
        width: 100%;
        justify-content: center;
      }
    }
    &.negative-margin {
      margin-top: -75px;
    }
  }
}
</style>
