<template>
  <div class="empty-purchased">
    <div class="empty-purchased__image">
      <svg-playlist-add></svg-playlist-add>
    </div>

    <div class="empty-purchased__text">
      <h3 class="h3-secondary">No Purchased Goods</h3>
      <p class="paragraph-tertiary">
        You have not made any purchases yet. On this page you will have the
        opportunity to write a review for purchased goods after you make
        purchases.
      </p>
    </div>

    <router-link :to="{ name: 'home' }" class="empty-purchased__button">
      <button class="button-prime">Keep shopping</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'purchased-empty'
}
</script>

<style scoped lang="scss">
.empty-purchased {
  padding-top: 86px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background: #d0defb;
    border-radius: 100%;
    svg {
      width: 30px;
      height: 28px;
      fill: $main-color;
    }
  }
  &__text {
    margin-top: 32px;
    max-width: 300px;
    text-align: center;
  }
  &__button {
    margin-top: 32px;
    width: 200px;
  }
}

@media (max-width: $sm) {
  .empty-purchased {
    padding-top: 64px;
  }
}
</style>
