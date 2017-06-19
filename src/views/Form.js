var AmpersandView = require('ampersand-view')
var app = require('ampersand-app')
var FormModel = require('../models/Form')

module.exports = AmpersandView.extend({
  initialize: function (opts) {
    console.log('form view initialize')
    var view = this
    view.model = new FormModel()

    // Controlleraufruf
    app.on('ShoppingCard:edit', function (model) {
      view.model = new FormModel(model.toJSON())
    })
  },
  template: function () {
        // Die Template-Funktion muss genau einen DOM-Node zurückgeben
    return document.getElementById('articleForm')
  },
      // Events sind der Eventlistener:
  events: {
        // 'Das Event' 'DOM-Selektor': 'Funktionsaufruf', ...
    'input #article-input': 'writeToArticle',
        // an Stelle von: 'document.querySelector('#article-input').addEventListener('oninput', writeToArticle)''
    'change #unit-select': 'writeToUnit',
    'input #piece-input': 'writeToPiece',
    'submit #input-submit': 'submit',
    'click #input-submit': 'submit'
  },
      // Die View beobachtet das Model.
      // Bindings schreiben die Werte aus dem Model zurück ins Formular (z.B. Wenn ein Eintrag editiert werden soll)
  bindings: {
        // Nimm die Werte von 'article' aus dem Model ...
    'model.article': {
          // vom Typ Value
      type: 'value',
          // und trage es am selektierten DOM-Node ein.
      selector: '#article-input'
    },
    'model.unit': {
      type: 'value',
      selector: '#unit-select'
    },
    'model.piece': {
      type: 'value',
      selector: '#piece-input'
    },
    'model.toggleButton': {
      type: 'booleanAttribute',
      selector: '#input-submit',
      name: 'disabled'
    }
  },

      // Schreibe Daten der Benutzerinteraktion ins (Form-) model:
  writeToArticle: function (e) {
        // Verhindert das Standardverhalten des Browsers, wenn eine Variable übergeben wurde
    if (e) e.preventDefault()
          // Referenziert auf die eigene Instanz eines Objekt
    var view = this
          // get element of event
    var source = e.srcElement
          // get value of element
    var value = source.value
          // check value
    if (value.length === 0) {
          // if empty unset model attribute
      view.model.unset('article')
    } else {
          // if not empty set model attribute equals value
      view.model.set('article', value)
    }
  },

  writeToUnit: function (e) {
    if (e) e.preventDefault()

    var view = this
    var source = e.delegateTarget || e.target || e.srcElement
    var value = source.children[source.selectedIndex].value
    if (value.length === 0) {
      view.model.unset('unit')
    } else {
      view.model.set('unit', value)
    }
  },

  writeToPiece: function (e) {
    if (e) e.preventDefault()
    var view = this
          // get element of event
    var source = e.delegateTarget || e.target || e.srcElement
          // get value of element
    var value = source.value
          // check value
    if (value.length === 0) {
          // if empty unset model attribute
      view.model.unset('piece')
    } else {
          // if not empty set model attribute equals value
      view.model.set('piece', value)
    }
  },

  submit: function (e) {
    if (e) e.preventDefault()

    var view = this
    view.model.save(view.model, {
            // https://ampersandjs.com/docs/#ampersand-rest-collection-fetch
      success: function (model, response, options) {
              // trigger() - wie ein Eventlistener, und hört auf das Ereignis 'ShoppingCard:addToCollections'
        app.trigger('ShoppingCard:addToCollection', model)
        view.model = new FormModel()
      }
    })
  }
})
