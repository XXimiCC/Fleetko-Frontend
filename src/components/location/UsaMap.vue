<template xmlns:svg="http://www.w3.org/1999/xhtml">
  <div class="map">
    <svg
      ref="geoMap"
      class="map__svg"
      viewBox="-125 21 58 28.5"
      preserveAspectRatio="none"
    >
      <defs>
        <svg:style>
          polygon {
            fill: #d1dffb;
            stroke-width: 0.05;
            stroke: #fff;
            transition: 0.1s;
          }

          .has-warehouse:hover polygon,
          .has-warehouse:hover {
            fill: #b8cdf9;
          }

          .has-warehouse:hover polygon ellipse,
          .has-warehouse:hover ellipse {
            rx: 0.8;
            ry: 0.55;
          }

          .active-warehouse:hover polygon,
          .active-warehouse:hover {
            fill: #86a9f5;
          }

          .active-warehouse polygon,
          .active-warehouse {
            fill: #86a9f5;
          }

          ellipse {
            fill: #011344;
            rx: 0.5;
            ry: 0.35;
            cursor: pointer;
            transition: 0.1s;
          }

          ellipse:hover {
            rx: 0.8;
            ry: 0.55;
          }

          .active-pointer {
            fill: #1458eb;
          }

          .active-pointer + image {
            display: block;
            pointer-events: none;
          }

          ellipse + image {
            display: none;
          }

          polyline {
            stroke: #d1dffb;
            stroke-width: 0.1;
            fill: none;
          }
        </svg:style>

        <symbol ref="alaska" id="alaskaBox" viewBox="-110 -60 10 215"></symbol>
        <symbol ref="hawaii" id="hawaiiBox" viewBox="-110 -60 10 215"></symbol>
      </defs>

      <polyline
        points="-125,30 -112,30 -109,28 -109,25 -102,20 -109,25 -109,28 -104,28 -92,20"
      ></polyline>
      <g ref="USA"></g>
      <use href="#alaskaBox" x="-146" y="-32" width="100" height="100"></use>
      <use
        href="#hawaiiBox"
        x="-33.5"
        y="-14"
        width="50"
        height="50"
        transform="scale(5)"
      ></use>
    </svg>
  </div>
</template>

<script>
import usaMapData from '../../usaMap'
import $ from 'jquery'
import utils from '@/mixins/utils'

export default {
  name: 'UsaMap',
  props: ['warehouses', 'currentWarehouse'],
  mixins: [utils],
  watch: {
    currentWarehouse (house) {
      this.applyClassNames(house.id, this.currentWarehouse.state)
    }
  },
  methods: {
    clickHandler (id) {
      event.stopPropagation()
      if (this.currentWarehouse.id !== id) this.$emit('warehouseChange', id)
    },
    applyClassNames (id, state) {
      this.findEl(`.active-warehouse`).classList.remove('active-warehouse')
      this.findEl(`.active-pointer`).classList.remove('active-pointer')
      this.findEl(`g.${state}`).classList.add('active-warehouse')
      this.findEl(`.house${id}`).classList.add('active-pointer')
    },

    applySvg () {
      this.$refs.geoMap.append(this.$refs.USA)
      this.$refs.geoMap.append(this.$refs.hawaii)
      this.$refs.geoMap.append(this.$refs.alaska)

      usaMapData.states.forEach(({ properties, geometry }) => {
        const { name, abbr } = properties
        const { coordinates: coords } = geometry
        const group = this.createEl('g')

        if (this.warehouses[abbr]) { this.addMarker(group, this.warehouses[abbr], abbr) }

        if (coords.length < 2) {
          const points = coords.reduce((all, arr) => all.concat(arr)).join(' ')
          const POLYGON = this.createEl('polygon')

          POLYGON.setAttribute('points', points)
          group.prepend(POLYGON)
          this.$refs.USA.append(group)

          return
        }

        if (name === 'Hawaii' || name === 'Alaska') {
          coords.forEach(item => {
            const points = item.join(' ')
            const polygon = this.createEl('polygon')

            polygon.setAttribute('points', points)
            group.prepend(polygon)
          })

          this.$refs[name === 'Hawaii' ? 'hawaii' : 'alaska'].append(group)

          return
        }

        coords.forEach(item => {
          const points = item.join(' ')
          const polygon = this.createEl('polygon')

          polygon.setAttribute('points', points)
          group.prepend(polygon)
        })

        this.$refs.USA.append(group)
      })
    },

    addMarker (group, warehouses, abbr) {
      group.classList.add('has-warehouse', abbr)
      group.addEventListener('click', () =>
        this.clickHandler(warehouses[0].id, abbr)
      )

      warehouses.forEach(house => {
        const ellipse = this.createEl('ellipse')
        const image = this.createEl('image')

        ellipse.setAttribute('cx', house.longitude)
        ellipse.setAttribute('cy', house.latitude)
        ellipse.classList.add(`house${house.id}`)
        ellipse.addEventListener('click', () =>
          this.clickHandler(house.id, abbr)
        )

        group.append(ellipse)

        image.setAttribute('x', +house.longitude - 0.15) // justify flag image
        image.setAttribute('y', house.latitude)
        image.setAttribute('href', this.imageSrc('map-flag.svg'))

        group.append(image)

        if (this.currentWarehouse.id === house.id) {
          group.classList.add('active-warehouse')
          ellipse.classList.add('active-pointer')
        }
      })
    },
    findEl (el) {
      return this.$refs.geoMap.querySelector(el)
    },
    createEl (el) {
      return document.createElementNS('http://www.w3.org/2000/svg', el)
    }
  },
  mounted () {
    this.applySvg()
  },
  beforeDestroy () {
    $('.map__svg *').off()
  }
}
</script>

<style scoped lang="scss">
.map {
  &__svg {
    width: 100%;
    height: 100%;
    transform: rotateZ(180deg) rotateY(180deg);
  }
}
</style>
