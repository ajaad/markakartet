
// Global map variabel her, siden map vil uansett bli brukt på forskjellige sider.
var map;

// For å sjekke dependencies
let popupKjorer = false;
let featureHoverSelectKjorer = false;
let KartKjorer = false;

let debugHandler;

// Bruke til alle slags feilmeldinger?
let debugGPSContainer = document.getElementById("debugGPSContainer");
var debugGPS = document.getElementById("debugGPS"); // Teksten

function fadeInnogUtDebugMelding(melding, varighet){
    debugGPS.innerHTML = melding;
    debugGPSContainer.classList.remove("opacity0");
    debugGPSContainer.classList.add("opacity1");
    if(debugHandler) clearTimeout(debugHandler); // Kansellere pågående timer
    debugHandler = setTimeout(() => {
      debugGPSContainer.classList.remove("opacity1");
      debugGPSContainer.classList.add("opacity0");
  }, varighet);
}

// Gjøre slik at /skole kan hente dataen
const loc = window.location;
// console.log(loc);

const origin = loc.origin;
// console.log("origin: " + origin);

// NOTAT: origin funker dårlig med github-page addressen for testsiden.

var originWithSlash = origin + "/";
// console.log("origin with slash: " + originWithSlash);

var isGithubSite = originWithSlash.includes("github.io");
// console.log("isGithubSite: " + isGithubSite);

if(isGithubSite){
    originWithSlash += "markakartet_dev/";
    // console.log("fixed origin for github.io: " + originWithSlash);
}

const erMarkakartetDomene = originWithSlash.includes("markakartet.no");
if(erMarkakartetDomene){
    console.log("Du er nå på markakartet.no");
}

// Definer disse her.

let ikonPlassering = "";

if(isGithubSite){
    ikonPlassering = originWithSlash + "/images/";
} else if(erMarkakartetDomene){
    ikonPlassering = "/images/";
} else {
    ikonPlassering = "../images/";
}

// Både vanskelighetsgrad og tur type
let ikonUkjentGradOgType = ikonPlassering + "tur-ikoner-ukjent-grad-og-type.png";

let ikonUkjentLett = ikonPlassering + "tur-ikoner-ukjent-1-lett.png";
let ikonUkjentMiddels = ikonPlassering + "tur-ikoner-ukjent-2-middels.png";
let ikonUkjentVanskelig = ikonPlassering + "tur-ikoner-ukjent-3-vanskelig.png";
let ikonUkjentLarsMonsen = ikonPlassering + "tur-ikoner-ukjent-4-lars-monsen.png";
let ikonUkjentFridjofNansen = ikonPlassering + "tur-ikoner-ukjent-9-fridjof-nansen.png";

let ikonGaaUkjent = ikonPlassering + "tur-ikoner-gaa-0-ukjent.png";
let ikonGaaLett = ikonPlassering + "tur-ikoner-gaa-1-lett.png";
let ikonGaaMiddels = ikonPlassering + "tur-ikoner-gaa-2-middels.png";
let ikonGaaVanskelig = ikonPlassering + "tur-ikoner-gaa-3-vanskelig.png";
let ikonGaaLarsMonsen = ikonPlassering + "tur-ikoner-gaa-4-lars-monsen.png";
let ikonGaaFridjofNansen = ikonPlassering + "tur-ikoner-gaa-9-fridjof-nansen.png";

let ikonSykkelUkjent = ikonPlassering + "tur-ikoner-sykkel-0-ukjent.png";
let ikonSykkelLett = ikonPlassering + "tur-ikoner-sykkel-1-lett.png";
let ikonSykkelMiddels = ikonPlassering + "tur-ikoner-sykkel-2-middels.png";
let ikonSykkelVanskelig = ikonPlassering + "tur-ikoner-sykkel-3-vanskelig.png";
let ikonSykkelLarsMonsen = ikonPlassering + "tur-ikoner-sykkel-4-lars-monsen.png";
let ikonSykkelFridjofNansen = ikonPlassering + "tur-ikoner-sykkel-9-fridjof-nansen.png";

let ikonSkiUkjent = ikonPlassering + "tur-ikoner-ski-0-ukjent.png";
let ikonSkiLett = ikonPlassering + "tur-ikoner-ski-1-lett.png";
let ikonSkiMiddels = ikonPlassering + "tur-ikoner-ski-2-middels.png";
let ikonSkiVanskelig = ikonPlassering + "tur-ikoner-ski-3-vanskelig.png";
let ikonSkiLarsMonsen = ikonPlassering + "tur-ikoner-ski-4-lars-monsen.png";
let ikonSkiFridjofNansen = ikonPlassering + "tur-ikoner-ski-9-fridjof-nansen.png";

let ikonKanoUkjent = ikonPlassering + "tur-ikoner-kano-0-ukjent.png";
let ikonKanoLett = ikonPlassering + "tur-ikoner-kano-1-lett.png";
let ikonKanoMiddels = ikonPlassering + "tur-ikoner-kano-2-middels.png";
let ikonKanoVanskelig = ikonPlassering + "tur-ikoner-kano-3-vanskelig.png";
let ikonKanoLarsMonsen = ikonPlassering + "tur-ikoner-kano-4-lars-monsen.png";
let ikonKanoFridjofNansen = ikonPlassering + "tur-ikoner-kano-9-fridjof-nansen.png";

let ikonTriUkjent = ikonPlassering + "tur-ikoner-tri-0-ukjent.png";
let ikonTriLett = ikonPlassering + "tur-ikoner-tri-1-lett.png";
let ikonTriMiddels = ikonPlassering + "tur-ikoner-tri-2-middels.png";
let ikonTriVanskelig = ikonPlassering + "tur-ikoner-tri-3-vanskelig.png";
let ikonTriLarsMonsen = ikonPlassering + "tur-ikoner-tri-4-lars-monsen.png";
let ikonTriFridjofNansen = ikonPlassering + "tur-ikoner-tri-9-fridjof-nansen.png";

// Tursti-ikoner

let ikonTurstiUkjent = ikonUkjentLett; // Grønn og spørsmålstegn
let ikonTursti1 = ikonPlassering + "tursti-ikoner-blue-sky-light-1.png";
let ikonTursti2 = ikonPlassering + "tursti-ikoner-blue-sky-light-2.png";
let ikonTursti3 = ikonPlassering + "tursti-ikoner-blue-sky-light-3.png";
let ikonTursti4 = ikonPlassering + "tursti-ikoner-blue-sky-light-4.png";
let ikonTursti5 = ikonPlassering + "tursti-ikoner-blue-sky-light-5.png";
let ikonTursti6 = ikonPlassering + "tursti-ikoner-blue-sky-light-6.png";
let ikonTursti7 = ikonPlassering + "tursti-ikoner-blue-sky-light-7.png";
let ikonTursti8 = ikonPlassering + "tursti-ikoner-blue-sky-light-8.png";
let ikonTursti9 = ikonPlassering + "tursti-ikoner-blue-sky-light-9.png";
let ikonTursti10 = ikonPlassering + "tursti-ikoner-blue-sky-light-10.png";
let ikonTursti11 = ikonPlassering + "tursti-ikoner-blue-sky-light-11.png";
let ikonTursti12 = ikonPlassering + "tursti-ikoner-blue-sky-light-12.png";
let ikonTursti13 = ikonPlassering + "tursti-ikoner-blue-sky-light-13.png";
let ikonTursti14 = ikonPlassering + "tursti-ikoner-blue-sky-light-14.png";
let ikonTursti15 = ikonPlassering + "tursti-ikoner-blue-sky-light-15.png";

// Egen funksjon til å returnere riktig ikon plassering.
// Hm... Returnere to ting: [plassering, gradOgTurType]
function hentRiktigTurIkonPlassering(grad, turType){
    // console.log("hentRiktigTurIkonPlassering ~ grad: " + grad + ", turType: " + turType);

    // try catch i tilfelle grad og turType ikke er integers. Ved feil defaulter den til ukjent grad og type.
    // Hm... Trenger egentlig ikke konvertere dem til integers - kan bare lese strengverdien.
    let endeligGrad = "0";
    let endeligTurType = "0";
    let endeligTurTypeOgGrad = "";

    // Support for både tall og tekstbeskrivelse av tur type.
    if (turType != null) {
      turType = String(turType);
      switch (turType) {
        case "0": case "ukjent": endeligTurType = "0"; endeligTurTypeOgGrad += "ukjent"; break;
        case "1": case "skitur": endeligTurType = "1"; endeligTurTypeOgGrad += "ski"; break;
        case "2": case "fottur": endeligTurType = "2"; endeligTurTypeOgGrad += "gaa"; break;
        case "3": case "sykkeltur": endeligTurType = "3"; endeligTurTypeOgGrad += "sykkel"; break;
        case "4": case "kanotur": endeligTurType = "4"; endeligTurTypeOgGrad += "kano"; break;
        case "9": case "annet": endeligTurType = "9"; endeligTurTypeOgGrad += "tri"; break;
        default: endeligTurType = "0"; endeligTurTypeOgGrad += "ukjent"; break;
      }
    } else {
        endeligTurTypeOgGrad += "ukjent";
    }
    // Support for både tall og tekstbeskrivelse av grad.
    if (grad != null) {
        grad = String(grad);
        switch (grad) {
          case "0": case "ukjent": endeligGrad = "0"; endeligTurTypeOgGrad += "Ukjent"; break;
          case "1": case "lett": endeligGrad = "1"; endeligTurTypeOgGrad += "Lett"; break;
          case "2": case "middels": endeligGrad = "2"; endeligTurTypeOgGrad += "Middels"; break;
          case "3": case "vanskelig": endeligGrad = "3"; endeligTurTypeOgGrad += "Vanskelig"; break;
          case "4": case "lars_monsen": endeligGrad = "4"; endeligTurTypeOgGrad += "LarsMonsen"; break;
          case "9": case "fridjof_nansen": endeligGrad = "9"; endeligTurTypeOgGrad += "FridjofNansen"; break;
          default: endeligGrad = "0"; endeligTurTypeOgGrad += "Ukjent"; break;
        }
    } else {
        endeligTurTypeOgGrad += "Ukjent";
    }

    // console.log("endeligTurTypeOgGrad: " + endeligTurTypeOgGrad);

    // Returnerer endelig ikon. Hvis ingen switch statements passer, så vil den defaulte til ikonUkjentGradOgType.
    switch (endeligTurType) {
      case "0": // ukjent tur type
        switch (endeligGrad) {
          case "0": return [ikonUkjentGradOgType, [endeligTurType, endeligGrad]];
          case "1": return [ikonUkjentLett, [endeligTurType, endeligGrad]];
          case "2": return [ikonUkjentMiddels, [endeligTurType, endeligGrad]];
          case "3": return [ikonUkjentVanskelig, [endeligTurType, endeligGrad]];
          case "4": return [ikonUkjentLarsMonsen, [endeligTurType, endeligGrad]];
          case "9": return [ikonUkjentFridjofNansen, [endeligTurType, endeligGrad]];
        }
        break;
      case "1": // skitur
        switch (endeligGrad) {
          case "0": return [ikonSkiUkjent, [endeligTurType, endeligGrad]];
          case "1": return [ikonSkiLett, [endeligTurType, endeligGrad]];
          case "2": return [ikonSkiMiddels, [endeligTurType, endeligGrad]];
          case "3": return [ikonSkiVanskelig, [endeligTurType, endeligGrad]];
          case "4": return [ikonSkiLarsMonsen, [endeligTurType, endeligGrad]];
          case "9": return [ikonSkiFridjofNansen, [endeligTurType, endeligGrad]];
        }
        break;
      case "2": // gåtur
        switch (endeligGrad) {
          case "0": return [ikonGaaUkjent, [endeligTurType, endeligGrad]];
          case "1": return [ikonGaaLett, [endeligTurType, endeligGrad]];
          case "2": return [ikonGaaMiddels, [endeligTurType, endeligGrad]];
          case "3": return [ikonGaaVanskelig, [endeligTurType, endeligGrad]];
          case "4": return [ikonGaaLarsMonsen, [endeligTurType, endeligGrad]];
          case "9": return [ikonGaaFridjofNansen, [endeligTurType, endeligGrad]];
        }
        break;
      case "3": // sykkeltur
        switch (endeligGrad) {
          case "0": return [ikonSykkelUkjent, [endeligTurType, endeligGrad]];
          case "1": return [ikonSykkelLett, [endeligTurType, endeligGrad]];
          case "2": return [ikonSykkelMiddels, [endeligTurType, endeligGrad]];
          case "3": return [ikonSykkelVanskelig, [endeligTurType, endeligGrad]];
          case "4": return [ikonSykkelLarsMonsen, [endeligTurType, endeligGrad]];
          case "9": return [ikonSykkelFridjofNansen, [endeligTurType, endeligGrad]];
        }
        break;
      case "4": // kanotur
        switch (endeligGrad) {
          case "0": return [ikonKanoUkjent, [endeligTurType, endeligGrad]];
          case "1": return [ikonKanoLett, [endeligTurType, endeligGrad]];
          case "2": return [ikonKanoMiddels, [endeligTurType, endeligGrad]];
          case "3": return [ikonKanoVanskelig, [endeligTurType, endeligGrad]];
          case "4": return [ikonKanoLarsMonsen, [endeligTurType, endeligGrad]];
          case "9": return [ikonKanoFridjofNansen, [endeligTurType, endeligGrad]];
        }
        break;
      case "9": // annet (ikon for triatlon)
        switch (endeligGrad) {
          case "0": return [ikonTriUkjent, [endeligTurType, endeligGrad]];
          case "1": return [ikonTriLett, [endeligTurType, endeligGrad]];
          case "2": return [ikonTriMiddels, [endeligTurType, endeligGrad]];
          case "3": return [ikonTriVanskelig, [endeligTurType, endeligGrad]];
          case "4": return [ikonTriLarsMonsen, [endeligTurType, endeligGrad]];
          case "9": return [ikonTriFridjofNansen, [endeligTurType, endeligGrad]];
        }
        break;
    }

    return [ikonUkjentGradOgType, [endeligTurType, endeligGrad]];
}

function hentTurstiIkonForPostnr(postnr){
    switch(postnr){
        case 1: case "1": return ikonTursti1;
        case 2: case "2": return ikonTursti2;
        case 3: case "3": return ikonTursti3;
        case 4: case "4": return ikonTursti4;
        case 5: case "5": return ikonTursti5;
        case 6: case "6": return ikonTursti6;
        case 7: case "7": return ikonTursti7;
        case 8: case "8": return ikonTursti8;
        case 9: case "9": return ikonTursti9;
        case 10: case "10": return ikonTursti10;
        case 11: case "11": return ikonTursti11;
        case 12: case "12": return ikonTursti12;
        case 13: case "13": return ikonTursti13;
        case 14: case "14": return ikonTursti14;
        case 15: case "15": return ikonTursti15;
        default: return ikonTurstiUkjent;
    }
}

// URL PARAMETERE

// Definerer den her bare. Aktive kartlag fra URL:
var lagListeFraURL; // Utgått - ikke i bruk

let zoomFraUrl;
let centerFraUrl;

let infoSideFeatureNavn;
let infoSideFeatureNavnFraUrl;

let infoSideKartlagNavn;
let infoSideKartlagNavnFraUrl;

// For område feature
let omraadeFeatureFraUrl = null;
let omraadeKartlagFraUrl = null;

let infoSideStartFullfort = false;

//
var aktivtBakgrunnskart = "bakgrunnskartOSM"; // Default bakgrunnskart. Best å håndtere bakgrunnskart som en egen URL parameter...
var bakgrunnFraUrlParam = "";

// string[] med kartlag id
var aktiveKartlagListe = [];
var kartlagListeFraUrlParam = [];

function leggTilIAktiveKartlagListen(kartlagNavn){
    if(!aktiveKartlagListe.includes(kartlagNavn)){
        aktiveKartlagListe.push(kartlagNavn);
        // console.log(aktiveKartlagListe);
        lagUrl();
    }
}
// Sletter første instans funnet av kartlagNavn
function slettFraAktiveKartlagListen(kartlagNavn){
    for(var i = 0; i < aktiveKartlagListe.length; i++){
        if(kartlagNavn == aktiveKartlagListe[i]){
            aktiveKartlagListe.splice(i, 1);
            // console.log(aktiveKartlagListe);
            lagUrl();
            return;
        }
    }
}
// Fra liste til streng
function lagStrengForAktiveKartlagListen(){
    let endeligeStreng = "";
    const antallAktiveKartlag = aktiveKartlagListe.length;
    // console.log("antallAktiveKartlag: " + antallAktiveKartlag);

    for(var i = 0; i < antallAktiveKartlag; i++){
        if(i < antallAktiveKartlag - 1){
            endeligeStreng += aktiveKartlagListe[i] + ",";

        } else {
            endeligeStreng += aktiveKartlagListe[i];
        }
    }
    // console.log("endeligeStreng: " + endeligeStreng);
    return endeligeStreng;
}
// Fra streng til liste
function fyllAktiveKartlagListenFraStreng(streng){
    aktiveKartlagListe = streng.split(",");
    console.log(aktiveKartlagListe);
}

const pathName = loc.pathname;
console.log("pathName: " + pathName);

const href = window.location.href;
console.log("href: " + href);

// URL PARAMETERS

const url = window.location.search;
console.log(url);

const urlParameters = new URLSearchParams(url);
console.log(urlParameters);

for (var entry of urlParameters.entries()) {
    // console.log(entry);
    //
    switch(entry[0]){
        case "zoom":
            zoomFraUrl = parseFloat(entry[1]);
            // console.log("zoomFraUrl: " + zoomFraUrl);
            break;
        case "center":
            const koordinater = entry[1].split(",");
            centerFraUrl = [parseFloat(koordinater[0]), parseFloat(koordinater[1])];
            // console.log("centerFraUrl: " + centerFraUrl);
            break;
        case "bakgrunn":
            bakgrunnFraUrlParam = entry[1];
            // console.log("bakgrunnFraUrlParam:" + bakgrunnFraUrlParam);
            break;
        case "kartlag":
            // console.log(entry[1]);
            kartlagListeFraUrlParam = entry[1].split(",");
            // console.log(aktiveKartlagListe);
            break;
        case "infoSideFeature":
            // console.log(entry[1]);
            infoSideFeatureNavnFraUrl = entry[1];
            break;
        case "infoSideKartlag":
            // console.log(entry[1]);
            infoSideKartlagNavnFraUrl = entry[1];
            break;
    }
}

//
const DEFAULT_OPACITY = 0.8;

// Add coordinate available systems 

