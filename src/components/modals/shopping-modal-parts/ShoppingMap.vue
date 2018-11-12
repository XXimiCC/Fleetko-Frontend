<template>
  <div class="map">
    <gmap-map
      v-if="mapIsReady"
      ref="map"
      :center="center"
      :zoom="zoom"
      :options="options"
    >
      <gmap-marker
        v-for="(marker, index) in myMarkers"
        :key="index"
        :icon="imageSrc('marker.png')"
        :class="'my-custom-class-for-label'"
        :position="marker.position"
        @click="centerPosition(marker)"
      >
        <gmap-info-window :options="{ content: contentInfo(marker.address) }">
        </gmap-info-window>
      </gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
import utils from '@/mixins/utils'
import map from '../../../json/map-style.json'
import * as VueGoogleMaps from 'vue2-google-maps'
import Vue from 'vue'
import config from '../../../config'
import $ from 'jquery'

Vue.use(VueGoogleMaps, {
  load: {
    key: config.googleMapApi,
    libraries: 'places'
  }
})

export default {
  name: 'ShoppingMap',
  props: ['inStockHouses', 'markerPosition'],
  mixins: [utils],
  data () {
    return {
      mapIsReady: false,
      zoom: 5,
      center: { lat: 37.09024, lng: -95.712891 },
      myMarkers: [],
      options: {
        disableDefaultUI: false,
        fullscreenControl: false,
        gestureHandling: 'cooperative',
        styles: map
      }
    }
  },
  watch: {
    markerPosition () {
      this.moveMarker(this.markerPosition)
    }
  },
  mounted () {
    this.initMap()

    setTimeout(() => {
      let info = $('.gm-style-iw')
      info.children().addClass('no-overflow')
      info.next().remove()
      info.prev().remove()
      info.addClass('custom-google-info')
    }, 1000)
  },

  methods: {
    contentInfo (address) {
      return `<div class='content-info'>
                    <svg fill="#ffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490" width="24px" height="24px" style="margin-right: 16px">
                    <path d="M484.093 157.57L250.691 26.172c-3.47-1.953-7.913-1.953-11.383 0L5.909 157.57A11.618 11.618 0 0 0 0 167.679
                    v297.614h57.535V215.971h374.93v249.322H490V167.679c0-4.183-2.265-8.056-5.907-10.109zm-321.598 17.95a5.03 5.03 0 0 1-5.031 5.029
                    h-46.283a5.03 5.03 0 0 1-5.031-5.029v-14.087a5.029 5.029 0 0 1 5.031-5.03h46.283a5.03 5.03 0 0 1 5.031 5.03v14.087zm110.678 0
                    a5.03 5.03 0 0 1-5.032 5.029H221.86a5.03 5.03 0 0 1-5.032-5.029v-14.087a5.03 5.03 0 0 1 5.032-5.03h46.281a5.03 5.03 0 0 1 5.032 5.03
                    v14.087zm110.677 0a5.028 5.028 0 0 1-5.029 5.029h-46.284a5.03 5.03 0 0 1-5.032-5.029v-14.087a5.03 5.03 0 0 1 5.032-5.03
                    h46.284a5.028 5.028 0 0 1 5.029 5.03v14.087z"/><path d="M400.744 251.986H89.257a3.523 3.523 0 0 0-3.522 3.521
                    v26.894a3.524 3.524 0 0 0 3.522 3.523h311.487a3.523 3.523 0 0 0 3.521-3.523v-26.894a3.522 3.522 0 0 0-3.521-3.521z
                    M400.744 312.203H89.257a3.522 3.522 0 0 0-3.522 3.521v26.895a3.523 3.523 0 0 0 3.522 3.522h311.487a3.522 3.522 0 0 0 3.521-3.522
                    v-26.895a3.521 3.521 0 0 0-3.521-3.521zM400.744 372.418H89.257a3.522 3.522 0 0 0-3.522 3.521v26.897a3.522 3.522 0 0 0 3.522 3.52h311.487
                    a3.52 3.52 0 0 0 3.521-3.52v-26.897a3.521 3.521 0 0 0-3.521-3.521z"/></svg>
                    <p>${address}</p>
                </div>`
    },
    initMap () {
      this.inStockHouses.forEach(warehouse => {
        this.myMarkers.push({
          address: warehouse.address_line_1,
          id: warehouse.id,
          position: {
            lat: parseFloat(warehouse.latitude),
            lng: parseFloat(warehouse.longitude)
          }
        })
      })

      this.mapIsReady = true
    },
    centerPosition (m) {
      this.zoom = 7

      Vue.nextTick(() => {
        this.zoom = 11
        this.center = m.position
      })
    },
    moveMarker (house) {
      if (!house) return

      let position = {
        lat: parseFloat(house.latitude),
        lng: parseFloat(house.longitude)
      }

      this.zoom = 1
      this.center = { lat: 0, lng: 0 }

      Vue.nextTick(() => {
        this.zoom = 11
        this.center = position
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
  .vue-map-container {
    width: 100%;
    height: 100%;
  }
  display: block;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 352px;
}
</style>
