<template>
  <transition name="modal">
    <div class="modal-mask" :class="{ 'auth-guard-modal': authGuardModal }">
      <div class="modal-wrapper">
        <div class="modal-container">
          <component
            @small-container="large = false"
            v-on-clickaway="closeModal"
            :registrationView="registrationView"
            @signInModal="changeModal('SignIn', 'login')"
            @signUpModal="changeModal('SignIn', 'registration')"
            @large-container="large = true"
            @passwordReset="changeModal('ResetPassword')"
            class="modal-content-wrap"
            @close="$emit('close')"
            v-bind:is="currentView"
          >
          </component>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import SignIn from './SignIn.vue'
import utils from '@/mixins/utils'
import ConfirmDialog from './ConfirmDialog.vue'
import ResetPassword from './ResetPassword.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'modal',
  data () {
    return {
      currentView: '',
      large: false,
      registrationView: null
    }
  },
  props: ['modalInner'],
  mixins: [clickaway, utils],
  watch: {},
  methods: {
    closeModal () {
      if (!this.authGuardModal) this.$emit('close')
    },
    changeModal (modal, type) {
      this.currentView = modal
      if (type) this.registrationView = type
    }
  },
  computed: {
    ...mapGetters(['authGuardModal'])
  },
  components: {
    SignIn,
    ResetPassword,
    ConfirmDialog
  },
  created () {
    this.currentView = this.modalInner
    this.scrollingModalOpen(true)
  },
  beforeDestroy () {
    this.scrollingModalOpen(false)
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
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
}

.auth-guard-modal {
  background-color: rgb(167, 167, 167);
}

.modal-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  height: 100%;
}

.modal-container {
  width: 384px;
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0px auto;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.modal-content-wrap {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  border-radius: 4px;
}

.modal-footer {
  border-top: none;
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
  .modal-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    justify-content: center;
  }
  .modal-container {
    display: block;
    width: 100%;
    overflow-y: auto;
    height: 100%;
  }
  .modal-content-wrap {
    margin-top: 16px;
    width: 384px;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .modal-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    justify-content: center;
  }
  .modal-container {
    display: block;
    width: 100%;
    overflow-y: auto;
    height: 100%;
  }
  .modal-content-wrap {
    width: 288px;
    margin-top: 16px;
    margin-bottom: 16px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
