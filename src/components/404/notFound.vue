<template>
  <div>
    <div class="navbar">
      <app-header v-if="$mq === 'xl' || $mq === 'lg'"></app-header>
      <app-header-responsive
        v-if="$mq === 'md' || $mq === 'sm' || $mq === 'xs'"
      ></app-header-responsive>
    </div>
    <div class="not-found">
      <div class="container">
        <div class="row">
          <div class="col-md-4 not-found__image-wrap">
            <img :src="imageSrc('not-found.svg')" alt="" />
          </div>
          <div class="col-md-7 ml-auto not-found__main">
            <h2 class="title">
              Sorry, we can't find that page or something has gone wrong...
            </h2>
            <h4>
              You can not visit this page because of these possible reasons:
            </h4>
            <ul class="not-found__main--list">
              <li>Most likely URL was written with an error</li>
              <li>The page you are looking for has been moved or renamed</li>
              <li>This page no longer exists</li>
            </ul>
            <div class="not-found__buttons">
              <router-link :to="{ name: 'home' }">
                <button class="button-prime left-icon">
                  <svg-home></svg-home>
                  <span>Go to the homepage</span>
                </button>
              </router-link>
              <span class="not-found__buttons--separator">OR</span>
              <button @click="goBack()" class="button-second">Go Back</button>
            </div>
            <div class="not-found__contact">
              <p>
                If you have any questions, use our
                <router-link :to="{ name: 'contactUs' }" tag="a"
                  >Contact form</router-link
                >
                and we will contact you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppHeader from '@/components/parts/AppHeader'
import AppHeaderResponsive from '@/components/parts/AppHeaderResponsive'
import AppFooter from '@/components/parts/AppFooter'
import utils from '@/mixins/utils'
export default {
  name: 'not-found',
  mixins: [utils],
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  },
  components: {
    AppHeader,
    AppFooter,
    AppHeaderResponsive
  }
}
</script>

<style scoped lang="scss">
.navbar {
  padding: 0 !important;
  /*margin-bottom: 154px;*/
}
.not-found {
  margin-bottom: 300px;
  margin-top: 128px;
  &__image-wrap {
    img {
      width: 350px;
      height: 366px;
    }
  }
  &__main {
    h2 {
      margin-bottom: 48px;
      font-size: 24px;
      font-weight: 600;
      text-transform: uppercase;
      color: $main-dark;
      line-height: 32px;
    }
    h4 {
      margin-bottom: 26px;
    }
    &--list {
      margin-bottom: 0;
      padding-left: 0;
      list-style: none;
      li {
        padding-left: 24px;
        position: relative;
        font-size: 14px;
        line-height: 1;
        font-family: $sours-sans-p-font;
        color: $main-dark;
        &:before {
          top: 3px;
          left: 0;
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: $main-dark;
          border-radius: 100%;
        }
      }
      li + li {
        margin-top: 12px;
      }
    }
  }
  &__buttons {
    margin-top: 48px;
    display: flex;
    align-items: center;
    .button-prime {
      width: 256px;
      svg {
        width: 20px;
      }
    }
    .button-second {
      width: 256px;
      height: 40px;
    }
    &--separator {
      margin: 0 16px;
      font-family: $montserrat-font;
      font-size: 12px;
      color: $main-dark;
    }
  }
  &__contact {
    margin-top: 48px;
    p {
      margin-bottom: 0;
      color: $main-dark;
      font-family: $montserrat-font;
      font-size: 16px;
      a {
        color: $main-color;
        font-family: $montserrat-font;
        font-size: 16px;
        border-bottom: 1px dashed $main-color;
        &:hover {
          border-bottom: 1px solid transparent;
        }
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .not-found {
    margin-top: 64px;
    &__image-wrap {
      display: flex;
      justify-content: center;
      flex: 0 0 100%;
      max-width: 100%;
      img {
        width: 280px;
        height: 290px;
      }
    }
    &__main {
      padding: 0 60px;
      margin-top: 64px;
      max-width: 100%;
      flex: 0 0 100%;
    }
  }
}
@media (min-width: $xs) and (max-width: $sm) {
  .not-found {
    margin-bottom: 80px;
    margin-top: 32px;
    &__image-wrap {
      display: flex;
      justify-content: center;
      flex: 0 0 100%;
      max-width: 100%;
      img {
        width: 130px;
        height: 135px;
      }
    }
    &__main {
      margin-top: 32px;
      max-width: 100%;
      flex: 0 0 100%;
      h2 {
        margin-bottom: 24px;
        font-size: 16px;
        line-height: 21px;
      }
      &--list {
        li {
          line-height: 19px;
        }
      }
    }
    &__buttons {
      flex-wrap: wrap;
      a {
        width: 100%;
      }
      .button-normal {
        width: 100%;
      }
      .button-second {
        width: 100%;
      }
      &--separator {
        margin: 16px 0;
        width: 100%;
        text-align: center;
      }
    }
    &__contact {
      margin-top: 32px;
      p {
        font-size: 14px;
        a {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
