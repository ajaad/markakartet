
window.onload = init;

var logoFarge = "#0C775D";
var fargeTones5 = "#547C73";
var fargeTones7 = "#717E7B";

var scale;
var scaleFremhevet = true;
var byttBakgrunn;
var containerBytteBakgrunn;
var bytteBakgrunnOSM;
var bytteBakgrunnSatelitt;
var bytteBakgrunnTopografisk;
var bytteBakgrunnTopografiskGraa;
var bytteBakgrunnForenklet;

var kartlagDict;

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

var aapneHovedMenyKnapp;
let hovedVinduVisesPaaDesktop = true; // hovedVinduVises er for mobil. Muligens forvirrende.
var markaKnappene;
var hovedVinduKnapper;
var hovedVinduContainer;
var hovedVindu;
var hovedMenySlide;
var touchbar;
var startX = 0, startY = 0, moveX = 0, moveY = 0, prevMoveX = 0, prevMoveY = 0; endX = 0, endY = 0;
var hovedVinduContainerMarginBottomWhenScroll = "80px"; // Samme som: style > Mobile > hovedVinduContainer > marginBottom.
// var hovedVinduContainerMarginBottomWhenScroll = "0px"; // Samme som: style > Mobile > hovedVinduContainer > marginBottom.
var hovedVinduContainerMarginBottomWhenHidden; // Basically WhenScroll - 36px. Defineres senere.
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
let hovedVinduContainerTopMargin = 0; // For kalkulering av midtpunkt og om menyen skal lukkes eller åpnes.
let hovedVinduPixelHeight = 0; // For kalkulering av midtpunkt og om menyen skal lukkes eller åpnes.
let midtpunktRundet = 0; // For kalkulering av midtpunkt og om menyen skal lukkes eller åpnes.
let hovedVinduVises = true; // Boolean for å vise om hoved-vinduet/menyen er skjult (hidden) eller ikke.

// var sideAktiv;
var sideKartMeny;
var sideDelKartvisning;
var sideOmMarkakartet;
var sideStott;
//
var sideFeatureInfo;
var featureInfoAktiv = false;
var featureInfoVises = false;
var featureTilbakeKnapp;
var finnKnapp;
var featureStartKoordinater;
// Kartmeny-siden
var sideAktiveLag;
var hovedMenyTabsContainer;
var tabAlleKnapp;
var tabAktivKnapp;
var aktiveLagVises = false;

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

// var testBilde = new Image();

// Bare for kalenderturer
// Måtte sette en sjekk om at tilbakestill / feature info hadde trigget, siden feature info trigger to ganger av en eller annen grunn...
var kalenderOpacityErLagret = false;
var kalenderTurerErSkjult = false;
var kalenderTurerSisteOpacity = -1;
var midlertidigFeatureIkonKlone = null;
var midlertidigFeatureKlone = null;

var currentZoom;

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
// Hm... Funksjon(er) for å hente farger? ...
function hentLagReferanseFraKartlagListen(lagNavn){
  for(var i = 0; i < htmlKartLagListe.length; i++){
    // console.log(htmlKartLagListe[i]["lagNavn"]);
    if(htmlKartLagListe[i]["lagNavn"] == lagNavn){
      return htmlKartLagListe[i]["lagReferanse"];
    }
  }
  return null;
}

function lagKartMenyHTML(){

  var htmlKartMenyGruppe = "";
  var lagIndeks = 0;
  htmlKartLagListe = [];
  htmlKartLagDict = {};

  console.log("Lager kart meny...");

  for(var i = 0; i < kartMenyMasterListe.length; i++){

    var gruppeNavn = kartMenyMasterListe[i]["gruppeNavn"];
    var uiGruppeNavn = kartMenyMasterListe[i]["uiGruppeNavn"];
    // console.log("Lager nå html for Kartmeny gruppen: " + gruppeNavn);

    if(gruppeNavn != "Bakgrunnskart"){
      htmlKartMenyGruppe += "<li class='gruppeMeny'>";
    } else {
      htmlKartMenyGruppe += "<li class='gruppeMeny bakgrunnGruppeSkjult'>";
    }
    // htmlKartMenyGruppe += "<li class='gruppeMeny'>";
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
      var forandreSynlighetFunksjon = "forandreSynlighetKartlag('" + gruppeNavn + "','" + lagNavn + "'," + lagIndeks + "," + true + ")";

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
      // console.log(htmlKartLagDict[lagNavn]);

      lagIndeks++;
    }

    htmlKartMenyGruppe += "</ul></li>"; // Avslutning på gruppeMeny og submenu.
    document.getElementById("kartHovedMeny").innerHTML += htmlKartMenyGruppe;
    htmlKartMenyGruppe = "";

  }

  // Alle-lag knapper.
  var alleKnapperHTML = "<div id='alleKnapperContainer'>";
  alleKnapperHTML += "<button class='markaKnapp' id='skjulAlleLagKnapp' onclick='skjulAlleLag()'>Skjul alle</button>";
  // Ikke ha med "Vis alle" knappen?
  // alleKnapperHTML += "<button class='markaKnapp' id='visAlleLagKnapp' onclick='visAlleLag()'>Vis alle</button>";
  alleKnapperHTML += "</div>";

  document.getElementById("kartHovedMeny").innerHTML += alleKnapperHTML;

  console.log("... Kart meny klar!");

  // console.log(htmlKartLagListe);
  // console.log(htmlKartLagDict);

  // TEST: Funker.
  // console.log(hentLagReferanseFraKartlagListen("vektorlagSkyggeLagRundtOsloKommune"));
}

