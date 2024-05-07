
// var map;

$(document).ready(function(){
    console.log("skole klar!");

    // URL redirection?
    // window.location = window.location.origin + "/" + window.location.pathname.split("/")[1];

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

    // Først, lage et map-objekt.
    // Den trenger et view.

    var finalX, finalY = 0;
    var coordSysCode = defaultCoordSysCode;
    var coordSysFull = defaultCoordSysType + ":" + coordSysCode;

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

    var startpunktCoord = proj4(coordSysFull, coordSysPseudoMercator, [finalX, finalY]);

    var newView = new ol.View({
        center: startpunktCoord,
        zoom: defaultZoom
    });

    // For mapGruppeNaturopplevelser, legg til turer2021 kartlaget:
    // var naturopplevelserKartlag = mapGruppeNaturopplevelser.getLayers();
    // naturopplevelserKartlag.push(vektorLagKalenderRuter2021);
    // naturopplevelserKartlag.push(vektorlagRuter2021Ikoner);
    // mapGruppeNaturopplevelser.setLayers(naturopplevelserKartlag);

    // Sjekke hvilken kartlag som er i mapGruppeNaturopplevelser:
    mapGruppeNaturopplevelser.getLayers().getArray().forEach(layer => {
        console.log("mapGruppeNaturopplevelser ~ kartlag: " + layer.get("name"));
    });

    var alleGrupper = new ol.layer.Group({
        name: "alleGrupper",
        opacity: 1,
        visible: true,
        layers: [
          mapGruppeBakgrunnskart, // Inneholder bare bakgrunnskartOSM
          mapGruppeNaturopplevelser,
        ]
      });

    map = new ol.Map({
        target: 'map',
        layers: alleGrupper,
        view: newView,
        renderer: 'canvas',
        controls: ol.control.defaults({
          zoom: false
        }).extend([
          // scaleControl(),
        ]),
        overlays: [popupOverlay]
      });


    // Bruke getLayers() for Collection<BaseLayer>!
    // https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html

    map.getLayers().getArray().forEach(group => {
        var gruppeNavn = group.get("name");
        console.log("map gruppeNavn: " + gruppeNavn);
        if(gruppeNavn == "Bakgrunnskart"){
            // console.log("map gruppe: " + group.get("name"));
            group.getLayers().forEach(layer => {
                var lagNavn = layer.get("name");
                if(lagNavn == "bakgrunnskartOSM"){
                    console.log("map fant bakgrunnskartOSM! lagNavn: " + lagNavn);
                    layer.setVisible(true);
                };
            });
        } else if(gruppeNavn == "Naturopplevelser"){
            group.getLayers().forEach(layer => {
                var lagNavn = layer.get("name");
                // console.log("map ~ forEach gruppe og kartlag ~ kartlag: " + lagNavn);
                if(lagNavn == "vektorLagMarkagrensa"){
                    console.log("map fant vektorLagMarkagrensa! lagNavn: " + lagNavn);
                    layer.setVisible(true);
                } else if(lagNavn == "vektorlagKalenderRuter2021"){
                    console.log("map fant vektorLagKalenderRuter2021! lagNavn: " + lagNavn);
                    layer.setVisible(true);

                } else if(lagNavn == "vektorlagRuter2021Ikoner"){
                    console.log("map fant vektorlagRuter2021Ikoner! lagNavn: " + lagNavn);
                    layer.setVisible(true);
                } else if(lagNavn == "vektorlagEventyrskog"){
                    console.log("map fant vektorlagEventyrskog! lagNavn: " + lagNavn);
                }

            }); 
        }
    });

    map.on('click',function(e){
        // var coordSys = "EPSG:" + document.getElementById("epsgForm").value;
        var coordSys = "EPSG:4326";
        var koordinaterKonv = proj4(viewProjection, coordSys, e.coordinate);
    
        console.log("Koordinatsystem: " + coordSys + ", koordinater: " + e.coordinate + ", koordinaterKonv: " + koordinaterKonv);

        popupOverlay.setPosition(e.coordinate);

        const pixel = map.getEventPixel(e.originalEvent); // pixel i skjermvinduet
        displayFeatureInfo(pixel);

    });

    map.on('pointermove', function (e) {

    });

    // console.log(map.getLayers());
    // console.log(map.getAllLayers());

    const displayFeatureInfo = function (pixel) {

        skjulPopupContainer();
        settPopupContentInnhold("");

        var fullTekst = "";

        // var eksempelTekst = "Hei!\nHvordan går det?\n\nHadet!";
        // console.log(eksempelTekst);
        // console.log(eksempelTekst.split("\n"));

        map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            var lagNavn = layer.get("name");
            var clickable = layer.get("clickable");
            if(clickable){
                console.log(feature);
                console.log("lagNavn: " + lagNavn);

                var featureName = "";
                var src = "";
                try {
                    var featureName = feature.getProperties()["features"][0].get("name");
                    console.log("featureName: " + featureName);
                    
                    var featureBilde = feature.getProperties()["features"][0].get("featurePictureUrl");
                    console.log("featureBilde: " + featureBilde);

                    src = featureBilde;
                } catch(e){
                    console.log("feature har ikke featureName (er ikke et ikon.)");
                }

                if (featureName != "") {
                  // fullTekst += '<div class="divHolder">';
                  fullTekst +=
                    '<div style="display: flex; flex-direction: row; margin-top: 4px; margin-bottom: 4px; width: auto;">';
                  fullTekst += "<span class='divNavn'>";
                  fullTekst += featureName;
                  fullTekst += "</span>"; // For divNavn klassen.
                  fullTekst += "</div>"; // For divHolder klassen
                  if(src != ""){
                    fullTekst += "<img src='" + src + "' style='max-width: 256px; height: auto;' />";
                  }
                }

            }
        });

        if(fullTekst != ""){
            settPopupContentInnhold(fullTekst);
            visPopupContainer();
        }
    }

});

/* NAVIGER TIL HOVEDSIDEN */

function navigerTilSkoleprosjektet(){
  // Må ha forskjellig logikk for testsiden på github
  // if(originWithSlash.includes("github.io")){
  //   location.href = originWithSlash + "markakartet_dev";
  // } else {
  //   location.href = originWithSlash;
  // }
  location.href = originWithSlash;
}