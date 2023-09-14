
window.onload = init;

var logoFarge = "#0C775D";
var fargeTones5 = "#547C73";
var fargeTones7 = "#717E7B";

var map;
var gpsKnapp;
var geolocation;
var trackingIsOn = false;
var positionFeature;
var accuracyFeature;
var prevPosition = null;
var tidFlyttStart = 0;
var lineStringFlytt = new ol.geom.LineString([]);
var msHastighet = 1 / 1000;
var positionFeaturePunkt;
var brukeViewSentreringMedGPS = true; // Bare har denne også så sentrering kan skrus av enklere.
var sentrertViewPaaGPS = false; // Sentrere view når GPS skrus på?

var kartlagDict;
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

var headerKnappKartMeny;
var headerKnappDel;
var headerKnappOm;
var headerKnappStott;
var divMenyKart;
var divMenyDel;
var divMenyOm;
var divMenyStott;
var divMenyKartBilde;
var divMenyDelBilde;
var divMenyOmBilde;
var divMenyStottBilde;
var sisteMenyAktiv = "divMenyKart"; // Default.
// Popup
var popupContainer;
var popupContent;
var popupClose;
var popupOverlay;
var featureSelectionList = []; // For "all" featureSelection.
var featureSelectionDict = {}; // Hm... Support til featureSelectionList. Ikke bytte ut.
var featureSelected = null; // Click on feature... Possible to do it with multiple features? Hm...
var featureHovered = null;
var useDefaultWhiteStyle = false; // Bare bruke hvit stil for highlight.
var aapneHovedMenyKnapp;
var markaKnappene;
var hovedVinduKnapper;
var hovedVinduContainer;
var hovedVindu;
var hovedMenySlide;
var touchbar;
var startX = 0, startY = 0, moveX = 0, moveY = 0, prevMoveX = 0, prevMoveY = 0; endX = 0, endY = 0;
var hovedVinduContainerMarginBottomWhenScroll = "80px"; // Samme som: style > Mobile > hovedVinduContainer > marginBottom.
var hovedVinduContainerMarginBottomWhenHidden; // Basically WhenScroll - 36px. Defineres senere.
// var hovedVinduContainerMarginBottomWhenHidden = "44px"; // Når hovedVinduContainer er skjult. 36px mindre enn WhenScroll?
var minHovedMarginTop = 140; // Default. 
var maxHovedMarginTop = 512; // Touchbar.
var thresholdWhenHighMarginBottom;
var thresholdWhenLowMarginBottom;
var marginTopMax;
var marginTopHide;
var marginTopShowThreshold;
var underMarginTopShowThreshold = true;
var slideTextTest;
var blokkerKnappAlleTrykk = false;
var blokkerHovedVinduTrykk = false; // For hele hovedvinduet...

// var sideAktiv;
var sideKartMeny;
var sideDelKartvisning;
var sideOmMarkakartet;
var sideStott;
//
var sideFeatureInfo;
var featureInfoAktiv = false;
var featureTilbakeKnapp;
var finnKnapp;

var mainMenuClassGroupLink;
var mainMenuClassSubmenus;
var mainMenuClassExpands;
var hovedMenyKlasseLagLenke;
var hovedMenyKlasseIndikator;
var hovedMenyKlasseKartlagTekst;
//
var htmlKartLagListe;
// Prøve med dict:
var htmlKartLagDict;

function addGroupLinkListener(classIndex){

  mainMenuClassGroupLink[classIndex].addEventListener("click", function(){

    //
    if(blokkerHovedVinduTrykk) return;

    if(mainMenuClassSubmenus[classIndex].style.opacity == "1"){
      mainMenuClassSubmenus[classIndex].style.opacity = "0";
      mainMenuClassSubmenus[classIndex].style.height = "0";
      mainMenuClassSubmenus[classIndex].style.paddingTop = "0";
      mainMenuClassSubmenus[classIndex].style.paddingBottom = "0";
      mainMenuClassExpands[classIndex].style.transform = "translateY(0px) translateX(0px) rotate(0deg)";
    } else {
      mainMenuClassSubmenus[classIndex].style.opacity = "1";
      mainMenuClassSubmenus[classIndex].style.height = "auto";
      mainMenuClassSubmenus[classIndex].style.paddingTop = "1rem";
      mainMenuClassSubmenus[classIndex].style.paddingBottom = "0.125rem";
      mainMenuClassExpands[classIndex].style.transform = "translateY(-6px) translateX(0px) rotate(90deg)";
    }

  });

}

function leggTilLagLenkeListener(gruppe, lag, indeks, lagLenkeKlasse){
  lagLenkeKlasse[indeks].addEventListener("click", function () {
    forandreSynlighetKartlag(gruppe, lag, indeks);
  });
}

// Bruker htmlKartLagListe.
function finnIndeksForKartlag(inputLagNavn){
  for(i = 0; i < htmlKartLagListe.length; i++){
    var lagNavn = htmlKartLagListe[i]["lagNavn"];
    if(inputLagNavn == lagNavn){
      return htmlKartLagListe[i]["lagIndeks"];
    }
  }
  return -1;
}

// Funksjon som bruker htmlKartLagListe til å sette border og bakgrunnsfarge
// på indicatorene. Hm... Egentlig bare gjøre det for kartlag som er "clickable".
// Obs! Må kjøres etter at htmlKartLagListe og hovedMenyKlasseIndikator er definert!
function settIndikatorFargerForKartlag(lagIndeks){
  var lagNavn = htmlKartLagListe[lagIndeks]["lagNavn"];
  try {
    // var lagNavn = htmlKartLagListe[lagIndeks]["lagNavn"];
    var strokeColorSelect = htmlKartLagListe[lagIndeks]["lagReferanse"].get("strokeColorSelect");
    var fillColorSelect = htmlKartLagListe[lagIndeks]["lagReferanse"].get("fillColorSelect");
    // console.log("lagIndeks: " + lagIndeks + ", lagNavn: " + lagNavn + ", strokeColorSelect: " + strokeColorSelect + ", fillColorSelect: " + fillColorSelect);
  
    if(strokeColorSelect != null){
      hovedMenyKlasseIndikator[lagIndeks].style.borderColor = strokeColorSelect;
    }
    if(fillColorSelect != null){
      hovedMenyKlasseIndikator[lagIndeks].style.backgroundColor = fillColorSelect;
    }
  } catch(error){
    // console.log("lagIndeks: " + lagIndeks + ", lagNavn: " + lagNavn + ", lagReferansen er null.");
  }
}

function lagKartMenyHTML(){

  var htmlKartMenyGruppe = "";
  var lagIndeks = 0;
  htmlKartLagListe = [];
  htmlKartLagDict = {};

  console.log("Lager kart meny...");

  //
  var h2Kartlag = "<div class='h2sentrert'><h2>Kartlag</h2></div><br/>";
  document.getElementById("kartHovedMeny").innerHTML += h2Kartlag;
  // document.getElementById("kartHovedMeny").textContent += h2Kartlag;

  for(var i = 0; i < kartMenyMasterListe.length; i++){

    var gruppeNavn = kartMenyMasterListe[i]["gruppeNavn"];
    var uiGruppeNavn = kartMenyMasterListe[i]["uiGruppeNavn"];
    // console.log("Lager nå html for Kartmeny gruppen: " + gruppeNavn);

    htmlKartMenyGruppe += "<li class='gruppeMeny'>";
    htmlKartMenyGruppe += "<div><div class='gruppeLenke' href='#'><img class='expandButton' src='./images/right-chevron-256.png' />";
    htmlKartMenyGruppe += "<div>" + uiGruppeNavn + "</div></div></div>";
    htmlKartMenyGruppe += "<ul class='submenu'>";

    var kartlag = kartMenyMasterListe[i]["kartMenyLag"];
    // For hvert kartlag:
    for(var j = 0; j < kartlag.length; j++){
      var lagNavn = kartlag[j]["lagNavn"];
      var uiLagNavn = kartlag[j]["uiLagNavn"];
      var lagReferanse = kartlag[j]["lagReferanse"];
      // console.log("Legger nå følgende kartlag til HTML: " + lagNavn + ". lagIndeks: " + lagIndeks);

      // Som Anders har gjort det:
      // ... Måtte ta bort mellomrommet her: "', '" ---> "','"
      var forandreSynlighetFunksjon = "forandreSynlighetKartlag('" + gruppeNavn + "','" + lagNavn + "'," + lagIndeks + ")";

      htmlKartMenyGruppe += "<li><div class='lagLenke' href='#' onclick=" + forandreSynlighetFunksjon + ">";
      htmlKartMenyGruppe += "<div class='indicator'></div><div><span class='kartlagTekst'>" + uiLagNavn + "</span></div></div></li>";

      var htmlLagDict = {
        "gruppeNavn": gruppeNavn,
        "lagNavn": lagNavn,
        "lagIndeks": lagIndeks,
        "lagReferanse": lagReferanse
      }
      htmlKartLagListe.push(htmlLagDict);

      // Med dict? // Hm. Dette ser da bra ut.
      htmlKartLagDict[lagNavn] = {
        "gruppeNavn": gruppeNavn,
        "lagIndeks": lagIndeks
        // "lagReferanse": lagReferanse
      }

      lagIndeks++;
    }

    htmlKartMenyGruppe += "</ul></li>"; // Avslutning på gruppeMney og submenu.
    document.getElementById("kartHovedMeny").innerHTML += htmlKartMenyGruppe;
    htmlKartMenyGruppe = "";

  }

  // Teste noe... Alle-lag knapper.
  var alleKnapperHTML = "<div id='alleKnapperContainer'>";
  alleKnapperHTML += "<button class='markaKnapp' id='skjulAlleLagKnapp' onclick='skjulAlleLag()'>Skjul alle</button>";
  alleKnapperHTML += "<button class='markaKnapp' id='visAlleLagKnapp' onclick='visAlleLag()'>Vis alle</button>";
  alleKnapperHTML += "</div>";

  document.getElementById("kartHovedMeny").innerHTML += alleKnapperHTML;

  console.log(".. Kart meny klar!");

  console.log(htmlKartLagListe);
  console.log(htmlKartLagDict);
}