$(document).ready(function(){

  KartKjorer = true;
  console.log("kartKjorer: " + KartKjorer);
  // console.log("featureHoverSelectKjorer: " + featureHoverSelectKjorer);

  lagKartMenyHTML();

  // On mobile?
  window.isMobile = /iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase());
  // console.log(window.isMobile);

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    // console.log("On mobile?");
  } else {
    // console.log("Not on mobile? window.isMobile: " + window.isMobile + ", navigator.userAgent: " + navigator.userAgent);
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

  scale = document.getElementById("scale-line-id");
  byttBakgrunn = document.getElementById("byttBakgrunn");
  containerBytteBakgrunn = document.getElementById("containerBytteBakgrunn");
  bytteBakgrunnOSM = document.getElementById("bytteBakgrunnOSM");
  bytteBakgrunnSatelitt = document.getElementById("bytteBakgrunnSatelitt");
  bytteBakgrunnTopografisk = document.getElementById("bytteBakgrunnTopografisk");
  bytteBakgrunnTopografiskGraa = document.getElementById("bytteBakgrunnTopografiskGraa");
  bytteBakgrunnForenklet = document.getElementById("bytteBakgrunnForenklet");

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
  // Kartmeny-siden
  sideAktiveLag = document.getElementById("kartSideAktiveLag");
  hovedMenyTabsContainer = document.getElementById("hovedMenyTabsContainer");
  tabAlleKnapp = document.getElementById("tabMenyKnapp");
  tabAktivKnapp = document.getElementById("tabAktivKnapp");

  mainMenuClassGroupLink = document.getElementsByClassName("gruppeLenke");
  mainMenuClassSubmenus = document.getElementsByClassName("submenu");
  mainMenuClassExpands = document.getElementsByClassName("expandButton");
  hovedMenyKlasseIndikator = document.getElementsByClassName("indicator");
  hovedMenyKlasseKartlagTekst = document.getElementsByClassName("kartlagTekst");

  // SKJULE BAKGRUNNSKART FRA MENYEN
  // Hm, setter alle bakgrunnsfargene til grått? Bortsett fra OSM...
  for(var i = 0; i < htmlKartLagListe.length; i++){
    if(htmlKartLagListe[i]["gruppeNavn"] == "Bakgrunnskart"){
      if(htmlKartLagListe[i]["lagNavn"] != "bakgrunnskartOSM"){
        hovedMenyKlasseKartlagTekst[i].style.color = "gray"; // Funker det? Jepp!
      }
    }
  }

  // jscolor.ready(function(){
  //   console.log("jscolor er klar!");
  //   // Vet ikke hvilken farge jeg skal sette til bakgrunnen. Hm.
  //   settIndikatorFargeManuelt("vektorLagGeometri", delFigurFarge.value, "rgba(0,0,0,0)");
  // });

  sideDelKartvisning.style.display = "none";
  sideOmMarkakartet.style.display = "none";
  sideStott.style.display = "none";

  aapneHovedMenyKnapp.style.opacity = "0";
  hovedVinduKnapper.style.opacity = "1";
  headerKnappKartMeny.style.opacity = "1";
  if(headerKnappDel != null){
    headerKnappDel.style.opacity = "1";
  }
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
  // toggleGruppeVisning("ArealPlanOslo");

  for(j = 0; j < hovedMenyKlasseIndikator.length; j++){
    settIndikatorFargerForKartlag(j);
  }

  var outputArray = prepareView();
  var newView = outputArray[0];

  scale.onclick = function(){
    // console.log("scale-line-id clicked!");
    if(scaleFremhevet){
      scaleFremhevet = false;
      scale.style.opacity = "0.25";
    } else {
      scaleFremhevet = true;
      scale.style.opacity = "0.75";
    }
    // console.log("scale-line-id ~ scaleFremhevet er nå: " + scaleFremhevet);
  }

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

  // Kartet
  // mesterGruppen blir laget i kartData.js.

    map = new ol.Map({
    target: 'map',
    layers: mesterGruppe,
    view: newView,
    renderer: 'canvas',
    controls: ol.control.defaults({
      zoom: false
    }).extend([
      scaleControl(),
    ]),
    overlays: [popupOverlay]
  });

  console.log("map er definert!");

  // Legger til midlertidige kartlag til kartet. De vises ikke under aktive kartlag.
  // Disse må vel legges til før visInfoSide, ettersom den funksjonen bruker de midlertidige kartlagene.
  // leggTilKartlag("Naturopplevelser", vektorLagMidlertidig);
  // leggTilKartlag("Naturopplevelser", vektorlagMidlertidigIkoner);

  forutsetningerKlareForInfoSideProgrammatisk();

  async function forutsetningerKlareForInfoSideProgrammatisk(){
    console.log("forutsetningerKlareForInfoSideProgrammatisk ~ start!");

    leggTilKartlag("Naturopplevelser", vektorLagMidlertidig);
    leggTilKartlag("Naturopplevelser", vektorlagMidlertidigIkoner);
    // let kalenderturerKlare = await behandleKalenderturer();
    // let naturstiKlar = await behandleNaturstiData();
    let turerKlare = await Promise.all([
      behandleKalenderturer(),
      behandleNaturstiData()
    ]);

    console.log("forutsetningerKlareForInfoSideProgrammatisk ~ ferdig!");
  }

  currentZoom = map.getView().getZoom();

  // En sjekk for popup:
  // map.getOverlays().getArray().forEach(overlay => { var overlayName = overlay["options"]["name"]; console.log("overlay name: " + overlayName); });

  lagWMTSLag(); // Lager dem async.

  // SKJULE BAKGRUNNSKART FRA MENYEN
  // Hm, hvis bakgrunnskart som ikke er OSM er hentet fra URL parameter, bytte når WMTS-laget er klart?
  forandreSynlighetKartlagUtenIndeks("Bakgrunnskart", "bakgrunnskartOSM", false);

  // Funker!
  if(kartlagListeFraUrlParam.length > 0){
    for(var i = 0; i < kartlagListeFraUrlParam.length; i++){
      forandreSynlighetKartlagMedBareNavn(kartlagListeFraUrlParam[i]);
    }
  } else {
    forandreSynlighetKartlagUtenIndeks("Naturopplevelser", "vektorLagMarkagrensa", false);
    forandreSynlighetKartlagUtenIndeks("Geometri", "vektorLagGPS", false);
  }

  // // Legger til midlertidige kartlag til kartet. De vises ikke under aktive kartlag.
  // leggTilKartlag("Naturopplevelser", vektorLagMidlertidig);
  // leggTilKartlag("Naturopplevelser", vektorlagMidlertidigIkoner);

  // console.log("Midlertidige lag er lagt til i map!");

  // Test:

  function settKartlagetsUITekstfargeUtenIndeks(lagNavn, farge){
    try {
      const lagIndeks = htmlKartLagDict[lagNavn]["lagIndeks"];
      if(lagIndeks) hovedMenyKlasseKartlagTekst[lagIndeks].style.color = farge;
    } catch (error) { 
      console.log(e);
    }
  }

  map.getLayers().getArray().forEach(group => {
    if(group.get("name") != "Bakgrunnskart")
    group.getLayers().forEach(layer => {
      const lagNavn = layer.get("name");
      if(lagNavn.includes("wms")){
        // console.log("Fant wms lag!: " + lagNavn);
        layer.getSource().on(["change","error","imageloadstart","imageloaderror","imageloadend"], 
        function(event){
          // console.log(event);
          const eventType = event["type"];
          // console.log(lagNavn + " ~ " + eventType);
          switch(eventType){
            case "change":
              break;
            case "error":
              fadeInnogUtDebugMelding(layer.get("uiName") + " feilet.", 10000);
              settKartlagetsUITekstfargeUtenIndeks(lagNavn, "#C0C0C0");
              break;
            case "imageloadstart":
              // fadeInnogUtDebugMelding(layer.get("uiName") + " laster inn...", 10000);
              break;
            case "imageloaderror":
              fadeInnogUtDebugMelding(layer.get("uiName") + " feilet.", 10000);
              // Gjør teksten grå hvis bildet feilet.
              settKartlagetsUITekstfargeUtenIndeks(lagNavn, "#C0C0C0");
              break;
            case "imageloadend":
              // Ha med tro? Nyttig, men samtidig som at den vises veldig ofte - etter hver zoom.
              // fadeInnogUtDebugMelding(layer.get("uiName") + " er klar.", 10000);
              // Jeg tror enten imageloadend eller imageloaderror trigger.
              settKartlagetsUITekstfargeUtenIndeks(lagNavn, "black");
              // Idé: Gi melding om bruker behøver å zoome inn mer for å se WMS laget? ...
              // console.log(map.getView().getZoom());
              break;
            default:
              break;
          }
        });
      }
    });
  });

  map.on('click',function(e){
    console.log("Klikket på kartet!");

    // Debug
    // document.getElementById("debugVinduTekst").innerHTML = "map on click";

    var coordSys = "EPSG:" + document.getElementById("epsgForm").value;
    var koordinaterKonv = proj4(viewProjection, coordSys, e.coordinate);

    console.log("Koordinatsystem: " + coordSys + ", koordinater: " + e.coordinate + ", koordinaterKonv: " + koordinaterKonv);

    // // Deaktivere nå siden delefunksjonen ikke brukes.
    // // Kan nå bruke funksjonen lageSirkelPaaKartKlikk().
    // // Bare lage sirkel på divMenyDel?
    // if(sisteMenyAktiv == "divMenyDel"){
    //   lageSirkelPaaKartKlikk(koordinaterKonv[0], koordinaterKonv[1]);
    // }

    // popupOverlay.setPosition(e.coordinate);

    // Sentrere kartet rundt popup.
    // map.getView().setCenter(e.coordinate); // Må ha for å unngå rart hopp mens popup er oppe.
    // map.getView().animate(
    //   {
    //     zoom: map.getView().getZoom(),
    //     center: e.coordinate,
    //     duration: 500
    //   },
    // );

    // vise boks med informasjon:
    const pixel = map.getEventPixel(e.originalEvent); // pixel i skjermvinduet

    // Sjekke at scriptene featureHoverSelect og popup kjører.
    if(featureHoverSelectKjorer && popupKjorer){
      settFeatureSelectionListeOgLagPopup(pixel, e.coordinate); // Passe koordinatene også
      // skjulHoverInfo();
    } else {
      console.log("map klikk ~ featureHoverSelect eller popup scriptet kjører ikke.");
    }

    // Sjekker at popup.js er loadet.
    if(popupKjorer){
      // Bare setter popup posisjon, hvis popup skal vises. Forhindrer store flytt i blant ved klikk på kartet.
      if(popupVises){
        popupOverlay.setPosition(e.coordinate);
      }
    }

  });

  //
  map.on('pointermove', function (e) {
    // console.log("pointermove triggered?!");

    document.body.style.cursor = "default";

    // Disable on mobile?
    // Hm, prøve å se om det hjelper med laggen...
    if(window.isMobile){
      return;
      console.log("Map pointermove ~ On mobile, so skipping hover.");
    }

    if(!featureHoverSelectKjorer){
      console.log("Scriptet featureHoverSelect kjører ikke.");
      return;
    }

    // Alltid nullstill først?
    skjulHoverInfo();

    if(featureClickSelectionList.length > 0) {
      // Essensielt deaktiverer hover mens featureClickSelection pågår.

      map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
        // var lagNavn = layer.get("name"); // navn på kartlaget
        var clickable = layer.get("clickable");
        if(clickable && feature){
          document.body.style.cursor = "pointer"; // Bare for å få pointer pekeren.
        }
      });

      return; // Genial løsning?! Hm, ser ut til å virke foreløpig, i hvertfall.

    } else {
      nullstillFeatureHoveredList();
    }
  
    map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {

      var lagNavn = layer.get("name"); // navn på kartlaget
      var clickable = layer.get("clickable");
      // console.log("lagnavn: " + lagnavn + ", clickable: " + clickable);
  
      if(clickable && feature){
        // Ikke gjøre hover for ikonLag? Men gjøre noe annet. Hm.
        // settFeatureHovered(feature, layer);
        // 
        document.body.style.cursor = "pointer";

        if(!lagNavn.includes("Ikon") && !lagNavn.includes("ikon")){

          // Sjekke etter andre turer i samme måned først?
          const aar = feature.get("AAR");
          // console.log("aar: " + aar);
          const maaned = feature.get("MAANED");
          // console.log("maaned: " + maaned);
          let hovedrute = feature;

          // Skal ikke gjelde for naturstien
          if(aar && maaned){
            // console.log("aar og maaned er definerte, så det er en kalendertur!");
            const features = layer.getSource().getFeaturesCollection().getArray();
            // console.log(features);
            for(var j = 0; j < features.length; j++){
              const currentFeature = features[j];
              const fAAR = currentFeature.get("AAR");
              const fMAANED = currentFeature.get("MAANED");
              const stiplet = currentFeature.get("Stiplet");
              // console.log("fAAR: " + fAAR + ", fMAANED: " + fMAANED);

              if(aar == fAAR && maaned == fMAANED){
                // console.log("Fant tur for samme år og måned! tur: " + features[j].get("overskrift"));
                leggTilIFeatureHoveredList(currentFeature, layer, false);
                if(stiplet == "0") hovedrute = currentFeature;
              }
            }
          } else {
            leggTilIFeatureHoveredList(feature, layer, false);
          }
          
          // settFeatureHovered(feature, layer, false);
          // leggTilIFeatureHoveredList(feature, layer, false);

          // Hover? Hm.
          // visHoverInfo(e.pixel, feature, layer, false);

          // Hvis popup er aktivert, bare vis hover info hvis popup ikke vises.
          // Hvis popup er uaktivert, alltid vis hover info.
          if(popupKjorer){
            if(!popupVises && !kalenderTurerErSkjult){
              visHoverInfo(e.pixel, hovedrute, layer, false);
            }
          } else {
            visHoverInfo(e.pixel, hovedrute, layer, false);
          }

          return true;
        } else {
          // Hover over ikon

          // // Hente rutekartlag for ikon
          // const ruteKartlag = hentKartlagMedLagNavn(layer.get("ruteKartlagNavn"));
          // // hentRuteForIkon(feature);
          // console.log(feature);
          // console.log(ruteKartlag);

          const cluster = feature.get("features");
          const clusterFeature = cluster[cluster.length - 1]; // Siste i lista er ikonet som er hoveret?
          const featureRute = clusterFeature.get("featureRute");
          const ruteKartlag = clusterFeature.get("ruteKartlag");
          console.log(featureRute);
          console.log(ruteKartlag);

          // Sjekke etter andre turer i samme måned først?
          const aar = featureRute.get("AAR");
          // console.log("aar: " + aar);
          const maaned = featureRute.get("MAANED");
          // console.log("maaned: " + maaned);
          let hovedrute = feature;

          // Skal ikke gjelde for naturstien
          if(aar && maaned){
            // console.log("aar og maaned er definerte, så det er en kalendertur!");
            const features = ruteKartlag.getSource().getFeaturesCollection().getArray();
            // console.log(features);
            for(var j = 0; j < features.length; j++){
              const currentFeature = features[j];
              const fAAR = currentFeature.get("AAR");
              const fMAANED = currentFeature.get("MAANED");
              const stiplet = currentFeature.get("Stiplet");
              // console.log("fAAR: " + fAAR + ", fMAANED: " + fMAANED);

              if(aar == fAAR && maaned == fMAANED){
                // console.log("Fant tur for samme år og måned! tur: " + features[j].get("overskrift"));
                leggTilIFeatureHoveredList(currentFeature, ruteKartlag, false);
              }
            }
          } else {
            // Måtte kommentere ut for at natursti-ikonene ikke skulle phase ut til en annen dimensjon :/ ...
            // leggTilIFeatureHoveredList(feature, ruteKartlag, false);
          }

          // settFeatureHovered(feature, layer, true);
          // leggTilIFeatureHoveredList(feature, layer, true);

          // Hvis popup er aktivert, bare hvis hover info hvis popup ikke vises.
          // Hvis popup er uaktivert, alltid hvis hover info.
          if(popupKjorer){
            if(!popupVises && !kalenderTurerErSkjult){
              visHoverInfo(e.pixel, feature, layer, true);
            }
          } else {
            visHoverInfo(e.pixel, feature, layer, true);
          }

          return true;
        }

        // return true; // For å bare velge den første gyldige featuren?
      }

    });

  });

  // Sette zoom...
  map.on('moveend', function(e) {

    currentZoom = map.getView().getZoom();
    // fadeInnogUtDebugMelding(currentZoom, 3000);

    // var viewCenter = map.getView().getCenter();
    // console.log("view center: " + viewCenter);

    lagUrl();

  });

  // BYTTING AV BAKGRUNN (knapp)

  byttBakgrunn.style.opacity = "0.75";
  containerBytteBakgrunn.style.display = "none";
  //
  byttBakgrunn.onclick = function(){
    // console.log("byttBakgrunn clicked!");
    toggleByttBakgrunn();
  }
  containerBytteBakgrunn.onclick = function(){
    // console.log("containerBytteBakgrunn clicked!");
  }
  bytteBakgrunnOSM.onclick = function(){
    // console.log("bytteBakgrunnOSM clicked!");
    byttBakgrunnFunksjon(bakgrunnskartOSM);
  }
  bytteBakgrunnSatelitt.onclick = function(){
    // console.log("bytteBakgrunnSatelitt clicked!");
    byttBakgrunnFunksjon(bakgrunnskartNorgeIBilder);
  }
  bytteBakgrunnTopografisk.onclick = function(){
    // console.log("bytteBakgrunnTopografisk clicked!");
    byttBakgrunnFunksjon(bakgrunnskartTopo4);
  }
  bytteBakgrunnTopografiskGraa.onclick = function(){
    // console.log("bytteBakgrunnTopografiskGraa clicked!");
    byttBakgrunnFunksjon(bakgrunnskartTopoGraa);
  }
  bytteBakgrunnForenklet.onclick = function(){
    // console.log("bytteBakgrunnForenklet clicked!");
    byttBakgrunnFunksjon(bakgrunnskartEnkel);
  }

  // 

  document.getElementById("lukkeHovedVinduKnapp").addEventListener("click", function(){
    // console.log("Du klikket på lukkeHovedVinduKnapp!");
    visHovedMenyPaaDesktop(false);
  });

  aapneHovedMenyKnapp.addEventListener("click", function(){
    // console.log("Du klikket på aapneHovedVinduKnapp!");
    visHovedMenyPaaDesktop(true);
  });

  hovedMenySlide.addEventListener("touchstart", touchHandler, false);
  hovedMenySlide.addEventListener("touchmove", touchHandler, false);
  hovedMenySlide.addEventListener("touchcancel", touchHandler, false);
  hovedMenySlide.addEventListener("touchend", touchHandler, false);

  // 

  featureTilbakeKnapp.addEventListener("click", function(){
    featureTilbakeKnappFunksjon(false);
  });

  finnKnapp.addEventListener("click", function(){
    featureFinnKnappFunksjon();
    // console.log("Trykket på finnKnapp!");
  });

  // Kartmeny-knapper for "Alle lag" og "Aktive lag"

  // Sette stil for knappene.
  settRiktigStilForTabKnapperUtenEndreBoolean();

  tabAlleKnapp.addEventListener("click", function () {
    // console.log("tabAlleKnapp klikket!");
    if(aktiveLagVises){
      byttTilAlleLagSiden();
    }
  });

  tabAktivKnapp.addEventListener("click", function () {
    // console.log("tabAktivKnapp klikket!");
    if(!aktiveLagVises){
      byttTilAktiveLagSiden();
    }
  });

  kalkulerThresholds(); // Gjøres før bruk av touchHandler.

}); // onready END

