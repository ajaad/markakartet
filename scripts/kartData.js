
// URL PARAMETERS

const url = window.location.search;
console.log(url);

const urlParameters = new URLSearchParams(url);
console.log(urlParameters);

for (var entry of urlParameters.entries()) {
    console.log(entry);
}

// Definerer den her bare. Aktive kartlag fra URL:
var lagListeFraURL;

// Add coordinate available systems 

// 
const defaultCoordSysFull = "EPSG:4236";
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
    //
    name: "vektorLagGeometri",
    // uiName: "Geometri",
    uiName: "Former ved deling",
    kode: "geo",
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
    kode: "gps",
    visible: false
});

// Felles for GeoJSON vektorkildene (ol.source.Vector):

var geoJSONFormat = new ol.format.GeoJSON({
    dataProjection: "EPSG:25832",
    featureProjection: 'EPSG:3857'
});

// Hm, idé for laging av UI kartmeny. Liste med dictionaries for gruppene som har en liste med layers.
// Kan gjøre det med bare lister også.
var kartMenyMasterListe = [];

var kartMenyLagDictGeometri = {
    // lagNavn: "vektorLagGeometri",
    // uiLagNavn: "Geometri",
    lagNavn: vektorLagGeometri.get("name"),
    uiLagNavn: vektorLagGeometri.get("uiName"),
    lagReferanse: vektorLagGeometri
}

var kartMenyLagDictGPS = {
    lagNavn: vektorLagGPS.get("name"),
    uiLagNavn: vektorLagGPS.get("uiName"),
    lagReferanse: vektorLagGPS
}

var kartMenyGruppeDictGeometri = {
    gruppeNavn: "Geometri",
    // uiGruppeNavn: "Geometri",
    uiGruppeNavn: "Brukerformer",
    kartMenyLag: [
        kartMenyLagDictGeometri,
        // kartMenyLagDictGPS
    ]
}

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
        kode: "t4",
        opacity: 1,
        visible: false
    },
    "dataTopo4WMTSgraa": {
        capabilityURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities",
        kartlagWMTS: "topo4graatone",
        name: "dataTopo4WMTSgraa",
        kartlagNavn: "bakgrunnskartTopoGraa",
        kode: "t4g",
        opacity: 1,
        visible: false
    },
    "dataNorgeIBilderWMTS": {
        capabilityURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities",
        kartlagWMTS: "Nibcache_web_mercator_v2",
        name: "dataNorgeIBilderWMTS",
        kartlagNavn: "bakgrunnskartNorgeIBilder",
        kode: "nib",
        opacity: 1,
        visible: false
    },
    "dataEnkelBakgrunnWMTS": {
        capabilityURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities",
        kartlagWMTS: "bakgrunnskart_forenklet",
        name: "dataEnkelBakgrunnWMTS",
        kartlagNavn: "bakgrunnskartEnkel",
        kode: "enk",
        opacity: 1,
        visible: false
    },
}

var bakgrunnskartOSM = new ol.layer.Tile({
    source: new ol.source.OSM(),
    // Kan jeg sette navnet her? ...
    name: "bakgrunnskartOSM",
    kode: "osm",
    visible: false
});

// EE

var kartMenyLagDictOSM = {
    lagNavn: "bakgrunnskartOSM",
    uiLagNavn: "OpenStreetMap (OSM)",
    lagReferanse: bakgrunnskartOSM
}
var kartMenyLagDictTopo4 = {
    lagNavn: "bakgrunnskartTopo4",
    // uiLagNavn: "Toporaster4",
    uiLagNavn: "Topografisk",
    lagReferanse: bakgrunnskartTopo4
}
var kartMenyLagDictTopo4Graa = {
    lagNavn: "bakgrunnskartTopoGraa",
    // uiLagNavn: "Toporaster4 grå",
    uiLagNavn: "Topografisk, grå",
    lagReferanse: bakgrunnskartTopoGraa
}
var kartMenyLagDictNorgeIBilder = {
    lagNavn: "bakgrunnskartNorgeIBilder",
    uiLagNavn: "Norge i bilder",
    lagReferanse: bakgrunnskartNorgeIBilder
}
var kartMenyLagDictEnkel = {
    lagNavn: "bakgrunnskartEnkel",
    uiLagNavn: "Bakgrunnskart, forenklet",
    lagReferanse: bakgrunnskartEnkel
}

var kartMenyGruppeDictBakgrunnskart = {
    gruppeNavn: "Bakgrunnskart",
    uiGruppeNavn: "Bakgrunnskart",
    kartMenyLag: [
        kartMenyLagDictOSM,
        kartMenyLagDictTopo4,
        kartMenyLagDictTopo4Graa,
        kartMenyLagDictNorgeIBilder,
        kartMenyLagDictEnkel
    ]
}

////////////////////////////////////////////////////////////////////////
// VERNEFORSLAG
////////////////////////////////////////////////////////////////////////

