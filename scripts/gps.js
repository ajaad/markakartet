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
var positionFeatureStil;
var positionFeatureStilMedPil;
var brukeViewSentreringMedGPS = true; // Bare har denne også så sentrering kan skrus av enklere.
var sentrertViewPaaGPS = false; // Sentrere view når GPS skrus på?
//
// let debugGPSContainer;
// var debugGPS; // Textview bare for å debugge GPSen.
let gpsErAktiv = false;
let gpsFunker = false;

$(document).ready(function () {
  gpsKnapp = document.getElementById("gpsButtonContainer");
  // debugGPSContainer = document.getElementById("debugGPSContainer");
  // debugGPS = document.getElementById("debugGPS");

  lagGpsStiler();

  geolocation = new ol.Geolocation({
    // enableHighAccuracy must be set to true to have the heading value.
    trackingOptions: {
      enableHighAccuracy: true,
    },
    projection: viewProjection,
    tracking: false,
  });

  accuracyFeature = new ol.Feature();
  vectorSourceGPS.addFeature(accuracyFeature);
  positionFeature = new ol.Feature();
  positionFeature.setStyle(positionFeatureStil);
  // positionFeature.setStyle(positionFeatureStilMedPil);
  vectorSourceGPS.addFeature(positionFeature);

  if (gpsKnapp != null) {
    gpsKnapp.addEventListener("click", function () {
      // console.log("gpsKnapp clicked!");
      toggleTracking(!gpsErAktiv);
    });
  } else {
    console.log("Ingen gpsKnapp med ID gpsButtonContainer er definert.");
  }

  function successFunction(position){
    // console.log("successFunction triggered");
    // console.log(position);
    ordneGPS(true);

    // Plausible Analytics
    try {
      /*
      plausible("Mål 7: Aktivert GPS", {
      });
      */
    } catch (e) {
      console.log(e);
    }
  }
  function errorFunction(error){
    // console.log("errorFunction triggered");
    // console.log(error);
    ordneGPS(false);
    fadeInnogUtDebugMelding(error.message, 5000);
  }
  function positionErrorFunction(positionError){
    // console.log("positionErrorFunction triggered");
    // console.log(positionError);
    ordneGPS(false);
    fadeInnogUtDebugMelding(positionError.message, 5000);
  }
  
  function toggleTracking(state) {
    // Hvis man skal skru av GPS så trenger man ikke sjekke om den virker.
    if(!state){
      ordneGPS(false);
    } else {
      navigator.geolocation.getCurrentPosition(
        successFunction, errorFunction, positionErrorFunction
      );
    }
  }

  // 
  geolocation.on("change:tracking", function (event) {
    // console.log("geolocation ~ tracking changed! tracking: " + event.target.get("tracking"));
  });

  // update the HTML page when the position changes.
  geolocation.on("change", function () {
    var accuracy = geolocation.getAccuracy();
    var altitude = geolocation.getAltitude();
    var altitudeAccuracy = geolocation.getAltitudeAccuracy();
    var heading = geolocation.getHeading();
    var speed = geolocation.getSpeed();
    var position = geolocation.getPosition();
    var x = geolocation.getPosition()[0];
    var y = geolocation.getPosition()[1];
    var intX = parseInt(x);
    var intY = parseInt(y);
    var intAccuracy = parseInt(accuracy);
    var headingShort = parseFloat(heading).toFixed(2);
    var intAltitude = parseInt(altitude);
    var headingDegrees = radToDeg(heading);
    var intHeadingDegrees = parseInt(headingDegrees);

    // // document.getElementById("debugGPS").innerHTML = "acc: " + intAccuracy + ", alt: " + intAltitude + ", head: " + headingShort + ", hDegrees: " + intHeadingDegrees;
    // console.log("geolocation on change ~ x: " + x + ", y: " + y + ", heading: " + heading);

    if (!sentrertViewPaaGPS && brukeViewSentreringMedGPS) {
      if (position != null) {
        sentrertViewPaaGPS = true;
        // map.getView().setCenter(coordinates); // Ser ut til å virke!
        sentrerMapPaaKoordinater(geolocation.getPosition());
      }
    }

  });

  // Hm... getAccuracyGeometry?
  geolocation.on("change:accuracyGeometry", function () {
    onChangeAccuracyFeature();
  });

  geolocation.on("change:position", function () {
    onChangePositionFeature();
  });

  geolocation.on("error", function (error) {
    debugVisGPSFeilmelding(error);
  });
});

