<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container modal-email" v-on-clickaway="closeModal">
          <!-- modal header ends -->
          <div class="modal-email__close" @click="closeModal">
            <svg-close></svg-close>
          </div>

          <div class="modal-body modal-email__body">
            <div class="modal-email__icon"><svg-check></svg-check></div>
            <h3 class="h3-secondary modal-email__title">You`re All Set!</h3>
            <p class="paragraph-secondary">
              Your email <span>{{ userInfo.email }}</span> has been confirmed!
            </p>
            <div class="modal-email__button-wrap">
              <button
                @click="closeModal"
                class="button-second modal-email__button"
              >
                Got it
              </button>
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
export default {
  name: 'email-confirm',
  data () {
    return {}
  },
  methods: {
    closeModal () {
      this.$store.dispatch('toggleEmailConfirmModal', false)
    }
  },
  mixins: [clickaway, utils],
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    this.scrollingModalOpen(true)
  },
  beforeDestroy () {
    this.scrollingModalOpen(false)

    if (this.$route.name === 'settings') { this.$router.replace({ name: 'settings' }) }
  }
}
</script>

<style scoped lang="scss">
.modal-mask {
  position: fixed;
  padding-right: 16px;
  z-index: 9998;
  top: 0;
  left: 0;
  bottom: 0;
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
  padding: 16px 16px 64px 16px;
  width: 384px;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-body {
  padding: 0;
}

.modal-footer {
  border-top: none;
}

.modal-email {
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
  &__button-wrap {
    display: flex;
    justify-content: center;
  }
  &__button {
    width: 163px;
    margin: 0 auto;
  }
  &__title {
    margin-bottom: 24px;
    text-align: center;
  }
  p {
    text-align: center;
    margin-bottom: 32px;
    span {
      font-weight: 600;
      color: $main-dark;
    }
  }
}

@media all and (max-width: $xssm) {
  .modal-mask {
    padding: 16px;
  }

  .change-email__body {
    padding: 0;
  }

  .modal-container {
    width: 288px;
    padding: 16px;
  }
}
</style>
