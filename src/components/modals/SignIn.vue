<template>
  <div class="relative">
    <loader
      :modalLoader="true"
      :background="'white'"
      v-if="preloader"
      class="modal__preloader--cube"
    ></loader>

    <div class="modal-header">
      <slot>
        <div v-if="!authGuardModal" @click="closeModal">
          <svg-close class="close-modal"></svg-close>
        </div>
      </slot>
    </div>
    <div class="modal-header--title">{{ modalName }}</div>
    <div class="modal-header--error" v-if="socialError">
      <span class="help error-message-input is-danger">{{ socialError }}</span>
    </div>
    <!-- modal header ends -->
    <div class="modal-body">
      <!-- Here Form -->
      <login-form
        @socialErrorHide="socialError = null"
        v-if="!registration"
      ></login-form>
      <registration
        @socialErrorHide="socialError = null"
        v-if="registration"
      ></registration>
      <div class="modal-body__separator"><p>or</p></div>
      <div class="modal-body__alternative">
        <div class="modal-body__alternative--item social-wrap">
          <button @click="loginFB" class="facebook-login btn">
            <svg-facebook></svg-facebook>
            <span>Facebook</span>
          </button>
        </div>
        <div class="modal-body__alternative--item social-wrap">
          <button id="customBtn" class="google-login  btn">
            <svg-google></svg-google>
            <span>Google</span>
          </button>
        </div>
        <div class="user-agreement">
          <span class="user-agreement__text"
            >By creating an account, you agree to
          </span>
          <router-link :target="'_blank'" :to="{ name: 'termsOfUse' }"
            ><span class="user-agreement--link link-quaternary sm-link"
              >Fleetko's Terms of Service</span
            ></router-link
          >
          <span>and</span>
          <router-link :target="'_blank'" :to="{ name: 'privacyPolicy' }"
            ><span class="user-agreement--link link-quaternary sm-link"
              >Privacy Policy</span
            ></router-link
          >
        </div>
      </div>
    </div>
    <div class="modal-actions">
      <div class="modal-actions--item">
        <button @click.stop="registration = true" v-if="!registration">
          <span class="link-quaternary lg-link">Sign Up</span>
        </button>
        <button @click.stop="registration = false" v-if="registration">
          <span class="link-quaternary lg-link">Sign In</span>
        </button>
      </div>
      <div class="modal-actions--item">
        <button @click.stop="$emit('passwordReset')">
          <span class="link-quaternary lg-link">Forgot password</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import VeeValidate from 'vee-validate'
import { GoogleApi } from '@/mixins/GoogleApi'
import EnterListener from '@/mixins/EnterListener'
import toastr from 'toastr'
import LoginForm from './sign-in-parts/LoginForm'
import Registration from './sign-in-parts/Registration'
import Loader from '@/components/common-components/Loader'
import { EventBus } from '../../event-bus'

Vue.use(VeeValidate)

export default {
  name: 'modal',
  data () {
    return {
      socialError: null,
      fbToken: null,
      fbStatus: null,
      googleStatus: null,
      googleToken: null,
      registration: this.registrationView === 'registration',
      animateValidation: false,
      loginServerValid: true,
      registrationValid: true,
      hiddenPassword: true
    }
  },
  props: ['registrationView'],
  mixins: [GoogleApi, EnterListener],
  watch: {
    $route (to, from) {
      this.$emit('close')
    },
    registration (v) {
      let validator = this.$validator

      validator.fileds = {}
      this.loginServerValid = true
      this.hiddenPassword = true

      validator.reset()

      this.socialError = null

      v ? this.$emit('large-container') : this.$emit('small-container')
    },
    hasToken (tokenObject) {
      /**
       * Должна быть проверка что не null так как на не успешном логине не стоит закрывать модалку а показывать валидацию
       */
      if (tokenObject) this.$emit('close')

      this.$store.dispatch('getAuthUser').then(
        resp => {
          this.$store.dispatch('initTokenHeader')

          this.$store.dispatch('mergeServerCart').then(
            resp => {},
            err => {
              console.log(err)
            }
          )

          EventBus.$emit('successLogin', true)

          if (!this.userInfo.email_confirmed) {
            this.$store.dispatch('createSystemNotification', {
              type: 'info',
              message:
                'Thank you for visiting us and being our user! Please confirm your mail address.'
            })
          }
        },
        error => {
          console.log(error)
        }
      )
    }
  },
  methods: {
    closeModal () {
      this.$emit('close')
      EventBus.$emit('loginFailure', true)
    },
    login (grant_type, provider, token, $event) {
      if ($event) $event.preventDefault()

      this.$store
        .dispatch('login', {
          email: this.email,
          password: this.password,
          grant_type: grant_type,
          provider: provider ? provider : '',
          token: token ? token : ''
        })
        .then(
          resp => {},
          error => {
            if (error.status === 422) {
              this.socialError =
                'Please, ensure that your account has verified email address in order to sign in via third-party provider.'
            }
          }
        )
    },
    logout () {
      this.$store.dispatch('logout')
      this.closeModal()
    },
    loginFB () {
      let self = this

      // eslint-disable-next-line
      FB.login(
        response => {
          if (response && response.authResponse) { self.fbToken = response.authResponse.accessToken }

          if (response.status === 'connected') {
            self.login('social', 'facebook', self.fbToken)
          } else {
            self.fbStatus = 'Fail  login'
          }
        },
        { scope: 'public_profile,email' }
      )
    },
    loginGoogle (element, auth2) {
      let self = this

      auth2.attachClickHandler(
        element,
        {},
        googleUser => {
          self.googleToken = googleUser.getAuthResponse().access_token
          self.login('social', 'google', self.googleToken)
        },
        error => {
          if (error.error !== 'popup_closed_by_user') {
            toastr.error(error.error, '', this.setToastr('error'))
          }
        }
      )
    }
  },
  computed: {
    ...mapGetters({
      hasToken: 'hasToken',
      preloader: 'preloader',
      authGuardModal: 'authGuardModal',
      userInfo: 'userInfo',
      tempEmailVerification: 'tempEmailVerification'
    }),
    modalName () {
      return this.registration ? 'Sign Up' : 'Sign In'
    }
  },
  components: {
    LoginForm,
    Registration,
    Loader
  },
  mounted () {
    this.googleApiInit('customBtn')
  }
}
</script>