function visHovedMenyPaaDesktop(visHovedVindu){
  hovedVinduVisesPaaDesktop = visHovedVindu;
  if(visHovedVindu){
    aapneHovedMenyKnapp.style.opacity = "0";
    aapneHovedMenyKnapp.style.pointerEvents = "none";
  
    hovedVinduKnapper.style.opacity = "1";
    hovedVinduKnapper.style.pointerEvents = "all";
    hovedVinduContainer.style.opacity = "1";
    hovedVinduContainer.style.pointerEvents = "all";
  } else {
    hovedVinduKnapper.style.opacity = "0";
    hovedVinduKnapper.style.pointerEvents = "none";
    hovedVinduContainer.style.opacity = "0";
    hovedVinduContainer.style.pointerEvents = "none";
  
    aapneHovedMenyKnapp.style.opacity = "0.9";
    aapneHovedMenyKnapp.style.pointerEvents = "all";
  }
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
      // Prevent map interaction while dragging the menuslider?
      // map.getInteractions().forEach(x => x.setActive(false));

      // Gjøre kartmenyen uttrykkbar foreløpig.
      hovedMenyTabsContainer.style.pointerEvents = "none";
      sideKartMeny.style.pointerEvents = "none";

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

      // Kalkulere det hver gang, pga. få riktig marginTop og pixelHeight.
      hovedVinduContainerTopMargin = hentHovedVinduContainerTopMargin();
      hovedVinduPixelHeight = hentHovedVinduPixelHeight();

      if(startX == moveX && startY == moveY){
        // Enkelt klikk på slideren.
        clickedSlideButton = true;
        // console.log("Single click?"); // Funker.

        midtpunktRundet = kalkulerMidtpunktet();

        if(hovedVinduPixelHeight > midtpunktRundet){
          // Lukke hovedVindu.
          lukkHovedVindu();
        } else {
          // Åpne hovedVindu.
          aapneHovedVindu();
        }

      }

      break;
    case "touchcancel":
      type = "touchcancel";
      endX = x;
      endY = y;
      break;
  }

  // Altså hvis holder inne og flytter slideren på mobil.

  // Gjør noe med hovedVinduContainer, if touchmove er forskjellig.
  if(moveY != prevMoveY){

    var yDifference = moveY - prevMoveY;
    var yDiffRounded = Math.round(yDifference); // Rounds to nearest integer!
    // console.log("yDifference: " + yDifference + ", yDiffRounded: " + yDiffRounded); // + down, - up

    hovedVinduContainerTopMargin = hentHovedVinduContainerTopMargin();
    hovedVinduPixelHeight = hentHovedVinduPixelHeight();

    // Håndtere mindre og større enn 0. Hvis akkurat 0, ikke gjøre noe?...
    if(yDiffRounded < 0){
      // Oppover hvis marginTop mindre.
      var nyTopMarginOpp = hovedVinduContainerTopMargin + yDiffRounded;
      if(nyTopMarginOpp < minHovedMarginTop){
        nyTopMarginOpp = minHovedMarginTop; // Ikke mindre enn min.
      }

      if(nyTopMarginOpp < 0){ // For å gjøre hovedVindu scrollbart igjen tidlig.
        // Åpne hovedVindu.
      }

      hovedVinduContainer.style.marginTop = nyTopMarginOpp + "px";
      // console.log("yDiffRounded: " + yDiffRounded + ", minHovedMarginTop: " + minHovedMarginTop + ". Ny marginTop er: " + nyTopMarginOpp);
    
    } else if(yDiffRounded > 0){
      // Nedover hvis marginTop større.

      var nyTopMarginNed = hovedVinduContainerTopMargin + yDiffRounded;
      var nyHovedVinduHeight = hovedVinduPixelHeight - yDiffRounded;

      if(hovedVinduPixelHeight == 0){
        // Ikke forandre på noe.
        nyTopMarginNed = hovedVinduContainerTopMargin;
      } else if(hovedVinduPixelHeight < 0){
        // Substrahere pixelHeight slik at pixelHeight blir 0?
        nyTopMarginNed = hovedVinduContainerTopMargin + hovedVinduPixelHeight;
      } else {
        // Når pixelHeight er større enn 0:
        if(nyHovedVinduHeight <= 0){
          // Hvis y-forskjellen gjør at pixelHeight blir under 0:
          nyTopMarginNed += nyHovedVinduHeight;
          // Lukke hovedVindu.
        }
      }

      hovedVinduContainer.style.marginTop = nyTopMarginNed + "px";
      // console.log("yDiffRounded: " + yDiffRounded + ", maxHovedMarginTop: " + maxHovedMarginTop + ". Ny marginTop er: " + nyTopMarginNed);
    }

  }

  prevMoveX = moveX;
  prevMoveY = moveY;

  // Håndtere klikk-event når brukeren holder og flytter på slideren på mobil.
  // Hm...
  if(!clickedSlideButton){
    // console.log("!clickedSlideButton ~ hovedVinduContainerTopMargin: " + hovedVinduContainerTopMargin);

    // if(parseInt(hovedVinduContainer.style.marginTop) < marginTopHide){
      if(hovedVinduContainerTopMargin < marginTopHide){
      if(!underMarginTopShowThreshold){
        hovedVinduContainer.style.marginBottom = hovedVinduContainerMarginBottomWhenScroll;
        hovedVindu.style.overflowY = "scroll";
        hovedVindu.style.opacity = "1";
        tillattKartKnapperEtterDelay();

        hovedVinduVises = true;
      }
      underMarginTopShowThreshold = true;
    } else {
      if(underMarginTopShowThreshold){
        hovedVinduContainer.style.marginBottom = hovedVinduContainerMarginBottomWhenHidden;
        hovedVindu.style.overflowY = "hidden";
        hovedVindu.style.opacity = "0";
        blokkerKartKnapper();

        hovedVinduVises = false;
      }
      underMarginTopShowThreshold = false;
    }

  }

} // touchhandler END

// Kartlag-funksjoner

// For "aktive" kartlag-siden
function hentSynligeKartlagForAktiveLagSiden(){

  console.log("hentAktiveKartlagUtenomBakgrunn ~ triggered!");

  // RESET TIDLIG. Kommenter ut mens du debugger/legger til ny funksjonalitet.
  sideAktiveLag.innerHTML = "";

  var aktiveLagListe = [];
  // NOTE: For nå, lage for hver gang "aktive" knappen kjører koden?
  var htmlAktiveKartlag = [];

  map.getLayers().getArray().forEach(group => {

    var gruppeNavn = group.get("name");

    // Ikke inkludere bakgrunnskart.
    if(gruppeNavn != "Bakgrunnskart"){

      group.getLayers().forEach(layer => {

        // Hm... Ikke inkludere GPS-laget her? Siden det ikke er meningen å kunne skru av.
        var lagNavn = layer.get("name");

        // Sjekker om "ikon" eller "Ikon" er i lagNavnet.
        // Hm. Kunne også bruke includes for å sjekke om layer er i en layerSkipListe eller lignende.
        if(lagNavn != "vektorLagGPS" && (!lagNavn.includes("Ikon") && !lagNavn.includes("ikon")) && (!lagNavn.includes("Midlertidig") && !lagNavn.includes("midlertidig"))){
        // if(lagNavn != "vektorLagGPS"){
          // console.log(layer.get("name"));

          if(layer.get("visible") == true){
            // Kartlag som er synlige/aktivert under "Alle lag"!
            console.log(lagNavn);

            // Hm... Hente kartlaget her
            var kartlag = hentKartlagMedLagNavn(lagNavn);
            
            var lagFargeNavn = "aktivtLagFarge" + lagNavn;
            var lagFargeFunksjon = "settOpacityTilNullForKartlagMedLagNavn('" + lagNavn + "');";
            var lagRedigerNavn = "aktivtLagRediger" + lagNavn;
            var lagRedigerFunksjon = "redigerAktivtKartlagMedLagNavn('" + lagNavn + "');";
            var lagInfoNavn = "aktivtLagInfo" + lagNavn;
            var lagVisInfoFunksjon = "visInfoForAktivtKartlagMedLagNavn('" + lagNavn + "');";
            var lagSlettNavn = "aktivtLagSlett" + lagNavn;
            var lagDeaktiverFunksjon = "deaktiverAktivtKartlagMedLagNavn('" + lagNavn + "');";
            //
            var sliderNavn = "slider" + lagNavn;
            var updateSliderNavn = "updateSlider('" + lagNavn + "');"; // SKAL BRUKE STRING SOM PARAMETER HER!
            var sliderVerdiNavn = "sliderVerdi" + lagNavn;
            // Rediger
            var lagViserRedigerId = "aktivtLagViserRediger" + lagNavn;
            var lagRedigerContainerId = "aktivtLagRedigerPanelId" + lagNavn;
            // var lagRedigerIkonKollaps = "" + lagNavn;
            var redigerKollapsFunksjon = "toggleVisRediger('" + lagNavn + "');";
            var redigerEndreFargeContainer = "redigerEndreFargeContainer" + lagNavn;
            var lagRedigerFargeInput = "aktivtLagRedigerFargeInput" + lagNavn;
            console.log("lagRedigerFargeInput: " + lagRedigerFargeInput);
            // var lagRedigerFargeVerdi = hentOgKonverterFargeArrayRGB()
            // Ekstra info
            var lagViserInfoId = "aktivtLagViserInfo" + lagNavn;
            var lagEkstraInfo = "aktivtLagEkstraInfo" + lagNavn;
            // var lagInfoIkonKollaps = "" + lagNavn;
            var infoKollapsFunksjon = "toggleVisInfo('" + lagNavn + "');";
            var redigerEndreFargeContainer = "redigerEndreFargeContainer" + lagNavn;
            var lagTegnforklaringId = "aktivtLagTegnforklaring" + lagNavn;
            var lagTegnforklaringBildeId = "aktivtLagTegnforklaringBilde" + lagNavn;
            var tegnforklaringOrganisasjon = "tegnforklaringOrganisasjon" + lagNavn;
            var tegnforklaringEpost = "tegnforklaringEpost" + lagNavn;
            console.log("hentSynligeKartlagForAktiveLagSiden ~ sliderNavn: " + sliderNavn + ", updateSliderNavn: " + updateSliderNavn);

            htmlAktiveKartlag += "<li>";

            htmlAktiveKartlag += "<div class='aktivtLagHeader'><div class='aktivtLagHeaderVenstre'>";
            htmlAktiveKartlag += "<div class='aktivtLagFarge' id='" + lagFargeNavn + "' onclick=" + lagFargeFunksjon + "></div>";
            htmlAktiveKartlag += "<div class='aktivtLagNavn' title ='" + layer.get("uiName") + "'>" + layer.get("uiName") + "</div></div>";
            htmlAktiveKartlag += "<div class='aktivtLagHeaderHoyre'>";
            // Obs! Under testing...
            htmlAktiveKartlag += "<div class='aktivtLagMiniKnapp aktivtLagRediger' id='" + lagRedigerNavn + "' onclick=" + lagRedigerFunksjon + " title='Rediger'><img src='./images/edit.png' alt='Edit' /></div>";
            htmlAktiveKartlag += "<div class='aktivtLagMiniKnapp aktivtLagInfo' id='" + lagInfoNavn + "' onclick=" + lagVisInfoFunksjon + " title='Se mer informasjon'><img src='./images/information.png' alt='Info' /></div>";
            htmlAktiveKartlag += "<div class='aktivtLagMiniKnapp aktivtLagSlett' id='" + lagSlettNavn + "' onclick=" + lagDeaktiverFunksjon + " title='Deaktiver'><div>x</div></div>";
            htmlAktiveKartlag += "</div></div>";
            // Synlighet
            htmlAktiveKartlag += "<div class='slidecontainer'>";
            htmlAktiveKartlag += "<input type='range' min='0' max='100' value='50' class='slider' id='" + sliderNavn + "' oninput=" + updateSliderNavn + ">";
            htmlAktiveKartlag += "<span class='sliderVerdier'>Synlighet: <span id='" + sliderVerdiNavn + "'></span></span></div>";
            // Rediger
            htmlAktiveKartlag += "<div id='" + lagViserRedigerId + "' style='display: none;'>false</div>";
            htmlAktiveKartlag += "<div class='aktivtLagRedigerPanel' id='" + lagRedigerContainerId + "'>";
            htmlAktiveKartlag += "<div class='aktivtLagRedigerIkonKollaps' onclick=" + redigerKollapsFunksjon + "><img src='./images/edit.png' alt='Edit Collapse' /></div>";
            htmlAktiveKartlag +=    "<div class='aktivtLagEndreFargeContainer' id='" + redigerEndreFargeContainer + "'>";
            htmlAktiveKartlag +=        "<div class='aktivtLagEndreFargeTekst'>Endre farge:</div>";
            htmlAktiveKartlag +=        "<div class='aktivtLagEndreFargeVelgerContainer'>";
            htmlAktiveKartlag +=            "<div class='clr-field'>";
            htmlAktiveKartlag +=                "<button></button>";
            htmlAktiveKartlag +=                "<input class='" + lagRedigerFargeInput + "' type='text' data-coloris>"; 
            htmlAktiveKartlag +=            "</div>";
            htmlAktiveKartlag +=        "</div>";
            htmlAktiveKartlag +=    "</div>";
            htmlAktiveKartlag += "</div>"; // Rediger slutt
            // Ekstra Info
            htmlAktiveKartlag += "<div id='" + lagViserInfoId + "' style='display: none;'>false</div>";
            htmlAktiveKartlag += "<div class='aktivtLagEkstraInfo' id='" + lagEkstraInfo + "'>"
            htmlAktiveKartlag += "<div class='aktivtLagInfoIkonKollaps' onclick=" + infoKollapsFunksjon + "><img src='./images/information.png' alt='Info Collapse' /></div>";
            // Tegnforklaring
            // htmlAktiveKartlag += "<div class='aktivtLagTegnforklaring' id='" + lagTegnforklaringId + "'><img class='aktivtLagTegnforklaringsBilde' id='" + lagTegnforklaringBildeId + "' src='' alt='Tegnforklaring' /></div>"
            htmlAktiveKartlag += "<div class='aktivtLagTegnforklaring' id='" + lagTegnforklaringId + "'>";
            htmlAktiveKartlag += "<div class='toKolonnerContainer'><div class='venstreKolonne'>Tegnforklaring:</div><div class='hoyreKolonne'><img class='aktivtLagTegnforklaringsBilde' id='" + lagTegnforklaringBildeId + "' src='' alt='Tegnforklaring' /></div></div>";
            htmlAktiveKartlag += "<div class='toKolonnerContainer'><div class='venstreKolonne'>Organisasjon:</div><div class='hoyreKolonne' id='" + tegnforklaringOrganisasjon + "'></div></div>";
            htmlAktiveKartlag += "<div class='toKolonnerContainer'><div class='venstreKolonne'>E-post:</div><div class='hoyreKolonne' id='" + tegnforklaringEpost + "'></div></div>";
            htmlAktiveKartlag += "</div>"; // Tegnforklaring slutt

            htmlAktiveKartlag += "</div>"; // Ekstra Info slutt

            htmlAktiveKartlag += "</li>";

            // Hm... Trenger ikke bruke <script></script>. Bare sette det som det er?: Hm...
            // settStartVerdierForAktivtLag(lagNavn);
            aktiveLagListe.push([lagNavn, kartlag]);
          }

        }

        // console.log(layer.get("name"));
      })

    }

  })

  // console.log(htmlAktiveKartlag);

  // sideAktiveLag.innerHTML = "";
  sideAktiveLag.innerHTML += htmlAktiveKartlag;
  // sideAktiveLag.innerHTML = htmlAktiveKartlag;

  //
  for(var i = 0; i < aktiveLagListe.length; i++){
    settStartVerdierForAktivtLag(aktiveLagListe[i][0], aktiveLagListe[i][1]);
  }
}

