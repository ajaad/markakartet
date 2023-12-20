
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

//
const DEFAULT_OPACITY = 0.8;

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
        vektorLagGPS
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
    data: "data/foreslatteLVO.geojson",
    // strokeColor: [211, 211, 40, 1],
    // fillColor: [211, 211, 40, 0.25],
    strokeColor: [0,0,0, 1],
    // fillColor: [211, 211, 40, 1],
    fillColor: [230, 230, 75, 1],
    strokeWidth: 1,
    // strokeColorSelect: [185, 185, 35, 1],
    // fillColorSelect: [185, 185, 35, 0.25],
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 1
}];
settFargerForLagData(foreslatteLVOdata, foreslatteLVOdata[1]["fillColor"]);

var foreslatteFLOdata = ["GeoJSONdata", {
    dataName: "foreslatteFLOdata",
    data: "data/foreslatteFLO.geojson",
    // strokeColor: [163, 121, 23, 1],
    // fillColor: [163, 121, 23, 0.25],
    strokeColor: [0,0,0, 1],
    // fillColor: [163, 121, 23, 1],
    fillColor: [255, 185, 40, 1],
    strokeWidth: 1,
    // strokeColorSelect: [143, 106, 20, 1],
    // fillColorSelect: [143, 106, 20, 0.25],
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 1,
}];
settFargerForLagData(foreslatteFLOdata, foreslatteFLOdata[1]["fillColor"]);

