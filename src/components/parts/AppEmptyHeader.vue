<template>
  <div>
    <div class="header">
      <div class="container">
        <div class="item">
          <router-link :to="{ name: 'home' }">
            <img class="logo-img" src="~@/assets/logo.svg" alt="logo" />
          </router-link>
        </div>

        <div class="item">
          <span class="header__phone">800-505-3274</span><span>Support</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyHeader'
}
</script>

<style lang="scss" scoped="">
.header {
  display: flex;
  align-items: center;
  height: 88px;
  box-shadow: 0 0 9.5px 0.5px rgba(102, 102, 102, 0.2);
  background: white;

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo-img {
    height: 30px;
    width: 125px;
    cursor: pointer;
  }

  span {
    font: 14px $sours-sans-p-font;
    color: $paragraph;
  }

  span + span {
    margin-left: 32px;
  }
}

@media (max-width: $xssm) {
  .header {
    height: 64px;

    &__phone {
      display: none;
    }
  }
}
</style>
