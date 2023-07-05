function printVersjon(versjon) {
    //var markakartversjon = "v1.0"
    var markakartversjon = versjon;
    return markakartversjon;
};

async function lesFil(file,tilBoks){
    // Fil for å lese 
    filMedAdresse = "infoSider/" + file + ".html";

    fil = await fetch(filMedAdresse);
    let text = await fil.text();

    //const infoside = document.getElementById("infoBoks-innhold");
    const infoside = document.getElementById(tilBoks);
    
    infoside.innerHTML = text; 
}

function expandFunc(title){
    // Function to expand and collapse 

    expanded = menyDict[title]["expanded"];

    if (expanded == 1) {
        menyDict[title]["expanded"] = 0;

        menyDict[title]["rotatedSym"].classList.remove("rotated");
        menyDict[title]["ListHidden"].classList.remove("optionsHidden");
    } else {
        menyDict[title]["expanded"] = 1;

        menyDict[title]["rotatedSym"].classList.add("rotated");
        menyDict[title]["ListHidden"].classList.add("optionsHidden");
    }
}




function addGroupToMenu(menyDict){
    /* This function adds an element to the menu list. */

    /* Inputs:
    title: Name of element
    exended: 1 if the element should start as checked, 0 as unchecked.
    */

    topGroupsList = Object.keys(menyDict);

    // Expandersymbolet 
    ///////////////////////// First for-loop (variable i)
    for (var i = 0; i < topGroupsList.length; i++) {

        title = topGroupsList[i];
        titleNice = menyDict[title]["name"];

        let kartlagGruppeMain = menyDict[title]["lagGruppe"];


        // Information about subelements
        subDict = menyDict[title]["dict"];

        buttonFunc = "expandFunc('" + title + "')"; // to many levels of "" and '' ..
        infoButtonFunc = "infoButtonClick('" + title + "','infoBoks-innhold','infoBoks-container')";

        var extendsymbol = "<div class='expandedButtonSymbol'>\n\
        <div class='HexpandedButton'></div>\n\
        <div class='VexpandedButton'></div>\n\
        </div>";


        GroupBlock = "<div><div class='underTitel mainMenuLevel1' >\n\
            <div class='expandedButton rotated' \n\
                onclick=" + buttonFunc + " \n\
                id='" + title + "Expand'>" + extendsymbol +"</div>\n\
                <button class='menutextButton' onclick=" + buttonFunc + ">" + titleNice + "</button>\n\
                <div class='infoButton' onclick=" + infoButtonFunc + ">i</div></div>";
        // onclick='infoButtonClick(" + title + ")'
        document.write(GroupBlock);


        document.write("<div id='" + title + "OptionsFromMenu' class='optionsFromMenu'>");

        // symbolobjekter
        menyDict[title]["rotatedSym"] = document.getElementById(title + "Expand"); // for rotated symbol
        menyDict[title]["ListHidden"] = document.getElementById(title + "OptionsFromMenu");


        if (kartlagGruppeMain == "leggTilLag") {
            // Spesialopplegg for meny for å legge til nytt lag.. 

            let ElementBlock = "<div class='optionsFromMenu' id='heheehe'>";
            ElementBlock += "<form>";


            // Eget kartlagnavn
            ElementBlock += "<label>Kartlagnavn (Valgfritt navn):</label><br>";
            ElementBlock += "<input value='' type='text' id='nyttLagEgetLagnavn' style='width:auto;'><br>";

            // Eget kartlagnavn
            ElementBlock += "<label>Legg til i laggruppe (valgfritt):</label><br>";

            ElementBlock += "<select id='nyttLagLagGruppe' style='width:auto;'>";
            for (var j = 0; j < topGroupsList.length; j++ ) {
                if (topGroupsList[j] != "leggTilLag"){
                    titleNice = menyDict[topGroupsList[j]]["name"];
                    ElementBlock += "<option value=" + topGroupsList[j] + ">" + titleNice + "</option>";
                }
            }
            ElementBlock += "</select>";



            // WMS/WMTS layer
            ElementBlock += "<label>WMS/WMTS layer:</label><br>";
            //ElementBlock += "<input value='topo4graatone' type='text' id='nyttLagLayer' style='width:auto;'><br>"
            ElementBlock += "<input value='' type='text' id='nyttLagLayer' style='width:auto;' list='wmsLagValgListe' onchange='oppdaterNyttLagEgetLagnavn()'><br>"
            

            // WMS/WMTS get-capabilities-url
            ElementBlock += "<label>get-capabilities-url:</label><br>";
            let defaultURL = "http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities";
            defaultURL = "";
            ElementBlock += "<input value='" + defaultURL +"' type='text' id='nyttLagGetCapabilities' style='width:auto;' onchange='scrapWMTSvWMSButton()'><br>";


            ElementBlock += "</form>";
            ElementBlock += "</div>";

            ElementBlock += "</form>";

            ElementBlock += "<div style='float:right;margin-top: 20px;'>";
            ElementBlock += "<div>"
            ElementBlock += "<button id='leggTilWMSWMTSKnapp' class='markaButton' onclick='leggTilWMSWMTSKnappFunc()'>Legg til WMS/WMTS</button>";
            ElementBlock += "</div>";
            ElementBlock += "</div>";

            document.write(ElementBlock);

        } else {
            elementList = Object.keys(subDict);

            for (var j = 0; j < elementList.length; j++) {

                let elementTitle = elementList[j];
                let elementTitleNice = subDict[elementTitle]["name"];

                let checked = subDict[elementTitle]["checked"]


                let vlStart = "verticalLine menuOptionUncheck";   

                let buttonFuncLayer = "velgLagFunc('" + title + "','" + elementTitle + "')";

                let ElementBlock = "<div class='optionsFromMenu' id='" + elementTitle + "OptionsFromMenu'>\n\
                    <button id='" + elementTitle +"' class='menuOption'\n\
                    onclick="+ buttonFuncLayer + ">\n\
                    <span id='" + elementTitle +"VL' class='" + vlStart + "'></span>" + elementTitleNice + "</button>\n\
                    </div>";

                document.write(ElementBlock);

                menyDict[title]["dict"][elementTitle]["layer"] = document.getElementById(elementTitle + "OptionsFromMenu");
                menyDict[title]["dict"][elementTitle]["verticalLineMark"] = document.getElementById(elementTitle + "VL");
            }
        }

        document.write("</div></div>");

        // kjor funksjon en gang for å oppdatere til startvisning! 
        expandFunc(title);

    }

    var endBlock = "</div><br>";
    document.write(endBlock);
}

