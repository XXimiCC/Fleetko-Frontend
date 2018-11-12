<template>
  <div class="form">
    <new-modal @cancel="$emit('cancel')" :confirmClose="!nothingChanged()">
      <template slot="header">
        <div class="form__icon"><svg-add></svg-add></div>
        <p class="form__title">
          {{ permit ? 'Edit Certificate' : 'Add Certificate' }}
        </p>
      </template>

      <template slot="body">
        <div class="inputs">
          <label>
            <p>State</p>
            <v-select
              id="state-select"
              :class="{ 'input-error': errors.has('state-abbr') }"
              name="state-abbr"
              v-validate="'required'"
              v-model="newPermit.state"
              label="name"
              placeholder="AL"
              :options="statesOptions"
              :transition="'false'"
              :searchable="false"
              max-height="330px"
            >
              <template slot="option" slot-scope="option">
                <span class="state-abbr">{{ option.abbr }}</span>
                <span class="state-name">{{ option.name }}</span>
              </template>
            </v-select>

            <span v-show="errors.has('state-abbr')" class="error-message-input">
              {{ errors.first('state-abbr') }}
            </span>
          </label>

          <label>
            <p>Company Name</p>
            <input
              class="input-default-new-design"
              v-model="newPermit.business_name"
              :class="{ 'input-error': errors.has('permit-company') }"
              name="permit-company"
              v-validate="'required|max:80'"
              type="text"
              placeholder="Google"
            />

            <span
              v-show="errors.has('permit-company')"
              class="error-message-input"
            >
              {{ errors.first('permit-company') }}
            </span>
          </label>

          <label>
            <p>Permit Number</p>
            <input
              class="input-default-new-design"
              v-model="newPermit.permit_number"
              :class="{ 'input-error': errors.has('permit-number') }"
              name="permit-number"
              v-validate="'required|max:20'"
              type="text"
              placeholder="2441542324435"
            />

            <span
              v-show="errors.has('permit-number')"
              class="error-message-input"
            >
              {{ errors.first('permit-number') }}
            </span>
          </label>

          <div class="date-picker">
            <label>
              <p>Effective Date</p>
              <date-picker
                v-model="newPermit.effective_date"
                format="DD/MM/YYYY"
                :class="{ 'input-error': errors.has('effective_date') }"
                name="effective_date"
                v-validate="'required'"
                :not-after="newPermit.expiration_date"
                placeholder="01/01/2018"
                lang="en"
              >
              </date-picker>

              <span
                v-show="errors.has('effective_date')"
                class="error-message-input"
              >
                {{ errors.first('effective_date') }}
              </span>
            </label>

            <label>
              <p>Expiration Date</p>
              <date-picker
                v-model="newPermit.expiration_date"
                format="DD/MM/YYYY"
                name="expiration_date"
                :not-before="newPermit.effective_date"
                placeholder="01/01/2018"
                lang="en"
              >
              </date-picker>
            </label>
          </div>

          <div class="file-picker" :class="{ 'has-error': documentError }">
            <label>
              <p>Attach File</p>
              <uploader
                :opts="uploaderOptions"
                :currentFile="permit"
                @success="loadFileHandler"
                @deleted="deleteFileHandler"
                @error="errorFileHandler"
              >
              </uploader>

              <span v-show="documentError" class="error-message-input">
                Please upload PDF doc or JPG image under 1MB
              </span>
            </label>
          </div>

          <div v-if="notification" class="notification">
            <main-notify
              :notification="notification"
              :cancelable="true"
              @clearNotify="notification = null"
            >
            </main-notify>
          </div>

          <button
            v-if="!isLoading"
            :disabled="isButtonDisabled"
            @click="validateForm"
            class="button-prime"
          >
            {{ permit ? 'Update Certificate' : 'Add Certificate' }}
          </button>

          <div v-if="isLoading" class="preloader">
            <span class="processing">processing</span>
            <span class="ellipsis-anim"
              ><span></span><span></span><span></span
            ></span>
          </div>

          <confirm-dialog
            v-if="showConfirm"
            :type="'closeBillingForm'"
            @confirm="$emit('cancel')"
            @cancel="showConfirm = false"
          >
          </confirm-dialog>
        </div>
      </template>
    </new-modal>
  </div>
</template>

<script>
import NewModal from '../../modals/NewModal'

import vSelect from 'vue-select'
import usaData from '../../../usaMap'
import DatePicker from 'vue2-datepicker'
import Uploader from '../../common-components/Uploader'
import ConfirmDialog from '../../modals/ConfirmDialog'
import MainNotify from '../../notifications/MainNotify'
import utils from '@/mixins/utils'
import Vue from 'vue'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate)

