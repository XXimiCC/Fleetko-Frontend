<template>
  <div class="locations">
    <div v-if="preloader" class="loader--absolute"><loader></loader></div>

    <transition name="fade">
      <div v-if="!preloader" class="container">
        <div class="locations__body">
          <div
            v-if="listWarehouses && $mq !== 'xs' && $mq !== 'sm'"
            class="locations__sidebar"
          >
            <div
              v-for="(warehouses, state) in listWarehouses"
              class="locations__state"
            >
              <div class="locations__state-name">
                <svg-map-pointer></svg-map-pointer>
                <span>{{ state }}</span>
              </div>

              <div
                class="locations__warehouse"
                :class="{
                  'locations__warehouse--active':
                    currentWarehouse && warehouse.id === currentWarehouse.id
                }"
                @click="onChangeWarehouse(warehouse.id)"
                v-for="warehouse in warehouses"
              >
                {{ warehouse.city }}
              </div>
            </div>
          </div>

          <div
            v-for="house in displayedWarehouses"
            :key="house.id"
            :id="'warehouse-' + house.id"
            class="locations__info"
          >
            <h2 class="locations__warehouse-name">{{ house.city }}</h2>
            <p class="locations__warehouse-address">
              {{ house.address_line_1 }} {{ house.address_line_2 }}
            </p>
            <div class="locations__manager">
              <span class="label">Manager:</span>
              <span class="value">{{ house.name }}</span>
            </div>
            <div class="locations__warehouse-email">
              <span>
                <a :href="'mailto:' + house.email">{{ house.email }}</a>
              </span>
            </div>
            <div class="locations__warehouse-phone">
              <span>{{ house.phone }}</span>
            </div>
            <div class="locations__warehouse-button-map">
              <button
                class="button-second left-icon"
                @click="() => (warehouseModal = true)"
              >
                <svg-address></svg-address>
                <span>Look at the map</span>
              </button>
            </div>
            <!--<div class="locations__warehouse-schedule">-->
              <!--<span v-if="!getBusinessHours(house.business_hours)">-->
                <!--{{ house.business_hours }}-->
              <!--</span>-->
              <!--<span v-else>-->
                <!--<span class="label">{{ getBusinessHours(house.business_hours).days }}</span>-->
                <!--<span class="value">{{ getBusinessHours(house.business_hours).hours }}</span>-->
              <!--</span>-->
            <!--</div>-->
            <div class="locations__warehouse-description">
              {{ house.description }}
            </div>
          </div>

          <usa-map
            v-if="$mq === 'xl'"
            class="locations__map"
            @warehouseChange="onChangeWarehouse"
            :warehouses="listWarehouses"
            :currentWarehouse="currentWarehouse"
          >
          </usa-map>
        </div>

        <div
          v-if="
            currentWarehouse &&
              currentWarehouse.images &&
              $mq !== 'sm' &&
              $mq !== 'xs'
          "
          class="locations__slider"
        >
          <main-slider
            :banners="
              currentWarehouse.images.length
                ? currentWarehouse.images
                : bannersForDev
            "
            :fixedControls="true"
          >
          </main-slider>
        </div>

        <warehouse-map
          v-if="warehouseModal"
          :address="currentWarehouse"
          @closeWarehouseModal="() => (warehouseModal = false)"
        >
        </warehouse-map>
      </div>
    </transition>
  </div>
</template>

