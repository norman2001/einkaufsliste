document.querySelector('#artikelForm').addEventListener('keyup', toggleButton)
document.querySelector('#artikelForm').addEventListener('change', toggleButton)
document.querySelector('#artikelForm').addEventListener('submit', handleFormSubmit)
document.querySelector('#tableEntry').addEventListener('click', handleRowClick)
window.addEventListener('load', loadFile)

function loadFile () {
  var xhr = new XMLHttpRequest()

  xhr.addEventListener('readystatechange', function () {
    if (xhr.readyState === 4) {
      readResultContent(JSON.parse(xhr.responseText))
    }
  })

  xhr.open('GET', 'http://127.0.0.1:5984/einkaufsliste/_design/einkaufsliste/_view/einkaufsliste')
  xhr.setRequestHeader('accept', 'application/json')

  xhr.send(null)
}

function readResultContent (content) {
  for (var i = 0; i < content.rows.length; i++) {
    var rowsObject = content.rows[i]
    var value = rowsObject.value

    var menge = value.menge
    var einheit = value.einheit
    var artikel = value.artikel
    var id = value._id
    var rev = value._rev

    // Selektiere den DOM-Node tableTail und weise es der Variable table zu
    var table = document.querySelector('#tableEntry')
      // call function createNewRow und gib mir die Werte der 'keys' (artikel, einheit, menge)
    var newRow = createNewRow(artikel, einheit, menge, id, rev)
      // Appending new row to existing container (visible)
    table.appendChild(newRow)
  }
}

function toggleButton (e) {
  var form = this
  var allFieldsNotEmpty = true
  var button = form.querySelector('#input-absenden')

  // Select all input fields
  var inputArtikel = form.querySelector('#artikel-eingeben')
  var selectEinheit = form.querySelector('#einheit-auswaehlen')
  var inputMenge = form.querySelector('#menge-eingeben')

  // Read values from fields
  var values = []
  values.push(inputArtikel.value)
  var einheit = selectEinheit.children[selectEinheit.selectedIndex].value
  values.push(einheit)
  values.push(inputMenge.value)

  // Check if all fields are filled
  for (var i = 0; i < values.length; i++) {
    if (values[i].length === 0) {
      allFieldsNotEmpty = false
      break
    }
  }
  // Activate or deactivate button
  if (allFieldsNotEmpty) {
    button.removeAttribute('disabled')
  } else {
    button.setAttribute('disabled', 'disabled')
  }
}

function createNewRow (artikel, einheit, menge, id, rev) {
  var newRow = document.createElement('div')
  newRow.classList.add('artikelRow', 'row')
  newRow.setAttribute('id', id)
  newRow.setAttribute('rev', rev)

  var newCheckDiv = document.createElement('div')
  newCheckDiv.classList.add('check', 'col-sm-1', 'col-md-1', 'col-lg-1')
  var newCheckbox = document.createElement('input')
  newCheckbox.setAttribute('type', 'checkbox')
  newCheckbox.setAttribute('id', 'checkbox')
  var newLabel = document.createElement('label')
  newLabel.htmlFor = 'checkbox'
  newLabel.textContent = 'OK'

  newRow.appendChild(newCheckDiv)
  newCheckDiv.appendChild(newCheckbox)
  newCheckDiv.appendChild(newLabel)

  var newEintragDiv = document.createElement('div')
  newEintragDiv.classList.add('eintrag', 'col-sm-5', 'col-md-5', 'col-lg-5')
  var newMengeSpan = document.createElement('span')
  newMengeSpan.classList.add('menge')
  newMengeSpan.textContent = menge
  var newEinheitSpan = document.createElement('span')
  newEinheitSpan.classList.add('einheit')
  newEinheitSpan.textContent = einheit
  var newArtikelSpan = document.createElement('span')
  newArtikelSpan.classList.add('artikel')
  newArtikelSpan.textContent = artikel

  newRow.appendChild(newEintragDiv)
  newEintragDiv.appendChild(newMengeSpan)
  newEintragDiv.appendChild(newEinheitSpan)
  newEintragDiv.appendChild(newArtikelSpan)

  var newPenDiv = document.createElement('div')
  newPenDiv.classList.add('iconPen', 'hidden-xs', 'hidden-sm', 'col-md-1', 'col-lg-1')
  var newPencilButton = document.createElement('i')
  newPencilButton.classList.add('fa', 'fa-pencil')
  newPencilButton.setAttribute('data-type', 'edit')

  newRow.appendChild(newPenDiv)
  newPenDiv.appendChild(newPencilButton)

  var newBinDiv = document.createElement('div')
  newBinDiv.classList.add('iconBin', 'hidden-xs', 'hidden-sm', 'col-md-1', 'col-lg-1')
  var newBinButton = document.createElement('i')
  newBinButton.classList.add('fa', 'fa-trash')
  newBinButton.setAttribute('data-type', 'delete')

  newRow.appendChild(newBinDiv)
  newBinDiv.appendChild(newBinButton)

  return newRow
}

