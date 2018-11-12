<template>
  <div>
    <div class="navbar">
      <app-header v-if="$mq === 'xl' || $mq === 'lg'"></app-header>
      <app-header-responsive
        v-if="$mq === 'md' || $mq === 'sm' || $mq === 'xs'"
      ></app-header-responsive>
    </div>
    <router-view></router-view>
    <app-footer></app-footer>
  </div>
</template>
<script>
import AppHeader from '@/components/parts/AppHeader'
import AppHeaderResponsive from '@/components/parts/AppHeaderResponsive'
import AppFooter from '@/components/parts/AppFooter'
import { mapGetters } from 'vuex'
export default {
  name: 'mainLayout',
  data () {
    return {}
  },
  watch: {},
  methods: {},
  components: {
    AppHeader,
    AppFooter,
    AppHeaderResponsive
  },
  computed: {
    ...mapGetters(['preloader'])
  },
  created () {}
}
</script>

<style lang="scss">
.navbar {
  padding: 0 !important;
  /*margin-bottom: 154px;*/
}
</style>
