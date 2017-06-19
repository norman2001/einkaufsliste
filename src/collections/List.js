var AmpersandRestCollection = require('ampersand-rest-collection')
var ListItemModel = require('../models/Form')

module.exports = AmpersandRestCollection.extend({
  model: ListItemModel,
  mainIndex: '_id',
  // 'include_docs=true' - automatically fetch and include the document which emitted each view entry
  url: 'http://127.0.0.1:5984/einkaufsliste/_design/einkaufsliste/_view/einkaufsliste/?include_docs=true',
  parse: function (response) {
    var collectionArray = []
    for (var i = 0; i < response.rows.length; i++) {
      var rowsObject = response.rows[i]
      var listItem = rowsObject.value

      collectionArray.push(listItem)
    }
    return collectionArray
  }
})
