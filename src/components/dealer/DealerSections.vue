<template>
  <div class="dealer-sections" :class="{ 'first-section': firstSection }">
    <div class="container">
      <div class="dealer-sections--title">
        <h2 class="h2-secondary">{{ section.name }}</h2>
      </div>
      <div class="dealer-sections--categories">
        <router-link
          :to="{
            name: 'catalog',
            params: { slug: category.slug },
            query: { dealers: $route.params.slug }
          }"
          class="dealer-sections--categories--category"
          :key="i"
          v-for="(category, i) in section.categories"
        >
          <category-card
            :counter="true"
            :textMaxWidth="
              $mq === 'sm' || $mq === 'md' || $mq === 'lg' ? '120px' : '100%'
            "
            :category="category"
          ></category-card>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import categoryCard from '@/components/common-components/CategoryCard'
export default {
  name: 'dealerSections',
  data () {
    return {
      categoryData: {
        name: 'Air & Electrical Coils',
        caption: 'enim quas tenetur'
      }
    }
  },
  props: ['section', 'firstSection'],
  components: {
    categoryCard
  }
}
</script>

<style scoped lang="scss">
.dealer-sections {
  margin-top: 48px;
  &--title {
    text-align: center;
    margin-bottom: 32px;
    h2 {
      margin-bottom: 0;
    }
  }
  &--categories {
    padding: 0 24px;
    display: flex;
    flex-wrap: wrap;

    &--category {
      margin-bottom: 16px;
      margin-right: 16px;
      flex: 0 0 calc(25% - 16px);
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}
@media (min-width: $md) and (max-width: $lg) {
  .dealer-sections {
    &--categories {
      &--category {
        margin-bottom: 16px;
        margin-right: 16px;
        flex: 0 0 calc(25% - 16px);
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
@media (min-width: $sm) and (max-width: $md) {
  .dealer-sections {
    &--categories {
      padding: 0;

      &--category {
        margin-bottom: 16px;
        margin-right: 0;
        flex: 0 0 25%;
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .first-section {
    margin-top: 32px;
  }
  .dealer-sections {
    margin-top: 32px;
    &--title {
      margin-bottom: 16px;
      h2 {
        margin-bottom: 0;
        font-size: 20px;
      }
    }
    &--categories {
      padding: 0;
      &--category {
        margin-bottom: 16px;
        margin-right: 0;
        flex: 0 0 33.3%;
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
