/* eslint-disable no-lone-blocks */
import $ from 'jquery'
import Vue from 'vue'
export default {
  methods: {
    imageSrc (imageName) {
      return require('@/assets/' + imageName)
    },
    formatDateToIsoDate (date) {
      if (date.length <= 10 || !date.toISOString()) return date

      return date.toISOString().split('T')[0]
    },
    randomProductImage () {
      let arr = [
        'product-1',
        'product-2',
        'product-3',
        'product-4',
        'product-5',
        'product-6',
        'product-7',
        'product-8',
        'product-9',
        'product-10',
        'product-11',
        'product-12',
        'product-13',
        'product-14',
        'product-15'
      ]

      let item = arr[Math.floor(Math.random() * arr.length)]

      return this.imageSrc(`products/${item}.png`)
    },
    randomCategoryImage () {
      let arr = [
        'category-1',
        'category-2',
        'category-3',
        'category-4',
        'category-5',
        'category-6',
        'category-7',
        'category-8'
      ]
      let item = arr[Math.floor(Math.random() * arr.length)]
      return this.imageSrc(`category/${item}.png`)
    },
    userImageSrc (userInfo, size) {
      if (!userInfo.image) {
        const RANDOM_IMAGES_LENGTH = 8

        let item = userInfo.id % RANDOM_IMAGES_LENGTH + 1

        return this.imageSrc(`users/${item}.svg`)
      }

      const socialImage = userInfo.image.includes('google') || userInfo.image.includes('facebook')

      if (socialImage) {
        let social = userInfo.image.includes('google') ? 'google' : 'facebook'
        let socilaUrl = social === 'google' ? userInfo.image.split('?')[0] + `?size=${size}`
                                            : userInfo.image.split('?')[0] + `?width=${size}&height=${size}`
        return socilaUrl
      }
    },
    brandImage (brand) {
      return this.imageSrc(`brands/${brand}.png`)
    },
    groupBy (array, key, fn) {
      let hash = Object.create(null)

      return array.reduce(function (previousValue, currentValue) {
        if (!hash[currentValue[key]]) {
          hash[currentValue[key]] = {}
          hash[currentValue[key]][key] = currentValue[key]
          previousValue.push(hash[currentValue[key]])
        }
        fn(currentValue, hash[currentValue[key]])
        return previousValue
      }, [])
    },
    fullName (userInfo) {
      return `${userInfo.first_name} ${userInfo.last_name}`
    },
    availableKeysArray () {
      let availableKeys = [this.EVENT_KEY_BACKSPACE,
        this.EVENT_KEY_ARROW_LEFT,
        this.EVENT_KEY_ARROW_RIGHT,
        this.EVENT_KEY_DELETE]

      for (let i = this.EVENT_KEY_ZERO; i <= this.EVENT_KEY_NINE; i++) {
        availableKeys.push(i)
      }
      for (let i = this.EVENT_KEY_NUMPAD_ZERO; i <= this.EVENT_KEY_NUMPAD_NINE; i++) {
        availableKeys.push(i)
      }
      Vue.prototype.NUMBER_INPUT_AVAILABLE_KEYS = availableKeys
    },

    scrollingModalOpen (open) {
      let mac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)
      const bodySelector = $('body')

      if (this.$mq === 'lg' || this.$mq === 'xl') {
        if (open) {
          mac ? bodySelector.addClass('open-modal--mac') : bodySelector.addClass('open-modal')
        } else {
          mac ? bodySelector.removeClass('open-modal--mac') : bodySelector.removeClass('open-modal')
        }
      } else {
        open ? bodySelector.addClass('open-modal--responsive') : bodySelector.removeClass('open-modal--responsive')
      }
    },
    hiddingNavbarFunction () {
      let currentScrollTop = 0
      let c = 0
      let navbar = $('.header')

      $(window).scroll(function () {
        let a = $(window).scrollTop()
        let b = navbar.height()

        currentScrollTop = a

        if (c < currentScrollTop && a > b + b) {
          navbar.addClass('transition')
          navbar.addClass('scrollup')
        } else if (c > currentScrollTop && !(a <= b)) {
          navbar.removeClass('scrollup')
        }
        c = currentScrollTop
      })
    },
    isElementInView (element, fullyInView, offset) {
      let pageTop = $(window).scrollTop()

      if ($(element).length) {
        let elementTop = $(element).offset().top
        let elementBottom = (elementTop + $(element).height())

        return ((pageTop + offset > elementTop) && (pageTop + offset < elementBottom))
      }
    },
    transformSortingOption (option) {
      switch (option) {
        case this.SELECTED_SORTING_NEW:
          return '-published_at'
        case this.SELECTED_SORTING_OLD:
          return 'published_at'
        case this.SELECTED_SORTING_EXPENSIVE:
          return '-price'
        case this.SELECTED_SORTING_CHEAP:
          return 'price'
      }
    },
    removeNode (nodes) {
      if (nodes.length) {
        nodes.forEach(node => {
          node.remove()
        })
      }
    },
    isMobileDevice () {
      return navigator.platform.match(/(iPhone|iPod|iPad|Android)/i)
    }
  }
}