async function leggTilWmtsFunc(kartDataDict, lagGruppe) {
    // Funksjon for å legge til WMTS-lag
    capabil = kartDataDict["capabilURL"];
    kartlagWMTS = kartDataDict["kartlagWMTS"];

    let parser = new ol.format.WMTSCapabilities();

    let capability = await fetch(capabil);
    if(capability.ok){
        try {            
            let capabilityText = await capability.text();
            const result = await parser.read(capabilityText);
    
            // generer config for nytt lag
            const options = await ol.source.WMTS.optionsFromCapabilities(result, {
            layer: kartlagWMTS,
            matrixSet: 'EPSG:3857'
            })
    
            // Lag nytt lag
            var nyttlag = new ol.layer.Tile({
                opacity: 1,
                source: new ol.source.WMTS(options),
            });

            // legg lag til i globalt objekt.
            kartDataDict["kartlag"] = nyttlag; 

            // legg kartlag til korrekt layergroup
            kartlagDict[lagGruppe].getLayers().push(kartDataDict["kartlag"]);
        } catch (error) {
            // Dersom den ikke klarer å legge til kartlaget som WMTS,
            // -> Prøv som WMS 
            let URLutencap = capabil.split("?")[0];

            var nyttlag = new ol.layer.Image({
                source: new ol.source.ImageWMS({
                    url: URLutencap,
                    params: {'LAYERS': kartlagWMTS},
                    ratio: 2,
                    serverType: 'mapserver'
                })
            });
            
            kartDataDict["kartlag"] = nyttlag; 
            //lagObjekt[elementTitle] = wmslag;

            kartlagDict[lagGruppe].getLayers().push(kartDataDict["kartlag"]);
            //kartlagDict[lagGruppe].getLayers().push(lagObjekt[elementTitle]); 
        }
    } else {
        console.error("Klarte ikke å finne nettresurs");
    }
}