$(document).ready(function(){

  lagKartMenyHTML();

  // On mobile?
  window.isMobile = /iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase());
  console.log(window.isMobile);

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    // some code..
    console.log("On mobile?");
  } else {
    console.log("Not on mobile?");
  }

  // 
  try {
    var scrollPixels = parseInt(hovedVinduContainerMarginBottomWhenScroll) - 36;
    hovedVinduContainerMarginBottomWhenHidden = scrollPixels + "px";
    // console.log(hovedVinduContainerMarginBottomWhenHidden); // 44px
  } catch(exception){
    console.log("Feil ved forsøk på å sette WhenHidden lik WhenScroll minus 36. WhenHidden hardcodes til 44px.");
    hovedVinduContainerMarginBottomWhenHidden = "44px";
  }

  gpsKnapp = document.getElementById("gpsButtonContainer");
  //
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
  // Popup
  popupContainer = document.getElementById('ol-popup');
  popupContent = document.getElementById('popup-content');
  popupClose = document.getElementById('popup-closer');

  headerKnappKartMeny = document.getElementById("headerKnappKartMeny");
  headerKnappDel = document.getElementById("headerKnappDel");
  headerKnappOm = document.getElementById("headerKnappOm");
  headerKnappStott = document.getElementById("headerKnappStott");
  divMenyKart = document.getElementById("divMenyKart");
  divMenyDel = document.getElementById("divMenyDel");
  divMenyOm = document.getElementById("divMenyOm");
  divMenyStott = document.getElementById("divMenyStott");
  divMenyKartBilde = document.getElementById("divMenyKartBilde");
  divMenyDelBilde = document.getElementById("divMenyDelBilde");
  divMenyOmBilde = document.getElementById("divMenyOmBilde");
  divMenyStottBilde = document.getElementById("divMenyStottBilde");

  aapneHovedMenyKnapp = document.getElementById("aapneHovedVinduKnapp");
  hovedVinduKnapper = document.getElementById("hovedVinduKnapper");
  markaKnappene = document.getElementById("markaKnappene");
  hovedVinduContainer = document.getElementById("kartHovedMenyContainer");
  hovedVindu = document.getElementById("hovedVindu");
  hovedMenySlide = document.getElementById("hovedMenySlide");
  touchbar = document.getElementById("touchbar");
  // slideTextTest = document.getElementById("slideTextTest");
  //
  sideKartMeny = document.getElementById("kartHovedMeny");
  sideDelKartvisning = document.getElementById("delKartvisning");
  sideOmMarkakartet = document.getElementById("omMarkakartet");
  sideStott = document.getElementById("stotte");
  sideFeatureInfo = document.getElementById("featureInfo");
  //
  featureTilbakeKnapp = document.getElementById("featureTilbakeKnapp");
  finnKnapp = document.getElementById("finnKnapp");

  mainMenuClassGroupLink = document.getElementsByClassName("gruppeLenke");
  mainMenuClassSubmenus = document.getElementsByClassName("submenu");
  mainMenuClassExpands = document.getElementsByClassName("expandButton");
  // console.log(mainMenuClassGroupLink);
  // console.log(mainMenuClassSubmenus);
  // console.log(mainMenuClassExpands);
  hovedMenyKlasseIndikator = document.getElementsByClassName("indicator");
  hovedMenyKlasseKartlagTekst = document.getElementsByClassName("kartlagTekst");
  // console.log(hovedMenyKlasseIndikator);

  // Hm, setter alle bakgrunnsfargene til grått? Bortsett fra OSM...
  for(var i = 0; i < htmlKartLagListe.length; i++){
    if(htmlKartLagListe[i]["gruppeNavn"] == "Bakgrunnskart"){
      if(htmlKartLagListe[i]["lagNavn"] != "bakgrunnskartOSM"){
        hovedMenyKlasseKartlagTekst[i].style.color = "gray"; // Funker det? Jepp!
      }
    }
  }

  jscolor.ready(function(){
    console.log("jscolor er klar!");
    // Vet ikke hvilken farge jeg skal sette til bakgrunnen. Hm.
    settIndikatorFargeManuelt("vektorLagGeometri", delFigurFarge.value, "rgba(0,0,0,0)");
  });

  sideDelKartvisning.style.display = "none";
  sideOmMarkakartet.style.display = "none";
  sideStott.style.display = "none";

  aapneHovedMenyKnapp.style.opacity = "0";
  hovedVinduKnapper.style.opacity = "1";
  headerKnappKartMeny.style.opacity = "1";
  headerKnappDel.style.opacity = "1";
  headerKnappOm.style.opacity = "1";
  headerKnappStott.style.opacity = "1";
  hovedVinduContainer.style.opacity = "1";
  hovedVindu.style.opacity = "1";
  // Kartmenyen starter alltid aktiv.
  headerKnappKartMeny.style.color = "white";
  headerKnappKartMeny.style.borderBottom = "3px solid white";

  // Klikk-listener for gruppeLenke klassene. // ! Denne er for GRUPPENE!
  for (i = 0; i < mainMenuClassGroupLink.length; i++) {
    addGroupLinkListener(i);
  }

  toggleGruppeVisning("Naturopplevelser"); // Hm... Expande den første med en gang?

  for(j = 0; j < hovedMenyKlasseIndikator.length; j++){
    settIndikatorFargerForKartlag(j);
  }

  var outputArray = prepareView();
  var newView = outputArray[0];

  $("#popup-closer").click(function(e){
    console.log("popupClose clicked! Hiding.");
    popupContainer.style.display = "none";
    e.stopPropagation();
  })

  $("#popup-content").click(function(e){
    console.log("popupContent clicked!");
    e.stopPropagation();
  })

  $("#ol-popup").click(function(){
    console.log("popupContainer clicked! Hiding.");
    popupContainer.style.display = "none";
  })

  // Popup:
  popupOverlay = new ol.Overlay({
    element: popupContainer,
    autoPan: {
      animation: {
        // duration: 250,
        duration: 0
      },
    },
    name: "Popup"
  });

  // Målestokk
  let control;

  function scaleControl() {
    control = new ol.control.ScaleLine({
      target: document.getElementById('scale-line-id'),
      units: 'metric',
      minWith: 32,
      maxWidth: 128
      // maxWidth: 120
    });
    return control;
  }
  // function zoomControl() {
  //   control = new ol.control.Zoom({
  //     target: document.getElementById('zoomknapper')
  //   });
  //   return control;
  // }

  // Zoom-knapper: // Oh, funker bra.
  var zoomIn = document.getElementById("buttonZoomIn");
  if(zoomIn != null){
    zoomIn.addEventListener("click", function(){
      if(map != null){
        map.getView().setZoom(map.getView().getZoom()+1); 
      }
    });
  }
  var zoomOut = document.getElementById("buttonZoomOut");
  if(zoomOut != null){
    zoomOut.addEventListener("click", function(){
      if(map != null){
        map.getView().setZoom(map.getView().getZoom()-1); 
      }
    });
  }

  var bakgrunnskartGruppe = new ol.layer.Group({
    name: "Bakgrunnskart",
    opacity: 1,
    visible: true,
    layers: [bakgrunnskartOSM]
  });

  var naturopplevelserGruppe = new ol.layer.Group({
    name: "Naturopplevelser",
    opacity: 1,
    visible: true,
    layers: [vektorLagMarkagrensa, vektorLagEventyrskog, wmsLagFotrute, wmsLagHistorisk,
      vektorLagKalenderRuter2021
    ]
  });

  var verneomraderGruppe = new ol.layer.Group({
    name: "Verneområder",
    opacity: 1,
    visible: true,
    layers: [wmsLagNaturvernOmrade, wmsLagNaturvernKlasserOmrade, wmsLagForeslattNaturvernOmrade, wmsLagFriluftStatligSikra, vektorLagVernEtterMarkaloven]
  });

  var verneforslagGruppe = new ol.layer.Group({
    name: "Verneforslag",
    opacity: 1,
    visible: true,
    // layers: [vektorLagforeslatteFLO, vektorLagforeslatteVLO, vektorLagReservatKandidat]
    layers: [vektorLagforeslatteVLO, vektorLagforeslatteFLO, vektorLagReservatKandidat]
  });

  var forvaltningsforslagGruppe = new ol.layer.Group({
    name: "Forvaltningforslag",
    opacity: 1,
    visible: true,
    layers: [vektorLagRestaureringsomrader, vektorLagSammenhengendeVillmark]
  });

  var geometriGruppe = new ol.layer.Group({
    name: "Geometri",
    opacity: 1,
    visible: true,
    layers: [vektorLagGeometri, vektorLagGPS]
  });

  // Rekkefølgen for hvilken lag som er nederst (start), og øverst (slutt).
  var mesterGruppe = new ol.layer.Group({
    name: "MesterGruppe",
    opacity: 1,
    visible: true,
    layers: [
      bakgrunnskartGruppe,
      // annetGruppe,
      naturopplevelserGruppe,
      verneomraderGruppe,
      verneforslagGruppe,
      forvaltningsforslagGruppe,
      geometriGruppe
    ]
  });

  // Kartet

    map = new ol.Map({
    target: 'map',
    layers: mesterGruppe,
    view: newView,
    renderer: 'canvas',
    controls: ol.control.defaults({
      zoom: false
    }).extend([
      scaleControl(),
      // zoomControl()
    ]),
    overlays: [popupOverlay]
  });

  // Test:
  // popupOverlay.setPosition(outputArray[1]);

  // En sjekk for popup:
  map.getOverlays().getArray().forEach(overlay => {
    var overlayName = overlay["options"]["name"];
    console.log("overlay name: " + overlayName); // Popup
  });
  // console.log(map.getOverlays().getArray());

  lagWMTSLag(); // Lager dem async.

  forandreSynlighetKartlagUtenIndeks("Bakgrunnskart", "bakgrunnskartOSM");

  // Aktivere kartlag fra URL her.
  if(lagListeFraURL != null){
    console.log("lagListeFraURL er ikke null!");
    aktiverKartlagMedKoder(); // Funker!
  } else {
    forandreSynlighetKartlagUtenIndeks("Naturopplevelser", "vektorLagMarkagrensa");
    forandreSynlighetKartlagUtenIndeks("Geometri", "vektorLagGeometri");
    forandreSynlighetKartlagUtenIndeks("Geometri", "vektorLagGPS");
  }

  // VEKTOR TESTER START

  // vectorSourceGeometry.addFeature(outputArray[3]);

  // console.log(vectorSourceGeometry.getFeatures());
  // // console.log(vectorSourceGeometry.getFeatures().length); // Denne funker.

  // console.log(vectorSourceGeometry.getFeaturesAtCoordinate(outputArray[4]));

  // // Works!
  // vectorSourceGeometry.forEachFeature(feature => {
  //   // console.log(feature);
  //   var name = feature.get("name");
  //   console.log(name);

  //   // Funker!
  //   // if(name == "circle"){
  //   //   vectorSourceGeometry.removeFeature(feature);
  //   // }
  //   // Kan jeg ta bort i loopen? ...
  //   // vectorSourceGeometry.removeFeature(feature); // Virker faktisk! ...
  // });

  // // Get in order?
  // console.log(vectorSourceGeometry.getFeaturesCollection().getArray());

  // // Teste noe... For å slette den siste:
  // vectorSourceGeometry.removeFeature(vectorSourceGeometry.getFeaturesCollection().getArray()[vectorSourceGeometry.getFeatures().length-1]);
  // console.log(vectorSourceGeometry.getFeaturesCollection().getArray());
  // // Funker! Men hvorfor forandrer begge log-meldingene seg (også den før jeg gjør removeFeature)? ...

  // // vectorSourceGeometry.clear(); // Removes all features? // Yep.

  // VEKTOR TESTER END

  map.on('click',function(e){
    console.log("Klikket på kartet!");

    // Debug
    // document.getElementById("debugVinduTekst").innerHTML = "map on click";

    var coordSys = "EPSG:" + document.getElementById("epsgForm").value;
    var koordinaterKonv = proj4(viewProjection, coordSys, e.coordinate);

    console.log("Koordinatsystem: " + coordSys + ", koordinater: " + e.coordinate + ", koordinaterKonv: " + koordinaterKonv);

    // Bare lage sirkel på divMenyDel?
    if(sisteMenyAktiv == "divMenyDel"){
      delFormX.value = koordinaterKonv[0];
      delFormY.value = koordinaterKonv[1];
  
      lagOgSettNySirkel(delFormX.value, delFormY.value, delFormSirkelDiameter.value, delFigurFarge.value);
      genererURL();
    }

    popupOverlay.setPosition(e.coordinate);
    // vise boks med informasjon:
    const pixel = map.getEventPixel(e.originalEvent); // pixel i skjermvinduet
    displayFeatureInfo(pixel);
  });

  // Sukk... Egentlig best å ikke ha engang for mobil? Siden det ikke er hover der.
  var hovered = null;
  map.on('pointermove', function (e) {
    // console.log("pointermove triggered?!");

    // Disable on mobile?
    // Hm, prøve å se om det hjelper med laggen...
    if(window.isMobile){
      return;
      console.log("Map pointermove ~ On mobile, so skipping hover.");
    }
    
    // Debug
    // document.getElementById("debugVinduTekst").innerHTML = "map on pointermove";

    // Funker! Hover med featureSelectionList.
    if(featureSelectionList.includes(featureHovered)) {
      console.log("featureHovered is in featureSelectionList!");
    } else if (featureHovered != null) {

      // Sette til dashed for tur-snarveier!
      var snarvei = featureHovered.get("Stiplet");
      if(snarvei == null){
        // Ikke en tur.
        featureHovered.setStyle(undefined);
        // featureHovered = null;
      } else {
        // Er en tur.
        snarvei = parseInt(snarvei);
        if(snarvei <= 0){
          // Tur, men ikke en snarvei.
          featureHovered.setStyle(undefined);
          // featureHovered = null;
        } else {
          // Turen er en snarvei!
          var NAVN = featureHovered.get("NAVN");
          var dictEntry = featureSelectionDict[NAVN];
          if(dictEntry != null){
            var stilDashed = dictEntry["stilDashed"];
            if(stilDashed != null){
              featureHovered.setStyle(stilDashed);
              console.log("Satt stilDashed for snarveien kalt med NAVN: " + NAVN);

              // Debug
              // document.getElementById("debugVinduTekst").innerHTML += " | hover, satt til null ~ satt stilDashed for snarvei: " + NAVN;
            } else {
              // Bare bruke layer-stilen, hvis fortsatt problemer...
              featureHovered.setStyle(undefined);
            }
          }
        }
      }

      featureHovered = null;

      // featureHovered.setStyle(undefined);
      // featureHovered = null;
      // console.log("featureHovered was set to null.");
    }
  
    map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {

      var lagnavn = layer.get("name"); // navn på kartlaget
      var clickable = layer.get("clickable");
      // console.log("lagnavn: " + lagnavn + ", clickable: " + clickable);
  
      if(clickable && feature){
        var navn = feature.get('navn');
        var name = feature.get('name');
        var NAME = feature.get('NAME');
        var featureName = "Navn på området mangler";
        // console.log("clickable og feature! navn: " + navn + ", name: " + name + ", NAME: " + NAME);
  
        // Sjekke for snarvei (stiplet):
        var snarvei = feature.get("Stiplet");
        var erEnSnarvei = false;

        featureHovered = feature;

        if(snarvei != null){
          snarvei = parseInt(snarvei);
          if(snarvei > 0){
            // Her er turen en snarvei...
            erEnSnarvei = true;
          }
        }

        if(!erEnSnarvei){
          if(useDefaultWhiteStyle){
            featureHovered.setStyle(defaultWhiteSelectStyle);
          } else {
            var stilSelect = layer.get("stilSelect");
            if(stilSelect != null){
              featureHovered.setStyle(stilSelect);
            } else {
              featureHovered.setStyle(defaultWhiteSelectStyle);
            }
          }
        } else {
          // Er en tur snarvei!
          if(useDefaultWhiteStyle){
            featureHovered.setStyle(defaultWhiteDashedSelectStyle);
          } else {
            // Legge til i dictionary her også, i tilfelle brukeren ikke har trykket på turen enda.
            var snarveiNavn = feature.get("NAVN");
            var stilDashedGet = layer.get("stilDashed");
            var stilDashedSelectGet = layer.get("stilDashedSelect");

            featureSelectionDict[snarveiNavn] = {
              // navn: endeligeNavn,
              featureSelection: feature,
              stilDashed: stilDashedGet,
              stilDashedSelect: stilDashedSelectGet
            };
            console.log(featureSelectionDict);

            // var stilDashedSelect = layer.get("stilDashedSelect");
            if (stilDashedSelectGet != null) {
              featureHovered.setStyle(stilDashedSelectGet);

              // Debug:
              // document.getElementById("debugVinduTekst").innerHTML += " | Hover ~ Satt stilDashedSelect på snarvei: " + snarveiNavn;
            } else {
              featureHovered.setStyle(defaultWhiteDashedSelectStyle);
            }
          }
        }

        return true; // For å bare velge den første gyldige featuren?
      }

    });

  });

  // Sette zoom...
  map.on('moveend', function(e) {
    delFormZoom.value = map.getView().getZoom();
  });

  $("#titleForm").on("input", null, null, function(){
    console.log("delFormTittel forandret verdi!");
    genererURL();
  });
  $("#beskrivelseForm").on("input", null, null, function(){
    console.log("beskrivelseForm forandret verdi!");
    genererURL();
  });

  // Egentlig, for disse, best å ikke forandre med en gang.
  delFormZoom.addEventListener("change", function () {
    console.log("delFormZoom forandret verdi!");
    // Hvis forandret manuelt:
    if(delFormZoom.value != map.getView().getZoom()){
      map.getView().setZoom(delFormZoom.value);
    }
  })
  delFormX.addEventListener("change", function () {
    console.log("delFormX forandret verdi!");
    lagOgSettNySirkel(delFormX.value, delFormY.value, delFormSirkelDiameter.value, delFigurFarge.value);
    genererURL();
  })
  delFormY.addEventListener("change", function () {
    console.log("delFormY forandret verdi!");
    lagOgSettNySirkel(delFormX.value, delFormY.value, delFormSirkelDiameter.value, delFigurFarge.value);
    genererURL();
  })
  delFormSirkelDiameter.addEventListener("change", function () {
    console.log("delFormSirkelDiameter forandret verdi!");
    lagOgSettNySirkel(delFormX.value, delFormY.value, delFormSirkelDiameter.value, delFigurFarge.value);
    genererURL();
  })
  delFigurFarge.addEventListener("change", function () {
    console.log("delFigurFarge ~ verdien ble forandret!");
    lagOgSettNySirkel(delFormX.value, delFormY.value, delFormSirkelDiameter.value, delFigurFarge.value);
    // Funker dette.
    settIndikatorFargeManuelt("vektorLagGeometri", delFigurFarge.value, "rgba(0,0,0,0)");
  });

  delFormGenererURLKnapp.addEventListener('click', function(){
    genererURL();
  });

  delKopierURL.addEventListener('click', function(){
    console.log("Trykket på delKopierURL knappen!");
    // alert("Trykket på delKopierURL knappen!"); // Funker!
    copyTextToClipboard(delGenerertURL.textContent);
    // navigator.clipboard.writeText(delGenerertURL.textContent);
    // delCallbackKopiering.innerHTML = "Lenken ble kopiert!";
  });

  // GPS

  lagGpsStiler();

  geolocation = new ol.Geolocation({
    // enableHighAccuracy must be set to true to have the heading value.
    trackingOptions: {
      enableHighAccuracy: true,
    },
    // projection: view.getProjection(),
    projection: viewProjection,
    tracking: false
  });

  function setGPSKnappStil(isTrackingState){
    if(isTrackingState){
      gpsKnapp.style.backgroundColor = logoFarge;
      gpsKnapp.style.borderColor = logoFarge;
      gpsKnapp.classList.add('enabledHover');
      gpsKnapp.classList.remove('disabledHover');
    } else {
      gpsKnapp.style.backgroundColor = fargeTones7;
      gpsKnapp.style.borderColor = fargeTones7;
      gpsKnapp.classList.add('disabledHover');
      gpsKnapp.classList.remove('enabledHover');
    }
  }

  geolocation.on('change:tracking', function(event){
    // console.log("geolocation ~ tracking changed! event: " + event);
    var isTracking = geolocation.getTracking();
    console.log("geolocation ~ isTracking: " + isTracking);

    setGPSKnappStil(isTracking);

    // Bruker trackingIsOn for gps-knappen.
    // trackingIsOn = geolocation.getTracking();
    // console.log("geolocation ~ change:tracking ~ trackingIsOn: " + trackingIsOn);
    // if(isTracking){
    //   gpsKnapp.style.backgroundColor = logoFarge;
    //   gpsKnapp.style.borderColor = logoFarge;
    //   gpsKnapp.classList.add('enabledHover');
    //   gpsKnapp.classList.remove('disabledHover');
    // } else {
    //   gpsKnapp.style.backgroundColor = fargeTones7;
    //   gpsKnapp.style.borderColor = fargeTones7;
    //   gpsKnapp.classList.add('disabledHover');
    //   gpsKnapp.classList.remove('enabledHover');
    // }
  });

  accuracyFeature = new ol.Feature();
  vectorSourceGPS.addFeature(accuracyFeature);

  positionFeature = new ol.Feature();
  positionFeature.setStyle(
    positionFeatureStil
  );
  vectorSourceGPS.addFeature(positionFeature);

  gpsKnapp.addEventListener('click', function(){
    console.log("gpsKnapp clicked!");
    // document.getElementById("debugGPS").innerHTML = "Clicked!";
    trackingIsOn = !trackingIsOn;
    toggleTracking(trackingIsOn);
  });

