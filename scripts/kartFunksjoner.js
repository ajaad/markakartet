
// coordinates er i formatet [long, lat].
function sentrerKart(coordinates){

}

// Hent kartlag fra map-objektet med kartlagets navn.
function hentKartlagMedLagNavn(inLagNavn) {
//   console.log("hentKartlagMedLagNavn ~ inLagNavn: " + inLagNavn);
  var funnet = false;
  var funnetLag = null;

  map.getLayers().getArray().forEach((group) => {
      if (!funnet) {

        if (group.get("name") != "Bakgrunnskart") {

          group.getLayers().forEach((layer) => {
            // console.log(group.get("name") + " ~ " + layer.get("name"));
            if (!funnet) {
              if (inLagNavn === layer.get("name")) {
                // Debug:
                // console.log("hentKartlagMedLagNavn ~ fant kartlaget! inLagNavn: " + inLagNavn + ", layer: " + layer);
                funnetLag = layer;
                // console.log("Fant lag med samme navn!");
                // console.log(layer);

                funnet = true; // For å gjøre færre operasjoner? Viktigst for group, siden da vil den ikke sjekke hvert lag i gruppene.
                return layer; // Denne funker ikke...
              }
            }
          });

        }

      }
    });

  if (funnetLag != null) {
    return funnetLag;
  } else {
    return null;
  }
  // return null; // Kommentert ut denne siden det var noe problem...
}

// ! Var egentlig i kart.js, men lagt til her siden lagBakgrunnskartWMTS bruker den?
// var hovedMenyKlasseKartlagTekst;

// convert radians to degrees
function radToDeg(rad) {
    return (rad * 360) / (Math.PI * 2);
  }
  
  // convert degrees to radians
  function degToRad(deg) {
    return (deg * Math.PI * 2) / 360;
  }

// Hm... Er noe som heter scale(sx, sy, anchor). Kanskje bruke? ...
function lagFeaturePunkt(x, y, farge){

    // if(CSS.supports("color", farge)){
    //     console.log("Fargen " + farge + " er gyldig!");
    // } else {
    //     farge = defaultFargen;
    //     console.log("Fargen " + farge + " er ugyldig og ble satt til default fargen: " + defaultFargen);
    // }

    // Overrider farge for nå...
    farge = "rgba(255,0,0,1)";

    var coordSys = "EPSG:" + document.getElementById("epsgForm").value;

    var geometriPunkt = new ol.geom.Point(
        // proj4(coordSys, viewProjection, [x, y]) // Konvertering
        proj4(viewProjection, [x, y])
    );
    // var geometriPunkt = new ol.geom.Point(
    //     [x, y]
    // );

    // var featurePunkt = new ol.Feature(geometriPunkt);

    var featurePunkt = new ol.Feature({
        geometry: geometriPunkt,
        // labelPoint: point,
        // Kan også gjøre:
        // labelPoint: new ol.geom.Point([x, y]),
        name: "Her er jeg"
    });

    var punktStil = new ol.style.Style({
        fill: new ol.style.Fill({
            color: farge
        }),
        stroke: new ol.style.Stroke({
            width: 50,
            color: farge
        })
    });
    featurePunkt.setStyle(punktStil);

    // TEST
    var sirkelGeometri = new ol.geom.Circle(
        // proj4(coordSys, viewProjection, [x, y]), // Konvertering
        // [x, y],
        // [y, x],
        // proj4(viewProjection, [x, y]),
        // proj4(coordSys, [x, y]),
        // proj4(viewProjection, coordSys, [x, y]),
        // proj4(viewProjection, coordSys, [y, x]),
        proj4(viewProjection, viewProjection, [x, y]),
        1000
    );

    var featureSirkel = new ol.Feature(sirkelGeometri);

    var sirkelStil = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 100, 50, 0)'
        }),
        stroke: new ol.style.Stroke({
            width: 5,
            color: farge
        }),
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(55, 200, 150, 1)'
            }),
            stroke: new ol.style.Stroke({
                width: 1,
                color: 'rgba(55, 200, 150, 1)'
            }),
            // radius: 15 // Skjønner ikke denne?
        }),
    });
    featureSirkel.setStyle(sirkelStil);

    vectorSourceGPS.addFeature(featureSirkel);
    // vectorSourceGPS.addFeature(featurePunkt);

    return featurePunkt;
}
// Bare oppdatere så slipper å lage nytt punkt hele tiden. Tenkt for GPS.
function oppdaterFeaturePunkt(x, y){

}