function handleFormSubmit (e) {
  // Prevent submit and reload by browser
  e.preventDefault()
  // Extracting user data from fields
  var form = this // Wir sitzen auf dem Form
  var artikel = form.querySelector('#artikel-eingeben').value
  // DOM-Node = 'select' (HTML-Code)
  var selectEinheit = form.querySelector('#einheit-auswaehlen')
  // DOM-Nodes = 'options' (HTML-Code)
  var options = selectEinheit.children
  // Currently selected index of 'options'
  var selectedIndex = selectEinheit.selectedIndex
  // Read value from selected option tag
  var einheit = options[selectedIndex].value

  var menge = form.querySelector('#menge-eingeben').value
  var hiddenId = form.querySelector('#formHiddenId')
  var hiddenRev = form.querySelector('#formHiddenRev')

  if (!hiddenId.value) {
    var submitObj = {
      artikel: artikel,
      einheit: einheit,
      menge: menge,
      type: 'artikel'
    }
    sendFormToCouch(JSON.stringify(submitObj))
  }
  else {
    var updateObj = {
      _id: hiddenId.getAttribute('value'),
      _rev: hiddenRev.getAttribute('value'),
      artikel: artikel,
      einheit: einheit,
      menge: menge,
      type: 'artikel'
    }
    updateDocInCouch(JSON.stringify(updateObj))
  }
  // Clearing input fields
  form.reset()
  hiddenId.setAttribute('value', '')
  hiddenRev.setAttribute('value', '')
    // Set cursor into first input field
  form.querySelector('#artikel-eingeben').focus()
}

function sendFormToCouch (obj) {
  var xhr = new XMLHttpRequest()
  xhr.withCredentials = true

  xhr.addEventListener('readystatechange', function () {
    if (xhr.readyState === 4) {
      var response = JSON.parse(xhr.response)
      var content = JSON.parse(obj)

      var table = document.querySelector('#tableEntry')
      var row = createNewRow(content.artikel, content.einheit, content.menge, response.id, response.rev)
      table.appendChild(row)
    }
  })

  xhr.open('POST', 'http://127.0.0.1:5984/einkaufsliste')
  xhr.setRequestHeader('content-type', 'application/json')
  xhr.setRequestHeader('accept', 'application/json')

  xhr.send(obj)
}

function updateDocInCouch (updateObj) {
  var xhr = new XMLHttpRequest()
  xhr.withCredentials = true

  var content = JSON.parse(updateObj)
  xhr.addEventListener('readystatechange', function () {
    if (xhr.readyState === 4) {
      var response = JSON.parse(xhr.response)

      // var row = document.querySelector('#tableEntry')
      updateRow(content.artikel, content.einheit, content.menge, response.id, response.rev)
    }
  })

  xhr.open('PUT', 'http://127.0.0.1:5984/einkaufsliste/' + content._id)
  xhr.setRequestHeader('content-type', 'application/json')
  xhr.setRequestHeader('accept', 'application/json')

  xhr.send(updateObj)
}

function updateRow (artikel, einheit, menge, id, rev) {
  var idNode = document.querySelector("[id='" + id + "']")
  idNode.setAttribute('rev', rev)

  idNode.querySelector('.artikel').textContent = artikel

  idNode.querySelector('.einheit').textContent = einheit

  idNode.querySelector('.menge').textContent = menge
}

function handleRowClick (e) {
  var button = e.srcElement
    // Wenns nicht der Klick auf den Button war:
  if (!button) return
    // If source element is 'Delete' button (data-type="delete")
    // https://wiki.selfhtml.org/wiki/Data-Attribut
  var row = getRowOfButton(button)
  if (button.dataset.type === 'delete') {
    if (row) queryDelete(row)
  }
  // If source element is 'Edit' button
  if (button.dataset.type === 'edit') {
    if (row) {
      var values = getValuesFromRow(row)
      // Name für neue Funktion wählen und aufrufen
      insertValuesIntoForm(values)
    }
  }
}

function queryDelete (row) {
  var query = window.confirm('Eintrag wirklich löschen?')
  if (query === true) {
    deleteDocInCouch(row)
  }
}

function deleteDocInCouch (row) {
  var xhr = new XMLHttpRequest()
  xhr.withCredentials = true

  xhr.addEventListener('readystatechange', function () {
    if (xhr.readyState === 4) {
      deleteRow(row)
    }
  })

  xhr.open('DELETE', 'http://127.0.0.1:5984/einkaufsliste/' + row.id + '?rev=' + row.getAttribute('rev'))
  xhr.setRequestHeader('accept', 'application/json')

  xhr.send()
}

function deleteRow (row) {
  row.remove()
}

function insertValuesIntoForm (values) {
  var form = document.querySelector('.formRow')
  var inputArtikel = form.querySelector('#artikel-eingeben')
  inputArtikel.value = values[0]

  var selectEinheit = form.querySelector('#einheit-auswaehlen')
  var options = selectEinheit.querySelectorAll('option')
  var einheit = values[1]

  for (var i = 0; i < options.length; i++) {
    var optionNode = options[i]
    var optionValue = optionNode.getAttribute('value')
      //
    if (einheit === optionValue) {
      selectEinheit.selectedIndex = i
      break
    }
  }

  var inputMenge = form.querySelector('#menge-eingeben')
  inputMenge.value = values[2]

  var hiddenId = form.querySelector('#formHiddenId')
  hiddenId.value = values[3]

  var hiddenRev = form.querySelector('#formHiddenRev')
  hiddenRev.value = values[4]
}

function getValuesFromRow (row) {
  // Wenn die Row leer ist, steige aus
  if (row === undefined) return

  var artikelNode = row.querySelector('.artikel')
  var artikel = artikelNode.textContent

  // ODER: (Function Chaining)
  var einheit = row.querySelector('.einheit').textContent

  var mengeNode = row.querySelector('.menge')
  var menge = mengeNode.textContent

  var id = row.getAttribute('id')

  var rev = row.getAttribute('rev')

  return [artikel, einheit, menge, id, rev]
}

function getRowOfButton (button) {
  if (button.parentNode.parentNode && button.parentNode.parentNode.classList.contains('artikelRow')) {
    return button.parentNode.parentNode
  } else {
    return undefined
  }
}