// update the HTML page when the position changes.
geolocation.on('change', function () {
  var accuracy = geolocation.getAccuracy();
  var altitude = geolocation.getAltitude();
  var altitudeAccuracy = geolocation.getAltitudeAccuracy();
  var heading = geolocation.getHeading();
  var speed = geolocation.getSpeed();
  var x = geolocation.getPosition()[0];
  var y = geolocation.getPosition()[1];
  var intX = parseInt(x);
  var intY = parseInt(y);
  var intAccuracy = parseInt(accuracy);
  // var headingShort = toFixed(heading);
  // var headingShort = parseFloat(heading.toString(), 2); // Funket ikke...
  var headingShort = parseFloat(heading).toFixed(2);
  var intAltitude = parseInt(altitude);
  var headingDegrees = radToDeg(heading);
  var intHeadingDegrees = parseInt(headingDegrees);

  // document.getElementById("debugGPS").innerHTML = "acc: " + intAccuracy + ", alt: " + intAltitude + ", head: " + headingShort + ", hDegrees: " + intHeadingDegrees;
});

// Hm... getAccuracyGeometry?
geolocation.on('change:accuracyGeometry', function () {
  onChangeAccuracyFeature();
});

geolocation.on('change:position', function () {
  onChangePositionFeature();
});