var reservatKandidatData = ["GeoJSONdata", {
    dataName: "reservatKandidatData",
    data: "data/reservatkandidater.geojson",
    // strokeColor: [191, 0, 0, 1],
    // fillColor: [191, 0, 0, 0.25],
    strokeColor: [0, 0, 0, 1],
    // fillColor: [191, 0, 0, 1],
    fillColor: [230, 80, 80, 1],
    strokeWidth: 1,
    // strokeColorSelect: [159, 0, 0, 1],
    // fillColorSelect: [159, 0, 0, 0.25],
    strokeColorSelect: [0, 0, 0, 1],
    fillColorSelect: [0, 0, 0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 1
}];
settFargerForLagData(reservatKandidatData, reservatKandidatData[1]["fillColor"]);

var vektorKildeforeslatteFLO = new ol.source.Vector({
    url: "data/foreslatteFLO.geojson",
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

var vektorKildeforeslatteLVO = new ol.source.Vector({
    url: "data/foreslatteLVO.geojson",
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorLagforeslatteLVO = new ol.layer.Vector({
    source: vektorKildeforeslatteLVO,
    style: lagStilFraGeoJSON(foreslatteLVOdata, false),
    name: "vektorLagforeslatteLVO",
    uiName: "Landskapsvernområder",
    stilSelect: lagStilFraGeoJSON(foreslatteLVOdata, true),
    strokeColorSelect: hentOgKonverterFargeArray(foreslatteLVOdata, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(foreslatteLVOdata, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
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
    data: "data/restaureringsomrader.geojson",
    // strokeColor: [175, 0, 255, 1],
    // fillColor: [175, 0, 255, 0.15],
    strokeColor: [0,0,0, 1],
    // fillColor: [175, 0, 255, 1],
    fillColor: [150, 235, 30, 1],
    strokeWidth: 1,
    // strokeColorSelect: [153, 0, 223, 1],
    // fillColorSelect: [153, 0, 223, 0.3],
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 1
}];
settFargerForLagData(RestaureringsomraderData, RestaureringsomraderData[1]["fillColor"]);

var SammenhengendeVillmarkData = ["GeoJSONdata", {
    dataName: "SammenhengendeVillmarkData",
    data: "data/sammenhengendeVillmark.geojson",
    // strokeColor: [66, 75, 160, 1],
    // fillColor: [66, 75, 160, 0.15],
    strokeColor: [0,0,0, 1],
    fillColor: [66, 75, 160, 1],
    strokeWidth: 1,
    // strokeColorSelect: [41, 47, 100, 1],
    // fillColorSelect: [41, 47, 100, 0.3],
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 1
}];
settFargerForLagData(SammenhengendeVillmarkData, SammenhengendeVillmarkData[1]["fillColor"]);

var vektorKildeRestaureringsomrader = new ol.source.Vector({
    url: "data/restaureringsomrader.geojson",
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

var vektorKildeSammenhengendeVillmark = new ol.source.Vector({
    url: "data/sammenhengendeVillmark.geojson",
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

var dataNaturtyper13Skog = ["WMSlayer", {
    url: "https://kart.miljodirektoratet.no/arcgis/services/naturtyper_hb13/MapServer/WMSServer",
    name: "hovednaturtype_hb13_skog",
    opacity: 1
}];

var vernEtterMarkalovenData = ["GeoJSONdata", {
    dataName: "vernEtterMarkalovenData",
    data: "data/markaloven.geojson",
    // strokeColor: [200, 73, 82, 1],
    // fillColor: [200, 73, 82, 0.15],
    strokeColor: [0,0,0, 1],
    // fillColor: [200, 73, 82, 1],
    fillColor: [190, 115, 240, 1],
    strokeWidth: 1,
    // strokeColorSelect: [150, 55, 62, 1],
    // fillColorSelect: [150, 55, 62, 0.3],
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 1
}];
settFargerForLagData(vernEtterMarkalovenData, vernEtterMarkalovenData[1]["fillColor"]);

// EE: Lage VectorLayers her.

// Hm... Vet ikke enda hvordan WMS-lagene blir laget med openlayers?

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
    uiName: "Friluftslivområder - statlig sikra",
});

// NOTE: Hm... Kunne kanskje bare lagd alt for alle vektorlag, inkludert dashed? ...
var vektorKildeVernEtterMarkaloven = new ol.source.Vector({
    url: "data/markaloven.geojson",
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
    // stilSelect: stilSelectVernEtterMarkaloven
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
        kartMenyLagDictVernEtterMarkaloven
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
        vektorLagVernEtterMarkaloven
    ]
  });

////////////////////////////////////////////////////////////////////////
// NATUROPPLEVELSER
////////////////////////////////////////////////////////////////////////

// Markagrensa

var markagrensaKartdata = ["GeoJSONdata", {
    dataName: "markagrensaKartdata",
    data: "data/markagrensa.geojson",
    strokeColor: [12, 119, 93, 1],
    // fillColor: [12, 119, 93, 0],
    fillColor: [255, 255, 255, 0],
    strokeWidth: 1,
    strokeColorSelect: [12, 119, 93, 1],
    // fillColorSelect: [12, 119, 93, 0],
    fillColorSelect: [255, 255, 255, 0],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 0
}];
// OK, så med farger... Samme strokefarge for vanlig og select, og samme fillfarge for vanlig og select.
// strokefargen er mørkere enn fillcolor? ...
// Hm... Eller bare bruke en farge?
var eventyrskogData = ["GeoJSONdata", {
    dataName: "eventyrskogData",
    data: "data/eventyrskoger.geojson",
    // strokeColor: [53, 124, 34, 1],
    // fillColor: [53, 124, 34, 0.15],
    // fillColor: [100, 230, 60, 1],
    fillColor: [53, 124, 34, 1],
    strokeColor: [0, 0, 0, 0],
    strokeWidth: 1,
    // strokeColorSelect: [53, 124, 34, 1],
    // fillColorSelect: [53, 124, 34, 0.3],
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
    stilSelect: stilSelectMarkagrensa,
    strokeColorSelect: hentOgKonverterFargeArray(markagrensaKartdata, 'strokeColorSelect'),
    type: "vektor_grense",
    // redigerFarge: "bare_stroke",
    clickable: false,
    visible: false
});

// WMS kartMenyLag?

var vektorKildeEventyrskog = new ol.source.Vector({
    url: "data/eventyrskoger.geojson",
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
    data: "data/skyggelag_markagrensa_5.geojson",
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
    dataName: "kalenderRuter2021Data",
    data: "data/kalenderRuter2021.geojson",
    strokeColor: [139, 69, 19, 1],
    fillColor: [139, 69, 19, 0.15],
    strokeWidth: 1,
    strokeColorSelect: [139, 69, 19, 1],
    fillColorSelect: [139, 69, 19, 0.3],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 1,
}];

// Debug:
// console.log(kalenderRuter2021Data[1]["data"])

var kalenderRuter2021FeatureCollection = new ol.Collection();

var vektorKildeKalenderRuter2021 = new ol.source.Vector({
    format: geoJSONFormat,
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
                            // console.log("Fant en snarvei! Satt dashed style. NAVN: " + NAVN);
                        }
                    }
                }
            }catch(exception){
                console.log("Noe error når jeg gjorde feature.get()... e: " + exception);
            }

            kalenderRuter2021FeatureCollection.push(feature);
        });
        // console.log(kalenderRuter2021FeatureCollection.getArray());
        // console.log(vektorKildeKalenderRuter2021.getFeatures().length); // 14 ?!

        // do what you want to do with `data` here...
        data.features.forEach(function (feature) {
            // console.log(feature);
            // var symbol = feature.properties['icon'];
            // console.log(symbol);
        });
    });

var vektorLagKalenderRuter2021 = new ol.layer.Vector({
    source: vektorKildeKalenderRuter2021,
    style: lagStilFraGeoJSON(kalenderRuter2021Data, false),
    name: "vektorlagKalenderRuter2021",
    uiName: "Kalender turer 2021",
    stilSelect: lagStilFraGeoJSON(kalenderRuter2021Data, true),
    strokeColorSelect: hentOgKonverterFargeArray(kalenderRuter2021Data, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(kalenderRuter2021Data, 'fillColorSelect'),
    stilDashed: lagDashedStilFraGeoJSON(kalenderRuter2021Data, false),
    stilDashedSelect: lagDashedStilFraGeoJSON(kalenderRuter2021Data, true),
    opacity: DEFAULT_OPACITY,
    clickable: true,
    visible: false
});

var kartMenyLagDictKalenderRuter2021 = {
    lagNavn: vektorLagKalenderRuter2021.get("name"),
    uiLagNavn: vektorLagKalenderRuter2021.get("uiName"),
    lagReferanse: vektorLagKalenderRuter2021
}

// !!!
// Prøver å legge til kalenderturer fra GeoJSON, multi line string type? EMD
// !!!

// OBS! Disse vises i kartmeny-UI!
var kartMenyGruppeDictNaturopplevelser = {
    gruppeNavn: "Naturopplevelser",
    uiGruppeNavn: "Naturopplevelser",
    kartMenyLag: [
        kartMenyLagDictMarkagrensa,
        kartMenyLagDictEventyrskog,
        kartMenyLagDictSkyggelagMarkagrensa

        // VIKTIG NOTAT (VERSJON 1): UTEN kalender ruter!
        // kartMenyLagDictKalenderRuter2021
    ]
}
// OBS! Disse vises i map-objektet!
var mapGruppeNaturopplevelser = new ol.layer.Group({
    name: kartMenyGruppeDictNaturopplevelser["gruppeNavn"],
    opacity: 1,
    visible: true,
    layers: [
        vektorLagMarkagrensa,
        vektorLagEventyrskog, 
        vektorlagSkyggelagMarkagrensa
        // vektorLagKalenderRuter2021
    ]
  });

////////////////////////////////////////////////////////////////////////
// AREALPLAN OSLO
////////////////////////////////////////////////////////////////////////

// SKOGSTYPER: Granskog, furuskog, løvskog og vassdrag, særlig viktige skogsarealer for BM

// Granskog

var osloArealGranskogData = ["GeoJSONdata", {
    dataName: "osloArealGranskogData",
    data: "data/oslo_areal_granskog.geojson",
    name: "vektorlagOsloArealGranskog",
    uiName: "Granskog",
    // strokeColor: [15,95,50, 1],
    // fillColor: [15,95,50, 0.15],
    strokeColor: [0,0,0, 1],
    fillColor: [15,95,50, 1],
    strokeWidth: 1,
    // strokeColorSelect: [15,95,50, 1],
    // fillColorSelect: [15,95,50, 0.3],
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 0,
}];
settFargerForLagData(osloArealGranskogData, osloArealGranskogData[1]["fillColor"]);

var vektorKildeOsloArealGranskog = new ol.source.Vector({
    url: "data/oslo_areal_granskog.geojson",
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorlagOsloArealGranskog = new ol.layer.Vector({
    source: vektorKildeOsloArealGranskog,
    style: lagStilFraGeoJSON(osloArealGranskogData, false),
    name: osloArealGranskogData[1]["name"],
    uiName: osloArealGranskogData[1]["uiName"],
    stilSelect: lagStilFraGeoJSON(osloArealGranskogData, true),
    strokeColorSelect: hentOgKonverterFargeArray(osloArealGranskogData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(osloArealGranskogData, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: false,
    visible: false
});
var kartMenyLagDictOsloArealGranskog = {
    lagNavn: vektorlagOsloArealGranskog.get("name"),
    uiLagNavn: vektorlagOsloArealGranskog.get("uiName"),
    lagReferanse: vektorlagOsloArealGranskog
}

// Furuskog

var osloArealFuruskogData = ["GeoJSONdata", {
    dataName: "osloArealFuruskogData",
    data: "data/oslo_areal_furuskog.geojson",
    name: "vektorlagOsloArealFuruskog",
    uiName: "Furuskog",
    // strokeColor: [5,170,0, 1],
    // fillColor: [5,170,0, 0.15],
    strokeColor: [0,0,0, 1],
    fillColor: [5,170,0, 1],
    strokeWidth: 1,
    // strokeColorSelect: [5,170,0, 1],
    // fillColorSelect: [5,170,0, 0.3],
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 0,
}];
settFargerForLagData(osloArealFuruskogData, osloArealFuruskogData[1]["fillColor"]);

var vektorKildeOsloArealFuruskog = new ol.source.Vector({
    url: "data/oslo_areal_furuskog.geojson",
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorlagOsloArealFuruskog = new ol.layer.Vector({
    source: vektorKildeOsloArealFuruskog,
    style: lagStilFraGeoJSON(osloArealFuruskogData, false),
    name: osloArealFuruskogData[1]["name"],
    uiName: osloArealFuruskogData[1]["uiName"],
    stilSelect: lagStilFraGeoJSON(osloArealFuruskogData, true),
    strokeColorSelect: hentOgKonverterFargeArray(osloArealFuruskogData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(osloArealFuruskogData, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: false,
    visible: false
});
var kartMenyLagDictOsloArealFuruskog = {
    lagNavn: vektorlagOsloArealFuruskog.get("name"),
    uiLagNavn: vektorlagOsloArealFuruskog.get("uiName"),
    lagReferanse: vektorlagOsloArealFuruskog
}

// Løvskog og bekkedrag

var osloArealLovskogOgBekkedragData = ["GeoJSONdata", {
    dataName: "osloArealLovskogOgBekkedragData",
    data: "data/oslo_areal_lovskog_og_bekkedrag.geojson",
    name: "vektorlagOsloArealLovskogOgBekkedrag",
    uiName: "Løvskog og bekkedrag",
    // strokeColor: [70,120,0, 1],
    // fillColor: [70,120,0, 0.15],
    strokeColor: [0,0,0, 1],
    fillColor: [70,120,0, 1],
    strokeWidth: 1,
    // strokeColorSelect: [70,120,0, 1],
    // fillColorSelect: [70,120,0, 0.3],
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 0,
}];
settFargerForLagData(osloArealLovskogOgBekkedragData, osloArealLovskogOgBekkedragData[1]["fillColor"]);

var vektorKildeOsloArealLovskogOgBekkedrag = new ol.source.Vector({
    url: "data/oslo_areal_lovskog_og_bekkedrag.geojson",
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorlagOsloArealLovskogOgBekkedrag = new ol.layer.Vector({
    source: vektorKildeOsloArealLovskogOgBekkedrag,
    style: lagStilFraGeoJSON(osloArealLovskogOgBekkedragData, false),
    name: osloArealLovskogOgBekkedragData[1]["name"],
    uiName: osloArealLovskogOgBekkedragData[1]["uiName"],
    stilSelect: lagStilFraGeoJSON(osloArealLovskogOgBekkedragData, true),
    strokeColorSelect: hentOgKonverterFargeArray(osloArealLovskogOgBekkedragData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(osloArealLovskogOgBekkedragData, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: false,
    visible: false
});
var kartMenyLagDictOsloArealLovskogOgBekkedrag = {
    lagNavn: vektorlagOsloArealLovskogOgBekkedrag.get("name"),
    uiLagNavn: vektorlagOsloArealLovskogOgBekkedrag.get("uiName"),
    lagReferanse: vektorlagOsloArealLovskogOgBekkedrag
}

// Særlig viktige skogsarealer for BM

var osloArealViktigeSkogsarealerData = ["GeoJSONdata", {
    dataName: "osloArealViktigeSkogsarealerData",
    data: "data/oslo_areal_saerlig_viktige_skogsarealer_for_bm.geojson",
    name: "vektorlagOsloArealViktigeSkogsarealer",
    uiName: "Viktige skogsarealer for BM",
    // strokeColor: [140,0,0, 1],
    // fillColor: [140,0,0, 0.15],
    strokeColor: [0,0,0, 1],
    fillColor: [140,0,0, 1],
    strokeWidth: 1,
    // strokeColorSelect: [140,0,0, 1],
    // fillColorSelect: [140,0,0, 0.3],
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 0,
}];
settFargerForLagData(osloArealViktigeSkogsarealerData, osloArealViktigeSkogsarealerData[1]["fillColor"]);

var vektorKildeOsloArealViktigeSkogsarealer = new ol.source.Vector({
    url: "data/oslo_areal_saerlig_viktige_skogsarealer_for_bm.geojson",
    format: geoJSONFormat,
    features: new ol.Collection()
});
var vektorlagOsloArealViktigeSkogsarealer = new ol.layer.Vector({
    source: vektorKildeOsloArealViktigeSkogsarealer,
    style: lagStilFraGeoJSON(osloArealViktigeSkogsarealerData, false),
    name: osloArealViktigeSkogsarealerData[1]["name"],
    uiName: osloArealViktigeSkogsarealerData[1]["uiName"],
    stilSelect: lagStilFraGeoJSON(osloArealViktigeSkogsarealerData, true),
    strokeColorSelect: hentOgKonverterFargeArray(osloArealViktigeSkogsarealerData, 'strokeColorSelect'),
    fillColorSelect: hentOgKonverterFargeArray(osloArealViktigeSkogsarealerData, 'fillColorSelect'),
    opacity: DEFAULT_OPACITY,
    clickable: false,
    visible: false
});
var kartMenyLagDictOsloArealViktigeSkogsarealer = {
    lagNavn: vektorlagOsloArealViktigeSkogsarealer.get("name"),
    uiLagNavn: vektorlagOsloArealViktigeSkogsarealer.get("uiName"),
    lagReferanse: vektorlagOsloArealViktigeSkogsarealer
}

// BEVARINGSSKOGER, OSLO KOMMUNE

// Definere vektorlagnavnet og ui-navnet her? ...
var oksBevaringsskogerData = ["GeoJSONdata", {
    dataName: "oksBevaringsskogerData",
    data: "data/oksBevaringsskoger.geojson",
    name: "vektorlagOksBevaringsskoger",
    uiName: "Bevaringsskoger, Oslo kommuneskog",
    // strokeColor: [102, 138, 138, 1],
    // fillColor: [102, 138, 138, 0.15],
    strokeColor: [0,0,0, 1],
    fillColor: [102, 138, 138, 1],
    strokeWidth: 1,
    // strokeColorSelect: [102, 138, 138, 1],
    // fillColorSelect: [102, 138, 138, 0.3],
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 0,
}];
settFargerForLagData(oksBevaringsskogerData, oksBevaringsskogerData[1]["fillColor"]);

var vektorKildeOksBevaringsskoger = new ol.source.Vector({
    url: "data/oksBevaringsskoger.geojson",
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
    data: "data/oksEiendom.geojson",
    name: "vektorlagOksEiendomsgrenser",
    uiName: "Eiendomsgrenser, Oslo kommuneskog",
    // strokeColor: [35, 77, 133, 0.5],
    // fillColor: [35, 77, 133, 0.33],
    strokeColor: [0,0,0, 1],
    fillColor: [35, 77, 133, 1],
    strokeWidth: 1,
    // strokeColorSelect: [102, 138, 138, 0.5],
    // fillColorSelect: [102, 138, 138, 0.33],
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 0,
}];
settFargerForLagData(oksEiendomsgrenserData, oksEiendomsgrenserData[1]["fillColor"]);

var vektorKildeOksEiendomsgrenser = new ol.source.Vector({
    url: "data/oksEiendom.geojson",
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
    data: "data/lovenskiold_eget_vern.geojson",
    name: "vektorlagLovenskieldBevaringsskoger",
    uiName: "Bevaringsskoger, Løvenskiold",
    // strokeColor: [138, 102, 102, 1],
    // fillColor: [138, 102, 102, 0.33],
    strokeColor: [0,0,0, 1],
    fillColor: [138, 102, 102, 1],
    strokeWidth: 1,
    // strokeColorSelect: [138, 102, 102, 1],
    // fillColorSelect: [138, 102, 102, 0.33],
    strokeColorSelect: [0,0,0, 1],
    fillColorSelect: [0,0,0, 1],
    strokeWidthSelect: 2,
    opacity: 1,
    clickEvent: 0,
}];
settFargerForLagData(lovenskioldBevaringsskogerData, lovenskioldBevaringsskogerData[1]["fillColor"]);

var vektorKildeLovenskioldBevaringsskoger = new ol.source.Vector({
    url: "data/lovenskiold_eget_vern.geojson",
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
    data: "data/lovenskiold_eiendom.geojson",
    name: "vektorlagLovenskieldEiendomsgrenser",
    uiName: "Eiendomsgrenser, Løvenskiold",
    // strokeColor: [138, 102, 102, 0.5],
    // fillColor: [138, 102, 102, 0.33],
    strokeColor: [0,0,0, 1],
    fillColor: [138, 102, 102, 1],
    strokeWidth: 1,
    // strokeColorSelect: [138, 102, 102, 0.5],
    // fillColorSelect: [138, 102, 102, 0.33],
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
    url: "data/lovenskiold_eiendom.geojson",
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
    data: "data/h560_naturmiljo_forslag_kpa.geojson",
    name: "vektorlagH560HensynssonerForslag",
    uiName: "Eiendomsgrenser, Løvenskiold",
    // strokeColor: [0, 108, 71, 1],
    // fillColor: [0, 161, 106, 0.4],
    strokeColor: [0,0,0, 1],
    fillColor: [0, 161, 106, 1],
    strokeWidth: 2,
    // strokeColorSelect: [0, 108, 71, 0.9],
    // fillColorSelect: [0, 161, 106, 0.7],
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
    url: "data/h560_naturmiljo_forslag_kpa.geojson",
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
    data: "data/Norge_25833_Kommuner_Uten_Oslo.geojson",
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
    url: "data/Norge_25833_Kommuner_Uten_Oslo.geojson",
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
    uiName: "Friluftslivområder"
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
        //
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

console.log("kartMenyMasterListe er klar! (Brukes til bygginga av HTML)");

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
                    lineDash: [1.0, 5]
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
                    lineDash: [1.0, 5]
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