var foreslatteFLOdata = ["GeoJSONdata", {
    name: "foreslatteFLOdata",
    data: "data/foreslatteFLO.geojson",
    strokeColor: [0, 0, 240, 1],
    fillColor: [0, 0, 240, 0.4],
    strokeWidth: 2,
    strokeColorSelect: [0, 0, 240, 1],
    fillColorSelect: [0, 0, 240, 0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 1,
}];

var foreslatteVLOdata = ["GeoJSONdata", {
    name: "foreslatteVLOdata",
    data: "data/foreslatteVLO.geojson",
    strokeColor: [240, 240, 0, 1],
    fillColor: [240, 240, 0, 0.4],
    strokeWidth: 2,
    strokeColorSelect: [240, 240, 0, 1],
    fillColorSelect: [240, 240, 0, 0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 1
}];

var reservatKandidatData = ["GeoJSONdata", {
    name: "reservatKandidatData",
    data: "data/reservatkandidater.geojson",
    strokeColor: [0, 240, 0, 1],
    fillColor: [0, 240, 0, 0.4],
    strokeWidth: 2,
    strokeColorSelect: [0, 240, 0, 1],
    fillColorSelect: [0, 240, 0, 0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 1
}];

// EE: Lage VectorLayers her. // ForeslatteFLO

foreslatteFLOdata = setteNyFargeForKeyGeoJSON(foreslatteFLOdata, "strokeColor", 223, 88, 0, 1);
foreslatteFLOdata = setteNyFargeForKeyGeoJSON(foreslatteFLOdata, "fillColor", 223, 88, 0, 0.15);
foreslatteFLOdata = setteNyFargeForKeyGeoJSON(foreslatteFLOdata, "strokeColorSelect", 191, 75, 0, 1);
foreslatteFLOdata = setteNyFargeForKeyGeoJSON(foreslatteFLOdata, "fillColorSelect", 191, 75, 0, 0.3);

foreslatteFLOdata = justerFargeAlphaForGeoJSON(foreslatteFLOdata);

var strokeColorSelectForeslatteFLO = hentOgKonverterFargeArray(foreslatteFLOdata, 'strokeColorSelect');
if (strokeColorSelectForeslatteFLO == null) {
    strokeColorSelectForeslatteFLO = defaultFargeStroke;
}
var fillColorSelectForeslatteFLO = hentOgKonverterFargeArray(foreslatteFLOdata, 'fillColorSelect');
if (fillColorSelectForeslatteFLO == null) {
    fillColorSelectForeslatteFLO = defaultFargeFill;
}

var stilForeslatteFLO = lagStilFraGeoJSON(foreslatteFLOdata, false);
if (stilForeslatteFLO == null) {
    stilForeslatteFLO = defaultLayerStyle;
}
var stilSelectForeslatteFLO = lagStilFraGeoJSON(foreslatteFLOdata, true);
if (stilSelectForeslatteFLO == null) {
    stilSelectForeslatteFLO = defaultLayerSelectStyle;
}

// ForeslatteVLO

foreslatteVLOdata = setteNyFargeForKeyGeoJSON(foreslatteVLOdata, "strokeColor", 191, 191, 0, 1);
foreslatteVLOdata = setteNyFargeForKeyGeoJSON(foreslatteVLOdata, "fillColor", 191, 191, 0, 0.15);
foreslatteVLOdata = setteNyFargeForKeyGeoJSON(foreslatteVLOdata, "strokeColorSelect", 159, 159, 0, 1);
foreslatteVLOdata = setteNyFargeForKeyGeoJSON(foreslatteVLOdata, "fillColorSelect", 159, 159, 0, 0.3);

foreslatteVLOdata = justerFargeAlphaForGeoJSON(foreslatteVLOdata);

var strokeColorSelectForeslatteVLO = hentOgKonverterFargeArray(foreslatteVLOdata, 'strokeColorSelect');
if (strokeColorSelectForeslatteVLO == null) {
    strokeColorSelectForeslatteVLO = defaultFargeStroke;
}
var fillColorSelectForeslatteVLO = hentOgKonverterFargeArray(foreslatteVLOdata, 'fillColorSelect');
if (fillColorSelectForeslatteVLO == null) {
    fillColorSelectForeslatteVLO = defaultFargeFill;
}

var stilForeslatteVLO = lagStilFraGeoJSON(foreslatteVLOdata, false);
if (stilForeslatteVLO == null) {
    stilForeslatteVLO = defaultLayerStyle;
}
var stilSelectForeslatteVLO = lagStilFraGeoJSON(foreslatteVLOdata, true);
if (stilSelectForeslatteVLO == null) {
    stilSelectForeslatteVLO = defaultLayerSelectStyle;
}

// ReservatKandidat

reservatKandidatData = setteNyFargeForKeyGeoJSON(reservatKandidatData, "strokeColor", 191, 0, 0, 1);
reservatKandidatData = setteNyFargeForKeyGeoJSON(reservatKandidatData, "fillColor", 191, 0, 0, 0.15);
reservatKandidatData = setteNyFargeForKeyGeoJSON(reservatKandidatData, "strokeColorSelect", 159, 0, 0, 1);
reservatKandidatData = setteNyFargeForKeyGeoJSON(reservatKandidatData, "fillColorSelect", 159, 0, 0, 0.3);

reservatKandidatData = justerFargeAlphaForGeoJSON(reservatKandidatData);

var strokeColorSelectReservatKandidat = hentOgKonverterFargeArray(reservatKandidatData, 'strokeColorSelect');
if (strokeColorSelectReservatKandidat == null) {
    strokeColorSelectReservatKandidat = defaultFargeStroke;
}
var fillColorSelectReservatKandidat = hentOgKonverterFargeArray(reservatKandidatData, 'fillColorSelect');
if (fillColorSelectReservatKandidat == null) {
    fillColorSelectReservatKandidat = defaultFargeFill;
}

var stilReservatKandidat = lagStilFraGeoJSON(reservatKandidatData, false);
if (stilReservatKandidat == null) {
    stilReservatKandidat = defaultLayerStyle;
}
var stilSelectReservatKandidat = lagStilFraGeoJSON(reservatKandidatData, true);
if (stilSelectReservatKandidat == null) {
    stilSelectReservatKandidat = defaultLayerSelectStyle;
}

var vektorKildeforeslatteFLO = new ol.source.Vector({
    url: "data/foreslatteFLO.geojson",
    format: geoJSONFormat,
    features: new ol.Collection()
});

var vektorLagforeslatteFLO = new ol.layer.Vector({
    source: vektorKildeforeslatteFLO,
    style: stilForeslatteFLO,
    name: "vektorLagforeslatteFLO",
    uiName: "Friluftslivsområder",
    kode: "flo",
    stilSelect: stilSelectForeslatteFLO,
    strokeColorSelect: strokeColorSelectForeslatteFLO,
    fillColorSelect: fillColorSelectForeslatteFLO,
    clickable: true,
    visible: false
});

var vektorKildeforeslatteVLO = new ol.source.Vector({
    url: "data/foreslatteVLO.geojson",
    format: geoJSONFormat,
    features: new ol.Collection()
});

var vektorLagforeslatteVLO = new ol.layer.Vector({
    source: vektorKildeforeslatteVLO,
    style: stilForeslatteVLO,
    name: "vektorLagforeslatteVLO",
    uiName: "Landskapsvernområder",
    kode: "vlo",
    stilSelect: stilSelectForeslatteVLO,
    strokeColorSelect: strokeColorSelectForeslatteVLO,
    fillColorSelect: fillColorSelectForeslatteVLO,
    clickable: true,
    visible: false
});

var vektorKildeReservatKandidat = new ol.source.Vector({
    url: "data/reservatkandidater.geojson",
    format: geoJSONFormat,
    features: new ol.Collection()
});

var vektorLagReservatKandidat = new ol.layer.Vector({
    source: vektorKildeReservatKandidat,
    style: stilReservatKandidat,
    name: "vektorLagReservatKandidat",
    uiName: "Naturreservat",
    kode: "rk",
    stilSelect: stilSelectReservatKandidat,
    strokeColorSelect: strokeColorSelectReservatKandidat,
    fillColorSelect: fillColorSelectReservatKandidat,
    clickable: true,
    visible: false
});

// EE
// NOTE: uiName på både lagnivå og i kartMenyLagDict.
// OBS! Burde bruke uiName fra vektorlag-objektene!

var kartMenyLagDictForeslatteFLO = {
    lagNavn: "vektorLagforeslatteFLO",
    uiLagNavn: "Friluftslivsområder",
    lagReferanse: vektorLagforeslatteFLO
}
var kartMenyLagDictForeslatteVLO = {
    lagNavn: "vektorLagforeslatteVLO",
    uiLagNavn: "Landskapsvernområder",
    lagReferanse: vektorLagforeslatteVLO
}
var kartMenyLagDictReservatKandidat = {
    lagNavn: "vektorLagReservatKandidat",
    uiLagNavn: "Naturreservat",
    lagReferanse: vektorLagReservatKandidat
}

var kartMenyGruppeDictVerneforslag = {
    gruppeNavn: "Verneforslag",
    uiGruppeNavn: "Våre verneforslag",
    kartMenyLag: [
        kartMenyLagDictForeslatteVLO,
        kartMenyLagDictForeslatteFLO,
        // kartMenyLagDictForeslatteVLO,
        kartMenyLagDictReservatKandidat
    ]
}

////////////////////////////////////////////////////////////////////////
// FORVALTNINGSFORSLAG
////////////////////////////////////////////////////////////////////////

var RestaureringsomraderData = ["GeoJSONdata", {
    name: "RestaureringsomraderData",
    data: "data/restaureringsomrader.geojson",
    strokeColor: [0, 150, 150, 1],
    fillColor: [0, 150, 150, 0.4],
    strokeWidth: 2,
    strokeColorSelect: [0, 150, 150, 1],
    fillColorSelect: [0, 150, 150, 0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 1
}];

var SammenhengendeVillmarkData = ["GeoJSONdata", {
    name: "SammenhengendeVillmarkData",
    data: "data/sammenhengendeVillmark.geojson",
    strokeColor: [139, 69, 19, 1],
    fillColor: [139, 69, 19, 0.4],
    strokeWidth: 2,
    strokeColorSelect: [139, 69, 19, 1],
    fillColorSelect: [139, 69, 19, 0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 1
}];

// EE: Lage VectorLayers her. // Restaureringsomrader

RestaureringsomraderData = setteNyFargeForKeyGeoJSON(RestaureringsomraderData, "strokeColor", 175, 0, 255, 1);
RestaureringsomraderData = setteNyFargeForKeyGeoJSON(RestaureringsomraderData, "fillColor", 175, 0, 255, 0.15);
RestaureringsomraderData = setteNyFargeForKeyGeoJSON(RestaureringsomraderData, "strokeColorSelect", 153, 0, 223, 1);
RestaureringsomraderData = setteNyFargeForKeyGeoJSON(RestaureringsomraderData, "fillColorSelect", 153, 0, 223, 0.3);

RestaureringsomraderData = justerFargeAlphaForGeoJSON(RestaureringsomraderData);

var strokeColorSelectRestaureringsomrader = hentOgKonverterFargeArray(RestaureringsomraderData, 'strokeColorSelect');
if (strokeColorSelectRestaureringsomrader == null) {
    strokeColorSelectRestaureringsomrader = defaultFargeStroke;
}
var fillColorSelectRestaureringsomrader = hentOgKonverterFargeArray(RestaureringsomraderData, 'fillColorSelect');
if (fillColorSelectRestaureringsomrader == null) {
    fillColorSelectRestaureringsomrader = defaultFargeFill;
}

var stilRestaureringsomrader = lagStilFraGeoJSON(RestaureringsomraderData, false);
if (stilRestaureringsomrader == null) {
    stilRestaureringsomrader = defaultLayerStyle;
}
var stilSelectRestaureringsomrader = lagStilFraGeoJSON(RestaureringsomraderData, true);
if (stilSelectRestaureringsomrader == null) {
    stilSelectRestaureringsomrader = defaultLayerSelectStyle;
}

// SammenhengendeVillmark

SammenhengendeVillmarkData = setteNyFargeForKeyGeoJSON(SammenhengendeVillmarkData, "strokeColor", 255, 32, 248, 1);
SammenhengendeVillmarkData = setteNyFargeForKeyGeoJSON(SammenhengendeVillmarkData, "fillColor", 255, 32, 248, 0.15);
SammenhengendeVillmarkData = setteNyFargeForKeyGeoJSON(SammenhengendeVillmarkData, "strokeColorSelect", 255, 0, 247, 1);
SammenhengendeVillmarkData = setteNyFargeForKeyGeoJSON(SammenhengendeVillmarkData, "fillColorSelect", 255, 0, 247, 0.3);

SammenhengendeVillmarkData = justerFargeAlphaForGeoJSON(SammenhengendeVillmarkData);

var strokeColorSelectSammenhengendeVillmark = hentOgKonverterFargeArray(SammenhengendeVillmarkData, 'strokeColorSelect');
if (strokeColorSelectSammenhengendeVillmark == null) {
    strokeColorSelectSammenhengendeVillmark = defaultFargeStroke;
}
var fillColorSelectSammenhengendeVillmark = hentOgKonverterFargeArray(SammenhengendeVillmarkData, 'fillColorSelect');
if (fillColorSelectSammenhengendeVillmark == null) {
    fillColorSelectSammenhengendeVillmark = defaultFargeFill;
}

var stilSammenhengendeVillmark = lagStilFraGeoJSON(SammenhengendeVillmarkData, false);
if (stilSammenhengendeVillmark == null) {
    stilSammenhengendeVillmark = defaultLayerStyle;
}
var stilSelectSammenhengendeVillmark = lagStilFraGeoJSON(SammenhengendeVillmarkData, true);
if (stilSelectSammenhengendeVillmark == null) {
    stilSelectSammenhengendeVillmark = defaultLayerSelectStyle;
}

var vektorKildeRestaureringsomrader = new ol.source.Vector({
    url: "data/restaureringsomrader.geojson",
    format: geoJSONFormat,
    features: new ol.Collection()
});

var vektorLagRestaureringsomrader = new ol.layer.Vector({
    source: vektorKildeRestaureringsomrader,
    style: stilRestaureringsomrader,
    name: "vektorLagRestaureringsomrader",
    uiName: "Restaureringsområder",
    kode: "ro",
    stilSelect: stilSelectRestaureringsomrader,
    strokeColorSelect: strokeColorSelectRestaureringsomrader,
    fillColorSelect: fillColorSelectRestaureringsomrader,
    clickable: true,
    visible: false
});

var vektorKildeSammenhengendeVillmark = new ol.source.Vector({
    url: "data/sammenhengendeVillmark.geojson",
    format: geoJSONFormat,
    features: new ol.Collection()
});

var vektorLagSammenhengendeVillmark = new ol.layer.Vector({
    source: vektorKildeSammenhengendeVillmark,
    style: stilSammenhengendeVillmark,
    name: "vektorLagSammenhengendeVillmark",
    uiName: "Sammenhengende villmark",
    kode: "sam",
    stilSelect: stilSelectSammenhengendeVillmark,
    strokeColorSelect: strokeColorSelectSammenhengendeVillmark,
    fillColorSelect: fillColorSelectSammenhengendeVillmark,
    clickable: true,
    visible: false
});

// EE

var kartMenyLagDictRestaureringsomraader = {
    lagNavn: "vektorLagRestaureringsomrader",
    uiLagNavn: "Restaureringsområder",
    lagReferanse: vektorLagRestaureringsomrader
    // stilSelect: stilSelectRestaureringsomrader
}
var kartMenyLagDictSammenhengendeVillmark = {
    lagNavn: "vektorLagSammenhengendeVillmark",
    uiLagNavn: "Sammenhengende villmark",
    lagReferanse: vektorLagSammenhengendeVillmark
    // stilSelect: stilSelectSammenhengendeVillmark
}

var kartMenyGruppeDictForvaltningsforslag = {
    gruppeNavn: "Forvaltningforslag",
    uiGruppeNavn: "Våre forvaltningsforslag",
    kartMenyLag: [
        kartMenyLagDictRestaureringsomraader,
        kartMenyLagDictSammenhengendeVillmark
    ]
}

////////////////////////////////////////////////////////////////////////
// VERNEOMRÅDER
////////////////////////////////////////////////////////////////////////

// Skippe WMS/WMTS til senere, eller? ...

// Hm... Trenger man "opacity"? ...

var dataNaturvernomrade = ["WMSlayer", {
    url: "https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer",
    name: "naturvern_omrade",
    opacity: 1
}]; // ?service=wms&request=getcapabilities

var dataNaturvernomradeKlasser = ["WMSlayer", {
    url: "https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer",
    name: "naturvern_klasser_omrade",
    opacity: 1
}]; // ?service=wms&request=getcapabilities

var dataForeslattNaturvernOmradeMiljodir = ["WMSlayer", {
    url: "https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer",
    name: "foreslatt_naturvern_omrade",
    opacity: 1
}]; // ?service=wms&request=getcapabilities


var dataFriluftStatligSikra = ["WMSlayer", {
    url: "https://kart.miljodirektoratet.no/arcgis/services/friluftsliv_statlig_sikra/mapserver/WMSServer",
    name: "friluftsliv_statlig_sikra",
    opacity: 1
}];

var vernEtterMarkalovenData = ["GeoJSONdata", {
    name: "vernEtterMarkalovenData",
    data: "data/markaloven.geojson",
    strokeColor: [0, 240, 0, 1],
    fillColor: [0, 240, 0, 0.4],
    strokeWidth: 2,
    strokeColorSelect: [0, 240, 0, 1],
    fillColorSelect: [0, 240, 0, 0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 1
}];

// EE: Lage VectorLayers her.

// Hm... Vet ikke enda hvordan WMS-lagene blir laget med openlayers?

var wmsLagNaturvernOmrade = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer",
        params: { 'LAYERS': "naturvern_omrade" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    visible: false,
    name: "wmsLagNaturvernOmrade",
    kode: "no"
});

var wmsLagNaturvernKlasserOmrade = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer",
        params: { 'LAYERS': "naturvern_klasser_omrade" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    visible: false,
    name: "wmsLagNaturvernKlasserOmrade",
    kode: "nok"
});

var wmsLagForeslattNaturvernOmrade = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer",
        params: { 'LAYERS': "foreslatt_naturvern_omrade" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    visible: false,
    name: "wmsLagForeslattNaturvernOmrade",
    kode: "fno"
});

var wmsLagFriluftStatligSikra = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: "https://kart.miljodirektoratet.no/arcgis/services/friluftsliv_statlig_sikra/mapserver/WMSServer",
        params: { 'LAYERS': "friluftsliv_statlig_sikra" },
        ratio: 2,
        serverType: 'mapserver'
    }),
    visible: false,
    name: "wmsLagFriluftStatligSikra",
    kode: "fss"
});

