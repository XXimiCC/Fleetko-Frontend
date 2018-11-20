<template>
  <div class="star"
       :class="{ smallMargin: smallMargin }"
       @mouseenter="fillStarByHoverEvent"
       @click="setRating">
    <svg version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         :width="getSize"
         :height="getSize"
         viewBox="0 0 24 24"
         :fill="getFillColor"
         :stroke-width="borderWidth"
         :stroke="getBorderColor">
      <defs>
        <linearGradient id="half_grad">
          <stop offset="50%" :stop-color="activeColor"></stop>
          <stop offset="50%" :stop-color="inActiveColor" stop-opacity="1"></stop>
        </linearGradient>
      </defs>

      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'star',
  data () {
    return {
      starPoints: [
        12,
        0.6,
        15.7,
        8.2,
        24,
        9.3,
        17.9,
        15.1,
        19.4,
        23.4,
        12,
        19.4,
        4.6,
        23.4,
        6.1,
        15.1,
        0,
        9.3,
        8.3,
        8.2,
        12,
        0.6
      ],
      activeColor: '#FBC02D',
      inActiveColor: '#b4bac7',
      borderColor: ''
    }
  },
  props: [
    'rating',
    'position',
    'borderWidth',
    'size',
    'padding',
    'readOnly',
    'smallMargin'
  ],
  computed: {
    starPointsToString () {
      return this.starPoints.join(',')
    },
    getSize () {
      return parseInt(this.size)
    },
    getBorderColor () {
      if (this.readOnly) {
        if (this.rating % 1 === 0) {
          if (parseFloat(this.rating) >= this.position) {
            return this.activeColor
          } else {
            return this.inActiveColor
          }
        } else {
          let roundRate = parseFloat(this.rating).toFixed(1)
          let posHalf = roundRate.toString().split('.')[0]

          if (parseInt(posHalf) === this.position - 1) {
            return 'url(#half_grad)'
          } else if (parseInt(posHalf) < this.position) {
            return this.inActiveColor
          } else if (parseInt(posHalf) >= this.position) {
            return this.activeColor
          }
        }
      }
    },
    getFillColor () {
      if (this.readOnly) {
        if (this.rating % 1 === 0) {
          if (parseFloat(this.rating) >= this.position) {
            return this.activeColor
          } else {
            return this.inActiveColor
          }
        } else {
          let roundRate = parseFloat(this.rating).toFixed(1)
          let posHalf = roundRate.toString().split('.')[0]

          if (parseInt(posHalf) === this.position - 1) {
            return 'url(#half_grad)'
          } else if (parseInt(posHalf) < this.position) {
            return this.inActiveColor
          } else if (parseInt(posHalf) >= this.position) {
            return this.activeColor
          }
        }
      } else {
        if (Number.isInteger(this.rating)) {
          if (this.rating >= this.position) {
            return this.activeColor
          } else {
            return this.inActiveColor
          }
        }
      }
    }
  },
  methods: {
    calculatePoints () {
      this.starPoints = this.starPoints.map(point => {
        return (this.size / 23) * point + this.borderWidth * 1.5
      })
    },
    fillStarByHoverEvent () {
      if (!this.readOnly) {
        this.$emit('changeRatingByHover', this.position)
      }
    },
    setRating () {
      if (!this.readOnly) {
        this.$emit('setRating', this.position)
      }
    }
  },
  mounted () {
    this.calculatePoints()
  }
}
</script>

<style scoped lang="scss">
.star {
  display: flex;
}
.star + .star {
  margin-left: 6px;
}
.star.smallMargin + .star.smallMargin {
  margin-left: 3px;
}
</style>
