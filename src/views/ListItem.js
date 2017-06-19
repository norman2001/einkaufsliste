var AmpersandView = require('ampersand-view')

module.exports = AmpersandView.extend({
  template: function () {
    return document.querySelector('#rowTemplate').innerHTML
  },
  events: {

  },
  bindings: {
    'model._id': {
      type: 'attribute',
      selector: '.articleRow',
      name: 'id'
    },
    'model.article': {
      type: 'text',
      selector: '.article'
    },
    'model.unit': {
      type: 'text',
      selector: '.unit'
    },
    'model.piece': {
      type: 'text',
      selector: '.piece'
    }
  }
})
