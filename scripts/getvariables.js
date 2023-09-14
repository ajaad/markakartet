// Functions 

// Get GET-variables from the URL
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
        vars[key] = value;
    });
  return vars;
}

function titelfunc(){
  // funksjon for å finne karttitel
  var title = getUrlVars()["title"];
  if (title == null) {
    title = "Kartdemonstrasjon";
  } else {
    // ERLEND: Legger til i "Del kartvisning" formen.
    // Burde nok gjøres et etter sted senere.
    var titleForm = document.getElementById("titleForm");
    if(titleForm != null) {
      titleForm.value = title; // input må bruke "value"... .text funket ikke.
    }
    // document.getElementById("titleForm").innerHTML = title;
  }

  return decodeURI(title);
};

function beskrivelseFunc(){
  // funksjon for å finne karttitel
  var beskrivelse = getUrlVars()["beskrivelse"];
  if (beskrivelse == null) {
    beskrivelse = "<i>Ingen beskrivelse tilgjengelig</i>";
  } else {
      // ERLEND: Legger til i "Del kartvisning" formen.
      // Burde nok gjøres et etter sted senere.
      var beskrivelseForm = document.getElementById("beskrivelseForm");
      if(beskrivelseForm != null) {
        beskrivelseForm.value = beskrivelse; // Funket for textarea element.
      }
      // document.getElementById("beskrivelseForm").innerHTML = beskrivelse;
  }

  return decodeURI(beskrivelse);
};



/* Function for showing coordinates */ 
function printCoord(){

  var x = getUrlVars()["x"];
  var y = getUrlVars()["y"];

  var epsg = getUrlVars()["EPSG"];
  var zoomLevelURL = getUrlVars()["zoom"];
  var sirkelURL = getUrlVars()["sirkel"];

  if ( epsg == null ) {
    epsg = "4326";
  };
  
  if (epsg != "4326" ){

    string = "<div class=\"underTitel\">Koordinater ( EPSG: " + epsg + " ) </div>";
    string += "<ul class=\"duSerPa\">";

    string += "<li class=\"x\">" + x + "</li>";
    string += "<li class=\"y\">" + y + "</li>";

    /*
    string += "</ul>";
    string += "</div>"; */

  } else {
    var lon = getUrlVars()["lon"];
    var lat = getUrlVars()["lat"];

    if (lat == null && lon == null ) {
      lon = x;
      lat = y;
    }

    string = "<div class=\"underTitel\">Koordinater (Geodetiske)</div>";
    string += "<ul class=\"duSerPa\">";

    // ERLEND: Du kan finne Ion, lat, sirkel, osv. hvis du sjekker i style.css. F.eks:
    // ul.duSerPa li.lon:before { content: "Lengde: ";  }
    // ul.duSerPa li.lat:before { content: "Bredde: ";  }
    // ul.duSerPa li.ZoomLevel:before { content: "ZoomLevel: ";}
    // ul.duSerPa li.sirkel:before { content: "Sirkeldiameter: ";}

    string += "<li class=\"lon\">" + lon + "&deg;</li>";
    string += "<li class=\"lat\">" + lat + "&deg;</li>";

    // OBS! Allerede riktig (oppdateres ved start).
    // Erlend: Oppdatere verdiene i "Del kartvisning" formen.
    // document.getElementById("xCoordForm").innerHTML = lon;
    // document.getElementById("yCoordForm").innerHTML = lat;
  }

  if (sirkelURL != null) {
    string += "<li class=\"sirkel\">" + sirkelURL + "m</li>";

    // Erlend: Oppdatere verdiene i "Del kartvisning" formen.
    var sirkelForm = document.getElementById("sirkelForm");
    if(sirkelForm != null) {
      sirkelForm.value = sirkelURL;
    }
    // document.getElementById("sirkelForm").innerHTML = sirkelURL;
  };

  if (zoomLevelURL != null) {
    string += "<li class=\"ZoomLevel\">" + zoomLevelURL + "</li>";

    // OBS! Allerede riktig (oppdateres ved start).
    // // Erlend: Oppdatere verdiene i "Del kartvisning" formen.
    // var zoomForm = document.getElementById("zoomForm");
    // if(zoomForm != null) {
    //   zoomForm.text = zoomLevelURL;
    // }
  };

  string += "</ul>";
  string += "</div>";

  return string;
};

