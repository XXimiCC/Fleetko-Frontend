<template>
  <div>
    <div class="settings">
      <div class="settings__body">
        <p class="settings__title">Account Settings</p>

        <div class="item settings--text-right">
          <label for="first-name">First name</label>
          <div class="input-wrap">
            <input class="input-default"
                   :class="{ 'error-border': errors.has('first-name') }"
                   v-validate="'max:20|required'"
                   name="first-name"
                   id="first-name"
                   v-model="firstName"
                   type="text" />
            <span v-show="errors.has('first-name')" class="error-message-input">{{ errors.first('first-name') }}</span>
          </div>
        </div>

        <div class="item settings--text-right">
          <label for="last-name">Last name</label>
          <div class="input-wrap">
            <input class="input-default"
                   :class="{ 'error-border': errors.has('last-name') }"
                   id="last-name"
                   v-validate="'max:20|required'"
                   name="last-name"
                   v-model="lastName"
                   type="text" />
            <span v-show="errors.has('last-name')" class="error-message-input">{{ errors.first('last-name') }}</span>
          </div>
        </div>

        <div class="item settings--text-right">
          <label for="last-name">Phone</label>
          <div class="input-wrap">
            <masked-input :class="{ 'error-border': errors.has('phone') }"
                          class="input-default"
                          v-model="phone"
                          :showMask="false"
                          :guide="true"
                          :mask="['+','1','(',/[1-9]/,/\d/,/\d/,')',' ',/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/]"
                          placeholder="+1(456) 456-5445"
                          type="tel"
                          v-validate:phoneNumber="'min:12'"
                          data-vv-name="phone"
                          data-vv-value-path="phoneNumber">
            </masked-input>
            <div class="counter" :class="{ 'counter--error': phoneNumber.length !== 12 && errors.has('phone') }">
              <span>{{ phoneNumber.length }} / 12</span>
            </div>
            <span v-show="errors.has('phone')" class="error-message-input">{{ errors.first('phone') }}</span>
          </div>
        </div>

        <div class="item settings__email">
          <label class="settings--text-right">Email</label>
          <div class="input-wrap">
            <div class="settings__email-label">{{ email }}</div>
          </div>
          <div class="settings__change-email">
            <span @click="toggleChangeEmailModal(true)" class="link-quaternary sm-link">Change Email</span>
          </div>
        </div>

        <div class="item">
          <label for="submit-changes"></label>
          <button @click="updateUserHandler"
                  :disabled="notValidForm || preloader || nothingChanged"
                  class="button-prime"
                  id="submit-changes">
            Update Information
          </button>
        </div>
      </div>

      <div class="settings__stub">
        <img :src="imageSrc('settings-illustration.svg')" alt="" />
        <p class="paragraph-tertiary">
          Your name will be used for email mailing and creating orders.
        </p>
        <br />
        <p class="paragraph-tertiary">
          Better to enter your current phone number and e-mail so that we can
          contact with you to inform about order's state and status, sales and
          so on. We use your phone number only to inform about some fail.
        </p>
      </div>
    </div>
    <change-email @successUpdateEmail="fetchDataUser()" v-if="changeEmailModalOpen"></change-email>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import MaskedInput from 'vue-text-mask'
import VeeValidate from 'vee-validate'
import toastr from 'toastr'
import changeEmail from '../modals/ChangeEmail'
import utils from '@/mixins/utils'

Vue.use(VeeValidate)