function ordneGPS(state){
  if(state){
    startGPS();
  } else {
    nullstillGPS();
  }
}
function nullstillGPS(){
  gpsErAktiv = false;
  geolocation.setTracking(false);
  setGPSKnappStil(false);
    // Ta bort features i vectorSourceGPS:
    vectorSourceGPS.forEachFeature((feature) => {
      vectorSourceGPS.removeFeature(feature);
    });
    // fadeInnogUtDebugMelding("GPS er av", 1000);
}
function startGPS(){
  gpsErAktiv = true;
  geolocation.setTracking(true);
  setGPSKnappStil(true);
    // Geolocation (GPS) skrus på. Resette denne booleanen:
    sentrertViewPaaGPS = false;

    // Lage på nytt?
    lagAccuracyFeature();
    lagpositionFeature();
    // Trigge disse når GPS blir skrudd på igjen.
    onChangeAccuracyFeature();
    onChangePositionFeature();
    // For debug:
    var coordinates = geolocation.getPosition();
    // Er den null her? I så fall, må trigge den et annet sted...
    if (coordinates != null) {
      console.log(coordinates);
      // if(!sentrertViewPaaGPS && brukeViewSentreringMedGPS){
      //   sentrertViewPaaGPS = true;
      //   // map.getView().setCenter(coordinates); // Ser ut til å virke!
      //   sentrerMapPaaKoordinater(coordinates);
      // }
    }
    // fadeInnogUtDebugMelding("GPS er på", 1000);
}

// ol/Geolocation.GeolocationError (?)
// https://openlayers.org/en/latest/apidoc/module-ol_Geolocation.GeolocationError.html
function debugVisGPSFeilmelding(error){
  // Hvis man printer error får man bare opp object Object.
  console.log("geolocation, showError. error code: " + error.code + ", message: " + error.message);

  let melding = "";
  if (debugGPS != null) {
    switch (error.code) {
      case error.PERMISSION_DENIED: case 1:
        melding = "User denied Geolocation";
        break;
      case error.POSITION_UNAVAILABLE: case 2:
        melding = "GPS is unavailable";
        break;
      case error.TIMEOUT: case 3:
        melding = "GPS timed out";
        break;
      default:
        melding = "GPS failed";
        break;
    }
    fadeInnogUtDebugMelding(melding, 5000);
  }

  ordneGPS(false); // Skjule GPS kartlag og sånt ved feil
  setGPSKnappStil(false); // Hvis error så regner med at GPS ikke funker...
}

function setGPSKnappStil(isTrackingState) {
  if (gpsKnapp != null) {
    if (isTrackingState) {
      gpsKnapp.style.backgroundColor = logoFarge;
      gpsKnapp.style.borderColor = logoFarge;
      gpsKnapp.classList.add("enabledHover");
      gpsKnapp.classList.remove("disabledHover");
    } else {
      gpsKnapp.style.backgroundColor = fargeTones7;
      gpsKnapp.style.borderColor = fargeTones7;
      gpsKnapp.classList.add("disabledHover");
      gpsKnapp.classList.remove("enabledHover");
    }
  }
}

function onChangeAccuracyFeature() {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
}