function printCoordSys(){
  var coordSysPrinting = getUrlVars()["EPSG"];

  if (coordSysPrinting == null ) {
    //return "(Geodetiske)";
    return 4326;
  } else {
    //return "(EPSG: " + coordSysPrinting + ")";
    return coordSysPrinting;
  }

};


/////////////////

// Add coordinate available systems 

proj4.defs("EPSG:25831","+proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs"); 
proj4.defs("EPSG:25832","+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs"); 
proj4.defs("EPSG:25833","+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs");

ol.proj.proj4.register(proj4);

// WGS 84 / Pseudo-Mercator is used in the view
var viewProjection = 'EPSG:3857';
  
/////////////////


function getGETvariables(){

    // Analyse the GET-variables
    var varlat = getUrlVars()["lat"];
    var varlon = getUrlVars()["lon"];

    //console.log(varlat);
      
    if (varlat != null && varlon != null) {
      var coordSys = 'EPSG:4326';
      var x = parseFloat(varlon);
      var y = parseFloat(varlat);
      if ( getUrlVars()["EPSG"] != null ) {
        console.log("OBS! Koordinatsystemet du skrev inn ble overstyrt:");
        console.log("Dersom du vil velge koordinatsystem må du bruke x,y og ikke lat,lon.");
      }
    } else {
      var coordSys = 'EPSG:' + getUrlVars()["EPSG"];
      var vary = getUrlVars()["y"];
      var varx = getUrlVars()["x"];

      // If the coordinate system is not specified, geodetic latlon will be default
      if ( getUrlVars()["EPSG"] == null ){
        var coordSys = 'EPSG:4326';
        console.log('OBS! Koordinatsystem mangler (default er EPSG:4326)');
      }

      // If x or y is missing
      if (varx == null || vary == null) {
        switch (coordSys) {
          case 'EPSG:25832':
            //console.log('Plassering mangler: satt til 6700km N og 595km Ø');
            //[596709.3700004125, 6649257.677240307]
            console.log('Plassering mangler: satt til Nordre Sandås');
            var y = parseFloat(6649257);
            var x = parseFloat(596710);
            break;
          case 'EPSG:4326':
            console.log('Plassering mangler: satt til Nordre Sandås');
            //onsole.log('Plassering mangler satt til 11°Ø og 60°N');
            //[10.732382013908172, 59.96929382282335]
            var x = parseFloat(10.732382);
            var y = parseFloat(59.969293);
            break;
        }
      } else {
        // If both x- and y-coordniates exists
        var x = parseFloat(varx);
        var y = parseFloat(vary);
      }
    }


    var zoomLevel = getUrlVars()["zoom"];
    if (zoomLevel == null){
      zoomLevel = 9;
      console.log("zoom er ikke valgt, default er 8");
    }

    // Print coordnate system and startcoordinates to the console
    console.log('Startkoordinat:',x,y,coordSys);

    // Make a circle 
    if ( getUrlVars()["sirkel"] != null ){

      var circle = new ol.geom.Circle(
        proj4(coordSys,viewProjection,[x,y]), // Center
        parseFloat(getUrlVars()["sirkel"])  // Radius
      );

      var circleFeature = new ol.Feature(circle);

      var vectorSource = new ol.source.Vector({
        projection: viewProjection,
        features: [circleFeature]
      });

      
      var style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 100, 50, 0)'
        }),
        stroke: new ol.style.Stroke({
            width: 5,
            color: 'rgba(255, 0, 0, 2)'
        }),
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(55, 200, 150, 0)'
            }),
            stroke: new ol.style.Stroke({
                width: 1,
                color: 'rgba(55, 200, 150, 0)'
            }),
            radius: 15
        }),
      });

      // Make a layer with a circle
      var sirkelLag = new ol.layer.Vector({
        source: vectorSource,
        style: style
      });

    } else {
      // Make an empty layer without a circle
      var sirkelLag = new ol.layer.Vector({
        source: vectorSource,
        style: style
      });
    }

    console.log(x,y)

    // Convert the startpoint to pseudomercator 
    var startpunktCoord = proj4(coordSys,viewProjection,[x,y]);

    // Make a view object
    var newview = new ol.View({
      center: startpunktCoord,
      zoom: zoomLevel
      //extent: ol.proj.transformExtent([0, 55, 20, 65], 'EPSG:4326', viewProjection)
    });

    //return x, y, coordSys, zoom
    //return startpunktCoord, sirkelLag
    var title = "dette er en tittel";

    var outputarray = [newview, sirkelLag,coordSys,title];
    return outputarray
};
