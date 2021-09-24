
/// projection extent er nødvendig for enkelte wmts lag.
let myProjectionExtent = [364800, 7884645, 1600315, 9484620];


// Sub-menu dictionary Turer
//turerDict = Object();

//"https://openwms.statkart.no/skwms1/wms.friluftsruter2?request=GetCapabilities&service=WMS&version=1.3.0"


// Datasettene jeg egentlig skal bruke er mangelfulle og rotete.
// Denne delen blir utsatt til prosjektrunde nr. 2.
/*
turerDict["TilFots"] = {"name": "Til fots", "checked": 0, "lagGruppe": "kartlagGruppe"};
turerDict["PaSki"] = {"name": "På ski","checked": 0, "lagGruppe": "kartlagGruppe"};
turerDict["RulleStol"] = {"name": "I rullestol / barnevogn","checked": 0, "lagGruppe": "kartlagGruppe"};
turerDict["eventyrSkogTur"] = {"name": "I eventyrskoger ","checked": 0, "lagGruppe": "kartlagGruppe"};
*/
// "https://openwms.statkart.no/skwms1/wms.friluftsruter2?request=GetCapabilities&service=WMS&version=1.3.0"





////////////////////////////////////////////////////////
// Sub-menu dictionary - Naturopplevelser
naturoppDict = Object();