vernEtterMarkalovenData = setteNyFargeForKeyGeoJSON(vernEtterMarkalovenData, "strokeColor", 0, 0, 191, 1);
vernEtterMarkalovenData = setteNyFargeForKeyGeoJSON(vernEtterMarkalovenData, "fillColor", 0, 0, 191, 0.15);
vernEtterMarkalovenData = setteNyFargeForKeyGeoJSON(vernEtterMarkalovenData, "strokeColorSelect", 0, 0, 159, 1);
vernEtterMarkalovenData = setteNyFargeForKeyGeoJSON(vernEtterMarkalovenData, "fillColorSelect", 0, 0, 159, 0.3);

vernEtterMarkalovenData = justerFargeAlphaForGeoJSON(vernEtterMarkalovenData);

var strokeColorSelectVernEtterMarkaloven = hentOgKonverterFargeArray(vernEtterMarkalovenData, 'strokeColorSelect');
if (strokeColorSelectVernEtterMarkaloven == null) {
    strokeColorSelectVernEtterMarkaloven = defaultFargeStroke;
}
var fillColorSelectVernEtterMarkaloven = hentOgKonverterFargeArray(vernEtterMarkalovenData, 'fillColorSelect');
if (fillColorSelectVernEtterMarkaloven == null) {
    fillColorSelectVernEtterMarkaloven = defaultFargeFill;
}

