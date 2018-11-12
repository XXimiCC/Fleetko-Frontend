<template>
  <div class="select-search">
    <div class="select-search__body">
      <div class="item select-search__title">
        <svg-truck
          v-if="$mq === 'xs' || $mq === 'sm' || $mq === 'md'"
        ></svg-truck>
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
  name: 'HomepageSearch',
  data () {
    return {
      selectReady: false,
      buttonShadow: true
    }
  },
  props: ['position', 'filterSearch'],
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
        this.addOverflowClassToElement($('#select-brand-home .selected-tag'))
      })
    },
    changeModel (model) {
      this.selectedModel = model
      model !== null ? this.setModelSearch(model) : this.setModelSearch(null)
      this.selectReady = true

      Vue.nextTick(() => {
        this.addOverflowClassToElement($('#select-model-home .selected-tag'))
      })
    },
    addOverflowClassToElement (element) {
      if (element.text().length) {
        element.addClass('selected-tag--overflow')
      } else {
        element.removeClass('selected-tag--overflow')
      }
    },
    changeView (tab) {
      this.show = tab
    },
    submit () {
      if (this.enableSearch) {
        this.buttonShadow = false

        if (this.filterSearch) {
          EventBus.$emit('filterCategoryByVehicle', true)
        } else {
          this.$router.push({
            name: 'searchPage',
            params: { slug: this.getSearchOptions.slug }
          })
        }

        this.$emit('search')
      }

      this.$emit('closeSearch')
    },
    clearSearch () {
      this.$store.dispatch('clearSearch', {
        brand: true,
        model: true,
        year: true
      })
    }
  },
  computed: {
    ...mapGetters(['getSearchOptions', 'enableSearch'])
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
  bottom: -121px;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 100;
  &__title {
    h2 {
      margin-bottom: 14px;
    }
  }
  &__body {
    width: 1248px;
    display: flex;
    flex-wrap: wrap;
    padding: 21px 64px 21px 64px;
    background: white;
    box-shadow: 0px 0px 5.7px 0.3px rgba(102, 102, 102, 0.5);
    .item {
      width: 100%;
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
        &:disabled {
          opacity: 1;
          background: #e6e7ea;
          color: #263238;
          box-shadow: none;
        }
      }
    }
  }
  h3 {
    margin-bottom: 24px;
    font-family: $montserrat-font;
    font-weight: 600;
    color: $main-dark;
    text-transform: uppercase;
    line-height: 0.7;
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

@media (min-width: $sm) and (max-width: $md) {
  .select-search {
    margin-top: -53px;
    background: #f2f5f7;
    .container {
      z-index: 30;
    }
    &__title {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      svg {
        margin-right: 8px;
        width: 26px;
        height: 26px;
        fill: $main-color;
      }
      h2 {
        color: $main-color;
        margin-bottom: 0;
        font-size: 16px;
        font-weight: 500;
        text-transform: capitalize;
      }
    }
    &__body {
      background: white;
      padding: 16px;
      border-radius: 4px;
      .item {
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
        }
      }
    }
    .select-search__body--select + .select-search__body--select {
      margin-left: 0;
      margin-top: 8px;
    }
    button {
      height: 40px;
      width: 100%;
    }
    &__footer {
      &--delete {
        width: 100%;
        justify-content: center;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .select-search {
    position: relative;
    bottom: 0;
    .container {
      z-index: 30;
    }
    &__title {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      svg {
        margin-right: 8px;
        width: 26px;
        height: 26px;
        fill: $main-color;
      }
      h2 {
        color: $main-color;
        margin-bottom: 0;
        font-size: 16px;
        font-weight: 500;
        text-transform: capitalize;
      }
    }
    &__body {
      background: white;
      padding: 16px;
      border-radius: 4px;
      .item {
        flex-wrap: wrap;
      }
      &--select {
        width: 100%;
        max-width: 100%;
        flex: 0 0 100%;
        .v-select {
          width: 100%;
        }
      }
    }
    .select-search__body--select + .select-search__body--select {
      margin-left: 0;
      margin-top: 8px;
    }
    button {
      height: 40px;
      width: 100%;
    }
    &__footer {
      &--delete {
        width: 100%;
        justify-content: center;
      }
    }
  }
}
</style>