// 
const defaultCoordSysFull = "EPSG:4326"; // Obs! Hadde en skrivefeil her. Skal være 4326, ikke 4236!
const defaultCoordSysType = "EPSG";
const defaultCoordSysCode = "4326";

const defaultX = 10.74758;
const defaultY = 59.91271;

const defaultZoom = 9;
const defaultFeatureSize = 1000;
// const defaultFargen = "rgba(18, 153, 75, 0.75)"; // Markakart-fargen med litt alpha.
const defaultFargen = "rgba(12, 119, 93, 0.75)"; // Markakart-fargen med litt alpha.

proj4.defs("EPSG:25831", "+proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs");
proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs");
proj4.defs("EPSG:25833", "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs");
// 
proj4.defs("EPSG:32633", "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs");

ol.proj.proj4.register(proj4);

// WGS 84 / Pseudo-Mercator is used in the view
// ... Men hvorfor brukes denne og ikke koordinatsystemet som er valgt?
// Oh... proj4 konverterer et koordinatsystem til et annet.
// F.eks. proj4(coordSys, viewProjection, [finalX,finalY])
// Konverterer her fra f.eks. EPSG:4326 til EPSG:3857 for punkt x,y.
var viewProjection = 'EPSG:3857'; // <--- Brukes i kartFunksjoner, og ? ...
var coordSysPseudoMercator = "EPSG:3857";

/// projection extent er nødvendig for enkelte wmts lag.
let projectionExtent = [364800, 7884645, 1600315, 9484620];

// Neutral 3: 20, 148, 175
// Neutral 4: 20, 109, 175
// Neutral 5: 20, 70, 175
// Default stiler for kartlag:
var defaultLayerStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(20, 109, 175, 0.1)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(20, 109, 175, 1)',
        width: 2
    }),
});
var defaultLayerSelectStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(20, 70, 175, 0.1)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(20, 70, 175, 1)',
        width: 2
    }),
});

// defaultLayerStyle i dashed.
var defaultLayerDashedStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(20, 109, 175, 0.1)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(20, 109, 175, 1)',
        width: 2,
        lineDash: [1.0, 5]
    }),
});
var defaultLayerDashedSelectStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(20, 70, 175, 0.1)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(20, 70, 175, 1)',
        width: 2,
        lineDash: [1.0, 5]
    }),
});

// I hvitt...
const defaultWhiteSelectStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.5)',
    }),
    stroke: new ol.style.Stroke({
        // color: 'rgba(255, 255, 255, 0.7)',
        color: 'rgba(255, 255, 255, 1)',
        width: 2
    }),
});
// Hvitt dashed.
const defaultWhiteDashedSelectStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.5)',
    }),
    stroke: new ol.style.Stroke({
        // color: 'rgba(255, 255, 255, 0.7)',
        color: 'rgba(255, 255, 255, 1)',
        width: 2,
        lineDash: [1.0, 5]
    }),
});

var defaultFargeStroke = 'rgba(0, 0, 0, 1)'; // Samme som 'black' i css...
var defaultFargeFill = 'rgba(0, 0, 0, 0.25)';

// Vector source for sirkler og sånt!
// Kan legge til features i runtime!
var vectorSourceGeometry = new ol.source.Vector({
    projection: coordSysPseudoMercator,
    // features: []
    features: new ol.Collection() // Yep. For å få dem i riktig rekkefølge!
});
// NOTE: Med ol.Collection() kan man gjøre alt + bruke
// .getFeaturesCollection().getArray() for å få features in order.

var geometryStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 100, 50, 0)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 4
    }),
});

// Vector layer for sirkler og sånt.
var vektorLagGeometri = new ol.layer.Vector({
    source: vectorSourceGeometry,
    style: geometryStyle,
    name: "vektorLagGeometri",
    // uiName: "Geometri",
    // uiName: "Former ved deling",
    uiName: "Brukerskapte former",
    visible: false
});

//

var vectorSourceGPS = new ol.source.Vector({
    projection: coordSysPseudoMercator,
    // features: []
    features: new ol.Collection() // Yep. For å få dem i riktig rekkefølge!
});

var styleGPS = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.15)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(255, 255, 255, 0.5)',
        width: 2
    }),
});
var styleSelectGPS = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.3)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.75)',
        width: 4
    }),
});

var vektorLagGPS = new ol.layer.Vector({
    source: vectorSourceGPS,
    style: styleGPS,
    stilSelect: styleSelectGPS,
    fillColorSelect: 'rgba(255, 255, 255, 0.3)',
    strokeColorSelect: 'rgba(0, 0, 0, 0.75)',
    name: "vektorLagGPS",
    uiName: "GPS",
    zIndex: 2000,
    visible: false
});

// Felles for GeoJSON vektorkildene (ol.source.Vector):

var geoJSONFormat = new ol.format.GeoJSON({
    dataProjection: "EPSG:25832",
    featureProjection: 'EPSG:3857'
});

const geoJSONFormatSwitched = new ol.format.GeoJSON({
    dataProjection: "EPSG:3857",
    featureProjection: 'EPSG:25832'
})

// Hm, idé for laging av UI kartmeny. Liste med dictionaries for gruppene som har en liste med layers.
// Kan gjøre det med bare lister også.
var kartMenyMasterListe = [];

var kartMenyLagDictGeometri = {
    lagNavn: vektorLagGeometri.get("name"),
    uiLagNavn: vektorLagGeometri.get("uiName"),
    lagReferanse: vektorLagGeometri
}

var kartMenyLagDictGPS = {
    lagNavn: vektorLagGPS.get("name"),
    uiLagNavn: vektorLagGPS.get("uiName"),
    lagReferanse: vektorLagGPS
}
// OBS! Disse vises i kartmeny-UI!
var kartMenyGruppeDictGeometri = {
    gruppeNavn: "Geometri",
    uiGruppeNavn: "Brukerformer",
    kartMenyLag: [
        kartMenyLagDictGeometri,
        // kartMenyLagDictGPS
    ]
}
// OBS! Disse vises i kart-objektet!
var mapGruppeGeometri = new ol.layer.Group({
    name: kartMenyGruppeDictGeometri["gruppeNavn"],
    opacity: 1,
    visible: true,
    layers: [
        // vektorLagGeometri, // NOTE: Ikke i bruk nå?
        vektorLagGPS,
        //
        // vektorLagMidlertidig,
        // vektorLagMidlertidigIkoner,
    ]
  });

////////////////////////////////////////////////////////////////////////
// BAKGRUNNSKART
////////////////////////////////////////////////////////////////////////

// Skjønner ikke helt... Er alle disse av samme type?
// Hvor blir de brukt?

// WMS?
// http://openwms.statkart.no/skwms1/wms.toporaster4?version=1.3.0&service=wms&request=getcapabilities
// https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer?service=wms&request=getcapabilities 

// WMTS?
// https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities

var dataTopo4WMTS = ["WMTSlayer", {
    capabilURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities",
    kartlagWMTS: "topo4",
    opacity: 1,
    //
    name: "dataTopo4WMTS",
    visible: false
}];

var dataTopo4WMTSgra = ["WMTSlayer", {
    capabilURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities",
    kartlagWMTS: "topo4graatone",
    opacity: 1,
    //
    name: "dataTopo4WMTSgra",
    visible: false
}];

var dataNorgeIBilderWMTS = ["WMTSlayer", {
    capabilURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities",
    kartlagWMTS: "Nibcache_web_mercator_v2",
    opacity: 1,
    name: "dataNorgeIBilderWMTS",
    visible: false
}];

var enkelBakgrunnWMTS = ["WMTSlayer", {
    capabilURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities",
    kartlagWMTS: "bakgrunnskart_forenklet",
    opacity: 1,
    name: "enkelBakgrunnWMTS",
    visible: false
}];

var dataToporaster4Tiled = ["Tilelayer", {
    kartlag: new ol.layer.Tile({
        extent: projectionExtent,
        source: new ol.source.TileWMS({
            url: "http://openwms.statkart.no/skwms1/wms.toporaster4",
            params: { 'LAYERS': "toporaster", 'TILED': true },
            serverType: 'geoserver',
            // Countries have transparency, so do not fade tiles:
            transition: 1,
            //
            name: "dataToporaster4Tiled",
            visible: false
        })
    })
}
];

var dataToporaster4 = ["WMSlayer", {
    url: "http://openwms.statkart.no/skwms1/wms.toporaster4",
    name: "toporaster",
    opacity: 0.7
}];

var dataNorgeibilder = ["WMSlayer", {
    url: "https://wms.geonorge.no/skwms1/wms.nib",
    name: "ortofoto",
    opacity: 1
}];

var dataAr50 = ["WMSlayer", {
    url: "https://wms.nibio.no/cgi-bin/ar50",
    name: "ar50",
    opacity: 1
}];

var dataOSM = ["Tilelayer", {
    kartlag: new ol.layer.Tile({
        source: new ol.source.OSM(),
        // Kan jeg sette navnet her? ...
        name: "dataOSM",
        visible: false
    })
}
];

// EE: Lage VectorLayers her.

var bakgrunnskartTopo4;
var bakgrunnskartTopoGraa;
var bakgrunnskartNorgeIBilder;
var bakgrunnskartEnkel;

var dataDictWMTS = {
    "dataTopo4WMTS": {
        capabilityURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities",
        kartlagWMTS: "topo4",
        name: "dataTopo4WMTS",
        kartlagNavn: "bakgrunnskartTopo4",
        opacity: 1,
        visible: false
    },
    "dataTopo4WMTSgraa": {
        capabilityURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities",
        kartlagWMTS: "topo4graatone",
        name: "dataTopo4WMTSgraa",
        kartlagNavn: "bakgrunnskartTopoGraa",
        opacity: 1,
        visible: false
    },
    "dataNorgeIBilderWMTS": {
        capabilityURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities",
        kartlagWMTS: "Nibcache_web_mercator_v2",
        name: "dataNorgeIBilderWMTS",
        kartlagNavn: "bakgrunnskartNorgeIBilder",
        opacity: 1,
        visible: false
    },
    "dataEnkelBakgrunnWMTS": {
        capabilityURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities",
        kartlagWMTS: "bakgrunnskart_forenklet",
        name: "dataEnkelBakgrunnWMTS",
        kartlagNavn: "bakgrunnskartEnkel",
        opacity: 1,
        visible: false
    },
}

var bakgrunnskartOSM = new ol.layer.Tile({
    source: new ol.source.OSM(),
    // Kan jeg sette navnet her? ...
    name: "bakgrunnskartOSM",
    visible: false
});

// EE

// OBS! For WMS lag så bør lagNavn og uiLagNavn defineres her, pga. lagene er ikke klare enda.
var kartMenyLagDictOSM = {
    lagNavn: "bakgrunnskartOSM",
    uiLagNavn: "OpenStreetMap (OSM)",
    lagReferanse: bakgrunnskartOSM
}
var kartMenyLagDictTopo4 = {
    lagNavn: "bakgrunnskartTopo4",
    uiLagNavn: "Topografisk",
    lagReferanse: bakgrunnskartTopo4
}
var kartMenyLagDictTopo4Graa = {
    lagNavn: "bakgrunnskartTopoGraa",
    uiLagNavn: "Topografisk, grå",
    lagReferanse: bakgrunnskartTopoGraa
}
var kartMenyLagDictNorgeIBilder = {
    lagNavn: "bakgrunnskartNorgeIBilder",
    uiLagNavn: "Satelittbilder",
    lagReferanse: bakgrunnskartNorgeIBilder
}
var kartMenyLagDictEnkel = {
    lagNavn: "bakgrunnskartEnkel",
    uiLagNavn: "Forenklet",
    lagReferanse: bakgrunnskartEnkel
}
// OBS! Disse vises i kartmeny-UI!
var kartMenyGruppeDictBakgrunnskart = {
    gruppeNavn: "Bakgrunnskart",
    uiGruppeNavn: "Bakgrunnskart",
    kartMenyLag: [
        kartMenyLagDictOSM,
        kartMenyLagDictNorgeIBilder,
        kartMenyLagDictTopo4,
        kartMenyLagDictTopo4Graa,
        kartMenyLagDictEnkel
    ]
}
// OBS! Disse vises i map-objektet!
var mapGruppeBakgrunnskart = new ol.layer.Group({
    name: kartMenyGruppeDictBakgrunnskart["gruppeNavn"],
    opacity: 1,
    visible: true,
    layers: [
        bakgrunnskartOSM
    ]
  });


////////////////////////////////////////////////////////////////////////
// VERNEFORSLAG
////////////////////////////////////////////////////////////////////////

var foreslatteLVOdata = ["GeoJSONdata", {
    dataName: "foreslatteLVOdata",
    data: originWithSlash + "data/foreslatteLVO.geojson",
    strokeColor: [0,0,0, 1],
    fillColor: [230, 230, 75, 1],
    strokeWidth: 1,
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 1
}];
settFargerForLagData(foreslatteLVOdata, foreslatteLVOdata[1]["fillColor"]);

var foreslatteFLOdata = ["GeoJSONdata", {
    dataName: "foreslatteFLOdata",
    data: originWithSlash + "data/foreslatteFLO.geojson",
    strokeColor: [0,0,0, 1],
    fillColor: [255, 185, 40, 1],
    strokeWidth: 1,
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 1,
}];
settFargerForLagData(foreslatteFLOdata, foreslatteFLOdata[1]["fillColor"]);

