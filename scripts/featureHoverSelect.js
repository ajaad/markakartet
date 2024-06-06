var featureClickSelectionList = []; // Ved klikk på ikon eller en feature. Skal ikke bli tatt bort av hover!
var featureSelectionList = []; // For "all" featureSelection.
var featureSelectionDict = {}; // Hm... Support til featureSelectionList. Ikke bytte ut.
var featureSelected = null; // Click on feature... Possible to do it with multiple features? Hm...
var featureHovered = null;
// Prøve med en liste for hover? Siden det blir aktuelt når alle turer per måned blir vist.
var featureHoveredList = [];
var featureHoveredANullstilleListe = [];

var useDefaultWhiteStyle = false; // Bare bruke hvit stil for highlight.
// Variabler for klikk av turer i popup, for så å vise ekstra informasjon i hovedmenyen.
let kartlagFeature = null;
let kartlagFeatureNavn = "";
let uidFeaturesDict = {}; // Dictionary som har uid som keys og feature som value.
let hoverInfo = null; // hoverInfo popup elementet.

featureHoverSelectKjorer = true;
console.log("featureHoverSelectKjorer: " + featureHoverSelectKjorer);

$(document).ready(function () {
  hoverInfo = document.getElementById('hoverInfo');
});

function visHoverInfo(pixel, feature, layer, erIkonLag){
  hoverInfo.style.left = pixel[0] + 'px';
  hoverInfo.style.top = pixel[1] + 'px';
  // hoverInfo.style.visibility = 'visible';
  let endeligeNavn = "";
  if(!erIkonLag){
    endeligeNavn = hentFeatureNavnMedBackup(feature);
    // feature er en tur
    if(feature.get("grad")){
      hoverInfo.style.color = "var(--andre-farger-light-aqua)";
    } else {
      hoverInfo.style.color = "white";
    }
  } else {
    // erIkonLag er sann
    // console.log(feature);
    const cluster = feature.get("features");
    // endeligeNavn = feature.get("features")[0].get("featureRuteNavn");
    endeligeNavn = cluster[cluster.length - 1].get("featureRuteNavn");
    hoverInfo.style.color = "var(--andre-farger-light-aqua)";
  }
  hoverInfo.innerText = endeligeNavn;
  hoverInfo.style.visibility = 'visible';
}

function skjulHoverInfo(){
  hoverInfo.style.visibility = 'hidden';
}

function nullstillFeatureClickSelection(){
  if(featureClickSelectionList.length > 0){
    featureClickSelectionList.forEach(feature => {
        // Hm... For deselect, gjøre noe for dashed? Hm...
  
        var snarvei = feature.get("Stiplet");
        // var erEnSnarvei = false;
  
        if(snarvei == null){
          feature.setStyle(undefined); // Ikke en tur.
        } else {

          let turStil = null;
          let grad = feature.get("grad");
          if(grad){
            // Obs! Må konvertere grad til string.
            grad = String(grad);
            // OBS! Hardcodet navnet på kartlaget.
            // Dette kan være OK siden målet er å samle alle kalenderrutene i ett kartlag.
            const turKartlag = hentKartlagMedLagNavn("vektorlagKalenderRuter2021");
            // console.log(turKartlag);
            switch(grad){
              case "lett": case "1":
                turStil = turKartlag.get("lettStil");
                break;
              case "middels": case "2":
                turStil = turKartlag.get("middelsStil");
                break;
              case "vanskelig": case "3":
                turStil = turKartlag.get("vanskeligStil");
                break;
              case "lars_monsen": case "4":
                turStil = turKartlag.get("larsMonsenStil");
                break;
              case "fridjof_nansen": case "9":
                turStil = turKartlag.get("fridjofNansenStil");
                break;
              default:
                turStil = turKartlag.get("ukjentStil");
                break;
            }
          }

          snarvei = parseInt(snarvei);
          if (snarvei > 0) {
            // Her er turen en snarvei...
            // erEnSnarvei = true;
            // Hm, lagre featureSelectionList som en dictionary eller noe? ...
            // For så å kunne lagre feature style.
            var NAVN = feature.get("NAVN");
            var dictEntry = featureSelectionDict[NAVN];
            if(dictEntry != null){
              var stilDashed = dictEntry["stilDashed"];
              if(stilDashed != null){
                feature.setStyle(stilDashed);
                // console.log("Satt stilDashed for snarveien kalt med NAVN: " + NAVN);
                // Debug:
                // document.getElementById("debugVinduTekst").innerHTML += " | Klikk, tømmer lista ~ satt stilDash for snarvei: " + NAVN;
              }
            }
          } else {
             // En tur, men ikke en snarvei.
            if(!turStil){
              feature.setStyle(undefined);
            } else {
              feature.setStyle(turStil);
            }
          }

        }
  
        // feature.setStyle(undefined);
      });
      featureClickSelectionList = [];
    }
    // featureClickSelectionList = [];
}

function nullstillFeatureSelection(){
    if(featureSelectionList.length > 0){
        featureSelectionList.forEach(feature => {
          // Hm... For deselect, gjøre noe for dashed? Hm...
    
          var snarvei = feature.get("Stiplet");
          // var erEnSnarvei = false;
    
          if(snarvei == null){
            feature.setStyle(undefined); // Ikke en tur.
          } else {
            snarvei = parseInt(snarvei);
            if (snarvei > 0) {
              // Her er turen en snarvei...
              // erEnSnarvei = true;
              // Hm, lagre featureSelectionList som en dictionary eller noe? ...
              // For så å kunne lagre feature style.
              var NAVN = feature.get("NAVN");
              var dictEntry = featureSelectionDict[NAVN];
              if(dictEntry != null){
                var stilDashed = dictEntry["stilDashed"];
                if(stilDashed != null){
                  feature.setStyle(stilDashed);
                  // console.log("Satt stilDashed for snarveien kalt med NAVN: " + NAVN);
                  // Debug:
                  // document.getElementById("debugVinduTekst").innerHTML += " | Klikk, tømmer lista ~ satt stilDash for snarvei: " + NAVN;
                }
              }
            } else {
              feature.setStyle(undefined); // En tur, men ikke en snarvei.
            }
          }
    
          // feature.setStyle(undefined);
        });
        featureSelectionList = [];
      }
}

