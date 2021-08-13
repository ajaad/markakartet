window.onload = init;

var moveCount = 0;
var coordFromView = 1;



function init(){


  // Get the GET-variables from the URL
  var outputarray = getGETvariables();

  var newview = outputarray[0]    // Viewsettings object
  var sirkelLag = outputarray[1]  // Circlelayer object
  var coordSys = outputarray[2]   // Used coordinate system

  /* Parse the active coordinate system to the form */
  document.getElementById("epsgForm").value = printCoordSys();

  ///  Popupbox - start ///
  const popupContainer = document.getElementById('popup');
  const popupContent = document.getElementById('popup-content');
  //const popupCloser = document.getElementById('popup-closer');

  const overlay = new ol.Overlay({
    element: popupContainer,
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  });

  window.lukkInfoPopupFunc = function(){
    // Funksjon for å lukke infoPopup-boksen 
    popupContainer.classList.add("hidePopup"); // perfection
  };

  // eventyrskogerNaturopp

  let highlight;
  const displayFeatureInfo = function (pixel) {

    lukkInfoPopupFunc(); // Lukk vindu om det er et aktivt oppe allerede.

    var feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
      
      lagnavn = layer.get("name"); // navn på kartlaget

      const info = document.getElementById('popup-content');

      // Sjekk om laget skal være trykkbart
      if (klikkbareKartlag.includes(lagnavn)) {

        
        if (feature) {
          
          htmlString = "<div class='popupTitle'>" + feature.get('navn') + "</div>";
          htmlString += "<br> Verdi: " + feature.get('verdi');
          
          info.innerHTML = htmlString;

          popupContainer.classList.remove("hidePopup");
    
        } else {
          info.innerHTML = '&nbsp;'; // Tom boks
          lukkInfoPopupFunc();
        } 

      }

    });
  
    /*
    const info = document.getElementById('popup-content');
    
    if (feature) {
      //info.innerHTML = feature.getId() + ': ' + feature.get('navn');
      htmlString = "<div class='popupTitle'>" + feature.get('navn') + "</div>";
      htmlString += "<br> Verdi: " + feature.get('verdi');

      popupContainer.classList.remove("hidePopup");

      info.innerHTML = htmlString;

    } else {
      info.innerHTML = '&nbsp;'; // Tom boks
      lukkInfoPopupFunc();
    }*/
  };

  ///  Popupbox - end ///


  /// LayerGroup ///
