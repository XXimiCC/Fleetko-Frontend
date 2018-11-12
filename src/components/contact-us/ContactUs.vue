<template>
  <div class="contact">
    <div class="contact-slider">
      <div class="contact-slider__title"><h1>Contact Us</h1></div>
      <div class="contact-slider__overlay"></div>
      <div class="contact-slider__background"></div>
    </div>
    <div class="contact__info">
      <div class="container">
        <div class="contact__info--box">
          <h3 class="title h3-secondary">Phone:</h3>
          <div class="box-row">
            <span class="label">Phone: </span>
            <span class="value">(828) 477-4083</span>
          </div>
          <div class="box-row">
            <span class="label">International: </span>
            <span class="value">1.609.964.1983</span>
          </div>
          <div class="box-row">
            <span class="label">Fax: </span>
            <span class="value">1.609.964.1983</span>
          </div>
        </div>
        <div class="contact__info--box">
          <h3 class="title h3-secondary">Location:</h3>
          <div class="box-row"><span class="value">Fleetko.com</span></div>
          <div class="box-row">
            <span class="value">701 South Gifford Avenue #109</span>
          </div>
          <div class="box-row">
            <span class="value">San Bernardino, California 92408</span>
          </div>
        </div>
        <div class="contact__info--box">
          <h3 class="title h3-secondary">Email:</h3>
          <div class="box-row">
            <span class="label">Sales: </span>
            <span class="value">sales@Fleetko.com</span>
          </div>
          <div class="box-row">
            <span class="label">Order Status: </span>
            <span class="value">status@Fleetko.com</span>
          </div>
          <div class="box-row">
            <span class="label">Support: </span>
            <span class="value">support@Fleetko.com</span>
          </div>
        </div>
      </div>
    </div>

    <div class="contact__feedback">
      <div class="container">
        <div class="row">
          <div class="col-md-4 contact__feedback--title-wrap">
            <h2 class="contact__feedback--title">
              Leave a message and we will contact you!
            </h2>
          </div>
          <div class="col-md-8 contact__feedback--body">
            <feedback></feedback>
          </div>
        </div>
      </div>
    </div>

    <div class="contact__map">
      <div class="container">
        <template v-if="ready">
          <gmap-map
            ref="gmap"
            :center="organization.office"
            :zoom="zoom"
            :options="options"
            @resize="resize(zoom)"
            style="width:100%; height: 100%;"
          >
            <gmap-marker
              :icon="imageSrc('marker.png')"
              :position="organization.office"
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
</template>

<script>
import elementReady from 'element-ready'
import Feedback from './Feedback'
import Vue from 'vue'
import map from '../../json/grey-map'
import config from '../../config'
import * as VueGoogleMaps from 'vue2-google-maps'
import utils from '@/mixins/utils'
import organizationData from '../../organization-data'
import $ from 'jquery'

Vue.use(VueGoogleMaps, {
  load: {
    key: config.googleMapApi,
    checkDOMInterval: null,
    libraries: 'places' // This is required if you use the Autocomplete plugin
  }
})

