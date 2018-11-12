<template>
  <div class="stub">
    <div class="icon">
      <svg-shopping-cart v-if="cartIsFull"></svg-shopping-cart>
      <svg-cart-remove v-else></svg-cart-remove>
    </div>

    <div class="title">
      <p v-if="cartIsFull">The Cart Is Full!</p>
      <p v-else>The Stock Is Empty</p>
    </div>

    <div class="caption">
      If you have some questions, <br />
      please <span @click="goToContactUs" class="link">Contact Us</span>
    </div>

    <button @click="proceed" class="button-prime">
      <span class="animate">
        <svg-chevron></svg-chevron>
        <svg-chevron></svg-chevron>
        <svg-chevron></svg-chevron>
      </span>
      <span class="button-text">Proceed to checkout</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ShoppingStub',
  props: ['cartIsFull'],
  methods: {
    proceed () {
      this.$emit('closeModal')
      this.$router.push({ name: 'cartPage' })
    },
    goToContactUs () {
      this.$emit('closeModal')
      this.$router.push({ name: 'contactUs' })
    }
  }
}
</script>

<style lang="scss" scoped>
.stub {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  min-height: 333px;

  .link {
    color: $main-color;
    cursor: pointer;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    margin: 16px 0 24px 0;
    border-radius: 50%;
    background-color: rgba(20, 88, 235, 0.2);

    svg {
      width: 24px;
      height: 24px;
      fill: $main-color;
    }
  }

  .title {
    margin-bottom: 13px;
    font: 500 20px/26px $montserrat-font;
    color: #061a46;
  }

  .caption {
    margin-bottom: 33px;
    font: 14px/19px $sours-sans-p-font;
    color: #5c6578;
    text-align: center;
  }

  .button-prime {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-bottom: 15px;
    position: relative;
    .button-text {
      position: absolute;
      right: 14px;
    }
    &:hover svg {
      animation: proceed 0.75s alternate infinite;
    }
    .animate {
      position: absolute;
      top: 7px;
      left: -29px;
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
}
</style>