function onChangePositionFeature() {
  const coordinates = geolocation.getPosition();

  if (coordinates) {
    if (positionFeaturePunkt != null) {
      // Sentrere view til gps posisjon her?
      // NOTE: Satt det i geolocation.on(change) istedenfor.
      // if(!sentrertViewPaaGPS && brukeViewSentreringMedGPS){
      //   sentrertViewPaaGPS = true;
      //   // map.getView().setCenter(coordinates); // Ser ut til å virke!
      //   sentrerMapPaaKoordinater(coordinates);
      // }

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

// Støtte for zoom? Hm.
function sentrerMapPaaKoordinater(coordinates) {
  if (map != null) {
    // map.getView().setCenter(coordinates);
    // Med animasjon
    map.getView().animate({
      center: coordinates,
      duration: 500,
    });
  }
}

function lagAccuracyFeature() {
  accuracyFeature = new ol.Feature();
  vectorSourceGPS.addFeature(accuracyFeature);
}

function lagpositionFeature() {
  positionFeature = new ol.Feature({
    type: "geoMarker",
    name: "positionFeature",
    geometry: null,
  });
  positionFeature.setStyle(positionFeatureStil);
  // positionFeature.setStyle(positionFeatureStilMedPil);
  vectorSourceGPS.addFeature(positionFeature);
}

function flyttFeature(event) {
  var msBrukt = event.frameState.time - tidFlyttStart;
  var distanse = msBrukt * msHastighet;
  // console.log("flyttFeature ~ msBrukt: " + msBrukt + ", distanse: " + distanse);
  const currentCoordinate = lineStringFlytt.getCoordinateAt(distanse);

  positionFeaturePunkt.setCoordinates(currentCoordinate);
  const vectorContext = ol.render.getVectorContext(event);
  vectorContext.setStyle(positionFeatureStil);
  vectorContext.drawGeometry(positionFeaturePunkt);

  if (map != null) {
    map.render(); // // tell OpenLayers to continue the postrender animation
  }
  if (distanse >= 1) {
    avsluttFlyttPosisjonFeature();
    return;
  }
}

function startFlyttPosisjonFeature() {
  tidFlyttStart = Date.now();
  vektorLagGPS.on("postrender", flyttFeature);
  positionFeature.setGeometry(null);
  console.log("startFlyttPosisjonFeature starter!");
}

function avsluttFlyttPosisjonFeature() {
  tidFlyttStart = 0;
  positionFeature.setGeometry(positionFeaturePunkt);
  vektorLagGPS.un("postrender", flyttFeature);
  console.log("avsluttFlyttPosisjonFeature ferdig!");
}

// function fadeInnogUtDebugMelding(melding, varighet){
//   debugGPS.innerHTML = melding;
//   debugGPSContainer.classList.remove("opacity0");
//   debugGPSContainer.classList.add("opacity1");
//   setTimeout(() => {
//     debugGPSContainer.classList.remove("opacity1");
//     debugGPSContainer.classList.add("opacity0");
// }, varighet);
// }

function lagGpsStiler() {
  positionFeatureStil = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: "#3399CC",
      }),
      stroke: new ol.style.Stroke({
        color: "#fff",
        width: 2,
      }),
    }),
  });
  //
  positionFeatureStilMedPil = [
    new ol.style.Style({
      image: new ol.style.Circle({
        // radius: 6,
        radius: 6,
        fill: new ol.style.Fill({
          color: "#3399CC",
        }),
        stroke: new ol.style.Stroke({
          color: "#fff",
          width: 2,
        }),
      })
    }),
    new ol.style.Style({
      image: new ol.style.Icon({
        scale: 0.05,
        anchor: [0.5, 275],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: ikonPlassering + "arrow-direction-thin-blue.png",
        rotation: 0,
        opacity: 1,
      }),
    })
  ];
}

function deviceOrientationListener(event){
  console.log(event);

  const absolute = event.absolute;
  const alpha = event.alpha;
  const beta = event.beta;
  const gamma = event.gamma;

  const radians = compassHeading(event.alpha, event.beta, event.gamma);
  const grader = compassHeadingInDegrees(event.alpha, event.beta, event.gamma);
  var alphaRad = alpha * (Math.PI / 180);

  try{
    debugGPS.innerHTML = "v27 ~ alpha: " + alpha.toFixed(2) + ", alphaRad: " + alphaRad.toFixed(2) + ", radians: " + radians.toFixed(2) + ", grader: " + grader.toFixed(2);
  }catch(e){
    console.log(e);
  }
  // positionFeatureStilMedPil[1].getImage().setRotation(alphaRad);
}
// window.addEventListener("deviceorientationabsolute", deviceOrientationListener);