// Setter kartlagets gjennomsiktighet (opacity) basert på dets opacity-verdi. Denne hentes med: kartlag.getOpacity()
function settStartVerdierForAktivtLag(lagNavn, kartlag) {
  console.log("settStartVerdierForAktivtLag triggered! lagNavn: " + lagNavn);
  var aktivtLagFarge = document.getElementById("aktivtLagFarge" + lagNavn);
  var slider = document.getElementById("slider" + lagNavn);
  var sliderVerdi = document.getElementById("sliderVerdi" + lagNavn);
  // var kartlag = hentKartlagMedLagNavn(lagNavn);
  if (kartlag != null) {
    // GetOpacity først.
    slider.value = kartlag.getOpacity() * 100;
    sliderVerdi.innerHTML = slider.value;
    aktivtLagFarge.style.opacity = slider.value;
    // Sette farge fra kartlaget på aktivtLagFarge.
    var strokeColorSelect = kartlag.get("strokeColorSelect");
    var fillColorSelect = kartlag.get("fillColorSelect");
    if (strokeColorSelect != null) {
      aktivtLagFarge.style.borderColor = strokeColorSelect;
    }
    if (fillColorSelect != null) {
      aktivtLagFarge.style.backgroundColor = fillColorSelect;
    }

    // // Bare hente tegnforklaring for WMS-lag, ikke vanlige vektorlag.
    try {
      var wmsSourceParams = kartlag.getSource().getParams(); // Vil bare funke for WMS-lag. WMTS bruker ikke params, bare capabilities.
      // console.log(wmsSourceParams);
      console.log("Følgende kartlag er et WMS-lag: " + lagNavn);
      hentTegnforklaring(lagNavn, kartlag);
      hentWMSCapabilitiesMetaData(lagNavn, kartlag);
    } catch (e) {
      console.log("Følgende kartlag er ikke et WMS-lag: " + lagNavn);
    }

    // Gjøres til slutt? Pga. "return" tidlig under spesielleInstrukser.

    // Sette rediger-greier...
    // Hente og sette redigerInput fargen:
    try{
      const style = kartlag.getStyle(); //
      if (style != null) {
        var type = kartlag.get("type");
        console.log("vektorlag ~ type: " + type);
        if(type == null){
          setupEndreFarge(lagNavn, kartlag, aktivtLagFarge, style, null);
        } else {
          if(type == "vektor_skygge"){
            // Ikke la brukeren endre farge på vektorlaget.
          } else {
            // For f.eks. markagrensa.
            setupEndreFarge(lagNavn, kartlag, aktivtLagFarge, style, type);
          }
        }
      }
    } catch(e){

    }

  }
}

//
function setupEndreFarge(lagNavn, kartlag, aktivtLagFarge, style, type){
  // Gjøre slik at den vises (endre css):
  document.getElementById("redigerEndreFargeContainer" + lagNavn).style.display = "flex";
  const kartlagIndeks = finnIndeksForKartlag(lagNavn);

  const fillFargen = style.getFill().getColor();
  const strokeFargen = style.getStroke().getColor();
  // console.log(fillFargen);
  // Test...
  var inputKlassen = ".aktivtLagRedigerFargeInput" + lagNavn;
  // console.log("inputKlassen: " + inputKlassen);
  var fargeArray = null;

  // Håndterer også hvis type == null?
  if(type == "vektor_grense"){
    fargeArray = hentOgKonverterFargeArrayRGB(strokeFargen);
  } else {
    fargeArray = hentOgKonverterFargeArrayRGB(fillFargen);
  }

  var klasseElement = document.getElementsByClassName("aktivtLagRedigerFargeInput" + lagNavn)[0];
  console.log(klasseElement);
  klasseElement.setAttribute('value', fargeArray);
  klasseElement.style.backgroundColor = fargeArray;

  Coloris.setInstance(inputKlassen, {
    theme: 'polaroid',
    themeMode: 'light',
    alpha: false,
    format: 'rgb',
    // startColor: fargeArray,
    swatches: [
      // 'rgb(255,255,255)'
      // hentOgKonverterFargeArrayRGB(fillFargen)
      fargeArray
    ],
    onChange: (color) => {
      console.log(inputKlassen + " ~ onChange triggered! color: " + color);
      klasseElement.style.backgroundColor = color;
      // Neste -> Bytte farge på kartlaget!
      // 1. Konvertere color-output til array... F.eks: rgb(83, 193, 166) til [83, 193, 166, 1]
      // 2. Sette fill og stroke color for style.
      // 3. Sette fill og stroke color for stilSelect.
      // 4. Sette strokeColorSelect (STRING!).
      // 5. Sette fillColorSelect (STRING!).
      var rgbArray = konverterRGBStrengTilArrayRGBA(color);
      var strokeColor = getDarkerColorIntegerListRGBA(rgbArray, SHADE_STROKE);
      // console.log("rgbArray: " + rgbArray);
      // console.log("strokeColor: " + strokeColor);
      //
      var fillColorSelect = getDarkerColorIntegerListRGBA(rgbArray, SHADE_SELECT);
      var strokeColorSelect = getDarkerColorIntegerListRGBA(strokeColor, SHADE_SELECT);
      var strengFillColorSelect = konverterArrayRGBAtilStreng(fillColorSelect);
      var strengStrokeColorSelect = konverterArrayRGBAtilStreng(strokeColorSelect);
      
      // Spesiell instruks for markagrensa (og andre grenser)
      if(type == "vektor_grense"){
        style.getStroke().setColor(strokeColor);
        kartlag.set("strokeColorSelect", strengStrokeColorSelect);
        kartlag.changed();
        // Bare bytte stroke fargen
        aktivtLagFarge.style.borderColor = strengStrokeColorSelect;
        // Bytte farge på indikatoren i hovedmenyen
        hovedMenyKlasseIndikator[kartlagIndeks].style.borderColor = strengStrokeColorSelect;
      } else {
        style.getFill().setColor(rgbArray);
        style.getStroke().setColor(strokeColor);
        var stilSelect = kartlag.get("stilSelect");
        stilSelect.getFill().setColor(fillColorSelect);
        stilSelect.getStroke().setColor(strokeColorSelect);
        kartlag.set("fillColorSelect", strengFillColorSelect);
        kartlag.set("strokeColorSelect", strengStrokeColorSelect);
        kartlag.changed();
        //
        aktivtLagFarge.style.borderColor = strengStrokeColorSelect;
        aktivtLagFarge.style.backgroundColor = strengFillColorSelect;
        // Bytte farge på indikatoren i hovedmenyen
        hovedMenyKlasseIndikator[kartlagIndeks].style.borderColor = strengStrokeColorSelect;
        hovedMenyKlasseIndikator[kartlagIndeks].style.backgroundColor = strengFillColorSelect;
      }
      
    },
    onClear: (color) => {
      // console.log(inputKlassen + " ~ onClear triggered! color: " + color);
    },
    onClose: (color) => {
      // console.log(inputKlassen + " ~ onClose triggered! color: " + color);
    },
    onOpen: (color) => {
      // console.log(inputKlassen + " ~ onOpen triggered! color: " + color);
    }
  });

}

function toggleVisRediger(lagNavn){
  console.log("toggleVisRediger ~ lagNavn: " + lagNavn);
  var elementViserRediger = document.getElementById("aktivtLagViserRediger" + lagNavn);
  var elementRedigerPanel = document.getElementById("aktivtLagRedigerPanelId" + lagNavn);
  var viserRediger = elementViserRediger.innerHTML;
  if(viserRediger == "false"){
    elementViserRediger.innerHTML = "true";
    elementRedigerPanel.style.display = "block";
  } else {
    elementViserRediger.innerHTML = "false";
    elementRedigerPanel.style.display = "none";
  }
}

// 
function redigerAktivtKartlagMedLagNavn(lagNavn){
  console.log("redigerAktivtKartlagMedLagNavn ~ lagNavn: " + lagNavn);
  toggleVisRediger(lagNavn);
}
// 
function toggleVisInfo(lagNavn){
  var elementViserInfo = document.getElementById("aktivtLagViserInfo" + lagNavn);
  var elementEkstraInfo = document.getElementById("aktivtLagEkstraInfo" + lagNavn);
  var viserInfo = elementViserInfo.innerHTML;
  if(viserInfo == "false"){
    elementViserInfo.innerHTML = "true";
    elementEkstraInfo.style.display = "block";
  } else {
    elementViserInfo.innerHTML = "false";
    elementEkstraInfo.style.display = "none";
  }
}
// Kjøres i settStartVerdierForAktivtLag().
function hentTegnforklaring(lagNavn, kartlag){
  console.log("hentTegnforklaring ~ lagNavn: " + lagNavn);
  try{
    if(kartlag == null){
      kartlag = hentKartlagMedLagNavn(lagNavn);
    }
    // var kartlag = hentKartlagMedLagNavn(lagNavn);
 
    var url = kartlag.getSource().getUrl(); // Hoved url
    var attributions = kartlag.getSource().getAttributions();
    var legendUrl = kartlag.getSource().getLegendUrl(); // Legend url. Ikke alle har en som fungerer, f.eks. nibio.

    var tegnforklaringsContainer = document.getElementById("aktivtLagTegnforklaring" + lagNavn);
    var tegnforklaringsBilde = document.getElementById("aktivtLagTegnforklaringBilde" + lagNavn);
    // document.getElementById("aktivtLagTegnforklaringBilde" + lagNavn).src = legendUrl;
    tegnforklaringsBilde.src = legendUrl;
    tegnforklaringsBilde.onerror = function(){
      console.log("hentTegnforklaring ~ getLegendUrl() feilet for lagNavn: " + lagNavn);
      // Hvis getLegendUrl() feiler, kan prøve å finne en fungerende legendUrl via Capabilities URLen.
      hentBildeFraWMSCapabilities(lagNavn, kartlag, tegnforklaringsBilde, tegnforklaringsContainer); // Egen funksjon for bilde? ...
    }
    tegnforklaringsBilde.onload = function(){
      console.log("hentTegnforklaring ~ Fant bilde fra getLegendUrl() for lagNavn: " + lagNavn);
      tegnforklaringsContainer.style.display = "block";
      tegnforklaringsBilde.style.display = "block";
    }

  }catch(e){
    console.log("visInfoForAktivtKartlagMedLagNavn ~ catcha error: " + e);
  }
}

async function sjekkLegendUrl(legendUrl){
  console.log("sjekkLegendUrl: " + legendUrl);
  try{
    var fetched = await fetch(legendUrl);
    if(fetched.ok){
      var text = await fetched.text();
      var url = fetched.url;
      console.log(url);
    } else {
      console.log("fetched failed for lagNavn: " + lagNavn);
    }
  }catch(e){
    console.log("sjekkLegendUrl ~ exception: " + e);
  }
}

async function hentWMSCapabilitiesMetaData(lagNavn, kartlag){
  // console.log("hentWMSCapabilitiesMetaData ~ lagNavn: " + lagNavn);
  try{
    if(kartlag == null){
      kartlag = hentKartlagMedLagNavn(lagNavn);
    }
    // var kartlag = hentKartlagMedLagNavn(lagNavn);
    var parser = new ol.format.WMSCapabilities();

    var capabilitiesUrl = kartlag.get("capabilitiesURL");
    // var capabilitiesUrl = null; // For testing / debug.
    // console.log(capabilitiesUrl);
    // Hvis capabilitiesURL ikke er lagret, prøv å lag den:
    if(capabilitiesUrl == null){
      capabilitiesUrl = kartlag.getSource().getUrl();
      const inneholderSporsmaalstegn = capabilitiesUrl.includes("?");
      const inneholderVersjon = capabilitiesUrl.includes("VERSION");
      const urlSplit = capabilitiesUrl.split("?");
      // console.log("urlSplit: " + urlSplit + ", urlSplit length: " + urlSplit.length + ", url: " + capabilitiesUrl);
      if(!inneholderSporsmaalstegn){
        capabilitiesUrl += "?service=wms&request=getcapabilities";
      } else {
        if(urlSplit.length > 1){
          if(urlSplit[1].length > 0){
            capabilitiesUrl += "&";
          }
        }
        capabilitiesUrl += "service=wms&request=getcapabilities";
      }
      // if(!inneholderVersjon) capabilitiesUrl += "&version=1.3.0";
      console.log("hentWMSCapabilitiesMetaData ~ Ferdige capabilitiesURL: " + capabilitiesUrl);
    }

    var fetched = await fetch(capabilitiesUrl);
    if(fetched.ok){
      var text = await fetched.text();
      // console.log(text); // XML

      const result = await parser.read(text);
      console.log(result);

      // Service tittel og organisasjon:
      try{
        var service = result["Service"];
        if(service != null){
          var tittel = service["Title"];
          var organisasjon = service["ContactInformation"]["ContactPersonPrimary"]["ContactOrganization"];
          var epost = service["ContactInformation"]["ContactElectronicMailAddress"];
          // console.log("tittel: " + tittel);
          // console.log("organisasjon: " + organisasjon);
          // console.log("epost: " + epost);
          document.getElementById("tegnforklaringOrganisasjon" + lagNavn).innerHTML = organisasjon;
          document.getElementById("tegnforklaringEpost" + lagNavn).innerHTML = epost;
        }
      }catch(e){
        console.log("hentWMSCapabilitiesMetaData ~ feilet med å hente noe informasjon fra capabilities sin Service del for lagNavn: " + lagNavn);
      } 

    } else {
      console.log("fetched failed for lagNavn: " + lagNavn);
    }

  }catch(e){
    console.log("hentWMSCapabilitiesMetaData ~ Noe feilet!? catch(e): " + e);
  }
}
// BRUK DENNE FOR WMS-BILDER!
// tegnforklaringsBilde blir brukt til å sette bilde hvis legendUrl blir funnet!
async function hentBildeFraWMSCapabilities(lagNavn, kartlag, tegnforklaringsBilde, tegnforklaringsContainer){
  // console.log("hentBildeFraWMSCapabilities ~ lagNavn: " + lagNavn);
  try{
    if(tegnforklaringsBilde == null){
      tegnforklaringsBilde = document.getElementById("aktivtLagTegnforklaringBilde" + lagNavn);
    }
    if(kartlag == null){
      kartlag = hentKartlagMedLagNavn(lagNavn);
    }
    const wmsLayersName = kartlag.getSource().getParams()["LAYERS"]; // Alle WMS-lag skal ha en LAYERS i sin kilde-params.
    // console.log("wmsLayersName: " + wmsLayersName + " for lagNavn " + lagNavn);

    // var kartlag = hentKartlagMedLagNavn(lagNavn);
    var parser = new ol.format.WMSCapabilities();

    var capabilitiesUrl = kartlag.get("capabilitiesURL");
    // console.log(capabilitiesUrl);
    if(capabilitiesUrl == null){
      capabilitiesUrl = kartlag.getSource().getUrl();
      const inneholderSporsmaalstegn = capabilitiesUrl.includes("?");
      const inneholderVersjon = capabilitiesUrl.includes("VERSION");
      const urlSplit = capabilitiesUrl.split("?");
      // console.log("urlSplit: " + urlSplit + ", urlSplit length: " + urlSplit.length + ", url: " + capabilitiesUrl);
      if(!inneholderSporsmaalstegn){
        capabilitiesUrl += "?service=wms&request=getcapabilities";
      } else {
        if(urlSplit.length > 1){
          if(urlSplit[1].length > 0){
            capabilitiesUrl += "&";
          }
        }
        capabilitiesUrl += "service=wms&request=getcapabilities";
      }
      // if(!inneholderVersjon) capabilitiesUrl += "&version=1.3.0";
      console.log("hentBildeFraWMSCapabilities ~ Ferdige capabilitiesURL: " + capabilitiesUrl);
    }

    var fetched = await fetch(capabilitiesUrl);
    if(fetched.ok){
      var text = await fetched.text();
      // console.log(text); // XML

      const result = await parser.read(text);
      // console.log(result);

      var lagFraKilden = result["Capability"]["Layer"]["Layer"]; // 
      // console.log(lagFraKilden);

      var funnetLag = null;
      // var fantMatch = false;
      for(var i = 0; i < lagFraKilden.length; i++){
        var lag = lagFraKilden[i];
        // console.log(lag);

        // NOTE: Må sjekke kartlag under kartlag! (layer i layer)
        var lagILag = lag["Layer"];
        // console.log(lagILag);
        // Hvis lagILag ikke er null så sjekkes lag under laget.
        if(lagILag != null){
          for(var j = 0; j < lagILag.length; j++){
            var underLag = lagILag[j];
            if(underLag["Name"] == wmsLayersName){
              funnetLag = underLag;
              break;
            }
          }
        } else {
          // Hvis laget ikke inneholder underlag så sjekkes laget direkte.
          if(lag["Name"] == wmsLayersName){
            funnetLag = lag;
            break;
          }
        }
      }

      if(funnetLag != null){
        const legendUrl = funnetLag["Style"][0]["LegendURL"][0]["OnlineResource"];
        // console.log(legendUrl);
        tegnforklaringsBilde.src = legendUrl;
        tegnforklaringsBilde.onerror = function(){
          console.log("hentBildeFraWMSCapabilities ~ getCapabilities for tegnforklaringsbildet feilet også for lagNavn: " + lagNavn);
        }
        tegnforklaringsBilde.onload = function(){
          console.log("hentBildeFraWMSCapabilities ~ Fant bilde med getCapabilities metadata for lagNavn: " + lagNavn);
          tegnforklaringsContainer.style.display = "block";
          tegnforklaringsBilde.style.display = "block";
        }
      } else {
        console.log("hentBildeFraWMSCapabilities ~ Fant ingen match i meta data fra urlen: " + capabilitiesUrl + " for lagNavn: " + lagNavn);
      }

    } else {
      console.log("fetched failed for lagNavn: " + lagNavn);
    }

  }catch(e){
    console.log("hentBildeFraWMSCapabilities ~ Noe feilet!? catch(e): " + e);
  }
}