function hentFeatureNavn(feature) {
  var endeligeNavn = "Navn på området mangler";
  var navn = feature.get("navn");
  var name = feature.get("name");
  var NAVN = feature.get("NAVN");
  if (navn) {
    if (navn != "" && navn != "na") {
      endeligeNavn = navn;
    }
  } else if (name) {
    if (name != "" && name != "na") {
      endeligeNavn = name;
    }
  } else if (NAVN) {
    if (NAVN != "" && NAVN != "na") {
      endeligeNavn = NAVN;
    }
  }
  return endeligeNavn;
}

// Forutsetter at feature allerede er funnet. Bare finner navnet.
function hentFeatureNavnMedBackup(feature){
    var defaultNavn = "Navn på området mangler";
    var endeligeNavn = defaultNavn
    var navn = feature.get("navn");
    var name = feature.get("name");
    var NAVN = feature.get("NAVN");

    if (navn) {
      if (navn != "" && navn != "na") {
        endeligeNavn = navn;
      }
    } else if (name) {
      if (name != "" && name != "na") {
        endeligeNavn = name;
      }
    } else if (NAVN) {
      if (NAVN != "" && NAVN != "na") {
        endeligeNavn = NAVN;
      }
    }

    // BACKUP-LØSNINGEN
    if(endeligeNavn == defaultNavn){
        var aar = feature.get("aar");
        var AAR = feature.get("AAR");
        var id = feature.get("id");
        var ID = feature.get("ID");
        var defaultAar = "";
        var endeligeAar = defaultAar;
        var defaultId = "";
        var endeligeId = defaultId;

        if(aar){
            if (aar != "" && aar != "na") {
                endeligeAar = aar;
            }
        } else if(AAR){
            if (AAR != "" && AAR != "na") {
                endeligeAar = AAR;
            }
        }

        if(id){
            if (id != "" && id != "na") {
                endeligeId = id;
            }
        } else if(ID){
            if (ID != "" && ID != "na") {
                endeligeId = ID;
            }  
        }

        // Hvis både årstall og id ble funnet, returner det.
        // Hvis ikke, returnerer defaultNavn.
        if((endeligeAar != defaultAar) && (endeligeId != defaultId)){
            endeligeNavn = endeligeAar + "," + endeligeId;
        }
    }

    return endeligeNavn;
}

// Brukt i map.on('pointermove') for å ta bort hover-effekt fra featureHovered.
// Håndterer også snarveier.
function nullstillFeatureHovered(){
     // Sette til dashed for tur-snarveier!
     var snarvei = featureHovered.get("Stiplet");
     if(snarvei == null){
       // Ikke en tur.
       featureHovered.setStyle(undefined);
     } else {
       // Er en tur.
       snarvei = parseInt(snarvei);
       if (snarvei <= 0) {

        // console.log("nullstillFeatureHovered triggered");
        // console.log(featureHovered);

        let turStil = null;
        let grad = featureHovered.get("grad");
        if(grad){
          // Konvertere grad til string
          grad = String(grad);
          // OBS! Hardcodet navnet på kartlaget.
          // Dette kan være OK siden målet er å samle alle kalenderrutene i ett kartlag.
          const turKartlag = hentKartlagMedLagNavn("vektorlagKalenderRuter2021");
          // console.log(turKartlag);
          switch(grad){
            case "lett": case "1":
              turStil = turKartlag.get("lettStil");
              break;
            case "middels": case "2":
              turStil = turKartlag.get("middelsStil");
              break;
            case "vanskelig": case "3":
              turStil = turKartlag.get("vanskeligStil");
              break;
            case "lars_monsen": case "4":
              turStil = turKartlag.get("larsMonsenStil");
              break;
            case "fridjof_nansen": case "9":
              turStil = turKartlag.get("fridjofNansenStil");
              break;
            default:
              turStil = turKartlag.get("ukjentStil");
              break;
          }
        }

        if(!turStil){
         // Tur, men ikke en snarvei.
         featureHovered.setStyle(undefined);
        } else {
          featureHovered.setStyle(turStil);
        }

       } else {
         // Turen er en snarvei!
         // var NAVN = featureHovered.get("NAVN");
         var featureNavn = hentFeatureNavnMedBackup(featureHovered);
         var dictEntry = featureSelectionDict[featureNavn];
         if (dictEntry != null) {
           var stilDashed = dictEntry["stilDashed"];
           if (stilDashed != null) {
             featureHovered.setStyle(stilDashed);
            //  console.log("Satt stilDashed for snarveien kalt med featureNavn: " + featureNavn);
             // Debug
             // document.getElementById("debugVinduTekst").innerHTML += " | hover, satt til null ~ satt stilDashed for snarvei: " + NAVN;
           } else {
             // Bare bruke layer-stilen, hvis fortsatt problemer...
             featureHovered.setStyle(undefined);
           }
         }
       }

     }
     featureHovered = null;
     // console.log("featureHovered was set to null.");
}

