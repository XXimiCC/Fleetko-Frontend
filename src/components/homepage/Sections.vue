<template>
  <div
    class="col-xl-12 scoped-response-col d-none d-sm-none d-md-none d-lg-block d-xl-block"
  >
    <div class="container scoped-response-section">
      <div class="row scoped-row-section">
        <div class="col-md-12 margin-menu">
          <div class="row">
            <section-item
              :section="section"
              :key="section.id"
              v-for="(section, i) in sections"
              >Sections</section-item
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SectionItem from '@/components/homepage/SectionItem'

export default {
  name: 'Sections',
  data () {
    return {}
  },
  props: ['sections'],
  methods: {},
  mounted () {},
  components: {
    SectionItem
  }
}
</script>

<style lang="scss">
.menu-items {
  border-radius: 4px;
  overflow: hidden;
  img {
    position: absolute;
    height: 160px;
    border-radius: 4px 4px 4px 4px;
  }
}
.margin-menu {
  margin-top: 16px;
  margin-bottom: 48px;
  .style-menu {
    padding: 16px;
    border-radius: 10px;
  }
}
.triangle-topleft {
  border-radius: 4px 0px 0px 0px;
  height: 0;
  border-top: 160px solid #0488e4;
  border-right: 60px solid transparent;
  opacity: 0.98;
  width: 158px;
  z-index: 752;
  .text-h3 {
    position: absolute;
    top: 29px;
    left: 32px;
    font-size: $normal-fs-paragraph;
    font-family: $montserrat-font;
    color: rgb(255, 255, 255);
    font-weight: 600;
    text-transform: uppercase;
    line-height: 1;
    text-align: left;
    z-index: 754;
  }
  .text-show {
    position: absolute;
    bottom: 32px;
    left: 32px;
    font-size: $small-fs-paragraph;
    font-family: $sours-sans-p-font;
    color: rgb(255, 255, 255);
    line-height: 1;
    text-align: left;
  }
}
</style>