//
function visInfoForAktivtKartlagMedLagNavn(lagNavn){
  console.log("visInfoForAktivtKartlagMedLagNavn ~ lagNavn: " + lagNavn);

  toggleVisInfo(lagNavn);
}

// Bare setter opacity (gjennomsiktighet) til null for kartlaget.
function settOpacityTilNullForKartlagMedLagNavn(lagNavn){
  try {
    var kartlag = hentKartlagMedLagNavn(lagNavn);
    var opacity = kartlag.getOpacity();
    var ikonLag = kartlag.get("ikonLag");
    if(opacity <= 0){
      kartlag.setOpacity(0.8);
      if(ikonLag){
        ikonLag.setOpacity(0.9);
      }
    } else {
      kartlag.setOpacity(0);
      if(ikonLag) {
        ikonLag.setOpacity(0);
      }
    }
    hentSynligeKartlagForAktiveLagSiden(); // Oppdater aktive kartlag listen.
    updateSlider(lagNavn); // Oppdater slider.
  } catch(exception){
    console.log("settOpacityTilNullForKartlagMedLagNavn ~ exception: " + exception);
  }
}
// Gjør kartlaget usynlig (visible == false), som tar kartlaget vekk fra "aktive lag" tabben.
function deaktiverAktivtKartlagMedLagNavn(lagNavn){
  skjulKartlagMedLagNavn(lagNavn);
  hentSynligeKartlagForAktiveLagSiden();
}

function updateSlider(lagNavn){
  // Debug:
  // console.log("updateSlider, lagNavn: " + lagNavn);
  // var sliderNavn = "slider" + lagNavn;
  // var sliderVerdiNavn = "sliderVerdi" + lagNavn;
  // console.log("updateSlider ~ sliderNavn: " + sliderNavn + ", sliderVerdiNavn: " + sliderVerdiNavn);

  var val = document.getElementById("slider" + lagNavn).value;
  document.getElementById("sliderVerdi" + lagNavn).innerHTML = val;
  var o = val / 100;

  // Hm... Hente kartlaget fra map-objektet hver gang? Blir mange kall... ... Men funker.

  var kartlag = hentKartlagMedLagNavn(lagNavn);
  if(kartlag != null){
    // console.log("kartlag er ikke null. kartlag: " + kartlag);
    kartlag.setOpacity(o);

    // For debug:
    // var opacity = kartlag.getOpacity();
    // console.log("kartlag.getOpacity: " + opacity);

    // For ruter med ikoner, skjul ikoner hvis opacity er 0?
    var ikonLag = kartlag.get("ikonLag");
    if(ikonLag){
      if(o <= 0){
        ikonLag.setOpacity(0);
      } else {
        ikonLag.setOpacity(0.9);
      }
    }

  }

  // Opacity for farge-ikonet:
  document.getElementById("aktivtLagFarge" + lagNavn).style.opacity = o;

}

// Hm... Begynne med bakgrunnskartene?

function leggTilKartlag(gruppe, kartlag){

  // LEGGE TIL

  map.getLayers().forEach(group => {

    if(group.get("name") == gruppe){
      var layers = group.getLayers();
      layers.push(kartlag);
      // 
      group.setLayers(layers); // Funka nå! På Stack exchange eller noe.

      console.log("leggTilKartlag ~ lagt til kartlag: " + kartlag.get("name"));
      // console.log("leggTilKartlag ~ kartlag: " + kartlag.get("name") + " til gruppen: " + gruppe);
      // console.log("La til kartlaget " + kartlag.get("name") + " til gruppen " + group.get("name") + ".");
    }

  });

}

function taBortKartlag(gruppe, kartlag){

  // TA BORT

  map.getLayers().forEach(group => {

    if(group.get("name") == gruppe){
      var layers = group.getLayers();
      layers.pop(kartlag);
      // 
      group.setLayers(layers);

      // console.log("Tok bort kartlaget " + kartlag.get("name") + " fra gruppen " + group.get("name") + ".");
    }

  });

//   // // Funker... Fant på Stackoverflow.
//   map.getLayers().getArray()
//   .filter(layer => layer.get('name') === 'Geometri')
//   .forEach(
//     layer => {
//     // map.removeLayer(layer)
// });

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

function skjulKartlagMedLagNavn(lagNavn){
  var layer = hentKartlagMedLagNavn(lagNavn);
  if(layer != null){
      // Må hente lagIndeks:
      var lagIndeks = -1;
      try {
        lagIndeks = htmlKartLagDict[lagNavn]["lagIndeks"];
        // console.log("Fant lagIndeks med htmlKartLagDict. Kartlaget " + lagNavn + " har indeks " + lagIndeks);
      } catch (error) {
        console.log("skjulKartlagMedLagNavn ~ Noe error med å hente lagIndeks fra htmlKartLagDict. error: " + error);
      }
      skjulKartlag(layer, lagIndeks); // Denne inneholder errorsjekk for lagIndeks -1.
  } else {
    console.log("skjulKartlagMedLagNavn ~ fant ikke kartlag med lagNavn: " + lagNavn);
  }
}

// Bare for bakgrunnskart?
function skjulKartlag(layer, lagIndeks){
  if (layer.get("visible") == true){
    layer.setVisible(false);
    if(lagIndeks > -1){
      // hovedMenyKlasseIndikator[lagIndeks].style.opacity = "0";
      hovedMenyKlasseIndikator[lagIndeks].style.opacity = "0.1";
    }
    const lagNavn = layer.get("name");
    const ikonLag = layer.get("ikonLag");
    // console.log(lagNavn);
    // console.log(ikonLag);
    // For turer med ikoner
    if(ikonLag){
      ikonLag.setVisible(false);
      // console.log(lagNavn + " har et ikonLag! Gjør det usynlig. ikonLagNavn: " + ikonLag.get("name"));
    }
    // console.log(lagNavn + " er nå skjult! visible: " + layer.get("visible"));

    // Ta bort fra aktiveKartlagListe
    //  slettFraAktiveKartlagListen(lagNavn);
  }
}

// OBS! Hm, litt usikker på forskjellen her på visKartlag og forandreSynlighet...

// bare for bakgrunnskart?
function visKartlag(layer, lagIndeks, analyse){
  if(layer.get("visible") == false){
    layer.setVisible(true);
    if(lagIndeks > -1){
      hovedMenyKlasseIndikator[lagIndeks].style.opacity = "1";
    }
    const lagNavn = layer.get("name");
    const ikonLag = layer.get("ikonLag");
    // console.log(lagNavn);
    // console.log(ikonLag);
    // For turer med ikoner
    if(ikonLag){
      ikonLag.setVisible(true);
      // console.log(lagNavn + " har et ikonLag! Gjør det synlig! ikonLagNavn: " + ikonLag.get("name"));
    }
    // console.log(lagNavn + " er nå synlig! visible: " + layer.get("visible"));

    // Legge til aktiveKartlagListe
    // leggTilIAktiveKartlagListen(lagNavn);
    aktivtBakgrunnskart = lagNavn;
    console.log("aktivtBakgrunnskart: " + aktivtBakgrunnskart);
    lagUrl();

    // Plausible Analytics
    if(analyse){
      try {
        plausible("Aktivert bakgrunnskartlag", {
          props: {
            aktivert_bakgrunnskartlag: layer.get("uiName")
          },
        });
      } catch (e) {
        console.log(e);
      }
    }

  }
}

function settSynlighetKartlag(layer, lagIndeks, analyse) {
  // 
  let lagNavn = layer.get("name");
  let ruteKartlag;
  let ruteKartlagNavn;

  const lagType = layer.get("type");
  // Hente ruteKartlag og navnet på rutekartlaget, hvis kartlaget er et ikon-lag.
  // layer er et ikon kartlag
  if (lagType == "ikonLag") {
    ruteKartlag = hentKartlagMedLagNavn(layer.get("ruteKartlagNavn"));
    if (ruteKartlag) {
      ruteKartlagNavn = ruteKartlag.get("name");
    }
  }

  const ikonLag = layer.get("ikonLag");

  // OBS! Spesiell regel for kalenderrutene!
  // let lagNavn = layer.get("name");
  if (lagNavn.includes("kalender") || lagNavn.includes("Kalender")) {
    tilbakestillMidlertidigeKartlag();
    // I tilfelle bruker klikket inn på rute via popup
    skjulPopupContainer();
  }

  // console.log(ikonLag);
  if (layer.get("visible") == true) {
    layer.setVisible(false);
    if (lagIndeks > -1) {
      // hovedMenyKlasseIndikator[lagIndeks].style.opacity = "0";
      hovedMenyKlasseIndikator[lagIndeks].style.opacity = "0.1";
    }

    if (ikonLag) {
      ikonLag.setVisible(false);
    }

    // Slette fra rutekartlaget til aktiveKartlagListen.
    if (ruteKartlagNavn) {
      slettFraAktiveKartlagListen(ruteKartlagNavn);
    } else {
      slettFraAktiveKartlagListen(lagNavn);
    }

    // console.log(layer.get("name") + " er nå skjult! visible: " + layer.get("visible"));
  } else {
    layer.setVisible(true);
    if (lagIndeks > -1) {
      hovedMenyKlasseIndikator[lagIndeks].style.opacity = "1";
    }

    if (ikonLag) {
      ikonLag.setVisible(true);
    }

    // Legge til rutekartlaget til aktiveKartlagListen.
    if (ruteKartlagNavn) {
      leggTilIAktiveKartlagListen(ruteKartlagNavn);
    } else {
      leggTilIAktiveKartlagListen(lagNavn);
    }

    // console.log(layer.get("name") + " er nå synlig! visible: " + layer.get("visible"));

    // Plausible Analytics
    if (analyse) {
      try {
        plausible("Aktivert kartlag fra hovedmenyen", {
          props: {
            aktivert_kartlag: layer.get("uiName")
          },
        });
      } catch (e) {
        console.log(e);
      }
    }

  }
}

// Spesielt for Bakgrunnskart! // Hm, egentlig samme kode som i forandreSynlighetKartlagUtenIndeks().
// bakgrunnskartlagNavn : string (navnet på bakgrunnskartlaget)
function visBakgrunnskartlag(bakgrunnskartlagNavn, analyse){
  map.getLayers().getArray().forEach(group => {
    var gruppeNavn = group.get("name");

    if(gruppeNavn == "Bakgrunnskart"){

      if (lagFinnesIKartObjektet(gruppeNavn, bakgrunnskartlagNavn) == false) {
        console.log("Bakgrunnskart --- kartlaget " + bakgrunnskartlagNavn + " finnes ikke i kart-objektet, så returnerer tidlig.");
        return; // Hvis det ikke eksisterer, returner tidlig.
      }

      group.getLayers().forEach(layer => {
        var lagNavn = layer.get("name");
        // Hent lagIndeks:
        var lagIndeks = -1; // Hm. Jeg tror det er checks for hvis lagIndeks er over -1 i vis/skjulKartlag.

        try {
          lagIndeks = htmlKartLagDict[lagNavn]["lagIndeks"];
          // console.log("Fant lagIndeks med htmlKartLagDict. Kartlaget " + lagNavn + " har indeks " + lagIndeks);
        } catch (error) {
          console.log("Noe error med å hente lagIndeks fra htmlKartLagDict. Skrivefeil?");
        }

        if (lagNavn === bakgrunnskartlagNavn) {
          visKartlag(layer, lagIndeks, analyse);
        } else {
          skjulKartlag(layer, lagIndeks);
        }

      });

    } // gruppeNavn == "Bakgrunnskart"

  });
}

// For alle kartlag bortsett fra bakgrunnskartlag.
function forandreSynlighetKartlagMedBareNavn(kartlagNavn, analyse){
  map.getLayers().getArray().forEach(group => {
    var gruppeNavn = group.get("name");
    if(gruppeNavn != "bakgrunnskart"){
      group.getLayers().forEach(layer => {

        var lagNavn = layer.get("name");
        if (lagNavn === kartlagNavn) {

          // Hent lagIndeks:
          var lagIndeks = -1;

          try {
            lagIndeks = htmlKartLagDict[kartlagNavn]["lagIndeks"];
            // console.log("Fant lagIndeks med htmlKartLagDict. Kartlaget " + lagNavn + " har indeks " + lagIndeks);
          } catch (error) {
            console.log("Noe error med å hente lagIndeks fra htmlKartLagDict. Skrivefeil? error: " + error);
          }

          settSynlighetKartlag(layer, lagIndeks, analyse);

        }

     });
    }
  });
}

// Gjør: toggle kartlagNavn.
// For bakgrunnskart, aktiverer kartlagNavn og skjuler resten.
//
// OBS! En stor forskjell mellom vanlige kartlag og bakgrunnskart.
// Kanskje burde ha egne funksjoner for vanlige kartlag og bakgrunnskart?
// For vanlige kartlag: lagIndeks = htmlKartLagDict[kartlagNavn]
// For bakgrunnskart:   lagIndeks = htmlKartLagDict[lagNavn]
// Dette fordi at for bakgrunnskart sjekkes alle kartlagene ved å aktivere kartlagNavn og deaktivere resten.
// For vanlige kartlag gjøres en "toggle" på den, altså hvis synlig, gjør den usynlig, vice versa.
function forandreSynlighetKartlagUtenIndeks(kartlagGruppe, kartlagNavn, analyse) {
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
          var lagIndeks = -1; // Hm. Jeg tror det er checks for hvis lagIndeks er over -1 i vis/skjulKartlag.

          try {
            lagIndeks = htmlKartLagDict[lagNavn]["lagIndeks"];
            // console.log("Fant lagIndeks med htmlKartLagDict. Kartlaget " + lagNavn + " har indeks " + lagIndeks);
          } catch (error) {
            console.log("forandreSynlighetKartlagUtenIndeks ~ Noe error med å hente lagIndeks fra htmlKartLagDict. error: " + error);
          }

          // Viser det ene bakgrunnskartet og skjuler de andre.
          if (lagNavn === kartlagNavn) {
            visKartlag(layer, lagIndeks, analyse);
          } else {
            skjulKartlag(layer, lagIndeks);
          }

        });

      } 
      // For alle andre kartlag som ikke er bakgrunnskart
      else {
        group.getLayers().forEach(layer => {

          var lagNavn = layer.get("name");
          if (lagNavn === kartlagNavn) {

            // Hent lagIndeks:
            var lagIndeks = -1;

            try {
              lagIndeks = htmlKartLagDict[kartlagNavn]["lagIndeks"];
              // console.log("Fant lagIndeks med htmlKartLagDict. Kartlaget " + lagNavn + " har indeks " + lagIndeks);
            } catch (error) {
              console.log("forandreSynlighetKartlagUtenIndeks ~ Noe error med å hente lagIndeks fra htmlKartLagDict. error: " + error);
            }

            settSynlighetKartlag(layer, lagIndeks, analyse);

          }

        });
      }

    } // gruppeNavn == kartlagGruppe

  });
}