// Brukt i map.on('pointermove') for å sette featureHovered og lage hover-effekten.
// Tar inn feature og layer som parametere. Brukes inni: map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {}
function settFeatureHovered(feature, layer, erIkonLag){
  // console.log("settFeatureHovered triggered!");
  // console.log(feature);

  if(erIkonLag){
    // console.log(feature);
    // const clusterFeature = feature.get("features")[0];
    const cluster = feature.get("features");
    const clusterFeature = cluster[cluster.length - 1];
    feature = clusterFeature.get("featureRute");
    layer = clusterFeature.get("ruteKartlag");
  }

  let grad = feature.get("grad");
  let turStilSelect = null;
  if(grad){
    // Konvertere til string
    grad = String(grad);

    switch(grad){
      case "lett": case "1":
        turStilSelect = layer.get("lettStilSelect");
        break;
      case "middels": case "2":
        turStilSelect = layer.get("middelsStilSelect");
        break;
      case "vanskelig": case "3":
        turStilSelect = layer.get("vanskeligStilSelect");
        break;
      case "lars_monsen": case "4":
        turStilSelect = layer.get("larsMonsenStilSelect");
        break;
      case "fridjof_nansen": case "9":
        turStilSelect = layer.get("fridjofNansenStilSelect");
        break;
      default:
        turStilSelect = layer.get("ukjentStilSelect");
        break;
    }
  }

  featureHovered = feature;

  var featureNavn = hentFeatureNavnMedBackup(feature);

  // Sjekke for snarvei (stiplet):
  var snarvei = feature.get("Stiplet");
  var erEnSnarvei = false;

  if (snarvei != null) {
    snarvei = parseInt(snarvei);
    if (snarvei > 0) {
      // Her er turen en snarvei...
      erEnSnarvei = true;
    }
  }

  if (!erEnSnarvei) {

    if (!turStilSelect) {

      // Hvis useDefaultWhiteStyle er sann. Den er per nå alltid false.
      if (useDefaultWhiteStyle) {
        featureHovered.setStyle(defaultWhiteSelectStyle);
      } else {
        var stilSelect = layer.get("stilSelect");
        if (stilSelect != null) {
          featureHovered.setStyle(stilSelect);
        } else {
          featureHovered.setStyle(defaultWhiteSelectStyle);
        }
      }

    } else {
      featureHovered.setStyle(turStilSelect);
    }

  } else {
    // Er en snarvei!

    // Hvis useDefaultWhiteStyle er sann. Den er per nå alltid false.
    if (useDefaultWhiteStyle) {
      featureHovered.setStyle(defaultWhiteDashedSelectStyle);
    } else {

      // Legge til i dictionary her også, i tilfelle brukeren ikke har trykket på turen enda.
      // var snarveiNavn = feature.get("NAVN");
      var stilDashed = layer.get("stilDashed");
      var stilDashedSelect = layer.get("stilDashedSelect");

      let turStilDashed = null;
      let turStilDashedSelect = null;
      if(grad){
        switch(grad){
          case "lett": case "1":
            turStilDashed = layer.get("lettStilDashed");
            turStilDashedSelect = layer.get("lettStilDashedSelect");
            break;
          case "middels": case "2":
            turStilDashed = layer.get("middelsStilDashed");
            turStilDashedSelect = layer.get("middelsStilDashedSelect");
            break;
          case "vanskelig": case "3":
            turStilDashed = layer.get("vanskeligStilDashed");
            turStilDashedSelect = layer.get("vanskeligStilDashedSelect");
            break;
          case "lars_monsen": case "4":
            turStilDashed = layer.get("larsMonsenStilDashed");
            turStilDashedSelect = layer.get("larsMonsenStilDashedSelect");
            break;
          case "fridjof_nansen": case "9":
            turStilDashed = layer.get("fridjofNansenStilDashed");
            turStilDashedSelect = layer.get("fridjofNansenStilDashedSelect");
            break;
          default:
            turStilDashed = layer.get("ukjentStilDashed");
            turStilDashedSelect = layer.get("ukjentStilDashedSelect");
            break;
        }
      }

      if(!turStilDashed && !turStilDashedSelect){

        // Hm, så featureSelectionDict blir bare brukt til snarveier.
        featureSelectionDict[featureNavn] = {
          featureSelection: feature,
          stilDashed: stilDashed,
          stilDashedSelect: stilDashedSelect,
        };
        // console.log(featureSelectionDict);

        if (stilDashedSelect != null) {
          featureHovered.setStyle(stilDashedSelect);
          // Debug:
          // document.getElementById("debugVinduTekst").innerHTML += " | Hover ~ Satt stilDashedSelect på snarvei: " + snarveiNavn;
        } else {
          featureHovered.setStyle(defaultWhiteDashedSelectStyle);
        }

      } else {
        featureSelectionDict[featureNavn] = {
          featureSelection: feature,
          stilDashed: turStilDashed,
          stilDashedSelect: turStilDashedSelect,
        };
        featureHovered.setStyle(turStilDashedSelect);
      }

    }

  }
  // featureSelectionList.push(featureHovered);
}

/* 

FEATURE HOVERED LIST START

*/

function nullstillHoveredFeature(feature) {

  for (var i = 0; i < featureHoveredList.length; i++) {
    const currentFeature = featureHoveredList[i];
    if (currentFeature == feature) {

      console.log("nullstillFeatureHovered ~ currentFeature er lik feature! Nullstiller");

      // Sette til dashed for tur-snarveier!
      var snarvei = feature.get("Stiplet");
      if (snarvei == null) {
        // Ikke en tur.
        feature.setStyle(undefined);
      } else {
        // Er en tur.
        snarvei = parseInt(snarvei);
        if (snarvei <= 0) {

          let turStil = null;
          let grad = feature.get("grad");
          if (grad) {
            // Konvertere grad til string
            grad = String(grad);
            // OBS! Hardcodet navnet på kartlaget.
            // Dette kan være OK siden målet er å samle alle kalenderrutene i ett kartlag.
            const turKartlag = hentKartlagMedLagNavn("vektorlagKalenderRuter2021");
            // console.log(turKartlag);
            switch (grad) {
              case "lett": case "1":
                turStil = turKartlag.get("lettStil");
                break;
              case "middels": case "2":
                turStil = turKartlag.get("middelsStil");
                break;
              case "vanskelig": case "3":
                turStil = turKartlag.get("vanskeligStil");
                break;
              case "lars_monsen": case "4":
                turStil = turKartlag.get("larsMonsenStil");
                break;
              case "fridjof_nansen": case "9":
                turStil = turKartlag.get("fridjofNansenStil");
                break;
              default:
                turStil = turKartlag.get("ukjentStil");
                break;
            }
          }

          if (!turStil) {
            // Tur, men ikke en snarvei.
            feature.setStyle(undefined);
          } else {
            feature.setStyle(turStil);
          }

        } else {
          // Turen er en snarvei!
          var featureNavn = hentFeatureNavnMedBackup(feature);
          var dictEntry = featureSelectionDict[featureNavn];
          if (dictEntry != null) {
            var stilDashed = dictEntry["stilDashed"];
            if (stilDashed != null) {
              feature.setStyle(stilDashed);
              //  console.log("Satt stilDashed for snarveien kalt med featureNavn: " + featureNavn);
              // Debug
              // document.getElementById("debugVinduTekst").innerHTML += " | hover, satt til null ~ satt stilDashed for snarvei: " + NAVN;
            } else {
              // Bare bruke layer-stilen, hvis fortsatt problemer...
              feature.setStyle(undefined);
            }
          }
        }

      }

      // featureHoveredList = featureHoveredList.slice(i, 1);
      // console.log(featureHoveredList);
      // featureHoveredANullstilleListe.push(feature);
      return; // Returnere for å avslutte loopen
    }
  }

}