var stilVernEtterMarkaloven = lagStilFraGeoJSON(vernEtterMarkalovenData, false);
if (stilVernEtterMarkaloven == null) {
    stilVernEtterMarkaloven = defaultLayerStyle;
}
var stilSelectVernEtterMarkaloven = lagStilFraGeoJSON(vernEtterMarkalovenData, true);
if (stilSelectVernEtterMarkaloven == null) {
    stilSelectVernEtterMarkaloven = defaultLayerSelectStyle;
}

var vektorKildeVernEtterMarkaloven = new ol.source.Vector({
    url: "data/markaloven.geojson",
    format: geoJSONFormat,
    features: new ol.Collection()
});

var vektorLagVernEtterMarkaloven = new ol.layer.Vector({
    source: vektorKildeVernEtterMarkaloven,
    style: stilVernEtterMarkaloven,
    name: "vektorLagvernEtterMarkaloven",
    uiName: "Vern etter markaloven § 11",
    kode: "vem",
    stilSelect: stilSelectVernEtterMarkaloven,
    strokeColorSelect: strokeColorSelectVernEtterMarkaloven,
    fillColorSelect: fillColorSelectVernEtterMarkaloven,
    clickable: true,
    visible: false
});

// EE
// NOTE: uiName på lagnivå skal bli brukt til klikk-highlight selection (på lag-features).

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
    // stilSelect: stilSelectVernEtterMarkaloven
}

