var AmpersandView = require('ampersand-view')
var FormView = require('./Form')
var ListView = require('./List')

module.exports = AmpersandView.extend({
  initialize: function (opts) {
    var view = this
    // Holt die Einträge aus der Couch
    view.model.list.fetch()
  },
  template: function () {
    return document.getElementById('shoppingCard')
  },
  subviews: {
    form: {
      selector: '#articleForm',
      waitFor: 'model.form',
      prepareView: function (el) {
        return new FormView({
          el: el,
          model: this.model.form
        })
      }
    },
    list: {
      selector: '#tableTail',
      waitFor: 'model.list',
      prepareView: function (el) {
        return new ListView({
          el: el,
          collection: this.model.list
        })
      }
    }
  }
})
