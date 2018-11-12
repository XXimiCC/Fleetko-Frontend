<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="container">
          <div class="modal-container modal-map" v-on-clickaway="closeModal">
            <!-- modal header ends -->
            <div class="modal-map__close" @click="closeModal">
              <svg-close></svg-close>
            </div>
            <div class="modal-body modal-map__loading" v-if="!labelHook">
              <loader
                :modalLoader="true"
                class="modal-body modal-map__loading--cube"
              ></loader>
            </div>
            <div
              class="modal-body modal-map__body"
              :class="{ 'ready-map': labelHook }"
            >
              <div class="modal-map__body--map">
                <template v-if="ready">
                  <gmap-map
                    ref="gmap"
                    :center="marker"
                    :zoom="zoom"
                    :options="options"
                    @resize="resize(zoom)"
                    style="width:100%; height: 685px"
                  >
                    <gmap-marker
                      :icon="imageSrc('marker.png')"
                      :label-content="'gdfgdfgdfgdfg'"
                      :class="'my-custom-class-for-label'"
                      :position="marker"
                      :clickable="true"
                      :draggable="false"
                    >
                      <gmap-info-window :options="{ content: contentInfo() }">
                      </gmap-info-window>
                    </gmap-marker>
                  </gmap-map>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import map from '../../json/map-style.json'
import config from '../../config'
import $ from 'jquery'
import Vue from 'vue'
import Loader from '@/components/common-components/Loader'
import * as VueGoogleMaps from 'vue2-google-maps'
import { mixin as clickaway } from 'vue-clickaway'
import utils from '@/mixins/utils'

Vue.use(VueGoogleMaps, {
  load: {
    key: config.googleMapApi,
    libraries: 'places' // This is required if you use the Autocomplete plugin
  }
})

export default {
  name: 'warehouse-map',
  data () {
    return {
      labelHook: false,
      zoom: 7,
      show: false,
      google: null,
      ready: false,
      options: {
        disableDefaultUI: false,
        fullscreenControl: false,
        scrollwheel: true,
        styles: []
      },
      marker: {
        lat: parseFloat(this.address.latitude),
        lng: parseFloat(this.address.longitude)
      }
    }
  },
  props: ['address'],
  mixins: [clickaway, utils],
  methods: {
    closeModal () {
      this.$emit('closeWarehouseModal')
    },
    contentInfo () {
      return `<div class='content-info content-info--icon'>
            <svg fill="#ffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490"><path d="M484.093 157.57L250.691 26.172c-3.47-1.953-7.913-1.953-11.383 0L5.909 157.57A11.618 11.618 0 0 0 0 167.679v297.614h57.535V215.971h374.93v249.322H490V167.679c0-4.183-2.265-8.056-5.907-10.109zm-321.598 17.95a5.03 5.03 0 0 1-5.031 5.029h-46.283a5.03 5.03 0 0 1-5.031-5.029v-14.087a5.029 5.029 0 0 1 5.031-5.03h46.283a5.03 5.03 0 0 1 5.031 5.03v14.087zm110.678 0a5.03 5.03 0 0 1-5.032 5.029H221.86a5.03 5.03 0 0 1-5.032-5.029v-14.087a5.03 5.03 0 0 1 5.032-5.03h46.281a5.03 5.03 0 0 1 5.032 5.03v14.087zm110.677 0a5.028 5.028 0 0 1-5.029 5.029h-46.284a5.03 5.03 0 0 1-5.032-5.029v-14.087a5.03 5.03 0 0 1 5.032-5.03h46.284a5.028 5.028 0 0 1 5.029 5.03v14.087z"/><path d="M400.744 251.986H89.257a3.523 3.523 0 0 0-3.522 3.521v26.894a3.524 3.524 0 0 0 3.522 3.523h311.487a3.523 3.523 0 0 0 3.521-3.523v-26.894a3.522 3.522 0 0 0-3.521-3.521zM400.744 312.203H89.257a3.522 3.522 0 0 0-3.522 3.521v26.895a3.523 3.523 0 0 0 3.522 3.522h311.487a3.522 3.522 0 0 0 3.521-3.522v-26.895a3.521 3.521 0 0 0-3.521-3.521zM400.744 372.418H89.257a3.522 3.522 0 0 0-3.522 3.521v26.897a3.522 3.522 0 0 0 3.522 3.52h311.487a3.52 3.52 0 0 0 3.521-3.52v-26.897a3.521 3.521 0 0 0-3.521-3.521z"/></svg>
            <span>${this.address.address_line_1}</span>
        </div>`
    },
    initMap () {
      this.options.styles = map
      this.ready = true

      setTimeout(() => {
        let info = $('.gm-style-iw')

        info.children().addClass('no-overflow')
        info.next().remove()

        let arrows = info.prev()

        arrows.remove()
        info.addClass('custom-google-info')
      }, 1000)
      setTimeout(() => {
        this.labelHook = true
      }, 1500)
    }
  },
  components: {
    Loader
  },
  created () {
    this.scrollingModalOpen(true)
  },
  mounted () {
    this.initMap()
  },
  beforeDestroy () {
    this.scrollingModalOpen(false)
  }
}
</script>

<style scoped lang="scss">
.my-custom-class-for-label {
  width: 50px;
  height: 20px;
  border: 1px solid #eb3a44;
  border-radius: 5px;
  background: #fee1d7;
  text-align: center;
  line-height: 20px;
  font-weight: bold;
  font-size: 14px;
  color: #eb3a44;
}
.modal-mask {
  padding-right: 16px;
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  width: 100%;
  height: 685px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-body {
  padding: 0;
  overflow: hidden;
  border-radius: 4px;
}

.modal-footer {
  border-top: none;
}

.modal-map {
  position: relative;
  &__close {
    position: absolute;
    right: -36px;
    top: 8px;
    cursor: pointer;
    z-index: 100;
    svg {
      fill: white;
    }
  }
  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 685px;
    z-index: 200;
    display: flex;
    justify-content: center;
    align-items: center;
    &--cube {
      height: 100%;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.5);
    }
  }
  &__body {
    height: 100%;
    display: flex;
    position: relative;
    &--info {
      width: calc(100% - 488px);
      padding: 32px;
      .title {
        margin-bottom: 32px;
        display: flex;
        align-items: center;
        img {
          width: 64px;
          height: 64px;
          border-radius: 100%;
        }
        h4 {
          margin-left: 16px;
          margin-bottom: 0;
          font-family: $montserrat-font;
          color: $main-dark;
          font-weight: 500;
          font-size: 18px;
          line-height: 24px;
        }
      }
      .body {
        .flex-wrap {
          justify-content: space-between;
          display: flex;
        }
      }
      .button-normal {
        margin-top: 16px;
        font-size: 12px;
      }
    }
    &--map {
      width: 100%;
      height: 100%;
      position: relative;
      .vue-map-container {
        height: 100% !important;
      }
      &--overlay {
        transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 1;
        z-index: 100;
      }
    }
  }
  .ready-map {
    filter: none;
  }
}
/*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

@media (min-width: $xs) and (max-width: $md) {
  .modal-map {
    margin-top: 36px;
    height: 80vh;
    &__close {
      right: 0;
      top: -28px;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .modal-mask {
    padding-right: 0;
  }
}
</style>