geolocation.on('error', function (error) {
  showError(error);
});

  // ol/Geolocation.GeolocationError (?)
  // https://openlayers.org/en/latest/apidoc/module-ol_Geolocation.GeolocationError.html
  function showError(error) {
    // Hvis man printer error får man bare opp object Object.
    console.log("geolocation, showError. error code: " + error.code + ", message: " + error.message);
    switch(error.code) {
      case error.PERMISSION_DENIED:
        document.getElementById("debugGPS").innerHTML = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        document.getElementById("debugGPS").innerHTML = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        document.getElementById("debugGPS").innerHTML = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        document.getElementById("debugGPS").innerHTML = "An unknown error occurred.";
        break;
      //
      case 1:
        document.getElementById("debugGPS").innerHTML = "User denied geolocation? In my case it was erroneous error. On Android: Settings > Location > App permissions > Set Chrome to allow when in use.";
        break;
      default:
        // Hvis ingen, bare poste hele error meldingen? ...
        // document.getElementById("debugGPS").innerHTML = error;
        document.getElementById("debugGPS").innerHTML = "Error! code: " + error.code + ", message: " + error.message;
        break;
    }

    setGPSKnappStil(false); // Hvis error så regner med at GPS ikke funker...
  }

  //

  document.getElementById("lukkeHovedVinduKnapp").addEventListener("click", function(){

    console.log("Du klikket på lukkeHovedVinduKnapp!");

    hovedVinduKnapper.style.opacity = "0";
    hovedVinduKnapper.style.pointerEvents = "none";
    hovedVinduContainer.style.opacity = "0";
    hovedVinduContainer.style.pointerEvents = "none";

    aapneHovedMenyKnapp.style.opacity = "0.9";
    aapneHovedMenyKnapp.style.pointerEvents = "all";

  });

  aapneHovedMenyKnapp.addEventListener("click", function(){
    console.log("Du klikket på aapneHovedVinduKnapp!");

    aapneHovedMenyKnapp.style.opacity = "0";
    aapneHovedMenyKnapp.style.pointerEvents = "none";

    hovedVinduKnapper.style.opacity = "1";
    hovedVinduKnapper.style.pointerEvents = "all";
    hovedVinduContainer.style.opacity = "1";
    hovedVinduContainer.style.pointerEvents = "all";
  });

  hovedMenySlide.addEventListener("touchstart", touchHandler, false);
  hovedMenySlide.addEventListener("touchmove", touchHandler, false);
  hovedMenySlide.addEventListener("touchcancel", touchHandler, false);
  hovedMenySlide.addEventListener("touchend", touchHandler, false);

  // 

  featureTilbakeKnapp.addEventListener("click", function(){
    featureTilbakeKnappFunksjon();
  });

  document.getElementById("featureTilbakeKnapp2").addEventListener("click", function(){
    featureTilbakeKnappFunksjon();
  });

  finnKnapp.addEventListener("click", function(){
    featureFinnKnappFunksjon();
  });

  document.getElementById("finnKnapp2").addEventListener("click", function(){
    featureFinnKnappFunksjon();
  });

}); // 

function featureTilbakeKnappFunksjon(){
  console.log("featureTilbakeKnapp klikket!");
  skjulSide(sideFeatureInfo);
  kartMenySideKlikk("divMenyKart");
  visSide(sideKartMeny);
  featureInfoAktiv = false;
  hovedVindu.scrollTop = 0; // Scroller til toppen.
}

function featureFinnKnappFunksjon(){
  console.log("finnKnapp klikket!");
    // For å sette view over center av feature.
    // Teste ut med .getExtent.getCenter() eller noe? Se fane/post om det.
}

// NOTE: Disse verdiene er definert øverst!
// hovedVinduContainerMarginBottomWhenScroll // marginBottom fra style > Mobile > hovedVinduContainer
// hovedVinduContainerMarginBottomWhenHidden // 36px mindre enn WhenScroll?
let touchHandler = function (e) {
  
  type = "";
  var x = 0, y = 0;
  var clickedSlideButton = false;

  if (e.touches && e.touches[0]) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else if (e.originalEvent && e.originalEvent.changedTouches[0]) {
    x = e.originalEvent.changedTouches[0].clientX;
    y = e.originalEvent.changedTouches[0].clientY;
  } else if (e.clientX && e.clientY) {
    x = e.clientX;
    y = e.clientY;
  }

  // Sigh, need to fix this...
  // 1. Start point.
  // 2. Move.
  // 3. End point.
  // However, also need to manage simple clicks (no move, just start and end).

  switch (e.type) {
    case "touchstart":
      type = "touchstart";
      startX = x;
      startY = y;
      // På touchstart, gjøre moveY og prevMoveY lik startY.
      moveX = x;
      moveY = y;
      prevMoveX = x;
      prevMoveY = y;
      break;
    case "touchmove":
      type = "touchmove";
      moveX = x;
      moveY = y;
      break;
    case "touchend":
      type = "touchend";
      endX = x;
      endY = y;

      // // // Sigh... Kalkulere det hver gang?
      var containerClick = getComputedStyle(hovedVinduContainer);
      var itemTopMarginClick = containerClick.marginTop; // 140px
      var topMarginClick = parseInt(itemTopMarginClick);

      var hovedVinduHeightClick = getComputedStyle(hovedVindu);
      var itemHeightClick = hovedVinduHeightClick.height;
      var pixelHeightClick = parseInt(itemHeightClick);

      // // Denne vil alltid starte som høy, siden det er default? Altså marginBottom: 108px;
      if(thresholdWhenHighMarginBottom == null){
        thresholdWhenHighMarginBottom = topMarginClick + pixelHeightClick;
        console.log("thresholdWhenHighMarginBottom: " + thresholdWhenHighMarginBottom);
        // Hm...
        marginTopMax = topMarginClick + pixelHeightClick; // 570
        marginTopHide = marginTopMax - 40; // 530
      }

      if(startX == moveX && startY == moveY){
        clickedSlideButton = true;
        // console.log("Single click?"); // Funker.

        // Så minTopMargin er 140. Kalkulere midtpunktet? F.eks. mt 140, h 827.
        // (827 - 140) / 2? = 687 / 2 = 343.5 // Nei? mt kan økes med 827 helt til h er 0.
        // Helt ned til null er: 140 + 827 = 967 (maks marginTop).
        // Så... Når marginTop er 140, er pixelHeight / 2 midtpunktet...
        // Hm... Hva gjør jeg hvis mt er over 140? F.eks. mt 295, h 672.
        // ((mt - 140) + h) / 2
        var midtpunktRounded = Math.round(((topMarginClick - 140) + pixelHeightClick) / 2); // Blir 414 uansett!

        console.log("topMarginClick: " + topMarginClick + ", pixelHeightClick: " + pixelHeightClick + ", midtpunktRounded: " + midtpunktRounded);

        if(pixelHeightClick > midtpunktRounded){
          // Lukke hovedVindu.
          // hovedVinduContainer.style.marginBottom = "60px";
          // hovedVinduContainer.style.marginBottom = "44px";
          hovedVinduContainer.style.marginBottom = hovedVinduContainerMarginBottomWhenHidden;
          hovedVindu.style.overflowY = "hidden";
          hovedVindu.style.opacity = "0";
          blokkerKartKnapper();

          var nyTopMarginNed = calculateThresholdMarginBottom();
          hovedVinduContainer.style.marginTop = nyTopMarginNed + "px";
          console.log("hovedVindu lukket!");
        } else {
          // Åpne hovedVindu.
          // hovedVinduContainer.style.marginBottom = "96px";
          // hovedVinduContainer.style.marginBottom = "80px";
          hovedVinduContainer.style.marginBottom = hovedVinduContainerMarginBottomWhenScroll;
          hovedVindu.style.overflowY = "scroll";
          hovedVindu.style.opacity = "1";
          tillattKartKnapperEtterDelay();

          var nyTopMarginOpp = minHovedMarginTop;
          hovedVinduContainer.style.marginTop = nyTopMarginOpp + "px";
          console.log("hovedVindu åpnet!");
        }
      }

      break;
    case "touchcancel":
      type = "touchcancel";
      endX = x;
      endY = y;
      break;
  }

  // Do something with hovedVinduContainer, if touchmove er forskjellig.
  if(moveY != prevMoveY){

    var yDifference = moveY - prevMoveY;
    var yDiffRounded = Math.round(yDifference); // Rounds to nearest integer!
    console.log("yDifference: " + yDifference + ", yDiffRounded: " + yDiffRounded); // + down, - up
    var style = getComputedStyle(hovedVinduContainer);
    var itemTopMargin = style.marginTop; // 140px
    var topMargin = parseInt(itemTopMargin); // 140
    // Check current height of hovedVindu
    var hovedVinduHeight = getComputedStyle(hovedVindu);
    var itemHeight = hovedVinduHeight.height;
    var pixelHeight = parseInt(itemHeight);

    console.log("itemTopmargin: " + itemTopMargin + ", topMargin: " + topMargin + ", hovedVinduHeight: " + itemHeight + ", pixelHeight: " + pixelHeight);

    // Håndtere mindre og større enn 0. Hvis akkurat 0, ikke gjøre noe?...
    if(yDiffRounded < 0){ // Oppover hvis marginTop mindre.
      var nyTopMarginOpp = topMargin + yDiffRounded;
      if(nyTopMarginOpp < minHovedMarginTop){
        nyTopMarginOpp = minHovedMarginTop; // Ikke mindre enn min.
      }

      if(nyTopMarginOpp < 0){ // For å gjøre hovedVindu scrollbart igjen tidlig.
        // Åpne hovedVindu.
      }

      hovedVinduContainer.style.marginTop = nyTopMarginOpp + "px";
      console.log("yDiffRounded: " + yDiffRounded + ", minHovedMarginTop: " + minHovedMarginTop + ". Ny marginTop er: " + nyTopMarginOpp);
    } else if(yDiffRounded > 0){ // Nedover hvis marginTop større.

      var nyTopMarginNed = topMargin + yDiffRounded;
      var nyHovedVinduHeight = pixelHeight - yDiffRounded;

      if(pixelHeight == 0){
        // Ikke forandre på noe.
        nyTopMarginNed = topMargin;
      } else if(pixelHeight < 0){
        // Substrahere pixelHeight slik at pixelHeight blir 0?
        nyTopMarginNed = topMargin + pixelHeight;
      } else {
        // Når pixelHeight er større enn 0:
        if(nyHovedVinduHeight <= 0){
          // Hvis y-forskjellen gjør at pixelHeight blir under 0:
          nyTopMarginNed += nyHovedVinduHeight;

          // Lukke hovedVindu.
        }
      }

      hovedVinduContainer.style.marginTop = nyTopMarginNed + "px";
      console.log("yDiffRounded: " + yDiffRounded + ", maxHovedMarginTop: " + maxHovedMarginTop + ". Ny marginTop er: " + nyTopMarginNed);
    }

  }

  prevMoveX = moveX;
  prevMoveY = moveY;

  // Sjekke til slutt etter å ha satt topMargin:
  var hovedVinduHeightEnd = getComputedStyle(hovedVindu);
  var itemHeightEnd = hovedVinduHeightEnd.height;
  var pixelHeightEnd = parseInt(itemHeightEnd);
  if (pixelHeightEnd >= 1) {
    // Åpne hovedVindu.
  } else {
    // Lukke hovedVindu.
  }

  if(!clickedSlideButton){

    if(parseInt(hovedVinduContainer.style.marginTop) < marginTopHide){
      if(!underMarginTopShowThreshold){
        hovedVindu.style.overflowY = "scroll";
        hovedVindu.style.opacity = "1";
        tillattKartKnapperEtterDelay();
        // hovedVinduContainer.style.marginBottom = "96px";
        // hovedVinduContainer.style.marginBottom = "80px";
        hovedVinduContainer.style.marginBottom = hovedVinduContainerMarginBottomWhenScroll;
      }
      underMarginTopShowThreshold = true;
    } else {
      if(underMarginTopShowThreshold){
        hovedVindu.style.overflowY = "hidden";
        hovedVindu.style.opacity = "0";
        blokkerKartKnapper();
        // hovedVinduContainer.style.marginBottom = "60px";
        // hovedVinduContainer.style.marginBottom = "44px";
        hovedVinduContainer.style.marginBottom = hovedVinduContainerMarginBottomWhenHidden;
      }
      underMarginTopShowThreshold = false;
    }

  }

  // // For debug:
  // var hovedContainerStyle = getComputedStyle(hovedVinduContainer);
  // var containerHeight = hovedContainerStyle.height;
  // var containerHeightPixels = parseInt(containerHeight);
  // document.getElementById("slideTextTest").innerHTML = "v: 15" + ", hv h: " + pixelHeightEnd + ", c h: " + containerHeightPixels + ", c mtop: " + hovedVinduContainer.style.marginTop + ", c mb: " + hovedVinduContainer.style.marginBottom + ", mtT: " + marginTopShowThreshold + ", isUT: " + underMarginTopShowThreshold + ", tmb: " + thresholdWhenHighMarginBottom;
}

