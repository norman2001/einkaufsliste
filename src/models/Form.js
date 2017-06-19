var AmpersandModel = require('ampersand-model')

module.exports = AmpersandModel.extend({
  ajaxConfig: function () {
    return {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      }
    }
  },
  urlRoot: 'http://127.0.0.1:5984/einkaufsliste/',

  parse: function (resp) {
    // complete post response
    if (resp._id) return resp
    // updated post response
    if (resp.rev) this._rev = resp.rev
    if (resp.id) this._id = resp.id
  },
  url: function () {
    var model = this

    if (model.isNew()) return model.urlRoot

    return model.urlRoot + '/' + model._id + '?rev=' + model._rev
  },
  isNew: function () {
    if (this._id && this._rev) return false

    return true
  },

  // Lege die Eigenschaften des Models fest:
  props: {
    _id: {
      type: 'string'
    },
    _rev: {
      type: 'string'
    },
    article: {
      type: 'string'
    },
    unit: {
      type: 'string'
    },
    piece: {
      type: 'string'
    },
    type: {
      type: 'string',
      required: true,
      default: 'artikel'
    }
  },

  session: {

  },
  derived: {
    toggleButton: {
      // deps = Dependencies / Abhängigkeiten von ['...', ...]
      deps: ['article', 'unit', 'piece'],
      fn: function () {
        var bonbon = this
        // wenn bonbon.article nicht gesetzt ist, return true
        if (!bonbon.article) return true
        if (!bonbon.unit) return true
        if (!bonbon.piece) return true
        console.log(bonbon)
        return false
      }
    }
  }
})
