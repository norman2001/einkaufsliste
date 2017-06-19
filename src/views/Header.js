var AmpersandView = require('ampersand-view')

module.exports = AmpersandView.extend({
  template: function () {
    return
  },
  events: {

  },
  bindings: {
    'model.title': {
      type: 'text',
      selector: 'header'
    }
  }
})
