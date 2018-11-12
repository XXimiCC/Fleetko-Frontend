<template>
  <div
    class="dealer-info"
    :class="{
      'dealer-info--no-description': category && !category.description
    }"
    v-if="!vehicleSearch"
  >
    <div class="container" v-if="category">
      <div
        class="dealer-info--breadcrumbs breadcrumb-links"
        itemscope
        itemtype="http://schema.org/BreadcrumbList"
      >
        <router-link
          itemprop="itemListElement"
          itemtype="http://schema.org/ListItem"
          itemscope
          :to="{ name: 'home' }"
          tag="a"
        >
          <span itemprop="name">Home</span>
          <meta itemprop="position" content="1" />
        </router-link>
        <span class="breadcrumbs-slash">/</span>
        <router-link
          itemprop="itemListElement"
          itemtype="http://schema.org/ListItem"
          itemscope
          :to="{ name: 'section', params: { slug: category.section.slug } }"
          tag="a"
        >
          <span itemprop="name">{{ category.section.name }}</span>
          <meta itemprop="position" content="2" />
        </router-link>
        <span class="breadcrumbs-slash">/</span>
        <span class="active">{{ category.name }}</span>
      </div>
      <div class="dealer-info--title">
        <h2 class="h2-secondary">{{ category.name }}</h2>
      </div>
      <div class="dealer-info--text" v-if="category.description">
        <p>{{ category.description }}</p>
      </div>
    </div>
  </div>

  <div class="vehicle-search" v-else>
    <div class="search__info" :class="{ 'search__info--large': openSearch }">
      <div class="container container-flex">
        <div class="search__info--text">
          <p v-if="getVehicle.id">
            {{ getVehicle.year }} {{ getVehicle.vehicle_brand_name }}
            {{ getVehicle.name }}
          </p>
          <p v-if="category">{{ category.name }}</p>
        </div>
        <div class="search__info--button">
          <button
            class="button-prime"
            v-if="!openSearch"
            @click="$emit('toggleSearchForm', true)"
          >
            Change Vehicle
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import search from '@/components/parts/SearchCommon'
import _ from 'lodash'
import { mapGetters } from 'vuex'
export default {
  name: 'CategoryInfo',
  data () {
    return {
      loaded: false,
      filterSearch: true
    }
  },
  props: ['category', 'openSearch'],
  watch: {},
  methods: {
    setVehicle () {
      if (this.vehicleSearch && this.getSearchOptions.selectedModel.value) {
        let id = this.getSearchOptions.selectedModel.value

        this.$store.dispatch('fetchVehicle', parseInt(id)).then(resp => {
          resp.vehicle_brand_name ? (this.loaded = true) : (this.loaded = false)
        })
      }
    }
  },
  mounted () {},
  computed: {
    ...mapGetters(['getVehicle', 'getSearchOptions']),
    vehicleSearch () {
      return (
        this.$route.query.vehicle && !_.isUndefined(this.$route.query.vehicle)
      )
    }
  },
  components: {
    search
  }
}
</script>

<style lang="scss" scoped="">
.search__info {
  position: relative;
  padding: 40px 0 40px 0;
  background: #f5f5f5;
  transition: padding 0.5s;
  .container-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &--text {
    line-height: 1;
    p {
      margin-bottom: 0;
      width: 100%;
      font-family: $montserrat-font;
      font-size: 34px;
      color: $main-dark;
      /*line-height: 1;*/
      &:first-child {
        font-weight: normal;
      }
      &:last-child {
        margin-top: 18px;
        font-size: 20px;
        font-weight: 200;
      }
    }
  }
  &--button {
    flex: 0 0 224px;
    display: flex;
    justify-content: flex-end;
    button {
      height: 48px;
      width: 160px;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-family: $montserrat-font;
      font-size: 12px;
      font-weight: 500;
      line-height: 18px;
      text-transform: uppercase;
    }
  }
  &--large {
    padding: 160px 0 32px 0;
  }
}
.dealer-info {
  padding: 145px 0 32px 0;
  background: #f7fafc;
  &--no-description {
    padding: 145px 0 32px 0;
  }
  &--title {
    margin-top: 32px;
    h2 {
      margin-bottom: 0;
    }
  }
  &--text {
    margin-top: 16px;
    font-family: $sours-sans-p-font;
    font-size: 14px;
    line-height: 19px;
    color: $paragraph;
    p {
      margin-bottom: 0;
    }
  }
}

@media (min-width: $md) and (max-width: $lg) {
  .dealer-info {
    padding: 67px 0 32px 0;
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .dealer-info {
    padding: 32px 0 32px 0;
  }
}

@media (min-width: $xs) and (max-width: $md) {
  .search {
    &__info {
      &--large {
        padding: 48px 0 24px 0;
      }
      .container-flex {
        flex-wrap: wrap;
      }
      &--text {
        width: 100%;
      }
      &--button {
        margin-top: 16px;
        justify-content: flex-start;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .dealer-info {
    padding: 10px 0 32px 0;
    &--title {
      margin-top: 20px;
      h2 {
        font-size: 20px;
      }
    }
  }
  .search {
    &__info {
      &--text {
        line-height: 1;
        p {
          font-size: 20px;
          &:first-child {
            font-weight: 500;
          }
          &:last-child {
            margin-top: 18px;
            font-size: 16px;
            font-weight: 300;
          }
        }
      }
    }
  }
}
</style>
