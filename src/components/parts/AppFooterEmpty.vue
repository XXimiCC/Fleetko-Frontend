<template>
  <div class="footer-empty">
    <p class="paragraph-tertiary">
      @2015-2017 <span>www.truckandshop.com</span> Truck&shop Trucks Spare Parts
      and Services
    </p>
  </div>
</template>

<script>
export default {
  name: 'app-footer-empty'
}
</script>

<style scoped lang="scss">
.footer-empty {
  height: 80px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px -3px 9.5px 0px rgba(102, 102, 102, 0.2);
  p {
    margin-bottom: 0;
    span {
      margin: 0 8px;
      position: relative;
      &:before {
        position: absolute;
        left: -8px;
        top: 8px;
        content: '';
        background: $main-grey;
        border-radius: 100%;
        width: 4px;
        height: 4px;
      }
      &:after {
        position: absolute;
        right: -8px;
        top: 8px;
        content: '';
        background: $main-grey;
        border-radius: 100%;
        width: 4px;
        height: 4px;
      }
    }
  }
}
@media (min-width: $xs) and (max-width: $sm) {
  .footer-empty {
    padding: 0 26px;
    line-height: 19px;
  }
}
</style>
