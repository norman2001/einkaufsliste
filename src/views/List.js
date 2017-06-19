var AmpersandView = require('ampersand-view')
var ItemView = require('./ListItem')
var app = require('ampersand-app')

module.exports = AmpersandView.extend({
  initialize: function (opts) {
    var view = this
    app.on('ShoppingCard:addToCollection', function (model) {
      view.collection.set(model, {remove: false})
    })
    app.on('ShoppingCard:delete', function (model) {
      model.destroy()
    })
  },
  template: function () {
    // view-template gibt immer genau 1 DOM-Element zurück
    return document.querySelector('#tableTail')
  },

  render: function (opts) {
        // render our template as usual
    this.renderWithTemplate(this)

        // call renderCollection with these arguments:
        // 1. collection
        // 2. which view to use for each item in the list
        // 3. which element within this view to use as the container
        // 4. options object (not required):
        //      {
        //          // function used to determine if model should be included
        //          filter: function (model) {},
        //          // boolean to specify reverse rendering order
        //          reverse: false,
        //          // view options object (just gets passed to item view's `initialize` method)
        //          viewOptions: {}
        //      }
        // returns the collection view instance

    this.renderCollection(this.collection, ItemView, this.el.querySelector('#tableEntry'))
    return this
  },

  events: {
    'click .iconPen': 'edit',
    'click .iconBin': 'delete'
  },
  bindings: {
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
  },

  edit: function (e) {
    if (e) e.preventDefault
    var elem = e.delegateTarget || e.target || e.srcElement
    var artRow = elem.parentNode
    var id = artRow.getAttribute('id')
    var view = this
    var model = view.collection.get(id)
    app.trigger('ShoppingCard:edit', model)
  },

  delete: function (e) {
    if (e) e.preventDefault
    var elem = e.delegateTarget || e.target || e.srcElement
    var artRow = elem.parentNode
    var id = artRow.getAttribute('id')
    var view = this
    var model = view.collection.get(id)
    app.trigger('ShoppingCard:delete', model)
  }
})