var kartMenyGruppeDictVerneomraader = {
    gruppeNavn: "Verneområder",
    uiGruppeNavn: "Vernede områder",
    kartMenyLag: [
        kartMenyLagDictNaturvernOmraader,
        kartMenyLagDictNaturvernOmraaderKlasser,
        kartMenyLagDictForeslattNaturvernOmrader,
        kartMenyLagDictFriluftStatligSikra,
        kartMenyLagDictVernEtterMarkaloven
    ]
}

////////////////////////////////////////////////////////////////////////
// NATUROPPLEVELSER
////////////////////////////////////////////////////////////////////////

// Markagrensa

var markagrensaKartdata = ["GeoJSONdata", {
    name: "markagrensaKartdata",
    data: "data/markagrensa.geojson",
    strokeColor: [240, 0, 0, 1],
    fillColor: [0, 240, 0, 0],
    strokeWidth: 2,
    strokeColorSelect: [240, 0, 0, 1],
    fillColorSelect: [0, 240, 250, 0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 0
}];

var eventyrskogData = ["GeoJSONdata", {
    name: "eventyrskogData",
    data: "data/eventyrskoger.geojson",
    strokeColor: [240, 0, 0, 1],
    fillColor: [0, 240, 0, 0.4],
    strokeWidth: 2,
    strokeColorSelect: [240, 0, 0, 0.9],
    fillColorSelect: [0, 240, 0, 0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 1,
}];

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
    kode: "fot"
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
    kode: "his"
});

