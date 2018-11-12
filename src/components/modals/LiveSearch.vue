<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container modal-search" v-on-clickaway="closeModal">
          <div class="modal-search--header">
            <div class="input-wrap">
              <input class="input-default"
                     @keydown="inputKeyDownListener($event)"
                     @input="searchQueryInput"
                     :ref="'searchInput'"
                     type="text"/>
              <div class="input-wrap--icon"
                   @click="redirectToSearchResult"
                   :class="{'input-wrap--icon-active': searchQuery.length && resultCounter}">
                <svg-search></svg-search>
              </div>
              <div class="input-wrap--close" @click="closeModal">
                <svg-close></svg-close>
              </div>
            </div>
          </div>

          <div class="modal-search--body" v-show="searchQuery.length">
            <div class="modal-search--body__empty" v-show="!resultCounter">
              <div class="modal-search--body__empty--title">
                <span>0 results </span>
                <span class="grey-out">found for </span>
                <span class="bold">"{{ searchQuery }}"</span>
                <p>Please try again with other keywords</p>
              </div>
              <div class="modal-search--body__empty--list">
                <h4 class="h4-primary dark-title">Search Tips</h4>
                <ul>
                  <li>Double check your spelling.</li>
                  <li>Try using single words.</li>
                  <li>Try searching for an item that is less specific.</li>
                  <li>You can always narrow your search results later.</li>
                </ul>
              </div>
            </div>

            <div v-show="resultCounter">
              <!-- Products Results starts here -->
              <div class="modal-search--body__product">
                <ais-index :search-store="searchProducts"
                           :index-name="'products'"
                           :query="searchQuery">
                  <ais-results :results-per-page="5">
                    <div class="modal-search--body__product--stats" slot="header">
                      <ais-stats>
                        <template slot-scope="{ totalResults, processingTime, query }">
                          <span class="title">Products</span>
                          <span class="total">({{ totalResults }})</span>
                          <router-link
                            :to="{
                              name: 'searchResult',
                              query: { q: searchQuery, entity: 'products' }
                            }"
                            class="link">
                            <span class="link-quaternary">See All Products</span>
                            <svg-see-all></svg-see-all>
                          </router-link>
                        </template>
                      </ais-stats>
                    </div>

                    <template slot-scope="{ result }">
                      <router-link
                        :to="{
                          name: 'product-page',
                          params: { slug: result.slug }
                        }"
                        class="modal-search--body__product--result">
                        <div class="flex-item">
                          <div class="image-wrap">
                            <app-image itemprop="image"
                                       :imagePath="componentProductImage(result.image)"
                                       @emitErrorImage="errorImage">
                            </app-image>
                          </div>
                          <div class="info">
                            <div class="info-name item">{{ result.name }}</div>
                            <div class="item">
                              <div v-if="result.part_number" class="item mpn">
                                <span class="label">mpn:</span>
                                <span class="value">{{ result.part_number }}</span>
                              </div>

                              <div class="item dealer-value">
                                <span class="label">Dealer:</span>
                                <span class="value">{{ result.dealer_name }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="flex-item">
                          <div class="price" v-if="result.price">
                            $ {{ toDollarDecimal(result.price) }}
                          </div>
                          <div class="price price--blurred" v-if="!result.price">
                            Unavailable
                          </div>
                        </div>
                      </router-link>
                    </template>
                  </ais-results>
                </ais-index>

                <router-link v-show="searchProducts._results.length"
                             class="responsive-link"
                             :to="{
                               name: 'searchResult',
                               query: { q: searchQuery, entity: 'products' }
                             }">
                  <span class="link-quaternary">See All Products</span>
                  <svg-see-all></svg-see-all>
                </router-link>
              </div>
              <!-- Products Results ends here -->
              <!-- Categories Results ends here -->
              <div class="modal-search--body__categories"
                   :class="{ 'no-indent': !this.searchCategories._results.length }">
                <ais-index :index-name="'categories'"
                           :search-store="searchCategories"
                           :query="searchQuery">
                  <ais-results :results-per-page="6">
                    <div class="modal-search--body__categories--stats"
                         slot="header">
                      <ais-stats>
                        <template slot-scope="{ totalResults, processingTime, query }">
                          <span class="title">Categories</span>
                          <span class="total">({{ totalResults }})</span>
                          <router-link class="link"
                                       :to="{
                                         name: 'searchResult',
                                         query: { q: searchQuery, entity: 'categories' }
                                       }">
                            <span class="link-quaternary">See All Categories</span>
                            <svg-see-all></svg-see-all>
                          </router-link>
                        </template>
                      </ais-stats>
                    </div>

                    <template slot-scope="{ result }">
                      <router-link :to="{ name: 'catalog', params: { slug: result.slug } }"
                                   class="modal-search--body__categories--result">
                        <div class="item-wrap">
                          <app-image itemprop="image"
                                     :imagePath="componentCategoryImage(result.image)"
                                     @emitErrorImage="errorImage">
                          </app-image>
                        </div>
                        <div class="name">
                          <span class="link-tertiary">{{ result.name }}</span>
                        </div>
                      </router-link>
                    </template>
                  </ais-results>
                </ais-index>
                <router-link
                  v-show="searchCategories._results.length"
                  class="responsive-link"
                  :to="{
                    name: 'searchResult',
                    query: { q: searchQuery, entity: 'categories' }
                  }">
                  <span class="link-quaternary">See All Categories</span>
                  <svg-see-all></svg-see-all>
                </router-link>
              </div>
              <!-- Categories Results ends here -->
              <!-- Dealers Results starts here -->
              <div class="modal-search--body__dealers"
                   :class="{ 'no-indent': !this.searchDealers._results.length }">
                <ais-index :index-name="'dealers'"
                           :search-store="searchDealers"
                           :query="searchQuery">
                  <ais-results :results-per-page="6">
                    <div class="modal-search--body__dealers--stats" slot="header">
                      <ais-stats>
                        <template slot-scope="{ totalResults, processingTime, query }">
                          <span class="title">Dealers</span>
                          <span class="total">({{ totalResults }})</span>
                          <router-link
                            class="link"
                            :to="{
                              name: 'searchResult',
                              query: { q: searchQuery, entity: 'dealers' }
                            }">
                            <span class="link-quaternary">See All Dealers</span>
                            <svg-see-all></svg-see-all>
                          </router-link>
                        </template>
                      </ais-stats>
                    </div>

                    <template slot-scope="{ result }">
                      <router-link :to="{ name: 'dealer', params: { slug: result.slug } }"
                                   class="modal-search--body__dealers--result">
                        <div class="image-wrap">
                          <app-image itemprop="image"
                                     :imagePath="componentDealerImage(result.image)"
                                     @emitErrorImage="errorImage">
                          </app-image>
                        </div>
                      </router-link>
                    </template>
                  </ais-results>
                </ais-index>
                <router-link
                  v-show="searchDealers._results.length"
                  class="responsive-link"
                  :to="{
                    name: 'searchResult',
                    query: { q: searchQuery, entity: 'dealers' }
                  }">
                  <span class="link-quaternary">See All Dealers</span>
                  <svg-see-all></svg-see-all>
                </router-link>
              </div>
              <!-- Dealers Results ends here -->
              <!-- Vehicles Results starts here -->
              <div class="modal-search--body__vehicles"
                   :class="{ 'no-indent': !this.searchVehicles._results.length }">
                <ais-index
                  :index-name="'vehicles'"
                  :search-store="searchVehicles"
                  :query="searchQuery">
                  <ais-results :results-per-page="10">
                    <div class="modal-search--body__vehicles--stats" slot="header">
                      <ais-stats>
                        <template
                          slot-scope="{
                            totalResults,
                            processingTime,
                            query
                          }">
                          <span class="title">Vehicles</span>
                          <span class="total">({{ totalResults }})</span>
                          <router-link
                            class="link"
                            :to="{
                              name: 'searchResult',
                              query: { q: searchQuery, entity: 'vehicles' }
                            }">
                            <span class="link-quaternary">See All Vehicles</span>
                            <svg-see-all></svg-see-all>
                          </router-link>
                        </template>
                      </ais-stats>
                    </div>

                    <template slot-scope="{ result }">
                      <router-link
                        :to="{
                          name: 'searchPage',
                          params: { slug: result.slug }
                        }"
                        class="modal-search--body__vehicles--result"
                        @click="setVehicleSearchModel(result)">
                        <span class="link-tertiary">{{ result.year }} {{ result.vehicle_brand_name }}{{ result.name }}</span>
                      </router-link>
                    </template>
                  </ais-results>
                </ais-index>
                <router-link
                  v-show="searchVehicles._results.length"
                  class="responsive-link"
                  :to="{
                    name: 'searchResult',
                    query: { q: searchQuery, entity: 'vehicles' }
                  }">
                  <span class="link-quaternary">See All Vehicles</span>
                  <svg-see-all></svg-see-all>
                </router-link>
              </div>
              <!-- Vehicles Results ends here -->
            </div>

            <!-- Algolia Logo -->
            <div class="modal-search--algolia-brand">
              <div class="image-wrap"><svg-algolia></svg-algolia></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import _ from 'lodash'
