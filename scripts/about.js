// Om Markakartet
const openAbout = document.getElementById('apneOmMarkakartet');
const modal_containerAbout = document.getElementById('containerAbout');
const closeAbout = document.getElementById('lukkeOmMarkakartet');


/* Main menu */
const mainMenu_container = document.getElementById('mainMenu-container');
const lukkHovedmeny = document.getElementById("lukkHovedmeny");
const apneHovedmeny = document.getElementById("apneHovedmeny"); // Button for opening main menu

//var DuSerPaOpen = 0;
var aboutOpen = 0;

openAbout.addEventListener('click', function(){

    // Lukk åpent vindu
    modal_containerStotte.classList.remove('show');
    modal_containerDuSerPa.classList.remove('show');
    openDuSerPa.classList.add('skjulKnapp');

    stotteOpen = 0;

    if (aboutOpen == 0) {
        //lesfil("omMarkakartet",'containerAbout');

        modal_containerAbout.classList.add('show');
        var aboutOpenTemp = 1;
    } else {
        modal_containerAbout.classList.remove('show');
        
        if (titelfunc() != "Kartdeomstrasjon") {
            openDuSerPa.classList.remove('skjulKnapp');
        };

        var aboutOpenTemp = 0;
    };
    aboutOpen = aboutOpenTemp; 
});

closeAbout.addEventListener('click',() => {
    modal_containerAbout.classList.remove('show');

    if (titelfunc() != "Kartdeomstrasjon") {
        openDuSerPa.classList.remove('skjulKnapp');
    };
});

function closeAboutFunc(){
    modal_containerAbout.classList.remove('show');

    /*
    if (titelfunc() != "Kartdeomstrasjon") {
        openDuSerPa.classList.remove('skjulKnapp');
    };*/
}


// StotteKnapp 
const openStotte = document.getElementById('apneStotte');
const modal_containerStotte = document.getElementById('containerStotte');
const closeStotte = document.getElementById('lukkeStotte');

var stotteOpen = 0;

openStotte.addEventListener('click', function(){

    // Lukk allerede åpne vinduer
    modal_containerAbout.classList.remove('show');
    modal_containerDuSerPa.classList.remove('show');
    openDuSerPa.classList.add('skjulKnapp');

    aboutOpen = 0;

    if (stotteOpen == 0) {
        modal_containerStotte.classList.add('show');
        var stotteOpenTemp = 1;
    } else {
        modal_containerStotte.classList.remove('show');
        
        if (titelfunc() != "Kartdeomstrasjon") {
            openDuSerPa.classList.remove('skjulKnapp');
        };

        var stotteOpenTemp = 0;
    };
    stotteOpen = stotteOpenTemp; 
});

closeStotte.addEventListener('click',() => {
    modal_containerStotte.classList.remove('show');

    if (titelfunc() != "Kartdeomstrasjon") {
        openDuSerPa.classList.remove('skjulKnapp');
    };
});

function closeStotteFunc(){
    modal_containerStotte.classList.remove('show');

    /*
    if (titelfunc() != "Kartdeomstrasjon") {
    openDuSerPa.classList.remove('skjulKnapp');
    }; */
};

///////////////
// Du ser på //   -->  (You are looking at)
///////////////

const openDuSerPa = document.getElementById('apneDuSerPa');
const modal_containerDuSerPa = document.getElementById('containerDuSerPa');
const closeDuSerPa = document.getElementById('lukkDuSerPa');


function openDuSerPaFunc(){
    modal_containerDuSerPa.classList.add('show');
};

if (titelfunc() != "Kartdeomstrasjon") {
    openDuSerPaFunc();
};


closeDuSerPa.addEventListener('click',() => {
    modal_containerDuSerPa.classList.remove('show');
    openDuSerPa.classList.remove('skjulKnapp');
    // vise knapp for å åpne boksen igjen.. 
});


openDuSerPa.addEventListener('click',() => {
    openDuSerPaFunc();
    openDuSerPa.classList.add('skjulKnapp');
});


//////////////////////////////////
// Del kartvisningen
const openDelKartvisning = document.getElementById('delKartvisnig');
const menuDelKartvisning = document.getElementById("menuDelKartvisning-container");