// Brukt i map.on('pointermove') for å ta bort hover-effekt fra featureHovered.
// Håndterer også snarveier.
function nullstillFeatureHoveredList() {
  // console.log("nullstillFeatureHoveredList ~ kjører");

  for (var i = 0; i < featureHoveredList.length; i++) {
    const feature = featureHoveredList[i];

    // Sette til dashed for tur-snarveier!
    var snarvei = feature.get("Stiplet");
    if (snarvei == null) {
      // Ikke en tur.
      feature.setStyle(undefined);
    } else {
      // Er en tur.
      snarvei = parseInt(snarvei);
      if (snarvei <= 0) {

        let turStil = null;
        let grad = feature.get("grad");
        if (grad) {
          // Konvertere grad til string
          grad = String(grad);
          // OBS! Hardcodet navnet på kartlaget.
          // Dette kan være OK siden målet er å samle alle kalenderrutene i ett kartlag.
          const turKartlag = hentKartlagMedLagNavn("vektorlagKalenderRuter2021");
          // console.log(turKartlag);
          switch (grad) {
            case "lett": case "1":
              turStil = turKartlag.get("lettStil");
              break;
            case "middels": case "2":
              turStil = turKartlag.get("middelsStil");
              break;
            case "vanskelig": case "3":
              turStil = turKartlag.get("vanskeligStil");
              break;
            case "lars_monsen": case "4":
              turStil = turKartlag.get("larsMonsenStil");
              break;
            case "fridjof_nansen": case "9":
              turStil = turKartlag.get("fridjofNansenStil");
              break;
            default:
              turStil = turKartlag.get("ukjentStil");
              break;
          }
        }

        if (!turStil) {
          // Tur, men ikke en snarvei.
          feature.setStyle(undefined);
        } else {
          feature.setStyle(turStil);
        }

      } else {
        // Turen er en snarvei!
        var featureNavn = hentFeatureNavnMedBackup(feature);
        var dictEntry = featureSelectionDict[featureNavn];
        if (dictEntry != null) {
          var stilDashed = dictEntry["stilDashed"];
          if (stilDashed != null) {
            feature.setStyle(stilDashed);
            //  console.log("Satt stilDashed for snarveien kalt med featureNavn: " + featureNavn);
            // Debug
            // document.getElementById("debugVinduTekst").innerHTML += " | hover, satt til null ~ satt stilDashed for snarvei: " + NAVN;
          } else {
            // Bare bruke layer-stilen, hvis fortsatt problemer...
            feature.setStyle(undefined);
          }
        }
      }

    }

  } // For-loop ferdig.

  featureHoveredList = [];
  // console.log(featureHoveredList);

}

// Brukt i map.on('pointermove') for å sette featureHovered og lage hover-effekten.
// Tar inn feature og layer som parametere. Brukes inni: map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {}
function leggTilIFeatureHoveredList(feature, layer, erIkonLag) {
  // console.log("settFeatureHovered triggered!");
  // console.log(feature);

  if (erIkonLag) {
    // console.log(layer);
    // console.log(feature);
    // const clusterFeature = feature.get("features")[0];
    const cluster = feature.get("features");
    const clusterFeature = cluster[cluster.length - 1]; // Siste i lista er ikonet som er hoveret?
    feature = clusterFeature.get("featureRute");
    layer = clusterFeature.get("ruteKartlag");
  }

  let grad = feature.get("grad");
  let turStilSelect = null;
  if (grad) {
    // Konvertere til string
    grad = String(grad);

    switch (grad) {
      case "lett": case "1":
        turStilSelect = layer.get("lettStilSelect");
        break;
      case "middels": case "2":
        turStilSelect = layer.get("middelsStilSelect");
        break;
      case "vanskelig": case "3":
        turStilSelect = layer.get("vanskeligStilSelect");
        break;
      case "lars_monsen": case "4":
        turStilSelect = layer.get("larsMonsenStilSelect");
        break;
      case "fridjof_nansen": case "9":
        turStilSelect = layer.get("fridjofNansenStilSelect");
        break;
      default:
        turStilSelect = layer.get("ukjentStilSelect");
        break;
    }
  }

  // featureHovered = feature;

  var featureNavn = hentFeatureNavnMedBackup(feature);

  // Sjekke for snarvei (stiplet):
  var snarvei = feature.get("Stiplet");
  var erEnSnarvei = false;

  if (snarvei != null) {
    snarvei = parseInt(snarvei);
    if (snarvei > 0) {
      // Her er turen en snarvei...
      erEnSnarvei = true;
    }
  }

  if (!erEnSnarvei) {

    if (!turStilSelect) {

      // Hvis useDefaultWhiteStyle er sann. Den er per nå alltid false.
      if (useDefaultWhiteStyle) {
        feature.setStyle(defaultWhiteSelectStyle);
      } else {
        var stilSelect = layer.get("stilSelect");
        if (stilSelect != null) {
          feature.setStyle(stilSelect);
        } else {
          feature.setStyle(defaultWhiteSelectStyle);
        }
      }

    } else {
      feature.setStyle(turStilSelect);
    }

  } else {
    // Er en snarvei!

    // Hvis useDefaultWhiteStyle er sann. Den er per nå alltid false.
    if (useDefaultWhiteStyle) {
      feature.setStyle(defaultWhiteDashedSelectStyle);
    } else {

      // Legge til i dictionary her også, i tilfelle brukeren ikke har trykket på turen enda.
      // var snarveiNavn = feature.get("NAVN");
      var stilDashed = layer.get("stilDashed");
      var stilDashedSelect = layer.get("stilDashedSelect");

      let turStilDashed = null;
      let turStilDashedSelect = null;
      if (grad) {
        switch (grad) {
          case "lett": case "1":
            turStilDashed = layer.get("lettStilDashed");
            turStilDashedSelect = layer.get("lettStilDashedSelect");
            break;
          case "middels": case "2":
            turStilDashed = layer.get("middelsStilDashed");
            turStilDashedSelect = layer.get("middelsStilDashedSelect");
            break;
          case "vanskelig": case "3":
            turStilDashed = layer.get("vanskeligStilDashed");
            turStilDashedSelect = layer.get("vanskeligStilDashedSelect");
            break;
          case "lars_monsen": case "4":
            turStilDashed = layer.get("larsMonsenStilDashed");
            turStilDashedSelect = layer.get("larsMonsenStilDashedSelect");
            break;
          case "fridjof_nansen": case "9":
            turStilDashed = layer.get("fridjofNansenStilDashed");
            turStilDashedSelect = layer.get("fridjofNansenStilDashedSelect");
            break;
          default:
            turStilDashed = layer.get("ukjentStilDashed");
            turStilDashedSelect = layer.get("ukjentStilDashedSelect");
            break;
        }
      }

      if (!turStilDashed && !turStilDashedSelect) {

        // Hm, så featureSelectionDict blir bare brukt til snarveier.
        featureSelectionDict[featureNavn] = {
          featureSelection: feature,
          stilDashed: stilDashed,
          stilDashedSelect: stilDashedSelect,
        };
        // console.log(featureSelectionDict);

        if (stilDashedSelect != null) {
          feature.setStyle(stilDashedSelect);
          // Debug:
          // document.getElementById("debugVinduTekst").innerHTML += " | Hover ~ Satt stilDashedSelect på snarvei: " + snarveiNavn;
        } else {
          feature.setStyle(defaultWhiteDashedSelectStyle);
        }

      } else {
        featureSelectionDict[featureNavn] = {
          featureSelection: feature,
          stilDashed: turStilDashed,
          stilDashedSelect: turStilDashedSelect,
        };
        feature.setStyle(turStilDashedSelect);
      }

    }

  }

  featureHoveredList.push(feature);
  // console.log(featureHoveredList);

}