import { AlgoliaApi } from '@/mixins/AlgoliaApi'
import config from '../../config'
import { createFromAlgoliaCredentials } from 'vue-instantsearch'
import { mapActions } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import utils from '@/mixins/utils'
import EnterListener from '@/mixins/EnterListener'
import imageSource from '@/mixins/imagesSource'
import AppImage from '../parts/AppImage'

export default {
  name: 'live-search',
  data () {
    return {
      searchQuery: '',
      searchProducts: createFromAlgoliaCredentials(
        config.algoliaApiId,
        config.algoliaApiKey
      ),
      searchCategories: createFromAlgoliaCredentials(
        config.algoliaApiId,
        config.algoliaApiKey
      ),
      searchDealers: createFromAlgoliaCredentials(
        config.algoliaApiId,
        config.algoliaApiKey
      ),
      searchVehicles: createFromAlgoliaCredentials(
        config.algoliaApiId,
        config.algoliaApiKey
      )
    }
  },
  mixins: [clickaway, utils, AlgoliaApi, imageSource, EnterListener],
  methods: {
    ...mapActions(['setYearSearch', 'setBrandSearch', 'setModelSearch']),
    searchQueryInput: _.debounce(function (e) {
      this.searchQuery = e.target.value
    }, 200),
    closeModal () {
      this.$store.dispatch('toggleSearchModal', false)
    },
    setVehicleSearchModel (result) {
      this.setYearSearch(result.year.toString())
      this.setBrandSearch(result.vehicle_brand_name)
      this.setModelSearch({
        label: result.name,
        value: result.id
      })
    },
    inputKeyDownListener ($event) {
      if ($event.keyCode === this.EVENT_KEY_ENTER && !this.isMobileDevice) {
        this.$refs.searchInput.blur()
      }
    },
    enterKeyHandler: function (evt) {
      if (evt.keyCode === this.EVENT_KEY_ENTER) {
        evt.preventDefault()
        this.redirectToSearchResult()
      }
    },
    errorImage (e, image) {
      this.serverImageSource(image, null, e, this.SERVER_IMAGE_PRODUCT)
    },
    componentProductImage (images, onError) {
      let sizeProperty = ''

      if (this.$mq === 'xl' || this.$mq === 'lg') {
        sizeProperty = 'small'
      } else {
        sizeProperty = 'tiny'
      }

      return this.serverImageSource(
        images,
        sizeProperty,
        onError,
        this.SERVER_IMAGE_PRODUCT
      )
    },
    componentCategoryImage (images, onError) {
      return this.serverImageSource(
        images,
        'tiny',
        onError,
        this.SERVER_IMAGE_CATEGORY
      )
    },
    componentDealerImage (images, onError) {
      return this.serverImageSource(
        images,
        'tiny',
        onError,
        this.SERVER_IMAGE_DEALER
      )
    },
    redirectToSearchResult () {
      if (this.searchQuery.length && this.resultCounter) {
        if (this.searchProducts._results.length) {
          this.$router.push({
            name: 'searchResult',
            query: { q: this.searchQuery, entity: 'products' }
          })
          return
        }
        if (this.searchCategories._results.length) {
          this.$router.push({
            name: 'searchResult',
            query: { q: this.searchQuery, entity: 'categories' }
          })
          return
        }
        if (this.searchDealers._results.length) {
          this.$router.push({
            name: 'searchResult',
            query: { q: this.searchQuery, entity: 'dealers' }
          })
          return
        }
        if (this.searchVehicles._results.length) {
          this.$router.push({
            name: 'searchResult',
            query: { q: this.searchQuery, entity: 'vehicles' }
          })
        }
      }
    }
  },
  components: {
    AppImage
  },
  computed: {
    resultCounter () {
      return (
        this.searchProducts._results.length ||
        this.searchCategories._results.length ||
        this.searchDealers._results.length ||
        this.searchVehicles._results.length
      )
    }
  },
  created () {
    this.scrollingModalOpen(true)
  },
  mounted () {
    this.$refs.searchInput.focus()
  },
  beforeDestroy () {
    this.scrollingModalOpen(false)
  }
}
</script>