// Hm... Forandre på fargene til markagrensaKartdata?
// markagrensaKartdata = setteNyFargeForKeyGeoJSON(markagrensaKartdata, "strokeColor", 13, 109, 54, 1);
markagrensaKartdata = setteNyFargeForKeyGeoJSON(markagrensaKartdata, "strokeColor", 0, 96, 0, 1);

var stilMarkagrensa = lagStilFraGeoJSON(markagrensaKartdata, false);
if (stilMarkagrensa == null) {
    stilMarkagrensa = defaultLayerStyle;
}
var stilSelectMarkagrensa = lagStilFraGeoJSON(markagrensaKartdata, false);
if (stilSelectMarkagrensa == null) {
    stilSelectMarkagrensa = defaultLayerSelectStyle;
}

var vektorKildeMarkagrensa = new ol.source.Vector({
    url: "data/markagrensa.geojson",
    format: geoJSONFormat,
    features: new ol.Collection()
});

// Hm... Sette stilSelect direkte på kartlaget?
var vektorLagMarkagrensa = new ol.layer.Vector({
    source: vektorKildeMarkagrensa,
    style: stilMarkagrensa,
    name: "vektorLagMarkagrensa",
    uiName: "Markagrensa",
    kode: "mg",
    stilSelect: stilSelectMarkagrensa,
    clickable: false,
    visible: false
});

// WMS kartMenyLag?

// EE: Lage VectorLayers her. // Eventyrskog

eventyrskogData = setteNyFargeForKeyGeoJSON(eventyrskogData, "strokeColor", 0, 191, 0, 1);
eventyrskogData = setteNyFargeForKeyGeoJSON(eventyrskogData, "fillColor", 0, 191, 0, 0.15);
eventyrskogData = setteNyFargeForKeyGeoJSON(eventyrskogData, "strokeColorSelect", 0, 159, 0, 1);
eventyrskogData = setteNyFargeForKeyGeoJSON(eventyrskogData, "fillColorSelect", 0, 159, 0, 0.3);

// eventyrskogData = justerFargeAlphaForGeoJSON(eventyrskogData);

