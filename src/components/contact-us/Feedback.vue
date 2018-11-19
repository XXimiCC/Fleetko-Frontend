<template>
  <div class="feedback">
    <div class="feedback__body">
      <div class="feedback__body--item">
        <label>Name</label>
        <div class="input-wrap">
          <input
            :class="{ 'input-error': errors.has('feedback-name') }"
            v-validate="'required|max:19'"
            class="input-default"
            name="feedback-name"
            v-model="name"
            placeholder="John"
            type="text"
          />
          <span
            v-show="errors.has('feedback-name')"
            class="error-message-input"
          >
            {{ errors.first('feedback-name') }}</span
          >
        </div>
      </div>
      <div class="feedback__body--item">
        <label>Email</label>
        <div class="input-wrap">
          <input
            :class="{ 'input-error': errors.has('email') }"
            v-validate="'required|email'"
            class="input-default"
            name="email"
            v-model="email"
            placeholder="example@mail.com"
            type="text"
          />
          <span v-show="errors.has('email')" class="error-message-input">
            {{ errors.first('email') }}</span
          >
        </div>
      </div>
      <div class="feedback__body--item">
        <label>Phone</label>
        <div class="input-wrap">
          <masked-input
            :class="{ 'input-error': errors.has('phone') }"
            class="input-default"
            v-model="phone"
            :mask="[
              '+',
              '1',
              '(',
              /[1-9]/,
              /\d/,
              /\d/,
              ')',
              ' ',
              /\d/,
              /\d/,
              /\d/,
              '-',
              /\d/,
              /\d/,
              /\d/,
              /\d/
            ]"
            placeholder="+1(456) 456-5445"
            type="tel"
            v-validate:phoneNumber="'min:12'"
            data-vv-name="phone"
            data-vv-value-path="phoneNumber"
          ></masked-input>
          <span v-show="errors.has('phone')" class="error-message-input">
            {{ errors.first('phone') }}</span
          >
        </div>
      </div>
      <div class="feedback__body--item">
        <label>Message</label>
        <div class="input-wrap">
          <textarea
            name="feedback-message"
            :class="{ 'error-textarea': errors.has('feedback-message') }"
            v-model="message"
            v-validate="'required|max:2000'"
            :data-vv-validate-on="'input'"
            placeholder="Your message"
            id=""
            cols="30"
            rows="10"
          ></textarea>
          <span
            v-show="errors.has('feedback-message')"
            class="error-message-input"
          >
            {{ errors.first('feedback-message') }}</span
          >
        </div>
      </div>
      <div class="feedback__body--submit">
        <button @click="validateFeedback" class="button-prime">
          Send Message
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import MaskedInput from 'vue-text-mask'
import toastr from 'toastr'
import { mapGetters } from 'vuex'

Vue.use(VeeValidate)

export default {
  name: 'feedback',
  data () {
    return {
      name: '',
      email: '',
      phone: '',
      message: '',
      captchaFire: false
    }
  },
  methods: {
    clearForm () {
      this.name = ''
      this.email = ''
      this.phone = ''
      this.message = ''

      this.$nextTick(() => this.$validator.reset())
    },
    createFeedback () {
      this.$store
        .dispatch('userCreateFeedback', {
          name: this.name,
          email: this.email,
          phone: this.phoneNumber,
          message: this.message
        })
        .then(response => {
          this.clearForm()
          toastr.info(
            'Your message has been sent. We will reply to you as soon as possible!',
            '',
            this.setToastr('success', 5000)
          )
        })
    },
    validateFeedback () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.createFeedback()
        }
      })
    }
  },
  mounted () {},
  computed: {
    phoneNumber () {
      return this.phone.replace(/[^0-9a-zA-Z+]/g, '')
    },
    ...mapGetters(['loginModal'])
  },
  components: {
    MaskedInput
  }
}
</script>

<style scoped lang="scss">
.feedback {
  padding: 64px;
  background: white;
  border-radius: 4px;
  box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.1);
  &__info {
    h3 {
      margin-bottom: 16px;
    }
    p {
      max-width: 450px;
      font-family: $sours-sans-p-font;
      color: $paragraph;
      font-size: 14px;
      line-height: 19px;
    }
  }
  &__body {
    &--item {
      display: flex;
      label {
        margin-right: 32px;
        flex: 0 0 50px;
        margin-bottom: 12px;
        font-family: $sours-sans-p-font;
        font-size: 14px;
        font-weight: 600;
        color: $main-dark;
      }
      .input-wrap {
        width: 100%;
        position: relative;
      }
      .error-message-input {
        position: absolute;
        bottom: -18px;
        left: 0;
        font-size: 12px;
        line-height: 1;
      }
      textarea {
        padding: 15px;
        width: 100%;
        height: 120px;
        &:focus {
          outline: none;
        }
      }
    }
    &--submit {
      margin-left: auto;
      margin-top: 24px;
      width: 163px;
    }
  }
  .feedback__body--item + .feedback__body--item {
    margin-top: 24px;
  }
}

@media (min-width: $sm) and (max-width: $md) {
}

@media (min-width: $xs) and (max-width: $sm) {
  .feedback {
    padding: 32px 16px;
    &__body {
      &--item {
        flex-wrap: wrap;
        label {
          flex: 0 0 100%;
        }
      }
    }
  }
}
</style>
