<template>
  <div
    class="order__header"
    v-if="$mq === 'lg' || $mq === 'xl'"
    @click="toggleOrderBody"
  >
    <div class="order__half">
      <div class="order__half--serial">
        <i
          aria-hidden="true"
          :class="{ rotate: open }"
          class="fa fa-angle-down"
        ></i>
        <span>№ {{ order.id }}</span>
        <router-link
          v-if="!isSingleOrder && order.status !== 'draft'"
          class="order__half--serial-link"
          :to="{ name: 'singleOrder', params: { id: order.id } }"
        >
          <svg-insert-link></svg-insert-link>
        </router-link>
      </div>

      <div class="order__half--date">
        <span>{{ orderDate(order.updated_at) }}</span>
      </div>

      <div
        class="order__half--method"
        @mouseleave="showDeliveryTooltip = false"
      >
        <tooltip
          v-if="showDeliveryTooltip"
          @mouseenter="showDeliveryTooltip = false"
          class="order__tooltip-method"
          :deliveryTooltip="true"
          :notification="deliveryTooltipText"
        >
        </tooltip>
        <div class="order__wrap-flex" @mouseenter="showDeliveryTooltip = true">
          <component
            :class="orderType(order.shipping_method)"
            v-bind:is="orderType(order.shipping_method)"
          >
          </component>
          <span class="type">Delivery:</span>
          <span>{{ order.shipping_method }}</span>
        </div>
      </div>
    </div>

    <div class="order__half">
      <div class="order__half--price">
        <span> $ {{ toDollarDecimal(totalCostHeader()) }}</span>
      </div>
      <div class="order__half--status">
        <span :class="order.status">{{ orderStatus(order.status) }}</span>
      </div>
      <div class="order__half--info" @mouseleave="showTooltip = false">
        <tooltip
          v-if="showTooltip"
          class="order__half--info--tooltip"
          :notification="setTooltipText()"
        ></tooltip>
        <div class="order__half--svg-wrap" @mouseenter="showTooltip = true">
          <svg-info-outline height="20" width="20"></svg-info-outline>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="header-responsive" @click="toggleOrderBody">
    <div class="header-responsive--mobile-price">
      <span> $ {{ toDollarDecimal(totalCostHeader()) }}</span>
    </div>

    <div class="header-responsive__half">
      <div class="header-responsive--arrow">
        <i
          aria-hidden="true"
          :class="{ rotate: open }"
          class="fa fa-angle-down"
        ></i>
      </div>
      <div class="header-responsive--info">
        <span class="header-responsive--info-number">№ {{ order.id }}</span>
        <router-link
          v-if="!isSingleOrder && order.status !== 'draft'"
          class="order__half--serial-link"
          :to="{ name: 'singleOrder', params: { id: order.id } }"
        >
          <svg-insert-link></svg-insert-link>
        </router-link>
        <span class="header-responsive--info-date">{{
          orderDate(order.updated_at)
        }}</span>
      </div>
      <div class="header-responsive--type">
        <div class="item type">
          <component
            :class="orderType(order.shipping_method)"
            v-bind:is="orderType(order.shipping_method)"
          >
          </component>
          <span class="type">Delivery:</span>
          <span>{{ order.shipping_method }}</span>
        </div>
        <div class="item price">
          <span> $ {{ toDollarDecimal(totalCostHeader()) }}</span>
        </div>
      </div>
    </div>

    <div class="header-responsive__half">
      <div class="header-responsive--status">
        <span :class="order.status">{{ orderStatus(order.status) }}</span>
      </div>
      <div
        class="header-responsive--tooltip-wrap"
        @mouseleave="showTooltip = false"
      >
        <tooltip
          v-if="showTooltip"
          :allignRight="$mq === 'sm' ? true : false"
          class="header-responsive--tooltip"
          :notification="setTooltipText()"
        >
        </tooltip>
        <div class="svg-wrap" @mouseenter="showTooltip = true">
          <svg-info-outline height="20" width="20"></svg-info-outline>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import tooltip from '../../notifications/ErrorBox'