function kartMenySideKlikk(divTrykketPaa){

  // 1: Hvis trykket på den som allerede er aktiv, ikke gjør noe.
  // 2: Hvis trykket på en som ikke er aktiv, deaktiver den aktive...
  // 3: Aktiver den nye som er trykket på.

  if(divTrykketPaa == sisteMenyAktiv){
    console.log("kartMenySideKlikk ~ trykket på den som allerede er aktiv, så ikke gjøre noe.");
    return;
  } else {
    console.log("kartMenySideKlikk ~ divTrykketPaa: " + divTrykketPaa + ", sisteMenyAktiv: " + sisteMenyAktiv);
    // resetBorderBottom(); // For enkelhetsskyld, resetter alle? ...

    // Deaktivering av den siste som var aktiv.
    switch(sisteMenyAktiv){
      case "divMenyKart":
        skjulSide(sideKartMeny);
        divMenyKartBilde.src = "./images/layer.png";
        headerKnappKartMeny.style.color = "black";
        headerKnappKartMeny.style.borderBottomColor = fargeTones5;
        //
        skjulSide(sideFeatureInfo); // Skjuler alltid begge.
        break;
      case "divMenyDel":
        skjulSide(sideDelKartvisning);
        divMenyDelBilde.src = "./images/share.png";
        headerKnappDel.style.color = "black";
        headerKnappDel.style.borderBottomColor = fargeTones5;
        break;
      case "divMenyOm":
        skjulSide(sideOmMarkakartet);
        divMenyOmBilde.src = "./images/information.png";
        headerKnappOm.style.color = "black";
        headerKnappOm.style.borderBottomColor = fargeTones5;
        break;
      case "divMenyStott":
        skjulSide(sideStott);
        divMenyStottBilde.src = "./images/favicon-only-inner-large-black.png";
        headerKnappStott.style.color = "black";
        headerKnappStott.style.borderBottomColor = fargeTones5;
        break;
      default:
        break;
    }

    // Setter ny siste-aktiv:
    sisteMenyAktiv = divTrykketPaa;
  }

  hovedVindu.scrollTop = 0; // Scroll to top når bytter side.

  // Aktivering:
  switch(divTrykketPaa){
    case "divMenyKart":
      divMenyKartBilde.src = "./images/layer-white.png";
      headerKnappKartMeny.style.color = "white";
      headerKnappKartMeny.style.borderBottom = "3px solid white";
      // visSide(sideKartMeny);
      // visSide(sideFeatureInfo);
      if(featureInfoAktiv){
        visSide(sideFeatureInfo);
      } else {
        visSide(sideKartMeny);
      }
      break;
    case "divMenyDel":
      divMenyDelBilde.src = "./images/share-white.png";
      headerKnappDel.style.color = "white";
      headerKnappDel.style.borderBottom = "3px solid white";
      visSide(sideDelKartvisning);
      // Test
      document.getElementById("colorPickerButton").jscolor.show();
      // Kjør genererURL når divMenyDel velges, siden kartlag kanskje har blitt forandret.
      genererURL();
      break;
    case "divMenyOm":
      divMenyOmBilde.src = "./images/information-white.png";
      headerKnappOm.style.color = "white";
      headerKnappOm.style.borderBottom = "3px solid white";
      visSide(sideOmMarkakartet);
      break;
    case "divMenyStott":
      divMenyStottBilde.src = "./images/favicon-only-inner-large-white.png";
      headerKnappStott.style.color = "white";
      headerKnappStott.style.borderBottom = "3px solid white";
      visSide(sideStott);
      break;
    default:
      break;
  }
}

// Kartlag-funksjoner

// Hm... Begynne med bakgrunnskartene?

function leggTilKartlag(gruppe, kartlag){

  // LEGGE TIL

  map.getLayers().forEach(group => {

    if(group.get("name") == gruppe){
      var layers = group.getLayers();
      layers.push(kartlag);
      // 
      group.setLayers(layers); // Funka nå! På Stack exchange eller noe.

      console.log("La til kartlaget " + kartlag.get("name") + " til gruppen " + group.get("name") + ".");
    }

  });

}

function taBortKartlag(gruppe, kartlag){

  // TA BORT

  // // Funker... Fant på Stackoverflow.
  // map.getLayers().getArray()
  // .filter(layer => layer.get('name') === 'Geometri')
  // .forEach(
  //   layer => {
  //   // map.removeLayer(layer)
  //   );

}

// 
function lagFinnesIKartObjektet(gruppeNavn, kartlagNavn){
  var fantGruppe = false;
  var fantKartlag = false;
  map.getLayers().getArray().forEach(group => {
    // console.log("lagFinnesIKartObjektet ~ gruppe: " + group.get("name"));
    if(group.get("name") == gruppeNavn){
      fantGruppe = true;
      group.getLayers().forEach(layer => {
        // console.log("lagFinnesIKartObjektet ~ lag: " + layer.get("name"));
        if(layer.get("name") == kartlagNavn){
          console.log("Skal egentlig returnere true her. layer name: " + layer.get("name") + ", kartlagNavn: " + kartlagNavn);
          fantKartlag = true;
          return fantKartlag; // Funker heller ikke... Klarer ikke returnere tidlig.
          return true; // DEN KLARER IKKE RETURNERE HER...
          return Boolean([true]);
        }
      });
    }
  });

  if(!fantGruppe){
    console.log("lagFinnesIKartObjektet ~ fant ikke gruppen " + gruppeNavn + ". Skrivefeil?");
  }

  return fantKartlag;
}

function skjulKartlag(layer, lagIndeks){
  if (layer.get("visible") == true){
    layer.setVisible(false);
    if(lagIndeks > -1){
      // hovedMenyKlasseIndikator[lagIndeks].style.opacity = "0";
      hovedMenyKlasseIndikator[lagIndeks].style.opacity = "0.1";
    }
    console.log(layer.get("name") + " er nå skjult! visible: " + layer.get("visible"));
  }
}

function visKartlag(layer, lagIndeks){
  if(layer.get("visible") == false){
    layer.setVisible(true);
    if(lagIndeks > -1){
      hovedMenyKlasseIndikator[lagIndeks].style.opacity = "1";
    }
    console.log(layer.get("name") + " er nå synlig! visible: " + layer.get("visible"));
  }
}

function settSynlighetKartlag(layer, lagIndeks){
  if (layer.get("visible") == true) {
    layer.setVisible(false);
    if(lagIndeks > -1){
      // hovedMenyKlasseIndikator[lagIndeks].style.opacity = "0";
      hovedMenyKlasseIndikator[lagIndeks].style.opacity = "0.1";
    }
    console.log(layer.get("name") + " er nå skjult! visible: " + layer.get("visible"));
  } else {
    layer.setVisible(true);
    if(lagIndeks > -1){
      hovedMenyKlasseIndikator[lagIndeks].style.opacity = "1";
    }
    console.log(layer.get("name") + " er nå synlig! visible: " + layer.get("visible"));
  }
}

function forandreSynlighetKartlagUtenIndeks(kartlagGruppe, kartlagNavn) {
  map.getLayers().getArray().forEach(group => {
    var gruppeNavn = group.get("name");

    if (gruppeNavn == kartlagGruppe) {

      // Ekstra sjekk for bakgrunnskart?:
      if (kartlagGruppe == "Bakgrunnskart") {

        if (lagFinnesIKartObjektet(kartlagGruppe, kartlagNavn) == false) {
          console.log("Bakgrunnskart --- kartlaget " + kartlagNavn + " finnes ikke i kart-objektet, så returnerer tidlig.");
          return; // Hvis det ikke eksisterer, returner tidlig?
        }

        group.getLayers().forEach(layer => {
          var lagNavn = layer.get("name");
          // Hent lagIndeks:
          var lagIndeks = -1;

          try {
            lagIndeks = htmlKartLagDict[kartlagNavn]["lagIndeks"];
            console.log("Fant lagIndeks med htmlKartLagDict. Kartlaget " + lagNavn + " har indeks " + lagIndeks);
          } catch (error) {
            console.log("Noe error med å hente lagIndeks fra htmlKartLagDict. Skrivefeil?");
          }

          if (lagNavn === kartlagNavn) {
            visKartlag(layer, lagIndeks);
          } else {
            skjulKartlag(layer, lagIndeks);
          }

        });

      } else {
        group.getLayers().forEach(layer => {

          var lagNavn = layer.get("name");
          if (lagNavn === kartlagNavn) {

            // Hent lagIndeks:
            var lagIndeks = -1;

            try {
              lagIndeks = htmlKartLagDict[kartlagNavn]["lagIndeks"];
              // console.log("Fant lagIndeks med htmlKartLagDict. Kartlaget " + lagNavn + " har indeks " + lagIndeks);
            } catch (error) {
              console.log("Noe error med å hente lagIndeks fra htmlKartLagDict. Skrivefeil?");
            }

            settSynlighetKartlag(layer, lagIndeks);

          }

        });
      }

    }

  });
}

