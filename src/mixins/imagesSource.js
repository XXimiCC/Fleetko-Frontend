import {imageSizes} from '../image-sizes'

const RESOLUTION = [
  'only screen and (min-resolution: 192dpi)',
  'only screen and (min-resolution: 2dppx)',
  'only screen and (min-resolution: 75.6dpcm)'
].join(', ')

const RATIO = [
  'only screen and (-webkit-min-device-pixel-ratio: 2)',
  'only screen and (-o-min-device-pixel-ratio: 2/1)',
  'only screen and (min--moz-device-pixel-ratio: 2)',
  'only screen and (min-device-pixel-ratio: 2)'
].join(', ')

const retinaDisplay = (
  (window.matchMedia &&
  (window.matchMedia(RESOLUTION).matches || window.matchMedia(RATIO).matches)) ||
  (window.devicePixelRatio && window.devicePixelRatio >= 2)
)

export default {
  methods: {
    serverImageSource (imageObject, size, onError, type) {
      if (!imageObject) {
        switch (type) {
          case 'product':
            return require('@/assets/empty-image-product.svg')

          case 'section':
            return require('@/assets/empty-image-product.svg')

          case 'category':
            return require('@/assets/empty-image-product.svg')

          case 'dealer':
            return require('@/assets/empty-image-product.svg')

          case 'banners':
            return require('@/assets/empty-image-product.svg')

          default:
            return 'http://via.placeholder.com/350x150'
        }
      }

      if (onError) {
        onError.target.src = imageObject.versions.original
      } else {
        let serverSize = retinaDisplay && imageSizes[type][size + '_x2']
                          ? imageSizes[type][size + '_x2']
                          : imageSizes[type][size]

        return imageObject.versions[serverSize]
      }
    }
  }
}