export default {
  name: 'contact-us',
  data () {
    return {
      ready: false,
      zoom: 13,
      options: {
        disableDefaultUI: false,
        fullscreenControl: false,
        styles: map
      }
    }
  },
  mixins: [utils],
  methods: {
    contentInfo () {
      return `<div class='content-info content-info--icon'>
            <svg fill="#ffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490"><path d="M484.093 157.57L250.691 26.172c-3.47-1.953-7.913-1.953-11.383 0L5.909 157.57A11.618 11.618 0 0 0 0 167.679v297.614h57.535V215.971h374.93v249.322H490V167.679c0-4.183-2.265-8.056-5.907-10.109zm-321.598 17.95a5.03 5.03 0 0 1-5.031 5.029h-46.283a5.03 5.03 0 0 1-5.031-5.029v-14.087a5.029 5.029 0 0 1 5.031-5.03h46.283a5.03 5.03 0 0 1 5.031 5.03v14.087zm110.678 0a5.03 5.03 0 0 1-5.032 5.029H221.86a5.03 5.03 0 0 1-5.032-5.029v-14.087a5.03 5.03 0 0 1 5.032-5.03h46.281a5.03 5.03 0 0 1 5.032 5.03v14.087zm110.677 0a5.028 5.028 0 0 1-5.029 5.029h-46.284a5.03 5.03 0 0 1-5.032-5.029v-14.087a5.03 5.03 0 0 1 5.032-5.03h46.284a5.028 5.028 0 0 1 5.029 5.03v14.087z"/><path d="M400.744 251.986H89.257a3.523 3.523 0 0 0-3.522 3.521v26.894a3.524 3.524 0 0 0 3.522 3.523h311.487a3.523 3.523 0 0 0 3.521-3.523v-26.894a3.522 3.522 0 0 0-3.521-3.521zM400.744 312.203H89.257a3.522 3.522 0 0 0-3.522 3.521v26.895a3.523 3.523 0 0 0 3.522 3.522h311.487a3.522 3.522 0 0 0 3.521-3.522v-26.895a3.521 3.521 0 0 0-3.521-3.521zM400.744 372.418H89.257a3.522 3.522 0 0 0-3.522 3.521v26.897a3.522 3.522 0 0 0 3.522 3.52h311.487a3.52 3.52 0 0 0 3.521-3.52v-26.897a3.521 3.521 0 0 0-3.521-3.521z"/></svg>
            <span>${this.organization.street}</span>
        </div>`
    },
    initMap () {
      this.options.styles = map
      this.ready = true
    }
  },
  components: {
    Feedback
  },
  computed: {
    organization () {
      return organizationData
    }
  },
  mounted () {
    this.initMap()

    /**
     * @desc Hack IIFE for styling google-map, do not touch
     */
    ;(async () => {
      const info = await elementReady('.gm-style-iw')

      $(info)
        .children()
        .addClass('no-overflow')
      $(info)
        .next()
        .remove()

      let arrows = $(info).prev()

      arrows.remove()
      $(info).addClass('custom-google-info')
    })()
  }
}
</script>

<style scoped lang="scss">
.contact {
  margin-bottom: 56px;
  &__info {
    margin-top: -48px;
    .container {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    &--box {
      flex: 0 0 352px;
      padding: 32px;
      background: white;
      border-radius: 4px;
      box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.1);
      z-index: 100;
      .title {
        margin-bottom: 16px;
        color: $main-dark;
      }
      .box-row {
        line-height: 1;
        .label {
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $main-dark;
          font-weight: 600;
        }
        .value {
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $dark-grey;
        }
      }
      .box-row + .box-row {
        margin-top: 4px;
      }
    }
  }
  &__feedback {
    margin-top: 64px;
    &--title {
      margin-top: 64px;
      color: $main-dark;
    }
    &--body {
    }
  }
  &__map {
    margin-top: 64px;
    height: 470px;
    .container {
      height: 100%;
    }
  }
}

.contact-slider {
  position: relative;
  &__title {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index: 100;
    h1 {
      font-size: 64px;
      font-weight: 600;
      color: white;
    }
  }
  &__overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-image: -webkit-linear-gradient(
        -90deg,
        transparent 0%,
        transparent 50%,
        rgba(20, 88, 235, 0.87) 50%,
        rgba(20, 88, 235, 0.87) 100%
      ),
      -webkit-linear-gradient(0deg, rgba(0, 0, 0, 0.33) 0%, rgba(0, 0, 0, 0.2)
            50%, rgba(20, 88, 235, 0.86) 50%, #0013ff 100%);
    background-size: 3px 3px;
    opacity: 0.5;
  }
  &__background {
    background-image: url('../../assets/slider-full.png');
    background-size: cover;
    background-repeat: no-repeat;
    height: 400px;
    background-position: center;
    background-color: #f5f5f5;
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .contact {
    &__info {
      &--box {
        flex: 0 0 32.3%;
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .contact {
    &__info {
      &--box {
        flex: 0 0 49%;
        &:last-child {
          margin-top: 16px;
        }
      }
    }
    &__feedback {
      &--title-wrap {
        max-width: 100%;
        flex: 0 0 100%;
      }
      &--title {
        margin: 0 auto;
        max-width: 60%;
        font-size: 24px;
        color: $main-dark;
        text-align: center;
      }
      &--body {
        margin-top: 32px;
        max-width: 100%;
        flex: 0 0 100%;
      }
    }
    &__map {
      height: 320px;
    }
  }
  .contact-slider {
    &__background {
      height: 320px;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .contact {
    &__info {
      &--box {
        flex: 0 0 100%;
      }
    }
    .contact__info--box + .contact__info--box {
      margin-top: 16px;
    }
    &__feedback {
      margin-top: 0;
      &--title {
        text-align: center;
        font-size: 24px;
      }
      &--body {
        margin-top: 24px;
      }
    }
    &__map {
      height: 256px;
    }
  }
  .contact-slider {
    &__background {
      height: 224px;
    }
    &__title {
      h1 {
        font-size: 34px;
      }
    }
  }
}
</style>