// Funker!
function forandreSynlighetKartlag(kartlagGruppe, kartlagNavn, kartLagIndeks) {

  // Blokkering ved åpning av hovedVindu på mobil:
  if(blokkerHovedVinduTrykk) return;

  console.log("kartlagGruppe: " + kartlagGruppe + ", kartlagNavn: " + kartlagNavn + ", kartLagIndeks: " + kartLagIndeks);

  map.getLayers().getArray().forEach(group => {

    var gruppeNavn = group.get("name");
    // console.log(gruppeNavn);

    if(gruppeNavn == kartlagGruppe){
      console.log("gruppeNavn matcher kartlagGruppe! gruppeNavn: " + gruppeNavn + ", kartlagGruppe: " + kartlagGruppe);

      if(kartlagGruppe == "Bakgrunnskart"){

        if(lagFinnesIKartObjektet(kartlagGruppe, kartlagNavn) == false){
          console.log("Bakgrunnskart --- kartlaget " + kartlagNavn + " finnes ikke i kart-objektet, så returnerer tidlig.");
          return; // Hvis det ikke eksisterer, returner tidlig?
        }

        group.getLayers().forEach(layer => {

          var lagNavn = layer.get("name");
          // console.log(lagNavn);

            // Hent lagIndeks:
            var lagIndeks = -1;

            try {
              lagIndeks = htmlKartLagDict[lagNavn]["lagIndeks"];
              // console.log("Fant lagIndeks med htmlKartLagDict. Kartlaget " + lagNavn + " har indeks " + lagIndeks);
            } catch(error){
              console.log("Noe error med å hente lagIndeks fra htmlKartLagDict. Skrivefeil?");
            }
          
            if (lagNavn === kartlagNavn) {
              visKartlag(layer, lagIndeks);
          } else {
              skjulKartlag(layer, lagIndeks);
          }
  
        });

      } else {
        group.getLayers().forEach(layer => {

          var lagNavn = layer.get("name");
          // console.log(lagNavn);
          
          if(lagNavn == kartlagNavn){
            settSynlighetKartlag(layer, kartLagIndeks); // NOTE: kartLagIndeks er fra funksjon argument.
          }
  
        });
      }

    }

  });

  // NOTE: Kan bruke filter(), men jeg tror ikke det funket? ...

  // map.getLayers().getArray()
  //   .filter(layer => layer.get('name') === gruppe)
  //   .forEach(
  //     layer => {
  //       var lagNavn = layer.get("name");
  //       console.log(lagNavn);
  //     }
  //   );

}

function resetBorderBottom(){
  headerKnappKartMeny.style.color = "black";
  headerKnappKartMeny.style.borderBottomColor = fargeTones5;
  headerKnappDel.style.color = "black";
  headerKnappDel.style.borderBottomColor = fargeTones5;
  headerKnappOm.style.color = "black";
  headerKnappOm.style.borderBottomColor = fargeTones5;
  headerKnappStott.style.color = "black";
  headerKnappStott.style.borderBottomColor = fargeTones5;
}

function visSideOgSkjulResten(side){
  side.style.display = "block";
  if(side != sideKartMeny){
    sideKartMeny.style.display = "none";
  }
  if(side != sideDelKartvisning){
    sideDelKartvisning.style.display = "none";
  }
  if(side != sideOmMarkakartet){
    sideOmMarkakartet.style.display = "none";
  }
  if(side != sideStott){
    sideStott.style.display = "none";
  }
}

function visSide(side){
  side.style.display = "block";
}

function skjulSide(side){
  side.style.display = "none";
}

function skjulSider(){
  sideKartMeny.style.display = "none";
  sideDelKartvisning.style.display = "none";
  sideOmMarkakartet.style.display = "none";
  sideStott.style.display = "none";
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
  var kodeStreng = String(hentAktiveKartlag());
  // console.log("kodeStreng: " + kodeStreng + ", typeof: " + typeof(kodeStreng));
  if(kodeStreng != "" && kodeStreng != "undefined"){
    // console.log("genererURL ~ kodeStreng er ikke tom og heller ikke undefined.");
    generertURL += "&lag=" + kodeStreng;
  }

  console.log("generertURL: " + generertURL);
  delGenerertURL.textContent = generertURL;
  // Reset:
  delCallbackKopiering.textContent = "";
}

