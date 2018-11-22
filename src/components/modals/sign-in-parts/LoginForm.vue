<template>
  <div class="modal-body__login">
    <form>
      <div class="modal-body__login--item"
           :class="{ 'validation-margin': errors.has('email') && !animateValidation }">
        <div class="input-wrap">
          <input v-validate="'required|email'"
                 :ref="'emailInput'"
                 :data-vv-validate-on="'submit|blur'"
                 class="input-default input"
                 @keydown="noSpacesEmail($event)"
                 @input="emailValidationInput($event)"
                 :class="{
                  'input-error':
                    (errors.has('email') ||
                      !loginServerValid ||
                      !registrationValid) &&
                      !animateValidation
                 }"
                 placeholder="Please enter an email"
                 name="email"
                 v-model="email"
                 type="text" />
          <span :class="{ 'animate-validation': animateValidation }"
                v-show="!registrationValid && !animateValidation"
                class="help error-message-input is-danger">
            The email has already been registered
          </span>
          <span :class="{ 'animate-validation': animateValidation }"
                v-show="errors.has('email') && !animateValidation"
                class="help error-message-input is-danger">
            {{ errors.first('email') }}
          </span>
        </div>
      </div>

      <div class="modal-body__login--item"
           :class="{ 'validation-margin': (errors.has('password') || !loginServerValid) && !animateValidation }">
        <div class="input-wrap control">
          <input v-validate="'required|min:6'"
                 :ref="'passwordInput'"
                 :data-vv-validate-on="'submit|blur'"
                 class="input-default input"
                 :class="{ 'input-error':  (errors.has('password') || !loginServerValid) &&  !animateValidation }"
                 v-model="password"
                 name="password"
                 @input="passwordValidationInput"
                 placeholder="Please enter a password"
                 :type="hiddenPassword ? 'password' : 'text'" />
          <div @click="hiddenPassword = !hiddenPassword" class="show-hide">
            <svg-eye-hide v-if="!hiddenPassword"></svg-eye-hide>
            <svg-eye-show v-if="hiddenPassword"></svg-eye-show>
          </div>
          <span :class="{ 'animate-validation': animateValidation }"
                v-show="!loginServerValid && !animateValidation"
                class="help error-message-input is-danger">
            Your email or password is not correct
          </span>
          <span :class="{ 'animate-validation': animateValidation }"
                v-show="errors.has('password') && !animateValidation"
                class="help error-message-input is-danger">
            {{ errors.first('password') }}</span>
        </div>
      </div>
      <div class="modal-body__login--item">
        <button type="submit"
                @click="login('password', null, null, $event)"
                class="button-prime">
          Sign In
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import { mapGetters } from 'vuex'

Vue.use(VeeValidate, { locale: 'en' })

export default {
  name: 'login-form',
  props: ['facebookError'],
  data () {
    return {
      email: '',
      password: '',
      animateValidation: false,
      loginServerValid: true,
      hiddenPassword: true,
      registrationValid: true
    }
  },
  computed: {
    ...mapGetters(['tempEmailVerification'])
  },
  mounted () {
    if (this.tempEmailVerification) this.email = this.tempEmailVerification
  },
  methods: {
    login (grant_type, provider, token, $event) {
      if ($event) $event.preventDefault()

      this.$emit('socialErrorHide')
      this.$validator.validateAll().then(result => {
        if (result) {
          // eslint-disable-next-line
          this.$store
            .dispatch('login', {
              email: this.email,
              password: this.password,
              grant_type: grant_type,
              provider: provider ? provider : '',
              token: token ? token : ''
            })
            .then(
              resp => {
                // eslint-disable-next-line
              },
              () => {
                this.loginServerValid = false
                this.animateValidation = true

                setTimeout(() => {
                  this.animateValidation = false
                }, 500)
              }
            )
        } else {
          this.animateValidation = true

          setTimeout(() => {
            this.animateValidation = false
          }, 500)
        }
      })
    },
    passwordValidationInput () {
      this.loginServerValid = true
    },
    emailValidationInput () {
      this.loginServerValid = true
      this.registrationValid = true
    },
    noSpacesEmail ($event) {
      if (this.EVENT_KEY_SPACE === $event.keyCode) $event.preventDefault()
    },
    enterKeyHandler: function (evt) {
      if (evt.keyCode === 13) {
        evt.preventDefault()
        this.login('password', null)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.modal-body {
  &__login {
    &--terms {
      margin-top: 15px;
      text-align: center;
      line-height: 1;
      p {
        margin-bottom: 4px;
        font-size: 12px;
        font-family: $sours-sans-p-font;
        color: $main-dark;
        line-height: 1;
      }
      a {
        font-size: 12px;
        font-family: $sours-sans-p-font;
        color: $main-color !important;
        line-height: 1;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
          color: $main-hover !important;
        }
      }
    }
    .flex-wrap {
      display: flex;
      justify-content: space-between;
    }
    &--item-half {
      margin-bottom: 25px;
      flex: 0 0 222px;
    }
    &--item {
      margin-bottom: 25px;
      &:last-child {
        margin-bottom: 16px;
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
          fill: $paragraph;
        }
      }
    }
    .login {
      width: 100%;
      height: 48px;
      background-color: $main-color;
      cursor: pointer;
    }
    .forgot-wrap {
      margin-top: 16px;
      text-align: center;
      font-family: $sours-sans-p-font;
      font-size: 12px;
      span {
        font-size: 12px;
        text-transform: none;
        color: #1a1a1a;
        &:last-child {
          color: #1565c0;
          margin-left: 3px;
          cursor: pointer;
        }
      }
    }
    .error-message-input {
      margin: 4px 0 5px 0;
      display: flex;
      line-height: 16px;
      position: relative;
      bottom: 0;
    }
    .validation-margin {
      margin-bottom: 0;
    }
  }
}
</style>
