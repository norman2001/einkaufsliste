document.querySelector('#artikelForm').addEventListener('keyup', toggleButton)
document.querySelector('#artikelForm').addEventListener('change', toggleButton)
document.querySelector('#artikelForm').addEventListener('submit', handleFormSubmit)
document.querySelector('#tableTail').addEventListener('click', handleRowClick)
document.querySelector('#loadFile').addEventListener('change', loadFile)
document.querySelector('#saveList').addEventListener('click', readTableForStorage)

// window.webkitRequestFileSystem(window.PERSISTENT, 2048 * 2048, saveFile)

// navigator.webkitPersistentStorage.requestQuota(2048 * 2048, function () {
//   window.webkitRequestFileSystem(window.PERSISTENT, 2048 * 2048, saveFile)
// })

function readTableForStorage () {
  // Erstelle ein Array mit den Objekten

  // Selektiere den DOM-Node
  var rows = document.querySelectorAll('.row')
  // Erstelle ein Array
  var schoki = []
  // Arbeite so lange, bis alle Einträge ausgelesen sind
  for (var i = 0; i < rows.length; i++) {
    //  Eine Row aus allen Rows mit dem jeweiligen Index
    var row = rows[i]
    // Bekomme Einträge über die Funktion 'getValuesFromRow'
    var entries = getValuesFromRow(row)
    // Deklariere und definiere das Objekt. Es soll so aussehen:
    var obj = {
      artikel: entries[0], einheit: entries[1], menge: parseInt(entries[2])
    }
    // Das Objekt pushe ins Array
    schoki.push(obj)
  }
  // Zeige das Array ,im JSON-Format konvertiert, in der Console an
  console.log(JSON.stringify(schoki, null, '\t'))
  // Rufe die Funktion saveFile auf und übergib das konvertierte Array
  saveFile(JSON.stringify(schoki, null, '\t'))
}

function saveFile (jsonString) {
 /* jsonString ist ein Parameter, der nur innerhalb der
  Funktion saveFile verwand wird */

  // Deklariere die Variable und weise (definiere) sie
                // Datenformat; Kodierungsformat + vorgefertigte Funktion encodeURIComponent
                                                      // übergib die innere Variable jasonString
  var content = 'data:application/json; charset=utf-8,' + encodeURIComponent(jsonString)
  // Öffne ein neues Fenster und zeige den Inhalt der Variable
  window.open(content)
}

function loadFile () {
  // Selektiere den DOM-Node anhand der ElementID,
  // wo die Daten der ausgewählten Datei angezeigt werden sollen
  var selectedFile = document.getElementById('loadFile').files[0]
  // Zeige die ausgewählten Daten an der Console an
  console.log(selectedFile)
  // Deklariere die Variable reader und erstelle einen neuen Konstruktor
  var reader = new FileReader()
  /* Das onload Event wird gefeuert, wenn der Inhalt mittels readAsArrayBuffer,
  readAsBinaryString, readAsDataURL or readAsText verfügbar ist. */
  reader.onload = function (event) {
    // The file's text will be printed here
    console.log(event.target.result)
    /* Initialisiere die Variable contentOfFile und parse den Json-String
    in ein JavaScript-Object */
    var contentOfFile = JSON.parse(event.target.result)
    /* rufe die Funktion readContentOfFile auf und übergib ihr die Variable contentOfFile
    (somit also den geparsten Dateiinhalt) */
    readContentOfFile(contentOfFile)
  }
  // Die Methode readAsText liest den Inhalt der ausgewählten Datei
  reader.readAsText(selectedFile)
}

