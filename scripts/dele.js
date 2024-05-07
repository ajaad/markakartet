
// Del kartvisning form: Inputfelt, etc.
var delFormTittel;
var delFormBeskrivelse;
var delFormX;
var delFormY;
var delFormEPSG;
var delFormZoom;
var delFormSirkelDiameter;
var delFormGenererURLKnapp;
var delGenerertURL;
var delKopierURL;
var delCallbackKopiering;
// var delFargeVelger;
var delFigurFarge;

$(document).ready(function () {
  delFormTittel = document.getElementById("titleForm");
  delFormBeskrivelse = document.getElementById("beskrivelseForm");
  delFormX = document.getElementById("xCoordForm");
  delFormY = document.getElementById("yCoordForm");
  delFormEPSG = document.getElementById("epsgForm");
  delFormZoom = document.getElementById("zoomForm");
  delFormSirkelDiameter = document.getElementById("sirkelForm");
  delFormGenererURLKnapp = document.getElementById("genererUrlKnapp");
  delGenerertURL = document.getElementById("generertURL");
  delKopierURL = document.getElementById("kopierURL");
  delCallbackKopiering = document.getElementById("callbackKopiering");
  delFigurFarge = document.getElementById("figurFargeForm");

  $("#titleForm").on("input", null, null, function () {
    console.log("delFormTittel forandret verdi!");
    genererURL();
  });
  $("#beskrivelseForm").on("input", null, null, function () {
    console.log("beskrivelseForm forandret verdi!");
    genererURL();
  });

  // Egentlig, for disse, best å ikke forandre med en gang.
  delFormZoom.addEventListener("change", function () {
    console.log("delFormZoom forandret verdi!");
    // Hvis forandret manuelt:
    if(map != null){
        if (delFormZoom.value != map.getView().getZoom()) {
            map.getView().setZoom(delFormZoom.value);
        }
    }
  });
  delFormX.addEventListener("change", function () {
    console.log("delFormX forandret verdi!");
    lagOgSettNySirkel(
      delFormX.value,
      delFormY.value,
      delFormSirkelDiameter.value,
      delFigurFarge.value
    );
    genererURL();
  });
  delFormY.addEventListener("change", function () {
    console.log("delFormY forandret verdi!");
    lagOgSettNySirkel(
      delFormX.value,
      delFormY.value,
      delFormSirkelDiameter.value,
      delFigurFarge.value
    );
    genererURL();
  });
  delFormSirkelDiameter.addEventListener("change", function () {
    console.log("delFormSirkelDiameter forandret verdi!");
    lagOgSettNySirkel(
      delFormX.value,
      delFormY.value,
      delFormSirkelDiameter.value,
      delFigurFarge.value
    );
    genererURL();
  });
  delFigurFarge.addEventListener("change", function () {
    console.log("delFigurFarge ~ verdien ble forandret!");
    lagOgSettNySirkel(
      delFormX.value,
      delFormY.value,
      delFormSirkelDiameter.value,
      delFigurFarge.value
    );
    // Funker dette.
    // Hm... Skru av for nå? Vet ikke helt hvordan jeg skal implementere det på nytt i dele.js...
    // Siden den krever hovedMenyKlasseIndikator-variabelen og finnIndeksForKartlag(kartlag).
    // Eventuelt, kan legge til dele.js etter kart.js også bare bruke den med kart.js (ikke skole siden).

    // OBS! Denne krever kart.js (hovedsiden) ...
    settIndikatorFargeManuelt(
      "vektorLagGeometri",
      delFigurFarge.value,
      "rgba(0,0,0,0)"
    );
  });

  delFormGenererURLKnapp.addEventListener("click", function () {
    genererURL();
  });

  delKopierURL.addEventListener("click", function () {
    console.log("Trykket på delKopierURL knappen!");
    // alert("Trykket på delKopierURL knappen!"); // Funker!
    // copyTextToClipboard(delGenerertURL.textContent);
    kopierDeleLenkeMedNavigatorClipboard(delGenerertURL.textContent);
  });
});

// Var før i: map.on('moveend', function(e) {});
function oppdaterDelZoomVerdi(){
    if(map != null){
        delFormZoom.value = map.getView().getZoom();
    }
}

