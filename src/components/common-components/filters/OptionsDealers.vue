<template>
  <div :class="{ open: open }">
    <div class="filter--heading" @click="toggle(filter)">
      <div class="item"><span>Dealers</span></div>
      <div class="item">
        <div class="toggle-caret" :class="{ 'toggle-caret--close': !open }">
          <svg-chevron></svg-chevron>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-show="open" class="filter--body">
        <div v-for="item in filter" class="filter--body--item">
          <div class="checkbox">
            <div class="item" :class="{ disabled: disabled(item) }">
              <label>
                <input
                  class="checkbox-default input-checkbox"
                  type="checkbox"
                  :disabled="item.products_count < 1 && !item.selected"
                  :checked="item.selected"
                  @click="checkOption($event, item, filter)"
                />
                <span class="checkbox--name">{{ item.name }}</span>
              </label>
            </div>
            <div class="item">
              <span class="checkbox--counter">{{
                item.selected ? '' : defineCounter(item)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import utils from '@/mixins/utils'

export default {
  name: 'filters-option',
  mixins: [utils],
  props: ['filter', 'relative', 'openResponsiveDealers'],
  data () {
    return {
      open: true,
      checkedCategories: [],
      item: false,
      selectedInGroup: false
    }
  },
  created () {
    if (this.$mq === 'sm' || this.$mq === 'xs' || this.$mq === 'md') {
      this.openResponsiveDealers ? (this.open = true) : (this.open = false)
    }
  },
  watch: {
    filter (v) {
      this.selectedInGroup = v.some(check => check.selected)
    }
  },
  methods: {
    defineCounter ({ products_count: qty }) {
      const InGroup = this.filter.some(check => check.selected)
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

      this.$emit('dealerOpenedByUser', this.open, this.filter.id)
    },
    checkOption ($event, item, filter) {
      $event.target.checked
        ? this.$emit('checkbox-dealer', item, filter)
        : this.$emit('checkbox-dealer-false', item, filter)
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
        height: 24px;
        cursor: pointer;
        .checkbox--name {
          max-width: 185px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-left: 17px;
          font: 500 12px $montserrat-font;
        }
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
  svg {
    transform: rotate(180deg);
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .filter {
    &--body {
      .checkbox {
        &--name {
          max-width: 150px;
        }
      }
    }
  }
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

        .input-checkbox {
          overflow: hidden;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