// Hm... Må jeg lage ny eller kan jeg redigere en eksisterende feature? ...
function lageFeatureSirkel(x, y, diameter, farge){

    // Diameter variabelsjekk:
    if(diameter == null | diameter == ""){
        // diameter = 20.0;
        diameter = defaultFeatureSize;
    }

    /* Get coordinate system from form */
    var coordSys = "EPSG:" + document.getElementById("epsgForm").value;

    var sirkelGeometri = new ol.geom.Circle(
        proj4(coordSys, viewProjection, [x, y]), // Konvertering
        parseInt(diameter)
    );

    var featureSirkel = new ol.Feature(sirkelGeometri);

    // Først, sjekke om argumentet farge er en gyldig farge? ...
    // Hm, må være rgba og ikke hex?

    if(CSS.supports("color", farge)){
        console.log("Fargen " + farge + " er gyldig!");
    } else {
        // farge = 'rgba(25, 100, 50, 0.5)';
        farge = defaultFargen;
        // console.log("Fargen " + farge + " er ugyldig og ble satt til rgba(25, 100, 50, 0.5).");
        console.log("Fargen " + farge + " er ugyldig og ble satt til default fargen: " + defaultFargen);
    }

    var sirkelStil = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 100, 50, 0)'
        }),
        stroke: new ol.style.Stroke({
            width: 5,
            color: farge
        }),
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(55, 200, 150, 0)'
            }),
            stroke: new ol.style.Stroke({
                width: 1,
                color: 'rgba(55, 200, 150, 0)'
            }),
            // radius: 15 // Skjønner ikke denne?
        }),
    });

    featureSirkel.setStyle(sirkelStil);

    return featureSirkel;
}

// Lager ny feature sirkel og setter den inn i vektorlaget.
function lagOgSettNySirkel(x, y, diameter, farge){

    console.log("lagOgSettNySirkel ~ x: " + x + ", y: " + y);
    if(!x || !y){
        console.log("x eller y er false eller udefinert!");
        vectorSourceGeometry.clear();
        return; // Faktisk funket. Kanskje cleare også?
    }

    // Alt funker!
    // var nySirkel = lageFeatureSirkel(document.getElementById("xCoordForm").value, document.getElementById("yCoordForm").value, document.getElementById("sirkelForm").value, "rgb(0,255,0, 0.5)");
    var nySirkel = lageFeatureSirkel(x, y, diameter, farge);
    if(nySirkel != null){
      vectorSourceGeometry.clear();
      vectorSourceGeometry.addFeature(nySirkel);
      console.log("Lagde ny sirkel på koordinatene x: " + delFormX.value + ", y: " + delFormY.value);
      // Oppdatere URL her? Hvis sirkelen ble laget? ... Eller, gjøre det uansett? ...
    } else {
      console.log("nySirkel er null?!");
    }
    // vectorSourceGeometry.clear();
    // vectorSourceGeometry.addFeature(nySirkel);
}

// Function to check validity of the color code
function isValidRGB(colorCode) {
    // Regular expression to match valid RGB color codes
    pattern("^rgb\\((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?),\\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?),\\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\)$");
    // Check if the color code matches the pattern
    return regex_match(colorCode, pattern);
}

// Eksempel generert URL:
// https://markakartet.no/?title=Test&EPSG=4326&x=10.669356647882564&y=60.0236846138286&zoom=8.105473930583752&sirkel=1&beskrivelse=Ja