/* 

FEATURE HOVERED LIST END

*/

// Ved hover av ikon.
function settFeaturesHoveredVedHoverAvIkon(feature, layer){
  const clusterFeatures = feature.get("features");
  for(var i = 0; i < clusterFeatures.length; i++){
    const clusterFeature = clusterFeatures[i];
    // console.log(clusterFeature);

    const navn = clusterFeature.get("name");
    const grad = clusterFeature.get("featureGrad");
    const rute = clusterFeature.get("featureRute");
    const ruteNAVN = clusterFeature.get("featureRuteNavn");
    const ruteKartlag = clusterFeature.get("ruteKartlag");
    // console.log("navn: " + navn + ", grad: " + grad + ", ruteNAVN: " + ruteNAVN);
    // console.log(rute);
    // console.log(ruteKartlag);

    var eksisterer = featureEksistererIFeatureSelectionList(rute);
    // console.log("clusterFeature ~ ruteNAVN: " + ruteNAVN + " eksisterer i featureSelectionList: " + eksisterer);
    if(!eksisterer){
      settStilerOgLeggTilFeatureISelectionList(rute, ruteKartlag);
    }

  }
}

// Legger til alle featureSelections i featureSelectionList - altså alle features som er der hvor brukeren trykker.
// Lager så innhold til popup, og til slutt viser popupen.
function settFeatureSelectionListeOgLagPopup(pixel, koordinater) {

  // Tømme de midlertidige kartlagene
  tilbakestillMidlertidigeKartlag();

  // nullstillFeatureSelection();
  nullstillFeatureClickSelection();

  // Nullstille hover også? ...
  nullstillFeatureHoveredList();

  skjulPopupContainer();
  settPopupContentInnhold("");

  // Lukke infoside, hvis den er åpen?
  // Hm, kanskje ha en egen funksjon til å lukke infosiden, istedenfor å bruke featureTilbakeKnappFunksjon?
  featureTilbakeKnappFunksjon(false);

  var fullTekst = "";
  // For å vise feature info, hvis alene. Resettes ved hvert trykk.
  let featureInfoData = [];
  // Prøve å lage en grense på hvor mange som vises i popup lista
  let maxItems = 10;
  let currentItems = 0;

  map.forEachFeatureAtPixel(pixel, function (feature, layer) {

    var lagNavn = layer.get("name"); // navn på kartlaget
    var uiLagnavn = layer.get("uiName");
    var clickable = layer.get("clickable");
    // console.log("displayFeatureInfo ~ lagnavn: " + lagnavn + ", uiLagnavn: " + uiLagnavn + ", clickable: " + clickable);

    if (clickable && feature && (!lagNavn.includes("Midlertidig") && !lagNavn.includes("midlertidig"))) {

      // Hm... Siden ikoner kan legge til flere features på en gang,
      // må sjekke om feature allerede eksisterer i featureSelectionList.
      // var featureEksisterer = featureEksistererIFeatureSelectionList(feature);
      // console.log("feature eksisterer: " + featureEksisterer);

      // OBS! For nå, ikke gjøre noe når man trykker på et ikon. Legge til det som skal skje da senere.
      // En øyeblikkelig utfordring er å finne rute-kartlaget for ikonlaget.
      if (lagNavn.includes("Ikon") || lagNavn.includes("ikon")) {
        // console.log("klikk på ikon-kartlag! lagNavn: " + lagNavn);
        // Hva får jeg når jeg trykket på et ikon?

        // OBS! Får en liste, siden det er cluster, så er det alltid en liste med features.
        // Derfor kan det være lurt å selecte alle features i den listen...
        // Hm. Må bare sjekke at man ikke legger til samme rute flere ganger.

        // console.log(feature.get("features"));

        const clusterFeatures = feature.get("features");
        for (var i = 0; i < clusterFeatures.length; i++) {
          const clusterFeature = clusterFeatures[i];
          // console.log(clusterFeature);

          const navn = clusterFeature.get("name");
          const grad = clusterFeature.get("featureGrad");

          // OBS! Noe problemer med ruter vs natursti her?!

          const rute = clusterFeature.get("featureRute");
          const ruteNAVN = clusterFeature.get("featureRuteNavn");
          const ruteKartlag = clusterFeature.get("ruteKartlag");
          const kartlagType = clusterFeature.get("featureRute").get("kartlagType");
          // console.log("kartlagType: " + kartlagType);

          // 
          const stipletter = rute.get("stipletter");
          if (stipletter) {
            // console.log("settFeatureSelectionListeOgLagPopup ~ ruten " + ruteNAVN + " har stipletter! antall: " + stipletter.length);
            for (var l = 0; l < stipletter.length; l++) {
              settStilerOgLeggTilIFeatureClickSelection(stipletter[l], ruteKartlag);
            }
          }

          // var eksisterer = featureEksistererIFeatureSelectionList(rute);
          var eksisterer = featureEksistererIFeatureClickSelection(rute);
          // console.log("clusterFeature ~ ruteNAVN: " + ruteNAVN + " eksisterer i featureSelectionList: " + eksisterer);
          if (!eksisterer && currentItems < 10) {
            currentItems++;
            fullTekst += lagFeatureSelectionPopupTekst(rute, ruteKartlag, stipletter, koordinater);
            // settStilerOgLeggTilFeatureISelectionList(rute, ruteKartlag);
            settStilerOgLeggTilIFeatureClickSelection(rute, ruteKartlag);

            if (kartlagType != null && featureInfoData.length < 1) {
              featureInfoData.push(rute);
              featureInfoData.push(hentFeatureNavnMedBackup(rute));
              // Hm, kanskje bare sørge for at kartlaget aldri er et ikonlag?
              featureInfoData.push(layer);
              featureInfoData.push(stipletter); // Legge til stipletter her?
            }

          }

        }

      } else {
        // TRYKK PÅ KARTLAG SOM IKKE ER ET IKON-KARTLAG

        // Bare for kalenderturer
        let featureNavn = feature.get("overskrift");
        let stiplet = feature.get("Stiplet");
        let stipletter = null; // Default bare null for natursti og turer uten stiplet, men inneholder features for turer med stipletter.
        // console.log("feature: " + featureNavn + ", stiplet: " + stiplet);

        // 1. Ikke legge til stiplet i popup.
        // 2. Fortsatt legge til stiplet i featureClickSelection.

        // Hm, hvis stiplet, finne dets hovedrute. ... Hvordan?

        var eksisterer = false;

        // Først sjekke at det er en kalendertur.
        if (stiplet) {
          // For kalenderturer

          // Håndtere når bruker trykker på bare en stiplet.
          // Hm, egentlig bare håndtere alt med hovedruter herfra.
          let hovedrute = null;
          if (stiplet == "1") {
            hovedrute = feature.get("hovedrute");

            if (hovedrute) {
              feature = hovedrute; // Lurer på om dette går bra?
              // console.log("settFeatureSelectionListeOgLagPopup ~ Fant hovedrute for stiplet. feature er nå: ");
              // console.log(feature);
              // Oppdatere variabler
              featureNavn = feature.get("overskrift");
              stiplet = feature.get("Stiplet");
            }
          }

          eksisterer = featureEksistererIFeatureClickSelection(feature);

          if (!eksisterer) {
            settStilerOgLeggTilIFeatureClickSelection(feature, layer);

            // Lager bare popup linje for hovedruter, ikke for stiplets.
            if (stiplet == "0") {
              // currentItems++;

              // Sjekke etter stipletter
              stipletter = feature.get("stipletter");
              if (stipletter) {
                // console.log("settFeatureSelectionListeOgLagPopup ~ ruten " + featureNavn + " har stipletter! antall: " + stipletter.length);
                for (var l = 0; l < stipletter.length; l++) {
                  settStilerOgLeggTilIFeatureClickSelection(stipletter[l], layer);
                }
              }

              // currentItems og maxItems gjelder vel bare popup teksten.
              if (currentItems < maxItems) {
                currentItems++;
                fullTekst += lagFeatureSelectionPopupTekst(feature, layer, stipletter, koordinater);
              }
              // fullTekst += lagFeatureSelectionPopupTekst(feature, layer, stipletter, koordinater);

            }

          } // Hvis ikke eksisterer allerede i click selection

        } else {
          // For natursti
          // Er egentlig ikke et problem foreløpig, siden naturstier ikke har ruter, men i tilfelle de skulle få ruter i fremtiden.

          eksisterer = featureEksistererIFeatureClickSelection(feature);
          // var endeligeNavn = hentFeatureNavnMedBackup(feature);
          // console.log("kartlag " + endeligeNavn + " eksisterer i featureSelectionList: " + eksisterer);
          if (!eksisterer) {
            // currentItems++;
            // fullTekst += lagFeatureSelectionPopupTekst(feature, layer, stipletter, koordinater);
            settStilerOgLeggTilIFeatureClickSelection(feature, layer);
            if (currentItems < maxItems) {
              currentItems++;
              fullTekst += lagFeatureSelectionPopupTekst(feature, layer, stipletter, koordinater);
            }
          }
        }

        const kartlagType = feature.get("kartlagType");
        if (kartlagType != null && featureInfoData.length < 1) {
          featureInfoData.push(feature);
          featureInfoData.push(hentFeatureNavnMedBackup(feature));
          featureInfoData.push(layer);
          featureInfoData.push(stipletter); // 
        }

      }

    } // Hvis ikke midlertidig kartlag

  });

  if (fullTekst != "") {
    visPopupContainer();
    settPopupContentInnhold(fullTekst);
    // Skjule hover info her?
    skjulHoverInfo();
  }

  if ((featureClickSelectionList.length == 1 || currentItems == 1) && featureInfoData.length > 0) {
    // console.log(featureClickSelectionList);
    console.log(featureInfoData);

    skjulPopupContainer();

    // NOTE: Imorgen... Lage midlertidige ruter for stiplettene også i visFeatureInfoSide.

    // console.log("Bare en tur er trykket på, viser info");
    visFeatureInfoSide(featureInfoData[0], featureInfoData[1], featureInfoData[2], featureInfoData[3], false);
    // Skjule popup når det uansett bare er en tur.
  }

}

