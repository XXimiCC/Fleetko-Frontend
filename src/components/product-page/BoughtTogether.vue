<template>
  <div class="buy-together">
    <div class="container">
      <h2 class="h2-secondary buy-together__title">
        Frequently bought together
      </h2>
      <div class="col-xl-12">
        <div class="row">
          <product-card
            v-for="(product, i) in products"
            :key="i"
            view="column"
            :good="product"
            class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6"
          >
          </product-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from '@/components/common-components/ProductCard'
export default {
  name: 'BuyTogether',
  data () {
    return {
      products: [
        {
          name: 'Test',
          picture: 'popular.png',
          raiting: 3,
          id: 1,
          dealer: 'Rozetka',
          views: 2345,
          price: 200.23,
          description: 'werwefwwerfqwefqwdfqwfdqwf'
        },
        {
          name: 'Test',
          picture: 'popular.png',
          raiting: 3,
          id: 1,
          dealer: 'Volvo',
          views: 2345,
          price: 200.23,
          description: 'werwefwwerfqwefqwdfqwfdqwf'
        },
        {
          name: 'Test',
          picture: 'popular.png',
          raiting: 3,
          id: 1,
          dealer: 'KTM',
          views: 2345,
          price: 200.23,
          description: 'werwefwwerfqwefqwdfqwfdqwf'
        },
        {
          name: 'Test',
          picture: 'popular.png',
          raiting: 3,
          id: 1,
          dealer: 'Catepillar',
          views: 2345,
          price: 200.23,
          description: 'werwefwwerfqwefqwdfqwfdqwf'
        }
      ]
    }
  },
  methods: {},
  mounted () {},
  components: {
    ProductCard
  }
}
</script>
<style lang="scss" scoped="">
.buy-together {
  margin-top: 64px;
  margin-bottom: 133px;
  &__title {
    margin-bottom: 52px;
  }
}

@media (min-width: $xs) and (max-width: $sm) {
  .buy-together {
    &__title {
      font-size: 24px;
    }
  }
}
</style>