var reservatKandidatData = ["GeoJSONdata", {
    dataName: "reservatKandidatData",
    data: originWithSlash + "data/reservatkandidater.geojson",
    strokeColor: [0, 0, 0, 1],
    fillColor: [230, 80, 80, 1],
    strokeWidth: 1,
    strokeColorSelect: [0, 0, 0, 1],
    fillColorSelect: [0, 0, 0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 1
}];
settFargerForLagData(reservatKandidatData, reservatKandidatData[1]["fillColor"]);

var vektorKildeforeslatteFLO = new ol.source.Vector({
    // url: originWithSlash + "data/foreslatteFLO.geojson",
    url: foreslatteFLOdata[1].data,
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorLagforeslatteFLO = new ol.layer.Vector({
    source: vektorKildeforeslatteFLO,
    style: lagStilFraGeoJSON(foreslatteFLOdata, false), 
    name: "vektorLagforeslatteFLO",
    uiName: "Friluftslivsområder",
    stilSelect: lagStilFraGeoJSON(foreslatteFLOdata, true),
    strokeColorSelect: hentOgKonverterFargeArray(foreslatteFLOdata, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(foreslatteFLOdata, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: true,
    visible: false
});
forberedFaktasiderForOmraadeVektorlag(vektorLagforeslatteFLO, false)

var foreslatteLVOFeatureCollection = new ol.Collection()
var vektorKildeforeslatteLVO = new ol.source.Vector({
    // url: originWithSlash + "data/foreslatteLVO.geojson",
    url: foreslatteLVOdata[1].data,
    format: geoJSONFormat,
    features: foreslatteLVOFeatureCollection
});

var vektorLagforeslatteLVO = new ol.layer.Vector({
    source: vektorKildeforeslatteLVO,
    style: lagStilFraGeoJSON(foreslatteLVOdata, false),
    name: "vektorLagforeslatteLVO",
    uiName: "Landskapsvernområder",
    type: "omraadeLag",
    stilSelect: lagStilFraGeoJSON(foreslatteLVOdata, true),
    strokeColorSelect: hentOgKonverterFargeArray(foreslatteLVOdata, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(foreslatteLVOdata, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: true,
    visible: false
});
forberedFaktasiderForOmraadeVektorlag(vektorLagforeslatteLVO, false);

var reservatKandidatFeatureCollection = new ol.Collection();
var vektorKildeReservatKandidat = new ol.source.Vector({
    // url: originWithSlash + "data/reservatkandidater.geojson",
    url: reservatKandidatData[1].data,
    // url: "",
    format: geoJSONFormat,
    // features: new ol.Collection()
    features: reservatKandidatFeatureCollection
});
var vektorLagReservatKandidat = new ol.layer.Vector({
    source: vektorKildeReservatKandidat,
    style: lagStilFraGeoJSON(reservatKandidatData, false),
    name: "vektorLagReservatKandidat",
    uiName: "Naturreservat",
    stilSelect: lagStilFraGeoJSON(reservatKandidatData, true),
    strokeColorSelect: hentOgKonverterFargeArray(reservatKandidatData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(reservatKandidatData, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: true,
    visible: false
});
forberedFaktasiderForOmraadeVektorlag(vektorLagReservatKandidat, false)

// EE
// NOTE: uiName på både lagnivå og i kartMenyLagDict.
// OBS! Burde bruke uiName fra vektorlag-objektene!
// OBS 2: Kan gjøre det for vektorlag som er klare umiddelbart.
// Hm... Beste hadde vel vært å bare definere alt i Data-objektene?

var kartMenyLagDictForeslatteFLO = {
    lagNavn: vektorLagforeslatteFLO.get("name"),
    uiLagNavn: vektorLagforeslatteFLO.get("uiName"),
    lagReferanse: vektorLagforeslatteFLO
}
var kartMenyLagDictForeslatteLVO = {
    lagNavn: vektorLagforeslatteLVO.get("name"),
    uiLagNavn: vektorLagforeslatteLVO.get("uiName"),
    lagReferanse: vektorLagforeslatteLVO
}
var kartMenyLagDictReservatKandidat = {
    lagNavn: vektorLagReservatKandidat.get("name"),
    uiLagNavn: vektorLagReservatKandidat.get("uiName"),
    lagReferanse: vektorLagReservatKandidat
}
// OBS! Disse vises i kartmeny-UI!
var kartMenyGruppeDictVerneforslag = {
    gruppeNavn: "Verneforslag",
    uiGruppeNavn: "Våre verneforslag",
    kartMenyLag: [
        kartMenyLagDictForeslatteLVO,
        kartMenyLagDictForeslatteFLO,
        kartMenyLagDictReservatKandidat
    ]
}
// OBS! Disse vises i map-objektet!
var mapGruppeVerneforslag = new ol.layer.Group({
    name: kartMenyGruppeDictVerneforslag["gruppeNavn"],
    opacity: 1,
    visible: true,
    layers: [
        vektorLagforeslatteLVO,
        vektorLagforeslatteFLO,
        vektorLagReservatKandidat
    ]
  });

////////////////////////////////////////////////////////////////////////
// FORVALTNINGSFORSLAG
////////////////////////////////////////////////////////////////////////

var RestaureringsomraderData = ["GeoJSONdata", {
    dataName: "RestaureringsomraderData",
    data: originWithSlash + "data/restaureringsomrader.geojson",
    strokeColor: [0,0,0, 1],
    fillColor: [150, 235, 30, 1],
    strokeWidth: 1,
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 1
}];
settFargerForLagData(RestaureringsomraderData, RestaureringsomraderData[1]["fillColor"]);

var SammenhengendeVillmarkData = ["GeoJSONdata", {
    dataName: "SammenhengendeVillmarkData",
    data: originWithSlash + "data/sammenhengendeVillmarkSammenslaatt.geojson",
    strokeColor: [0,0,0, 1],
    fillColor: [66, 75, 160, 1],
    strokeWidth: 1,
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 1
}];
settFargerForLagData(SammenhengendeVillmarkData, SammenhengendeVillmarkData[1]["fillColor"]);

// Test:
// console.log(SammenhengendeVillmarkData[1].data)

var vektorKildeRestaureringsomrader = new ol.source.Vector({
    // url: originWithSlash + "data/restaureringsomrader.geojson",
    url: RestaureringsomraderData[1].data,
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorLagRestaureringsomrader = new ol.layer.Vector({
    source: vektorKildeRestaureringsomrader,
    style: lagStilFraGeoJSON(RestaureringsomraderData, false),
    name: "vektorLagRestaureringsomrader",
    uiName: "Restaureringsområder",
    stilSelect: lagStilFraGeoJSON(RestaureringsomraderData, true),
    strokeColorSelect: hentOgKonverterFargeArray(RestaureringsomraderData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(RestaureringsomraderData, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: true,
    visible: false
});
forberedFaktasiderForOmraadeVektorlag(vektorLagRestaureringsomrader, false)

var vektorKildeSammenhengendeVillmark = new ol.source.Vector({
    url: SammenhengendeVillmarkData[1].data,
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorLagSammenhengendeVillmark = new ol.layer.Vector({
    source: vektorKildeSammenhengendeVillmark,
    style: lagStilFraGeoJSON(SammenhengendeVillmarkData, false),
    name: "vektorLagSammenhengendeVillmark",
    uiName: "Sammenhengende villmark",
    stilSelect: lagStilFraGeoJSON(SammenhengendeVillmarkData, true),
    strokeColorSelect: hentOgKonverterFargeArray(SammenhengendeVillmarkData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(SammenhengendeVillmarkData, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: false,
    visible: false
});
forberedFaktasiderForOmraadeVektorlag(vektorLagSammenhengendeVillmark, false)

// EE

var kartMenyLagDictRestaureringsomraader = {
    lagNavn: vektorLagRestaureringsomrader.get("name"),
    uiLagNavn: vektorLagRestaureringsomrader.get("uiName"),
    lagReferanse: vektorLagRestaureringsomrader
}
var kartMenyLagDictSammenhengendeVillmark = {
    lagNavn: vektorLagSammenhengendeVillmark.get("name"),
    uiLagNavn: vektorLagSammenhengendeVillmark.get("uiName"),
    lagReferanse: vektorLagSammenhengendeVillmark
}
// OBS! Disse vises i kartmeny-UI!
var kartMenyGruppeDictForvaltningsforslag = {
    gruppeNavn: "Forvaltningforslag",
    uiGruppeNavn: "Våre forvaltningsforslag",
    kartMenyLag: [
        kartMenyLagDictRestaureringsomraader,
        kartMenyLagDictSammenhengendeVillmark
    ]
}
// OBS! Disse vises i map-objektet!
var mapGruppeForvaltningsforslag = new ol.layer.Group({
    name: kartMenyGruppeDictForvaltningsforslag["gruppeNavn"],
    opacity: 1,
    visible: true,
    layers: [
        vektorLagRestaureringsomrader,
        vektorLagSammenhengendeVillmark
    ]
  });

////////////////////////////////////////////////////////////////////////
// VERNEOMRÅDER
////////////////////////////////////////////////////////////////////////

var vernEtterMarkalovenData = ["GeoJSONdata", {
    dataName: "vernEtterMarkalovenData",
    data: originWithSlash + "data/markaloven.geojson",
    strokeColor: [0,0,0, 1],
    fillColor: [190, 115, 240, 1],
    strokeWidth: 1,
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 1
}];
settFargerForLagData(vernEtterMarkalovenData, vernEtterMarkalovenData[1]["fillColor"]);

var wmsLagNaturvernOmrade = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer",
        params: { 'LAYERS': "naturvern_omrade" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    opacity: DEFAULT_OPACITY,
    visible: false,
    name: "wmsLagNaturvernOmrade",
    uiName: "Naturvernområder"
});

var wmsLagNaturvernKlasserOmrade = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer",
        params: { 'LAYERS': "naturvern_klasser_omrade" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    opacity: DEFAULT_OPACITY,
    visible: false,
    name: "wmsLagNaturvernKlasserOmrade",
    uiName: "Naturvernområder etter klasser",
});

var wmsLagForeslattNaturvernOmrade = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer",
        params: { 'LAYERS': "foreslatt_naturvern_omrade" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    opacity: DEFAULT_OPACITY,
    visible: false,
    name: "wmsLagForeslattNaturvernOmrade",
    uiName: "Statens foreslåtte naturvernområder",
});

var wmsLagFriluftStatligSikra = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://kart.miljodirektoratet.no/arcgis/services/friluftsliv_statlig_sikra/mapserver/WMSServer",
        params: { 'LAYERS': "friluftsliv_statlig_sikra" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    opacity: DEFAULT_OPACITY,
    visible: false,
    name: "wmsLagFriluftStatligSikra",
    uiName: "Friluftslivsområder - statlig sikra",
});

var wmsLagFriluftslivsomraaderVernede = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://kart.miljodirektoratet.no/arcgis/services/friluftsliv_vern/mapserver/WMSServer",
        params: { 'LAYERS': "friluftsliv_verneomrader" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    opacity: DEFAULT_OPACITY,
    visible: false,
    name: "wmsLagFriluftslivsomraaderVernede",
    uiName: "Friluftslivsområder - vernede",
});

// NOTE: Hm... Kunne kanskje bare lagd alt for alle vektorlag, inkludert dashed? ...
var vektorKildeVernEtterMarkaloven = new ol.source.Vector({
    // url: originWithSlash + "data/markaloven.geojson",
    url: vernEtterMarkalovenData[1].data,
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorLagVernEtterMarkaloven = new ol.layer.Vector({
    source: vektorKildeVernEtterMarkaloven,
    style: lagStilFraGeoJSON(vernEtterMarkalovenData, false),
    name: "vektorLagvernEtterMarkaloven",
    uiName: "Vern etter markaloven § 11",
    stilSelect: lagStilFraGeoJSON(vernEtterMarkalovenData, true),
    strokeColorSelect: hentOgKonverterFargeArray(vernEtterMarkalovenData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(vernEtterMarkalovenData, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: false,
    visible: false
});
// forberedFaktasiderForOmraadeVektorlag(vektorLagVernEtterMarkaloven, false)

// EE
// NOTE: uiName på lagnivå skal bli brukt til klikk-highlight selection (på lag-features).
// NOTE: De som er WMS-lag kan ikke hente lagNavn og uiLagNavn fra et kartlag, siden det ikke er klart enda.
var kartMenyLagDictNaturvernOmraader = {
    lagNavn: "wmsLagNaturvernOmrade",
    uiLagNavn: "Naturvernområder",
    lagReferanse: wmsLagNaturvernOmrade
}
var kartMenyLagDictNaturvernOmraaderKlasser = {
    lagNavn: "wmsLagNaturvernKlasserOmrade",
    uiLagNavn: "Naturvernområder (etter klasser)",
    lagReferanse: wmsLagNaturvernKlasserOmrade
}
var kartMenyLagDictForeslattNaturvernOmrader = {
    lagNavn: "wmsLagForeslattNaturvernOmrade",
    uiLagNavn: " Statens foreslåtte naturvernområder",
    lagReferanse: wmsLagForeslattNaturvernOmrade
}
var kartMenyLagDictFriluftStatligSikra = {
    lagNavn: "wmsLagFriluftStatligSikra",
    uiLagNavn: "Friluftslivsområder - statlig sikra",
    lagReferanse: wmsLagFriluftStatligSikra
}
var kartMenyLagDictVernEtterMarkaloven = {
    lagNavn: "vektorLagvernEtterMarkaloven",
    uiLagNavn: "Vern etter markaloven",
    lagReferanse: vektorLagVernEtterMarkaloven
}
var kartMenyLagDictFriluftslivsomraaderVernede = {
    lagNavn: "wmsLagFriluftslivsomraaderVernede",
    uiLagNavn: "Friluftslivsområder - vernede",
    lagReferanse: wmsLagFriluftslivsomraaderVernede
}

// OBS! Disse vises i kartmeny UI!
var kartMenyGruppeDictVerneomraader = {
    gruppeNavn: "Verneområder",
    uiGruppeNavn: "Vernede områder",
    kartMenyLag: [
        kartMenyLagDictNaturvernOmraader,
        kartMenyLagDictNaturvernOmraaderKlasser,
        kartMenyLagDictForeslattNaturvernOmrader,
        kartMenyLagDictFriluftStatligSikra,
        // kartMenyLagDictVernEtterMarkaloven,
        kartMenyLagDictFriluftslivsomraaderVernede,
    ]
}
// OBS! Disse blir lagt til i map-objektet!
var mapGruppeVerneomrader = new ol.layer.Group({
    name: kartMenyGruppeDictVerneomraader["gruppeNavn"],
    opacity: 1,
    visible: true,
    layers: [
        wmsLagNaturvernOmrade,
        wmsLagNaturvernKlasserOmrade,
        wmsLagForeslattNaturvernOmrade,
        wmsLagFriluftStatligSikra,
        // vektorLagVernEtterMarkaloven,
        wmsLagFriluftslivsomraaderVernede,
    ]
  });

////////////////////////////////////////////////////////////////////////
// NATUROPPLEVELSER
////////////////////////////////////////////////////////////////////////

// Markagrensa

var markagrensaKartdata = ["GeoJSONdata", {
    dataName: "markagrensaKartdata",
    data: originWithSlash + "data/markagrensa.geojson",
    // strokeColor: [12, 119, 93, 1],
    // strokeColor: [12, 65, 119, 1],
    strokeColor: [5, 45, 35, 1],
    fillColor: [0, 0, 0, 0],
    strokeWidth: 1,
    // strokeColorSelect: [12, 119, 93, 1],
    // strokeColorSelect: [12, 65, 119, 1],
    strokeColorSelect: [5, 45, 35, 1],
    fillColorSelect: [0, 0, 0, 0],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 0
}];
// OK, så med farger... Samme strokefarge for vanlig og select, og samme fillfarge for vanlig og select.
// strokefargen er mørkere enn fillcolor? ...
// Hm... Eller bare bruke en farge?
var eventyrskogData = ["GeoJSONdata", {
    dataName: "eventyrskogData",
    data: originWithSlash + "data/eventyrskoger.geojson",
    // fillColor: [53, 124, 34, 1],
    fillColor: [33, 200, 77, 1],
    strokeColor: [0, 0, 0, 0],
    strokeWidth: 1,
    fillColorSelect: [0, 0, 0, 0],
    strokeColorSelect: [0, 0, 0, 0],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 1,
}];
// 
settFargerForLagData(eventyrskogData, eventyrskogData[1]["fillColor"]);

// Fotruter flyttes til under annet

var fotruteData = ["WMSlayer", {
    url: "https://openwms.statkart.no/skwms1/wms.friluftsruter2",
    name: "Fotrute",
    opacity: 1
}];

var historiskData = ["WMSlayer", {
    url: "https://openwms.statkart.no/skwms1/wms.friluftsruter2",
    name: "Historisk",
    opacity: 1
}];

// EE: Lage VectorLayers her.

var wmsLagFotrute = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://openwms.statkart.no/skwms1/wms.friluftsruter2",
        params: { 'LAYERS': "Fotrute" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    visible: false,
    name: "wmsLagFotrute",
});

var wmsLagHistorisk = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://openwms.statkart.no/skwms1/wms.friluftsruter2",
        params: { 'LAYERS': "Historisk" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    visible: false,
    name: "wmsLagHistorisk",
});

var stilMarkagrensa = lagStilFraGeoJSON(markagrensaKartdata, false);
var stilSelectMarkagrensa = lagStilFraGeoJSON(markagrensaKartdata, false);

var vektorKildeMarkagrensa = new ol.source.Vector({
    // url: originWithSlash + "data/markagrensa.geojson",
    url: markagrensaKartdata[1].data,
    format: geoJSONFormat,
    features: new ol.Collection()
});
// Hm... Sette stilSelect direkte på kartlaget?
var vektorLagMarkagrensa = new ol.layer.Vector({
    source: vektorKildeMarkagrensa,
    style: stilMarkagrensa,
    name: "vektorLagMarkagrensa",
    uiName: "Markagrensa",
    stilSelect: stilSelectMarkagrensa,
    strokeColorSelect: hentOgKonverterFargeArray(markagrensaKartdata, 'strokeColorSelect'),
    type: "vektor_grense",
    clickable: false,
    opacity: DEFAULT_OPACITY,
    visible: false
});

// WMS kartMenyLag?

var vektorKildeEventyrskog = new ol.source.Vector({
    // url: originWithSlash + "data/eventyrskoger.geojson",
    url: eventyrskogData[1].data,
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorLagEventyrskog = new ol.layer.Vector({
    source: vektorKildeEventyrskog,
    style: lagStilFraGeoJSON(eventyrskogData, false),
    name: "vektorlagEventyrskog",
    uiName: "Eventyrskog",
    stilSelect: lagStilFraGeoJSON(eventyrskogData, true),
    strokeColorSelect: hentOgKonverterFargeArray(eventyrskogData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(eventyrskogData, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: true,
    visible: false
});
forberedFaktasiderForOmraadeVektorlag(vektorLagEventyrskog, false)

// Referanse til vektorlaget? // Hm... Er null for WMS-lag som loader async.

var kartMenyLagDictMarkagrensa = {
    lagNavn: vektorLagMarkagrensa.get("name"),
    uiLagNavn: vektorLagMarkagrensa.get("uiName"),
    lagReferanse: vektorLagMarkagrensa
}
var kartMenyLagDictEventyrskog = {
    lagNavn: vektorLagEventyrskog.get("name"),
    uiLagNavn: vektorLagEventyrskog.get("uiName"),
    lagReferanse: vektorLagEventyrskog
}

// Flytte senere?

// Skyggelag rundt Markagrensa

var skyggelagMarkagrensaData = ["GeoJSONdata", {
    dataName: "skyggelagMarkagrensaData",
    data: originWithSlash + "data/skyggelag_markagrensa_5.geojson",
    name: "vektorlagSkyggelagMarkagrensa",
    uiName: "Skyggelag rundt Markagrensa",
    strokeColor: [0, 0, 0, 0.5],
    fillColor: [0, 0, 0, 0.5],
    strokeWidth: 2,
    strokeColorSelect: [0, 0, 0, 0.5],
    fillColorSelect: [0, 0, 0, 0.05],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 0,
}];

var vektorKildeSkyggelagMarkagrensa = new ol.source.Vector({
    url: skyggelagMarkagrensaData[1]["data"],
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorlagSkyggelagMarkagrensa = new ol.layer.Vector({
    source: vektorKildeSkyggelagMarkagrensa,
    style: lagStilFraGeoJSON(skyggelagMarkagrensaData, false),
    name: skyggelagMarkagrensaData[1]["name"],
    uiName: skyggelagMarkagrensaData[1]["uiName"],
    stilSelect: lagStilFraGeoJSON(skyggelagMarkagrensaData, true),
    strokeColorSelect: hentOgKonverterFargeArray(skyggelagMarkagrensaData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(skyggelagMarkagrensaData, 'fillColorSelect'),
    type: "vektor_skygge",
    // redigerFarge: "nei",
    clickable: false,
    visible: false
});

var kartMenyLagDictSkyggelagMarkagrensa = {
    lagNavn: vektorlagSkyggelagMarkagrensa.get("name"),
    uiLagNavn: vektorlagSkyggelagMarkagrensa.get("uiName"),
    lagRefereranse: vektorlagSkyggelagMarkagrensa
}

// NOTE: Ta bort?
var kartMenyLagDictFotrute = {
    lagNavn: "wmsLagFotrute",
    uiLagNavn: "Fotrute",
    lagReferanse: wmsLagFotrute
}
var kartMenyLagDictHistorisk = {
    lagNavn: "wmsLagHistorisk",
    uiLagNavn: "Historisk ferdselsrute",
    lagReferanse: wmsLagHistorisk
}

// Kalenderturer fra GeoJSON, multi line string type

// Felles bredde for alle
const strokeWidthRuter = 3;
const strokeWidthSelectRuter = 5;

const ikonerLettDummyData = ["GeoJSONdata", {
    dataName: "ikonerLettDummyData",
    strokeColor: [88, 214, 141, 1],
    fillColor: [88, 214, 141, 1],
    strokeWidth: strokeWidthRuter,
    strokeColorSelect: [88, 214, 141, 1],
    fillColorSelect: [88, 214, 141, 1],
    strokeWidthSelect: strokeWidthSelectRuter,
    opacity: 1,
}];
settFargerForLagData(ikonerLettDummyData, ikonerLettDummyData[1]["fillColor"]);
// console.log(ikonerLettDummyData);

const ikonerMiddelsDummyData = ["GeoJSONdata", {
    dataName: "ikonerMiddelsDummyData",
    strokeColor: [244, 208, 63, 1],
    fillColor: [244, 208, 63, 1],
    strokeWidth: strokeWidthRuter,
    strokeColorSelect: [244, 208, 63, 1],
    fillColorSelect: [244, 208, 63, 1],
    strokeWidthSelect: strokeWidthSelectRuter,
    opacity: 1,
}];
settFargerForLagData(ikonerMiddelsDummyData, ikonerMiddelsDummyData[1]["fillColor"]);
// console.log(ikonerMiddelsDummyData);

const ikonerVanskeligDummyData = ["GeoJSONdata", {
    dataName: "ikonerVanskeligDummyData",
    strokeColor: [236, 112, 99, 1],
    fillColor: [236, 112, 99, 1],
    strokeWidth: strokeWidthRuter,
    strokeColorSelect: [236, 112, 99, 1],
    fillColorSelect: [236, 112, 99, 1],
    strokeWidthSelect: strokeWidthSelectRuter,
    opacity: 1,
}];
settFargerForLagData(ikonerVanskeligDummyData, ikonerVanskeligDummyData[1]["fillColor"]);
// console.log(ikonerVanskeligDummyData);

const ikonerLarsMonsenDummyData = ["GeoJSONdata", {
    dataName: "ikonerLarsMonsenDummyData",
    strokeColor: [147, 112, 219, 1],
    fillColor: [147, 112, 219, 1],
    strokeWidth: strokeWidthRuter,
    strokeColorSelect: [147, 112, 219, 1],
    fillColorSelect: [147, 112, 219, 1],
    strokeWidthSelect: strokeWidthSelectRuter,
    opacity: 1,
}];
settFargerForLagData(ikonerLarsMonsenDummyData, ikonerLarsMonsenDummyData[1]["fillColor"]);
// console.log(ikonerLarsMonsenDummyData);

const ikonerFridjofNansenDummyData = ["GeoJSONdata", {
    dataName: "ikonerFridjofNansenDummyData",
    strokeColor: [135, 206, 235, 1],
    fillColor: [135, 206, 235, 1],
    strokeWidth: strokeWidthRuter,
    strokeColorSelect: [135, 206, 235, 1],
    fillColorSelect: [135, 206, 235, 1],
    strokeWidthSelect: strokeWidthSelectRuter,
    opacity: 1,
}];
settFargerForLagData(ikonerFridjofNansenDummyData, ikonerFridjofNansenDummyData[1]["fillColor"]);
// console.log(ikonerFridjofNansenDummyData);

const ikonerUkjentDummyData = ["GeoJSONdata", {
    dataName: "ikonerUkjentDummyData",
    strokeColor: [220, 220, 220, 1],
    fillColor: [220, 220, 220, 1],
    strokeWidth: strokeWidthRuter,
    strokeColorSelect: [220, 220, 220, 1],
    fillColorSelect: [220, 220, 220, 1],
    strokeWidthSelect: strokeWidthSelectRuter,
    opacity: 1,
}];
settFargerForLagData(ikonerUkjentDummyData, ikonerUkjentDummyData[1]["fillColor"]);
// console.log(ikonerUkjentDummyData);

var kalenderRuter2021Data = ["GeoJSONdata", {
    dataName: "kalenderRuter2021Data",
    // data: originWithSlash + "data/kalenderTurer2021-ikoner.geojson",
    // data: originWithSlash + "data/KalenderTurer2021Ikoner.geojson",
    data: originWithSlash + "data/kalender2017til2021.geojson",
    strokeColor: [88, 214, 141, 1],
    fillColor: [88, 214, 141, 1],
    strokeWidth: strokeWidthRuter,
    strokeColorSelect: [88, 214, 141, 1],
    fillColorSelect: [88, 214, 141, 1],
    strokeWidthSelect: strokeWidthSelectRuter,
    opacity: 1,
    clickEvent: 1,
}];

settFargerForLagData(kalenderRuter2021Data, kalenderRuter2021Data[1]["fillColor"]);

// Debug:
// console.log(kalenderRuter2021Data[1]["data"])

var kalenderRuter2021FeatureCollection = new ol.Collection();

var vektorKildeKalenderRuter2021 = new ol.source.Vector({
    format: geoJSONFormat,
    features: kalenderRuter2021FeatureCollection
});

// Eget vektorlag for bare ikonene

var ruter2021FeatureIconsCollection = new ol.Collection();

var vektorKildeRuter2021Ikoner = new ol.source.Vector({
    format: geoJSONFormat,
    features: ruter2021FeatureIconsCollection
})

var vektorKildeRuter2021Cluster = new ol.source.Cluster({
    source: vektorKildeRuter2021Ikoner,
    distance: 20,
    minDistance: 0
})

// Vektorlag for ruter 2021 ikonene!

// La til "Kalender" i variabelnavnet.
var vektorlagKalenderRuter2021Ikoner = new ol.layer.Vector({
    // source: vektorKildeRuter2021Ikoner,
    source: vektorKildeRuter2021Cluster,
    name: "vektorlagKalenderRuter2021Ikoner",
    uiName: "Ruter 2021 ikoner",
    // ruterLagNavn: "vektorlagKalenderRuter2021", // Prøve i første omgang uten.
    type: "ikonLag",
    clickable: true,
    opacity: 0.9,
    visible: false,
    zIndex: 1000, // For at ikoner alltid skal komme over andre kartlag.
    style: function (feature) {
        // console.log(feature);
        // console.log(feature.get('features'));
        var currentFeatures = feature.get('features');
        var stilListe = [];
        for(var i = 0; i < currentFeatures.length; i++){
            stilListe.push(currentFeatures[i].get("ikonStil"));
        }
        return stilListe;
    },
    ruteKartlagNavn: "vektorlagKalenderRuter2021", // Kan så hente kartlaget med navnet.
})

var vektorLagKalenderRuter2021 = new ol.layer.Vector({
    source: vektorKildeKalenderRuter2021,
    style: lagStilFraGeoJSON(kalenderRuter2021Data, false),
    name: "vektorlagKalenderRuter2021",
    // uiName: "Kalender turer 2021",
    uiName: "NOAs tidligere kalenderturer",
    type: "ruteLag",
    stilSelect: lagStilFraGeoJSON(kalenderRuter2021Data, true),
    strokeColorSelect: hentOgKonverterFargeArray(kalenderRuter2021Data, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(kalenderRuter2021Data, 'fillColorSelect'),
    stilDashed: lagDashedStilFraGeoJSON(kalenderRuter2021Data, false),
    stilDashedSelect: lagDashedStilFraGeoJSON(kalenderRuter2021Data, true),
    // Prøve ekstra styles her for gradene: lett, middels, vanskelig
    lettStil: lagStilFraGeoJSON(ikonerLettDummyData, false),
    lettStilSelect: lagStilFraGeoJSON(ikonerLettDummyData, true),
    lettStrokeColorSelect: hentOgKonverterFargeArray(ikonerLettDummyData, 'strokeColorSelect'),
    lettFillColorSelect: hentOgKonverterFargeArray(ikonerLettDummyData, 'fillColorSelect'),
    lettStilDashed: lagDashedStilFraGeoJSON(ikonerLettDummyData, false),
    lettStilDashedSelect: lagDashedStilFraGeoJSON(ikonerLettDummyData, true),
    //
    middelsStil: lagStilFraGeoJSON(ikonerMiddelsDummyData, false),
    middelsStilSelect: lagStilFraGeoJSON(ikonerMiddelsDummyData, true),
    middelsStrokeColorSelect: hentOgKonverterFargeArray(ikonerMiddelsDummyData, 'strokeColorSelect'),
    middelsFillColorSelect: hentOgKonverterFargeArray(ikonerMiddelsDummyData, 'fillColorSelect'),
    middelsStilDashed: lagDashedStilFraGeoJSON(ikonerMiddelsDummyData, false),
    middelsStilDashedSelect: lagDashedStilFraGeoJSON(ikonerMiddelsDummyData, true),
    //
    vanskeligStil: lagStilFraGeoJSON(ikonerVanskeligDummyData, false),
    vanskeligStilSelect: lagStilFraGeoJSON(ikonerVanskeligDummyData, true),
    vanskeligStrokeColorSelect: hentOgKonverterFargeArray(ikonerVanskeligDummyData, 'strokeColorSelect'),
    vanskeligFillColorSelect: hentOgKonverterFargeArray(ikonerVanskeligDummyData, 'fillColorSelect'),
    vanskeligStilDashed: lagDashedStilFraGeoJSON(ikonerVanskeligDummyData, false),
    vanskeligStilDashedSelect: lagDashedStilFraGeoJSON(ikonerVanskeligDummyData, true),
    //
    larsMonsenStil: lagStilFraGeoJSON(ikonerLarsMonsenDummyData, false),
    larsMonsenStilSelect: lagStilFraGeoJSON(ikonerLarsMonsenDummyData, true),
    larsMonsenStrokeColorSelect: hentOgKonverterFargeArray(ikonerLarsMonsenDummyData, 'strokeColorSelect'),
    larsMonsenFillColorSelect: hentOgKonverterFargeArray(ikonerLarsMonsenDummyData, 'fillColorSelect'),
    larsMonsenStilDashed: lagDashedStilFraGeoJSON(ikonerLarsMonsenDummyData, false),
    larsMonsenStilDashedSelect: lagDashedStilFraGeoJSON(ikonerLarsMonsenDummyData, true),
    //
    fridjofNansenStil: lagStilFraGeoJSON(ikonerFridjofNansenDummyData, false),
    fridjofNansenStilSelect: lagStilFraGeoJSON(ikonerFridjofNansenDummyData, true),
    fridjofNansenStrokeColorSelect: hentOgKonverterFargeArray(ikonerFridjofNansenDummyData, 'strokeColorSelect'),
    fridjofNansenFillColorSelect: hentOgKonverterFargeArray(ikonerFridjofNansenDummyData, 'fillColorSelect'),
    fridjofNansenStilDashed: lagDashedStilFraGeoJSON(ikonerFridjofNansenDummyData, false),
    fridjofNansenStilDashedSelect: lagDashedStilFraGeoJSON(ikonerFridjofNansenDummyData, true),
    //
    ukjentStil: lagStilFraGeoJSON(ikonerUkjentDummyData, false),
    ukjentStilSelect: lagStilFraGeoJSON(ikonerUkjentDummyData, true),
    ukjentStrokeColorSelect: hentOgKonverterFargeArray(ikonerUkjentDummyData, 'strokeColorSelect'),
    ukjentFillColorSelect: hentOgKonverterFargeArray(ikonerUkjentDummyData, 'fillColorSelect'),
    ukjentStilDashed: lagDashedStilFraGeoJSON(ikonerUkjentDummyData, false),
    ukjentStilDashedSelect: lagDashedStilFraGeoJSON(ikonerUkjentDummyData, true),
    //
    zIndex: 100,
    opacity: DEFAULT_OPACITY,
    ikonLag: vektorlagKalenderRuter2021Ikoner, // Referanse til ikon-kartlag!
    clickable: true,
    visible: false
});
// console.log(vektorLagKalenderRuter2021);

// // FUNKER. Omg...
async function fetchJSON(url) {
  return await fetch(url).then(function (response) {
    return response.json();
  });
}

/*
Hm... Fetch-metode for vektorlag - lagd først og remst for andre NOA vektor kartlag, som eventyrskoger, verneforslag, etc.
Hm... Trenger kanskje å gjøre som med kalenderturer - altså ha collection i vektorkilden.

var kalenderRuter2021FeatureCollection = new ol.Collection();

var vektorKildeKalenderRuter2021 = new ol.source.Vector({
    format: geoJSONFormat,
    features: kalenderRuter2021FeatureCollection
});

Parametere: 
- featureCollection? ol.source.Vector kan bruke en featureCollection.
- dataUrl fra geojsonData objekt.

navn
verdi (Verneverdi)
*/
async function lesDataForVektorlag(dataUrl, vektorKilde){

    console.log(`lesDataForVektorlag kjører. dataUrl: ${dataUrl}`)
    // console.log(`lesDataForVektorlag kjører. dataUrl: ${dataUrl}. vektorKilde:`)
    // console.log(vektorKilde)

    var data = await fetchJSON(dataUrl).then(function (data) {
        var features = geoJSONFormat.readFeatures(data);

        // Hm. Cleare de eksisterende features før legge til features i collection?
        let foundFeatures = new ol.Collection();

        features.forEach((feature) => {

            try{

                return foundFeatures;

            }catch(e){
                console.log(`error oppstod under henting av data fra ${dataUrl} for feature ... error: ${e}`);
                return null;
            }

        });
    }).catch((e) => {
        console.log(`feil under fetch av JSON fra url ${dataUrl}. error: ${e}`);
        return null;
    });

}

function kalkulerLengdeIKm(geometri){
    // const featureGeometry = feature.get("geometry");
    const length = ol.sphere.getLength(geometri); // Gir lengden i meter.
    let lengthRounded = Math.round((length / 1000) * 10) / 10; // I km med en desimal.
    return lengthRounded;
}

// Kvadratmeter: km²
// Eksempel: https://openlayers.org/en/latest/examples/measure.html
function kalkulerArealIKvadratmeter(geometri){
    const areal = ol.sphere.getArea(geometri);
    // console.log(`kalkulerArealIKvadratmeter ~ areal: ${areal}`)
    // if (areal > 10000) {
    //     output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
    //   } else {
    //     output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
    // }
    const arealRundet = Math.round((areal / 1000000) * 100) / 100; // km²
    const arealEnDesimal = Math.round(arealRundet * 10) / 10 // Samme, men med en desimal
    return arealEnDesimal
}

async function behandleKalenderturer() {
    // TODO: Hm, lage en funksjon til gjenbruk? Som ruter for andre kalenderår kan bruke.
    // Kjøre dette etter å ha definert rutene og ikonene.
    var data = await fetchJSON(kalenderRuter2021Data[1]["data"]).then(function (data) {
        var features = geoJSONFormat.readFeatures(data);
        features.forEach((feature) => {
            // Funker! Men må fikse slik at den blir satt tilbake til dashed etter highlight også trykke vekk.
            try {
                // console.log(feature);

                // HTML-versjon av turbeskrivelsen
                var tekstHTML = lagHTMLTekst(feature.get("tekst"), "medium");
                feature.set("tekstHTML", tekstHTML);

                //   var featureName = feature.get("name");
                var featureName = feature.get("NAVN");
                var featureStart = feature.get("start_3857");
                var featurePageUrl = feature.get("side_url");
                var featurePictureUrl = feature.get("bilde_url");
                var featureGrad = feature.get("grad");
                var featureTurType = feature.get("tur_type");
                var featureIngress = feature.get("ingress");

                if(featureIngress){
                    const ingressHTML = lagHTMLTekst(featureIngress, "medium");
                    feature.set("ingressHTML", ingressHTML);
                    feature.set("ingressLengde", kalkulerFaktiskTekstLengde(featureIngress));
                }

                const featureGeometry = feature.get("geometry");
                const featureGeometryType = featureGeometry.getType(); // Gir geometri-typen.
                // const length = ol.sphere.getLength(featureGeometry); // Gir lengden i meter.
                // let lengthRounded = Math.round((length / 1000) * 10) / 10; // I km med en desimal.

                let featureGeometryExtent = featureGeometry.getExtent();
                let featureGeometryExtentCenter = ol.extent.getCenter(featureGeometryExtent);

                feature.set("geometriType", featureGeometryType);
                // feature.set("lengdeKm", lengthRounded);
                feature.set("lengdeKm", kalkulerLengdeIKm(featureGeometry));
                feature.set("geometriMidtKoordinater", featureGeometryExtentCenter);
                //   console.log(feature);

                // Sette kartlag type. Så langt to typer: kalender_tur og natursti
                feature.set("kartlagType", "kalender_tur");

                // Er det en snarvei (stiplet)?
                let erEnStiplet = false;

                // Notat: Tror jeg kan sjekke noe annet enn "MAANEDSTUR" om at det er en kalendertur.
                var maanedstur = feature.get("MAANEDSTUR");
                if (maanedstur != null) {
                    var snarvei = feature.get("Stiplet");
                    if (snarvei != null) {
                        var snarveiVerdi = parseInt(snarvei);
                        if (snarveiVerdi > 0) {
                            erEnStiplet = true;
                        }
                    }
                }

                // Egen stil for hvert ikon (feature):

                featureGrad = String(featureGrad); // Ser ut som at denne fikser en annen bug, som tar bort fargene hvis man zoomer veldig langt ut og zoomer inn igjen.

                var bildeUrl = "";

                bildeUrl = hentRiktigTurIkonPlassering(featureGrad, featureTurType)[0];

                // Sette både ikoner og turstilene!
                // Støtter bare string, så konverter grad til string først.
                switch (featureGrad) {
                    case "lett": case "1":
                        //   bildeUrl = ikonLett;
                        if (!erEnStiplet) {
                            feature.setStyle(vektorLagKalenderRuter2021.get("lettStil"));
                        } else {
                            feature.setStyle(vektorLagKalenderRuter2021.get("lettStilDashed"));
                        }
                        break;
                    case "middels": case "2":
                        //   bildeUrl = ikonMiddels;
                        if (!erEnStiplet) {
                            feature.setStyle(vektorLagKalenderRuter2021.get("middelsStil"));
                        } else {
                            feature.setStyle(vektorLagKalenderRuter2021.get("middelsStilDashed"));
                        }
                        break;
                    case "vanskelig": case "3":
                        //   bildeUrl = ikonVanskelig;
                        if (!erEnStiplet) {
                            feature.setStyle(vektorLagKalenderRuter2021.get("vanskeligStil"));
                        } else {
                            feature.setStyle(vektorLagKalenderRuter2021.get("vanskeligStilDashed"));
                        }
                        break;
                    case "lars_monsen": case "4":
                        if (!erEnStiplet) {
                            feature.setStyle(vektorLagKalenderRuter2021.get("larsMonsenStil"));
                        } else {
                            feature.setStyle(vektorLagKalenderRuter2021.get("larsMonsenStilDashed"));
                        }
                        break;
                    case "fridjof_nansen": case "9":
                        if (!erEnStiplet) {
                            feature.setStyle(vektorLagKalenderRuter2021.get("fridjofNansenStil"));
                        } else {
                            feature.setStyle(vektorLagKalenderRuter2021.get("fridjofNansenStilDashed"));
                        }
                        break;
                    default:
                        //   bildeUrl = ikonUkjent;
                        if (!erEnStiplet) {
                            feature.setStyle(vektorLagKalenderRuter2021.get("ukjentStil"));
                        } else {
                            feature.setStyle(vektorLagKalenderRuter2021.get("ukjentStilDashed"));
                        }
                        break;
                }

                var clusterStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        scale: 0.12,
                        anchorXUnits: "fraction",
                        anchorYUnits: "pixels",
                        src: bildeUrl,
                    }),
                });

                var coordinates3857String = featureStart.split(",");

                try {
                    var coordinates3857x = parseFloat(coordinates3857String[0]);
                    var coordinates3857y = parseFloat(coordinates3857String[1]);

                    const iconFeature = new ol.Feature({
                        geometry: new ol.geom.Point([
                            parseFloat(coordinates3857x),
                            parseFloat(coordinates3857y),
                        ]),
                        name: featureName,
                        featureStart: coordinates3857String,
                        featurePageUrl: featurePageUrl,
                        featurePictureUrl: featurePictureUrl,
                        featureGrad: featureGrad,
                        ikonStil: clusterStyle, // Egen stil for punktet!
                        featureRute: feature, // Ruten til ikonet.
                        featureRuteNavn: feature.get("NAVN"),
                        ruteKartlag: vektorLagKalenderRuter2021,
                    });

                    // ruter2021FeatureIconsCollection.push(iconFeature);

                    // Prøve å ikke inkludere ikon for stiplet.
                    if (!erEnStiplet) ruter2021FeatureIconsCollection.push(iconFeature);

                } catch (e) {
                    console.log("exception under laging av featureIcon: " + e);
                }

            } catch (exception) {
                console.log("Noe error når jeg gjorde feature.get()... e: " + exception);
            }

            kalenderRuter2021FeatureCollection.push(feature);
        });

        // do what you want to do with `data` here...
        data.features.forEach(function (feature) {
            // console.log(feature);
            // var symbol = feature.properties['icon'];
            // console.log(symbol);
        });

        // 
        // console.log("Rutene er klare?");
        //   console.log(kalenderRuter2021FeatureCollection);

        // Hm. Tenkte å gjøre to ting... Legge til hovedrute til stiplet, og stiplettene til hovedruten? ... Oof...

        // Loop i loop... Men bare for turer som har "har_stiplet" egenskapen.
        const featuresArray = kalenderRuter2021FeatureCollection.getArray();
        for (var j = 0; j < featuresArray.length; j++) {
            const f = featuresArray[j];
            const har_stiplet = f.get("har_stiplet");
            if (har_stiplet) {

                if (har_stiplet == "1") {

                    const aar = f.get("AAR");
                    const maaned = f.get("MAANED");
                    const stipletteneTilRuten = [];

                    // 
                    for (var k = 0; k < featuresArray.length; k++) {
                        const f2 = featuresArray[k];
                        const stiplet = f2.get("Stiplet");
                        // Trenger ikke sjekke om Stiplet eksisterer, siden alle ruter har den definert.
                        if (stiplet == "1") {
                            const aar2 = f2.get("AAR");
                            const maaned2 = f2.get("MAANED");

                            if (aar == aar2 && maaned == maaned2) {
                                // Kan også legge til hovedruten til stiplet!
                                f2.set("hovedrute", f);
                                //
                                stipletteneTilRuten.push(f2);
                            }
                        }
                    }

                    // 
                    if (stipletteneTilRuten.length > 0) {
                        f.set("stipletter", stipletteneTilRuten);
                    }

                }

            }
        }

        // Selecte tur programmatisk, hvis turen er valgt ifølge URL parameter?
        if (infoSideFeatureNavnFraUrl && infoSideKartlagNavnFraUrl) {

            if (infoSideKartlagNavnFraUrl == vektorLagKalenderRuter2021.get("name")) {
                // console.log("Kalenderturer! Kjører visInfoSideProgrammatisk");
                // visInfoSideProgrammatisk(true);
                visInfoSideProgrammatisk();
            }

        }

        console.log("behandleKalenderturer resolved!");
        return true;

    }).catch(function (error) {
        console.log("behandleKalenderturer ~ error! error: " + error);
        return false;
    });

}

var kartMenyLagDictKalenderRuter2021 = {
    lagNavn: vektorLagKalenderRuter2021.get("name"),
    uiLagNavn: vektorLagKalenderRuter2021.get("uiName"),
    lagReferanse: vektorLagKalenderRuter2021
}

// !!!
// Prøver å legge til kalenderturer fra GeoJSON, multi line string type? EMD
// !!!

/// Natursti START

var naturstiData = ["GeoJSONdata", {
    dataName: "naturstiData",
    // data: originWithSlash + "data/natursti-linjer2-25832.geojson",
    data: originWithSlash + "data/natursti-25832.geojson",
    strokeColor: [0, 0, 0, 1],
    // fillColor: [30, 144, 255, 1],
    fillColor: [135, 206, 250, 1],
    strokeWidth: strokeWidthRuter,
    strokeColorSelect: [0, 0, 0, 1],
    fillColorSelect: [0, 0, 0, 1],
    strokeWidthSelect: strokeWidthSelectRuter,
    opacity: 1,
    clickEvent: 1,
}];

settFargerForLagData(naturstiData, naturstiData[1]["fillColor"]);

var naturstiFeatureCollection = new ol.Collection();

var vektorKildeNatursti = new ol.source.Vector({
    format: geoJSONFormat,
    features: naturstiFeatureCollection
});

// Definere ikoner start // Eget vektorlag for bare ikonene

var naturstiFeatureIconsCollection = new ol.Collection();

var vektorKildeNaturstikoner = new ol.source.Vector({
    format: geoJSONFormat,
    features: naturstiFeatureIconsCollection
})

var vektorKildeNaturstiCluster = new ol.source.Cluster({
    source: vektorKildeNaturstikoner,
    distance: 20,
    minDistance: 0
})

var vektorlagNaturstiIkoner = new ol.layer.Vector({
    source: vektorKildeNaturstiCluster,
    name: "vektorlagNaturstiIkoner",
    uiName: "Natursti ikoner",
    type: "ikonLag",
    clickable: true,
    opacity: 0.9,
    visible: false,
    zIndex: 999, // For at ikoner alltid skal komme over andre kartlag.
    style: function (feature) {
        var currentFeatures = feature.get('features');
        var stilListe = [];
        for(var i = 0; i < currentFeatures.length; i++){
            stilListe.push(currentFeatures[i].get("ikonStil"));
        }
        return stilListe;
    },
    ruteKartlagNavn: "vektorLagNatursti",
})

// Definere ikoner slutt

var vektorLagNatursti = new ol.layer.Vector({
    source: vektorKildeNatursti,
    style: lagStilFraGeoJSON(naturstiData, false),
    name: "vektorLagNatursti",
    uiName: "Naturstien",
    type: "ruteLag",
    stilSelect: lagStilFraGeoJSON(naturstiData, true),
    strokeColorSelect: hentOgKonverterFargeArray(naturstiData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(naturstiData, 'fillColorSelect'),
    stilDashed: lagDashedStilFraGeoJSON(naturstiData, false),
    stilDashedSelect: lagDashedStilFraGeoJSON(naturstiData, true),
    zIndex: 100,
    opacity: DEFAULT_OPACITY,
    ikonLag: vektorlagNaturstiIkoner, // Referanse til ikon-kartlag
    clickable: true,
    visible: false
});

// behandleNaturstiData();

async function behandleNaturstiData() {
    // var tempFeatureIconsCollection = []; // Brukt til baklengs loop.
    var fetchData = await fetchJSON(naturstiData[1]["data"]).then(function (fetchData) {
        var features = geoJSONFormat.readFeatures(fetchData);
        features.forEach((feature) => {
            try {
                // console.log(feature);

                var postnr = feature.get("postnr");
                var koordinater = feature.get("koordinater");

                const featureGeometry = feature.get("geometry");
                const length = ol.sphere.getLength(featureGeometry); // Gir lengden i meter.
                const lengthMeterRounded = Math.round((length * 10)) / 10; // Meter runded av til en desimal.
                const lengthMeterNoDecimals = Math.round(length);
                let lengthRounded = Math.round((length / 1000) * 10) / 10; // I km med en desimal.

                feature.set("lengdeMeter", lengthMeterNoDecimals);
                feature.set("lengdeKm", lengthRounded);

                //   console.log("type: " + typeof(postnr) + ", lengthMeterRounded: " + lengthMeterRounded + ", lengthMeterNoDecimals: " + lengthMeterNoDecimals);
                //   console.log("postnr: " + postnr + ", koordinater: " + koordinater + ", lengde i meter: " + length + ", km: " + lengthRounded );

                // Definere kartlag type. Hittil to typer: kalender_rute og natursti
                feature.set("kartlagType", "natursti");

                // For ikoner start

                let bildeUrl = hentTurstiIkonForPostnr(postnr);

                const clusterStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        scale: 0.12,
                        anchorXUnits: "fraction",
                        anchorYUnits: "pixels",
                        src: bildeUrl,
                    }),
                });

                var koordinaterStreng = koordinater.split(",");

                try {
                    var koordinaterX = parseFloat(koordinaterStreng[0]);
                    var koordinaterY = parseFloat(koordinaterStreng[1]);

                    const iconFeature = new ol.Feature({
                        geometry: new ol.geom.Point([
                            parseFloat(koordinaterX),
                            parseFloat(koordinaterY),
                        ]),
                        postnr: postnr,
                        koordinater: koordinaterStreng,
                        ikonStil: clusterStyle, // Egen stil for punktet!
                        featureRute: feature, // Ruten til ikonet.
                        featureRuteNavn: feature.get("navn"),
                        ruteKartlag: vektorLagNatursti,
                    });

                    // console.log(feature);

                    naturstiFeatureIconsCollection.push(iconFeature);
                    // tempFeatureIconsCollection.push(iconFeature);
                    // console.log(tempFeatureIconsCollection);
                } catch (e) {
                    console.log("exception under laging av featureIcon: " + e);
                }

                // For ikoner slutt

            } catch (exception) {
                console.log(
                    "Natursti ~ Noe error når jeg gjorde feature.get()... e: " + exception
                );
            }

            naturstiFeatureCollection.push(feature);
        });

        fetchData.features.forEach(function (feature) { });

        if (infoSideFeatureNavnFraUrl && infoSideKartlagNavnFraUrl) {

            if (infoSideKartlagNavnFraUrl == vektorLagNatursti.get("name")) {
                // console.log("Natursti! Kjører visInfoSideProgrammatisk");
                // visInfoSideProgrammatisk(false);
                visInfoSideProgrammatisk();
            }

        }

        console.log("behandleNaturstiData ~ resolved!");
        return true;

    }).catch(function (error) {
        console.log("behandleNaturstiData ~ error! error: " + error);
        return false;
    });
}

var kartMenyLagDictNatursti = {
    lagNavn: vektorLagNatursti.get("name"),
    uiLagNavn: vektorLagNatursti.get("uiName"),
    lagReferanse: vektorLagNatursti
}

/// Natursti SLUTT

// OBS! Disse vises i kartmeny-UI!
var kartMenyGruppeDictNaturopplevelser = {
    gruppeNavn: "Naturopplevelser",
    uiGruppeNavn: "Naturopplevelser",
    kartMenyLag: [
        kartMenyLagDictMarkagrensa,
        kartMenyLagDictSkyggelagMarkagrensa,
        kartMenyLagDictEventyrskog,

        // VIKTIG NOTAT (VERSJON 1): UTEN kalender ruter!
        kartMenyLagDictKalenderRuter2021,
        kartMenyLagDictNatursti,
    ]
}
// OBS! Disse vises i map-objektet!
var mapGruppeNaturopplevelser = new ol.layer.Group({
    name: kartMenyGruppeDictNaturopplevelser["gruppeNavn"],
    opacity: 1,
    visible: true,
    layers: [
        vektorLagMarkagrensa,
        vektorlagSkyggelagMarkagrensa,
        vektorLagEventyrskog, 
        vektorLagKalenderRuter2021,
        //
        vektorLagNatursti,
        // ikoner
        vektorlagKalenderRuter2021Ikoner,
        vektorlagNaturstiIkoner,
    ]
  });

////////////////////////////////////////////////////////////////////////
// AREALPLAN OSLO
////////////////////////////////////////////////////////////////////////

// SKOGSTYPER: Granskog, furuskog, løvskog og vassdrag, særlig viktige skogsarealer for BM

// // Granskog

// var osloArealGranskogData = ["GeoJSONdata", {
//     dataName: "osloArealGranskogData",
//     data: originWithSlash + "data/oslo_areal_granskog.geojson",
//     name: "vektorlagOsloArealGranskog",
//     uiName: "Granskog",
//     strokeColor: [0,0,0, 1],
//     fillColor: [15,95,50, 1],
//     strokeWidth: 1,
//     strokeColorSelect: [0,0,0, 1],
//     fillColorSelect: [0,0,0, 1],
//     strokeWidthSelect: 2,
//     opacity: 1,
//     clickEvent: 0,
// }];
// settFargerForLagData(osloArealGranskogData, osloArealGranskogData[1]["fillColor"]);

// var vektorKildeOsloArealGranskog = new ol.source.Vector({
//     url: originWithSlash + "data/oslo_areal_granskog.geojson",
//     format: geoJSONFormat,
//     features: new ol.Collection()
// });
// var vektorlagOsloArealGranskog = new ol.layer.Vector({
//     source: vektorKildeOsloArealGranskog,
//     style: lagStilFraGeoJSON(osloArealGranskogData, false),
//     name: osloArealGranskogData[1]["name"],
//     uiName: osloArealGranskogData[1]["uiName"],
//     stilSelect: lagStilFraGeoJSON(osloArealGranskogData, true),
//     strokeColorSelect: hentOgKonverterFargeArray(osloArealGranskogData, 'strokeColorSelect'),
//     fillColorSelect: hentOgKonverterFargeArray(osloArealGranskogData, 'fillColorSelect'),
//     opacity: DEFAULT_OPACITY,
//     clickable: false,
//     visible: false
// });
// var kartMenyLagDictOsloArealGranskog = {
//     lagNavn: vektorlagOsloArealGranskog.get("name"),
//     uiLagNavn: vektorlagOsloArealGranskog.get("uiName"),
//     lagReferanse: vektorlagOsloArealGranskog
// }

// // Furuskog

// var osloArealFuruskogData = ["GeoJSONdata", {
//     dataName: "osloArealFuruskogData",
//     data: originWithSlash + "data/oslo_areal_furuskog.geojson",
//     name: "vektorlagOsloArealFuruskog",
//     uiName: "Furuskog",
//     strokeColor: [0,0,0, 1],
//     fillColor: [5,170,0, 1],
//     strokeWidth: 1,
//     strokeColorSelect: [0,0,0, 1],
//     fillColorSelect: [0,0,0, 1],
//     strokeWidthSelect: 2,
//     opacity: 1,
//     clickEvent: 0,
// }];
// settFargerForLagData(osloArealFuruskogData, osloArealFuruskogData[1]["fillColor"]);

// var vektorKildeOsloArealFuruskog = new ol.source.Vector({
//     url: originWithSlash + "data/oslo_areal_furuskog.geojson",
//     format: geoJSONFormat,
//     features: new ol.Collection()
// });
// var vektorlagOsloArealFuruskog = new ol.layer.Vector({
//     source: vektorKildeOsloArealFuruskog,
//     style: lagStilFraGeoJSON(osloArealFuruskogData, false),
//     name: osloArealFuruskogData[1]["name"],
//     uiName: osloArealFuruskogData[1]["uiName"],
//     stilSelect: lagStilFraGeoJSON(osloArealFuruskogData, true),
//     strokeColorSelect: hentOgKonverterFargeArray(osloArealFuruskogData, 'strokeColorSelect'),
//     fillColorSelect: hentOgKonverterFargeArray(osloArealFuruskogData, 'fillColorSelect'),
//     opacity: DEFAULT_OPACITY,
//     clickable: false,
//     visible: false
// });
// var kartMenyLagDictOsloArealFuruskog = {
//     lagNavn: vektorlagOsloArealFuruskog.get("name"),
//     uiLagNavn: vektorlagOsloArealFuruskog.get("uiName"),
//     lagReferanse: vektorlagOsloArealFuruskog
// }

// // Løvskog og bekkedrag

// var osloArealLovskogOgBekkedragData = ["GeoJSONdata", {
//     dataName: "osloArealLovskogOgBekkedragData",
//     data: originWithSlash + "data/oslo_areal_lovskog_og_bekkedrag.geojson",
//     name: "vektorlagOsloArealLovskogOgBekkedrag",
//     uiName: "Løvskog og bekkedrag",
//     strokeColor: [0,0,0, 1],
//     fillColor: [70,120,0, 1],
//     strokeWidth: 1,
//     strokeColorSelect: [0,0,0, 1],
//     fillColorSelect: [0,0,0, 1],
//     strokeWidthSelect: 2,
//     opacity: 1,
//     clickEvent: 0,
// }];
// settFargerForLagData(osloArealLovskogOgBekkedragData, osloArealLovskogOgBekkedragData[1]["fillColor"]);

// var vektorKildeOsloArealLovskogOgBekkedrag = new ol.source.Vector({
//     url: originWithSlash + "data/oslo_areal_lovskog_og_bekkedrag.geojson",
//     format: geoJSONFormat,
//     features: new ol.Collection()
// });
// var vektorlagOsloArealLovskogOgBekkedrag = new ol.layer.Vector({
//     source: vektorKildeOsloArealLovskogOgBekkedrag,
//     style: lagStilFraGeoJSON(osloArealLovskogOgBekkedragData, false),
//     name: osloArealLovskogOgBekkedragData[1]["name"],
//     uiName: osloArealLovskogOgBekkedragData[1]["uiName"],
//     stilSelect: lagStilFraGeoJSON(osloArealLovskogOgBekkedragData, true),
//     strokeColorSelect: hentOgKonverterFargeArray(osloArealLovskogOgBekkedragData, 'strokeColorSelect'),
//     fillColorSelect: hentOgKonverterFargeArray(osloArealLovskogOgBekkedragData, 'fillColorSelect'),
//     opacity: DEFAULT_OPACITY,
//     clickable: false,
//     visible: false
// });
// var kartMenyLagDictOsloArealLovskogOgBekkedrag = {
//     lagNavn: vektorlagOsloArealLovskogOgBekkedrag.get("name"),
//     uiLagNavn: vektorlagOsloArealLovskogOgBekkedrag.get("uiName"),
//     lagReferanse: vektorlagOsloArealLovskogOgBekkedrag
// }

// // Særlig viktige skogsarealer for BM

// var osloArealViktigeSkogsarealerData = ["GeoJSONdata", {
//     dataName: "osloArealViktigeSkogsarealerData",
//     data: originWithSlash + "data/oslo_areal_saerlig_viktige_skogsarealer_for_bm.geojson",
//     name: "vektorlagOsloArealViktigeSkogsarealer",
//     uiName: "Viktige skogsarealer for BM",
//     strokeColor: [0,0,0, 1],
//     fillColor: [140,0,0, 1],
//     strokeWidth: 1,
//     strokeColorSelect: [0,0,0, 1],
//     fillColorSelect: [0,0,0, 1],
//     strokeWidthSelect: 2,
//     opacity: 1,
//     clickEvent: 0,
// }];
// settFargerForLagData(osloArealViktigeSkogsarealerData, osloArealViktigeSkogsarealerData[1]["fillColor"]);

// var vektorKildeOsloArealViktigeSkogsarealer = new ol.source.Vector({
//     url: originWithSlash + "data/oslo_areal_saerlig_viktige_skogsarealer_for_bm.geojson",
//     format: geoJSONFormat,
//     features: new ol.Collection()
// });
// var vektorlagOsloArealViktigeSkogsarealer = new ol.layer.Vector({
//     source: vektorKildeOsloArealViktigeSkogsarealer,
//     style: lagStilFraGeoJSON(osloArealViktigeSkogsarealerData, false),
//     name: osloArealViktigeSkogsarealerData[1]["name"],
//     uiName: osloArealViktigeSkogsarealerData[1]["uiName"],
//     stilSelect: lagStilFraGeoJSON(osloArealViktigeSkogsarealerData, true),
//     strokeColorSelect: hentOgKonverterFargeArray(osloArealViktigeSkogsarealerData, 'strokeColorSelect'),
//     fillColorSelect: hentOgKonverterFargeArray(osloArealViktigeSkogsarealerData, 'fillColorSelect'),
//     opacity: DEFAULT_OPACITY,
//     clickable: false,
//     visible: false
// });
// var kartMenyLagDictOsloArealViktigeSkogsarealer = {
//     lagNavn: vektorlagOsloArealViktigeSkogsarealer.get("name"),
//     uiLagNavn: vektorlagOsloArealViktigeSkogsarealer.get("uiName"),
//     lagReferanse: vektorlagOsloArealViktigeSkogsarealer
// }

// BEVARINGSSKOGER, OSLO KOMMUNE

// Definere vektorlagnavnet og ui-navnet her? ...
var oksBevaringsskogerData = ["GeoJSONdata", {
    dataName: "oksBevaringsskogerData",
    data: originWithSlash + "data/oksBevaringsskoger.geojson",
    name: "vektorlagOksBevaringsskoger",
    uiName: "Bevaringsskoger, Oslo kommuneskog",
    strokeColor: [0,0,0, 1],
    fillColor: [102, 138, 138, 1],
    strokeWidth: 1,
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 0,
}];
settFargerForLagData(oksBevaringsskogerData, oksBevaringsskogerData[1]["fillColor"]);

var vektorKildeOksBevaringsskoger = new ol.source.Vector({
    // url: originWithSlash + "data/oksBevaringsskoger.geojson",
    url: oksBevaringsskogerData[1].data,
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorLagOksBevaringsskoger = new ol.layer.Vector({
    source: vektorKildeOksBevaringsskoger,
    style: new ol.style.Style({
        fill: new ol.style.Fill({color: makeStripedPattern(2, 5, 1, "rgba(26, 36, 100, 1)")}),
        stroke: new ol.style.Stroke({
          color: 'rgba(26, 36, 100, 1)',
          width: 1,
        }),
      }),
    name: "vektorlagOksBevaringsskoger",
    uiName: "Bevaringsskoger, Oslo kommuneskog",
    stilSelect: lagStilFraGeoJSON(oksBevaringsskogerData, true),
    strokeColorSelect: hentOgKonverterFargeArray(oksBevaringsskogerData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(oksBevaringsskogerData, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: false,
    visible: false
});
var kartMenyLagDictOksBevaringsskoger = {
    lagNavn: vektorLagOksBevaringsskoger.get("name"),
    uiLagNavn: vektorLagOksBevaringsskoger.get("uiName"),
    lagReferanse: vektorLagOksBevaringsskoger
}

// EIENDOM, OSLO KOMMUNE

var oksEiendomsgrenserData = ["GeoJSONdata", {
    dataName: "oksEiendomsgrenserData",
    data: originWithSlash + "data/oksEiendom.geojson",
    name: "vektorlagOksEiendomsgrenser",
    uiName: "Eiendomsgrenser, Oslo kommuneskog",
    strokeColor: [0,0,0, 1],
    fillColor: [35, 77, 133, 1],
    strokeWidth: 1,
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 0,
}];
settFargerForLagData(oksEiendomsgrenserData, oksEiendomsgrenserData[1]["fillColor"]);

var vektorKildeOksEiendomsgrenser = new ol.source.Vector({
    // url: originWithSlash + "data/oksEiendom.geojson",
    url: oksEiendomsgrenserData[1].data,
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorLagOksEiendomsgrenser = new ol.layer.Vector({
    source: vektorKildeOksEiendomsgrenser,
    style: lagStilFraGeoJSON(oksEiendomsgrenserData, false),
    name: "vektorlagOksEiendomsgrenser",
    uiName: "Eiendomsgrenser, Oslo kommuneskog",
    stilSelect: lagStilFraGeoJSON(oksEiendomsgrenserData, true),
    strokeColorSelect: hentOgKonverterFargeArray(oksEiendomsgrenserData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(oksEiendomsgrenserData, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: false,
    visible: false
});
var kartMenyLagDictOksEiendomsgrenser= {
    lagNavn: vektorLagOksEiendomsgrenser.get("name"),
    uiLagNavn: vektorLagOksEiendomsgrenser.get("uiName"),
    lagReferanse: vektorLagOksEiendomsgrenser
}

// BEVARINGSSKOGER, LØVENSKIOLD

var lovenskioldBevaringsskogerData = ["GeoJSONdata", {
    dataName: "lovenskioldBevaringsskogerData",
    data: originWithSlash + "data/lovenskiold_eget_vern.geojson",
    name: "vektorlagLovenskieldBevaringsskoger",
    uiName: "Bevaringsskoger, Løvenskiold",
    strokeColor: [0,0,0, 1],
    fillColor: [138, 102, 102, 1],
    strokeWidth: 1,
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 0,
}];
settFargerForLagData(lovenskioldBevaringsskogerData, lovenskioldBevaringsskogerData[1]["fillColor"]);

var vektorKildeLovenskioldBevaringsskoger = new ol.source.Vector({
    // url: originWithSlash + "data/lovenskiold_eget_vern.geojson",
    url: lovenskioldBevaringsskogerData[1].data,
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorLagLovenskioldBevaringsskoger = new ol.layer.Vector({
    source: vektorKildeLovenskioldBevaringsskoger,
    style: new ol.style.Style({
        fill: new ol.style.Fill({color: makeStripedPattern(2, 5, 1, "rgba(133, 35, 35, 1)")}),
        stroke: new ol.style.Stroke({
          color: 'rgba(133, 35, 35, 1)',
          width: 1,
        }),
      }),
    name: "vektorlagLovenskioldBevaringsskoger",
    uiName: "Bevaringsskoger, Løvenskiold",
    stilSelect: lagStilFraGeoJSON(lovenskioldBevaringsskogerData, true),
    strokeColorSelect: hentOgKonverterFargeArray(lovenskioldBevaringsskogerData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(lovenskioldBevaringsskogerData, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: false,
    visible: false
});
var kartMenyLagDictLovenskioldBevaringsskoger = {
    lagNavn: vektorLagLovenskioldBevaringsskoger.get("name"),
    uiLagNavn: vektorLagLovenskioldBevaringsskoger.get("uiName"),
    lagReferanse: vektorLagLovenskioldBevaringsskoger
}

// EIENDOM, LØVENSKIOLD

var lovenskioldEiendomsgrenserData = ["GeoJSONdata", {
    dataName: "lovenskioldEiendomsgrenserData",
    data: originWithSlash + "data/lovenskiold_eiendom.geojson",
    name: "vektorlagLovenskieldEiendomsgrenser",
    uiName: "Eiendomsgrenser, Løvenskiold",
    strokeColor: [0,0,0, 1],
    fillColor: [138, 102, 102, 1],
    strokeWidth: 1,
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 0,
}];
settFargerForLagData(lovenskioldEiendomsgrenserData, lovenskioldEiendomsgrenserData[1]["fillColor"]);
//
var strokeColorSelectLovenskioldEiendomsgrenser = hentOgKonverterFargeArray(lovenskioldEiendomsgrenserData, 'strokeColorSelect');
var fillColorSelectLovenskioldEiendomsgrenser = hentOgKonverterFargeArray(lovenskioldEiendomsgrenserData, 'fillColorSelect');
var stilLovenskioldEiendomsgrenser = lagStilFraGeoJSON(lovenskioldEiendomsgrenserData, false);
var stilSelectLovenskioldEiendomsgrenser = lagStilFraGeoJSON(lovenskioldEiendomsgrenserData, true);
//
var vektorKildeLovenskioldEiendomsgrenser = new ol.source.Vector({
    // url: originWithSlash + "data/lovenskiold_eiendom.geojson",
    url: lovenskioldEiendomsgrenserData[1].data,
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorLagLovenskioldEiendomsgrenser = new ol.layer.Vector({
    source: vektorKildeLovenskioldEiendomsgrenser,
    style: stilLovenskioldEiendomsgrenser,
    name: "vektorlagLovenskioldEiendomsgrenser",
    uiName: "Eiendomsgrenser, Løvenskiold",
    stilSelect: stilSelectLovenskioldEiendomsgrenser,
    strokeColorSelect: strokeColorSelectLovenskioldEiendomsgrenser,
    fillColorSelect: fillColorSelectLovenskioldEiendomsgrenser,
    opacity: DEFAULT_OPACITY,
    clickable: false,
    visible: false
});
var kartMenyLagDictLovenskioldEiendomsgrenser = {
    lagNavn: vektorLagLovenskioldEiendomsgrenser.get("name"),
    uiLagNavn: vektorLagLovenskioldEiendomsgrenser.get("uiName"),
    lagReferanse: vektorLagLovenskioldEiendomsgrenser
}

// H560 NATURMILJØ FORSLAG - KPA

var h560HensynssonerForslagData = ["GeoJSONdata", {
    dataName: "h560HensynssonerForslagData",
    data: originWithSlash + "data/h560_naturmiljo_forslag_kpa.geojson",
    name: "vektorlagH560HensynssonerForslag",
    uiName: "Eiendomsgrenser, Løvenskiold",
    strokeColor: [0,0,0, 1],
    fillColor: [0, 161, 106, 1],
    strokeWidth: 2,
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 0,
}];
settFargerForLagData(h560HensynssonerForslagData, h560HensynssonerForslagData[1]["fillColor"]);
//
var strokeColorSelectH560HensynssonerForslag = hentOgKonverterFargeArray(h560HensynssonerForslagData, 'strokeColorSelect');
var fillColorSelectH560HensynssonerForslag = hentOgKonverterFargeArray(h560HensynssonerForslagData, 'fillColorSelect');
var stilH560HensynssonerForslag= lagStilFraGeoJSON(h560HensynssonerForslagData, false);
var stilSelectH560HensynssonerForslag = lagStilFraGeoJSON(h560HensynssonerForslagData, true);

var vektorKildeH560HensynssonerForslag = new ol.source.Vector({
    // url: originWithSlash + "data/h560_naturmiljo_forslag_kpa.geojson",
    url: h560HensynssonerForslagData[1].data,
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorLagH560HensynssonerForslag = new ol.layer.Vector({
    source: vektorKildeH560HensynssonerForslag,
    style: new ol.style.Style({
        fill: new ol.style.Fill({color: makeStripedPattern(2, 5, 1, "rgba(26, 100, 36, 1)")}),
        stroke: new ol.style.Stroke({
          color: 'rgba(26, 100, 36, 1)',
          width: 1,
        }),
      }),
    name: "vektorlagH560HensynssonerForslag",
    uiName: "Foreslåtte henssynsoner - H560",
    stilSelect: lagStilFraGeoJSON(h560HensynssonerForslagData, true),
    strokeColorSelect: hentOgKonverterFargeArray(h560HensynssonerForslagData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(h560HensynssonerForslagData, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: false,
    visible: false
});
var kartMenyLagDictH560HensynssonerForslag = {
    lagNavn: vektorLagH560HensynssonerForslag.get("name"),
    uiLagNavn: vektorLagH560HensynssonerForslag.get("uiName"),
    lagReferanse: vektorLagH560HensynssonerForslag
}

// SKYGGELAG RUNDT OSLO KOMMUNE

var skyggeLagRundtOsloKommuneData = ["GeoJSONdata", {
    dataName: "skyggeLagRundtOsloKommuneData",
    data: originWithSlash + "data/Norge_25833_Kommuner_Uten_Oslo.geojson",
    name: "vektorlagSkyggeLagRundtOsloKommune",
    uiName: "Skyggelag rundt Oslo kommune",
    strokeColor: [0, 0, 0, 0.5],
    fillColor: [0, 0, 0, 0.5],
    strokeWidth: 2,
    strokeColorSelect: [0, 0, 0, 0.5],
    fillColorSelect: [0, 0, 0, 0.05],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 0,
}];

var vektorKildeSkyggeLagRundtOsloKommune = new ol.source.Vector({
    // url: originWithSlash + "data/Norge_25833_Kommuner_Uten_Oslo.geojson",
    url: skyggeLagRundtOsloKommuneData[1].data,
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorLagSkyggeLagRundtOsloKommune = new ol.layer.Vector({
    source: vektorKildeSkyggeLagRundtOsloKommune,
    style: lagStilFraGeoJSON(skyggeLagRundtOsloKommuneData, false),
    name: "vektorlagSkyggeLagRundtOsloKommune",
    uiName: "Skyggelag rundt Oslo kommune",
    stilSelect: lagStilFraGeoJSON(skyggeLagRundtOsloKommuneData, true),
    strokeColorSelect: hentOgKonverterFargeArray(skyggeLagRundtOsloKommuneData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(skyggeLagRundtOsloKommuneData, 'fillColorSelect'),
    type: "vektor_skygge",
    // redigerFarge: "nei",
    clickable: false,
    visible: false
});
var kartMenyLagDictSkyggeLagRundtOsloKommune = {
    lagNavn: vektorLagSkyggeLagRundtOsloKommune.get("name"),
    uiLagNavn: vektorLagSkyggeLagRundtOsloKommune.get("uiName"),
    lagReferanse: vektorLagSkyggeLagRundtOsloKommune
}

// Friluftslivområder - WMS
var wmsLagOsloArealFriluftslivomraader = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://kart.miljodirektoratet.no/arcgis/services/friluftsliv_kartlagt/mapserver/WMSServer",
        params: { 'LAYERS': "friluftsliv_kartlagt_verdi" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    opacity: DEFAULT_OPACITY,
    // capabilitiesURL: "https://kart.miljodirektoratet.no/arcgis/services/friluftsliv_kartlagt/mapserver/WMSServer?service=wms&request=getcapabilities",
    visible: false,
    name: "wmsLagOsloArealFriluftslivomraader",
    uiName: "Friluftslivområder",
    // minZoom: 1
});

// wmsLagOsloArealFriluftslivomraader.on('change', function(e) {
//     console.log("wmsLagOsloArealFriluftslivomraader ~ change");
//     console.log(e);
// });
wmsLagOsloArealFriluftslivomraader.on('change:extent', function(e) {
    console.log("wmsLagOsloArealFriluftslivomraader ~ change:extent");
    console.log(e);
});
wmsLagOsloArealFriluftslivomraader.on('change:maxResolution', function(e) {
    console.log("wmsLagOsloArealFriluftslivomraader ~ change:maxResolution");
    console.log(e);
});
wmsLagOsloArealFriluftslivomraader.on('change:maxZoom', function(e) {
    console.log("wmsLagOsloArealFriluftslivomraader ~ change:maxZoom");
    console.log(e);
});
wmsLagOsloArealFriluftslivomraader.on('change:minResolution', function(e) {
    console.log("wmsLagOsloArealFriluftslivomraader ~ change:minResolution");
    console.log(e);
});
wmsLagOsloArealFriluftslivomraader.on('change:minZoom', function(e) {
    console.log("wmsLagOsloArealFriluftslivomraader ~ change:minZoom");
    console.log(e);
});
wmsLagOsloArealFriluftslivomraader.on('change:opacity', function(e) {
    console.log("wmsLagOsloArealFriluftslivomraader ~ change:opacity");
    console.log(e);
});
wmsLagOsloArealFriluftslivomraader.on('change:source', function(e) {
    console.log("wmsLagOsloArealFriluftslivomraader ~ change:source");
    console.log(e);
});
wmsLagOsloArealFriluftslivomraader.on('change:visible', function(e) {
    console.log("wmsLagOsloArealFriluftslivomraader ~ change:visible");
    console.log(e);
});
wmsLagOsloArealFriluftslivomraader.on('change:zIndex', function(e) {
    console.log("wmsLagOsloArealFriluftslivomraader ~ change:zIndex");
    console.log(e);
});
wmsLagOsloArealFriluftslivomraader.on('error', function(e) {
    console.log("wmsLagOsloArealFriluftslivomraader ~ error");
    console.log(e);
});
// wmsLagOsloArealFriluftslivomraader.on('postrender', function(e) {
//     console.log("wmsLagOsloArealFriluftslivomraader ~ postrender");
//     console.log(e);
// });
// wmsLagOsloArealFriluftslivomraader.on('prerender', function(e) {
//     console.log("wmsLagOsloArealFriluftslivomraader ~ prerender");
//     console.log(e);
// });
wmsLagOsloArealFriluftslivomraader.on('propertychange', function(e) {
    console.log("wmsLagOsloArealFriluftslivomraader ~ propertychange");
    console.log(e);
});
wmsLagOsloArealFriluftslivomraader.on('sourceready', function(e) {
    console.log("wmsLagOsloArealFriluftslivomraader ~ sourceready");
    console.log(e);
});

var kartMenyLagDictOsloArealFriluftslivomraader = {
    lagNavn: "wmsLagOsloArealFriluftslivomraader",
    uiLagNavn: "Friluftslivsområder",
    lagReferanse: wmsLagOsloArealFriluftslivomraader
}

// Hovednaturtyper og elvenett - WMS
var wmsLagHovednaturtyper = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://kart.miljodirektoratet.no/arcgis/services/naturtyper_hb13/mapserver/WMSServer",
        params: { 'LAYERS': "hovednaturtype_hb13_skog" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    opacity: DEFAULT_OPACITY,
    visible: false,
    name: "wmsLagHovednaturtyper",
    uiName: "Hovedskogstyper (DN-håndbok 13)"
});
var wmsLagHovedelv = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://nve.geodataonline.no/arcgis/services/Elvenett1/MapServer/WMSServer",
        params: { 'LAYERS': "hovedelv" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    opacity: DEFAULT_OPACITY,
    visible: false,
    name: "wmsLagHovedelv",
    uiName: "Hovedelver"
});
// Innsjøer - WMS
var wmsLagInnsjoer = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://nve.geodataonline.no/arcgis/services/Innsjodatabase2/MapServer/WMSServer",
        params: { 'LAYERS': "Innsjodatabase" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    opacity: DEFAULT_OPACITY,
    visible: false,
    name: "wmsLagInnsjoer",
    uiName: "Innsjøer"
});
var kartMenyLagDictHovednaturtyper = {
    lagNavn: "wmsLagHovednaturtyper",
    uiLagNavn: "Hovedskogstyper (DN-håndbok 13)",
    lagReferanse: wmsLagHovednaturtyper
}
var kartMenyLagDictHovedelv = {
    lagNavn: "wmsLagHovedelv",
    uiLagNavn: "Hovedelver",
    lagReferanse: wmsLagHovedelv
}
var kartMenyLagDictInnsjoer = {
    lagNavn: "wmsLagInnsjoer",
    uiLagNavn: "Innsjøer",
    lagReferanse: wmsLagInnsjoer
}

// Livsmiljøflate - WMS
var wmsLagLivsmiljoFlate = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://wms.nibio.no/cgi-bin/mis?",
        params: { 'LAYERS': "Livsmiljo_flate" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    opacity: DEFAULT_OPACITY,
    visible: false,
    name: "wmsLagLivsmiljoFlate",
    uiName: "Livsmiljø, flate",
});
var kartMenyLagDictLivsmiljoFlate = {
    lagNavn: wmsLagLivsmiljoFlate.get("name"),
    uiLagNavn: wmsLagLivsmiljoFlate.get("uiName"),
    lagReferanse: wmsLagLivsmiljoFlate
}

// Livsmiljøflate - Ikke utvalgt - WMS
var wmsLagLivsmiljoFlateIkkeUtvalgt = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://wms.nibio.no/cgi-bin/mis?",
        params: { 'LAYERS': "Livsmiljo_flate_ikkeutvalgt" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    opacity: DEFAULT_OPACITY,
    visible: false,
    name: "wmsLagLivsmiljoFlateIkkeUtvalgt",
    uiName: "Livsmiljø, flate, ikke utvalgt",
});
var kartMenyLagDictLivsmiljoFlateIkkeUtvalgt = {
    lagNavn: wmsLagLivsmiljoFlateIkkeUtvalgt.get("name"),
    uiLagNavn: wmsLagLivsmiljoFlateIkkeUtvalgt.get("uiName"),
    lagReferanse: wmsLagLivsmiljoFlateIkkeUtvalgt
}

// Nøkkelbiotop - WMS
var wmsLagNokkelbiotop = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://wms.nibio.no/cgi-bin/mis?",
        params: { 'LAYERS': "Nokkelbiotop" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    opacity: DEFAULT_OPACITY,
    visible: false,
    name: "wmsLagNokkelbiotop",
    uiName: "Nøkkelbiotop",
});
var kartMenyLagDictNokkelbiotop = {
    lagNavn: wmsLagNokkelbiotop.get("name"),
    uiLagNavn: wmsLagNokkelbiotop.get("uiName"),
    lagReferanse: wmsLagNokkelbiotop
}

// Hogstklasser - WMS
var wmsLagOsloArealHogstklasser = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://wms.nibio.no/cgi-bin/skogbruksplan?VERSION=1.3.0",
        params: {
            'LAYERS': "hogstklasser",
            'SLD_VERSION': "1.1.0"
        },
        ratio: 2,
        serverType: 'mapserver'
    }),
    opacity: DEFAULT_OPACITY,
    visible: false,
    type: "wms",
    capabilitiesURL: "https://wms.nibio.no/cgi-bin/skogbruksplan?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities",
    name: "wmsLagOsloArealHogstklasser",
    uiName: "Hogstklasser av skog"
});
var kartMenyLagDictOsloArealHogstklasser = {
    lagNavn: wmsLagOsloArealHogstklasser.get("name"),
    uiLagNavn: wmsLagOsloArealHogstklasser.get("uiName"),
    lagReferanse: wmsLagOsloArealHogstklasser
}

// Aldersklasser - WMS
var wmsLagOsloArealAldersklasser = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://wms.nibio.no/cgi-bin/skogbruksplan?VERSION=1.3.0",
        params: { 
            'LAYERS': "aldersklasser_eldste_skogen" ,
            'SLD_VERSION': "1.1.0"
        },
        ratio: 2,
        serverType: 'mapserver'
    }),
    opacity: DEFAULT_OPACITY,
    type: "wms",
    visible: false,
    capabilitiesURL: "https://wms.nibio.no/cgi-bin/skogbruksplan?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities",
    name: "wmsLagOsloArealAldersklasser",
    uiName: "Aldersklasser - eldste skogen"
});
var kartMenyLagDictOsloArealAldersklasser = {
    lagNavn: wmsLagOsloArealAldersklasser.get("name"),
    uiLagNavn: wmsLagOsloArealAldersklasser.get("uiName"),
    lagReferanse: wmsLagOsloArealAldersklasser
}

// OBS! Disse vises i kartmeny-UI!
var kartMenyGruppeDictArealPlanOslo = {
    gruppeNavn: "ArealPlanOslo",
    uiGruppeNavn: "Arealplan Oslo",
    kartMenyLag: [
        kartMenyLagDictH560HensynssonerForslag,
        //
        kartMenyLagDictOsloArealFriluftslivomraader,
        //
        kartMenyLagDictHovednaturtyper,
        kartMenyLagDictLivsmiljoFlate,
        kartMenyLagDictLivsmiljoFlateIkkeUtvalgt,
        kartMenyLagDictNokkelbiotop,
        //
        kartMenyLagDictOsloArealHogstklasser,
        kartMenyLagDictOsloArealAldersklasser,
        // Skrudd av pga. har ikke tillatelse til å vise.
        // kartMenyLagDictOsloArealLovskogOgBekkedrag,
        // kartMenyLagDictOsloArealFuruskog,
        // kartMenyLagDictOsloArealGranskog,
        // kartMenyLagDictOsloArealViktigeSkogsarealer,
        //
        kartMenyLagDictLovenskioldEiendomsgrenser,
        kartMenyLagDictLovenskioldBevaringsskoger,
        kartMenyLagDictOksEiendomsgrenser,
        kartMenyLagDictOksBevaringsskoger,
        // kartMenyLagDictH560HensynssonerForslag,
        //
        kartMenyLagDictHovedelv,
        kartMenyLagDictInnsjoer,
        //
        kartMenyLagDictSkyggeLagRundtOsloKommune,
    ]
}
// OBS! Disse vises i map-objektet!
var mapGruppeArealPlanOslo = new ol.layer.Group({
    name: kartMenyGruppeDictArealPlanOslo["gruppeNavn"],
    opacity: 1,
    visible: true,
    layers: [
        vektorLagH560HensynssonerForslag,
        //
        wmsLagOsloArealFriluftslivomraader,
        //
        wmsLagHovednaturtyper,
        wmsLagLivsmiljoFlate,
        wmsLagLivsmiljoFlateIkkeUtvalgt,
        wmsLagNokkelbiotop,
        //
        wmsLagOsloArealHogstklasser,
        wmsLagOsloArealAldersklasser,
        //
        // vektorlagOsloArealLovskogOgBekkedrag,
        // vektorlagOsloArealFuruskog,
        // vektorlagOsloArealGranskog,
        // vektorlagOsloArealViktigeSkogsarealer,
        //
        vektorLagLovenskioldEiendomsgrenser,
        vektorLagLovenskioldBevaringsskoger,
        vektorLagOksEiendomsgrenser,
        vektorLagOksBevaringsskoger,
        // vektorLagH560HensynssonerForslag,
        //
        wmsLagHovedelv,
        wmsLagInnsjoer,
        // Skyggelaget til slutt
        vektorLagSkyggeLagRundtOsloKommune,
    ]
  });

// *********************************************************************
// MENYDICT (ALLE KOMBINERT)
// *********************************************************************

// SETTE UI KARTMENY-REKKEFØLGEN HER!:
// Denne er for kartmeny UI, og her er bakgrunnskartene nederst.

kartMenyMasterListe.push(kartMenyGruppeDictNaturopplevelser);
kartMenyMasterListe.push(kartMenyGruppeDictArealPlanOslo);
kartMenyMasterListe.push(kartMenyGruppeDictForvaltningsforslag);
kartMenyMasterListe.push(kartMenyGruppeDictVerneforslag);
kartMenyMasterListe.push(kartMenyGruppeDictVerneomraader);
// kartMenyMasterListe.push(kartMenyGruppeDictGeometri); // NOTE: Disable for nå? Ikke brukt?
kartMenyMasterListe.push(kartMenyGruppeDictBakgrunnskart);

// mesterGruppen har en annen rekkefølge!
// Denne består av kartlag i en layer.Group. Her skal bakgrunnskart legges til først (nederst i kartlag-stacken).
// Brukerskapte figurer skal legges til slutt (øverst av kartlag-stacken).
  var mesterGruppe = new ol.layer.Group({
    name: "MesterGruppe",
    opacity: 1,
    visible: true,
    layers: [
      mapGruppeBakgrunnskart,
      mapGruppeNaturopplevelser,
      mapGruppeArealPlanOslo,
      mapGruppeVerneomrader,
      mapGruppeVerneforslag,
      mapGruppeForvaltningsforslag,
      mapGruppeGeometri
    ]
  });

// Hm... Kanskje burde gjøre dem til Dict? F.eks. for å gjøre kartMenyMasterListe["Geometri"]?
// Men kanskje ikke nødvendig?

// console.log("kartMenyMasterListe er klar! (Brukes til bygginga av HTML)");

for (var e = 0; e < kartMenyMasterListe.length; e++) {
    // console.log(kartMenyMasterListe[e]);

    // console.log("gruppeNavn: " + kartMenyMasterListe[e]["gruppeNavn"]);
    var kartlag = kartMenyMasterListe[e]["kartMenyLag"];
    for (var f = 0; f < kartlag.length; f++) {
        // console.log(kartlag[f]);

        // console.log("lagNavn: " + kartlag[f]["lagNavn"]);
        var ref = kartlag[f]["lagReferanse"];
        if(ref != null){
            // console.log("LagReferanse: " + ref.get("name"));
            // console.log( kartlag[f]);
        } else {
            // console.log("ref for " + kartlag[f]["lagNavn"] + " er null.");
        }
    }
}

function finnIndexForGruppe(inputGruppeNavn){
    for (var i = 0; i < kartMenyMasterListe.length; i++) {
        if(kartMenyMasterListe[i]["gruppeNavn"] == inputGruppeNavn){
            return i;
        }
    }
    return -1;
}

function settInnKartlagIMasterListe(inputLagNavn, inputKartlag){
    for (var e = 0; e < kartMenyMasterListe.length; e++) {
        // console.log(kartMenyMasterListe[e]);
        var kartlag = kartMenyMasterListe[e]["kartMenyLag"];
        for (var f = 0; f < kartlag.length; f++) {
            var lagNavn = kartlag[f]["lagNavn"];
            // console.log(lagNavn);
            if(lagNavn == inputLagNavn){
                // console.log("settInnKartlagIMasterListe ~ lagNavn: " + lagNavn + ", inputLagNavn: " + inputLagNavn);
                // console.log(inputKartlag);
                kartlag[f]["lagReferanse"] = inputKartlag;
            }
        }
    }
}

// Søk i Masterlisten med navnet på kartlaget (string).
function hentKartlagIMasterListe(inputLagNavn) {
    // console.log("hentKartlagIMasterListe ~ inputLagNavn: " + inputLagNavn);
    for (var e = 0; e < kartMenyMasterListe.length; e++) {
        // console.log(kartMenyMasterListe[e]);
        var kartlag = kartMenyMasterListe[e]["kartMenyLag"];
        for (var f = 0; f < kartlag.length; f++) {
            var lagNavn = kartlag[f]["lagNavn"];
            // console.log(lagNavn);
            if(lagNavn == inputLagNavn){
                // console.log("hentKartlagIMasterListe ~ lagNavn: " + lagNavn + ", inputLagNavn: " + inputLagNavn);
                // Hvis lagReferanse ikke eksisterer eller definert, returneres null.
                return kartlag[f]["lagReferanse"];
            }
        }
    }
    return null;
}

// *********************************************************************
// KLIKKBARE LAG TIL ARRAY
// *********************************************************************

// Alle de klikkbare lagene skal til én array.

// NOTE: Brukes ikke, men viser hvordan man itererer en dictionary.

// // Første itererer menyDict keys og values. F.eks. "naturopplevelser".
// for (const [key, value] of Object.entries(menyDict)) {
//     // Andre itererer keys i alle menyDict entriene, altså name, dict, type.
//     for (const [key2, value] of Object.entries(menyDict[key])) {
//         //
//     }
// }

// Hvor rgba er en string, f.eks: rgba(0,0,0,1); // black
// Sigh... Enklere med enkelte parametre.
function setteNyFargeForKeyGeoJSON(geojson, dictKey, r, g, b, a) {
    // Hm, kunne sjekke at r, g, b er integer, mens a er double?
    var fargeListe = [r, g, b, a];
    try {
        geojson[1][dictKey] = fargeListe;
        return geojson;
    } catch (error) {
        return geojson;
    }
    return geojson;
}

function justerFargeAlphaForGeoJSON(geojson) {
    try {
        geojson[1]["strokeColor"][3] = 1;
        geojson[1]["fillColor"][3] = 0.15;
        geojson[1]["strokeColorSelect"][3] = 1;
        geojson[1]["fillColorSelect"][3] = 0.3;
        return geojson;
    } catch (error) {
        return geojson; // Returnerer bare samme som input.
    }
}

// Trenger keys "fillColor", "strokeColor" og "strokeWidth", ellers returnerer null.
function lagStilFraGeoJSON(geojson, erSelectStil) {
    var style;

    if (!erSelectStil) {

        try {

            style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: geojson[1]["fillColor"]
                }),
                stroke: new ol.style.Stroke({
                    color: geojson[1]["strokeColor"],
                    width: geojson[1]["strokeWidth"]
                }),
            });

            return style;

        } catch (error) {
            // Returnere default istedenfor null.
            return defaultLayerStyle;
            // return null;
        }

    } else {

        try {

            style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: geojson[1]["fillColorSelect"]
                }),
                stroke: new ol.style.Stroke({
                    color: geojson[1]["strokeColorSelect"],
                    width: geojson[1]["strokeWidthSelect"]
                }),
            });

            return style;
        } catch (error) {
            // Returnere default istedenfor null.
            return defaultLayerSelectStyle;
            // return null;
        }

    }
    // I tilfelle koden kommer hit, siden det har skjedd før med en annen funksjon...
    if(!erSelectStil){
        return defaultLayerStyle
    } else {
        return defaultLayerSelectStyle;
    }
    // return null; // Unreachable?
}

// Egentlig nesten identisk med lagStilFraGeoJSON, bortsett fra lineDash i funksjonen under.
function lagDashedStilFraGeoJSON(geojson, erSelectStil){
    var style;

    if (!erSelectStil) {

        try {

            style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: geojson[1]["fillColor"]
                }),
                stroke: new ol.style.Stroke({
                    color: geojson[1]["strokeColor"],
                    width: geojson[1]["strokeWidth"],
                    // lineDash: [1.0, 5]
                    lineDash: [2.0, 7]
                }),
            });

            return style;

        } catch (error) {
            // returner default istedenfor null her.
            return defaultLayerDashedStyle;
            // return null;
        }

    } else {

        try {

            style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: geojson[1]["fillColorSelect"]
                }),
                stroke: new ol.style.Stroke({
                    color: geojson[1]["strokeColorSelect"],
                    width: geojson[1]["strokeWidthSelect"],
                    // lineDash: [1.0, 5]
                    lineDash: [1.0, 7]
                }),
            });

            return style;
        } catch (error) {
            // Returnere default istedenfor null her.
            return defaultLayerDashedSelectStyle;
            // return null;
        }

    }
    // I tilfelle koden kommer hit, siden det har skjedd før med en annen funksjon...
    if(!erSelectStil){
        return defaultLayerDashedStyle;
    } else {
        return defaultLayerDashedSelectStyle;
    }
    // return null; // Unreachable?
}

function hentOgKonverterFargeArray(geojson, dictKey) {
    // dictKey kan bare være strokeColorSelect eller fillColorSelect.
    if (dictKey == "strokeColorSelect" || dictKey == "fillColorSelect") {
        var fargeArray = geojson[1][dictKey];
        if (fargeArray != null) {
            return "rgba(" + fargeArray[0] + ", " + fargeArray[1] + ", " + fargeArray[2] + ", " + fargeArray[3] + ")";
        } else {
            // Returnere defaults.
            if(dictKey == "strokeColorSelect"){
                return defaultFargeStroke;
            } else {
                return defaultFargeFill;
            }
            return null;
        }
    } else {
        return null;
    }
}

// For rediger farge for aktive lag
function hentOgKonverterFargeArrayRGB(fargeArray){
    if(fargeArray != null){
        return "rgb(" + fargeArray[0] + ", " + fargeArray[1] + ", " + fargeArray[2] + ")";
    }
    return null;
}

// STRIPETE MØNSTER: START

function createStripedPattern(lineWidth, spacing, slope, color) {
    const can = document.createElement('canvas');
    const len = Math.hypot(1, slope);
    
    const w = can.width = 1 / len + spacing + 0.5 | 0; // round to nearest pixel              
    const h = can.height = slope / len + spacing * slope + 0.5 | 0; 

    const ctx = can.getContext('2d'); 
    ctx.strokeStyle = color; 
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    // Line through top left and bottom right corners
    ctx.moveTo(0, 0);
    ctx.lineTo(w, h);
    // Line through top right corner to add missing pixels
    ctx.moveTo(0, -h);
    ctx.lineTo(w * 2, h);
    // Line through bottom left corner to add missing pixels
    ctx.moveTo(-w, 0);
    ctx.lineTo(w, h * 2);
    
    ctx.stroke();
    return ctx.createPattern(can, 'repeat');
    // Skjønner ikke hvorfor denne trenger å bruke return.
    // Hvis return blir tatt bort blir det feil...
  };

  // Tror jeg kan ta bort return canvas, men ha den i tilfelle...
  function fillWithPattern(canvas, pattern, inset = 0) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(inset, inset, canvas.width - inset * 2, canvas.height - inset * 2);
    ctx.fillStyle = pattern;
    ctx.fillRect(inset, inset, canvas.width - inset * 2, canvas.height - inset * 2);
    return canvas;
  }

// Bare bruk denne funksjonen. Den bruker både createStripedPattern og fillWithPattern.
// Eks: makeStripedPattern(2, 5, 1, "rgba(85, 187, 107, 1)")
// Denne skal returnere "pattern".
function makeStripedPattern(lineWidth, spacing, slope, color){
    // Canvas for det stripete mønsteret.
    const patternCanvas = document.createElement("canvas");
    fillWithPattern(patternCanvas, createStripedPattern(lineWidth, spacing, slope, color));
    // Canvas som holder mønsteret.
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const pattern = ctx.createPattern(patternCanvas, "repeat")
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return pattern;
}

// STRIPETE MØNSTER: END

// Tar inn en feature rute og returnerer eventuelt et ikon for ruten, hvis den fant den i ikon-kartlaget.
function hentIkonForRute(rute, ikonKartlag){
    const ruteNavn = hentFeatureNavnMedBackup(rute);

    console.log("hentIkonForRute ~ For rute: " + ruteNavn);

    const source = ikonKartlag.getSource();
    // console.log("source: ");
    // console.log(source);
    const features = source.getFeatures();
    // console.log("features: ");
    // console.log(features);
    const sourceFeatures = source.getSource().getFeatures();
    // console.log("sourceFeatures: ");
    // console.log(sourceFeatures);

    let ikonFeature = null;

    if(sourceFeatures){

        // console.log("sourceFeatures funker denne gangen?!");

        for(var i = 0; i < sourceFeatures.length; i++){
            const ikonF = sourceFeatures[i];
            const navn = ikonF.get("featureRuteNavn");
            if(ruteNavn == navn){
                // console.log("Fant ikon feature med rute navnet!");
                return ikonF;
            }
        }

    } else {

        // console.log("sourceFeatures er null. Prøve med features...");

        for(var i = 0; i < features.length; i++){
            const featureGroup = features[i].get("features");
            // console.log(featureGroup);
            for(j = 0; j < featureGroup.length; j++){
                const ikonF = featureGroup[j];
                const navn = ikonF.get("featureRuteNavn");
                if(ruteNavn == navn){
                    // console.log("Fant ikon feature med rute navnet!");
                    return ikonF;
                }
            }
        }

    }

    return ikonFeature;
}

/* 
MIDLERTIDIGE KARTLAG
*/

// Midlertidige ikon-kartlaget

var midlertidigFeatureIconsCollection = new ol.Collection();

var vektorKildeMidlertidigIkoner = new ol.source.Vector({
  format: geoJSONFormat,
  features: midlertidigFeatureIconsCollection
})

var vektorKildeMidlertidigCluster = new ol.source.Cluster({
  source: vektorKildeMidlertidigIkoner,
  distance: 20,
  minDistance: 0
})

var vektorlagMidlertidigIkoner = new ol.layer.Vector({
source: vektorKildeMidlertidigCluster,
name: "vektorlagMidlertidigIkoner",
uiName: "Midlertidige ikoner",
type: "ikonLag",
clickable: true,
opacity: 0.9,
visible: true,
zIndex: 1000, // For at ikoner alltid skal komme over andre kartlag.
style: function (feature) {
    var currentFeatures = feature.get('features');
    var stilListe = [];
    for(var i = 0; i < currentFeatures.length; i++){
        stilListe.push(currentFeatures[i].get("ikonStil"));
    }
    return stilListe;
},
ruteKartlagNavn: "vektorLagMidlertidig", // Kan så hente kartlaget med navnet.
})

// Midlertidige rute-kartlaget

var midlertidigFeatureCollection = new ol.Collection();

var vektorKildeMidlertidig = new ol.source.Vector({
  format: geoJSONFormat,
  features: midlertidigFeatureCollection
});

var vektorLagMidlertidig = new ol.layer.Vector({
  source: vektorKildeMidlertidig,
  name: "vektorLagMidlertidig",
  uiName: "Midlertidig vektorlag",
  type: "ruteLag",
  // Stiler fra kalender ruter
  stilSelect: lagStilFraGeoJSON(kalenderRuter2021Data, true),
  strokeColorSelect: hentOgKonverterFargeArray(kalenderRuter2021Data, 'strokeColorSelect'),
  fillColorSelect: hentOgKonverterFargeArray(kalenderRuter2021Data, 'fillColorSelect'),
  stilDashed: lagDashedStilFraGeoJSON(kalenderRuter2021Data, false),
  stilDashedSelect: lagDashedStilFraGeoJSON(kalenderRuter2021Data, true),
  // Prøve ekstra styles her for gradene: lett, middels, vanskelig
  lettStil: lagStilFraGeoJSON(ikonerLettDummyData, false),
  lettStilSelect: lagStilFraGeoJSON(ikonerLettDummyData, true),
  lettStrokeColorSelect: hentOgKonverterFargeArray(ikonerLettDummyData, 'strokeColorSelect'),
  lettFillColorSelect: hentOgKonverterFargeArray(ikonerLettDummyData, 'fillColorSelect'),
  lettStilDashed: lagDashedStilFraGeoJSON(ikonerLettDummyData, false),
  lettStilDashedSelect: lagDashedStilFraGeoJSON(ikonerLettDummyData, true),
  //
  middelsStil: lagStilFraGeoJSON(ikonerMiddelsDummyData, false),
  middelsStilSelect: lagStilFraGeoJSON(ikonerMiddelsDummyData, true),
  middelsStrokeColorSelect: hentOgKonverterFargeArray(ikonerMiddelsDummyData, 'strokeColorSelect'),
  middelsFillColorSelect: hentOgKonverterFargeArray(ikonerMiddelsDummyData, 'fillColorSelect'),
  middelsStilDashed: lagDashedStilFraGeoJSON(ikonerMiddelsDummyData, false),
  middelsStilDashedSelect: lagDashedStilFraGeoJSON(ikonerMiddelsDummyData, true),
  //
  vanskeligStil: lagStilFraGeoJSON(ikonerVanskeligDummyData, false),
  vanskeligStilSelect: lagStilFraGeoJSON(ikonerVanskeligDummyData, true),
  vanskeligStrokeColorSelect: hentOgKonverterFargeArray(ikonerVanskeligDummyData, 'strokeColorSelect'),
  vanskeligFillColorSelect: hentOgKonverterFargeArray(ikonerVanskeligDummyData, 'fillColorSelect'),
  vanskeligStilDashed: lagDashedStilFraGeoJSON(ikonerVanskeligDummyData, false),
  vanskeligStilDashedSelect: lagDashedStilFraGeoJSON(ikonerVanskeligDummyData, true),
  //
  larsMonsenStil: lagStilFraGeoJSON(ikonerLarsMonsenDummyData, false),
  larsMonsenStilSelect: lagStilFraGeoJSON(ikonerLarsMonsenDummyData, true),
  larsMonsenStrokeColorSelect: hentOgKonverterFargeArray(ikonerLarsMonsenDummyData, 'strokeColorSelect'),
  larsMonsenFillColorSelect: hentOgKonverterFargeArray(ikonerLarsMonsenDummyData, 'fillColorSelect'),
  larsMonsenStilDashed: lagDashedStilFraGeoJSON(ikonerLarsMonsenDummyData, false),
  larsMonsenStilDashedSelect: lagDashedStilFraGeoJSON(ikonerLarsMonsenDummyData, true),
  //
  fridjofNansenStil: lagStilFraGeoJSON(ikonerFridjofNansenDummyData, false),
  fridjofNansenStilSelect: lagStilFraGeoJSON(ikonerFridjofNansenDummyData, true),
  fridjofNansenStrokeColorSelect: hentOgKonverterFargeArray(ikonerFridjofNansenDummyData, 'strokeColorSelect'),
  fridjofNansenFillColorSelect: hentOgKonverterFargeArray(ikonerFridjofNansenDummyData, 'fillColorSelect'),
  fridjofNansenStilDashed: lagDashedStilFraGeoJSON(ikonerFridjofNansenDummyData, false),
  fridjofNansenStilDashedSelect: lagDashedStilFraGeoJSON(ikonerFridjofNansenDummyData, true),
  //
  ukjentStil: lagStilFraGeoJSON(ikonerUkjentDummyData, false),
  ukjentStilSelect: lagStilFraGeoJSON(ikonerUkjentDummyData, true),
  ukjentStrokeColorSelect: hentOgKonverterFargeArray(ikonerUkjentDummyData, 'strokeColorSelect'),
  ukjentFillColorSelect: hentOgKonverterFargeArray(ikonerUkjentDummyData, 'fillColorSelect'),
  ukjentStilDashed: lagDashedStilFraGeoJSON(ikonerUkjentDummyData, false),
  ukjentStilDashedSelect: lagDashedStilFraGeoJSON(ikonerUkjentDummyData, true),
  //
  zIndex: 100,
  opacity: DEFAULT_OPACITY,
  ikonLag: vektorlagMidlertidigIkoner, // Referanse til ikon-kartlag!
  clickable: true,
  visible: true
});

// 

// Hm, for naturstier også?
// Hm, bytte til kartlagType?
// function visInfoSideProgrammatisk(erKalenderTur){
function visInfoSideProgrammatisk(){
    // if(!map){
    //     console.log("visInfoSideProgrammatisk ~ Ops, kartobjektet er ikke definert enda. For tidlig!");
    //     return;
    // }

    // if(infoSideStartFullfort){
    //     console.log("visInfoSideProgrammatisk ~ er allerede kjørt. Returnerer!");
    //     return;
    // }

    const kartlag = hentKartlagMedLagNavn(infoSideKartlagNavnFraUrl);
    // console.log("visInfoSideProgrammatisk ~ kartlag: ");
    // console.log(kartlag);

    // const features = kartlag.getFeatures();
    const features = kartlag.getSource().getFeaturesCollection().getArray();
    // console.log("visInfoSideProgrammatisk ~ features: ");
    // console.log(features);

    let feature;
    let featureNavn;

    for(var i = 0; i < features.length; i++){
        const f = features[i];
        const navn = hentFeatureNavnMedBackup(f);
        if(navn == infoSideFeatureNavnFraUrl){
            feature = f;
            featureNavn = navn;
            console.log("visInfoSideProgrammatisk ~ Fant feature! navn: " + navn);
            // console.log(feature);
        }
    }

    let kartlagType = feature.get("kartlagType")

    // Hvis både feature og kartlag ble funnet, kan vi åpne info siden!
    // Må ha definert kartlagType.
    if(feature && kartlag && kartlagType){

        infoSideStartFullfort = true; // Eventuelt stoppe her, siden det er koden under som gjør noe endring.

        console.log(`visInfoSideProgrammatisk ~ kartlagType: ${kartlagType}`)

        switch(kartlagType){
            case "kalender_tur": 
                const stipletter = feature.get("stipletter");
                visFeatureInfoSide(feature, featureNavn, kartlag, stipletter, false);
            break;
            case "natursti": 
                visFeatureInfoSide(feature, featureNavn, kartlag, null, false);
            break;
            case "omraade":
                // Definerer disse variablene her for å sette selection med dem etter at map er klar.
                // omraadeFeatureFraUrl = feature;
                // omraadeKartlagFraUrl = kartlag;
                // console.log("visInfoSideProgrammatisk ~ definert omraadeFeatureFraUrl og omraadeKartlagFraUrl.");
                
                // Hm, var redd for race condition, men ser ut til å funke? ...
                selectRute(feature, kartlag, null);
                visFeatureInfoSide(feature, featureNavn, kartlag, null, false);
            break;
            default: 
                visFeatureInfoSide(feature, featureNavn, kartlag, null, false);
            break;
        }

        // if(erKalenderTur){
        //     // console.log("visInfoSideProgrammatisk ~ erKalenderTur er sann! feature: ");
        //     // console.log(feature);
        //     const stipletter = feature.get("stipletter");
        //     // console.log("visInfoSideProgrammatisk ~ stipletter: ");
        //     // console.log(stipletter);
        //     visFeatureInfoSide(feature, featureNavn, kartlag, stipletter, false);
        // } else {
        //     // Hm, kan den funke for område kartlag også?
        //     visFeatureInfoSide(feature, featureNavn, kartlag, null, false);
        // }

    }
}

function kalkulerFaktiskTekstLengde(tekst){
    // console.log(`kalkulerFaktiskTekstLengde ~~ tekst: ${tekst}`)
    let faktiskTekst = tekst;
    // faktiskTekst = faktiskTekst.replaceAll("\n","<br/>"); // Lager linjeskifte i HTML.
    faktiskTekst = faktiskTekst.replaceAll("\n",""); // Ta bort tegnene for linjeskift.
    let lenkeTekstStartIndeks = faktiskTekst.indexOf("[[", 0);
    while(lenkeTekstStartIndeks > -1){
        const lenkeStartMedParanteser = lenkeTekstStartIndeks;
        const lenkeSluttMedParanteser = faktiskTekst.indexOf("))", lenkeTekstStartIndeks) + 2;
        // console.log("lenkeStartMedParanteser: " + lenkeStartMedParanteser + ", lenkeSluttMedParanteser: " + lenkeSluttMedParanteser);
    
        const sub = faktiskTekst.substring(lenkeStartMedParanteser, lenkeSluttMedParanteser);
    
        // Bruke sub til å hente lenkeTekst og lenke
        const lenkeTekstStart = 2; // Gå forbi brackets i starten
        const lenkeTekstSlutt = sub.indexOf("]]");
        const lenkeTekst = sub.substring(lenkeTekstStart, lenkeTekstSlutt);
        // console.log("lenkeTekst: " + lenkeTekst);
    
        const lenkeStart = sub.indexOf("((") + 2; // Hm, kan evt. ta lenkeTekstSlutt + 4?
        const lenkeSlutt = sub.indexOf("))");
        const lenke = sub.substring(lenkeStart, lenkeSlutt);
        // console.log("lenke: " + lenke);;
    
        faktiskTekst = faktiskTekst.replace(sub, lenkeTekst);
    
        // Ser etter nye lenker og oppdaterer lenkeTekstStartIndeks.
        lenkeTekstStartIndeks = faktiskTekst.indexOf("[[", lenkeTekstStartIndeks);
      }
      // console.log(`faktiskTekst: ${faktiskTekst}`)
      // return faktiskTekst;
      return faktiskTekst.length;
}

function lagHTMLTekst(tekst, fontSize){
    let tekstHTML = tekst;
    tekstHTML = tekstHTML.replaceAll("\n","<br/>"); // Lager linjeskifte i HTML.
  
    let lenkeTekstStartIndeks = tekstHTML.indexOf("[[", 0);
    while(lenkeTekstStartIndeks > -1){
      const lenkeStartMedParanteser = lenkeTekstStartIndeks;
      const lenkeSluttMedParanteser = tekstHTML.indexOf("))", lenkeTekstStartIndeks) + 2;
      // console.log("lenkeStartMedParanteser: " + lenkeStartMedParanteser + ", lenkeSluttMedParanteser: " + lenkeSluttMedParanteser);
  
      const sub = tekstHTML.substring(lenkeStartMedParanteser, lenkeSluttMedParanteser);
  
      // Bruke sub til å hente lenkeTekst og lenke
      const lenkeTekstStart = 2; // Gå forbi brackets i starten
      const lenkeTekstSlutt = sub.indexOf("]]");
      const lenkeTekst = sub.substring(lenkeTekstStart, lenkeTekstSlutt);
      // console.log("lenkeTekst: " + lenkeTekst);
  
      const lenkeStart = sub.indexOf("((") + 2; // Hm, kan evt. ta lenkeTekstSlutt + 4?
      const lenkeSlutt = sub.indexOf("))");
      const lenke = sub.substring(lenkeStart, lenkeSlutt);
      // console.log("lenke: " + lenke);
  
      // Obs, merk at teksten til lenken blir satt til tekststørrelse medium inline.
      // Kunne muligens lønne seg å gå over til HTML-struktur i teksten.
      let lenkeHTML = "";
      switch(fontSize){
        case "small": 
        lenkeHTML = "<a href='" + lenke + "' target='_blank' style='font-size: small' title='" + lenkeTekst + "'>" + lenkeTekst + "</a>";
        break;
        case "medium": 
        lenkeHTML = "<a href='" + lenke + "' target='_blank' style='font-size: medium' title='" + lenkeTekst + "'>" + lenkeTekst + "</a>";
        break;
        default: 
        lenkeHTML = "<a href='" + lenke + "' target='_blank' style='font-size: medium' title='" + lenkeTekst + "'>" + lenkeTekst + "</a>";
        break;
      }
      // const lenkeHTML = "<a href='" + lenke + "' target='_blank' style='font-size: medium' title='" + lenkeTekst + "'>" + lenkeTekst + "</a>";
        //   const lenkeHTML = "<a href='" + lenke + "' target='_blank' style='font-size: 14px;' title='" + lenkeTekst + "'>" + lenkeTekst + "</a>";
        // const lenkeHTML = "<a href='" + lenke + "' target='_blank' title='" + lenkeTekst + "'>" + lenkeTekst + "</a>";
        // console.log(lenkeHTML);
  
      tekstHTML = tekstHTML.replace(sub, lenkeHTML);
  
      // Ser etter nye lenker og oppdaterer lenkeTekstStartIndeks.
      lenkeTekstStartIndeks = tekstHTML.indexOf("[[", lenkeTekstStartIndeks);
    }

    return tekstHTML;
}

// Lage en funksjon for all koden i "addfeature" og "featuresloadedend"
// Denne funksjonen skal kjøres for alle område-vektorlag.
function forberedFaktasiderForOmraadeVektorlag(kartlag, aktiverFaktasider) {
    const kilde = kartlag.getSource();
    if(!kilde) return; // Ikke gjøre noe hvis "kartlag" ikke har en kilde.

    const kartlagNavn = kartlag.get("name");

    kilde.on("addfeature", function (props) {
        // Bare legge til kartlagType, hvis den er aktivert.
        if(aktiverFaktasider){
            props.feature.set("kartlagType", "omraade"); 
        }
        // props.feature.set("kartlagType", "omraade");
        // Kalkulere areal
        // Alle features har geometri, men kanskje bør sjekke for sikkerhetsskyld.
        const geometri = props.feature.get("geometry");
        if(geometri){
            props.feature.set("arealKm2", kalkulerArealIKvadratmeter(geometri));
        }
        const tekst = props.feature.get("tekst");
        if (tekst) {
            props.feature.set("tekstHTML", lagHTMLTekst(tekst, "medium"))
        }
        // Hoved bilde beskrivelse
        const hovedBildeBeskrivelse = props.feature.get("hoved_bilde_beskrivelse");
        if(hovedBildeBeskrivelse){
            props.feature.set("hoved_bilde_beskrivelseHTML", lagHTMLTekst(hovedBildeBeskrivelse, "small"))
        }
        // Ingress
        const ingress = props.feature.get("ingress");
        if(ingress){
            props.feature.set("ingressHTML", lagHTMLTekst(ingress, "medium"))
            props.feature.set("ingressLengde", kalkulerFaktiskTekstLengde(ingress));
            // console.log(`faktiskIngressLengde: ${kalkulerFaktiskTekstLengde(ingress)}`)
        }
        // console.log(props.feature)
        // console.log(`${kartlagNavn} ~ addfeature ~ featureNavn: ${hentFeatureNavnMedBackup(props.feature)}`)
    })
    // Callback når features er ferdig lastet
    kilde.on("featuresloadend", function (props) {
        // console.log(`${kartlagNavn} ~ features er ferdig loadet!`)
        if (infoSideFeatureNavnFraUrl && infoSideKartlagNavnFraUrl) {
            if (infoSideKartlagNavnFraUrl == kartlagNavn) {
                // console.log(`${kartlagNavn} Kjører visInfoSideProgrammatisk!"`);
                // visInfoSideProgrammatisk(false);
                visInfoSideProgrammatisk();
            }
        }
    })
}