// Lager popup-teksten for et feature i et kartlag.
// Den trenger en referanse til kartlaget for å hente fillColorSelect og strokeColorSelect.
function lagFeatureSelectionPopupTekst(feature, layer, stipletter, koordinater){
  var endeligeNavn = hentFeatureNavnMedBackup(feature);

  var popupTekst = "";

  var fargeFill = layer.get("fillColorSelect");
  var fargeStroke = layer.get("strokeColorSelect");
  var cssStil = "style='background-color: " + fargeFill + "; border-color: " + fargeStroke + ";'";
  // Kan ikke videreføre features av stiplettene, så får bare videreføre en streng, også hente stipletter igjen senere.
  var har_stiplet = stipletter ? "1" : "0";

  // Hm... Bare navn? Men det er ikke nok, siden noen turer har samme navn..

  // NOTAT: Foreløpig funker ikke featureKlikkIPopup, fordi den ikke klarer å sende feature-typen eller dictionaries...
  // Hm... Kanskje lage en funksjon som finner feature i kartlagets kilde? ...
  // Den må i så fall håndtere mange forskjellige typer kartlag, noe som vil være vanskelig å håndtere.
  // Hm... Passe feature id/ID. Hvis id/ID er null, passe navn/name/NAVN for feature...
  // Åh. 

  const f = feature;
  const keys = feature.getKeys();
  const properties = feature.getProperties();
  const id = feature.getId(); // Denne er visst ofte null
  const uid = feature["ol_uid"]; // Bruke denne som unik identifier
  // console.log("uid: " + uid);

  const grad = properties["grad"];
  // console.log("grad: " + properties["grad"]);
  const turType = properties["tur_type"];
  // console.log("turType: " + properties["turType"]);

  const kartlagType = properties["kartlagType"];
  // console.log("-----")
  // console.log(feature);
  // console.log(properties);
  // console.log("kartlagType: " + kartlagType);

  const lagNavn = layer.get("name");
  // Kan ikke ha mellomrom...
  const onclickFeatureIPopup = "featureKlikkIPopup(" + uid + ",'" + lagNavn + "'," + har_stiplet + ");";
  // console.log(onclickFeatureIPopup);
  
  // VIKTIG NOTAT (VERSJON 1): IKKE VIS FEATURE INFO på versjon 1.
  // popupTekst = '<div class="divHolder" onclick="featureKlikkIPopup(' + test + ', ' + feature + ', ' + layer + ');">';
  popupTekst = "<div class='divHolder' onclick=" + onclickFeatureIPopup + ">";
  // fullTekst += '<div class="divHolder" onclick="viseFeatureInfo(\'' + endeligeNavn + '\')">';

  // Hvis grad er det et tur ikon
  if(!grad){
    popupTekst += "<div class='divFarge' " + cssStil + "></div>";
  } else {
    let bildeUrl = hentRiktigTurIkonPlassering(grad, turType)[0];

    popupTekst += "<img alt='Tur ikon' src='" + bildeUrl + "' class='popupTurIkon' />";
  }

  // if(!grad){
  //   popupTekst += "<span class='divNavn'>";
  // } else {
  //   popupTekst += "<span class='divNavn' style='color: var(--andre-farger-light-aqua)'>";
  // }

  popupTekst += kartlagType ? "<span class='divNavn' style='color: var(--andre-farger-light-aqua)'>" : "<span class='divNavn'>";

  popupTekst += endeligeNavn;
  popupTekst += "</span>"; // For divNavn klassen.
  popupTekst += "</div>"; // For divHolder klassen.

  return popupTekst;
}