// Funker!
function forandreSynlighetKartlag(kartlagGruppe, kartlagNavn, kartLagIndeks, analyse) {

  // Blokkering ved åpning av hovedVindu på mobil:
  if(blokkerHovedVinduTrykk) return;

  // console.log("kartlagGruppe: " + kartlagGruppe + ", kartlagNavn: " + kartlagNavn + ", kartLagIndeks: " + kartLagIndeks);

  map.getLayers().getArray().forEach(group => {

    var gruppeNavn = group.get("name");
    // console.log(gruppeNavn);

    if(gruppeNavn == kartlagGruppe){
      // console.log("gruppeNavn matcher kartlagGruppe! gruppeNavn: " + gruppeNavn + ", kartlagGruppe: " + kartlagGruppe);

      if(kartlagGruppe == "Bakgrunnskart"){

        if(lagFinnesIKartObjektet(kartlagGruppe, kartlagNavn) == false){
          // console.log("Bakgrunnskart --- kartlaget " + kartlagNavn + " finnes ikke i kart-objektet, så returnerer tidlig.");
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
          } catch (error) {
            console.log("forandreSynlighetKartlag ~ Noe error med å hente lagIndeks fra htmlKartLagDict. error: " + error);
          }

          if (lagNavn === kartlagNavn) {
            visKartlag(layer, lagIndeks, analyse);
          } else {
            skjulKartlag(layer, lagIndeks);
          }

        });

      } else {
        group.getLayers().forEach(layer => {

          var lagNavn = layer.get("name");
          // console.log(lagNavn);
          
          if(lagNavn == kartlagNavn){
            settSynlighetKartlag(layer, kartLagIndeks, analyse); // NOTE: kartLagIndeks er fra funksjon argument.
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

// const displayFeatureInfo = function (pixel) {
//   settFeatureSelectionListeOgLagPopup(pixel);
// };

// Hm... Muligens slette, hvis ikke i bruk?
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

// Ikke brukt nå?
function toggleKartKnapperEtterDelay(TillattPointerEvents, delay){
  console.log("toggleKartKnapperEtterDelay triggered!");
  setTimeout(() => {
    console.log("toggleKartKnapperEtterDelay delay triggered!");
    if(TillattPointerEvents){
      // Bare tillatt pointerEvents, hvis hovedmenyen faktisk er synlig.
      if(hovedVindu.style.overflowY != "hidden"){
        document.getElementById("alleKnapperContainer").style.pointerEvents = "all";

        // Re-enable map interactions
        // map.getInteractions().forEach(x => x.setActive(true));
        // Tillatt trykk på hovedmenyen igjen etter delay
        hovedMenyTabsContainer.style.pointerEvents = "auto";
        sideKartMeny.style.pointerEvents = "auto";
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

        // Re-enable map interactions
        // map.getInteractions().forEach(x => x.setActive(true));
        // Tillatt trykk på hovedmenyen igjen etter delay
        hovedMenyTabsContainer.style.pointerEvents = "auto";
        sideKartMeny.style.pointerEvents = "auto";

        // console.log("tillattKartKnapperEtterDelay ~ hovedVindu har overflowY som IKKE er hidden!");
      } else {
        // console.log("tillattKartKnapperEtterDelay ~ hovedVindu har overflowY HIDDEN!");
    }
  // }, 1000);
}, 500); // Prøve med et halvt sekund istedenfor? Kanskje det holder?
}

function aktiverKartlagMedNavn(analyse){

  map.getLayers().getArray().forEach(group => {
    var gruppeNavn = group.get("name");
    if(gruppeNavn != "bakgrunnskart"){
      group.getLayers().forEach(layer => {
        var navn = layer.get("name");
        if(lagListeFraURL.includes(navn)){
          var lagNavn = layer.get("name");
          // console.log("aktiverKartlagMedKoder ~ layer i lagListeFraURL! kode: " + kode + ", lagNavn: " + lagNavn);
          forandreSynlighetKartlagUtenIndeks(gruppeNavn, lagNavn, analyse);
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

function calculateThresholdMarginBottom(){
  var containerClick = getComputedStyle(hovedVinduContainer);
  var itemTopMarginClick = containerClick.marginTop; // 140px
  var topMarginClick = parseInt(itemTopMarginClick);

  var hovedVinduHeightClick = getComputedStyle(hovedVindu);
  var itemHeightClick = hovedVinduHeightClick.height;
  var pixelHeightClick = parseInt(itemHeightClick);

  var thresholdMarginBottom = topMarginClick + pixelHeightClick;;
  // console.log("thresholdMarginBottom: " + thresholdMarginBottom);
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

      // console.log("WMTS lag laget for " + lagNavn + "!");

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
          bytteBakgrunnTopografisk.style.filter = "saturate(100%)";
          bytteBakgrunnTopografisk.style.cursor = "pointer";
          break;
        case "bakgrunnskartTopoGraa":
          bakgrunnskartTopoGraa = kartLagUt;
          bytteBakgrunnTopografiskGraa.style.filter = "saturate(100%)";
          bytteBakgrunnTopografiskGraa.style.cursor = "pointer";
          break;
        case "bakgrunnskartNorgeIBilder":
          bakgrunnskartNorgeIBilder = kartLagUt;
          bytteBakgrunnSatelitt.style.filter = "saturate(100%)";
          bytteBakgrunnSatelitt.style.cursor = "pointer";
          break;
        case "bakgrunnskartEnkel":
          bakgrunnskartEnkel = kartLagUt;
          bytteBakgrunnForenklet.style.filter = "saturate(100%)";
          bytteBakgrunnForenklet.style.cursor = "pointer";
          break;
        default:
          break;
      }

      // Bytte farge på teksten fra grå til sort.
      try {
        var lagIndeks = htmlKartLagDict[lagNavn]["lagIndeks"];
        // console.log("lagBakgrunnskartWMTS ~ lagIndeks: " + lagIndeks + " for kartlag: " + lagNavn);
        hovedMenyKlasseKartlagTekst[lagIndeks].style.color = "black";
      } catch (exception) {
        console.log("lagBakgrunnskartWMTS ~ prøvde å hente lagIndeks og forandre på fargen til kartlagTeksten. error: " + exception);
      }

      // Temp for debug:
      settInnKartlagIMasterListe(lagNavn, kartLagUt);
      // console.log(hentKartlagIMasterListe(lagNavn));

      // 
      if(bakgrunnFraUrlParam){
        if(lagNavn == bakgrunnFraUrlParam){
          // forandreSynlighetKartlagUtenIndeks("Bakgrunnskart", lagNavn);
          // visBakgrunnskartlag(lagNavn);
          byttBakgrunnFunksjon(kartLagUt);
        }
      }

    } else {
      console.log("kartLagUt feilet for lagNavn: " + lagNavn);
    }

  }
}

// For bytteknappen til bakgrunnskart.
function toggleByttBakgrunn(){
  if(containerBytteBakgrunn.style.display == "block"){
    deaktiverByttBakgrunn();
  } else {
    aktiverByttBakgrunn();
  }
}
function aktiverByttBakgrunn(){
  containerBytteBakgrunn.style.display = "block";
  byttBakgrunn.style.opacity = "1";
  // console.log("aktiverByttBakgrunn triggered!");
}
function deaktiverByttBakgrunn(){
  containerBytteBakgrunn.style.display = "none";
  byttBakgrunn.style.opacity = "0.75";
  // console.log("deaktiverByttBakgrunn triggered!");
}

/* NAVIGERE TIL SKOLESIDEN */

function navigerTilSkoleprosjektet(){
  // location.href = originWithSlash + "skole";

  // // Må ha forskjellig logikk for testsiden på github
  // if(originWithSlash.includes("github.io")){
  //   location.href = originWithSlash + "markakartet_dev/skole";
  // } else {
  //   location.href = originWithSlash + "skole";
  // }

  location.href = originWithSlash + "skole";
}

// Debug-funksjon. Kan kanskje lage en egen JS-fil med debug-funksjoner?
// Parameteren kan være tom (gav ikke error).
function debugPrintAlleKartlagIMap(spesifikkGruppe){
  console.log("debugPrintAlleKartlagIMap kjører! spesifikkGruppe: " + spesifikkGruppe);
  map.getLayers().getArray().forEach(group => {
    const gruppeNavn = group.get("name");
    // Hardcodet ikke Bakgrunnskart-gruppen.
    if(gruppeNavn != "Bakgrunnskart"){
      if(spesifikkGruppe){
        if(gruppeNavn == spesifikkGruppe){
          console.log("debugPrintAlleKartlagIMap ~ GRUPPE: " + gruppeNavn);
          group.getLayers().forEach(layer => {
            console.log("debugPrintAlleKartlagIMap ~ kartlag: " + layer.get("name"));
          });
        }
      } else {
        console.log("debugPrintAlleKartlagIMap ~ GRUPPE: " + gruppeNavn);
        group.getLayers().forEach(layer => {
          console.log("debugPrintAlleKartlagIMap ~ kartlag: " + layer.get("name"));
        });
      }

      // group.getLayers().forEach(layer => {
      //   console.log("debugPrintAlleKartlagIMap ~ kartlag: " + layer.get("name"));
      // });
    }
  });
}

/* Hovedmeny slide metoder */

//
function hentHovedVinduContainerTopMargin(){
  var container = getComputedStyle(hovedVinduContainer);
  var containerTopMargin = container.marginTop;
  return parseInt(containerTopMargin);
}
//
function hentHovedVinduPixelHeight(){
  var hoved = getComputedStyle(hovedVindu);
  var hovedVinduHeight = hoved.height;
  return parseInt(hovedVinduHeight);
}
//
function kalkulerMidtpunktet(){
  return Math.round(((hovedVinduContainerTopMargin - 140) + hovedVinduPixelHeight) / 2);
}
//
function kalkulerThresholds(){
  if(thresholdWhenHighMarginBottom == null){
    hovedVinduContainerTopMargin = hentHovedVinduContainerTopMargin();
    hovedVinduPixelHeight = hentHovedVinduPixelHeight();
    thresholdWhenHighMarginBottom = hovedVinduContainerTopMargin + hovedVinduPixelHeight;
    // console.log("thresholdWhenHighMarginBottom: " + thresholdWhenHighMarginBottom);
  
    marginTopMax = hovedVinduContainerTopMargin + hovedVinduPixelHeight; // 570
    marginTopHide = marginTopMax - 40; // 530
    // console.log("kalkulerThresholds ~ thresholdWhenHighMarginBottom: " + thresholdWhenHighMarginBottom + ", marginTopMax: " + marginTopMax + ", marginTopHide: " + marginTopHide);
  }
}

//
function lukkHovedVindu(){
  hovedVinduContainer.style.marginBottom = hovedVinduContainerMarginBottomWhenHidden;
  hovedVindu.style.overflowY = "hidden";
  hovedVindu.style.opacity = "0";
  blokkerKartKnapper();

  var nyTopMarginNed = calculateThresholdMarginBottom();
  hovedVinduContainer.style.marginTop = nyTopMarginNed + "px";
  // console.log("hovedVindu lukket!");

  hovedVinduVises = false;
}

// 
function aapneHovedVindu(){
  hovedVinduContainer.style.marginBottom = hovedVinduContainerMarginBottomWhenScroll;
  hovedVindu.style.overflowY = "scroll";
  hovedVindu.style.opacity = "1";
  tillattKartKnapperEtterDelay();

  var nyTopMarginOpp = minHovedMarginTop;
  hovedVinduContainer.style.marginTop = nyTopMarginOpp + "px";
  // console.log("hovedVindu åpnet!");

  hovedVinduVises = true;
}

function init(){

}

/* NAVIGASJON AV HOVEDVINDUET (TABS) */

// Alle/Aktive lag knapper.

function skjulHovedMenyTabsKnapper(){
  hovedMenyTabsContainer.style.display = "none";
}
function visHovedMenyTabsKnapper(){
  hovedMenyTabsContainer.style.display = "flex";
}

// Forandrer/Setter IKKE boolean aktiveLagVises.
function skjulBeggeLagSiderUtenEndreBoolean(){
  sideKartMeny.style.display = "none";
  sideAktiveLag.style.display = "none";
}
// Enkleste løsningen for å sett riktig side for hovedmenyen. Altså enten "alle" eller "aktive".
// Forandrer/Setter IKKE boolean aktiveLagVises.
function visRiktigLagSideForMenyUtenEndreBoolean(){
  if(aktiveLagVises){
    sideKartMeny.style.display = "none";
    sideAktiveLag.style.display = "block";
  } else {
    sideKartMeny.style.display = "block";
    sideAktiveLag.style.display = "none";
  }
}
function byttHovedMenyVisning(){
  if(aktiveLagVises){
    aktiveLagVises = false;
    sideKartMeny.style.display = "none";
  } else {
    aktiveLagVises = true;
    sideAktiveLag.style.display = "block";
  }
}
// Viser "alle" siden og skjuler "aktive". Setter boolean aktiveLagVises.
function byttTilAlleLagSiden(){
  aktiveLagVises = false;
  sideKartMeny.style.display = "block";
  sideAktiveLag.style.display = "none";
  settRiktigStilForTabKnapperUtenEndreBoolean();
}
// Viser "aktive" siden og skjuler "alle". Setter boolean aktiveLagVises.
function byttTilAktiveLagSiden(){
  aktiveLagVises = true;
  sideKartMeny.style.display = "none";
  sideAktiveLag.style.display = "block";
  settRiktigStilForTabKnapperUtenEndreBoolean();
  // TEST: Hente kartlag her.
  hentSynligeKartlagForAktiveLagSiden();

  // Plausible Analytics
  try {
    plausible("Trykk på 'Aktive lag' knappen", {
    });
  } catch (e) {
    console.log(e);
  }

}
function visAlleLagSide(){
  aktiveLagVises = false;
  sideKartMeny.style.display = "block";
}
function skjulAlleLagSide(){
  aktiveLagVises = true;
  sideKartMeny.style.display = "none";
}
function visAktiveLagSide(){
  aktiveLagVises = true;
  sideAktiveLag.style.display = "block";
}
function skjulAktiveLagSide(){
  aktiveLagVises = false;
  sideAktiveLag.style.display = "none";
}
// Setter stil. Forandrer/Setter ikke boolean aktiveLagVises.
function settRiktigStilForTabKnapperUtenEndreBoolean(){
  if(aktiveLagVises){
    tabAktivKnapp.classList.add("hovedMenyTabAktiv");
    tabAktivKnapp.classList.remove("hovedMenyTabInaktiv");
    tabAlleKnapp.classList.add("hovedMenyTabInaktiv");
    tabAlleKnapp.classList.remove("hovedMenyTabAktiv");
  } else {
    tabAktivKnapp.classList.remove("hovedMenyTabAktiv");
    tabAktivKnapp.classList.add("hovedMenyTabInaktiv");
    tabAlleKnapp.classList.remove("hovedMenyTabInaktiv");
    tabAlleKnapp.classList.add("hovedMenyTabAktiv");
  }
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

// 
function visSideOgSkjulResten(side){
  side.style.display = "block";

  if(side != sideKartMeny){
    // sideKartMeny.style.display = "none";
    skjulBeggeLagSiderUtenEndreBoolean();
  } else {
    // Unikt for hovedmenyen. Viser riktig side mellom "alle" og "aktive".
    visRiktigLagSideForMenyUtenEndreBoolean();
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

// Ikke i bruk (enda)?
function skjulSider(){
  skjulBeggeLagSiderUtenEndreBoolean();
  // sideKartMeny.style.display = "none";
  sideDelKartvisning.style.display = "none";
  sideOmMarkakartet.style.display = "none";
  sideStott.style.display = "none";
}

function kartMenySideKlikk(divTrykketPaa, inVisFeatureInfo, aapnerHovedVindu){

  // Åpne meny hvis hovedvinduet er skjult mens brukeren trykker på en navigasjonstab.
  if(aapnerHovedVindu && !hovedVinduVises){
    aapneHovedVindu();
  }

  // console.log("kartMenySideKlikk ~ divTrykketPaa: " + divTrykketPaa + ", sisteMenyAktiv: " + sisteMenyAktiv + ", inVisFeatureInfo: " + inVisFeatureInfo + ", aapnerHovedVindu: " + aapnerHovedVindu);
  // resetBorderBottom(); // For enkelhetsskyld, resetter alle? ...

  // Deaktivering av den siste som var aktiv.
  switch(sisteMenyAktiv){
    case "divMenyKart":
      skjulSide(sideKartMeny);
      divMenyKartBilde.src = "./images/layer.png";
      headerKnappKartMeny.style.color = "black";
      headerKnappKartMeny.style.borderBottomColor = fargeTones5;
      // Skjul alle/aktive-knappene for de andre sidene:
      skjulHovedMenyTabsKnapper();
      skjulBeggeLagSiderUtenEndreBoolean(); // Skjuler både "alle" og "aktive".

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

  hovedVindu.scrollTop = 0; // Scroll to top når bytter side.

  // Aktivering:
  switch(divTrykketPaa){
    case "divMenyKart":
      divMenyKartBilde.src = "./images/layer-white.png";
      headerKnappKartMeny.style.color = "white";
      headerKnappKartMeny.style.borderBottom = "3px solid white";

      if(inVisFeatureInfo){
        visSide(sideFeatureInfo);
      } else {
        visSide(sideKartMeny);
        // Vis alle/aktive-lag knapper.
        // Ikke med sideFeatureInfo, men lurer på om jeg skal gjøre det annerledes?
        visHovedMenyTabsKnapper();
        // Unikt for hovedmenyen. Vise riktig mellom "alle" og "aktive".
        visRiktigLagSideForMenyUtenEndreBoolean();
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
      // genererURL();
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

  // Plausible Analytics
  try{
    let menySideUi = "Ingen side";

    switch(divTrykketPaa){
      case "divMenyKart": menySideUi = "Kart"; break;
      case "divMenyDel": menySideUi = "Del"; break;
      case "divMenyOm": menySideUi = "Om"; break;
      case "divMenyStott": menySideUi = "Støtt"; break;
    }

    plausible('Trykk av hovedknapper', {
      props: {
        sideUi: menySideUi,
      }
    })
  }catch(e){
    console.log(e);
  }

}

//
function byttBakgrunnFunksjon(bakgrunnskartlag){
  try{
    switch(bakgrunnskartlag){
      case bakgrunnskartOSM:
          visBakgrunnskartlag(bakgrunnskartOSM.get("name"), true);
          byttBakgrunn.src = "./images/bakgrunn-osm-350x350.jpg";
        break;
      case bakgrunnskartNorgeIBilder:
          visBakgrunnskartlag(bakgrunnskartNorgeIBilder.get("name"), true);
          byttBakgrunn.src = originWithSlash + "./images/bakgrunn-satelitt-350x350.jpg";
        break;
      case bakgrunnskartTopo4:
          visBakgrunnskartlag(bakgrunnskartTopo4.get("name"), true);
          byttBakgrunn.src = originWithSlash + "./images/bakgrunn-topografisk-350x350.jpg";
        break;
      case bakgrunnskartTopoGraa:
          visBakgrunnskartlag(bakgrunnskartTopoGraa.get("name"), true);
          byttBakgrunn.src = originWithSlash + "./images/bakgrunn-topografisk-graa-350x350.jpg";
        break;
      case bakgrunnskartEnkel:
          visBakgrunnskartlag(bakgrunnskartEnkel.get("name"), true);
          byttBakgrunn.src = originWithSlash + "./images/bakgrunn-forenklet-350x350.jpg";
        break;
    }
    deaktiverByttBakgrunn();
  } catch(error){
    console.log("byttBakgrunn ~ error: " + error);
  }
}

// Spesifikt for kalender turer
function tilbakestillMidlertidigeKartlag(){
  if(kalenderTurerErSkjult){
    kalenderOpacityErLagret = false;
    kalenderTurerErSkjult = false;
    // console.log("tilbakestillMidlertidigeKartlag ~ kalenderTurerSisteOpacity: " + kalenderTurerSisteOpacity);
    midlertidigFeatureIconsCollection.clear();
    midlertidigFeatureCollection.clear();
    vektorLagKalenderRuter2021.setOpacity(kalenderTurerSisteOpacity);
    if(kalenderTurerSisteOpacity > 0){
      vektorlagKalenderRuter2021Ikoner.setOpacity(0.9);
    }
  }
}

// Kanskje kreve at kartlaget ikke kan være et ikonlag?
function visFeatureInfoSide(feature, featureNavn, kartlag, stipletter, aapneHovedMeny){
  // console.log("visFeatureInfoSide triggered!");
  // console.log(feature);
  // console.log(kartlag);
  // console.log("stipletter: ");
  // console.log(stipletter);

  // Sørge for at ikke ikonlag blir brukt videre.
  if(kartlag.get("name").includes("Ikon") || kartlag.get("name").includes("ikon")){
    kartlag = hentKartlagMedLagNavn(kartlag.get("ruteKartlagNavn"));
  }

  // const harStiplet = stipletter ? "1" : "0";

  // For lagring i URL
  infoSideFeatureNavn = featureNavn; // Hm... Burde egentlig ha en enklere og strukturert identifier, som f.eks. ÅrMånedNr, f.eks. 2020februar2.
  infoSideKartlagNavn = kartlag.get("name");
  lagUrl();

  // Bare for kalender turer. Skal ikke påvirke naturstien.
  const kartlagNavn = kartlag.get("name");
  if(kartlagNavn.includes("kalender") || kartlagNavn.includes("Kalender")){

    // Idé: Lage ny feature mens man skjuler de andre kartlagene...
    // Lage feature for ruten og ikonet.

    // Sørge for at det bare er en rute som vises om gangen.
    midlertidigFeatureIconsCollection.clear();
    midlertidigFeatureCollection.clear();

    const midlertidigFeatureIkon = hentIkonForRute(feature, vektorlagKalenderRuter2021Ikoner);
    const midlertidigFeature = feature;
    // console.log(midlertidigFeatureIkon);
    // console.log(midlertidigFeature);

    // Stemmer det! Stiplet-ruter har ikke ikon mer. Derfor blir midlertidigFeatureIkon null.
    if(midlertidigFeatureIkon){
      midlertidigFeatureIkonKlone = midlertidigFeatureIkon.clone();
      midlertidigFeatureIkonKlone.setProperties(midlertidigFeatureIkon.getProperties());
      midlertidigFeatureIconsCollection.push(midlertidigFeatureIkonKlone);
    }

    midlertidigFeatureKlone = midlertidigFeature.clone();
    midlertidigFeatureKlone.setProperties(midlertidigFeature.getProperties());

    // Ekstra sjekk? ... Prøve igjen hvis den er null?
    if(!midlertidigFeatureKlone){
      midlertidigFeatureIkonKlone = feature.clone();
      midlertidigFeatureKlone.setProperties(feature.getProperties());
    }

    midlertidigFeatureCollection.push(midlertidigFeatureKlone);

    // Hm, for å vise alle stiplet-rutene samtidig med hovedturen, legge de til i midlertidigFeatureCollection bare?

    if(stipletter){
      for(var i = 0; i < stipletter.length; i++){
        const stiplet = stipletter[i];
        const stipletKlone = stiplet.clone();
        stipletKlone.setProperties(stiplet.getProperties());
        // Sette selected stil for stiplettene
        // Hm, midlertidg fiks? Men foreløpig tror jeg det skal gå bra. Setter select stil her,
        // også blir stiplettene lagt til i selectionList i selectRute().
        settFeatureSelectionStiler(stipletKlone, vektorLagMidlertidig);
        midlertidigFeatureCollection.push(stipletKlone);
      }
    }

    selectRute(midlertidigFeatureKlone, vektorLagMidlertidig, stipletter);

    if(!kalenderOpacityErLagret){
      kalenderOpacityErLagret = true;
      kalenderTurerSisteOpacity = vektorLagKalenderRuter2021.getOpacity();
      // console.log("visFeatureInfoSide ~ henter opacity fra vektorLagKalenderRuter2021. kalenderTurerSisteOpacity: " + kalenderTurerSisteOpacity);
      vektorLagKalenderRuter2021.setOpacity(0);
      vektorlagKalenderRuter2021Ikoner.setOpacity(0);
    }

    kalenderTurerErSkjult = true; // Sørger for at tilbakestillMidlertidigeKartlag() ikke trigger for tidlig.

    // Er kalendertur

  // Plausible Analytics
  try{
    plausible('Åpnet info side for kalendertur', {
      props: {
        infoSide_kalendertur: featureNavn
      }
    })
  }catch(e){
    console.log(e);
  }

  } else {
    // Er natursti

  // Plausible Analytics
  try{
    plausible('Åpnet info side for natursti', {
      props: { 
        infoSide_natursti: featureNavn
      }
    })
  }catch(e){
    console.log(e);
  }

  }
  
  // Åpne hovedvinduet hvis det er skjult (hidden).
  if(aapneHovedMeny && !hovedVinduVises){
    aapneHovedVindu();
  }
  // For desktop
  if(!hovedVinduVisesPaaDesktop) visHovedMenyPaaDesktop(true);

  // Oppdatere HTML elementer med feature info.

  kartMenySideKlikk("divMenyKart", true, aapneHovedMeny);

  const elFeatureInfoTittel = document.getElementById("featureInfoTittel");
  const elFeatureHovedBilde = document.getElementById("featureHovedBilde");
  const elFeatureInfoGrad = document.getElementById("featureInfoGrad");
  const elFeatureLengde = document.getElementById("featureLengde");
  //
  const elFeatureGradTekst = document.getElementById("featureGradTekst");
  const elFeatureTurTypeTekst = document.getElementById("featureTurTypeTekst");
  const elFeatureSkaper = document.getElementById("featureSkaper");
  const elFeatureTransport = document.getElementById("featureTransport");
  const elFeatureIngress = document.getElementById("featureIngress");
  const elFeatureTurType = document.getElementById("featureTurType");
  const elFeatureMaanedFraTil = document.getElementById("featureMaanedFraTil");
  const elFeatureBeskrivelse = document.getElementById("featureBeskrivelse");
  //
  const elFeatureTagsContainer = document.getElementById("featureTagsContainer");
  const elFeatureBilder = document.getElementById("featureBilder");
  const elFeatureIngressContainer = document.getElementById("featureIngressContainer");
  const elFeatureTransportContainer = document.getElementById("featureTransportContainer");
  const elFeatureBeskrivelseContainer = document.getElementById("featureBeskrivelseContainer");
  const elFeatureTurenVidereContainer = document.getElementById("featureTurenVidereContainer");
  const elFeatureSkaperContainer = document.getElementById("featureSkaperContainer");
  const elFeatureSkaperOrganisasjon = document.getElementById("featureSkaperOrganisasjon");
  //
  const elFeatureTurenVidere = document.getElementById("featureTurenVidere");
  // Lyd
  const elFeatureLydContainer = document.getElementById("featureLydContainer");
  const elFeatureLyd = document.getElementById("featureLyd");
  // const elFeatureLydKilde = document.getElementById("featureLydKilde");

  elFeatureInfoTittel.innerHTML = featureNavn;
  elFeatureHovedBilde.src = feature.get("bilde_url");
  elFeatureHovedBilde.onerror = function(){
    elFeatureHovedBilde.style.display = "none";
  }
  elFeatureHovedBilde.onload = function(){
    elFeatureHovedBilde.style.display = "block";
  }

  const kartlagType = feature.get("kartlagType");
  if(kartlagType){
    if(kartlagType == "natursti"){
      elFeatureTagsContainer.style.display = "none";
    } else {
      // Vis for kalender ruter.
      elFeatureTagsContainer.style.display = "flex";
    }
  } else {
      // Hvis kartlagType ikke er definert, vis by default.
      elFeatureTagsContainer.style.display = "flex";
  }

  const grad = feature.get("grad");
  const turType = feature.get("tur_type");

  const ikonData = hentRiktigTurIkonPlassering(grad, turType);
  const ikonPlassering = ikonData[0];
  const ikonType = ikonData[1];
  const endeligTurType = ikonType[0];
  const endeligGrad = ikonType[1];
  // console.log("ikonPlassering: " + ikonPlassering + ", ikonType: " + ikonType);

  // For featureGradTypeTekst
  let tagTurType = "";
  let tagTurGrad = "";
  let gradFarge = "";

  // For featureInfoGrad
  let turTypeStreng = "";
  let vanskelighetsgradStreng = "";

  switch(endeligTurType){
    case "0": turTypeStreng += "Tur av ukjent type"; tagTurType = ""; break;
    case "1": turTypeStreng += "Skituren"; tagTurType = "Skitur"; break;
    case "2": turTypeStreng += "Gåturen"; tagTurType = "Gåtur"; break;
    case "3": turTypeStreng += "Sykkelturen"; tagTurType = "Sykkeltur"; break;
    case "4": turTypeStreng += "Kanoturen"; tagTurType = "Kanotur"; break;
    case "9": turTypeStreng += "Turen"; tagTurType = ""; break;
  }
  switch(endeligGrad){
    case "0": vanskelighetsgradStreng += ' har ukjent vanskelighetsgrad'; tagTurGrad = ''; break;
    case "1": vanskelighetsgradStreng += ' har vanskelighetsgraden: "Enkel"'; tagTurGrad = 'Enkel'; gradFarge = "#58D68D"; break;
    case "2": vanskelighetsgradStreng += ' har vanskelighetsgraden: "Middels"'; tagTurGrad = 'Middels'; gradFarge = "#F4D03F"; break;
    case "3": vanskelighetsgradStreng += ' har vanskelighetsgraden: "Vanskelig"'; tagTurGrad = 'Vanskelig'; gradFarge = "#EC7063"; break;
    case "4": vanskelighetsgradStreng += ' har vanskelighetsgraden: "Lars Monsen"'; tagTurGrad = 'Lars Monsen'; gradFarge = "#9370DB"; break;
    case "9": vanskelighetsgradStreng += ' har den høyeste vanskelighetsgraden: "Fridjof Nansen"'; tagTurGrad = 'Fridjof Nansen'; gradFarge = "#87CEEB"; break;
  }

  elFeatureInfoGrad.src = ikonPlassering;
  elFeatureInfoGrad.title = turTypeStreng + vanskelighetsgradStreng;

  if(tagTurGrad != ""){
    elFeatureGradTekst.innerHTML = tagTurGrad;
    elFeatureGradTekst.style.backgroundColor = gradFarge;
    elFeatureGradTekst.style.display = "block";
  } else {
    elFeatureGradTekst.style.display = "none";
  }

  if(tagTurType != ""){
    elFeatureTurTypeTekst.innerHTML = tagTurType;
    elFeatureTurTypeTekst.style.display = "block";
  } else {
    elFeatureTurTypeTekst.style.display = "none";
  }

  // Hm, gjøre dette til en fellesfunksjon? Å hente koordinater fra start_3857.
  let featureStartString = feature.get("start_3857");
  if(!featureStartString) featureStartString = feature.get("koordinater"); // Hvis ikke start_3857 er definert, sjekk "koordinater":
  // console.log(featureStartString);
  try{
    var coordinates3857String = featureStartString.split(",");
    var coordinates3857x = parseFloat(coordinates3857String[0]);
    var coordinates3857y = parseFloat(coordinates3857String[1]);
    featureStartKoordinater = [
      parseFloat(coordinates3857x), parseFloat(coordinates3857y)
    ];
    // console.log("featureStartKoordinater: " + featureStartKoordinater);
  } catch(e){
    console.log("Klarte ikke hente koordinater fra featureStartString");
  }

  elFeatureLengde.innerHTML = feature.get("lengdeKm") + " km";

  const lagetAv = feature.get("laget_av");
  const organisasjon = feature.get("organisasjon");
  const ingress = feature.get("ingress");
  const transport = feature.get("transport");
  const hovedbilde = feature.get("hoved_bilde");
  const bilder = feature.get("bilder");
  const tur_type = feature.get("tur_type");
  const tekst = feature.get("tekst"); // beskrivelsen
  const merket = feature.get("merket");
  const maanedfra = feature.get("maanedfra");
  const maanedtil = feature.get("maanedtil");
  const grad_nr = feature.get("grad_nr"); // Samme som graden, men som tall / integer.
  const overskrift = feature.get("overskrift"); // Som regel samme som "NAVN".
  //
  const turenVidere = feature.get("turen_videre");
  const lyd = feature.get("lyd");

  // console.log("maanedfra: " + maanedfra + ", maanedtil: " + maanedtil);

  if(maanedfra && maanedtil){
    let maanedfraStreng = "";
    let maanedtilStreng = "";
    switch(String(maanedfra)){
      case "1": maanedfraStreng = "Jan"; break;
      case "2": maanedfraStreng = "Feb"; break;
      case "3": maanedfraStreng = "Mar"; break;
      case "4": maanedfraStreng = "Apr"; break;
      case "5": maanedfraStreng = "Mai"; break;
      case "6": maanedfraStreng = "Jun"; break;
      case "7": maanedfraStreng = "Jul"; break;
      case "8": maanedfraStreng = "Aug"; break;
      case "9": maanedfraStreng = "Sep"; break;
      case "10": maanedfraStreng = "Okt"; break;
      case "11": maanedfraStreng = "Nov"; break;
      case "12": maanedfraStreng = "Des"; break;
    }
    switch(String(maanedtil)){
      case "1": maanedtilStreng = "Jan"; break;
      case "2": maanedtilStreng = "Feb"; break;
      case "3": maanedtilStreng = "Mar"; break;
      case "4": maanedtilStreng = "Apr"; break;
      case "5": maanedtilStreng = "Mai"; break;
      case "6": maanedtilStreng = "Jun"; break;
      case "7": maanedtilStreng = "Jul"; break;
      case "8": maanedtilStreng = "Aug"; break;
      case "9": maanedtilStreng = "Sep"; break;
      case "10": maanedtilStreng = "Okt"; break;
      case "11": maanedtilStreng = "Nov"; break;
      case "12": maanedtilStreng = "Des"; break;
    }
    if(maanedfraStreng != "" && maanedtilStreng != ""){
      elFeatureMaanedFraTil.innerHTML = maanedfraStreng + " - " + maanedtilStreng;
      elFeatureMaanedFraTil.style.display = "block";
    } else {
      elFeatureMaanedFraTil.innerHTML = "";
      elFeatureMaanedFraTil.style.display = "none";
    }
  } else {
    elFeatureMaanedFraTil.innerHTML = "";
    elFeatureMaanedFraTil.style.display = "none";
  }

  // elFeatureSkaper.innerHTML = lagetAv ? lagetAv : "";
  elFeatureIngress.innerText = ingress;
  elFeatureIngressContainer.style.display = ingress ? "block" : "none";

  elFeatureTransport.innerText = transport;
  elFeatureTransportContainer.style.display = transport ? "block" : "none";

  elFeatureBeskrivelse.innerText = tekst;
  elFeatureBeskrivelseContainer.style.display = tekst ? "block" : "none";

  elFeatureSkaperContainer.style.display = (!lagetAv && !organisasjon) ? "none" : "block";

  elFeatureSkaper.innerText = lagetAv;
  elFeatureSkaper.style.display = lagetAv ? "block" : "none";
  // elFeatureSkaperContainer.style.display = lagetAv ? "block" : "none";

  elFeatureSkaperOrganisasjon.innerText = organisasjon;
  elFeatureSkaperOrganisasjon.style.display = organisasjon ? "block" : "none";
  elFeatureSkaperOrganisasjon.style.paddingTop = (organisasjon && lagetAv) ? "4px" : "0px";
  elFeatureSkaperOrganisasjon.style.fontSize = (organisasjon && !lagetAv) ? "medium" : "small";

  ////

  elFeatureTurenVidere.innerText = turenVidere;
  elFeatureTurenVidereContainer.style.display = turenVidere ? "block" : "none";

  // Lyd
  elFeatureLydContainer.style.display = lyd ? "block" : "none";
  if(lyd){
    elFeatureLyd.load();
    elFeatureLyd.src = lyd;
  }

}

function featureTilbakeKnappFunksjon(aapneMeny){
  // console.log("featureTilbakeKnappFunksjon kjører");
  kartMenySideKlikk("divMenyKart", false, aapneMeny);
  hovedVindu.scrollTop = 0; // Scroller til toppen.
  // Reset infoSide variabler:
  infoSideFeatureNavn = undefined;
  infoSideKartlagNavn = undefined;
  lagUrl();
  // Obs! Må de-selecte den aktive ruten.
  if(featureHoverSelectKjorer){
    // Tømme de midlertidige kartlagene
    tilbakestillMidlertidigeKartlag();
    // nullstillFeatureSelection();
    nullstillFeatureClickSelection();
  }
}

function featureFinnKnappFunksjon(){
  console.log("finnKnapp klikket!");
    // For å sette view over center av feature.
    // Teste ut med .getExtent.getCenter() eller noe? Se fane/post om det.
    if(featureStartKoordinater){
    // map.getView().setCenter(e.coordinate);
    map.getView().animate(
      {
        zoom: map.getView().getZoom(),
        center: featureStartKoordinater,
        duration: 500
      },
    );
    }
}

/* HOVEDMENY NAVIGASJON SLUTT */