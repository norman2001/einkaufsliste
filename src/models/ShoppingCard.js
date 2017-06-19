var AmpersandModel = require('ampersand-model')
var HeaderModel = require('./Header')
var FormModel = require('./Form')
var ListCollection = require('../collections/List')

module.exports = AmpersandModel.extend({
  extraProperties: 'ignore',
  props: {
    header: {
      type: 'state',
      required: true,
      default: function () {
        return new HeaderModel()
      }
    },

    form: {
      type: 'state',
      required: true,
      default: function () {
        return new FormModel()
      }
    }

  },
  session: {
  },
  derived: {

  },
  collections: {
    list: ListCollection
  }
})
