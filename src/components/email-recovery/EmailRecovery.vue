<template>
  <div class="full-height">
    <div class="recovery">
      <div class="recovery__header">
        <div class="container">
          <div class="item">
            <router-link :to="{ name: 'home' }" tag="div">
              <img class="logo-img" src="~@/assets/logo.png" />
            </router-link>
          </div>
          <div class="item recovery__header--title">
            <span class="header-phone">800-505-3274</span><span>Support</span>
          </div>
        </div>
      </div>
      <div class="recovery__body">
        <div v-if="success" class="recovery__body--title">
          <h2>
            The email has been <br />
            successfully recovered!
          </h2>
        </div>
        <div
          class="form-wrap"
          :class="{ 'form-wrap--align-vertical': !success }"
        >
          <div v-if="success" class="recovery__body--form">
            <div class="recovery__checked-wrap"><svg-check></svg-check></div>
            <h3 class="success-title success-title--big">
              The email has been recovered.
              <span class="bold">Your old password is no longer valid.</span>
              Please click on the button below to create new password.
            </h3>
            <div class="success-button">
              <button @click="onCreatePassword" class="button-prime">
                Create New Password
              </button>
            </div>
          </div>

          <div v-if="!success" class="recovery__body--form">
            <div class="recovery__checked-wrap recovery__error-wrap">
              <svg-close></svg-close>
            </div>
            <h3 class="success-title">The email recovery link is invalid!</h3>
            <div class="success-button">
              <router-link :to="{ name: 'home' }">
                <button class="button-prime left-icon">
                  <svg-home></svg-home>
                  <span>Go to the homepage</span>
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="push"></div>
    </div>
    <app-footer-empty class="recovery__footer"></app-footer-empty>
  </div>
</template>
<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import AppFooterEmpty from '../parts/AppFooterEmpty'

Vue.use(VeeValidate)

export default {
  name: 'EmailRecovery',
  data () {
    return {
      email: '',
      token: '',
      success: false
    }
  },
  methods: {
    onCreatePassword () {
      this.$router.push({
        name: 'resetPassword',
        query: { email: this.email, token: this.token }
      })
    }
  },
  components: {
    AppFooterEmpty
  },
  created () {
    this.email = this.$route.query.email
    this.token = this.$route.query.token
    this.success = this.$route.query.result === 'success'
  }
}
</script>
<style lang="scss" scoped>
.error-message-input {
  display: flex;
  line-height: 16px;
  position: relative;
  bottom: 0;
}

html,
body {
  height: 100% !important;
}

.recovery {
  position: relative;
  min-height: 100%;
  background: #f2f5fc;
  margin-bottom: -80px;
  &__checked-wrap {
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 32px;
    width: 64px;
    height: 64px;
    background: #bff1d4;
    display: flex;
    align-items: center;
    border-radius: 100%;
    justify-content: center;
    svg {
      width: 34px;
      height: 28px;
      fill: #00c853;
    }
  }
  &__error-wrap {
    background: #feeceb;
    svg {
      fill: $danger;
    }
  }
  &__error-text {
    margin: 4px 0 5px 0;
  }
  .push {
    height: 80px;
  }
  &__footer {
    position: relative;
    height: 80px;
  }
  &__header {
    height: 88px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    box-shadow: 0 0 9.5px 0.5px rgba(102, 102, 102, 0.2);
    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    img {
      cursor: pointer;
      height: 30px;
      width: 125px;
    }
    &--title {
      span {
        font-family: $sours-sans-p-font;
        color: $main-grey;
      }
      span + span {
        margin-left: 32px;
      }
    }
  }
  &__body {
    padding-bottom: 32px;
    position: relative;

    .form-wrap {
      display: flex;
      justify-content: center;

      &--align-vertical {
        margin-top: 210px;
      }
    }
    &--title {
      padding-top: 80px;
      padding-bottom: 40px;
      width: 100%;
      font-family: $montserrat-font;
      font-size: 34px;
      font-weight: 500;
      text-align: center;
      line-height: 1;
      color: $main-dark;
      h1 {
        margin-bottom: 0;
      }
    }
    &--form {
      width: 384px;
      padding: 64px 32px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 7px 0 rgba(6, 26, 70, 0.17);
      &--key-icon {
        margin-right: auto;
        margin-left: auto;
        width: 64px;
        height: 64px;
        background: #c4d5fa;
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        svg {
          width: 32px;
          height: 100%;
          fill: $main-color;
        }
      }
      h3 {
        text-align: center;
        margin-bottom: 16px;
        color: $main-dark;
      }
      &--item {
        margin-bottom: 25px;
        &.validation-margin {
          margin-bottom: 0;
        }
        p {
          text-align: center;
          margin-bottom: 16px;
        }
        input {
          height: 40px;
          width: 100%;
        }
        &--submit {
          display: flex;
          justify-content: center;
          margin-bottom: 0;
          button {
            width: 122px;
          }
        }
      }
      .input-wrap {
        position: relative;
        .show-hide {
          position: absolute;
          top: 9px;
          right: 17px;
          height: 24px;
          width: 24px;
          cursor: pointer;
          svg {
            width: 24px;
            fill: $svg-fill-tertiary;
          }
        }
      }
      .checked {
        margin-bottom: 32px;
        margin-left: calc(50% - (64px / 2));
        width: 64px;
        height: 64px;
        fill: $success;
      }
      .success-title {
        margin-bottom: 32px;
        text-align: center;
        &--big {
          font: 400 16px/1.3 $montserrat-font;
          .bold {
            font-weight: 500;
          }
        }
      }
      .success-button {
        display: flex;
        justify-content: center;
        button {
          width: 234px;
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .recovery {
    .error-message-input {
      bottom: 0;
      position: relative;
    }
    &__header {
      height: 64px;
      &--title {
        span {
          color: $main-grey;
        }
      }
      .header-phone {
        display: none;
      }
    }
    &__body {
      &--title {
        padding: 32px 0;
        h2 {
          margin-bottom: 0;
          font-size: 24px;
          font-weight: 500;
          text-transform: capitalize;
        }
      }
      .form-wrap {
        &--align-vertical {
          margin-top: 120px;
        }
      }
      &--form {
        padding: 32px 16px;
        width: 288px;
        &--item {
          margin-bottom: 24px;
        }
        &--key-icon {
          display: none;
          svg {
            width: 48px;
            height: 48px;
          }
        }
        .checked {
          width: 48px;
          height: 48px;
        }
      }
    }
  }
}
</style>
