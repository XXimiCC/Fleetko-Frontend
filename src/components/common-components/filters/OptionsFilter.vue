<template>
  <div :class="{ open: open }">
    <div class="filter--heading" @click="toggle(filter)">
      <div class="item">
        <span>{{ filter.name }}</span>
        <div
          v-if="filter.description"
          @mouseleave="showInfoBlock = false"
          class="filter__tooltip-wrap"
        >
          <tooltip
            v-if="showInfoBlock"
            :allignRight="true"
            :allignBottom="true"
            :filtersInfo="true"
            class="filter__tooltip"
            :notification="notification"
          >
          </tooltip>
          <div class="filter__tooltip-svg" @mouseenter="showInfoBlock = true">
            <svg-help></svg-help>
          </div>
        </div>
      </div>

      <div class="item">
        <div class="toggle-caret" :class="{ 'toggle-caret--close': !open }">
          <svg-chevron class="svg-chevron"></svg-chevron>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-show="open" class="filter--body">
        <div v-for="item in filter.filter_options" class="filter--body--item">
          <div class="checkbox">
            <div class="item" :class="{ disabled: disabled(item) }">
              <label>
                <input
                  class="checkbox-default input-checkbox"
                  :disabled="item.products_count < 1 && !item.selected"
                  :checked="item.selected"
                  @click="checkOption($event, item, filter)"
                  type="checkbox"
                />
                <span class="checkbox--name">{{ item.name }}</span>
              </label>
            </div>
            <div class="item">
              <span class="checkbox--counter">
                {{ item.selected ? '' : defineCounter(item) }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import tooltip from '../../notifications/ErrorBox'
import utils from '@/mixins/utils'

export default {
  name: 'filters-option',
  components: {
    tooltip
  },
  mixins: [utils],
  props: ['filter', 'relative', 'filtersOpenedByUser'],
  data () {
    return {
      open: true,
      checkedCategories: [],
      item: false,
      selectedInGroup: null,
      showInfoBlock: false,
      notification: {
        text: this.filter.description,
        type: 'info-toolbox'
      }
    }
  },
  created () {
    if (this.$mq === 'sm' || this.$mq === 'xs' || this.$mq === 'md') {
      this.open =
        this.filtersOpenedByUser &&
        this.filtersOpenedByUser.length &&
        this.filtersOpenedByUser.includes(this.filter.id)
    }
  },
  watch: {
    filter (v) {
      this.selectedInGroup = v.filter_options.some(check => check.selected)
    }
  },
  methods: {
    defineCounter ({ products_count: qty }) {
      const InGroup = this.filter.filter_options.some(check => check.selected)
      const plus = qty && InGroup ? '+' : ''
      const hook1 = !InGroup ? '(' : ''
      const hook2 = !InGroup ? ')' : ''

      return `${plus}${hook1}${qty}${hook2}`
    },
    disabled (item) {
      return !item.products_count && !item.selected
    },
    toggle () {
      this.open = !this.open

      this.$emit('openedByUser', this.open, this.filter.id)
    },
    checkOption ($event, item, filter) {
      $event.target.checked
        ? this.$emit('checkbox', item, filter)
        : this.$emit('checkbox-false', item, filter)
    }
  }
}
</script>

<style lang="scss" scoped="">
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.filter--body--item + .filter--body--item {
  margin-top: 8px;
}

.filter {
  &--heading {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;

    .item {
      &:first-child {
        display: flex;
        align-items: center;
      }
    }

    span {
      font: 500 16px $montserrat-font;
      color: $main-dark;
    }

    .svg-chevron {
      transition: all 0.3s;
      transform: rotate(0deg);
      width: 24px;
      height: 24px;
      fill: $main-grey;
    }
  }

  &__tooltip-wrap {
    position: relative;
  }

  &__tooltip-svg {
    margin-left: 9px;
    display: flex;

    svg {
      height: 18px;
      fill: $svg-fill-tertiary;
    }
  }

  &--body {
    margin-bottom: 42px;

    .checkbox {
      display: flex;
      align-items: center;
      position: relative;
      justify-content: space-between;

      .item {
        display: flex;
        align-items: center;
      }

      label {
        display: flex;
        align-items: center;
        margin-bottom: 0;
        cursor: pointer;
        .checkbox--name {
          font: 500 12px $montserrat-font;
        }
      }

      &--name {
        max-width: 185px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 17px;
        font-family: $sours-sans-p-font;
        font-size: 16px;
        color: $main-dark;
      }

      &--counter {
        color: $main-grey;
        font-family: $sours-sans-p-font;
        font-weight: 500;
        font-size: 14px;
      }

      .disabled {
        input {
          background-color: #f5f5f5;
          cursor: not-allowed;

          &:before {
            border: 1px solid $grey;
          }
        }

        span {
          color: #d1d1d1;
        }
      }
    }
  }
}

.open {
  .svg-chevron {
    transform: rotate(180deg);
  }
}

/**
   * Code for checkboxes
   */
.checkbox {
}

@media (min-width: $xs) and (max-width: $md - 1px) {
  .filter {
    &--heading {
      margin-bottom: 0;
      padding-left: 16px;

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
            transition: 0.5s;
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
          text-transform: capitalize;
        }
      }
    }

    &--body {
      padding: 16px 0;
      margin-bottom: 0;

      &--item {
        padding-left: 16px;
        padding-right: 16px;
        height: 48px;
        display: flex;
        align-items: center;
      }

      .checkbox {
        width: 100%;
        justify-content: flex-start;

        &--counter {
          margin-left: 16px;
        }
      }
    }
  }
}
</style>