// Oof, blir feil med &! 
function copyTextToClipboard(text) {
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

// Hm... Så det den skal gjøre... Finne ut hvilke kartlag som er aktive,
// altså har get("visible") == true.
// Også... Hm... Returnere noe? Lage en streng?
function hentAktiveKartlag() {
  if(map == null) return; // Funker!

  // var kodeStreng = "".toString(); // Dette funker. Lol... :/
  // var kodeStreng = String("");
  var kodeStreng = "";

  map.getLayers().getArray().forEach(group => {

    var gruppeNavn = group.get("name");
    // console.log(gruppeNavn);

    if (gruppeNavn != "Bakgrunnskart") {

      group.getLayers().forEach(layer => {

        var lagNavn = layer.get("name");
        // console.log(lagNavn);

        if (layer.get("visible") == true) {
          // console.log("hentAktiveKartlag ~ Fant synlig kartlag!: " + lagNavn);

          // Hent lagIndeks:
          var lagIndeks = -1;
          var lagKode = "";

          try {
            lagIndeks = htmlKartLagDict[lagNavn]["lagIndeks"];
            lagKode = layer.get("kode");
            // console.log("Fant lagIndeks med htmlKartLagDict. Kartlaget " + lagNavn + " har indeks " + lagIndeks);
          } catch (error) {
            console.log("Noe error med å hente lagIndeks fra htmlKartLagDict. Skrivefeil?");
          }

          if(lagIndeks > -1 && lagKode != ""){
            if(kodeStreng != ""){
              kodeStreng += ",";
            }
            kodeStreng += lagKode;
          }
        }

      });

    }

  });

  // console.log("hentAktiveKartlag ~ kodeStreng: " + kodeStreng);
  return kodeStreng;
  return String(kodeStreng);
}

const displayFeatureInfo = function (pixel) {

  // if(featureSelectionList.includes(featureHovered)) {
  //   console.log("featureHovered is in featureSelectionList!");
  // } else if (featureHovered != null) {

  // }

  // Ved klikk utenfor. // Hm... Bruke for alle?
  if(featureSelectionList.length > 0){
    featureSelectionList.forEach(feature => {
      // Hm... For deselect, gjøre noe for dashed? Hm...

      var snarvei = feature.get("Stiplet");
      // var erEnSnarvei = false;

      if(snarvei == null){
        feature.setStyle(undefined); // Ikke en tur.
      } else {
        snarvei = parseInt(snarvei);
        if (snarvei > 0) {
          // Her er turen en snarvei...
          // erEnSnarvei = true;
          // Hm, lagre featureSelectionList som en dictionary eller noe? ...
          // For så å kunne lagre feature style.
          var NAVN = feature.get("NAVN");
          var dictEntry = featureSelectionDict[NAVN];
          if(dictEntry != null){
            var stilDashed = dictEntry["stilDashed"];
            if(stilDashed != null){
              feature.setStyle(stilDashed);
              console.log("Satt stilDashed for snarveien kalt med NAVN: " + NAVN);

              // Debug:
              // document.getElementById("debugVinduTekst").innerHTML += " | Klikk, tømmer lista ~ satt stilDash for snarvei: " + NAVN;
            }
          }

        } else {
          feature.setStyle(undefined); // En tur, men ikke en snarvei.
        }
      }

      // feature.setStyle(undefined);
    });
    featureSelectionList = [];
  }

  popupContainer.style.display = "none";
  popupContent.innerHTML = "";

  // Bare første? ... Eller bare siste? ... // "all" bruker egentlig default.
  var selectMetode = "all"; // first, last, all
  // NOTE: Glem "last". Kommer til å bli kluss...
  var firstFeatureSelected = false; // Bare brukt for "first" mode.
  var fullTekst = ""; // Brukt for "all" feature selection.

  map.forEachFeatureAtPixel(pixel, function (feature, layer) {

    var lagnavn = layer.get("name"); // navn på kartlaget
    var uiLagnavn = layer.get("uiName");
    var clickable = layer.get("clickable");
    // console.log("displayFeatureInfo ~ lagnavn: " + lagnavn + ", uiLagnavn: " + uiLagnavn + ", clickable: " + clickable);

    if (clickable && feature) {
      var navn = feature.get('navn');
      var name = feature.get('name');
      // Hm/Sukk, kalenderrutene bruker "NAVN", så sjekk for det også?
      var NAVN = feature.get('NAVN');
      var endeligeNavn = "Navn på området mangler";
      // console.log("clickable og feature! navn: " + navn + ", name: " + name + ", NAVN: " + NAVN);

      var featureSelection = feature; // Bruke featureSelectionList for alle?

      // NOTE: Ta bort de andre modes... Bare ha "all".

      var fargeFill = layer.get("fillColorSelect");
      var fargeStroke = layer.get("strokeColorSelect");
      var cssStil = "style='background-color: " + fargeFill + "; border-color: " + fargeStroke + ";'";

      // fullTekst += "<div class='divHolder'><div class='divFarge' " + cssStil + "></div><span class='divNavn'>";

      // Hm, ikke optimal måte å sjekke feature-navn på... Finne en bedre måte senere?

      if (navn) {
        if (navn != "" && navn != "na") {
          endeligeNavn = navn;
        }
      } else if (name) {
        if (name != "" && name != "na") {
          endeligeNavn = name;
        }
      } else if(NAVN){
        if(NAVN != "" && NAVN != "na"){
          endeligeNavn = NAVN;
        }
      }

      // Hm... Bare navn? Men det er ikke nok, siden noen turer har samme navn..
      
      // VIKTIG NOTAT (VERSJON 1): IKKE VIS FEATURE INFO på versjon 1.
      fullTekst += '<div class="divHolder">';
      // fullTekst += '<div class="divHolder" onclick="viseFeatureInfo(\'' + endeligeNavn + '\')">';
      fullTekst += "<div class='divFarge' " + cssStil + "></div><span class='divNavn'>";

      fullTekst += endeligeNavn;
      fullTekst += "</span>"; // For divNavn klassen.
      fullTekst += "</div>"; // For divHolder klassen.

      // Gjøre for dashed...

      // Sjekke for snarvei (stiplet):
      var snarvei = feature.get("Stiplet");
      var erEnSnarvei = false;

      if (snarvei != null) {
        snarvei = parseInt(snarvei);
        if (snarvei > 0) {
          // Her er turen en snarvei...
          erEnSnarvei = true;
        }
      }

      if (!erEnSnarvei) {
        // Ikke en snarvei.
        if (useDefaultWhiteStyle) {
          featureSelection.setStyle(defaultWhiteSelectStyle);
        } else {
          var stilSelect = layer.get("stilSelect");
          if (stilSelect != null) {
            featureSelection.setStyle(stilSelect);
          } else {
            featureSelection.setStyle(defaultWhiteSelectStyle);
          }
        }
      } else {
        // Er en tur snarvei!

        // Bare lage dictionary-entry for snarveier?
        var NAVN = feature.get("NAVN");
        var stilDashedGet = layer.get("stilDashed");
        var stilDashedSelectGet = layer.get("stilDashedSelect");

        featureSelectionDict[NAVN] = {
          // navn: endeligeNavn,
          feature: featureSelection,
          stilDashed: stilDashedGet,
          stilDashedSelect: stilDashedSelectGet
        };
        console.log(featureSelectionDict);

        if (useDefaultWhiteStyle) {
          featureSelection.setStyle(defaultWhiteDashedSelectStyle);
        } else {
          if (stilDashedSelectGet != null) {
            featureSelection.setStyle(stilDashedSelectGet);

            // Debug
            // document.getElementById("debugVinduTekst").innerHTML += " | Klikk ~ Satt stilDashedSelect på snarvei: " + NAVN;
          } else {
            featureSelection.setStyle(defaultWhiteDashedSelectStyle);
          }
        }

        // Debug
        // document.getElementById("debugVinduTekst").innerHTML += " | satt dashed for snarvei: " + NAVN;
      }

      featureSelectionList.push(featureSelection); // !
      popupContainer.style.display = "block";
    }

    popupContent.innerHTML = fullTekst;

  });

};

// Denne funka... Funka ikke å gjøre feature.get('') på den over, fikk error om at den ikke har .get...
// NOTE: Hm, trenger å finne en måte å identifisere om feature er en tur eller et område...
function viseFeatureInfo(featureNavn){
  console.log("viseFeatureInfo triggered! featureNavn: " + featureNavn);
  // Hm... Gjøre aktiv uansett ved klikk på feature? Selv om feature-objektet er null? ...
  visSide(sideFeatureInfo);
  kartMenySideKlikk("divMenyKart");
  skjulSide(sideKartMeny);
  featureInfoAktiv = true;

  // Kan så finne feature-objektet i listen featureSelectionList.
  var feature = hentFeatureMedNavn(featureNavn);
  console.log(feature); // DEBUG
  // Hm. Det vil også være forskjellig feature info for turer og områder...
  var aar = feature.get("AAR");
  var maanednavn = feature.get("MAANEDNAVN");
  var kort = feature.get("KORT");
  var maanedstur = feature.get("MAANEDSTUR");
  // var snarveier = feature.get("Stiplet"); // Stiplets / "snarveier"

  // Hm... Så hvis ikke finner feature, nullstille alt kanskje? ...
  // IDs:
  // sideFeatureInfo (definert)
  // featureInfoTittel        --- Tittel
  // featureKalenderTekst     --- 
  // featureSted              --- 
  // featureArstid            --- 
  // featureVanskelighetsgrad --- 
  // featureTurType           --- 
  // featureBilder            --- 
  // featureBeskrivelse       --- 
  // featureReisevei          --- 
  // featureTags              --- 
  // featureLink              --- 

  // Bare for turer:
  // featureTurKalenderGruppe --- 
  // featureTurArstidGruppe   --- 
  // featureTurVanskelighetsgradGruppe  --- 
  // featureTurTypeGruppe     --- 
  if(feature != null){
    console.log("viseFeatureInfo ~ fant feature! feature: " + feature);

    if(maanedstur != null){
      // TUR
      document.getElementById("featureInfoTittel").innerHTML = featureNavn;
      document.getElementById("featureKalenderTekst").innerHTML = kort;

      document.getElementById("featureTurKalenderGruppe").style.display = "block";
      document.getElementById("featureTurArstidGruppe").style.display = "block";
      document.getElementById("featureTurVanskelighetsgradGruppe").style.display = "block";
      document.getElementById("featureTurTypeGruppe").style.display = "block";
    } else {
      // OMRÅDE
      document.getElementById("featureTurKalenderGruppe").style.display = "none";
      document.getElementById("featureTurArstidGruppe").style.display = "none";
      document.getElementById("featureTurVanskelighetsgradGruppe").style.display = "none";
      document.getElementById("featureTurTypeGruppe").style.display = "none";

      document.getElementById("featureInfoTittel").innerHTML = featureNavn;
    }

  } else {
    console.log("viseFeatureInfo ~ Hm, fant ikke feature i featureSelectionList?!");
  }
}

function hentFeatureMedNavn(featureNavn){
  var featureNavnFunnet = false;
  var endeligeNavn;
  var featureMatch;

  for (let i = 0; i < featureSelectionList.length; i++){
    // const element = array[index];
    var feature = featureSelectionList[i];

    var navn = feature.get("navn");
    if(navn == featureNavn){
      console.log("navn == featureNavn! navn: " + navn);
      featureNavnFunnet = true;
      endeligeNavn = navn;
      featureMatch = feature;
      return feature;
      break;
    }

    var name = feature.get("name");
    if(name == featureNavn){
      console.log("name == featureNavn! name: " + name);
      featureNavnFunnet = true;
      endeligeNavn = name;
      featureMatch = feature;
      return feature;
      break;
    }

    var NAVN = feature.get("NAVN");
    if(NAVN == featureNavn){
      console.log("NAVN == featureNavn! NAVN: " + NAVN);
      featureNavnFunnet = true;
      endeligeNavn = NAVN;
      featureMatch = feature;
      return feature;
      break;
    }
  }

  if(featureNavnFunnet && featureMatch != null){
    return featureMatch;
  } else {
    return null;
  }
}

function skjulAlleLag(){
  if(blokkerKnappAlleTrykk) return;

  console.log("skjulAlleLag triggered!");

  map.getLayers().getArray().forEach(group => {
    if(group.get("name") != "Bakgrunnskart"){
      
      group.getLayers().forEach(layer => {
        var lagNavn = layer.get("name");
        // console.log(lagNavn);

        // Må hente lagIndeks:
        var lagIndeks = -1;
        try {
          lagIndeks = htmlKartLagDict[lagNavn]["lagIndeks"];
          console.log("Fant lagIndeks med htmlKartLagDict. Kartlaget " + lagNavn + " har indeks " + lagIndeks);
        } catch (error) {
          console.log("Noe error med å hente lagIndeks fra htmlKartLagDict. Skrivefeil?");
        }

        skjulKartlag(layer, lagIndeks);

      });

    }
  });

}

function visAlleLag(){
  if(blokkerKnappAlleTrykk) return;

  console.log("visAlleLag triggered!");

  map.getLayers().getArray().forEach(group => {
    if(group.get("name") != "Bakgrunnskart"){
      
      group.getLayers().forEach(layer => {
        var lagNavn = layer.get("name");
        // console.log(lagNavn);

        // Må hente lagIndeks:
        var lagIndeks = -1;
        try {
          lagIndeks = htmlKartLagDict[lagNavn]["lagIndeks"];
          console.log("Fant lagIndeks med htmlKartLagDict. Kartlaget " + lagNavn + " har indeks " + lagIndeks);
        } catch (error) {
          console.log("Noe error med å hente lagIndeks fra htmlKartLagDict. Skrivefeil?");
        }

        visKartlag(layer, lagIndeks);

      });

    }
  });

}

function toggleKartKnapperEtterDelay(TillattPointerEvents, delay){
  console.log("toggleKartKnapperEtterDelay triggered!");
  setTimeout(() => {
    console.log("toggleKartKnapperEtterDelay delay triggered!");
    if(TillattPointerEvents){
      // Bare tillatt pointerEvents, hvis hovedmenyen faktisk er synlig.
      if(hovedVindu.style.overflowY != "hidden"){
        document.getElementById("alleKnapperContainer").style.pointerEvents = "all";
      }
      // document.getElementById("alleKnapperContainer").style.pointerEvents = "all";
    } else {
      document.getElementById("alleKnapperContainer").style.pointerEvents = "none";
    }
  }, delay);
}

function blokkerKartKnapper(){
  blokkerKnappAlleTrykk = true;
  // Tror ikke det funker, men test...
  // hovedVindu.style.pointerEvents = "none"; // Funker ikke.
  blokkerHovedVinduTrykk = true;
}

// Bare boolean som funker. F..k pointerEvents, sorry :/
function tillattKartKnapperEtterDelay(){
  // console.log("tillattKartKnapperEtterDelay triggered!");
  setTimeout(() => {
    // console.log("tillattKartKnapperEtterDelay delay reached!");
      if(hovedVindu.style.overflowY != "hidden"){
        blokkerKnappAlleTrykk = false;
        // Tror ikke det funker, men test...
        // hovedVindu.style.pointerEvents = "all"; // Funker ikke.
        blokkerHovedVinduTrykk = false;

        // console.log("tillattKartKnapperEtterDelay ~ hovedVindu har overflowY som IKKE er hidden!");
      } else {
      // console.log("tillattKartKnapperEtterDelay ~ hovedVindu har overflowY HIDDEN!");
    }
  // }, 1000);
}, 500); // Prøve med et halvt sekund istedenfor? Kanskje det holder?
}

function aktiverKartlagMedKoder(){

  map.getLayers().getArray().forEach(group => {
    var gruppeNavn = group.get("name");
    if(gruppeNavn != "bakgrunnskart"){
      group.getLayers().forEach(layer => {
        var kode = layer.get("kode");
        if(lagListeFraURL.includes(kode)){
          var lagNavn = layer.get("name");
          // console.log("aktiverKartlagMedKoder ~ layer i lagListeFraURL! kode: " + kode + ", lagNavn: " + lagNavn);
          forandreSynlighetKartlagUtenIndeks(gruppeNavn, lagNavn);
        }
      });
    }
  });

}

// Manuell forandring av gruppevisning (expand av kartgruppe).
// Gjør det samme som klikkfunksjonene av pilene.
function toggleGruppeVisning(inputGruppeNavn){
  var gruppeIndex = finnIndexForGruppe(inputGruppeNavn);
  if(gruppeIndex >= 0){
    if(mainMenuClassSubmenus[gruppeIndex].style.opacity == "1"){
      mainMenuClassSubmenus[gruppeIndex].style.opacity = "0";
      mainMenuClassSubmenus[gruppeIndex].style.height = "0";
      mainMenuClassSubmenus[gruppeIndex].style.paddingTop = "0";
      mainMenuClassSubmenus[gruppeIndex].style.paddingBottom = "0";
      mainMenuClassExpands[gruppeIndex].style.transform = "translateY(0px) translateX(0px) rotate(0deg)";
    } else {
      mainMenuClassSubmenus[gruppeIndex].style.opacity = "1";
      mainMenuClassSubmenus[gruppeIndex].style.height = "auto";
      mainMenuClassSubmenus[gruppeIndex].style.paddingTop = "1rem";
      mainMenuClassSubmenus[gruppeIndex].style.paddingBottom = "0.125rem";
      mainMenuClassExpands[gruppeIndex].style.transform = "translateY(-6px) translateX(0px) rotate(90deg)";
    }
  }
}

function settIndikatorFargeManuelt(inputLagNavn, strokeFarge, fillFarge){
  // Hm. Først, trenger å finne indeks for kartlaget for så å finne riktig indikator.
  // Check if color is valid?
  if(CSS.supports("color", strokeFarge) && CSS.supports("color", fillFarge)){
    var lagIndeks = finnIndeksForKartlag(inputLagNavn);
    if(lagIndeks >= 0){
      hovedMenyKlasseIndikator[finnIndeksForKartlag(inputLagNavn)].style.borderColor = strokeFarge;
      hovedMenyKlasseIndikator[finnIndeksForKartlag(inputLagNavn)].style.backgroundColor = fillFarge;
    }
  }
}

function toggleTracking(state){
  geolocation.setTracking(state);
  console.log("tracking er nå: " + state);

  var debugGPS = document.getElementById("debugGPS");
  if(debugGPS != null){
    debugGPS.innerHTML = "Tracking: " + state;
  }

  if(!state){
    // Ta bort features i vectorSourceGPS:
    // vectorSourceGPS.clear();
    // vectorSourceGPS.getFeatures()
    vectorSourceGPS.forEachFeature(feature => {
      vectorSourceGPS.removeFeature(feature);
    });
  } else {
    // Geolocation (GPS) skrus på. Resette denne booleanen:
    sentrertViewPaaGPS = false;

    // Lage på nytt?
    lagAccuracyFeature();
    lagpositionFeature();
    // Trigge disse når GPS blir skrudd på igjen.
    onChangeAccuracyFeature();
    onChangePositionFeature();
    // For debug:
    const coordinates = geolocation.getPosition();
    console.log(coordinates);
  }
}

function onChangeAccuracyFeature(){
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
  // Test... // Funket ikke? Men ikke error heller? Hm... Eller vet ikke.
  // Siden den trigger ikke på desktop...
  // flash(accuracyFeature, bakgrunnskartOSM);
}

// Omg... Prøve å gjøre animeringen på map.click først? ...

function onChangePositionFeature(){
  const coordinates = geolocation.getPosition();
  // positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);

  if(coordinates){
    if(positionFeaturePunkt != null){
      // Sentrere view til gps posisjon her?
      if(!sentrertViewPaaGPS && brukeViewSentreringMedGPS){
        sentrertViewPaaGPS = true;
        map.getView().setCenter(coordinates); // Ser ut til å virke!
      }

      var start = positionFeaturePunkt.getCoordinates();
      // console.log(start);
      var end = coordinates;
      // console.log(end);
      // Så, sette dem i en lineString.
      lineStringFlytt.setCoordinates([start, end]); // Yep!
      // console.log(lineStringFlytt.getCoordinates());
      // Linjedistanse.
      const lineDistance = ol.sphere.getLength(lineStringFlytt); // Funker bra!
      // console.log("lineStringFlytt ~ lineDistance: " + lineDistance);
      // Så... Start animering? ...
      startFlyttPosisjonFeature();
    } else {
      positionFeaturePunkt = new ol.geom.Point(coordinates);
      positionFeature.setGeometry(positionFeaturePunkt);
    }
  } else {
    positionFeaturePunkt = null;
    positionFeature.setGeometry(positionFeaturePunkt);
  }

}

function lagGpsStiler(){
  positionFeatureStil = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: '#3399CC',
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2,
      }),
    }),
  })
}

