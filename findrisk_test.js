let currentPage = 0;
const pages = document.querySelectorAll(".page");

const nextButtons = document.querySelectorAll(".next");

// NEU =======================================================
var serverUrl = "https://script.google.com/macros/s/AKfycbyhQC-L6Ec423J9ZYFDTYxwsxqJvkoFuGyy2txyvmZzXFyiyt6Qb1LQwwZ12NLOra8hVA/exec"

function sendeDaten() {

  var daten = {};

  // User-ID
  daten.userId = document.getElementById("userId").value;

  // Antworten q1 bis q8
  for (var i = 1; i <= 8; i++) {

    var selector = "input[name='q" + i + "']:checked";
    var selected = document.querySelector(selector);

    if (selected != null) {
      daten["q" + i] = selected.value;
    }
  }

  // Geschlecht
  var geschlecht = document.querySelector("input[name='geschl']:checked");

  if (geschlecht != null) {
    daten.geschlecht = geschlecht.value;
  }

  // Summe berechnen
  var summe = 0;

  for (var i = 1; i <= 8; i++) {
    if (daten["q" + i] != null) {
      summe = summe + Number(daten["q" + i]);
    }
  }

  daten.summe = summe;

  // Daten an Google Apps Script senden
  fetch(serverUrl, {
    method: "POST",
    body: JSON.stringify(daten)
  });

}

// ENDE NEU ==================================================


function showPage(index) {
    
	for (var i = 0; i < pages.length; i++) {
		pages[i].classList.remove("active");
	}
 // setzt alle Seiten auf inactive
    pages[index].classList.add("active"); // Achtung index=0 entspricht erster Seite, index=1 der zweiten etc.
										  // Damit ist die Seite active => Seite modern.css (.page.active) //
}

// Prüft, ob auf der aktuellen Seite eine Antwort gewählt wurde
function validatePage(pageIndex) {
    const page = pages[pageIndex]; // hole die aktuelle Seite
	
	// Lege eine Liste von Radio Buttons an. Falls keine Radio Buttons auf
	// der jeweiligen Seite sind, ist die Liste leer
	// querySelectorAll liefert immer eine Liste von Objekten/Elementen
    const radios = page.querySelectorAll("input[type='radio']"); 
	
	// falls auf der Seite eine class mit error vorhanden ist, wird ein Objekt
	// (bzw. Element) errorBox angelegt mit diesem HTML-Element
	// querySelector liefert immer ein Objekt/Element
    const errorBox = page.querySelector(".error");

    // Falls die Fehlermeldung schon gezeigt wurde und der/die User*in 
	// jetzt eine Auswahl betätigt, soll die Fehlermeldung wieder versteckt 
	// werden
    if (errorBox) errorBox.style.display = "none"; // verstecke errorBox 

    // Wenn es auf der Seite keine Radios gibt (Startseite) → OK, d.h. hier muss nicht überprüft werden
    if (radios.length === 0) return true;

    // Prüfen, ob mindestens ein Radio ausgewählt ist
    for (let r of radios) {
        if (r.checked) return true;
    }

    // Wenn nichts ausgewählt wurde → Fehlermeldung anzeigen
    if (errorBox) errorBox.style.display = "block";

    return false;
}

for (var i = 0; i <nextButtons.length; i++) {

  var btn = nextButtons[i];

  btn.addEventListener("click", function () {

    // 1. Aktuelle Seite prüfen
    var ok = validatePage(currentPage);
    if (ok === false) {
      return;
    }

    // 2. Sonderfall: Startseite (User ID)
    if (currentPage == 0) {

      var userIdInput = document.getElementById("userId");
      var userId = userIdInput.value;
      var errorBox = pages[0].querySelector(".error");

      if (userId == "") {
        errorBox.style.display = "block";
        return;
      } else {
        errorBox.style.display = "none";
      }
    }

    // 3. Zur nächsten Seite wechseln
    // ALT ====================================
    if (currentPage < pages.length - 1) {
      currentPage = currentPage + 1;
      showPage(currentPage);
    }
	// ENDE ALT ====================================

	// NEU ========================================
	if (currentPage < pages.length - 1) {

  		// Wenn die letzte Frage beantwortet wurde:
  		if (currentPage == 8) {
    		sendeDaten();
  		}

  		currentPage = currentPage + 1;
  		showPage(currentPage);
	}
	// ENDE NEU ========================================

  });

}

// CSV-Export - Alternative zu findrisk.html ohne die Daten erst zu Zwischenspeichern
var downloadButton = document.getElementById("downloadCsv");

downloadButton.addEventListener("click", function () {

  // 1. User-ID auslesen
  var userIdInput = document.getElementById("userId");
  var userId = userIdInput.value;

  // 2. CSV-Text beginnen
  var csv = "Feld;Wert\n";
  csv = csv + "UserID;" + userId + "\n";

  // 3. Antworten sammeln (q1 bis q8)
  for (var i = 1; i <= 8; i++) {

    var selector = "input[name='q" + i + "']:checked";
    var selected = document.querySelector(selector);

    if (selected != null) {
      csv = csv + "q" + i + ";" + selected.value + "\n";
    }
  }
  

  // 4. CSV-Datei erzeugen
  var blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;"
  });

  var url = URL.createObjectURL(blob);

  // 5. Download starten
  var a = document.createElement("a");
  a.href = url;
  a.download = "findrisk_" + userId + ".csv";
  a.click();

  URL.revokeObjectURL(url); // gibt das Objekt wieder frei, wichtig weil sonst
						    // können Speicherprobleme auftreten
});

function berechneSumme() {
  var summe = 0;

  for (var i = 1; i <= 8; i++) {
    var selector = "input[name='q" + i + "']:checked";
    var selected = document.querySelector(selector);

    if (selected != null) {
      summe += Number(selected.value);
    }
  }

  var scoreElement = document.getElementById("score");
  if (scoreElement != null) {
    scoreElement.textContent = summe;
  }
}

// EventListener beim Laden setzen
var radios = document.querySelectorAll("input[type='radio']");

for (var r of radios) {
  r.addEventListener("change", berechneSumme);
}

// initial berechnen
berechneSumme();

// Dynamische Taillenumfang-Auswahl
// Alle Radio-Buttons für das Geschlecht holen
var geschlRadios = document.querySelectorAll("input[name='geschl']");

// Jeden Radio-Button durchgehen
for (var i = 0; i < geschlRadios.length; i++) {

  geschlRadios[i].addEventListener("change", function () {  // = Wenn sich dieser Radio Button ändert (also angeklickt wird), dann führe den folgenden Code aus.

    var geschl = this.value;
    var container = document.getElementById("waist-options");

    // Inhalte zuerst löschen
    container.innerHTML = "";

    if (geschl == "f") {
      container.innerHTML =
        '<label><input type="radio" name="q3" value="0"> unter 80 cm</label>' +
        '<label><input type="radio" name="q3" value="3"> 80–88 cm</label>' +
        '<label><input type="radio" name="q3" value="4"> über 88 cm</label>';
    } else {
      container.innerHTML =
        '<label><input type="radio" name="q3" value="0"> unter 94 cm</label>' +
        '<label><input type="radio" name="q3" value="3"> 94–102 cm</label>' +
        '<label><input type="radio" name="q3" value="4"> über 102 cm</label>';
    }

  });
}
