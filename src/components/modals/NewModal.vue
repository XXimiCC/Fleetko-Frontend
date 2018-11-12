<template>
  <div
    @click="closeModal"
    @drop="preventDrop"
    @dragover="preventDrop"
    class="modal"
    :class="{ loading: isLoading }"
  >
    <div class="modal__container">
      <div class="modal__body">
        <div class="modal__map"><slot name="map"></slot></div>

        <div class="modal__header">
          <slot name="header"></slot>
          <div v-if="!isLoading" class="modal__close" @click="closeModal">
            <svg-close></svg-close>
          </div>
        </div>

        <div class="modal__info"><slot name="body"></slot></div>

        <confirm-dialog
          v-if="showConfirm"
          :type="'closeBillingForm'"
          @confirm="$emit('cancel')"
          @cancel="showConfirm = false"
        >
        </confirm-dialog>
      </div>
    </div>
    <loader v-if="isLoading" class="loader loader--modal" preventActions="true">
    </loader>
  </div>
</template>

<script>
import ConfirmDialog from '../modals/ConfirmDialog'
import Loader from '../common-components/Loader'

export default {
  name: 'NewModal',

  props: ['confirmClose', 'isLoading'],

  components: { ConfirmDialog, Loader },

  created () {
    document.body.style.paddingRight = `${window.innerWidth -
      document.documentElement.clientWidth}px`
    document.body.style.overflow = 'hidden'
  },

  beforeDestroy () {
    document.body.style.paddingRight = 'initial'
    document.body.style.overflow = 'visible'
  },

  data () {
    return {
      showConfirm: false,
      initialPadding: 0
    }
  },

  methods: {
    closeModal (click) {
      if (
        click.target.classList.contains('modal') ||
        click.currentTarget.classList.contains('modal__close')
      ) {
        if (this.confirmClose) {
          this.showConfirm = true
        } else {
          this.$emit('cancel')
        }
      }
    },
    preventDrop ({ target }) {
      if (!target.attributes.type || target.attributes.type.value !== 'file') { event.preventDefault() }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(6, 26, 70, 0.5);
  display: flex;
  overflow-y: auto;
  z-index: 9999;
  padding: 16px 8px;

  &.loading {
    .modal__container {
      opacity: 0;
    }
  }

  &__container {
    min-width: 304px;
    margin: auto;
    border-radius: 4px;
    background-color: #fff;
    transition: opacity 0.35s;
    opacity: 1;
  }

  &__body {
    position: relative;
    padding: 16px;
    z-index: 10000;
  }

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
  }

  &__close {
    cursor: pointer;
    margin-left: auto;
    margin-bottom: auto;
    svg {
      fill: $main-grey;
    }
  }
}

.loader /deep/ .sk-folding-cube .sk-cube:before {
  background-color: #f5f8ff;
}

.loader--modal {
  background-color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 368px) {
  .modal {
    &__container {
      width: 100%;
    }
  }
}
</style>
