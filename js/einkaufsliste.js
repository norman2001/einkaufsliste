document.querySelector('#artikelForm').addEventListener('keyup', toggleButton)
document.querySelector('#artikelForm').addEventListener('change', toggleButton)
document.querySelector('#artikelForm').addEventListener('submit', handleFormSubmit)

function toggleButton (e) {
  var form = this
  var allFieldsNotEmpty = true
  var button = form.querySelector('#input-absenden')

  // Select all input fields
  var inputArtikel = form.querySelector('.artikel-eingeben')
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
  newRow.classList.add('tabellenzeile')

  var newArtikel = document.createElement('div')
  newArtikel.classList.add('artikel')
  newArtikel.textContent = artikel
  newRow.appendChild(newArtikel)

  var newEinheit = document.createElement('div')
  newEinheit.classList.add('einheit')
  newEinheit.textContent = einheit
  newRow.appendChild(newEinheit)

  var newMenge = document.createElement('div')
  newMenge.classList.add('menge')
  newMenge.textContent = menge
  newRow.appendChild(newMenge)

  return newRow
}

function handleFormSubmit (e) {
  // Verhindern des Absenden und Neuladen durch den Browser
  e.preventDefault()
  // Container for new table rows
  var table = document.querySelector('.tabelle')

  // Extracting user data from fields
  var form = this // Wir sitzen auf dem Form
  var artikel = form.querySelector('.artikel-eingeben').value

  //  DOM-Node = 'select' (HTML-Code)
  var selectEinheit = form.querySelector('#einheit-auswaehlen')
  //  DOM-Nodes = 'options' (HTML-Code)
  var options = selectEinheit.children
  //  Currently selected index of 'options'
  var selectedIndex = selectEinheit.selectedIndex
  //  Read value from selected option tag
  var einheit = options[selectedIndex].value

  var menge = form.querySelector('#menge-eingeben').value
  // Creating new table row (invisible)
  var newRow = createNewRow(artikel, einheit, menge)
  // Appending new row to existing container (visible)
  table.appendChild(newRow)
  // Clearing input fields
  form.reset()
  // Set cursor into first input field
  form.querySelector('.artikel-eingeben').focus()
}
