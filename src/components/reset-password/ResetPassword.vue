<template>
  <div class="full-height">
    <div class="reset-password">
      <div class="reset-password__header">
        <div class="container">
          <div class="item">
            <router-link :to="{ name: 'home' }" tag="div">
              <img class="logo-img" src="~@/assets/logo.png" />
            </router-link>
          </div>
          <div class="item reset-password__header--title">
            <span class="header-phone">800-505-3274</span><span>Support</span>
          </div>
        </div>
      </div>
      <div class="reset-password__body">
        <div class="reset-password__body--title"><h2>Welcome Back!</h2></div>
        <div class="form-wrap">
          <div
            v-if="success"
            @submit.prevent="submit"
            class="reset-password__body--form"
          >
            <div class="reset-password__checked-wrap">
              <svg-check></svg-check>
            </div>
            <h3 class="success-title">
              You`ve successfully changed your password!
            </h3>
            <div class="success-button">
              <button class="button-prime" @click="login">
                Proceed to my account
              </button>
            </div>
          </div>
          <form
            v-else=""
            @submit.prevent="submit"
            class="reset-password__body--form"
          >
            <div class="reset-password__body--form--key-icon">
              <svg-key-password></svg-key-password>
            </div>
            <h3>Change Password</h3>
            <div
              class="reset-password__body--form--item"
              :class="{ 'validation-margin': errors.has('password') }"
            >
              <p class="paragraph-secondary">
                You change password for the <b>{{ email }}</b> account. Don`t
                use too short and simple password
              </p>
              <div class="input-wrap" :class="{ control: true }">
                <input
                  v-validate="'required|min:6'"
                  class="input-default"
                  :class="{
                    input: true,
                    'error-border': errors.has('password')
                  }"
                  name="password"
                  ref="password"
                  id="password"
                  placeholder="Please enter a password"
                  :type="hiddenPassword ? 'password' : 'text'"
                />
                <div
                  @click="hiddenPassword = !hiddenPassword"
                  class="show-hide"
                >
                  <svg-eye-hide v-if="!hiddenPassword"></svg-eye-hide>
                  <svg-eye-show v-if="hiddenPassword"></svg-eye-show>
                </div>
                <div
                  class="reset-password__error-text"
                  v-show="errors.has('password')"
                >
                  <span class="help error-message-input is-danger">{{
                    errors.first('password')
                  }}</span>
                </div>
              </div>
            </div>
            <div class="reset-password__body--form--item">
              <div class="input-wrap" :class="{ control: true }">
                <input
                  v-validate="'required|min:6|confirmed:password'"
                  :class="{
                    input: true,
                    'error-border': errors.has('password-confirm')
                  }"
                  class="input-default"
                  data-vv-as="password"
                  name="password-confirm"
                  ref="passwordConfirm"
                  placeholder="Please confirm a password"
                  :type="hiddenConfirm ? 'password' : 'text'"
                />
                <div @click="hiddenConfirm = !hiddenConfirm" class="show-hide">
                  <svg-eye-hide v-if="!hiddenConfirm"></svg-eye-hide>
                  <svg-eye-show v-if="hiddenConfirm"></svg-eye-show>
                </div>

                <div
                  class="reset-password__error-text"
                  v-show="errors.has('password-confirm')"
                >
                  <span class="help error-message-input is-danger">{{
                    errors.first('password-confirm')
                  }}</span>
                </div>
              </div>
            </div>
            <div class="reset-password__body--form--item--submit">
              <button class="button-prime">Submit</button>
            </div>
          </form>
        </div>
      </div>
      <div class="push"></div>
    </div>
    <app-footer-empty class="reset-password__footer"></app-footer-empty>
  </div>
</template>
<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import { mapGetters } from 'vuex'
import AppFooterEmpty from '../parts/AppFooterEmpty'

Vue.use(VeeValidate)
export default {
  name: 'reset',
  data () {
    return {
      password: '',
      passwordConfirm: '',
      email: '',
      token: '',
      hiddenPassword: true,
      hiddenConfirm: true,
      switchText: 'Show',
      success: false
    }
  },
  watch: {
    hasToken (v) {
      if (v) {
      }
    }
  },
  methods: {
    validateResetPasswordToken () {
      this.$store
        .dispatch('resetPasswordValidate', {
          email: this.email,
          token: this.token
        })
        .then(
          resp => {},
          // eslint-disable-next-line
          error => {
            this.$router.push({
              name: 'not-found'
            })
          }
        )
    },
    login () {
      this.$store
        .dispatch('login', {
          email: this.email,
          password: this.password,
          grant_type: 'password',
          provider: '',
          token: this.token
        })
        .then(resp => {
          this.$store.dispatch('getAuthUser').then(resp => {
            this.$store.dispatch('mergeServerCart').then(
              resp => {},
              err => {
                // eslint-disable-next-line
                console.log(err)
              }
            )

            this.$router.push({ name: 'orderHistory' })
          })
          this.$store.dispatch('toggleLoginModal', {
            open: false,
            authGuard: false
          })
        })
    },
    submit () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$store
            .dispatch('resetPassword', {
              token: this.token,
              email: this.email,
              password: this.$refs.password.value
            })
            .then(
              response => {
                this.password = this.$refs.password.value
                this.success = true
                // eslint-disable-next-line
              },
              error => {
                // eslint-disable-next-line
                console.error(error)
              }
            )
        }
      })
    }
  },
  computed: {
    ...mapGetters({
      hasToken: 'hasToken'
    })
  },
  components: {
    AppFooterEmpty
  },
  mounted () {
    this.email = this.$route.query.email
    this.token = this.$route.query.token

    this.validateResetPasswordToken()
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
.reset-password {
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
    box-shadow: 0px 0px 9.5px 0.5px rgba(102, 102, 102, 0.2);
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
        font-size: 14px;
      }
      span + span {
        margin-left: 32px;
      }
    }
  }
  &__body {
    padding-bottom: 32px;
    .form-wrap {
      display: flex;
      justify-content: center;
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
      box-shadow: 0px 2px 7px 0px rgba(6, 26, 70, 0.17);
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
  .reset-password {
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
@media (min-width: $xs) and (max-width: $xssm) {
  .reset-password {
  }
}
</style>
