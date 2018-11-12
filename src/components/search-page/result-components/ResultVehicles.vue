<template>
  <router-link
    :to="{ name: 'searchPage', params: { slug: result.slug } }"
    @click="setVehicleSearchModel(result)"
    tag="a"
  >
    <div class="vehicle">
      <div class="vehicle__item">
        <div class="vehicle__item--name">
          <h4>
            {{ result.year }} {{ result.vehicle_brand_name }} {{ result.name }}
          </h4>
        </div>
        <div class="vehicle__item--static">
          <span>Accessories & Parts</span>
        </div>
      </div>
      <div class="vehicle__item vehicle__item--svg-wrap">
        <svg-launch></svg-launch>
      </div>
    </div>
  </router-link>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'result-vehicles',
  props: ['result'],
  methods: {
    ...mapActions(['setYearSearch', 'setBrandSearch', 'setModelSearch']),
    setVehicleSearchModel (result) {
      this.setYearSearch(result.year.toString())
      this.setBrandSearch(result.vehicle_brand_name)
      this.setModelSearch({
        label: result.name,
        value: result.id
      })
    }
  }
}
</script>

<style scoped lang="scss">
.vehicle-wrap {
  &:hover {
    box-shadow: 0px 5px 6.58px 0.42px rgba(0, 0, 0, 0.05),
      0px 2px 9.8px 0.2px rgba(0, 0, 0, 0.02);
    .vehicle__item--svg-wrap {
      svg {
        display: flex;
      }
    }
    .vehicle__item--name {
      h4 {
        color: $main-color;
      }
    }
  }
}
.vehicle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  &__item {
    &--name {
      max-width: 250px;
      color: $main-dark;
      h4 {
        margin-bottom: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    &--static {
      span {
        font-family: $montserrat-font;
        font-size: 12px;
        font-weight: 500;
        color: $main-grey;
      }
    }
    &--svg-wrap {
      width: 20px;
      svg {
        display: none;
        fill: $main-color;
        width: 20px;
      }
    }
  }
}
</style>
