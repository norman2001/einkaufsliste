document.querySelector('#artikelForm').addEventListener('keyup', toggleButton)
document.querySelector('#artikelForm').addEventListener('change', toggleButton)

function toggleButton (e) {
  var form = this
  var allFieldsNotEmpty = true
  var button = form.querySelector('#input-absenden')

  // Alle Eingabefelder selectieren
  var inputArtikel = form.querySelector('.artikel-eingeben')
  var selectEinheit = form.querySelector('#einheit-auswaehlen')
  var inputMenge = form.querySelector('.menge-eingeben')

  // Werte der Felder auslesen
  var values = []
  values.push(inputArtikel.value)
  values.push(selectEinheit.children[selectEinheit.selectedIndex].value)
  values.push(inputMenge.value)

  // Prüfen ob alle Felder gefüllt sind
  for (var i = 0; i < values.length; i++) {
    if (values[i].length === 0) {
      allFieldsNotEmpty = false
      break
    }
  }

  // Button aktivieren bzw. deaktivieren
  if (allFieldsNotEmpty) {
    button.removeAttribute('disabled')
  } else {
    button.setAttribute('disabled', 'disabled')
  }
}
