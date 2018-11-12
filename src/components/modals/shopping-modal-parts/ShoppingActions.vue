<template>
  <div class="actions" :class="{ manual: manual }">
    <div class="total">
      <div class="total__label">Total:</div>
      <div class="total__value">${{ price }}</div>
    </div>

    <span v-if="notValid && !manual" class="error-message">{{
      errorEmptyFields
    }}</span>
    <span v-if="notSelected && !productChosen" class="error-message">{{
      errorNotSelected
    }}</span>
    <span v-if="exceededCart" class="error-message">
      {{
        `The cart is full. Please delete ${cartItemsLimit} item${
          cartItemsLimit > 1 ? 's' : ''
        }`
      }}
    </span>

    <div class="buttons">
      <button @click="proceed" class="button-prime">
        <span class="animate">
          <svg-chevron></svg-chevron>
          <svg-chevron></svg-chevron>
          <svg-chevron></svg-chevron>
        </span>
        <span class="button-text">proceed to checkout</span>
      </button>

      <button @click="addToCart" class="button-second">
        <svg-shopping-cart></svg-shopping-cart>
        <span class="button-text">add to cart</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShoppingActions',
  props: ['manual', 'price', 'notValid', 'exceededCart', 'cartMaxSize'],
  data () {
    return {
      notSelected: false,
      errorEmptyFields:
        'Fill the fields and click ADD or choose Manual Selection',
      errorNotSelected: 'Choose any product'
    }
  },
  computed: {
    productChosen () {
      const chosen = parseInt(this.price)
      // eslint-disable-next-line
      if (chosen) this.notSelected = false

      return chosen
    },
    cartItemsLimit () {
      return Math.abs(this.cartMaxSize - this.exceededCart)
    }
  },

  methods: {
    proceed () {
      if (this.productChosen) {
        this.$emit('proceed')
      } else {
        this.notSelected = true
      }
    },

    addToCart () {
      if (this.productChosen) {
        this.$emit('add')
      } else {
        this.notSelected = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.actions {
  padding-top: 12px;
  .total {
    display: flex;
    justify-content: space-between;
    margin-bottom: 22px;
    font: 500 16px $montserrat-font;
    &__label {
      margin-right: 32px;
    }
    &__value {
      color: $main-color;
    }
  }

  .error-message {
    display: block;
    position: relative;
    bottom: 10px;
    margin-bottom: -2px;
    font-size: 12px;
    color: $main-red;
    font-weight: 400;
  }
  .button-prime {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .button-text {
      position: relative;
      right: 8px;
    }
    &:hover svg {
      animation: proceed 0.75s alternate infinite;
    }
    .animate {
      position: relative;
      top: 1px;
      right: 14px;
      svg {
        position: relative;
        width: 24px;
        height: 24px;
        fill: #fff;
        transform: rotate(270deg);
        &:nth-child(1) {
          left: 36px;
          opacity: 0.5;
          z-index: 2;
        }
        &:nth-child(2) {
          left: 18px;
          opacity: 0.7;
          z-index: 1;
          animation-delay: 0.25s;
        }
        &:nth-child(3) {
          animation-delay: 0.5s;
        }
      }
      @keyframes proceed {
        from {
          opacity: 1;
        }
        to {
          opacity: 0.1;
        }
      }
    }
  }
  .button-second {
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      margin-right: 14px;
      fill: $main-color;
    }
  }
}

.actions.manual {
  padding-bottom: 32px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(180, 186, 199, 0.3);

  .total {
    display: flex;
    justify-content: flex-end;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    .button-prime {
      order: 1;
    }
    button {
      width: 47%;
    }
  }
}

@media (max-width: 648px) {
  .actions.manual {
    border: none;
    padding-bottom: 0;
    margin-bottom: 0;
    .total {
      justify-content: space-between;
    }

    .buttons {
      flex-direction: column;
      .button-prime {
        order: initial;
      }
      button {
        width: 100%;
      }
    }
  }
}
</style>
