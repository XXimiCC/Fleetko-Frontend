<template>
  <div class="stub">
    <div class="stub__icon">
      <svg-playlist-add v-if="type === 'resale'"></svg-playlist-add>
      <svg-credit-card v-if="type === 'payment'"></svg-credit-card>
    </div>
    <div class="stub__caption">
      {{
        type === 'payment'
          ? 'You have no payment methods'
          : 'You have no resale certificates'
      }}
    </div>
    <div class="stub__info">
      {{
        type === 'payment'
          ? 'After you make a successful payment using our store, you will be able to manage your payment methods.'
          : 'If you have the resale certificate, you could add it and be tax free while creating and paying orders using our store.'
      }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResaleStub',
  props: ['type']
}
</script>

<style lang="scss" scoped>
.stub {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  margin: 64px auto -8px auto;
  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 100%;
    background-color: #d0defb;
    svg {
      fill: $main-color;
    }
  }
  &__caption {
    margin: 24px auto 16px auto;
    font: 500 20px/26px $montserrat-font;
    color: $main-dark;
    text-align: center;
  }
  &__info {
    max-width: 350px;
    text-align: center;
    font: 14px/19px $sours-sans-p-font;
    color: $dark-grey;
  }
}

@media (max-width: $xssm) {
  .stub {
    margin: 32px auto -8px auto;
    .status {
      min-width: 154px;
    }
  }
}
</style>