export default {
  name: 'NewResaleForm',
  props: ['permit'],
  mixins: [utils],
  components: {
    NewModal,
    vSelect,
    DatePicker,
    Uploader,
    ConfirmDialog,
    MainNotify
  },

  created () {
    usaData.states.forEach(state =>
      this.statesOptions.push({
        abbr: state.properties.abbr,
        name: state.properties.name
      })
    )

    this.statesOptions.sort((a, b) => a.name.localeCompare(b.name))

    Object.assign(this.newPermit, this.permit)
    if (this.permit) this.document = this.permit.document
  },

  data () {
    return {
      newPermit: {
        id: null,
        state: null,
        business_name: null,
        permit_number: null,
        effective_date: null,
        expiration_date: undefined,
        document: null
      },
      document: null,
      documentError: null,
      statesOptions: [],
      isLoading: false,
      notification: null,
      uploaderOptions: {
        maxSize: 1048576, // 1MB
        accept: "'application/pdf, image/jpeg'"
      },
      showConfirm: false
    }
  },

  computed: {
    isButtonDisabled () {
      return !this.document || this.nothingChanged()
    }
  },

  methods: {
    loadFileHandler (file) {
      this.documentError = false
      this.document = file
    },
    deleteFileHandler () {
      this.document = null
      this.documentError = false
    },

    errorFileHandler () {
      this.document = null
      this.documentError = true
    },
    nothingChanged () {
      if (this.permit) {
        return (
          this.permit.business_name === this.newPermit.business_name &&
          this.permit.permit_number === this.newPermit.permit_number &&
          this.permit.effective_date === this.newPermit.effective_date &&
          this.permit.expiration_date === this.newPermit.expiration_date &&
          (!this.document || !this.document.size) &&
          (this.newPermit.state
            ? this.permit.state === this.newPermit.state.abbr ||
              this.permit.state === this.newPermit.state
            : false)
        )
      } else {
        return (
          !this.document ||
          !this.newPermit.state ||
          !this.newPermit.business_name ||
          !this.newPermit.permit_number ||
          !this.newPermit.effective_date
        )
      }
    },
    validateForm () {
      this.documentError = !this.document

      this.$validator.validateAll().then(result => {
        if (result && this.document) {
          this.permit ? this.updateAction() : this.createAction()
        }
      })
    },

    updateAction () {
      this.isLoading = true

      const myFormData = new FormData()
      const newDocument = !this.document.id // 'new document uploaded'

      if (newDocument) {
        myFormData.append('file', this.document)
      }

      this.$store
        .dispatch('updateResellerPermit', {
          permit: this.createPermitObj(),
          id: this.permit.id,
          myFormData: newDocument ? myFormData : null
        })
        .then(
          permit => {
            this.isLoading = false

            if (!newDocument) permit.document = this.permit.document

            this.$emit('updateSuccess', {
              ...permit,
              ...{
                showActions: false,
                showReason: false,
                showNumber: false,
                showName: false
              }
            })
          },
          error => {
            this.notification = {
              type: 'error',
              text: `${error.status} - ${error.responseJSON.message}`
            }

            this.isLoading = false
          }
        )
    },

    createAction () {
      this.isLoading = true

      const myFormData = new FormData()

      myFormData.append('file', this.document)

      this.$store
        .dispatch('createResellerPermit', {
          permit: this.createPermitObj(),
          myFormData
        })
        .then(
          permit => {
            this.isLoading = false
            this.$emit('createSuccess', {
              ...permit,
              ...{ showActions: false, showReason: false }
            })
          },
          error => {
            this.notification = {
              type: 'error',
              text: `${error.status} - ${error.responseJSON.message}`
            }

            this.isLoading = false
          }
        )
    },

    formatUTCDate (date) {
      return new Date(date)
        .toLocaleDateString()
        .split('.')
        .reverse()
        .join('-')
    },

    createPermitObj () {
      const permit = {
        state: this.newPermit.state.abbr || this.newPermit.state,
        business_name: this.newPermit.business_name,
        permit_number: this.newPermit.permit_number,
        effective_date: this.formatUTCDate(this.newPermit.effective_date)
      }

      if (this.newPermit.expiration_date) {
        permit.expiration_date = this.formatUTCDate(
          this.newPermit.expiration_date
        )
      } else {
        permit.expiration_date = null
      }

      return permit
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  position: relative;
  z-index: 10000;
  &__head {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
  }
  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #d0defb;
    margin-right: 12px;
    svg {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: $main-color;
      fill: #d0defb;
    }
  }
  &__title {
    font: 500 20px/26px $montserrat-font;
    color: $main-dark;
  }
  &__close {
    margin-left: auto;
    margin-bottom: auto;
    cursor: pointer;
    svg {
      fill: $main-grey;
    }
  }
}

.form {
  padding: 16px;
  z-index: 10000;
  &__head {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
  }
  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #d0defb;
    margin-right: 12px;
    svg {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: $main-color;
      fill: #d0defb;
    }
  }
  &__title {
    font: 500 20px/26px $montserrat-font;
    color: $main-dark;
  }
  &__close {
    margin-left: auto;
    margin-bottom: auto;
    cursor: pointer;
    svg {
      fill: $main-grey;
    }
  }

  label {
    width: 100%;
    font: 600 14px/19px $sours-sans-p-font;
    margin-bottom: 21px;
    position: relative;

    .error-message-input {
      bottom: -21px;
    }

    &:last-child {
      margin-bottom: 24px;
    }
    p {
      margin-bottom: 8px;
    }
  }

  .date-picker {
    display: flex;
    justify-content: space-between;
    label {
      display: flex;
      flex-flow: column nowrap;
      & /deep/ .mx-datepicker {
        width: 100%;
      }
      width: calc(50% - 8px);
      margin-bottom: 21px;
    }
  }
}

.notification {
  margin-bottom: 24px;
}

.preloader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  background: $main-color;
  color: white;
  text-align: center;
  text-transform: uppercase;
  border-radius: 4px;
  font: 500 12px/1 $montserrat-font;
  cursor: default;
  .ellipsis-anim {
    margin-left: 16px;
    display: flex;
    span + span {
      margin-right: 4px;
    }
  }
  .ellipsis-anim span {
    width: 3px;
    margin-right: 4px;
    height: 3px;
    border-radius: 100%;
    background: white;
    opacity: 0;
    -webkit-animation: ellipsis-dot 1s infinite;
    animation: ellipsis-dot 1s infinite;
  }

  .ellipsis-anim span:nth-child(1) {
    -webkit-animation-delay: 0s;
    animation-delay: 0s;
  }
  .ellipsis-anim span:nth-child(2) {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }
  .ellipsis-anim span:nth-child(3) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }

  @-webkit-keyframes ellipsis-dot {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes ellipsis-dot {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
}
</style>