function readContentOfFile (json) {
  // Selektiere den DOM-Node tableTail und weise es der Variable table zu
  var table = document.querySelector('#tableTail')
  // eine for-Schleife um das ganze Array zu durchlaufen
  for (var i = 0; i < json.length; i++) {
    // deklariere die Variable obj und bekomme das i-te Element des Arrays
    var obj = json[i]

    // call function createNewRow und gib mir die Werte der 'keys' (artikel, einheit, menge)
    var newRow = createNewRow(obj.artikel, obj.einheit, obj.menge)
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

function createNewRow (artikel, einheit, menge) {
  // Create new row with values
  var newRow = document.createElement('div')
  newRow.classList.add('artikelRow', 'row')

  var newCheckDiv = document.createElement('div')
  newCheckDiv.classList.add('checkbox', 'col-md-1', 'col-lg-1')
  var newLabel = document.createElement('label')
  newLabel.textContent('Ok')
  var newCheckbox = document.createElement('input')
  newCheckbox.setAttribute('type', 'checkbox'
  newRow.appendChild(newCheckDiv)
  newCheckDiv.appendChild(newLabel)
  newLabel.appendChild(newCheckbox)

  var newArtikelDiv = document.createElement('div')
  newArtikel.classList.add('eintrag', 'col-md-5', 'col-lg-5')
  newArtikel.textContent = artikel
  newRow.appendChild(newArtikel)

  var newEinheit = document.createElement('div')
  newEinheit.classList.add('einheit', 'col-lg-3', 'col-md-4')
  newEinheit.textContent = einheit
  newRow.appendChild(newEinheit)

  var newMenge = document.createElement('div')
  newMenge.classList.add('menge', 'col-lg-2', 'col-md-2')
  newMenge.textContent = menge
  newRow.appendChild(newMenge)

  var newEditButton = document.createElement('i')
  newEditButton.classList.add('fa', 'fa-pencil', 'col-lg-1', 'col-md-6')
  newEditButton.setAttribute('data-type', 'edit')
  newRow.appendChild(newEditButton)

  var newDeleteButton = document.createElement('i')
  newDeleteButton.classList.add('fa', 'fa-trash', 'col-lg-1', 'col-md-6')
  newDeleteButton.setAttribute('data-type', 'delete')
  newRow.appendChild(newDeleteButton)

  return newRow
}

function handleFormSubmit (e) {
  // Prevent submit and reload by browser
  e.preventDefault()
    // Container for new table rows
  var table = document.querySelector('#tableTail')

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

  // Call function 'createNewRow()'
  var newRow = createNewRow(artikel, einheit, menge)
    // Appending new row to existing container (visible)
  table.appendChild(newRow)
    // Clearing input fields
  form.reset()
    // Set cursor into first input field
  form.querySelector('#artikel-eingeben').focus()
}

function handleRowClick (e) {
  var tableTail = this
  var button = e.srcElement
    // Wenns nicht der Klick auf den Button war:
  if (!button) return
    // If source element is 'Delete' button (data-type="delete")
    // https://wiki.selfhtml.org/wiki/Data-Attribut
  if (button.dataset.type === 'delete') {
    var row = getRowOfButton(button)
    if (row) queryDelete(tableTail, row)

    // deleteRow(tableTail, row)
  }
  // If source element is 'Edit' button
  if (button.dataset.type === 'edit') {
    var row = getRowOfButton(button)
    if (row) {
      var values = getValuesFromRow(row)
        // Name für neue Funktion wählen und aufrufen
      insertValuesIntoForm(values)
        // Entfernen der Row, damit sie nach dem Editieren nicht doppelt vorhanden ist
      deleteRow(tableTail, row)
    }
  }

  // Else do nothing
  // möglich wäre 'return' - aber unnötig
}

function queryDelete (tableTail, row) {
  var query = window.confirm('Eintrag wirklich löschen?')
  if (query === true) {
    deleteRow(tableTail, row)
  }
}

function deleteRow (tableTail, row) {
  tableTail.removeChild(row)
}

function insertValuesIntoForm (values) {
  var form = document.querySelector('#artikelForm')
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
}

function getValuesFromRow (row) {
  // Wenn die Row leer ist, steige aus
  if (row === undefined) return

  // artikelNode  = selektiere DOM-Node '.artikel' (ROW!!!)
  // Mit document.querySelector gäbe es immer nur die erste Zeile im DOM zurück
  var artikelNode = row.querySelector('.artikel')
  var artikel = artikelNode.textContent

  // ODER: (Function Chaining)
  var einheit = row.querySelector('.einheit').textContent

  var mengeNode = row.querySelector('.menge')
  var menge = mengeNode.textContent

  // Gib die Werte der Variablen zurück
  return [artikel, einheit, menge]
}

function getRowOfButton (button) {
  if (button.parentNode && button.parentNode.classList.contains('row')) {
    return button.parentNode
  } else {
    return undefined
  }
}
