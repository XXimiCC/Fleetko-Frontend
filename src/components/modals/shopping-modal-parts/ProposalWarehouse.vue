<template>
  <div class="warehouse">
    <div class="warehouse__titles">
      <span class="warehouse__title">Warehouse</span>
      <span class="warehouse__qty">Qty</span>
    </div>

    <div class="warehouse__info">
      <div class="warehouse__address">
        <p class="warehouse__name">{{ warehouse.city }}</p>
        <p>
          {{ warehouse.address_line_1 }} {{ warehouse.city }},
          {{ warehouse.state }} {{ warehouse.zip }}
        </p>
      </div>

      <div class="warehouse__amount">{{ quantity }}</div>

      <div @click="$emit('editProposal')" class="warehouse__edit">
        <button class="button-prime"><svg-edit></svg-edit></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProposalWarehouse',
  props: ['warehouse', 'quantity']
}
</script>

<style lang="scss" scoped>
.warehouse {
  margin-top: 18px;
  margin-bottom: 16px;
  &__titles {
    font: 600 14px/19px $sours-sans-p-font;
    margin-bottom: 8px;
  }
  &__title {
    margin-right: 109px;
  }
  &__info {
    display: flex;
    flex-flow: row nowrap;
    padding: 12px 16px;
    margin-bottom: 14px;
    border-radius: 4px;
    background-color: #d0defb;
  }
  &__address {
    width: 147px;
    padding-right: 8px;
    font: 10px/14px $montserrat-font;
  }
  &__name {
    font: 500 12px/16px $montserrat-font;
    margin-bottom: 10px;
  }
  &__amount {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__edit {
    display: block;
    width: 32px;
    margin: -12px -16px -12px auto;
    button {
      height: 100%;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    svg {
      width: 18px;
      height: 18px;
      fill: #fff;
    }
  }
}
</style>