var strokeColorSelectEventyrskog = hentOgKonverterFargeArray(eventyrskogData, 'strokeColorSelect');
if (strokeColorSelectEventyrskog == null) {
    strokeColorSelectEventyrskog = defaultFargeStroke;
}
var fillColorSelectEventyrskog = hentOgKonverterFargeArray(eventyrskogData, 'fillColorSelect');
if (fillColorSelectEventyrskog == null) {
    fillColorSelectEventyrskog = defaultFargeFill;
}

var stilEventyrskog = lagStilFraGeoJSON(eventyrskogData, false);
if (stilEventyrskog == null) {
    stilEventyrskog = defaultLayerStyle;
}
var stilSelectEventyrskog = lagStilFraGeoJSON(eventyrskogData, true);
if (stilSelectEventyrskog == null) {
    stilSelectEventyrskog = defaultLayerSelectStyle;
}

var vektorKildeEventyrskog = new ol.source.Vector({
    url: "data/eventyrskoger.geojson",
    format: geoJSONFormat,
    features: new ol.Collection()
});

var vektorLagEventyrskog = new ol.layer.Vector({
    source: vektorKildeEventyrskog,
    style: stilEventyrskog,
    name: "vektorlagEventyrskog",
    uiName: "Eventyrskog",
    kode: "eve",
    stilSelect: stilSelectEventyrskog,
    strokeColorSelect: strokeColorSelectEventyrskog,
    fillColorSelect: fillColorSelectEventyrskog,
    clickable: true,
    visible: false
});

// Referanse til vektorlaget? // Hm... Er null for WMS-lag som loader async.

var kartMenyLagDictMarkagrensa = {
    lagNavn: "vektorLagMarkagrensa",
    uiLagNavn: "Markagrensa",
    lagReferanse: vektorLagMarkagrensa
    // stilSelect: stilSelectMarkagrensa
}
var kartMenyLagDictEventyrskog = {
    lagNavn: "vektorlagEventyrskog",
    uiLagNavn: "Eventyrskoger",
    lagReferanse: vektorLagEventyrskog
    // stilSelect: stilSelectEventyrskog
}
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

// !!!
// Prøver å legge til kalenderturer fra GeoJSON, multi line string type? START
// !!!

