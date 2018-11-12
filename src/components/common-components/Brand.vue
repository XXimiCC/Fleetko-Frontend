<template>
  <div class="col-xl-12">
    <div class="container scoped_response style-mobile">
      <div class="row row_width scoped-brand">
        <div class="col-12 style-mobile logo-and-button">
          <h1 class="caption-h1 text-center">Feature brands</h1>

          <div
            class=" button-right  d-none d-sm-none d-md-none d-lg-block d-xl-block"
          >
            <b-button class="slider-btn prew brend_prew">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                viewBox="0 0 41.999 41.999"
              >
                <path
                  d="M36.068 20.176l-29-20c-.307-.21-.705-.233-1.033-.062C5.705.287 5.5.627 5.5 1v40c0 .37.206.712.535.885.146.076.306.114.465.114.2 0 .397-.06.568-.178l29-20c.27-.187.432-.494.432-.823s-.162-.637-.432-.824z"
                />
              </svg> </b-button
            ><b-button class="slider-btn next brend_next">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                viewBox="0 0 41.999 41.999"
              >
                <path
                  d="M36.068 20.176l-29-20c-.307-.21-.705-.233-1.033-.062C5.705.287 5.5.627 5.5 1v40c0 .37.206.712.535.885.146.076.306.114.465.114.2 0 .397-.06.568-.178l29-20c.27-.187.432-.494.432-.823s-.162-.637-.432-.824z"
                />
              </svg>
            </b-button>
          </div>
        </div>
        <div class="col-xl-12 style-mobile">
          <swiper
            :not-next-tick="true"
            ref="mySwiper"
            :options="swiperOption"
            class="brand-slider"
          >
            <swiper-slide :key="brand.id" v-for="brand in brands" class="media">
              <router-link
                :to="{ name: 'dealer' }"
                class=" dealer-account"
                tag="div"
              >
                <img class="d-flex align-self-center" :src="randomImage()" />
              </router-link>
            </swiper-slide>
            <div
              class="swiper-pagination d-sm-block d-md-block d-lg-none d-xl-none"
              slot="pagination"
            ></div>
          </swiper>
          <p>
            If you drive a late model vehicle with an air bag and steering wheel
            controls, that doesn’t exclude you from having a custom steering
            wheel. The wheels we offer start out as OEM steering wheels, but
            then they’re transformed by experienced craftsmen and fitted with
            your choice of leather, real wood, carbon fiber or other materials.
            Custom made to order, most wheels require no core exchange. Just
            remove your steering wheel, transfer the air bag and steering wheel
            mounted switches to your new wheel, and reinstall. The installation
            only takes about 45 minutes, and you can be assured of perfect
            fitment.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from 'vuex'
import utils from '@/mixins/utils'

export default {
  name: 'brand',
  data () {
    return {
      brands: [],
      swiperOption: {
        nextButton: '.brend_next',
        prevButton: '.brend_prew',
        slidesPerView: 4,
        initialSlide: 0,
        spaceBetween: 30,
        autoplay: false,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        loop: false,
        loopedSlides: 4,
        breakpoints: {
          671: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          980: {
            slidesPerView: 4,
            spaceBetween: 20
          },
          1224: {
            slidesPerView: 4,
            spaceBetween: 20
          }
        }
      }
    }
  },
  mixins: [utils],
  methods: {
    randomImage () {
      let arr = ['brand_1', 'brand_2', 'brand_3', 'brand_4']
      let item = arr[Math.floor(Math.random() * arr.length)]
      return this.imageSrc(`brands/${item}.png`)
    },
    setBrands () {
      this.$store.dispatch('fetchDealers').then(
        resp => {
          this.brands = resp.data
          // eslint-disable-next-line
        },
        error => {
          console.error(error)
        }
      )
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    ...mapGetters(['getBrands'])
  },
  components: {
    swiper,
    swiperSlide
  },
  mounted () {
    this.setBrands()
  }
}
</script>

<style lang="scss" scoped="">
.caption-h1 {
}
.logo-and-button {
  margin-bottom: 12px;
}
.swiper-pagination {
  position: relative;
}
.button-right {
  margin-bottom: 16px;
  text-align: right;
  position: absolute;
  top: 0;
  right: 16px;
}
.scoped-brand {
  img {
    margin: 8px;
    width: 94%;
  }
  p {
    color: $caption-text-color;
    font-family: $sours-sans-p-font;
    font-size: 16px;
    line-height: 1.75;
    margin-bottom: 124px;
    margin-top: 64px;
    text-align: left;
  }
}
</style>
