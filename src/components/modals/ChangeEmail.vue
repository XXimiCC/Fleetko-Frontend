<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container change-email">
          <div class="modal-wrap" v-on-clickaway="closeModal">
            <div class="change-email__close" @click="closeModal">
              <svg-close></svg-close>
            </div>

            <div class="modal-body change-email__body">
              <div class="change-email__icon">
                <svg-envelope-fill></svg-envelope-fill>
              </div>
              <h3 class="h3-secondary change-email__title">
                Change Email Address
              </h3>
              <p class="change-email__text paragraph-secondary">
                After you change the email, you will be able to restore the
                previous email from the message we sent to the previous email.
                If you have any questions, feel free to contact with our
                <router-link
                  target="_blank"
                  :to="{ name: 'contactUs' }"
                  class="link-quaternary"
                  >support centre </router-link
                >.
              </p>

              <div
                class="change-email__input-wrap"
                :class="{
                  'validation-margin':
                    errors.has('email') || serverValidation['email']
                }"
              >
                <span class="label">Email</span>
                <input
                  placeholder="example@mail.com"
                  type="email"
                  name="email"
                  v-model="email"
                  :autocomplete="'off'"
                  v-validate="'required|email'"
                  :class="{
                    input: true,
                    'input-error':
                      errors.has('email') || serverValidation['email']
                  }"
                  class="input-default"
                />
                <span
                  v-show="errors.has('email')"
                  class="help error-message-input is-danger"
                  >{{ errors.first('email') }}</span
                >
                <span
                  v-show="serverValidation['email']"
                  class="help error-message-input is-danger"
                  >{{ serverValidation['email'] }}</span
                >
              </div>

              <div
                class="change-email__input-wrap"
                :class="{
                  'validation-margin':
                    errors.has('password') || serverValidation['password']
                }"
              >
                <span class="label">Password</span>
                <input
                  placeholder="Password"
                  :type="hiddenPassword ? 'password' : 'text'"
                  name="password"
                  v-model="password"
                  :autocomplete="'off'"
                  @input="resetServerValidation()"
                  v-validate="'required|min:6'"
                  :class="{
                    input: true,
                    'input-error':
                      errors.has('password') || serverValidation['password']
                  }"
                  class="input-default"
                />
                <div
                  @click="hiddenPassword = !hiddenPassword"
                  class="show-hide"
                >
                  <svg-eye-hide v-if="!hiddenPassword"></svg-eye-hide>
                  <svg-eye-show v-if="hiddenPassword"></svg-eye-show>
                </div>
                <span
                  v-show="errors.has('password')"
                  class="help error-message-input is-danger"
                  >{{ errors.first('password') }}</span
                >
                <span
                  v-show="serverValidation['password']"
                  class="help error-message-input is-danger"
                  >{{ serverValidation['password'] }}</span
                >
              </div>

              <div class="change-email__button">
                <button @click="validateForm" class="button-prime">
                  Change email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import utils from '@/mixins/utils'
import { mapGetters } from 'vuex'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import toastr from 'toastr'

Vue.use(VeeValidate)
export default {
  name: 'email-change',
  data () {
    return {
      email: '',
      password: '',
      hiddenPassword: true,
      serverValidation: {}
    }
  },
  methods: {
    closeModal () {
      this.$store.dispatch('toggleChangeEmailModal', false)
    },
    validateForm () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.submitEmailChangeHandler()
        }
      })
    },
    submitEmailChangeHandler () {
      // eslint-disable-next-line
      this.$store
        .dispatch('userUpdateEmail', {
          email: this.email,
          password: this.password
        })
        .then(
          resp => {
            this.success = true

            this.$store.dispatch('getAuthUser').then(resp => {
              this.closeModal()

              this.$emit('successUpdateEmail')
              toastr.info(
                'Email has been successfully updated!',
                '',
                this.setToastr('success', 5000)
              )
            })
            // eslint-disable-next-line
          },
          error => {
            if (error.responseJSON.errors.email) {
              Vue.set(
                this.serverValidation,
                'email',
                'The email has already been taken'
              )
            } else if (error.responseJSON.errors.password) {
              Vue.set(
                this.serverValidation,
                'password',
                'Your password is not correct'
              )
            }
          }
        )
    },
    disableAutoComplete () {
      let elements = document.querySelectorAll('[autocomplete="off"]')

      if (elements) {
        elements.forEach(element => {
          element.setAttribute('readonly', 'readonly')
          element.style.backgroundColor = 'inherit'

          setTimeout(() => {
            element.removeAttribute('readonly')
          }, 700)
        })
      }
    },
    resetServerValidation () {
      this.serverValidation = {}
    }
  },
  mixins: [clickaway, utils],
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    this.scrollingModalOpen(true)

    this.disableAutoComplete()
  },
  beforeDestroy () {
    this.scrollingModalOpen(false)
  }
}
</script>

<style scoped lang="scss">
.error-message-input {
  margin: 4px 0 5px 0;
  display: flex;
  line-height: 16px;
  position: relative;
  bottom: 0;
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

.modal-mask {
  position: fixed;
  z-index: 9998 !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  transition: opacity 0.3s ease;
  overflow-y: auto;
}

.modal-wrapper {
  width: 100%;
  height: 618px;
  margin: auto;
  display: flex;
  align-items: center;
}

.modal-container {
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0 auto;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.modal-wrap {
  width: 384px;
  padding: 16px 16px 64px 16px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  border-radius: 4px;
}

.modal-body {
  padding: 0;
}

.modal-footer {
  border-top: none;
}

.change-email {
  .validation-margin {
    margin-bottom: 0;
  }

  &__close {
    display: flex;
    flex-direction: row-reverse;
    svg {
      width: 20px;
      height: 20px;
      fill: $main-grey;
      cursor: pointer;
    }
  }
  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 32px auto 24px auto;
    width: 64px;
    height: 64px;
    background: #d0defb;
    border-radius: 100%;
    svg {
      width: 32px;
      height: 32px;
      fill: $main-color;
    }
  }
  &__body {
    padding: 0 16px;
  }
  &__title {
    margin-bottom: 12px;
    text-align: center;
  }
  &__text {
    margin-bottom: 32px;
    text-align: center;
    &--small-margin {
      margin-bottom: 12px;
    }
    p {
      margin-bottom: 0;
    }
  }
  &__input-wrap {
    position: relative;
    margin-bottom: 25px;
    .label {
      display: block;
      margin-bottom: 4px;
      font-family: 'Source Sans Pro', serif;
      font-size: 14px;
      font-weight: 600;
      color: #061a46;
    }
    .show-hide {
      position: absolute;
      top: 32px;
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
}

@media all and (max-width: $xssm) {
  .change-email {
    &__icon {
      display: none;
    }
    &__close {
      margin-bottom: 8px;
    }
  }

  .modal-mask {
    padding: 16px;
  }

  .change-email__body {
    padding: 0;
  }

  .modal-wrapper {
    height: 477px;
  }

  .modal-wrap {
    width: 288px;
    padding: 16px;
  }
}
</style>
