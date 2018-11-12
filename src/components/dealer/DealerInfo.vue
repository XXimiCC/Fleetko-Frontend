<template>
  <div class="dealer-info">
    <div class="container">
      <div
        class="dealer-info--breadcrumbs breadcrumb-links"
        itemscope
        itemtype="http://schema.org/BreadcrumbList"
      >
        <router-link
          itemprop="itemListElement"
          itemtype="http://schema.org/ListItem"
          itemscope
          :to="{ name: 'home' }"
          tag="a"
        >
          <span itemprop="name">Home</span>
          <meta itemprop="position" content="1" />
        </router-link>
        <span class="breadcrumbs-slash">/</span>
        <span v-if="dealer" class="active">{{ dealer.name }}</span>
      </div>
      <div class="dealer-info--title" v-if="dealer">
        <h2 class="h2-secondary">{{ dealer.name }}</h2>
      </div>
      <div class="dealer-info--text" v-if="dealer && dealer.description">
        <p>{{ dealer.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dealerInfo',
  props: ['dealer']
}
</script>

<style scoped lang="scss">
.dealer-info {
  padding: 140px 0 32px 0;
  background: #f7fafc;
  &--title {
    margin-top: 32px;
    h2 {
      margin-bottom: 0;
    }
  }
  &--text {
    margin-top: 16px;
    font-family: $sours-sans-p-font;
    font-size: 14px;
    line-height: 19px;
    color: $paragraph;
  }
}
@media (min-width: $md) and (max-width: $lg) {
  .dealer-info {
    padding: 67px 0 32px 0;
  }
}

@media (min-width: $sm) and (max-width: $md) {
  .dealer-info {
    padding: 32px 0 32px 0;
  }
}

@media (min-width: $xs) and (max-width: $md) {
  .search {
    &__info {
      &--large {
        padding: 48px 0 32px 0;
      }
      .container-flex {
        flex-wrap: wrap;
      }
      &--text {
        width: 100%;
      }
      &--button {
        margin-top: 16px;
        justify-content: flex-start;
      }
    }
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .dealer-info {
    padding: 10px 0 32px 0;
    &--title {
      margin-top: 20px;
      h2 {
        font-size: 20px;
      }
    }
  }
  .search {
    &__info {
      &--text {
        line-height: 1;
        p {
          font-size: 20px;
          &:first-child {
            font-weight: 500;
          }
          &:last-child {
            margin-top: 18px;
            font-size: 16px;
            font-weight: 300;
          }
        }
      }
    }
  }
}
</style>