eventyrskogKartdata = ["GeoJSONdata", {
    data: "data/eventyrskoger.geojson",
    strokeColor: [240,0,0,1],
    fillColor: [0,240,0,0.4],
    strokeWidth: 2,
    strokeColorSelect: [240,0,0,0.9],
    fillColorSelect: [0,240,0,0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 1
    }];

naturoppDict["eventyrskogerNaturopp"] = {
        "name": "Eventyrskoger",
        "checked": 1,
        "kartdata": eventyrskogKartdata,
        "lagGruppe": "kartlagGruppe"
    };



farelsatteFLOdata = ["GeoJSONdata", {
        data: "data/foreslatteFLO.geojson",
        strokeColor: [0,0,240,1],
        fillColor: [0,0,240,0.4],
        strokeWidth: 2,
        strokeColorSelect: [0,0,240,1],
        fillColorSelect: [0,0,240,0.7],
        strokeWidthSelect: 4,
        opacity: 1,
        clickEvent: 1
        }];

foreslatteVLOdata = ["GeoJSONdata", {
    data: "data/foreslatteVLO.geojson",
    strokeColor: [240,240,0,1],
    fillColor: [240,240,0,0.4],
    strokeWidth: 2,
    strokeColorSelect: [240,240,0,1],
    fillColorSelect: [240,240,0,0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 1
}];
    
reservatKandidatData = ["GeoJSONdata", {
    data: "data/reservatkandidater.geojson",
    strokeColor: [0,240,0,1],
    fillColor: [0,240,0,0.4],
    strokeWidth: 2,
    strokeColorSelect: [0,240,0,1],
    fillColorSelect: [0,240,0,0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 1
}];

    

////////////////////////////////////////////////////////
// Sub-menu dictionary - Våre verneforslag
verneforslagDict = Object();
verneforslagDict["Landskapsvern"] = {"name": "Landskapsvern",
                                     "checked": 0,
                                     "kartdata": foreslatteVLOdata,
                                     "lagGruppe": "kartlagGruppe"};

verneforslagDict["Naturreservat"] = {"name": "Naturreservat",
                                     "checked": 0,
                                     "kartdata": reservatKandidatData,
                                     "lagGruppe": "kartlagGruppe"
                                };
verneforslagDict["Friluftsomrader"] = {"name": "Friluftsområder",
                                       "checked": 0,
                                       "kartdata": farelsatteFLOdata,
                                       "lagGruppe": "kartlagGruppe"};

////////////////////////////////////////////////////////
// Sub-menu dictionary - Våre verneforslag

RestaureringsomraderData = ["GeoJSONdata", {
    data: "data/restaureringsomrader.geojson",
    strokeColor: [0,150,150,1],
    fillColor: [0,150,150,0.4],
    strokeWidth: 2,
    strokeColorSelect: [0,150,150,1],
    fillColorSelect: [0,150,150,0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 1
}];

forvaltningsforslagDict = Object();
forvaltningsforslagDict["Restaureringsomrader"] = {"name": "Restaureringsområder",
                                                   "checked": 0,
                                                   "kartdata": RestaureringsomraderData,
                                                   "lagGruppe": "kartlagGruppe"};

// 
SammenhengendeVillmarkData = ["GeoJSONdata", {
    data: "data/sammenhengendeVillmark.geojson",
    strokeColor: [139,69,19,1],
    fillColor: [139,69,19,0.4],
    strokeWidth: 2,
    strokeColorSelect: [139,69,19,1],
    fillColorSelect: [139,69,19,0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 1
}];

forvaltningsforslagDict["SammenhengendeVillmark"] = {"name": "Sammenhengende villmark",
                                                   "checked": 0,
                                                   "kartdata": SammenhengendeVillmarkData,
                                                   "lagGruppe": "kartlagGruppe"};


console.log(forvaltningsforslagDict);
// Utelater sammenhengende villmark inntil videre
//forvaltningsforslagDict["Sammenhengendevillmark"] = {"name": "Sammenhengende villmark","checked": 0, "lagGruppe": "kartlagGruppe"};




////////////////////////////////////////////////////////
// Sub-menu dictionary - Våre verneforslag

dataNaturvernomrade = ["WMSlayer", {
    url: "https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer",
    name: "naturvern_omrade",
    opacity: 1
}]; // ?service=wms&request=getcapabilities

dataNaturvernomradeKlasser = ["WMSlayer", {
    url: "https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer",
    name: "naturvern_klasser_omrade",
    opacity: 1
}]; // ?service=wms&request=getcapabilities

dataForeslattNaturvernOmradeMiljodir = ["WMSlayer", {
    url: "https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer",
    name: "foreslatt_naturvern_omrade",
    opacity: 1
}]; // ?service=wms&request=getcapabilities


dataFriluftStatligSikra = ["WMSlayer", {
    url: "https://kart.miljodirektoratet.no/arcgis/services/friluftsliv_statlig_sikra/mapserver/WMSServer",
    name: "friluftsliv_statlig_sikra",
    opacity: 1
}];

vernEtterMarkalovenData = ["GeoJSONdata", {
    data: "data/markaloven.geojson",
    strokeColor: [0,240,0,1],
    fillColor: [0,240,0,0.4],
    strokeWidth: 2,
    strokeColorSelect: [0,240,0,1],
    fillColorSelect: [0,240,0,0.7],
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 1
}];


vernedeomraderDict = Object();
vernedeomraderDict["Naturreservat2"] = {"name": "Naturvernområder","checked": 0, "kartdata": dataNaturvernomrade, "lagGruppe": "verneomrader"};
vernedeomraderDict["NaturreservatKlasser"] = {"name": "Naturvernområder (etter klasser)","checked": 0, "kartdata": dataNaturvernomradeKlasser, "lagGruppe": "verneomrader"};
vernedeomraderDict["ForeslatteNaturvenStat"] = {"name": "Statens foreslåtte naturvernområder","checked": 0, "kartdata": dataForeslattNaturvernOmradeMiljodir, "lagGruppe": "verneomrader"};
vernedeomraderDict["FriluftStatligSikra"] = {"name": "Friluftslivsområder - statlig sikra","checked": 0, "kartdata": dataFriluftStatligSikra, "lagGruppe": "verneomrader"};

vernedeomraderDict["MarkalovenVern"] = {"name": "Vern etter markaloven",
                                             "checked": 0,
                                             "kartdata": vernEtterMarkalovenData,
                                             "lagGruppe": "verneomrader"};

// wmstjenestene henger en god del.
// Det er i alle fall mulig å velge flere lag fra samme tjeneste..

////////////////////////////////////////////////////////
// Sub-menu dictionary - Våre verneforslag
bakgrunnskartDict = Object();

dataToporaster4 = ["WMSlayer", {
    url: "http://openwms.statkart.no/skwms1/wms.toporaster4",
    name: "toporaster",
    opacity: 0.7
    }];

dataNorgeibilder = ["WMSlayer", {
    url: "https://wms.geonorge.no/skwms1/wms.nib",
    name: "ortofoto",
    opacity: 1
}];

dataAr50 = ["WMSlayer", {
    url: "https://wms.nibio.no/cgi-bin/ar50",
    name: "ar50",
    opacity: 1
}];

dataOSM = ["Tilelayer",{
    kartlag: new ol.layer.Tile({
        source: new ol.source.OSM()
    })}
];

dataTopo4WMTS = ["WMTSlayer",{
    capabilURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities",
    kartlagWMTS: "topo4",
    opacity: 1}
];


dataTopo4WMTSgra = ["WMTSlayer",{
    capabilURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities",
    kartlagWMTS: "topo4graatone",
    opacity: 1}
];

dataNorgeIBilderWMTS = ["WMTSlayer",{
    capabilURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities",
    kartlagWMTS: "Nibcache_web_mercator_v2",
    opacity: 1}
];

enkelBakgrunnWMTS = ["WMTSlayer",{
    capabilURL: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities",
    kartlagWMTS: "bakgrunnskart_forenklet",
    opacity: 1}
];



dataToporaster4Tiled = ["Tilelayer",{
    kartlag: new ol.layer.Tile({
        extent:  myProjectionExtent,
        source: new ol.source.TileWMS({
            url: "http://openwms.statkart.no/skwms1/wms.toporaster4",
            params: {'LAYERS': "toporaster", 'TILED': true},
            serverType: 'geoserver',
            // Countries have transparency, so do not fade tiles:
            transition: 1
        })
    })}
];





// http://localhost/markakart/wms.toporaster4
// http://openwms.statkart.no/skwms1/wms.toporaster4?version=1.3.0&service=wms&request=getcapabilities

// http://localhost/markakart/wms.toporaster4
// https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer?service=wms&request=getcapabilities 



// Start med OSM som bakgrunnskart ! 
bakgrunnskartDict["OSM"] = {"name": "OpenStreetMap","checked": 1, "kartdata": dataOSM, "lagGruppe": "bakgrunnskart"};

// Legg til WMTS tjenester
bakgrunnskartDict["toporaster4WMTS"] = {"name": "Toporaster4", "checked": 0,"kartdata": dataTopo4WMTS, "lagGruppe": "bakgrunnskart"};
bakgrunnskartDict["norgeIBilderWMTS"] = {"name": "Norge i bilder", "checked": 0,"kartdata": dataNorgeIBilderWMTS, "lagGruppe": "bakgrunnskart"};
bakgrunnskartDict["toporaster4WMTSgra"] = {"name": "Toporaster4 grå", "checked": 0,"kartdata": dataTopo4WMTSgra, "lagGruppe": "bakgrunnskart"};

bakgrunnskartDict["bakgrunnskartForenkletWMTS"] = {"name": "Bakgrunnskart forenklet", "checked": 0,"kartdata": enkelBakgrunnWMTS, "lagGruppe": "bakgrunnskart"};

//https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities


///////////////////////////////////////////////////////
// Annet undermeny

// Markagrensa
markagrensaKartdata = ["GeoJSONdata", {
    data: "data/markagrensa.geojson",
    strokeColor: [240,0,0,1],
    fillColor: [0,240,0,0],  //fungerer
    strokeWidth: 2,
    strokeColorSelect: [240,0,0,1],
    fillColorSelect: [0,240,250,0.7], 
    strokeWidthSelect: 4,
    opacity: 1,
    clickEvent: 0
    }];

annetDict = Object();

annetDict["markagrensa"] = {
        "name": "Markagrensa",
        "checked": 1,
        "kartdata": markagrensaKartdata,
        "lagGruppe": "kartlagGruppe"
    };

// Fotruter flyttes til under annet
FotruteData = ["WMSlayer", {
    url: "https://openwms.statkart.no/skwms1/wms.friluftsruter2",
    name: "Fotrute",
    opacity: 1
}];
annetDict["Fotrute"] = {"name": "Fotrute", "checked": 0, "kartdata":FotruteData, "lagGruppe": "kartlagGruppe"};
    
    
HistoriskData = ["WMSlayer", {
    url: "https://openwms.statkart.no/skwms1/wms.friluftsruter2",
    name: "Historisk",
    opacity: 1
}];
annetDict["Historisk"] = {"name": "Historisk ferdselsrute", "checked": 0, "kartdata":HistoriskData, "lagGruppe": "kartlagGruppe"};


/// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 
/// Legg til elementene i hovedmenyen.. 
var menyDict = Object();

//menyDict["Turer"] = {"name": "Turer", "dict": turerDict, "expanded": 0};

menyDict["Naturopplevelser"] = {"name": "Naturopplevelser",
                                "dict": naturoppDict,
                                "expanded": 1,
                                "lagGruppe": "kartlagGruppe"};

menyDict["verneforslag"] = {"name": "Våre verneforslag",
                            "dict": verneforslagDict,
                            "expanded": 0,
                            "lagGruppe":"kartlagGruppe"};

menyDict["forvaltningforslag"] = {"name": "Våre forvaltningsforslag",
                                  "dict": forvaltningsforslagDict,
                                  "expanded": 0,
                                  "lagGruppe": "kartlagGruppe"};

menyDict["verneomrader"] = {"name": "Vernede områder",
                            "dict": vernedeomraderDict,
                            "expanded": 0,
                            "lagGruppe": "verneomrader"};

menyDict["annet"] = {"name": "Annet",
                     "dict": annetDict,
                     "expanded": 0,
                     "lagGruppe": "kartlagGruppe"};

menyDict["bakgrunnskart"] = {"name": "Bakgrunnskart",
                             "dict": bakgrunnskartDict,
                             "expanded": 1,
                             "lagGruppe": "bakgrunnskart"};


// Ikke en kartlagkategori .. Dette er et unntak definert i addGroupToMenu()-funksjonen
menyDict["leggTilLag"] = {"name": "Legg til WMS/WMTS",
                          "dict": bakgrunnskartDict,
                          "expanded": 0,
                          "lagGruppe": "leggTilLag"};

/// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// 
// run function to initialise the menu
addGroupToMenu(menyDict);


///  /// /// 
// Alle de klikkbare lagene skal til én array
let klikkbareKartlag = [];

for (const [key, value] of Object.entries(menyDict)) {
    //console.log(key, value);
    for (const [key2, value] of Object.entries(menyDict[key])) {
        //console.log(key2);
        if (key2 == "dict") {
            for (const [key3, value] of Object.entries(menyDict[key][key2])) {
                try{
                    if (menyDict[key][key2][key3]["kartdata"][1]["clickEvent"] == 1 ){
                        klikkbareKartlag.push(key3);
                    }
                } catch {} // do nothing ..
            }
        }
    }
}
//console.log(klikkbareKartlag);