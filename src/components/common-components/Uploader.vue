<template>
  <div
    class="loader"
    :class="{ 'has-error': hasError }"
    @drop="preventDrop"
    @dragover="preventDrop"
  >
    <input
      ref="input"
      type="file"
      :disabled="file"
      :accept="opts.accept"
      @change="addFile"
    />

    <div v-if="!file" class="message">
      <p class="message__title">
        {{ opts.title || 'CLICK OR DRAG&DROP FILE' }}
      </p>
      <p class="message__subtitle">
        {{ opts.subtitle || 'PDF doc or JPG image under 1MB' }}
      </p>
    </div>

    <div v-if="file" class="result">
      <div class="result__icon"><svg-drive-file></svg-drive-file></div>
      <p class="result__info">
        <span class="name">{{ file.name }}</span>
        <span class="size">
          {{ nameToExtension() }}
          <span v-if="file.name && file.size"> — </span> {{ bytesToSize() }}
        </span>
      </p>
      <div class="result__delete" @click="delFile">
        <svg-delete></svg-delete>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Uploader',
  props: ['opts', 'currentFile'],
  data () {
    return {
      file: null,
      hasError: false
    }
  },
  methods: {
    addFile () {
      this.file = this.$refs.input.files[0]

      if (this.validSize() && this.validType()) {
        this.$emit('success', this.file)
      } else {
        this.hasError = true
        this.$emit('error')
      }
    },

    delFile () {
      this.file = null
      this.hasError = false
      this.$refs.input.value = ''
      this.$emit('deleted')
    },

    validSize () {
      return !this.opts.maxSize || this.file.size < this.opts.maxSize
    },

    validType () {
      return (
        !this.opts.accept ||
        (!!this.file.type && this.opts.accept.includes(this.file.type))
      )
    },

    preventDrop (e) {
      if (this.$refs.input.disabled) e.preventDefault()
    },

    bytesToSize () {
      if (!this.file.size) return ''

      const units = ['Bytes', 'KB', 'MB']
      const pow = Math.floor(Math.log(this.file.size) / Math.log(1024))

      return (
        parseFloat((this.file.size / Math.pow(1024, pow)).toFixed(2)) +
        ' ' +
        units[pow]
      )
    },

    nameToExtension () {
      const name = this.file.name
      const extension = name.slice(((name.lastIndexOf('.') - 1) >>> 0) + 2)

      return extension ? extension.toUpperCase() : ''
    }
  },
  created () {
    if (this.currentFile) {
      this.file = {
        name: this.currentFile.document.file_name
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.loader {
  position: relative;
  max-width: 320px;
  height: 60px;
  box-sizing: border-box;
  margin: auto;

  .message {
    height: 100%;
    padding-top: 12px;
    box-sizing: border-box;
    border: 1px dashed $main-grey;
    border-radius: 4px;
    text-align: center;
    transition: 0.2s;
    &__title {
      font: 12px/16px $montserrat-font;
      color: $main-color;
      text-transform: uppercase;
    }
    &__subtitle {
      font: 100 12px/16px $sours-sans-p-font;
      color: $main-grey;
    }
  }
  .result {
    display: flex;
    transition: 0.2s;
    &__icon {
      min-width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 18px;
      box-sizing: border-box;
      border: 1px dashed $main-grey;
      border-radius: 4px;
      svg {
        fill: $main-color;
      }
    }

    &__info {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      .name {
        font: 16px/22px $sours-sans-p-font;
        color: $main-color;
        margin-bottom: 4px;
        max-width: 196px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .size {
        font: 100 12px/16px $sours-sans-p-font;
        color: $main-grey;
      }
    }

    &__delete {
      margin: auto 0 auto auto;
      padding: 14px;
      cursor: pointer;
      &:hover svg {
        fill: $main-grey;
      }
      svg {
        width: 24px;
        height: 24px;
        fill: $dark-grey;
      }
    }
  }

  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    pointer-events: all;
    cursor: pointer;

    &[disabled] {
      pointer-events: none;
    }

    &:hover + .message {
      border: 1px dashed $main-color;
    }
  }

  &.has-error {
    .result {
      &__icon {
        border: 1px dashed #f44336;
        background-color: #feeceb;
        svg {
          fill: #f44336;
        }
      }
    }
  }
}

@media (max-width: 368px) {
  .loader {
    .result {
      &__info {
        .name {
          max-width: 146px;
        }
      }
    }
  }
}
</style>
