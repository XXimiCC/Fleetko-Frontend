<template>
  <div class="footer-wrap">
    <div class="footer__back-top" @click="scrollToTop" v-if="$mq !== 'xl'">
      <svg-chevron></svg-chevron>
    </div>

    <div class="container">
      <div class="footer">
        <div class="row">
          <div class="footer__logo col-xl-2 col-lg-2 col-sm-12">
            <router-link :to="{ name: 'home' }">
              <img class="logo-img" src="~@/assets/logo.svg" />
            </router-link>
          </div>

          <div class="footer__sitemap col-xl-2 col-lg-2 col-sm-12">
            <div class="footer__sitemap--title" @click="toggleSitemap">
              <h3>Site map</h3>
              <div
                class="toggle-caret"
                :class="{ 'toggle-caret--close': !openSitemap }"
              >
                <svg-chevron></svg-chevron>
              </div>
            </div>

            <ul v-if="openSitemap">
              <li>
                <router-link class="link-tertiary" :to="{ name: 'home' }"
                  >Help Center</router-link
                >
              </li>
              <li>
                <router-link class="link-tertiary" :to="{ name: 'home' }"
                  >Track My Order</router-link
                >
              </li>
              <li>
                <router-link class="link-tertiary" :to="{ name: 'home' }"
                  >Return Policy</router-link
                >
              </li>
              <li>
                <router-link class="link-tertiary" :to="{ name: 'termsOfUse' }"
                  >Terms of Service</router-link
                >
              </li>
              <li>
                <router-link
                  class="link-tertiary"
                  :to="{ name: 'privacyPolicy' }"
                  >Privacy Policy</router-link
                >
              </li>
              <li>
                <router-link class="link-tertiary" :to="{ name: 'contactUs' }"
                  >Contact Us</router-link
                >
              </li>
              <li>
                <router-link class="link-tertiary" :to="{ name: 'home' }"
                  >About Us</router-link
                >
              </li>
              <li>
                <router-link class="link-tertiary" :to="{ name: 'purchases' }"
                  >Customer Reviews</router-link
                >
              </li>
              <li>
                <router-link class="link-tertiary" :to="{ name: 'home' }"
                  >Coupon Codes</router-link
                >
              </li>
              <li>
                <router-link
                  class="link-tertiary"
                  :to="{ name: 'location', params: { id: 1 } }"
                  >Locations</router-link
                >
              </li>
            </ul>
          </div>

          <div class="footer__sections col-xl-2 col-lg-2 col-sm-12">
            <div class="footer__sections--title" @click="toggleSections">
              <h3>Sections</h3>
              <div
                class="toggle-caret"
                :class="{ 'toggle-caret--close': !openSections }"
              >
                <svg-chevron></svg-chevron>
              </div>
            </div>
            <ul v-if="openSections">
              <li
                v-for="section in getSections"
                itemscope
                itemtype="http://www.schema.org/SiteNavigationElement"
              >
                <router-link
                  class="link-tertiary"
                  itemprop="url"
                  :to="{ name: 'section', params: { slug: section.slug } }"
                >
                  <span itemprop="name">{{ section.name }}</span>
                </router-link>
              </li>
            </ul>
          </div>

          <div class="footer__socials col-xl-2 col-lg-2 col-sm-12">
            <div class="footer__socials--title"><h3>Follow Us</h3></div>
            <ul class="footer__socials--icons">
              <li>
                <router-link
                  :to="{ name: 'home' }"
                  class="footer__socials--google"
                >
                  Google Plus
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'home' }"
                  class="footer__socials--facebook"
                >
                  Facebook
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'home' }"
                  class="footer__socials--linkedin"
                >
                  Linkedin
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'home' }"
                  class="footer__socials--instagram"
                >
                  Instagram
                </router-link>
              </li>
            </ul>
          </div>

          <div class="footer__contact col-xl-3 col-lg-3 col-sm-12">
            <div class="footer__contact--title"><h3>Contact</h3></div>
            <div class="footer__contact--row">
              <div class="icon-wrap"><svg-map-pointer></svg-map-pointer></div>
              <div
                class="list-wrap"
                itemprop="address"
                itemscope
                itemtype="http://schema.org/PostalAddress"
              >
                <ul>
                  <li itemprop="streetAddress">
                    701 South Gifford Avenue #109
                  </li>
                  <li itemprop="addressLocality">
                    San Bernardino, California
                    <span itemprop="postalCode">92408</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="footer__contact--row">
              <div class="icon-wrap"><svg-phone></svg-phone></div>
              <div class="list-wrap">
                <ul>
                  <li>
                    <span class="label">Toll Free:</span>
                    <span class="value">(828) 477-4083</span>
                  </li>
                  <li>
                    <span class="label">International:</span>
                    <span itemprop="telephone" class="value"
                      >1.609.964.1983</span
                    >
                  </li>
                  <li>
                    <span class="label">Fax:</span>
                    <span class="value">1.609.964.1983</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="footer__contact--row">
              <div class="icon-wrap">
                <svg-envelope-fill></svg-envelope-fill>
              </div>
              <div class="list-wrap">
                <ul>
                  <li itemprop="email">
                    <span class="label">Email:</span>
                    <span class="value">sales@fleetzoneinc.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <p>
        © 2015 - 2017 • www.truckandshop.com • Truck & Shop Trucks Spare Parts
        and Services
      </p>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'