<style scoped lang="scss">
.modal-search {
  margin: 56px auto;
  .no-indent {
    margin: 0;
    padding: 0;
  }
  &--algolia-brand {
    margin-bottom: 1px;
    margin-top: 36px;
    margin-right: 32px;
    display: flex;
    justify-content: flex-end;
    .image-wrap {
      width: 100px;
      height: 16px;
      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
  &--header {
    .input-wrap {
      position: relative;
      display: flex;
      input {
        width: calc(100% - 96px);
        height: 40px;
        border-radius: 4px 0 0 4px;
      }
      &--icon {
        width: 96px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: $main-color-step-lighter;
        border-radius: 0 4px 4px 0;
        svg {
          width: 25px;
          height: 25px;
          fill: white;
        }
      }
      &--icon-active {
        background: $main-color;
        cursor: pointer;
      }
      &--close {
        position: absolute;
        right: -36px;
        top: 8px;
        cursor: pointer;
        svg {
          fill: white;
        }
      }
    }
  }
  &--body {
    padding-bottom: 32px;
    margin-top: 8px;
    border-top: 2px solid $main-color;
    width: 100%;
    background-color: #fff;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    .responsive-link {
      display: none;
    }
    &__empty {
      padding: 32px 28px;
      &--title {
        display: flex;
        flex-wrap: wrap;
        line-height: 1;
        span {
          font-family: $montserrat-font;
          font-size: 20px;
          color: $main-dark;
        }
        .grey-out {
          margin: 0 4px;
          color: $paragraph;
        }
        .bold {
          font-weight: 500;
        }
        p {
          width: 100%;
          margin-top: 16px;
          margin-bottom: 0;
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $main-color;
        }
      }
      &--list {
        margin-top: 40px;
        h4 {
          margin-bottom: 18px;
        }
        ul {
          padding-left: 14px;
          list-style: none;
          line-height: 1;
          li {
            position: relative;
            font-family: $sours-sans-p-font;
            font-size: 14px;
            color: $paragraph;
            &:before {
              position: absolute;
              content: '';
              left: -12px;
              top: 5px;
              width: 4px;
              height: 4px;
              background-color: $paragraph;
              border-radius: 100%;
            }
          }
          li + li {
            margin-top: 16px;
          }
        }
      }
    }
    &__product {
      display: flex;
      flex-wrap: wrap;
      .ais-index {
        width: 100%;
      }
      &--stats {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        width: 100%;
        padding: 32px 32px 0 32px;
        .title {
          font-family: $montserrat-font;
          color: $main-dark;
          font-size: 20px;
          font-weight: 500;
        }
        .total {
          margin-left: 16px;
          font-family: $montserrat-font;
          color: $main-grey;
          font-weight: 400;
          font-size: 20px;
        }
        .link {
          margin-left: 24px;
          display: flex;
          align-items: center;
          svg {
            margin-left: 8px;
            width: 16px;
            fill: $svg-fill-tertiary;
          }
          &:hover {
            svg {
              fill: $main-color;
            }
          }
        }
        .ais-stats {
          display: flex;
          width: 100%;
        }
      }
      &--result {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 86px;
        padding: 4px 32px;
        &:hover {
          background: #f5f8ff;
          .image-wrap {
            background: #f5f8ff;
          }
        }
        .flex-item {
          display: flex;
        }
        .image-wrap {
          display: flex;
          align-items: center;
          width: 76px;
          height: 76px;
          border-radius: 4px;
          img {
            max-width: 100%;
          }
        }
        .info {
          display: flex;
          flex-direction: column;
          padding: 8px 0;
          margin-left: 16px;
          .mpn {
            margin-bottom: 4px;
          }
          .item {
            line-height: 1;
          }
          &-name {
            margin-bottom: 8px;
            font-family: $montserrat-font;
            font-size: 16px;
            font-weight: 500;
            color: $main-dark;
          }
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
        .price {
          padding-right: 4px;
          align-items: center;
          display: flex;
          justify-content: flex-end;
          font-family: $montserrat-font;
          color: $main-color;
          font-size: 16px;
          font-weight: 500;
          &--blurred {
            color: $grey;
          }
        }
      }
      .modal-search--body__product--result
        + .modal-search--body__product--result {
        margin-top: 8px;
      }
    }
    &__categories {
      padding: 32px 32px 0 32px;
      display: flex;
      flex-wrap: wrap;
      .ais-index {
        width: 100%;
      }
      .ais-results {
        display: flex;
        flex-wrap: wrap;
      }
      &--stats {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        width: 100%;
        .title {
          font-family: $montserrat-font;
          color: $main-dark;
          font-size: 20px;
          font-weight: 500;
        }
        .total {
          margin-left: 16px;
          font-family: $montserrat-font;
          color: $main-grey;
          font-weight: 400;
          font-size: 20px;
        }
        .link {
          margin-left: 24px;
          display: flex;
          align-items: center;
          svg {
            margin-left: 8px;
            width: 16px;
            fill: $svg-fill-tertiary;
          }
          &:hover {
            svg {
              fill: $main-color;
            }
          }
        }
        .ais-stats {
          display: flex;
          width: 100%;
        }
      }
      &--result {
        padding-right: 16px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        width: 33.333%;
        height: 48px;
        .item-wrap {
          display: flex;
          flex: 0 0 60px;
          align-items: center;
          height: 40px;
          width: 60px;
          margin: 4px 16px 4px 4px;
          border-radius: 4px;
          img {
            max-width: 100%;
          }
        }
        .name {
          display: flex;
          span {
            line-height: 18px;
          }
        }
      }
    }
    &__dealers {
      padding: 26px 32px 0 32px;
      display: flex;
      flex-wrap: wrap;
      .ais-index {
        width: 100%;
      }
      .ais-results {
        display: flex;
        flex-wrap: wrap;
      }
      &--stats {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        width: 100%;
        .title {
          font-family: $montserrat-font;
          color: $main-dark;
          font-size: 20px;
          font-weight: 500;
        }
        .total {
          margin-left: 16px;
          font-family: $montserrat-font;
          color: $main-grey;
          font-weight: 400;
          font-size: 20px;
        }
        .link {
          margin-left: 24px;
          display: flex;
          align-items: center;
          svg {
            margin-left: 8px;
            width: 16px;
            fill: $svg-fill-tertiary;
          }
          &:hover {
            svg {
              fill: $main-color;
            }
          }
        }
        .ais-stats {
          display: flex;
          width: 100%;
        }
      }
      &--result {
        padding: 16px;
        height: 64px;
        width: 25%;
        display: flex;
        justify-content: center;
        cursor: default;
        border-radius: 4px;
        .image-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 100%;
          img {
            max-width: 100%;
            max-height: 100%;
          }
        }
        .name {
          padding: 0 16px;
          display: flex;
          text-align: center;
          justify-content: center;
          span {
            width: calc(100% - 32px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        &:hover {
          cursor: pointer;
          box-shadow: 0px 2px 7px 0px rgba(6, 26, 70, 0.17);
        }
      }
    }
    &__vehicles {
      padding: 26px 32px 0 32px;
      display: flex;
      flex-wrap: wrap;
      .ais-index {
        width: 100%;
      }
      .ais-results {
        display: flex;
        flex-wrap: wrap;
      }
      &--stats {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        width: 100%;
        .title {
          font-family: $montserrat-font;
          color: $main-dark;
          font-size: 20px;
          font-weight: 500;
        }
        .total {
          margin-left: 16px;
          font-family: $montserrat-font;
          color: $main-grey;
          font-weight: 400;
          font-size: 20px;
        }
        .link {
          margin-left: 24px;
          display: flex;
          align-items: center;
          svg {
            margin-left: 8px;
            width: 16px;
            fill: $svg-fill-tertiary;
          }
          &:hover {
            svg {
              fill: $main-color;
            }
          }
        }
        .ais-stats {
          display: flex;
          width: 100%;
        }
      }
      &--result {
        width: 50%;
        height: 24px;
        span {
          margin-left: 8px;
        }
      }
    }
  }
}

.modal-mask {
  position: fixed;
  overflow-y: scroll;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  padding-right: 16px;
}

.modal-container {
  width: 736px;
  height: 100%;
  margin: 56px auto;
  transition: all 0.3s ease;
}

.modal-body {
  padding: 0;
}

.modal-footer {
  border-top: none;
}

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

@media (min-width: $sm) and (max-width: $md) {
  .modal-container {
    width: 100%;
  }
  .modal-wrapper {
    margin-left: 15px;
  }
  .modal-search {
    &--header {
      .input-wrap {
        &--close {
          top: -32px;
          right: 0;
        }
      }
    }
  }
}

@media (min-width: $sm) and (max-width: 780px) {
  .modal-search {
    &--body {
      &__product {
        &--result {
          height: 100%;
          flex-wrap: wrap;
          .flex-item {
            &:last-child {
              margin-left: calc(76px + 16px);
              width: 100%;
            }
          }
        }
      }
      &__categories {
        &--result {
          width: 50%;
        }
      }
      &__dealers {
        &--result {
          width: 33.3%;
        }
      }
      &__vehicles {
        &--result {
          width: 100%;
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .modal-container {
    width: 100%;
  }
  .modal-wrapper {
    margin-left: 15px;
  }
  .modal-search {
    margin: 47px auto;
    &--header {
      .input-wrap {
        input {
          width: calc(100% - 40px);
        }
        &--close {
          top: -32px;
          right: 0;
        }
        &--icon {
          width: 40px;
        }
      }
    }
    &--body {
      &__product {
        &--result {
          height: 100%;
          flex-wrap: wrap;
          .image-wrap {
            flex: 0 0 76px;
          }
          .info {
            .item {
              line-height: 16px;
            }
          }
          .info-name {
            font-size: 12px;
          }
          .flex-item {
            &:last-child {
              margin-left: calc(76px + 16px);
              width: 100%;
            }
          }
        }
      }
      &__categories {
        &--result {
          width: 100%;
        }
      }
      &__dealers {
        &--result {
          width: 50%;
        }
      }
      &__vehicles {
        &--result {
          width: 100%;
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .modal-search {
    &--body {
      &__product {
        .link {
          display: none;
        }
        &--result {
          padding: 4px 20px;
        }
      }
      &__categories {
        .link {
          display: none;
        }
      }
      &__dealers {
        .link {
          display: none;
        }
      }
      &__vehicles {
        &--result {
          height: 100%;
          line-height: 16px;
          span {
            margin-left: 0;
          }
        }
        .link {
          display: none;
        }
      }
      .responsive-link {
        width: 100%;
        margin-top: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $main-color;
          border-bottom: 1px solid transparent;
        }
        svg {
          margin-left: 8px;
          width: 16px;
          fill: $svg-fill-tertiary;
        }
        &:hover {
          svg {
            fill: $main-color;
          }
          span {
            border-bottom: 1px dashed;
          }
        }
      }
    }
  }
  .modal-search--body__vehicles--result
    + .modal-search--body__vehicles--result {
    margin-top: 16px;
  }
}
</style>