export default {
  name: 'order-header',
  data () {
    return {
      open: false,
      tooltipObject: {
        type: 'order-toolbox',
        text: ''
      },
      showTooltip: false,
      showDeliveryTooltip: false,
      deliveryTooltipText: {
        type: 'order-toolbox',
        text:
          'Fleetko service provides three types of delivery. Freight - Your order will be delivered by freight to the specified address. Parcel - Your order will be delivered by chosen delivery service to the specified address. Pickup - you will be able to pick up your order from selected warehouse at a convenient time for you.'
      }
    }
  },
  props: ['order'],
  methods: {
    orderDate (date) {
      return moment(date).format('MM/DD/YYYY h:mm A')
    },
    orderType (type) {
      switch (type) {
        case 'parcel':
          return 'svg-parcel'

        case 'freight':
          return 'svg-freight'

        case 'pickup':
          return 'svg-pickup'
      }
    },
    orderStatus (status) {
      if (status === 'draft' && this.order.shipping_method === 'freight') {
        return 'pending review'
      } else if (
        status === 'draft' &&
        this.order.shipping_method === 'parcel'
      ) {
        return 'fetching rates'
      } else {
        return status.replace(/_/g, ' ')
      }
    },
    toggleOrderBody () {
      if (!this.isSingleOrder) {
        this.$emit('toggleOrderBody')
        this.open = !this.open
      }
    },
    totalCostHeader () {
      if (
        this.order.shipping_method === 'parcel' &&
        this.order.status === 'pending_payment'
      ) {
        return this.order.price + this.order.sales_tax_amount
      } else if (
        this.order.shipping_method === 'freight' &&
        this.order.status === 'draft'
      ) {
        return this.order.price + this.order.sales_tax_amount
      } else if (
        this.order.shipping_method === 'parcel' &&
        this.order.status === 'payment_expired'
      ) {
        return this.order.price + this.order.sales_tax_amount
      } else if (this.order.status === 'failed') {
        return this.order.price + this.order.sales_tax_amount
      } else {
        return this.order.total_cost
      }
    },

    setTooltipText () {
      const messages = {
        draft: [
          'Please wait while rates are been fetching. It will take less than a minute',
          'after what you will be able to pay the order.'
        ].join(' '),
        pending_payment: [
          'Order must be paid within 24 hours, otherwise',
          'the order will be assigned the Payment Expired status.'
        ].join(' '),
        processing:
          'Order is placed. Wait for confirmation from our sales manager.',
        processed: [
          'Order was successfully paid. Expect the',
          'arrival of the goods at the address specified by you.'
        ].join(' '),
        canceled: 'The order was canceled at the request of the client.',
        pending_review: [
          'We are looking for you the most profitable',
          'and fastest way of delivery. The shipping cost will',
          'be set in 24 hours after what you will be able to pay the order.'
        ].join(' '),
        failed: [
          'Sorry the technical error prevented the execution of the order.',
          'Please contact the support center for additional details.'
        ].join(' '),
        fulfilled:
          'The order was successfully completed. Thank you for using our services!',
        payment_expired: [
          'The order was not paid within 48 hours from the moment of order creation.',
          'Please contact the support center for additional details.'
        ].join(' '),
        abandoned: [
          'The order has been canceled by you.',
          'You can not perform any actions with the order.'
        ].join(' ')
      }

      return {
        type: 'order-toolbox',
        text: messages[this.order.status]
      }
    }
  },
  computed: {
    isSingleOrder () {
      return this.$route.name === 'singleOrder'
    }
  },
  components: {
    tooltip
  },
  mounted () {
    this.tooltipObject.text = this.setTooltipText()

    this.open = this.isSingleOrder
  }
}
</script>

<style scoped lang="scss">
.order {
  display: flex;
  border: 1px solid $interface-decoration-color;
  border-radius: 4px;
  &__tooltip-method {
    right: -8px;
  }
  &__wrap-flex {
    display: flex;
    align-items: center;
  }
  &__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
  }
  &__half {
    display: flex;
    align-items: center;
    &--serial {
      width: 121px;
      height: 24px;
      display: flex;
      align-items: center;
      i {
        font-size: 20px;
        height: 20px;
        transition: all 0.3s ease;
      }
      .rotate {
        transform: rotate(180deg);
      }
      span {
        margin-left: 16px;
        color: $main-dark;
        font-family: $sours-sans-p-font;
        font-size: 14px;
      }
    }
    &--serial-link {
      display: flex;
      align-items: center;
      margin-left: 8px;
      svg {
        width: 20px;
        fill: $main-grey;
      }
    }
    &--date {
      width: 125px;
      font-family: $sours-sans-p-font;
      color: $main-dark;
      font-size: 14px;
    }
    &--method {
      position: relative;
      margin-left: 64px;
      display: flex;
      align-items: center;
      text-transform: capitalize;
      .svg-pickup {
        width: 16px;
        fill: $svg-fill-tertiary;
      }
      .svg-parcel {
        width: 16px;
        height: 16px;
        fill: $svg-fill-tertiary;
      }
      .svg-freight {
        width: 16px;
        fill: $svg-fill-tertiary;
      }
      span {
        &.type {
          margin-left: 6px;
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $main-grey;
        }
        &:last-child {
          margin-left: 10px;
          font-family: $sours-sans-p-font;
          font-size: 14px;
          color: $main-dark;
        }
      }
    }
    &--price {
      display: flex;
      line-height: 1;
      span {
        font-family: $montserrat-font;
        color: $main-color;
        font-size: 16px;
        font-weight: 500;
      }
    }
    &--status {
      margin-left: 64px;
      width: 125px;
      display: flex;
      line-height: 1;
      span {
        font-family: $montserrat-font;
        color: $main-color;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
      }
      .draft {
        color: $main-dark;
      }
      .canceled {
        color: $main-grey;
      }
      .failed {
        color: $danger;
      }
      .fulfilled {
        color: $success;
      }
      .payment_expired {
        color: $danger;
      }
    }
    &--svg-wrap {
      display: flex;
    }
    &--info {
      position: relative;
      margin-left: 16px;
      display: flex;
      align-items: center;
      &--tooltip {
      }
      svg {
        fill: $svg-fill-tertiary;
      }
    }
  }
}

