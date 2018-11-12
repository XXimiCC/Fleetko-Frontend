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
          <div class="empty-vehicle__row-image">
            <svg-delete-forever></svg-delete-forever>
          </div>
          <h3 class="h3-secondary">Clear Selected Filters</h3>
          <p class="paragraph-tertiary">
            You can clear all filters except the searched vehicle, after which
            all products in the category will be displayed.
          </p>

          <button @click="$emit('clearEmptyFilters')" class="button-prime">
            Clear Filters
          </button>
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
    flex: 0 0 50%;
    text-align: center;
    h3 {
      margin-bottom: 16px;
    }
    p {
      margin-bottom: 24px;
      max-width: 330px;
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

@media (min-width: $xs) and (max-width: 800px) {
  .empty-vehicle {
    margin-bottom: 128px;
    &__row {
      flex-wrap: wrap;
    }
    &__row-element {
      flex: 0 0 100%;
      + .empty-vehicle__row-element {
        margin-top: 40px;
      }
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