<script>
import Loader from '@/components/common-components/Loader'
import MainSlider from '@/components/category/MainSlider'
import UsaMap from './UsaMap'
import WarehouseMap from '../modals/WarehouseMap'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'Locations',
  components: {
    Loader,
    MainSlider,
    UsaMap,
    WarehouseMap
  },
  data () {
    return {
      currentWarehouse: null,
      listWarehouses: null,
      displayedWarehouses: [],
      displayAll: null,
      warehouseModal: false,
      bannersForDev: [
        {
          versions: {
            big:
              'https://www.joc.com/sites/default/files/field_feature_image/warehouse%2043.jpg',
            medium:
              'https://techcrunch.com/wp-content/uploads/2017/12/flowspace-warehouse.jpg?w=730&crop=1',
            small: 'https://image.flaticon.com/icons/svg/180/180066.svg'
          }
        },
        {
          versions: {
            big:
              'https://techcrunch.com/wp-content/uploads/2017/12/flowspace-warehouse.jpg?w=730&crop=1',
            medium:
              'https://www.joc.com/sites/default/files/field_feature_image/warehouse%2043.jpg',
            small: 'https://image.flaticon.com/icons/svg/180/180066.svg'
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['preloader'])
  },
  watch: {
    $route (newVal, oldVal) {
      this.calcDisplayedWarehouses()
      this.scrollToWarehouse(
        this.displayAll ? newVal.params.id : oldVal.params.id
      )
    },

    $mq (val) {
      this.displayAll = val === 'sm' || val === 'xs'
    },

    displayAll (newVal, oldVal) {
      if (oldVal === null) return

      this.calcDisplayedWarehouses()
      this.$nextTick(() => this.scrollToWarehouse(this.$route.params.id))
    }
  },
  methods: {
    scrollToWarehouse (id) {
      this.$scrollTo(`#warehouse-${id}`, 1000, {
        offset: this.displayAll ? 0 : -80
      })
    },

    // getBusinessHours (hours) {
    //   const splitHours = hours.split(':')
    //
    //   return splitHours.length < 2
    //     ? false
    //     : {
    //         days: `${splitHours[0]}: `,
    //         hours: splitHours[1]
    //       }
    // },
    groupWarehousesByState (warehouses) {
      warehouses = _.groupBy(warehouses, 'state')
      warehouses = _.toPairs(warehouses)
      warehouses = _.sortBy(warehouses, 0)
      warehouses = _.fromPairs(warehouses)

      this.listWarehouses = warehouses
    },

    calcDisplayedWarehouses () {
      const currentState = _.filter(this.listWarehouses, state => {
        return state.some(house => house.id === Number(this.$route.params.id))
      })

      if (!currentState[0]) return

      this.currentWarehouse = currentState[0].find(house => {
        return house.id === Number(this.$route.params.id)
      })

      this.displayedWarehouses.length = 0

      if (!this.displayAll) {
        this.displayedWarehouses.push(this.currentWarehouse)
      } else {
        _.forEach(this.listWarehouses, state => {
          _.forEach(state, house => {
            this.displayedWarehouses.push(house)
          })
        })
      }
    },
    fetchListWarehouses () {
      this.$store.dispatch('setLoaderManual', true)

      this.$store.dispatch('fetchListWarehouses').then(
        resp => {
          this.groupWarehousesByState(resp)
          this.calcDisplayedWarehouses()
          this.$store.dispatch('setLoaderManual', false)
        },
        () => {
          this.$store.dispatch('setLoaderManual', false)
        }
      )
    },
    onChangeWarehouse (warehouseId) {
      this.$router.push({ name: 'location', params: { id: warehouseId } })
    }
  },
  created () {
    this.fetchListWarehouses()

    this.displayAll = this.$mq === 'sm' || this.$mq === 'xs'
  },
  mounted () {
    this.$store.dispatch('setLoaderManual', true)

    if (this.displayAll) {
      setTimeout(() => this.scrollToWarehouse(this.$route.params.id), 1000)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../scss/mixins';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.loader {
  margin: auto;
  padding: 20% 0 10%;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 9999;
}

.locations {
  position: relative;
  margin-top: 80px;
  &__body {
    display: flex;
  }

  &__sidebar {
    position: relative;
    padding: 16px 0;
    width: 168px;
    max-height: initial;

    &:after {
      position: absolute;
      content: '';
      right: 0;
      top: 0;
      height: 100%;
      width: 1px;
      background: $light-grey;
      box-shadow: 2px 0 15px rgba(6, 26, 70, 0.2);
    }
  }

  &__state {
    padding-left: 8px;
  }

  &__state-name {
    display: flex;
    align-items: center;
    height: 16px;
    margin-bottom: 16px;
    svg {
      width: 19px;
      height: 19px;
      fill: $main-color;
    }
    span {
      margin-left: 8px;
      font-size: 16px;
      color: $main-dark;
      font-family: $montserrat-font;
      font-weight: 500;
    }
  }

  .locations__state + .locations__state {
    margin-top: 24px;
  }

  &__warehouse {
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 500;
    font-family: $montserrat-font;
    fill: $dark-grey;
    cursor: pointer;
    z-index: 100;

    &:hover {
      background: rgba($main-color, 0.1);
    }

    &--active {
      position: relative;
      background: rgba($main-color, 0.2);
      &:after {
        position: absolute;
        content: '';
        right: 0;
        top: 0;
        height: 100%;
        width: 2px;
        background: $main-color;
      }
    }
  }

  &__info {
    padding: 0 32px;
  }

  &__warehouse-address {
    margin-bottom: 11px;
    font: 400 16px/19px $sours-sans-p-font;
    color: $main-dark;
  }

  &__manager {
    font: 400 14px/19px $sours-sans-p-font;
    margin-bottom: 10px;
    .label {
      color: $main-grey;
    }
    .value {
      color: $main-dark;
    }
  }

  &__warehouse-email {
    margin-bottom: 22px;
    font: 400 14px/19px $sours-sans-p-font;
    color: $main-color;
  }

  &__warehouse-phone {
    margin-bottom: 29px;
    font: 500 20px/19px $montserrat-font;
    color: $main-dark;
  }

  &__warehouse-button-map {
    margin-bottom: 26px;
    button {
      width: 188px;
      line-height: 19px;
    }
    svg {
      width: 18px;
      height: 18px;
      fill: $main-color;
    }
  }

  /*&__warehouse-schedule {
    margin-bottom: 21px;
    padding-left: 16px;
    color: $main-dark;

    .label {
      font: 12px/19px $montserrat-font;
    }

    .value {
      font: 500 16px/19px $montserrat-font;
      padding-left: 32px;
    }
  }*/

  &__warehouse-description {
    max-width: 350px;
    font: 400 14px/19px $sours-sans-p-font;
    color: $dark-grey;
  }

  &__map {
    margin-left: auto;
    width: 500px;
    height: 360px;
  }

  &__slider {
    position: relative;
    margin: 32px 0 64px;
  }
}

@media all and (max-width: 647px) {
  .locations {
    margin-top: 0;
    &__body {
      flex-direction: column;
    }
    &__info {
      position: relative;
      padding: 32px 0;
      &:after {
        position: absolute;
        content: '';
        left: -16px;
        bottom: 0;
        width: calc(100% + 32px);
        height: 1px;
        background: $light-grey;
      }
    }
    &__warehouse-description {
      max-width: 100%;
    }

    &__warehouse-name {
      font-size: 24px;
    }
  }
}
</style>