function FjernWmtsFunc(kartDataDict, lagGruppe){
// Funksjon for å fjerne WMTS-lag
kartlagDict[lagGruppe].getLayers().remove(kartDataDict["kartlag"])
}

async function scrapWMTSvWMS(getCapabilitiesURL) {
// asynkronisert funksjon for å hente liste med mulige kartlag
// webscrapping ! 

/// Disse tjenestene er testet fungerer og fungerer
// http://localhost/markakart/wms.toporaster4
// https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer?service=wms&request=getcapabilities 
// http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities
// https://wms.nibio.no/cgi-bin/ar50?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities

console.log(getCapabilitiesURL);

const svar = await fetch(getCapabilitiesURL);
const text = await svar.text();
var parser = await new DOMParser();
var doc = parser.parseFromString(text, "text/xml");

let capability1;
let layer;

try {
    capability1 = doc.getElementsByTagName("Capability")[0]; //.innerHTML
    layer = capability1.getElementsByTagName("Layer");
    console.log("Trying!!")
} catch {
    // WMTS-lag kaller det capabilities i flertall
    capability1 = doc.getElementsByTagName("Capabilities")[0]; //.innerHTML
    layer = capability1.getElementsByTagName("Layer");
    console.log(layer);
    console.log("CATCHINGG!!")
}

console.log(layer);


let tilgjengeligeLag = [];
let tilgjengeligeLagTittel = [];
let undergruppe;
let brukUndergruppe = 0;

for (let i = 0; i < layer.length; i++) { 

    queryable = layer[i].getAttribute("queryable");

    // ESRI Lag har flere Layer under et Layer-objekt.. 
    undergruppe = layer[i].getElementsByTagName("Layer")
    try {
        console.log(undergruppe[0].getAttribute("queryable")); //.getAttribute("queryable"));
        brukUndergruppe = await undergruppe[0].getAttribute("queryable");
    } catch {}
    
    // WMS eksempel
    // https://kart.miljodirektoratet.no/arcgis/services/vern/mapserver/WMSServer?service=wms&request=getcapabilities

    // WMTS eksempel
    //http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities

    if (undergruppe && brukUndergruppe != "0") {

        for (let j = 0; j < undergruppe.length; j++) { 
            tilgjengeligeLag.push(undergruppe[j].getElementsByTagName("Name")[0].innerHTML);

            tittel = undergruppe[j].getElementsByTagName("Title")[0].innerHTML
            tilgjengeligeLagTittel.push(tittel.replace("<![CDATA[","").replace("]]>",""));
        }
    } else {

        if (queryable != "0") {

            try {
                tilgjengeligeLag.push(layer[i].getElementsByTagName("Name")[0].innerHTML);
            } catch {
                tilgjengeligeLag.push(layer[i].getElementsByTagName("ows:Identifier")[0].innerHTML);
            }


            try {
                tittel = layer[i].getElementsByTagName("Title")[0].innerHTML
                tilgjengeligeLagTittel.push(tittel.replace("<![CDATA[","").replace("]]>",""));
            } catch {
                tittel = layer[i].getElementsByTagName("ows:Title")[0].innerHTML
                tilgjengeligeLagTittel.push(tittel.replace("<![CDATA[","").replace("]]>",""));
            }
            // Ikke spesielt pen kode, men det er vanskelig å generalsere dette.
            // Jeg trodde protokollene for WMS og WMTS var litt mer standard.. 
            // Jeg kan for øvring mer om disse til neste gang jeg skriver tilsvarende kode...
        }
    }

}


element = "<datalist id='wmsLagValgListe'>"
for (let i = 0; i < tilgjengeligeLag.length; i++) {

    if (tilgjengeligeLag[i] == tilgjengeligeLagTittel[i]){
        element += "<option value='" + tilgjengeligeLag[i] + "' id='" + tilgjengeligeLag[i] +"_lagvalg'></option>";
    } else {
        element += "<option value='" + tilgjengeligeLag[i] + "' id='" + tilgjengeligeLag[i] +"_lagvalg'>" + tilgjengeligeLagTittel[i] + "</option>";
    }
    
}
element += "</datalist>";

let node = document.getElementById("nyttLagLayer");
node.innerHTML += element;

}