export default {
  name: 'order-history',
  mixins: [utils],
  components: {
    MaskedInput,
    changeEmail
  },
  data () {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: null,
      isFetching: true
    }
  },
  computed: {
    notValidForm () {
      return this.errors.has('phone') || this.errors.has('last-name') || this.errors.has('first-name')
    },
    currentPage () {
      return this.$route.name
    },
    phoneNumber () {
      return this.phone ? this.phone.replace(/[^0-9a-zA-Z+]/g, '') : ''
    },
    nothingChanged () {
      return this.firstName === this.userInfo.first_name &&
        this.lastName === this.userInfo.last_name &&
        this.email === this.userInfo.email &&
        !this.userInfo.phone && this.phone && this.userInfo.phone
    },
    ...mapGetters(['isAuth', 'userInfo', 'preloader', 'changeEmailModalOpen'])
  },
  mounted () {
    this.checkEmailVerificationModal()
    this.fetchDataUser()
    this.phone = this.formatPhoneNumber(this.phone)
  },
  methods: {
    checkEmailVerificationModal () {
      if (!this.$route.query.verified) return
      this.$store.dispatch('toggleEmailConfirmModal', true)
      this.$store.dispatch('successEmailVerification')
    },
    formatPhoneNumber (phone) {
      if (!phone) return

      const digits1 = phone.slice(2, 5)
      const digits2 = phone.slice(5, 8)
      const digits3 = phone.slice(8, 12)
      return `+1(${digits1}) ${digits2}-${digits3}`
    },
    fetchDataUser () {
      this.isFetching = true

      this.firstName = this.userInfo.first_name
      this.lastName = this.userInfo.last_name
      this.phone = this.userInfo.phone
      this.email = this.userInfo.email

      this.isFetching = false
    },
    dispatchUpdateUser () {
      this.isFetching = true

      this.$store.dispatch('updateUser', {firstName: this.firstName, lastName: this.lastName, phone: this.phoneNumber})
        .then(() => {
          toastr.info('Personal data has been successfully updated!', '', this.setToastr('success', 5000))
          this.isFetching = false
        },
          () => {
            this.isFetching = false
          }
        )
    },
    updateUserHandler () {
      this.$validator.validateAll()
        .then(result => {
          if (result) this.dispatchUpdateUser('successName')
        })
    },
    toggleChangeEmailModal (open) {
      this.$store.dispatch('toggleChangeEmailModal', open)
    }
  }
}
</script>

<style lang="scss" scoped>
.no-pad-hint {
  padding: 0;
}
.settings {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  &__stub {
    flex: 0 0 360px;
    text-align: center;
    img {
      margin-bottom: 32px;
      width: 100%;
    }
    p {
      margin-bottom: 0;
    }
  }
  &__title {
    flex: 0 0 100%;
    margin-bottom: 24px;
    font-family: $montserrat-font;
    font-size: 34px;
    font-weight: 500;
    line-height: 25px;
    color: $main-dark;
  }
  &--text-right {
    text-align: right;
  }
  &__email {
    flex-wrap: wrap;
    text-align: left;
  }
  &__change-email {
    flex: 0 0 100%;
    margin-top: 8px;
    text-align: left;
    span {
      margin-left: 140px;
    }
  }
  &__body {
    display: flex;
    flex: 0 0 50%;
    flex-wrap: wrap;
    h3 {
      margin-bottom: 32px;
      font-family: $montserrat-font;
      font-size: 20px;
      color: #323c47;
      line-height: 18px;
    }
    .item {
      flex: 0 0 100%;
      margin-top: 24px;
      display: flex;
      align-items: center;
      label {
        margin-bottom: 0;
        margin-right: 65px;
        min-width: 75px;
        color: $main-dark;
        font-family: $sours-sans-p-font;
        font-size: 14px;
        font-weight: 600;
      }
      input,
      button {
        width: 337px;
      }
      &:first-child {
        margin-top: 0;
      }
      &.account-info__email {
        margin-top: 32px;
      }
    }
    .input-wrap {
      position: relative;
      width: 337px;
      .counter {
        position: absolute;
        bottom: 10px;
        right: 14px;
        span {
          font-family: $sours-sans-p-font;
          color: $paragraph;
          font-size: 14px;
        }
        &--error {
          span {
            color: $input-error-border;
          }
        }
      }
    }
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .settings {
    margin-bottom: 64px;
    &__stub {
      padding: 16px;
      flex: 0 0 50%;
    }
    &__title {
      margin-bottom: 24px;
    }
    &__body {
      .item {
        flex-wrap: wrap;
        label {
          margin-bottom: 12px;
          width: 100%;
          text-align: left;
        }
        input,
        button {
          width: 100%;
        }
        .input-wrap {
          width: 100%;
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .settings {
    &__stub {
      flex: 0 0 100%;
      margin: 64px auto 40px;
    }
    &__change-email {
      span {
        margin-left: 0;
      }
    }
    &__title {
      margin-bottom: 24px;
      font-size: 20px;
    }
    &__body {
      flex: 0 0 100%;
      margin-top: 20px;
      .item {
        flex-wrap: wrap;
        label {
          margin-bottom: 12px;
          width: 100%;
          text-align: left;
        }
        input,
        button {
          width: 100%;
        }
        .input-wrap {
          width: 100%;
        }
      }
      &--notify {
        margin-left: 0;
      }
    }
  }
}
</style>