// Orange: 255, 165, 0
// Tomato: 255, 99, 71
// GoldenRod: 218, 165, 32
// DarkGoldenRod: 184, 134, 11
// Sienna: 160, 82, 45
// SaddleBrown: 139, 69, 19
var kalenderRuter2021Data = ["GeoJSONdata", {
    name: "kalenderRuter2021Data",
    data: "data/kalenderRuter2021.geojson",
    strokeColor: [160, 82, 45, 1],
    fillColor: [160, 82, 45, 0.4],
    strokeWidth: 2,
    strokeColorSelect: [139, 69, 19, 0.9],
    fillColorSelect: [139, 69, 19, 0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 1,
}];

// Debug:
// console.log(kalenderRuter2021Data[1]["data"])

var strokeColorSelectKalenderRuter2021 = hentOgKonverterFargeArray(kalenderRuter2021Data, 'strokeColorSelect');
if (strokeColorSelectKalenderRuter2021 == null) {
    strokeColorSelectKalenderRuter2021= defaultFargeStroke;
}
var fillColorSelectKalenderRuter2021 = hentOgKonverterFargeArray(kalenderRuter2021Data, 'fillColorSelect');
if (fillColorSelectKalenderRuter2021 == null) {
    fillColorSelectKalenderRuter2021 = defaultFargeFill;
}

var stilKalenderRuter2021 = lagStilFraGeoJSON(kalenderRuter2021Data, false);
if (stilKalenderRuter2021 == null) {
    stilKalenderRuter2021 = defaultLayerStyle;
}
var stilSelectKalenderRuter2021 = lagStilFraGeoJSON(kalenderRuter2021Data, true);
if (stilSelectKalenderRuter2021 == null) {
    stilSelectKalenderRuter2021 = defaultLayerSelectStyle;
}
// Dashed --- bare for turer:
var stilDashedKalenderRuter2021 = lagDashedStilFraGeoJSON(kalenderRuter2021Data, false);
if (stilDashedKalenderRuter2021 == null) {
    stilDashedKalenderRuter2021 = defaultDashedLayerStyle;
}
var stilDashedSelectKalenderRuter2021 = lagDashedStilFraGeoJSON(kalenderRuter2021Data, true);
if (stilDashedSelectKalenderRuter2021 == null) {
    stilDashedSelectKalenderRuter2021 = defaultDashedLayerSelectStyle;
}

// Lage GeoJSON objekt fra GeoJSON url? ...
// const geojson = new GeoJSON

var kalenderRuter2021FeatureCollection = new ol.Collection();

var vektorKildeKalenderRuter2021 = new ol.source.Vector({
    // Hm. Bare en av featurene nå! Funket dette?!

    // url: "data/kalenderRuter2021.geojson",

    format: geoJSONFormat,

    // features: new ol.Collection()

    features: kalenderRuter2021FeatureCollection
});

// // FUNKER. Omg...
async function fetchJSON(url) {
    return await fetch(url)
        .then(function (response) {
            return response.json();
        });
}

var data = fetchJSON('data/kalenderRuter2021.geojson')
    .then(function(data){

        var features = geoJSONFormat.readFeatures(data);
        features.forEach(feature => {

            // Funker! Men må fikse slik at den blir satt tilbake til dashed etter highlight også trykke vekk.
            try{
                var maanedstur = feature.get("MAANEDSTUR");
                if(maanedstur != null){
                    var snarvei = feature.get("Stiplet");
                    if(snarvei != null){
                        var snarveiVerdi = parseInt(snarvei);
                        if(snarveiVerdi > 0){
                            feature.setStyle(stilDashedKalenderRuter2021);
                            var NAVN = feature.get("NAVN");
                            console.log("Fant en snarvei! Satt dashed style. NAVN: " + NAVN);
                        }
                    }
                }
            }catch(exception){
                console.log("Noe error når jeg gjorde feature.get()... e: " + exception);
            }

            kalenderRuter2021FeatureCollection.push(feature);
        });
        console.log(kalenderRuter2021FeatureCollection.getArray());

        console.log(vektorKildeKalenderRuter2021.getFeatures().length); // 14 ?!

        // do what you want to do with `data` here...
        data.features.forEach(function (feature) {
            console.log(feature);

            // var symbol = feature.properties['icon'];
            // console.log(symbol);
        });
    });

var vektorLagKalenderRuter2021 = new ol.layer.Vector({
    source: vektorKildeKalenderRuter2021,
    style: stilKalenderRuter2021,
    name: "vektorlagKalenderRuter2021",
    uiName: "Kalender turer 2021",
    kode: "t21",
    stilSelect: stilSelectKalenderRuter2021,
    strokeColorSelect: strokeColorSelectKalenderRuter2021,
    fillColorSelect: fillColorSelectKalenderRuter2021,
    stilDashed: stilDashedKalenderRuter2021,
    stilDashedSelect: stilDashedSelectKalenderRuter2021,
    clickable: true,
    visible: false
});

var kartMenyLagDictKalenderRuter2021 = {
    lagNavn: "vektorlagKalenderRuter2021",
    uiLagNavn: "Kalender turer 2021",
    lagReferanse: vektorLagKalenderRuter2021
    // stilSelect: stilSelectMarkagrensa
}

// !!!
// Prøver å legge til kalenderturer fra GeoJSON, multi line string type? EMD
// !!!

var kartMenyGruppeDictNaturopplevelser = {
    gruppeNavn: "Naturopplevelser",
    uiGruppeNavn: "Naturopplevelser",
    kartMenyLag: [
        kartMenyLagDictMarkagrensa,
        kartMenyLagDictEventyrskog,
        // kartMenyLagDictFotrute,
        // kartMenyLagDictHistorisk

        // VIKTIG NOTAT (VERSJON 1): UTEN kalender ruter!
        // kartMenyLagDictKalenderRuter2021
    ]
}

// *********************************************************************
// MENYDICT (ALLE KOMBINERT)
// *********************************************************************

// SETTE UI KARTMENY-REKKEFØLGEN HER!:

// kartMenyMasterListe.push(kartMenyGruppeDictGeometri);
kartMenyMasterListe.push(kartMenyGruppeDictNaturopplevelser);
kartMenyMasterListe.push(kartMenyGruppeDictForvaltningsforslag);
kartMenyMasterListe.push(kartMenyGruppeDictVerneforslag);
kartMenyMasterListe.push(kartMenyGruppeDictVerneomraader);
// kartMenyMasterListe.push(kartMenyGruppeDictNaturopplevelser);
kartMenyMasterListe.push(kartMenyGruppeDictGeometri);
kartMenyMasterListe.push(kartMenyGruppeDictBakgrunnskart);

// Hm... Kanskje burde gjøre dem til Dict? F.eks. for å gjøre kartMenyMasterListe["Geometri"]?
// Men kanskje ikke nødvendig?

console.log("kartMenyMasterListe er klar! (Brukes til bygginga av HTML)");

for (var e = 0; e < kartMenyMasterListe.length; e++) {
    // console.log(kartMenyMasterListe[e]);
    var kartlag = kartMenyMasterListe[e]["kartMenyLag"];
    for (var f = 0; f < kartlag.length; f++) {
        // console.log(kartlag[f]);
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
            return null;
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
            return null;
        }

    }

    return null; // Unreachable?
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
                    lineDash: [1.0, 5]
                }),
            });

            return style;

        } catch (error) {
            return null;
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
                    lineDash: [1.0, 5]
                }),
            });

            return style;
        } catch (error) {
            return null;
        }

    }

    return null; // Unreachable?
}

function hentOgKonverterFargeArray(geojson, dictKey) {
    // dictKey kan bare være strokeColorSelect eller fillColorSelect.
    if (dictKey == "strokeColorSelect" || dictKey == "fillColorSelect") {
        var fargeArray = geojson[1][dictKey];
        if (fargeArray != null) {
            return "rgba(" + fargeArray[0] + ", " + fargeArray[1] + ", " + fargeArray[2] + ", " + fargeArray[3] + ")";
        } else {
            return null;
        }
    } else {
        return null;
    }
}