<style lang="scss" scoped>
.error-message-input {
  margin: 24px 32px 0 32px;
  display: flex;
  line-height: 16px;
  position: relative;
  bottom: 0;
}
.relative {
  position: relative;
}
.animate-validation {
  opacity: 0;
}
.error-message-input {
  opacity: 1;
  transition: opacity 1s;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active до версии 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 384px;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header {
  padding: 15px 15px 0 0;
  display: flex;
  flex-direction: row-reverse;
  border-bottom: none;
  svg {
    width: 18px;
    height: 18px;
    fill: $svg-fill-tertiary;
    cursor: pointer;
  }
  &--title {
    margin-top: -4px;
    color: $main-dark;
    font-family: $montserrat-font;
    font-weight: 500;
    font-size: 34px;
    text-align: center;
    line-height: 1;
  }
}

.modal-actions {
  position: relative;
  display: flex;
  margin-top: 24px;
  &:before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: $interface-decoration-color;
    content: '';
  }
  &:after {
    position: absolute;
    left: calc(50% - 1px);
    width: 1px;
    height: 100%;
    top: 0;
    background: $interface-decoration-color;
    content: '';
  }
  &--item {
    width: 50%;
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 64px;
      border: none;
      background: transparent;
      cursor: pointer;
    }
  }
}

.modal-footer {
  border-top: none;
}

.modal-body {
  margin: 24px 32px 0 32px;
  padding: 0;
  &__alternative {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    &--item {
      width: 152px;
      button {
        &:focus {
          outline: none;
        }
      }
    }
    .social-wrap + .social-wrap {
      margin-left: 16px;
    }
    .facebook-login {
      justify-content: center;
      display: flex;
      width: 100%;
      height: 40px;
      background-color: #4f6fa8;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      svg {
        margin-right: 5px;
        height: 15px;
        width: 15px;
        fill: white;
      }
      span {
        text-transform: uppercase;
        font-size: 14px;
        font-family: $sours-sans-p-font;
        font-weight: 600;
        line-height: 1.2;
      }
    }
    .google-login {
      justify-content: center;
      display: flex;
      width: 100%;
      height: 40px;
      background-color: #d34836;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      svg {
        margin-right: 5px;
        height: 18px;
        width: 18px;
        fill: white;
      }
      span {
        text-transform: uppercase;
        font-size: 14px;
        font-family: $sours-sans-p-font;
        font-weight: 600;
        line-height: 1.2;
      }
    }
    .user-agreement {
      margin-top: 16px;
      width: 100%;
      text-align: center;
      span {
        font-family: $sours-sans-p-font;
        font-size: 12px;
      }
      &__text {
        line-height: 18px;
        color: $main-dark;
      }
      &--link {
        color: $main-color;
        line-height: 18px;
      }
    }
  }
  &__separator {
    margin-bottom: 16px;
    text-align: center;
    p {
      font-size: 16px;
      font-family: $montserrat-font;
      font-weight: 500;
      color: $main-dark;
      text-transform: uppercase;
    }
  }
}

/*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */

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

@media (min-width: $xs) and (max-width: $sm) {
  .modal-container {
    width: 288px;
  }
  .modal-header {
    &--title {
      font-size: 20px;
      font-weight: 500;
      font-family: $montserrat-font;
      color: $main-dark;
    }
  }
  .error-message-input {
    margin: 16px 16px 0 16px;
  }
  .modal-body {
    margin: 16px 16px 0 16px;
    &__separator {
      display: none;
    }
    &__alternative {
      &--item {
        width: 120px;
        button {
          &:focus {
            outline: none;
          }
        }
      }
      .user-agreement {
        line-height: 1;
        span {
          line-height: 1;
        }
      }
    }
  }
  .modal-actions {
    &--item {
      button {
        height: 40px;
      }
    }
  }
}
</style>