export default {
  name: 'app-footer',
  data () {
    return {
      openSitemap: true,
      openSections: true
    }
  },
  methods: {
    scrollToTop () {
      $('html, body').animate({ scrollTop: 0 }, 500)
    },
    toggleSitemap () {
      if (this.$mq !== 'xl' && this.$mq !== 'lg') { this.openSitemap = !this.openSitemap }
    },
    toggleSections () {
      if (this.$mq !== 'xl' && this.$mq !== 'lg') { this.openSections = !this.openSections }
    }
  },
  computed: {
    ...mapGetters(['getSections'])
  }
}
</script>

<style lang="scss" scoped="">
.footer-wrap {
  margin-top: 128px;
  padding-top: 64px;
  position: relative;
  box-shadow: 0px -3px 9.5px 0px rgba(102, 102, 102, 0.2);
  background: white;
}

.footer {
  padding-bottom: 135px;
  &__back-top {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: calc(50% - 56px);
    top: -56px;
    width: 112px;
    height: 56px;
    background: $main-color;
    border-top-left-radius: 56px;
    border-top-right-radius: 56px;
    svg {
      transform: rotate(180deg);
      width: 32px;
      fill: white;
    }
  }
  &__bottom {
    padding: 16px 0;
    border-top: 1px solid #cfd8dc;
    p {
      margin-bottom: 0;
      font-family: $sours-sans-p-font;
      font-size: 12px;
      color: #989898;
      text-align: center;
    }
  }
  &__logo {
    img {
      height: 30px;
      width: 107px;
    }
  }
  &__sitemap {
    &--title {
      h3 {
        margin-bottom: 28px;
        color: $main-dark;
      }
      .toggle-caret {
        display: none;
      }
    }
    ul {
      padding-left: 0;
      list-style: none;
      margin-bottom: 0;
      li {
        line-height: 1;
      }
      li + li {
        margin-top: 13px;
      }
    }
  }
  &__sections {
    &--title {
      h3 {
        margin-bottom: 28px;
        color: $main-dark;
      }
      .toggle-caret {
        display: none;
      }
    }
    ul {
      padding-left: 0;
      list-style: none;
      margin-bottom: 0;
      li {
        line-height: 1;
      }
      li + li {
        margin-top: 13px;
      }
    }
  }
  &__contact {
    &--title {
      h3 {
        margin-bottom: 28px;
        color: $main-dark;
      }
    }
    &--row {
      display: flex;
      .icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px;
        width: 32px;
        height: 32px;
        background: #d0defb;
        border-radius: 100%;
        svg {
          fill: $main-color;
          height: 18px;
        }
      }
      .list-wrap {
        margin-left: 16px;
        ul {
          padding-left: 0;
          list-style: none;
          margin-bottom: 0;
          li {
            line-height: 19px;
            color: $dark-grey;
            font-family: $sours-sans-p-font;
            font-size: 14px;
            .label {
              font-weight: 600;
              color: $main-dark;
            }
          }
          li + li {
            margin-top: 6px;
          }
        }
      }
    }
    .footer__contact--row + .footer__contact--row {
      margin-top: 32px;
    }
  }
  &__socials {
    &--title {
      h3 {
        margin-bottom: 28px;
        color: $main-dark;
      }
    }
    &--icons {
      padding-left: 0;
      list-style: none;
      a {
        font-size: 12px;
        font-weight: 500;
        font-family: $montserrat-font;
        text-transform: uppercase;
      }
    }
    &--google {
      color: #f34a38;
    }
    &--facebook {
      color: #3b5998;
    }
    &--linkedin {
      color: #00a0dc;
    }
    &--instagram {
      color: #421ccd;
    }
  }
}

.facebook-iq {
  fill: #3b5998;
}

.google-iq {
  fill: #f34a38;
}

.linkedin-iq {
  fill: #00a0dc;
}

.instagram-iq {
  fill: #dc8f3f;
}

@media (min-width: $xs) and (max-width: $md) {
  .footer-wrap {
    padding-top: 16px;
  }
  .footer {
    padding-bottom: 40px;
    &__sitemap {
      margin-top: 36px;
      &--title {
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        h3 {
          margin-bottom: 0;
        }
        .toggle-caret {
          display: flex;
          cursor: pointer;
          transform: rotate(180deg);
          transition: all 0.5s;
          svg {
            width: 21px;
            height: 21px;
            fill: $svg-fill-tertiary;
          }
          &--close {
            transform: rotate(0deg);
          }
        }
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 0;
        transition: all 0.5s;
        li {
          margin-bottom: 13px;
          flex: 0 0 25%;
          line-height: 1;
        }
        li + li {
          margin-top: 0;
        }
      }
    }
    &__sections {
      margin-top: 27px;
      &--title {
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        h3 {
          margin-bottom: 0;
        }
        .toggle-caret {
          display: flex;
          cursor: pointer;
          transform: rotate(180deg);
          transition: all 0.5s;
          svg {
            width: 21px;
            height: 21px;
            fill: $svg-fill-tertiary;
          }
          &--close {
            transform: rotate(0deg);
          }
        }
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 0;
        li {
          margin-bottom: 13px;
          flex: 0 0 25%;
          line-height: 1;
        }
        li + li {
          margin-top: 0;
        }
      }
    }
    &__contact {
      margin-top: 27px;
    }
    &__socials {
      margin-top: 40px;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .footer {
    &__sitemap {
      ul {
        li {
          margin-bottom: 13px;
          flex: 0 0 50%;
          line-height: 1;
        }
      }
    }
    &__sections {
      margin-top: 27px;
      ul {
        li {
          margin-bottom: 13px;
          flex: 0 0 50%;
          line-height: 1;
        }
      }
    }
  }
}
</style>
