var AmpersandApp = require('ampersand-app')
var ShoppingCardView = require('./views/ShoppingCard')
var ShoppingCardModel = require('./models/ShoppingCard')

module.exports = AmpersandApp.extend({
  init: function () {
    var app = this

    // publishing the global 'app' variable in dev scenarios only
    if (document.location.hostname.match(/localhost|127\.0\.0\.1|192\.168/) !== null) {
      window.app = app
    }

    app.initWidgets()

    return app
  },
  initWidgets: function () {
    var app = this

    var shoppingCardModel = new ShoppingCardModel()
     // initialize all main views
    app.ShoppingCardView = new ShoppingCardView({
      el: document.getElementById('shoppingCard'),
      model: shoppingCardModel
    })
    app.ShoppingCardView.render()
  }
})

// run it
module.exports.init()
