<template>
  <div class="resale">
    <div class="resale__head">
      <div class="number">Permit Number</div>
      <div class="state">State</div>
      <div class="business">Company Name</div>
      <div class="effective">Ettective Date</div>
      <div class="expiration">Expiration Date</div>
      <div class="file">File</div>
      <div class="status">Status</div>
      <div class="actions spacer"></div>
    </div>

    <div class="resale__body">
      <div class="resale__row" v-for="permit in permits">
        <div
          class="number"
          @mouseenter="permit.showNumber = true"
          @mouseleave="permit.showNumber = false"
        >
          <span :ref="'permitNumber' + permit.id">
            №{{ permit.permit_number }}
          </span>
          <transition name="fade">
            <div
              v-if="permit.showNumber && isOverflowing(permit.id)"
              class="my__tooltip"
            >
              {{ permit.permit_number }}
            </div>
          </transition>
        </div>
        <div class="state">{{ permit.state }}</div>
        <div class="business">{{ permit.business_name }}</div>
        <div class="effective">{{ formatDate(permit.effective_date) }}</div>
        <div class="expiration">{{ formatDate(permit.expiration_date) }}</div>
        <div class="file">
          <a
            :href="permit.document.file_url"
            target="_blank"
            class="file__load"
          >
            <svg-print></svg-print>
          </a>
        </div>

        <div class="status" :class="permit.status">
          <span class="status__value">{{ formatStatus(permit.status) }}</span>

          <span
            v-if="permit.status === 'rejected'"
            @mouseenter="permit.showReason = true"
            @mouseleave="permit.showReason = false"
            class="status__reason"
          >
            <transition name="fade">
              <span
                v-if="permit.showReason"
                class="status__reason--tooltip"
                :class="{ wide: (permit.reason || defaultReason).length > 50 }"
              >
                {{ permit.reason || defaultReason }}
              </span>
            </transition>

            <svg-info-outline></svg-info-outline>
          </span>
        </div>

        <div
          v-if="
            permit.status === 'rejected' || permit.status === 'pending_review'
          "
          class="actions"
        >
          <div
            @click="permit.showActions = !permit.showActions"
            class="actions__button"
          >
            <svg-more-vert></svg-more-vert>
          </div>

          <div
            v-if="permit.showActions"
            @click="permit.showActions = false"
            v-on-clickaway="() => (permit.showActions = false)"
            class="actions__wrapper"
          >
            <div @click="$emit('editHandler', permit)" class="actions__edit">
              Edit
            </div>

            <div @click="$emit('delHandler', permit)" class="actions__delete">
              Delete
            </div>
          </div>
        </div>
        <div v-else class="spacer"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'ResaleTable',
  props: ['permits', 'formatStatus', 'formatDate'],
  mixins: [clickaway],
  created () {
    this.permits.forEach(permit => {
      permit.showReason = false
      permit.showActions = false
      permit.showNumber = false
      permit.showName = false
    })
  },
  data () {
    return {
      defaultReason:
        'Common reasons to reject resale certificate include \nincomplete or incorrectly filled out certificate, \nother document in place of valid resale certificate \nor attached file (document) not matching the submitted form.'
    }
  },
  methods: {
    isOverflowing (id) {
      const ref = this.$refs['permitNumber' + id]
      const div = ref.length ? ref[0] : ref

      return div.offsetWidth < div.scrollWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.my__tooltip {
  position: absolute;
  top: calc(50% + 16px);
  left: 5%;
  max-width: 235px;
  padding: 8px;
  box-shadow: 1px 1px 5px rgba(50, 50, 50, 0.2);
  background-color: #fff;
  font: 400 10px/14px $montserrat-font;
  color: $main-dark;
  white-space: normal;
}

.resale {
  max-width: 1120px;

  svg {
    width: 24px;
    height: 24px;
    fill: $main-grey;
  }

  &__head,
  &__row {
    display: flex;
    flex-wrap: nowrap;
    padding: 8px;
    & > * {
      display: flex;
      align-items: center;
      padding: 8px;
    }
  }

  &__head {
    font: 14px/19px $sours-sans-p-font;
    color: $main-grey;

    .status {
      border: none !important;
      text-transform: capitalize !important;
      text-indent: 8px;
    }

    .actions {
      border: none !important;
    }
  }

  &__row {
    margin-bottom: 8px;
    border: 1px solid $grey;
    border-radius: 4px;
    padding: 7px 8px;
    font: 400 16px/22px $sours-sans-p-font;
    color: $main-dark;
  }

  .number {
    position: relative;
    display: flex;
    align-items: center;
    flex-basis: 20%;
    min-width: 100px;
    cursor: default;
    span {
      display: block;
      max-width: 160px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .state {
    flex-basis: 8.3%;
    min-width: 46px;
  }

  .business {
    flex-basis: 16.6%;
    min-width: 86px;
    word-break: break-word;
  }

  .effective {
    color: $main-grey;
    flex-basis: 16.6%;
  }

  .expiration {
    color: $main-grey;
    flex-basis: 16.6%;
  }

  .file {
    flex-basis: 8.3%;
    display: flex;
    justify-content: center;
    align-items: center;
    &__load {
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover svg {
        fill: $light-blue;
      }
    }
  }

  .status {
    display: flex;
    align-items: center;
    flex-basis: 121px;
    flex-shrink: 0;
    min-height: 48px;
    font: 500 12px/16px $montserrat-font;
    border-left: 1px solid $grey;
    &__value {
      padding-left: 8px;
      display: block;
    }
    &__reason {
      position: relative;
      display: flex;
      align-items: center;
      cursor: help;
      margin-left: 4px;
      &--tooltip {
        position: absolute;
        top: 100%;
        right: -44px;
        width: 100px;
        padding: 8px;
        box-shadow: 1px 1px 5px rgba(50, 50, 50, 0.2);
        background-color: #fff;
        font: 400 10px/14px $montserrat-font;
        color: $main-dark;
        z-index: 2;
        &.wide {
          width: 288px;
        }
      }
      & svg {
        fill: $grey !important;
      }
    }
    &.active {
      color: #0bb07b;
      svg {
        fill: #0bb07b;
      }
    }
    &.pending_review {
      color: $main-color;
      svg {
        fill: $main-color;
      }
    }
    &.rejected {
      color: #f03d3d;
      svg {
        fill: #f03d3d;
      }
    }
    &.archived {
      color: $dark-grey;
      svg {
        fill: $dark-grey;
      }
    }
  }

  .actions,
  .spacer {
    display: flex;
    justify-content: space-around;
    width: 56px;
  }

  .actions {
    position: relative;
    border-left: 1px solid $grey;
    box-sizing: border-box;
    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(20, 88, 235, 0);
      transition: background-color 0.15s;
      cursor: pointer;
      &:hover {
        background-color: rgba(20, 88, 235, 0.2);
      }
      svg {
        fill: $main-color;
      }
    }
    &__wrapper {
      position: absolute;
      z-index: 2;
      top: calc(100% + 8px);
      right: 10px;
      width: 112px;
      padding: 8px;
      background: #fff;
      box-shadow: 0 8px 10px rgba(6, 26, 70, 0.1), 0 0 1px rgba(6, 26, 70, 0.08);
      border-radius: 4px;
    }

    &__edit,
    &__delete {
      padding: 8px;
      border-radius: 2px;
      font: 16px $sours-sans-p-font;
      color: $main-dark;
      cursor: pointer;
    }

    &__edit {
      &:hover {
        background-color: rgba(20, 88, 235, 0.1);
      }
    }
    &__delete {
      &:hover {
        background-color: rgba(240, 61, 61, 0.1);
      }
    }
  }
}
</style>
