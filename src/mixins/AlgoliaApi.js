export const AlgoliaApi = {
  methods: {
    updateAlgoly () {
      this.searchCategories.refresh()
      this.searchDealers.refresh()
      this.searchProducts.refresh()
      this.searchVehicles.refresh()
    }
  }
}
