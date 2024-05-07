
// Delte elementer

// Popup
var popupContainer;
var popupContent;
var popupClose;
var popupOverlay;
var popupVises = false;

$(document).ready(function(){
  popupKjorer = true;

  popupContainer = document.getElementById('ol-popup');
  popupContent = document.getElementById('popup-content');
  popupClose = document.getElementById('popup-closer');

  $("#popup-closer").click(function (e) {
    console.log("popupClose clicked! Hiding.");
    if (popupContainer != null) {
      popupVises = false;
      popupContainer.style.display = "none";
      // Ta bort selection fra feature når popup lukkes.
      // Obs - deaktivere dette for nå.
      // nullstillFeatureClickSelection();
    }
    e.stopPropagation();
  });

  $("#popup-content").click(function(e){
    console.log("popupContent clicked!");
    e.stopPropagation();
  })

  $("#ol-popup").click(function () {
    console.log("popupContainer clicked! Hiding.");
    if (popupContainer != null) {
      popupVises = false;
      popupContainer.style.display = "none";
      // Ta bort selection fra feature når popup lukkes.
      // Obs - deaktivere dette for nå.
      // nullstillFeatureClickSelection();
    }
  });

  // Popup: Legge Overlay til map-objekt. Variabelen er definert globalt.
  popupOverlay = new ol.Overlay({
    element: popupContainer,
    autoPan: {
      animation: {
        // duration: 250,
        duration: 0,
      },
    },
    // positioning: "bottom-center",
    // offset: [100,100],
    name: "Popup"
  });

});

// Globale funksjoner.

function skjulPopupContainer() {
  if (popupContainer != null) {
    popupVises = false;
    popupContainer.style.display = "none";
  }
}
function visPopupContainer() {
  if (popupContainer != null) {
    popupVises = true;
    popupContainer.style.display = "block";
  }
}
function settPopupContentInnhold(innhold) {
  if (popupContent != null) {
    popupContent.innerHTML = innhold;
  }
}