var delKartvisningOpen = 0; // starter som lukket

openDelKartvisning.addEventListener('click',() => {

    if (delKartvisningOpen == 0) {
        menuDelKartvisning.classList.add('show');
        openDelKartvisning.classList.add('skjulKnapp');
        apneHovedmeny.classList.add('skjulKnapp');
        mainMenu_container.classList.remove('show');
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        delKartvisningOpen = 1;
    } else {
        menuDelKartvisning.classList.remove('show');
        apneHovedmeny.classList.remkove('skjulKnapp');
        mainMenu_container.classList.add('show');
        delKartvisningOpen = 0;
        deletePekerSirkel(); // Slett pekerSirkel dersom du lukker "Del kartvisningen"-vinduet
    }
});

const closeDelKartvisning = document.getElementById("lukkDelKartvisning");

closeDelKartvisning.addEventListener('click',() => {
    menuDelKartvisning.classList.remove('show');
    delKartvisningOpen = 0;
    deletePekerSirkel();

    // Vis DelKartvisningknappen igjen.
    openDelKartvisning.classList.remove('skjulKnapp');
    apneHovedmeny.classList.remove('skjulKnapp');
});
//
/////////////////////////////////////


//////////////////////////////////////
// Del kartvisningen autofill

const genererUrlKnapp = document.getElementById('genererUrlKnapp');
const modal_containerURLID = document.getElementById('genererURLID');
const lukkURLgenerert = document.getElementById('lukkURLgenerert');


genererUrlKnapp.addEventListener('click',() => {

    console.log("url");

    var title = document.getElementById("titleForm").value;
    var beskrivelse = document.getElementById("beskrivelseForm").value;

    var EPSG = document.getElementById("epsgForm").value;
    var x = document.getElementById("xCoordForm").value;
    var y = document.getElementById("yCoordForm").value;

    var zoom = document.getElementById("zoomForm").value;
    var sirkel = document.getElementById("sirkelForm").value;
    
    console.log(title,beskrivelse,x,y,EPSG,zoom,sirkel);

    // This shoulb be utdated before publishing, otherwise it wont work.

    var baseURL = window.location.href.split("?")[0];

    var URL = baseURL + "?title=" + title;
    //var URL = "localhost/markakart/?title=" + title ;

    // Sjekk om tittel er med..
    if (title == "" ) {
        alert("Tittel er påkrevd!");
    } else {

        if (beskrivelse != "") {
            URL += "&beskrivelse=" + beskrivelse;
        }

        if (EPSG != "") {
            URL += "&EPSG=" + EPSG;
        }
    
        if (x != "" && y != "" ) {
            URL += "&x=" + x + "&y=" + y ;
        }
    
        if (zoom != "") {
            URL += "&zoom=" + zoom;
        }

        if (sirkel != "") {
            URL += "&sirkel=" + sirkel;
        }
    
        // if (sirkel != "" && coordFromView == 0 ) {
        //     URL += "&sirkel=" + sirkel;
        // }
        
        //alert(URL);
        console.log(URL);
    
        document.getElementById("textAreaURL").value = URL;
        modal_containerURLID.classList.add('show');
    }


});



lukkURLgenerert.addEventListener('click',() => {
    modal_containerURLID.classList.remove('show');
});


/////////////////

function copyURLutklippstavle(){
    // Funksjon for å kopiere linken til utklipstavlen! 
    var URL = document.getElementById("textAreaURL");
    URL.select();
    URL.setSelectionRange(0, 99999)
    document.execCommand("copy");
    //alert("Lenkte kopiert til utklipstavlen!");
}


//////////////////////////////////////////////////////////////////////


/* Autmaticaly open main menu */
mainMenu_container.classList.add('show');

/* Automaticaly hide open main menu button */
apneHovedmeny.classList.add('skjulKnapp');

function lukkHovedmenyFunc() {
    mainMenu_container.classList.remove('show');
    apneHovedmeny.classList.remove('skjulKnapp');
};

function apneHovedmenyFunc() {
    mainMenu_container.classList.add('show');
    apneHovedmeny.classList.add('skjulKnapp');
}
