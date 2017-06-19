var AmpersandModel = require('ampersand-model')

module.exports = AmpersandModel.extend({
  props: {
    title: {
      type: 'string',
      required: true,
      default: 'Einkaufsliste'
    }
  },
  session: {},
  derived: {}
})