/*
        // OSM
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        })
*/
/*
"Turer"
"Naturopplevelser"
"verneforslag"
"forvaltningforslag"
"verneomrader"*/

  kartlagDict = {
    "bakgrunnskart" : new ol.layer.Group({
      opacity: 1,
      layers: []
    }),
    "kartlagGruppe" : new ol.layer.Group({
      opacity: 1,
      layers: []
    }),
    "verneomrader" : new ol.layer.Group({
      opacity: 1,
      layers: []
    }),
    "forvaltningforslag" : new ol.layer.Group({
      opacity: 1,
      layers: []
    }),
    "verneforslag" : new ol.layer.Group({
      opacity: 1,
      layers: []
    }),
    "Naturopplevelser" : new ol.layer.Group({
      opacity: 1,
      layers: []
    }),
    "Turer" : new ol.layer.Group({
      opacity: 1,
      layers: []
    })
  }

  /*
  // bakgrunnskart 
  bakgrunnskart = new ol.layer.Group({
    opacity: 1,
    layers: []
  });

  // Andre kartlag .. 
  kartlagGruppe = new ol.layer.Group({
    opacity: 1,
    layers: []
  });
  */

  // Make a list of maplayers  // Tegnerekkefølgen settes her! 
  var kartlagList = [
    kartlagDict["bakgrunnskart"],
    kartlagDict["kartlagGruppe"],
    kartlagDict["verneomrader"],
    kartlagDict["forvaltningforslag"],
    kartlagDict["verneforslag"],
    kartlagDict["Naturopplevelser"],
    kartlagDict["Turer"],
    sirkelLag
  ];

  /*
  var bakgrunnKartlag = [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
    sirkelLag
  ]; */


  document.getElementById("addwmslayer").onclick = function (nyttkartlag) {
    // Function for adding a WMS layer

    var newlayername = document.getElementById("newlayername").value;
    var neswmsurl = document.getElementById("newurlwms").value;
  
    var nyttlag = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: neswmsurl,
        params: {'LAYERS': newlayername},
        ratio: 2,
        serverType: 'mapserver'
      })
    });

    map.addLayer(nyttlag); // Add WMS-layer to map layers
    console.log(newlayername, "was added to the map layers");
  };

  // Målestokk
  let scaleType = 'scaleline';
  let control;

  function scaleControl() {
    control = new ol.control.ScaleLine({
      target: document.getElementById('scale-line-id'),
      units: 'metric',
      minWidth: 120
    });
    return control;
  }


  function zoomControl() {
    control = new ol.control.Zoom({
      target: document.getElementById('zoomknapper')
    });
    return control;
  }


  // Generer kartobkelt
  var map = new ol.Map({
    controls: ol.control.defaults({
      zoom: false // ta bort default zoom fra default..
    }).extend([
      scaleControl(),
      zoomControl()
    ]), // legg til scalebar
    target: 'map',
    renderer: 'canvas',
    layers: kartlagList,
    view: newview,
    overlays: [overlay] // popupboksen
  });


  /* POINTER CIRCLE FUNCTIONS */
  window.oppdaterPekeSirkel = function(x,y){
    /* oppdater med peker */

    var r = document.getElementById("sirkelForm").value

    if (delKartvisningOpen == 1) {
      var f = 'rgba(255, 0, 0, 255)';
      coordFromView = 0; // Do not use viewcoordinates
    } else {
      var f = 'rgba(255, 0, 0, 0)';
      coordFromView = 1; // Use coordinates from view
    }

    // Sok og slett tidligere lag med "pekerSirkel"-markoeren 
    map.getLayers().getArray()
      .filter(layer => layer.get('name') === 'pekerSirkel')
      .forEach(layer => map.removeLayer(layer));
    

    var sirkelLag = pekerSirkel(x,y,r,f);
    map.addLayer(sirkelLag);
  }

  window.oppdaterPekeSirkelManual = function(){
    /* Manual updating by writing values */

    var y = document.getElementById("yCoordForm").value
    var x = document.getElementById("xCoordForm").value
    var r = document.getElementById("sirkelForm").value

    if (delKartvisningOpen == 1) {
      var f = 'rgba(255, 0, 0, 255)';
      coordFromView = 0; // Do not use viewcoordinates
    } else {
      var f = 'rgba(255, 0, 0, 0)';
      coordFromView = 1; // Use coordinates from view
    }
    

    // Sok og slett tidligere lag med "pekerSirkel"-markoeren 
    map.getLayers().getArray()
      .filter(layer => layer.get('name') === 'pekerSirkel')
      .forEach(layer => map.removeLayer(layer));
    
    var sirkelLag = pekerSirkel(x,y,r,f);
    map.addLayer(sirkelLag);
  }

  // Delete all temporary pointer circles! 
  window.deletePekerSirkel=function(){
    map.getLayers().getArray()
    .filter(layer => layer.get('name') === 'pekerSirkel')
    .forEach(layer => map.removeLayer(layer));

    coordFromView = 1; // Use view coordinates when circle is whiped
  }

  window.oppdaterZoom=function(){
    // Manualy adjust zoom level with the Form.. 
    map.getView().setZoom(document.getElementById("zoomForm").value);
  }

  // Klikk på kartet
  map.on('click',function(e){
    // Function to return coordinates to the console
    // when the map is clicked.
    var viewProjection = 'EPSG:3857';

    /* Get coordinate system from form */
    coordSys = "EPSG:" + document.getElementById("epsgForm").value;

    console.log(coordSys + " " + proj4(viewProjection,coordSys,e.coordinate));
    

    closeAboutFunc(); // funksjon for å lukke "aboutvinduet" når man trykker i kartet.
    closeStotteFunc(); // Lukk stottevinduet når man trykker i kartet.. 

    //console.log(e.coordinate);
    //console.log(proj4(viewProjection,coordSys,e.coordinate)[0]);

    var y = proj4(viewProjection,coordSys,e.coordinate)[1];
    var x = proj4(viewProjection,coordSys,e.coordinate)[0];
    

    document.getElementById("yCoordForm").value = y;
    document.getElementById("xCoordForm").value = x;

    var currentZoom = e.frameState.viewState.zoom; // map.getZoom() didn't work
    document.getElementById("zoomForm").value = currentZoom;

    oppdaterPekeSirkel(x,y);

    // Klikk på objekt for å få info //    
    overlay.setPosition(e.coordinate);

    // vise boks med informasjon:
    const pixel = map.getEventPixel(e.originalEvent); // pixel i skjermvinduet
    displayFeatureInfo(pixel);

  });

  // Selve knappen
  const tilbakeTilDuSerPaKnapp = document.getElementById("tilbakeTilDuSerPaID");

  // Gå tilbake til utgangspunktvisning..
  document.getElementById("tilbakeTilDuSerPaID").onclick = function (startpointfunc) {
    // Function for going back to original view
    var outputarray = getGETvariables();
    map.setView(outputarray[0]); // Set a new view !

    moveCount = 0;
    tilbakeTilDuSerPaKnapp.classList.remove('tilbake');
    tilbakeTilDuSerPaKnapp.classList.add('start');
  };


  map.on("movestart", function(e){
    //console.log("kart flyttet!!")
    if ( moveCount > 0 ) {
      //tilbakeTilDuSerPaKnapp.classList.remove('start');
      tilbakeTilDuSerPaKnapp.classList.add('tilbake');
    };

    moveCount += 1;
  });


  map.on("moveend", function(e){

    // If coordinates is not set by user,
    // it the viewcoordinates will be used:

    if (coordFromView == 1) {
      var currentZoom = e.frameState.viewState.zoom; // map.getZoom() didn't work
      document.getElementById("zoomForm").value = currentZoom;

      // oppdater punkt ved flytting! 
      var centerCoord = map.getView().ri; //.targetCenter_  endret fra v6.5.0 til v6.6.1

      //console.log(centerCoord);

      /* Get coordinate system from form */
      coordSys = "EPSG:" + document.getElementById("epsgForm").value;

      var y = proj4(viewProjection,coordSys,centerCoord)[1];
      var x = proj4(viewProjection,coordSys,centerCoord)[0];


      document.getElementById("yCoordForm").value = y;
      document.getElementById("xCoordForm").value = x;
    }
  });


  window.getCoordSys=function(){
    /* Function for reporting change in coordinate system */ 

    // The previously used coordinate system
    var gammeltCoordSys = coordSys;

    // Overwrite coordintesystem
    coordSys = "EPSG:" + document.getElementById("epsgForm").value;

    console.log("Endret koordinatsystem til " + coordSys)

    // Get the values from the form
    var x = document.getElementById("xCoordForm").value;
    var y = document.getElementById("yCoordForm").value;

    // Transform
    var nyttKoordinat = proj4(gammeltCoordSys,coordSys,[x,y]);

    // Write to form
    document.getElementById("yCoordForm").value = nyttKoordinat[1];
    document.getElementById("xCoordForm").value = nyttKoordinat[0];

  }

  /////////////////////
  // Legg til testlag

  function leggTilTileLayer(kartDataDict,lagGruppe){
    kartlagDict[lagGruppe].getLayers().push(kartDataDict["kartlag"])

  }

  function fjernTileLayer(kartDataDict,lagGruppe){
    kartlagDict[lagGruppe].getLayers().remove(kartDataDict["kartlag"])
  }

  function leggTilWMSlag(kartDataDict,elementTitle,lagGruppe){

    // Husk å fjerne alt etter ? i url'en

    neswmsurl = kartDataDict["url"];
    newlayername = kartDataDict["name"];

    var wmslag = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: neswmsurl,
        params: {'LAYERS': newlayername},
        ratio: 2,
        serverType: 'mapserver'
      })
    });

    lagObjekt[elementTitle] = wmslag;

    kartlagDict[lagGruppe].getLayers().push(lagObjekt[elementTitle]); 

  }


  function leggTilGeoJSON(inputDict,elementTitle){
    /* Global funksjon for å legge til GeoJSONlag */
  
    /* Stilobjekt for strek */
    var stroke = new ol.style.Stroke({
      color: inputDict["strokeColor"],
      width: inputDict["strokeWidth"],
    });
  
    /* Stilobjekt for fyll */
    var fyll = new ol.style.Fill({
      color: inputDict["fillColor"]
    });
  
    /* Samlet stilobjekt */
    var style1 = new ol.style.Style({
      stroke: stroke,
      fill: fyll
    });


  
    var geojsonFeature = new ol.format.GeoJSON({
      /* Data projection */
      dataProjection: "EPSG:25832",
      featureProjection: 'EPSG:3857'
    });
  
    /* Kilden */
    var geojsonKilde = new ol.source.Vector({
        url: inputDict["data"],
        format: geojsonFeature
      });
  
    var vectorLag = new ol.layer.Vector({
      name: elementTitle,
      source: geojsonKilde,
      style: style1,
      opacity: inputDict["opacity"],
    });

    lagObjekt[elementTitle] = vectorLag;
  
    // Legg til kartlag
    map.addLayer(lagObjekt[elementTitle]);

    if (inputDict["clickEvent"] == 1){
      //////////////////////////
      var strokeSelect = new ol.style.Stroke({
        color: inputDict["strokeColorSelect"],
        width: inputDict["strokeWidthSelect"],
      });
      
      /* Stilobjekt for fyll */
      var fyllSelect = new ol.style.Fill({
        color: inputDict["fillColorSelect"]
      });
    
      var styleSelect = new ol.style.Style({
        stroke: strokeSelect,
        fill: fyllSelect
      });

      // Legg til interaksjon (Endrer farge ved valg)
      const selectHover = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove,
        style: styleSelect,
        layers: [lagObjekt[elementTitle]]
      });

      const selectClick = new ol.interaction.Select({
        condition: ol.events.condition.click,
        style: styleSelect,
        layers: [lagObjekt[elementTitle]]
      });

      map.addInteraction(selectHover);
      map.addInteraction(selectClick);
    }

  }

  lagObjekt = {}; // opprett et objekt til å lagge lagene inn i ...
  lagObjektBakgrunn = {};

  
  function fjernLag(elementTitle){
    map.removeLayer(lagObjekt[elementTitle]);
  }


  function fjernLagFraLaggruppe(kartDataDict, elementTitle, lagGruppe){

    // Fjern lag fra laggruppe ..
    console.log("fjern fra gruppe");
    console.log("Layers : " + kartlagDict[lagGruppe]);

    console.log(kartlagDict[lagGruppe].getLayers().remove());

    //kartDataDict["dict"]
    console.log(kartlagDict[lagGruppe]);
    kartlagDict[lagGruppe].getLayers().remove(lagObjekt[elementTitle]);


  }


  function fjernKartlag(kartDataDict, elementTitle, lagGruppe, lagType){
    // Generell funksjon for å fjerne lag av alle typer..

    switch(lagType){
      case "GeoJSONdata":fjernLag(elementTitle);
      break;
      case "WMSlayer": fjernLagFraLaggruppe(kartDataDict, elementTitle, lagGruppe);
      break;
      case "Tilelayer": fjernTileLayer(kartDataDict, lagGruppe);
      break;
      case "WMTSlayer": FjernWmtsFunc(kartDataDict, lagGruppe);
      break;
    }
  }

  function oppdaterHTML(lagGruppe){
    // Hver gang jeg tvinger inn nye elementer i HTML-koden,
    // må jeg oppdatere alle bindingene inne i objektet som påvirkes.
    
    let kartlagPa = Object.keys(menyDict[lagGruppe]["dict"]);
    for (let i = 0; i < kartlagPa.length; i++) {

      menyDict[lagGruppe]["dict"][kartlagPa[i]]["layer"] = document.getElementById(kartlagPa[i] + "OptionsFromMenu");
      menyDict[lagGruppe]["dict"][kartlagPa[i]]["verticalLineMark"] = document.getElementById(kartlagPa[i] + "VL");

    }
  }

  function fjernAlleKartlag(lagGruppe){

    let kartlagPa = Object.keys(menyDict[lagGruppe]["dict"]);
    for (let i = 0; i < kartlagPa.length; i++) {

      lagType = menyDict[lagGruppe]["dict"][kartlagPa[i]]["kartdata"][0];
      kartDataDictForFjern = menyDict[lagGruppe]["dict"][kartlagPa[i]]["kartdata"][1]
      lagnavn = kartlagPa[i];

      // Uncheck
      console.log(kartlagPa[i]);
      

      // Definer pa nytt!
      // Det ser ut til at jeg måtte definere disse på nytt etter at jeg har endret i html-filen!! 

      menyDict[lagGruppe]["dict"][kartlagPa[i]]["verticalLineMark"].classList.add("menuOptionUncheck");
      menyDict[lagGruppe]["dict"][kartlagPa[i]]["checked"] = 0;

      fjernKartlag(kartDataDictForFjern, kartlagPa[i], lagGruppe, lagType);
    }
  }
    
 
  
  window.velgLagFunc = function(title,elementTitle){
    /* Check and uncheck element in list  */

    var checked = menyDict[title]["dict"][elementTitle]["checked"];


    if (checked == 1){
        menyDict[title]["dict"][elementTitle]["verticalLineMark"].classList.add("menuOptionUncheck");
        menyDict[title]["dict"][elementTitle]["checked"] = 0;
        

        typeKartData = menyDict[title]["dict"][elementTitle]["kartdata"][0];
        kartDataDict = menyDict[title]["dict"][elementTitle]["kartdata"][1];

        lagGruppe = menyDict[title]["dict"][elementTitle]["lagGruppe"]

        switch(typeKartData){
          case "GeoJSONdata":fjernLag(elementTitle);
          break;
          case "WMSlayer": fjernLagFraLaggruppe(kartDataDict, elementTitle, lagGruppe);
          break;
          case "Tilelayer": fjernTileLayer(kartDataDict, lagGruppe);
          break;
          case "WMTSlayer": FjernWmtsFunc(kartDataDict, lagGruppe);
          break;
        }


    } else {



        elementer = Object.keys(menyDict[title]["dict"][elementTitle]);
        for (var i = 0; i < elementer.length; i++) {

            if (elementer[i] == "kartdata") {

                typeKartData = menyDict[title]["dict"][elementTitle]["kartdata"][0];
                kartDataDict = menyDict[title]["dict"][elementTitle]["kartdata"][1];

                lagGruppe = menyDict[title]["dict"][elementTitle]["lagGruppe"];
                //lagGruppe = title;

                if (lagGruppe == "bakgrunnskart"){
                  // Dersom det legges til ett nytt bakgrunnskart
                  // skal alle andre bakgrunnskart fjernes

                  let kartlagPa = Object.keys(menyDict["bakgrunnskart"]["dict"]);
                  for (let i = 0; i < kartlagPa.length; i++) {

                    lagType = menyDict["bakgrunnskart"]["dict"][kartlagPa[i]]["kartdata"][0];
                    kartDataDictForFjern = menyDict["bakgrunnskart"]["dict"][kartlagPa[i]]["kartdata"][1]
                    lagnavn = kartlagPa[i];

                    // Uncheck
                    
                    menyDict["bakgrunnskart"]["dict"][kartlagPa[i]]["verticalLineMark"].classList.add("menuOptionUncheck");
                    menyDict["bakgrunnskart"]["dict"][kartlagPa[i]]["checked"] = 0;

                    fjernKartlag(kartDataDictForFjern, kartlagPa[i], lagGruppe, lagType);
                  } 
                }

                // Check
                menyDict[title]["dict"][elementTitle]["verticalLineMark"].classList.remove("menuOptionUncheck");
                menyDict[title]["dict"][elementTitle]["checked"] = 1;

                switch(typeKartData){
                  case "GeoJSONdata": leggTilGeoJSON(kartDataDict,elementTitle);
                  break;
                  case "WMSlayer": leggTilWMSlag(kartDataDict,elementTitle,lagGruppe);
                  break;
                  case "Tilelayer": leggTilTileLayer(kartDataDict,lagGruppe);
                  break;
                  case "WMTSlayer": leggTilWmtsFunc(kartDataDict, lagGruppe);
                  break;
                }


              }
          }
      }
  }

 
  function oppdaterKartvisning(menyDict){
    // If som layers defaults to active when 
    // the map loads, the velgLagFunc()-function should be 
    // run once for theese particular layers..
    
    mainElements = Object.keys(menyDict);
    for (var i = 0; i < mainElements.length; i++) {
      menuElements = Object.keys(menyDict[mainElements[i]]["dict"]);

      for (var j = 0; j < menuElements.length; j++) {

        let checked = menyDict[mainElements[i]]["dict"][menuElements[j]]["checked"];

        if (checked == 1) {
          velgLagFunc(mainElements[i],menuElements[j]);
          velgLagFunc(mainElements[i],menuElements[j]); // Run twice to create the layer
        }

      }

    }
  }

  oppdaterKartvisning(menyDict);


  window.leggTilWMSWMTSKnappFunc = function(){
    // Funksjon får å legge til WMS/WMTS lag ..

    nyttLagEgetLagnavn = document.getElementById("nyttLagEgetLagnavn").value;
    nyttLagLagGruppe = document.getElementById("nyttLagLagGruppe").value;

    nyttLagLayer = document.getElementById("nyttLagLayer").value;
    nyttLagGetCapabilities = document.getElementById("nyttLagGetCapabilities").value;

    dataNyttLag = ["WMTSlayer",{
        capabilURL: nyttLagGetCapabilities,
        kartlagWMTS: nyttLagLayer,
        opacity: 1}
    ];

    if (menyDict[nyttLagLagGruppe]["dict"][nyttLagLayer] == null ){

      menyDict[nyttLagLagGruppe]["dict"][nyttLagLayer] = {
         "name": nyttLagEgetLagnavn,
         "checked": 1,
         "kartdata": dataNyttLag,
         "lagGruppe": "bakgrunnskart"
        };

      elementTitle = nyttLagLayer;
      title = nyttLagLagGruppe;
      menyDict[title]["dict"][elementTitle]["lagGruppe"] = nyttLagLagGruppe;
      elementTitleNice = nyttLagEgetLagnavn;


      // INSERT HTML-kode
      let vlStart = "verticalLine";   
      let buttonFuncLayer = "velgLagFunc('" + title + "','" + elementTitle + "')";

      let ElementBlock = "<div class='optionsFromMenu' id='" + elementTitle + "OptionsFromMenu'>\n\
          <button id='" + elementTitle +"' class='menuOption'\n\
          onclick="+ buttonFuncLayer + ">\n\
          <span id='" + elementTitle +"VL' class='" + vlStart + "'></span>" + elementTitleNice + "</button>\n\
          </div>";

      // Legg til i html objekt! 
      let node = document.getElementById(title + "OptionsFromMenu");
      node.innerHTML += ElementBlock;


      menyDict[title]["dict"][elementTitle]["checked"] = 1;
      menyDict[title]["dict"][elementTitle]["layer"] = document.getElementById(elementTitle + "OptionsFromMenu");
      menyDict[title]["dict"][elementTitle]["verticalLineMark"] = document.getElementById(elementTitle + "VL");

      
      
      if (nyttLagLagGruppe == "bakgrunnskart"){
        fjernAlleKartlag("bakgrunnskart");
        oppdaterHTML(nyttLagLagGruppe); //oppdater html objektene i den aktuelle gruppen
        velgLagFunc(title,elementTitle); // aktiver lag 
      } else {
        oppdaterHTML(nyttLagLagGruppe); //oppdater html objektene i den aktuelle gruppen
        velgLagFunc(title,elementTitle);
        velgLagFunc(title,elementTitle); // denne funksjonen må kjøres to ganger for ikke-bakgrunnskart
      }


    } else {
      let melding = menyDict[nyttLagLagGruppe]["name"] + " -> " + nyttLagEgetLagnavn;
      alert("Lag er allerede lagt til! Se: " + melding);
    }
  }

  window.scrapWMTSvWMSButton = function(){
    // Funksjon for å scrappe getCapabilities etter mulige kartlag! 

    nyttLagGetCapabilities = document.getElementById("nyttLagGetCapabilities").value;

    scrapWMTSvWMS(nyttLagGetCapabilities);
  }

  window.oppdaterNyttLagEgetLagnavn = function(){
    // les av verdi

    // Må også vite at jeg faktisk valgte ett av altenativene... 
    let id = document.getElementById("nyttLagLayer").value + "_lagvalg";

    harTitle = 0;
    try {
      inner = document.getElementById(id).innerText;
      if (inner != ""){
        harTitle = 1;
        document.getElementById("nyttLagEgetLagnavn").value = document.getElementById(id).innerText;
      } else {
        document.getElementById("nyttLagEgetLagnavn").value = document.getElementById(id).value;
      }
    } catch {}
  }


  window.infoButtonClick = function(title,tilBoks,tilContainer){

    
    console.log("Informasjon om dette: " + title);

    //const infoboks = document.getElementById("infoBoks-container"); // finn element i html
    const infoboks = document.getElementById(tilContainer);
    infoboks.classList.remove("show");
    

    // tittel for infoboks
    const infoBoksTittel = document.getElementById("infoBoks-tittel");

    try{
      nicetitle = menyDict[title]["name"];
      infoBoksTittel.innerHTML = nicetitle;
    } catch {
      nicetitle = title;
    }
      

    // infoboks innhold
    lesFil(title,tilBoks);

    infoboks.classList.add("show");

  }

  window.lukkBoksFunc = function(boks){
    // generell funksjon for å lukke boks...
    // Boksen er gjerne containeren..
    const vilkaarligBoks = document.getElementById(boks);

    //infoboks.classList.add("lefthidden");
    vilkaarligBoks.classList.remove("show");
  }
    

  return map;
}