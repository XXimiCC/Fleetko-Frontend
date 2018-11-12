<template>
  <div class="payment-service">
    <div class="payment-service--items">
      <div
        :class="{
          active:
            selectedCarrier && Object.keys(selectedCarrier)[0] === carrierKey
        }"
        @click="setCarrierActive(carrierKey)"
        class="item"
        v-for="(carrier, carrierKey) in carriers"
      >
        <div class="image-wrap">
          <svg-usps v-if="carrierKey === 'USPS'"></svg-usps>
          <svg-ups
            :viewBox="$mq === 'sm' || $mq === 'xs' ? '0 0 60 60' : '-3 0 60 60'"
            v-if="carrierKey === 'UPS'"
          ></svg-ups>
        </div>
        <h3>{{ carrierKey }}</h3>
        <div
          v-if="
            selectedCarrier && Object.keys(selectedCarrier)[0] === carrierKey
          "
          class="active-carrier"
        >
          <svg-check></svg-check>
        </div>
      </div>
    </div>
    <div
      class="payment-service__select"
      v-if="selectedCarrier && carrierForSelect"
    >
      <div class="payment-service__select--title"><h3>Select Service</h3></div>
      <div class="payment-service__select--select-wrap">
        <v-select
          v-if="carrierForSelect"
          @input="changeCarrierService($event)"
          v-model="selectedCarrierService"
          :searchable="false"
          id="select-carrier"
          :options="carrierForSelect"
          label="label"
        >
          <template slot="option" slot-scope="option">
            <div class="select-option">
              <div class="select-option--item">
                <div class="row-option type">
                  <span>{{ option.name }}</span>
                  <span>by {{ option.carrier }}</span>
                </div>
                <div class="row-option description">
                  <p>{{ option.description }}</p>
                </div>
                <div class="row-option days">
                  <span>Estimated Days {{ option.days }}</span>
                </div>
              </div>
              <div class="select-option--item price">
                <span>$ {{ toDollarDecimal(option.price) }}</span>
              </div>
            </div>
          </template>
        </v-select>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import $ from 'jquery'
import utils from '@/mixins/utils'

export default {
  name: 'payment-delivery',
  data () {
    return {
      carrierForSelect: null,
      selectedCarrierService: null
    }
  },
  mixins: [utils],
  watch: {
    selectedCarrier (v) {
      this.carrierForSelect = this.mapingServiceCarrier()

      this.selectedCarrierService = this.carrierForSelect[0]
    }
  },
  props: ['selectedCarrier', 'carriers'],
  methods: {
    setCarrierActive (carrierKey) {
      this.$emit('setCarrierActive', carrierKey)
    },
    changeCarrierService (service) {
      const selectedCarrierElement = $('#select-carrier .selected-carrier')
      const selectedPriceElement = $('#select-carrier .selected-carrier')
      const selectedTagElement = $('#select-carrier .selected-tag')

      if (service) {
        selectedCarrierElement.remove()
        selectedPriceElement.remove()

        setTimeout(() => {
          selectedTagElement.after(
            `<span class="selected-carrier">${
              this.selectedCarrierService.carrier
            }</span>`
          )
          selectedCarrierElement.after(
            `<span class="selected-price">$ ${this.toDollarDecimal(
              this.selectedCarrierService.price
            )}</span>`
          )
        }, 10)
      } else {
        selectedCarrierElement.remove()
        selectedTagElement.after(`<span class="selected-carrier"></span>`)

        selectedPriceElement.remove()
        selectedCarrierElement.after(`<span class="selected-price"></span>`)
      }

      this.selectedCarrierService = service

      this.$emit('setCarrierService', service)
    },
    mapingServiceCarrier () {
      return this.selectedCarrier[Object.keys(this.selectedCarrier)[0]].map(
        g => ({
          carrier: g.carrier,
          created_at: g.created_at,
          days: g.days,
          description: g.description,
          id: g.id,
          name: g.name,
          order_id: g.order_id,
          price: g.price,
          selected: g.selected,
          shippo_id: g.shippo_id,
          updated_at: g.updated_at,
          label: g.name,
          value: g.id
        })
      )
    }
  },
  computed: {},
  components: {
    vSelect
  },
  mounted () {
    if (this.selectedCarrier) {
      this.carrierForSelect = this.mapingServiceCarrier()
      this.selectedCarrierService = this.carrierForSelect[0]
    }
  }
}
</script>

<style scoped lang="scss">
.payment-service {
  margin-top: 32px;
  &--items {
    display: flex;
    justify-content: center;
    transition: all 0.2s;
    .item {
      position: relative;
      margin-right: 32px;
      width: 160px;
      height: 160px;
      border: 1px solid $grey;
      border-radius: 4px;
      transition: all 0.2s;
      cursor: pointer;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .image-wrap {
        margin-top: 32px;
        width: 96px;
        height: 58px;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          height: 100%;
          width: 100%;
          fill: #336;
        }
      }
      h3 {
        margin-top: 23px;
        margin-bottom: 0;
        font-weight: 400;
        text-align: center;
        color: $main-dark;
      }
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0px 1px 4.75px 0.25px rgba(102, 102, 102, 0.2);
      }
      &.active {
        border: 1px solid $main-color;
      }
      .active-carrier {
        position: absolute;
        height: 24px;
        width: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        background-color: #052af0;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        top: -12px;
        right: -12px;
        svg {
          height: 13px;
          width: 13px;
          fill: white;
        }
      }
    }
  }
  &__select {
    margin-top: 64px;
    transition: all 0.2s;
    #select-carrier {
      position: relative;
    }
    &--title {
      h3 {
        text-align: center;
        margin-bottom: 32px;
        color: $main-dark;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $md) {
  .payment-service {
    &--items {
      justify-content: center;
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .payment-service {
    &--items {
      justify-content: center;
      flex-wrap: wrap;
      .item + .item {
        margin-top: 16px;
      }
      .item {
        width: 100%;
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0;
        h3 {
          margin-top: 0;
        }
        .image-wrap {
          width: 100px;
          height: 40px;
          margin-left: 0;
          margin-right: 24px;
          margin-top: 0;
          svg {
            height: 100%;
            width: 100%;
          }
        }
        &:hover {
          transform: translateY(0);
          box-shadow: none;
        }
      }
    }
  }
}
</style>
