<template>
  <div class="container">
    <div class="empty-vehicle">
      <div class="empty-vehicle__column">
        <div class="empty-vehicle__image">
          <img :src="imageSrc('svg-empty-box.svg')" alt="" />
        </div>
        <h2 class="h2-secondary">The List Is Empty</h2>
        <p class="paragraph-tertiary paragraph-lg">
          There are no products for this category for the selected vehicle.
          Choose another category, or another car. You can see the goods in
          other categories for your car.
        </p>
      </div>
      <div class="empty-vehicle__row">
        <div class="empty-vehicle__row-element">
          <div class="empty-vehicle__row-image">
            <svg-envelope-fill></svg-envelope-fill>
          </div>
          <h3 class="h3-secondary">Have Any Questions</h3>
          <p class="paragraph-tertiary">
            Use our feedback form and we will answer any questions you are
            interested in.
          </p>

          <router-link :to="{ name: 'contactUs' }">
            <button class="button-prime">Contact us</button>
          </router-link>
        </div>

        <div class="empty-vehicle__row-element">
          <div class="empty-vehicle__row-image"><svg-truck></svg-truck></div>
          <h3 class="h3-secondary">Look For Another Vehicle</h3>
          <p class="paragraph-tertiary">
            View offers in this category for another truck you may need. Make
            sure you select the correct data.
          </p>

          <button @click="$emit('changeEmptyVehicle')" class="button-prime">
            Change Vehicle
          </button>
        </div>

        <div class="empty-vehicle__row-element">
          <div class="empty-vehicle__row-image"><svg-home></svg-home></div>
          <h3 class="h3-secondary">Go Back To The Home Page</h3>
          <p class="paragraph-tertiary">
            You will be able to view all sections and categories and re-search
            for needed vehicle.
          </p>

          <router-link :to="{ name: 'home' }">
            <button class="button-prime">Go to the home page</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/mixins/utils'
export default {
  name: 'empty-result-vehicle',
  mixins: [utils]
}
</script>

<style scoped lang="scss">
.empty-vehicle {
  margin-bottom: 128px;
  margin-top: 112px;
  &__column {
    margin-bottom: 82px;
    display: flex;
    flex-direction: column;
    align-items: center;
    h2 {
      margin-bottom: 24px;
    }
    p {
      max-width: 420px;
      text-align: center;
    }
  }
  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__row-element {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 0 0 33.3%;
    text-align: center;
    h3 {
      margin-bottom: 16px;
    }
    p {
      margin-bottom: 24px;
      max-width: 320px;
    }
    button {
      width: 200px;
    }
  }
  &__row-image {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 22px;
    width: 48px;
    height: 48px;
    border-radius: 100%;
    background: #d0defb;
    svg {
      width: 24px;
      fill: $main-color;
    }
  }
  &__image {
    margin-bottom: 32px;
    img {
      width: 160px;
    }
  }
}

@media (min-width: 800px) and (max-width: $md) {
  .empty-vehicle {
    margin-bottom: 128px;
    &__row-element {
      h3 {
        font-size: 16px;
        line-height: 21px;
      }
      p {
        height: 60px;
        font-size: 14px;
        line-height: 19px;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: 800px) {
  .empty-vehicle {
    margin-bottom: 128px;
    &__row {
      flex-wrap: wrap;
    }
    &__column {
      h2 {
        font-size: 20px;
        line-height: 26px;
      }
      p {
        font-size: 14px;
        line-height: 19px;
      }
    }
    &__row-element {
      flex: 0 0 100%;
      + .empty-vehicle__row-element {
        margin-top: 40px;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $xssm) {
  .empty-vehicle {
    &__column {
      p {
        max-width: 80%;
      }
    }
    &__image {
    }
  }
}
</style>