// Setter stil (style) for feature som er selected.
function settFeatureSelectionStiler(feature, layer) {
  var endeligeNavn = hentFeatureNavnMedBackup(feature);

  // console.log("settFeatureSelectionStiler ~ featureNavn: " + endeligeNavn);
  // console.log(feature);
  // console.log(layer);

  let grad = feature.get("grad");
  // console.log("grad: " + grad);

  let turStilSelect = null;
  if(grad){
    // Gjøre om grad til string
    grad = String(grad);
    switch(grad){
      case "lett": case "1":
        turStilSelect = layer.get("lettStilSelect");
        break;
      case "middels": case "2":
        turStilSelect = layer.get("middelsStilSelect");
        break;
      case "vanskelig": case "3":
        turStilSelect = layer.get("vanskeligStilSelect");
        break;
      case "lars_monsen": case "4":
        turStilSelect = layer.get("larsMonsenStilSelect");
        break;
      case "fridjof_nansen": case "9":
        turStilSelect = layer.get("fridjofNansenStilSelect");
        break;
      default:
        turStilSelect = layer.get("ukjentStilSelect");
        break;
    }
  }

  var featureSelection = feature;

  // Gjøre for dashed...

  // Sjekke for snarvei (stiplet):
  var snarvei = feature.get("Stiplet");
  var erEnSnarvei = false;

  if (snarvei != null) {
    snarvei = parseInt(snarvei);
    if (snarvei > 0) {
      // Her er turen en snarvei...
      erEnSnarvei = true;
    }
  }

  if (!erEnSnarvei) {
    // Ikke en snarvei.

    if(!turStilSelect){

      if (useDefaultWhiteStyle) {
        featureSelection.setStyle(defaultWhiteSelectStyle);
      } else {
        var stilSelect = layer.get("stilSelect");
        if (stilSelect != null) {
          featureSelection.setStyle(stilSelect);
        } else {
          featureSelection.setStyle(defaultWhiteSelectStyle);
        }
      }

    } else {
      featureSelection.setStyle(turStilSelect);
    }

  } else {
    // Er en tur snarvei!

    // Bare lage dictionary-entry for snarveier?
    // var NAVN = feature.get("NAVN");
    let stilDashed = layer.get("stilDashed");
    let stilDashedSelect = layer.get("stilDashedSelect");

    let turStilDashed = null;
    let turStilDashedSelect = null;
    if(grad){
      switch(String(grad)){
        case "lett": case "1":
          turStilDashed = layer.get("lettStilDashed");
          turStilDashedSelect = layer.get("lettStilDashedSelect");
          break;
        case "middels": case "2":
          turStilDashed = layer.get("middelsStilDashed");
          turStilDashedSelect = layer.get("middelsStilDashedSelect");
          break;
        case "vanskelig": case "3":
          turStilDashed = layer.get("vanskeligStilDashed");
          turStilDashedSelect = layer.get("vanskeligStilDashedSelect");
          break;
        case "lars_monsen": case "4":
          turStilDashed = layer.get("larsMonsenStilDashed");
          turStilDashedSelect = layer.get("larsMonsenStilDashedSelect");
          break;
        case "fridjof_nansen": case "9":
          turStilDashed = layer.get("fridjofNansenStilDashed");
          turStilDashedSelect = layer.get("fridjofNansenStilDashedSelect");
          break;
        default:
          turStilDashed = layer.get("ukjentStilDashed");
          turStilDashedSelect = layer.get("ukjentStilDashedSelect");
          break;
      }
    }

    // OBS! Ettersom features navn blir brukt som key, så må alle feature navn være unike.
    // Det skal gå greit når kalender-rutene er bygd opp slik: 2021: Sørkedalen (tur 1) <--- ÅR: STED (tur X, hvis en serie med flere turer)
    
    if(!turStilDashed && !turStilDashedSelect){

      featureSelectionDict[endeligeNavn] = {
        feature: featureSelection,
        stilDashed: stilDashed,
        stilDashedSelect: stilDashedSelect,
      };
      // console.log(featureSelectionDict);
  
      if (useDefaultWhiteStyle) {
        featureSelection.setStyle(defaultWhiteDashedSelectStyle);
      } else {
        if (stilDashedSelect != null) {
          featureSelection.setStyle(stilDashedSelect);
  
          // Debug
          // document.getElementById("debugVinduTekst").innerHTML += " | Klikk ~ Satt stilDashedSelect på snarvei: " + NAVN;
        } else {
          featureSelection.setStyle(defaultWhiteDashedSelectStyle);
        }
      }

    } else {
      featureSelectionDict[endeligeNavn] = {
        feature: featureSelection,
        stilDashed: turStilDashed,
        stilDashedSelect: turStilDashedSelect,
      };

      featureSelection.setStyle(turStilDashedSelect);
    }

    // Debug
    // document.getElementById("debugVinduTekst").innerHTML += " | satt dashed for snarvei: " + NAVN;
  }

  return featureSelection;
}