// Oof, blir feil med &! 
function kopierDeleLenkeMedNavigatorClipboard(text) {
    if (!navigator.clipboard) {
      // fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      // alert("Du kopierte dette til utklippstavlen: " + text);
      delCallbackKopiering.textContent = "Lenken ble kopiert!";
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      delCallbackKopiering.textContent = "Lenken må kopieres manuelt.";
      console.error('Async: Could not copy text: ', err);
    });
  }

  // Brukt inni map.on('click',function(e){}); for å lage en ny sirkel ved klikk på kartet.
function lageSirkelPaaKartKlikk(x,y){
    delFormX.value = x;
    delFormY.value = y;
    lagOgSettNySirkel(delFormX.value, delFormY.value, delFormSirkelDiameter.value, delFigurFarge.value);
    genererURL();
}

// Returnerer en streng med aktive kartlags navn ("name").
function hentAktiveKartlagSomStreng(map){
    if(map == null){
        return "";
    }

    var aktiveKartlagStreng = "";

    map.getLayers().getArray().forEach(group => {
        var gruppeNavn = group.get("name");
        if(gruppeNavn != "Bakgrunnskart"){
            group.getLayers().forEach(layer => {
                var lagNavn = layer.get("name");
                if (layer.get("visible") == true) {
                    if(aktiveKartlagStreng == ""){
                        aktiveKartlagStreng += lagNavn;
                    } else {
                        aktiveKartlagStreng += "," + lagNavn;
                    }         
                }
            });
        }
    });

    return aktiveKartlagStreng;
}

function genererURL(){
    var tittel = delFormTittel.value;
    var beskrivelse = delFormBeskrivelse.value;
    var EPSG = delFormEPSG.value;
    var x = delFormX.value;
    var y = delFormY.value;
    var zoom = delFormZoom.value;
    var sirkel = delFormSirkelDiameter.value;
  
    var url = window.location.href;
    var baseURL = window.location.href.split("?")[0];
  
    // console.log("url: " + url + ", baseURL: " + baseURL); // Base: http://127.0.0.1:5500/index.html
  
    var generertURL = baseURL + "?"; // Funker at alle variablene starter med &.
  
    if(tittel != ""){
      generertURL += "&tittel=" + tittel;
    }
    if(beskrivelse != ""){
      generertURL += "&beskrivelse=" + beskrivelse;
    }
    if(zoom != ""){
      generertURL += "&zoom=" + zoom;
    }
    if(EPSG != ""){
      generertURL += "&EPSG=" + EPSG;
    }
    if(x != ""){
      generertURL += "&x=" + x;
    }
    if(y != ""){
      generertURL += "&y=" + y;
    }
    if(sirkel != ""){
      generertURL += "&sirkel=" + sirkel;
    }
  
    // 
    var strengMedAktiveKartlag = String(hentAktiveKartlagSomStreng(map));
    // console.log("kodeStreng: " + kodeStreng + ", typeof: " + typeof(kodeStreng));
    if(strengMedAktiveKartlag != "" && strengMedAktiveKartlag != "undefined"){
      // console.log("genererURL ~ kodeStreng er ikke tom og heller ikke undefined.");
      generertURL += "&lag=" + strengMedAktiveKartlag;
    }
  
    console.log("generertURL: " + generertURL);
    delGenerertURL.textContent = generertURL;
    // Reset:
    delCallbackKopiering.textContent = "";
  }

  function settIndikatorFargeManuelt(inputLagNavn, strokeFarge, fillFarge) {
    // Sjekker at hovedMenyKlasseIndikator-elementet ikke er null.
    // Hvis den ikke er null, anta at det er på hovedsiden.
    if (hovedMenyKlasseIndikator != null) {
      // Hm. Først, trenger å finne indeks for kartlaget for så å finne riktig indikator.
      // Check if color is valid?
      if (CSS.supports("color", strokeFarge) && CSS.supports("color", fillFarge)) {
        var lagIndeks = finnIndeksForKartlag(inputLagNavn);
        if (lagIndeks >= 0) {
          hovedMenyKlasseIndikator[finnIndeksForKartlag(inputLagNavn)].style.borderColor = strokeFarge;
          hovedMenyKlasseIndikator[finnIndeksForKartlag(inputLagNavn)].style.backgroundColor = fillFarge;
        }
      }
    }
  }