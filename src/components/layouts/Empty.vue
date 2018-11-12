<template>
  <div>
    <header-empty></header-empty>
    <router-view></router-view>
    <app-footer></app-footer>
  </div>
</template>
<script>
import HeaderEmpty from '@/components/parts/AppEmptyHeader'
import AppFooter from '@/components/parts/AppFooter'

export default {
  name: 'emptyLayout',
  components: {
    AppFooter,
    HeaderEmpty
  },
  computed: {}
}
</script>