@media (min-width: $md) and (max-width: $lg) {
}

@media (min-width: $xs) and (max-width: $md) {
  .header-responsive {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    &--mobile-price {
      display: none;
    }
    &__half {
      display: flex;
      align-items: center;
    }
    &--arrow {
      margin-right: 16px;
      i {
        font-size: 20px;
        height: 20px;
        transition: all 0.3s ease;
      }
      .rotate {
        transform: rotate(180deg);
      }
    }
    &--info {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }
    &--info-number {
      font-family: $sours-sans-p-font;
      font-size: 14px;
      color: $main-dark;
    }
    &--info-date {
      font-family: $sours-sans-p-font;
      font-size: 14px;
      color: $main-dark;
    }
    &--type {
      margin-left: 64px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      .type {
        display: flex;
        align-items: center;
        line-height: 1;
        .svg-pickup {
          width: 16px;
          fill: $svg-fill-tertiary;
        }
        .svg-parcel {
          width: 16px;
          height: 16px;
          fill: $svg-fill-tertiary;
        }
        .svg-freight {
          width: 20px;
          fill: $svg-fill-tertiary;
        }
        span {
          &.type {
            margin-left: 6px;
            font-family: $sours-sans-p-font;
            font-size: 14px;
            color: $paragraph;
          }
          &:last-child {
            margin-left: 10px;
            font-family: $sours-sans-p-font;
            font-size: 14px;
            color: $main-dark;
            text-transform: capitalize;
          }
        }
      }
      .price {
        margin-top: 10px;
        line-height: 1;
        span {
          font-family: $montserrat-font;
          font-size: 16px;
          font-weight: 500;
          color: $main-color;
        }
      }
    }
    &--status {
      width: 125px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      line-height: 1;
      span {
        font-family: $montserrat-font;
        color: $main-color;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
      }
      .draft {
        color: $main-dark;
      }
      .cancelled {
        color: $paragraph;
      }
      .failed {
        color: $danger;
      }
      .fulfilled {
        color: $success;
      }
      .payment_expired {
        color: $danger;
      }
    }
    &--tooltip-wrap {
      margin-left: 16px;
      position: relative;
      display: flex;
      align-items: center;
      .svg-wrap {
        display: flex;
        align-items: center;
      }
      svg {
        fill: $svg-fill-tertiary;
        width: 16px;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .header-responsive {
    position: relative;
    flex-direction: column;
    align-items: flex-start;
    &__half {
      flex-direction: column;
      align-items: flex-start;
      &:last-child {
        margin-top: 8px;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: flex-end;
      }
    }
    &--arrow {
      margin-right: 0;
      position: absolute;
      top: 12px;
      right: 16px;
    }
    &--info {
      flex-direction: row;
      line-height: 1;
    }
    &--info-date {
      margin-left: 16px;
    }
    &--type {
      margin-top: 8px;
      margin-left: 0;
      .price {
        display: none;
      }
    }
    &--tooltip-wrap {
      margin-left: 0;
    }
    &--status {
      margin-left: 8px;
      justify-content: flex-start;
      span {
        font-size: 10px;
      }
    }
    &--mobile-price {
      position: absolute;
      display: block;
      right: 34px;
      bottom: 16px;
      line-height: 1;
      span {
        font-family: $montserrat-font;
        font-size: 16px;
        font-weight: 500;
        color: $main-color;
      }
    }
  }
}
</style>
