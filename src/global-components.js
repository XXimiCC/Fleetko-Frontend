import Vue from 'vue'
import _ from 'lodash'

const requireComponent = require.context(
  // The relative path of the components folder
  './components/_global',
  // Whether or not to look in subfolders
  true,
  // The regular expression used to match base component filenames
  // Note that they should all begin with a specific prefix such as Base or Svg
  /(Base|Svg)[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponent(fileName)

  // Get PascalCase name of component (allows the script to gracefully handle irregular code style)
  const componentName = _.upperFirst(
    _.camelCase(
      // Strip the location and extension from the filename
      fileName.split('/').pop().replace(/\.[^/.]+$/, '')
    )
  )

  // Register component globally
  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})
