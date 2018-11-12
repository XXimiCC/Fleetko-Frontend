<template>
  <div class="resale">
    <div v-for="permit in permits" class="resale__cell">
      <div class="resale__row number">
        <div class="value number__title">№{{ permit.permit_number }}</div>
      </div>

      <div class="resale__row state">
        <div class="title state__title">State</div>
        <div class="value state__value">{{ permit.state }}</div>
      </div>

      <div class="resale__row business">
        <div class="title business__title">Company Name</div>
        <div
          class="value business__value"
          @mouseenter="permit.showName = true"
          @mouseleave="permit.showName = false"
          :ref="'companyName' + permit.id"
        >
          {{ permit.business_name }}
          <transition name="fade">
            <div
              v-if="permit.showName && isOverflowing(permit.id)"
              class="my__tooltip"
            >
              {{ permit.business_name }}
            </div>
          </transition>
        </div>
      </div>

      <div class="resale__row effective">
        <div class="title effective__title">Ettective Date</div>
        <div class="value effective__value">
          {{ formatDate(permit.effective_date) }}
        </div>
      </div>

      <div class="resale__row expiration">
        <div class="title expiration__title">Expiration Date</div>
        <div class="value expiration__value">
          {{ formatDate(permit.expiration_date) }}
        </div>
      </div>

      <div class="resale__row file">
        <div class="title file__title">File</div>
        <div class="value file__value">
          <a :href="permit.document.file_url" target="_blank" class="load">
            <svg-print></svg-print>
          </a>
        </div>
      </div>

      <div class="resale__row status">
        <div class="title status__title">Status</div>

        <div class="value status__value" :class="permit.status">
          <span class="value__info">{{ formatStatus(permit.status) }}</span>

          <span
            v-if="permit.status === 'rejected'"
            @mouseenter="permit.showReason = true"
            @mouseleave="permit.showReason = false"
            class="value__reason"
          >
            <transition name="fade">
              <span
                v-if="permit.showReason"
                class="value__reason--tooltip"
                :class="{ wide: (permit.reason || defaultReason).length > 50 }"
              >
                {{ permit.reason || defaultReason }}
              </span>
            </transition>
            <svg-info-outline></svg-info-outline>
          </span>
        </div>
      </div>

      <div
        class="resale__row actions"
        v-if="
          permit.status === 'rejected' || permit.status === 'pending_review'
        "
      >
        <div class="actions__edit" @click="$emit('editHandler', permit)">
          <svg-edit></svg-edit>
        </div>

        <div class="actions__del" @click="$emit('delHandler', permit)">
          <svg-delete></svg-delete>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResaleCell',
  props: ['permits', 'formatStatus', 'formatDate'],
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
      const ref = this.$refs['companyName' + id]
      const div = ref.length ? ref[0] : ref

      return div.offsetWidth < div.scrollWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.my__tooltip {
  position: absolute;
  top: 100%;
  left: 40%;
  max-width: 235px;
  padding: 8px;
  box-shadow: 1px 1px 5px rgba(50, 50, 50, 0.2);
  background-color: #fff;
  font: 400 10px/14px $montserrat-font;
  color: $main-dark;
  white-space: normal;
}
.resale {
  svg {
    width: 24px;
    height: 24px;
    fill: $main-grey;
  }

  &__cell {
    margin: 0 0 16px 0;
    padding: 24px 16px 16px 16px;
    border: 1px solid $grey;
    border-radius: 4px;
    &:first-child {
      margin-top: 32px;
    }
  }
  &__row {
    display: flex;
    flex-wrap: nowrap;
    padding: 4px 0;
    .title {
      display: flex;
      align-items: center;
      flex-basis: 42%;
      flex-shrink: 0;
      font: 600 14px/19px $sours-sans-p-font;
    }
    .value {
      font: 16px/22px $sours-sans-p-font;
    }

    &.number {
      margin: -24px -16px 9px -16px;
      padding: 16px 16px 11px 16px;
      border-bottom: 1px solid $grey;
      background-color: rgba(20, 88, 235, 0.1);
      .value {
        font: 500 16px $montserrat-font;
        color: $main-color;
      }
    }

    &.business {
      position: relative;
      cursor: default;
      .value {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    &.effective,
    &.expiration {
      .value {
        color: $main-grey;
      }
    }

    &.file {
      padding: 12px 0;
      .value {
        cursor: pointer;
        .load {
          display: flex;
          align-items: center;
          &:hover svg {
            fill: $light-blue;
          }
        }
      }
    }

    &.status {
      border-top: 1px solid $grey;
      padding: 16px 0;
      .value {
        display: flex;
        align-items: center;
        font: 500 12px/16px $montserrat-font;

        &__info {
          margin-right: 8px;
        }

        &__reason {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: help;
          &--tooltip {
            position: absolute;
            top: calc(100% + 4px);
            right: -44px;
            width: 100px;
            padding: 8px;
            box-shadow: 1px 1px 5px rgba(50, 50, 50, 0.2);
            background-color: #fff;
            font: 400 10px/14px $montserrat-font;
            color: $main-dark;
            &.wide {
              width: 288px;
            }
          }
          & svg {
            width: 26px;
            height: 26px;
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
    }

    &.actions {
      margin-top: 0;
      margin-bottom: -8px;
      padding: 14px 0 0 0;
      border-top: 1px solid $grey;
      svg {
        cursor: pointer;
        transition: 0.2s;
      }
      .actions__edit {
        margin-right: 32px;
        &:hover svg {
          fill: $main-color;
        }
      }
      .actions__del {
        &:hover svg {
          fill: $main-red;
        }
      }
    }
  }
}

@media (max-width: $xssm) {
  .resale {
    &__row {
      .title,
      .value {
        flex-basis: 50%;
        min-width: 50%;
      }
    }
  }
}
</style>
