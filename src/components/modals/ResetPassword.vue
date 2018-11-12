<template>
  <div class="reset-password-modal">
    <div class="modal-header">
      <div class="item" v-if="!authGuardModal" @click="closeModal">
        <svg-close class="close-modal"></svg-close>
      </div>
    </div>

    <div v-if="success" class="modal-body__reset success-body">
      <div class="modal-body__reset--success-line--envelope">
        <svg-envelope-fill></svg-envelope-fill>
      </div>
      <div class="modal-body__reset--success-line--title">Mail Sent!</div>
      <div class="modal-body__reset--success-line--text">
        <p>
          We sent an email to <span class="default-link">{{ email }}</span>
          <br />
          Click the link in the email to reset your password.
        </p>
      </div>
      <div class="modal-body__reset--success-line--text">
        <p>
          If you don't see the email, check other places it might be, like your
          junk, spam, social, or other folders. <br />
          <router-link tag="a" :to="{ name: 'contactUs' }"
            ><span class="link-quaternary"
              >I didn't receive the email.</span
            ></router-link
          >
        </p>
      </div>
      <div class="modal-body__reset--success-line--text">
        <p>
          Incorrect email address?
          <a
            @click.stop="
              success = false
              email = ''
            "
            ><span class="link-quaternary">Try again.</span></a
          >
        </p>
      </div>
    </div>
    <div v-else>
      <div class="modal-body__reset">
        <div class="modal-header--lock-icon"><svg-lock></svg-lock></div>
        <div class="modal-header--title">Forgot your password?</div>
        <div class="modal-header--subtitle">
          <p>Please enter your registered email address in the field below</p>
        </div>
        <form @submit.prevent="validateEmail">
          <div class="modal-body__reset--item">
            <div class="input-wrap" :class="{ control: true }">
              <input
                v-validate="'required|email'"
                :class="{
                  input: true,
                  'input-error': errors.has('email') || !valid
                }"
                v-model="email"
                @input="valid = true"
                placeholder="Please enter an email"
                name="email"
                class="input-default"
                type="email"
              />
              <span
                v-show="!valid && !animateValidation"
                :class="{ 'animate-validation': animateValidation }"
                class="help error-message-input is-danger"
                >The email is not registered</span
              >
              <span
                v-show="errors.has('email')"
                class="help error-message-input is-danger"
                >{{ errors.first('email') }}</span
              >
            </div>
          </div>
          <div class="modal-body__reset--item-submit">
            <button class="button-prime login">Send message</button>
          </div>
        </form>
      </div>
      <div class="modal-body__actions">
        <div class="modal-body__actions--item">
          <button @click.stop="$emit('signUpModal')">
            <span class="link-quaternary lg-link">Sign Up</span>
          </button>
        </div>
        <div class="modal-body__actions--item">
          <button @click.stop="$emit('signInModal')">
            <span class="link-quaternary lg-link">Sign In</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import { mixin as clickaway } from 'vue-clickaway'
import EnterListener from '@/mixins/EnterListener'
import { mapGetters } from 'vuex'
import { EventBus } from '../../event-bus'

Vue.use(VeeValidate)

export default {
  name: 'modal',
  data () {
    return {
      email: '',
      success: false,
      valid: true,
      animateValidation: false
    }
  },
  watch: {
    $route (val, oldVal) {
      this.closeModal()
    },
    isAuth (v) {
      if (v) {
        this.closeModal()
        EventBus.$emit('successLogin', true)
      }
    }
  },
  mixins: [clickaway, EnterListener],
  methods: {
    enterKeyHandler: function (evt) {
      if (evt.keyCode === 13) {
        evt.preventDefault()
        this.validateEmail()
      }
    },
    closeModal () {
      this.$emit('close')
    },
    validateEmail () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.submitEmail()
        }
      })
    },
    submitEmail () {
      this.$store.dispatch('submitEmailPassword', { email: this.email }).then(
        response => {
          this.success = true
          // eslint-disable-next-line
        },
        () => {
          this.valid = true
          this.animateValidation = true

          setTimeout(() => {
            this.animateValidation = false
            this.valid = false
          }, 500)
        }
      )
    }
  },
  computed: {
    ...mapGetters({
      hasToken: 'hasToken',
      isAuth: 'isAuth',
      authGuardModal: 'authGuardModal'
    })
  },
  components: {}
}
</script>

<style lang="scss" scoped>
.reset-password-modal {
  width: 100%;
  .animate-validation {
    opacity: 0;
  }
  .error-message-input {
    opacity: 1;
    transition: opacity 1s;
  }
  .modal-header {
    padding: 16px 16px 0 16px;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    border-bottom: none;
    .item {
      display: flex;
      svg {
        fill: $svg-fill-tertiary;
        cursor: pointer;
      }
    }
    &--lock-icon {
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 32px;
      width: 64px;
      height: 64px;
      background: #fbe9cd;
      display: flex;
      align-items: center;
      border-radius: 100%;
      justify-content: center;
      svg {
        width: 26px;
        height: 32px;
        fill: #efa936;
      }
    }
    &--title {
      font-family: $montserrat-font;
      font-size: 20px;
      font-weight: 500;
      color: $main-dark;
      text-align: center;
    }
    &--subtitle {
      margin-top: 16px;
      display: flex;
      justify-content: center;
      p {
        width: 200px;
        margin-bottom: 0;
        font-family: $sours-sans-p-font;
        font-size: 14px;
        color: $paragraph;
        text-align: center;
      }
    }
  }
}

.modal-body__reset {
  padding: 24px 32px 0 32px;
  &--success-line {
    &--envelope {
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 32px;
      width: 64px;
      height: 64px;
      background: #c4d5fa;
      display: flex;
      align-items: center;
      border-radius: 100%;
      justify-content: center;
      svg {
        width: 36px;
        height: 30px;
        fill: $main-color;
      }
    }
    &--title {
      margin-bottom: 20px;
      text-align: center;
      text-transform: capitalize;
      line-height: 1;
      font-size: 20px;
      font-weight: 500;
      font-family: $montserrat-font;
      color: $main-dark;
    }
    &--text {
      margin-bottom: 13px;
      font-family: $sours-sans-p-font;
      color: $paragraph;
      font-size: 14px;
      text-align: center;
      line-height: 19px;
      p {
        margin-bottom: 0;
      }
      a {
        line-height: 1;
        cursor: pointer;
      }
      .default-link {
        font-weight: 600;
        color: $main-dark;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  &--item {
    margin-bottom: 25px;
    span {
      &:first-child {
        font-size: 14px;
        font-weight: normal;
        font-family: $sours-sans-p-font;
        text-transform: uppercase;
        line-height: 1;
        color: #323c47;
      }
    }
    input {
      margin-top: 32px;
    }
    &-submit {
      display: flex;
      justify-content: center;
      button {
        width: 163px;
        height: 40px;
      }
    }
  }
  .input-wrap {
    position: relative;
    svg {
      position: absolute;
      top: 24px;
      right: 18px;
      height: 16px;
      width: 20px;
      fill: #e0e0e0;
    }
  }
}
.modal-body {
  &__actions {
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
}
.success-body {
  padding: 24px 32px 64px 32px;
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

@media (min-width: $sm) and (max-width: $md) {
  .reset-password-modal {
    width: 384px;
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .reset-password-modal {
    width: 288px;
    margin-top: 16px;
    margin-bottom: 16px;
    margin-left: auto;
    margin-right: auto;
  }
  .modal-body {
    &__actions {
      &--item {
        button {
          height: 40px;
        }
      }
    }
  }
}
</style>
