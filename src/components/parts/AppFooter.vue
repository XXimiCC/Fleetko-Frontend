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
              <img class="logo-img" src="~@/assets/logo.svg"  alt="Fleetko"/>
            </router-link>
          </div>

          <div class="footer__sitemap col-xl-3 col-lg-3 col-sm-12">
            <div class="footer__sitemap--title" @click="toggleSiteMap">
              <h4>Customer Service</h4>
              <div class="toggle-caret" :class="{ 'toggle-caret--close': !openSiteMap }">
                <svg-chevron></svg-chevron>
              </div>
            </div>

            <ul v-if="openSiteMap">
              <li>
                <router-link class="link-tertiary sm-link" :to="{ name: 'home' }">Return Policy</router-link>
              </li>
              <li>
                <router-link class="link-tertiary sm-link" :to="{ name: 'termsOfUse' }">Terms of Service</router-link>
              </li>
              <li>
                <router-link class="link-tertiary sm-link" :to="{ name: 'privacyPolicy' }">Privacy Policy</router-link>
              </li>
              <li>
                <router-link class="link-tertiary sm-link" :to="{ name: 'contactUs' }">Contact Us</router-link>
              </li>
              <li>
                <router-link class="link-tertiary sm-link" :to="{ name: 'location', params: { id: 1 } }">Locations</router-link>
              </li>
            </ul>
          </div>

          <div class="footer__sections col-xl-2 col-lg-2 col-sm-12">
            <div class="footer__sections--title" @click="toggleSections">
              <h4>Sections</h4>
              <div
                class="toggle-caret"
                :class="{ 'toggle-caret--close': !openSections }"
              >
                <svg-chevron></svg-chevron>
              </div>
            </div>
            <ul v-if="openSections">
              <li v-for="section in getSections" itemscope itemtype="http://www.schema.org/SiteNavigationElement">
                <router-link class="link-tertiary sm-link"
                             itemprop="url"
                             :to="{ name: 'section', params: { slug: section.slug } }">
                  <span itemprop="name">{{ section.name }}</span>
                </router-link>
              </li>
            </ul>
          </div>

          <div class="footer__socials col-xl-2 col-lg-2 col-sm-12">
            <div class="footer__socials--title"><h4>Follow Us</h4></div>
            <ul class="footer__socials--icons">
              <li><router-link :to="{ name: 'home' }" class="link-tertiary sm-link">Facebook</router-link></li>
              <li><router-link :to="{ name: 'home' }" class="link-tertiary sm-link">Instagram</router-link></li>
            </ul>
          </div>

          <div class="footer__contact col-xl-3 col-lg-3 col-sm-12">
            <div class="footer__contact--title"><h4>We Gladly Accept</h4></div>
            <div class="footer__contact--pay">
              <svg-visa></svg-visa>
              <svg-master-card></svg-master-card>
              <svg-pay-pal></svg-pay-pal>
              <svg-am-exp></svg-am-exp>
            </div>
            <div class="footer__contact--delivery">
              <div class="footer__contact--title"><h4>Delivery</h4></div>
              <div class="carriers">
                <svg-postal-service></svg-postal-service>
                <svg-fedex width="64px"></svg-fedex>
                <svg-ups width="38px"></svg-ups>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <p>© 2015 - 2017 • www.truckandshop.com • Truck & Shop Trucks Spare Parts and Services</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app-footer',
  data () {
    return {
      openSiteMap: true,
      openSections: true
    }
  },
  computed: {
    ...mapGetters(['getSections'])
  },
  methods: {
    scrollToTop () {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    toggleSiteMap () {
      if (this.$mq !== 'xl' && this.$mq !== 'lg') { this.openSiteMap = !this.openSiteMap }
    },
    toggleSections () {
      if (this.$mq !== 'xl' && this.$mq !== 'lg') { this.openSections = !this.openSections }
    }
  }
}
</script>

<style lang="scss" scoped>
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
      h4 {
        margin-bottom: 24px;
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
      h4 {
        margin-bottom: 24px;
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
      h4 {
        margin-bottom: 24px;
        color: $main-dark;
      }
    }
    &--pay {
      height: 32px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      margin-bottom: 36px;
      svg + svg {
        margin-left: 12px;
      }
    }
    &--delivery {
      .carriers {
        height: 38px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        margin-top: -4px;
        svg + svg {
          margin-left: 12px;
        }
      }
    }
  }
  &__socials {
    &--title {
      h4 {
        margin-bottom: 24px;
        color: $main-dark;
      }
    }
    &--icons {
      padding-left: 0;
      list-style: none;
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
        h4 {
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
        h4 {
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
      &--pay, .carriers {
        justify-content: flex-start;
      }
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