//
function featureEksistererIFeatureSelectionList(feature){
  return featureSelectionList.includes(feature);
}
// Bruker hovedfunksjonene til å legge til en feature til featureSelectionList.
function settStilerOgLeggTilFeatureISelectionList(feature, layer){
  var featureSelection = settFeatureSelectionStiler(feature, layer);
  featureSelectionList.push(featureSelection);
}

// 
function featureEksistererIFeatureClickSelection(feature){
  return featureClickSelectionList.includes(feature);
}
// 
function settStilerOgLeggTilIFeatureClickSelection(feature, layer){
  var featureSelection = settFeatureSelectionStiler(feature, layer);
  featureClickSelectionList.push(featureSelection);
}

// erIkon: boolean
// feature: feature
// layer: kartlag
// function featureKlikkIPopup(erIkon, feature, layer){
//   console.log("featureKlikkIPopup klikket! erIkon: " + ikon + ", lagNavn: " + layer.get("name"));
// }

function hentFeatureOgNavnMedUID(featureUID, kartlag){
  let outFeatureDictEntry = uidFeaturesDict[featureUID];
  console.log(outFeatureDictEntry);

  if(outFeatureDictEntry){
    return [ outFeatureDictEntry["feature"], outFeatureDictEntry["navn"] ];
  } else {
    let outFeature = null;
    let outFeatureNavn = "";
    const featuresArray = kartlag.getSource().getFeaturesCollection().getArray();

    for(let i = 0; i < featuresArray.length; i++){
      const feature = featuresArray[i];
      const featureNavn = hentFeatureNavnMedBackup(feature);
      const uid = feature["ol_uid"];
      // console.log("feature ~ navn: " + featureNavn + ", uid: " + uid);
  
      if(uid == featureUID){
        // console.log("Fant feature med UID! featureNavn: " + featureNavn);
        // console.log(feature);
        outFeature = feature;
        outFeatureNavn = featureNavn;
        // Definerer dictEntry for feature med uid som key.
        uidFeaturesDict[featureUID] = {
          feature: feature,
          navn: featureNavn
        }

        break;
      }
    }

    return [outFeature, outFeatureNavn];
  }

}

function featureKlikkIPopup(featureUID, lagNavn, harStiplet){
  // console.log("featureKlikkIPopup klikket! featureUID: " + featureUID + ", lagNavn: " + lagNavn + ", harStiplet: " + harStiplet);

  // Må nok alltid hente selve kartlaget med hentKartlagMedLagNavn.
  const kartlag = hentKartlagMedLagNavn(lagNavn);
  // console.log(kartlag);

  kartlagFeature = null;
  kartlagFeatureNavn = "";

  const featureOgNavn = hentFeatureOgNavnMedUID(featureUID, kartlag);
  // console.log(featureOgNavn);

  kartlagFeature = featureOgNavn[0];
  kartlagFeatureNavn = featureOgNavn[1];

  if(kartlagFeature != null){
    // console.log("Fant kartlagFeature med UID! featureNavn: " + kartlagFeatureNavn);
    // console.log(kartlagFeature);
    // console.log(kartlag);

    let stipletter = null;
    if(harStiplet){
      stipletter = kartlagFeature.get("stipletter");
    }

    // Feature info side!
    // Hm, bare vise for turer? Altså, ikke for alle vektorlag.
    if(KartKjorer && (kartlag.get("ikonLag"))){
      // selectRute(kartlagFeature, kartlag);

      // visFeatureInfoSide(kartlagFeature, kartlagFeatureNavn, kartlag, true);
      visFeatureInfoSide(kartlagFeature, kartlagFeatureNavn, kartlag, stipletter, false);

      // selectRute(kartlagFeature, kartlag);

    } else {
      console.log("featureKlikkIPopup ~ Kartlaget er ikke et turkartlag!");
    }

  } else {
    console.log("featureKlikkIPopup ~ Fant ikke tur feature med UID: " + featureUID);
  }
  
}

// Tømmer selectionListe og uthever en enkelt rute.
function selectRute(feature, kartlag, stipletter){
  // console.log("\nselectRute kjører!")
  nullstillFeatureClickSelection();
  settStilerOgLeggTilIFeatureClickSelection(feature, kartlag);
  // 
  if(stipletter){
    for(var i = 0; i < stipletter.length; i++){
      settStilerOgLeggTilIFeatureClickSelection(stipletter[i], kartlag);
    }
  }
}