// 
function prepareView() {
    // Variabler fra URLen.
    var tittel = urlParameters.get("tittel");
    var beskrivelse = urlParameters.get("beskrivelse");
    var zoom = urlParameters.get("zoom");
    // Koordinater
    var coordSysCode = urlParameters.get("EPSG");
    var x = urlParameters.get("x");
    var y = urlParameters.get("y");
    // Geometri
    var sirkelRadius = urlParameters.get("sirkel");
    // Kartlag
    var lagRaw = urlParameters.get("lag");

    // Definert her, men må kjøres i annen funksjon etter at map er definert.
    if(lagRaw != null){
        lagListeFraURL = String(lagRaw).split(",");
        console.log(lagListeFraURL);
        // console.log("prepareView ~ lagListeFraURL: " + lagListeFraURL);
    }

    var coordSysFull = ""; // F.eks: EPSG:4326
    var finalX, finalY = 0;
    var finalZoom = defaultZoom;

    if (zoom != null) {
        finalZoom = parseFloat(zoom);
    }

    if (coordSysCode == null) {
        // Bruk default:
        coordSysCode = defaultCoordSysCode;
    }

    // Hm... Ser egentlig ut som at alle bruker EPSG her? ...
    coordSysFull = defaultCoordSysType + ":" + coordSysCode;
    // console.log(coordSysFull);

    if (x == null | y == null) {
        switch (coordSysFull) {
            case 'EPSG:4326':
                finalX = parseFloat(defaultX);
                finalY = parseFloat(defaultY);
                break;
            case 'EPSG:25831':
                // ?
                finalX = parseFloat(596710);
                finalY = parseFloat(6649257);
                break;
            case 'EPSG:25832':
                finalX = parseFloat(596710);
                finalY = parseFloat(6649257);
                break;
            case 'EPSG:25833':
                // ?
                finalX = parseFloat(596710);
                finalY = parseFloat(6649257);
                break;
            default: // Samme som EPSG:4326.
                finalX = parseFloat(defaultX);
                finalY = parseFloat(defaultY);
                break;
        }
    } else {
        finalX = parseFloat(x);
        finalY = parseFloat(y);
    }

    // Default radius nå? ...
    if (sirkelRadius == null) {
        // sirkelRadius = parseFloat(defaultCircleSize);
        sirkelRadius = parseFloat(defaultFeatureSize);
    }

    // Bare lag punkt hvis x og y er definert?
    if(x != null && y != null){
        var point = new ol.geom.Point([finalX, finalY]);
        console.log(point.getCoordinates());
    
        var circle = new ol.geom.Circle(
            proj4(coordSysFull, coordSysPseudoMercator, [finalX, finalY]), // Center
            parseFloat(sirkelRadius)
        );
    
        var circleFeature = new ol.Feature({
            geometry: circle,
            labelPoint: point,
            // Kan også gjøre:
            // labelPoint: new ol.geom.Point([finalX, finalY]),
            name: "circle"
        });
    
        // NOTE: Kan sette style med .setStyle(stil)!

        // Hardcoded stil, hm... Kanskje kan gjøre det valgbart senere.
        var sirkelStil = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 100, 50, 0)'
            }),
            stroke: new ol.style.Stroke({
                width: 5,
                color: document.getElementById("figurFargeForm").value
            }),
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: 'rgba(55, 200, 150, 0)'
                }),
                stroke: new ol.style.Stroke({
                    width: 1,
                    color: 'rgba(55, 200, 150, 0)'
                }),
                // radius: 15 // Skjønner ikke denne?
            }),
        });
    
        circleFeature.setStyle(sirkelStil);
    
        vectorSourceGeometry.addFeature(circleFeature);

        // Hm.
        document.getElementById("xCoordForm").value = finalX;
        document.getElementById("yCoordForm").value = finalY;
    }

    // Sette document-verdier:
    if(tittel != null){
        document.getElementById("titleForm").value = tittel;
    }
    if(beskrivelse != null){
        document.getElementById("beskrivelseForm").value = beskrivelse;
    }
    // De andre har defaults:
    document.getElementById("zoomForm").value = finalZoom;
    // document.getElementById("xCoordForm").value = finalX;
    // document.getElementById("yCoordForm").value = finalY;
    document.getElementById("sirkelForm").value = sirkelRadius;

    // Convert the startpoint to pseudomercator 
    var startpunktCoord = proj4(coordSysFull, coordSysPseudoMercator, [finalX, finalY]);

    // Make a view object
    var newView = new ol.View({
        center: startpunktCoord,
        zoom: finalZoom
    });

    // 
    // genererURL(); // Hm, ikke generere URL ved laging av map-viewet...

    // var outputArray = [coordSysFull, vektorLagGeometri, newView, circleFeatureEkstra, point];
    var outputArray = [newView, startpunktCoord];
    return outputArray;
}
