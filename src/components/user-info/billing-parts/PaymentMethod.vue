<template>
  <div class="method">
    <div class="method__logo">
      <img :src="method.attributes.image" alt="Payment method logo" />
    </div>

    <div class="method__info" :class="{ mail: method.attributes.email }">
      {{
        method.attributes.email || `**** **** **** ${method.attributes.last4}`
      }}
    </div>

    <div class="method__date">{{ method.attributes.expires || '' }}</div>

    <div class="method__delete" @click="$emit('deleteHandler')">
      <svg-delete></svg-delete>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentMethod',
  props: ['method']
}
</script>

<style lang="scss" scoped>
.method {
  display: flex;
  align-items: center;
  max-width: 640px;
  height: 64px;
  margin: 8px 0;
  padding: 16px;
  box-sizing: border-box;
  border: 1px solid $grey;
  border-radius: 4px;

  &__logo {
    margin-right: 32px;
    img {
      width: 48px;
      height: 32px;
    }
  }

  &__info {
    font: 500 16px/22px $montserrat-font;
    color: $main-dark;
  }

  &__date {
    margin-left: 32px;
    font: 500 16px/22px $montserrat-font;
    color: $main-grey;
  }

  &__delete {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    margin-left: auto;
    cursor: pointer;
    fill: $dark-grey;

    &:hover {
      fill: $main-red;
      transition: 0.2s;
    }
  }
}

@media (max-width: $sm) {
  .method {
    &__logo {
      margin-right: 16px;
    }
    &__info {
      font: 500 12px/16px $montserrat-font;
      &.mail {
        min-width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &__date {
      margin-left: 16px;
      font: 500 12px/16px $montserrat-font;
    }
  }
}
</style>