function lagAccuracyFeature(){
  accuracyFeature = new ol.Feature();
  vectorSourceGPS.addFeature(accuracyFeature);
}

function lagpositionFeature(){
  // positionFeature = new ol.Feature();
  positionFeature = new ol.Feature({
    type: 'geoMarker',
    name: "positionFeature",
    geometry: null
  });
  positionFeature.setStyle(
    positionFeatureStil
  );
  vectorSourceGPS.addFeature(positionFeature);
}

function flyttFeature(event){

  var msBrukt = event.frameState.time - tidFlyttStart;
  var distanse = msBrukt * msHastighet;

  // console.log("flyttFeature ~ msBrukt: " + msBrukt + ", distanse: " + distanse);

  const currentCoordinate = lineStringFlytt.getCoordinateAt(
    distanse
  );

  positionFeaturePunkt.setCoordinates(currentCoordinate);
  const vectorContext = ol.render.getVectorContext(event);
  vectorContext.setStyle(positionFeatureStil);
  vectorContext.drawGeometry(positionFeaturePunkt);
  map.render(); // // tell OpenLayers to continue the postrender animation

  if(distanse >= 1){
    avsluttFlyttPosisjonFeature();
    return;
  }
}

function startFlyttPosisjonFeature(){
  tidFlyttStart = Date.now();
  vektorLagGPS.on('postrender', flyttFeature);
  positionFeature.setGeometry(null);
  console.log("startFlyttPosisjonFeature starter!");
}

function avsluttFlyttPosisjonFeature(){
  tidFlyttStart = 0;
  positionFeature.setGeometry(positionFeaturePunkt);
  vektorLagGPS.un('postrender', flyttFeature);
  console.log("avsluttFlyttPosisjonFeature ferdig!");
}

function calculateThresholdMarginBottom(){
  var containerClick = getComputedStyle(hovedVinduContainer);
  var itemTopMarginClick = containerClick.marginTop; // 140px
  var topMarginClick = parseInt(itemTopMarginClick);

  var hovedVinduHeightClick = getComputedStyle(hovedVindu);
  var itemHeightClick = hovedVinduHeightClick.height;
  var pixelHeightClick = parseInt(itemHeightClick);

  var thresholdMarginBottom = topMarginClick + pixelHeightClick;;
  console.log("thresholdMarginBottom: " + thresholdMarginBottom);
  return thresholdMarginBottom;
}

// Laging av WMTS kartlag. Spesielt for bakgrunnskart.
function lagWMTSLag(){
  for (const [key, value] of Object.entries(dataDictWMTS)) {
      // console.log(key, value);
      // console.log(value["capabilityURL"]); // Funker!
      lagBakgrunnskartWMTS(value["capabilityURL"], value["kartlagWMTS"], value["kartlagNavn"], value["kode"]);
  }
}

// NOTAT: Lagt til her istedenfor i kartFunksjoner.js, fordi
// den trenger å bruke hovedMenyKlasseKartlagTekst.
// Laging av WMTS kartlag. Spesielt for bakgrunnskart.
async function lagBakgrunnskartWMTS(capabilityURL, kartlagWMTS, lagNavn, lagKode) {
  // var capabilityURL = "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities";
  // var kartlagWMTS = "topo4";

  var parser = new ol.format.WMTSCapabilities();
  var capability = await fetch(capabilityURL);

  if (capability.ok) {
    try {

      let capabilityText = await capability.text();
      const result = await parser.read(capabilityText);

      // generer config for nytt lag
      const options = await ol.source.WMTS.optionsFromCapabilities(result, {
        layer: kartlagWMTS,
        matrixSet: 'EPSG:3857'
      })

      // Lag nytt lag
      var kartLagUt = new ol.layer.Tile({
        opacity: 1,
        source: new ol.source.WMTS(options),
        name: lagNavn,
        kode: lagKode,
        visible: false
      });

      console.log("WMTS lag laget for " + lagNavn + "!");

      leggTilKartlag("Bakgrunnskart", kartLagUt);

    } catch (error) {
      // Dersom den ikke klarer å legge til kartlaget som WMTS,
      // -> Prøv som WMS 
      let URLUtenCapability = capabilityURL.split("?")[0];

      kartLagUt = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          url: URLUtenCapability,
          params: { 'LAYERS': kartlagWMTS },
          ratio: 2,
          serverType: 'mapserver',
          //
          name: lagNavn,
          visible: false
        })
      });

      console.log("WMS lag laget for " + lagNavn + "!");
      leggTilKartlag("Bakgrunnskart", kartLagUt);
    }

    // NOTAT: Få byttet farge på teksten til bakgrunnskartet i hovedmenyen!
    // Altså først skal den være grå. Hvis kartlaget ble funnet,
    // altsåkartLagUt er true, så skal teksten settes til sort!

    if (kartLagUt) {
      // console.log(kartLagUt);
      switch (lagNavn) {
        case "bakgrunnskartTopo4":
          bakgrunnskartTopo4 = kartLagUt;
          break;
        case "bakgrunnskartTopoGraa":
          bakgrunnskartTopoGraa = kartLagUt;
          break;
        case "bakgrunnskartNorgeIBilder":
          bakgrunnskartNorgeIBilder = kartLagUt;
          break;
        case "bakgrunnskartEnkel":
          bakgrunnskartEnkel = kartLagUt;
          break;
        default:
          break;
      }

      // Bytte farge på teksten fra grå til sort.
      try {
        var lagIndeks = htmlKartLagDict[lagNavn]["lagIndeks"];
        console.log("lagBakgrunnskartWMTS ~ lagIndeks: " + lagIndeks + " for kartlag: " + lagNavn);
        hovedMenyKlasseKartlagTekst[lagIndeks].style.color = "black";
      } catch (exception) {
        console.log("lagBakgrunnskartWMTS ~ prøvde å hente lagIndeks og forandre på fargen til kartlagTeksten. error: " + exception);
      }

      // Temp for debug:
      settInnKartlagIMasterListe(lagNavn, kartLagUt);
      // console.log(hentKartlagIMasterListe(lagNavn));
      // var kartlag = hentKartlagIMasterListe(lagNavn);
      // console.log(kartlag);

    } else {
      console.log("kartLagUt feilet for lagNavn: " + lagNavn);

      // // Sette fargen på teksten fra til grå her?
      // try {
      //   var lagIndeks = htmlKartLagDict[lagNavn]["lagIndeks"];
      //   console.log("lagBakgrunnskartWMTS ~ lagIndeks: " + lagIndeks + " for kartlag: " + lagNavn);
      //   hovedMenyKlasseKartlagTekst[lagIndeks].style.color = "gray";
      // } catch (exception) {
      //   console.log("lagBakgrunnskartWMTS ~ prøvde å hente lagIndeks og forandre på fargen til kartlagTeksten. error: " + exception);
      // }

    }

  }
}

function init(){

}
