/*
Generelle JavaScript funksjoner.
Ikke nødvendigvis relaterte til kartdata.
*/

// NOTAT: Hver shade har en 12.5% mørkere farge.
// NOTAT 2: Ikke forandre på alpha.
// NOTAT 3: Opp til 3 grader av shades: 1, 2, 3. Dvs. 12.5%, 25%, og 32.5%.
const SHADE_RATIO = 0.125; // 12.5%
const SHADE_1 = 0.125; const SHADE_2 = 0.25; const SHADE_3 = 0.375;
const SHADE_STROKE = 0.37; // Stroke er mørkere enn fill.
// const SHADE_SELECT = 0.13; // Select er 13% mørkere for både stroke og fill.
// const SHADE_STROKE = 0.75; // Stroke er mørkere enn fill.
const SHADE_SELECT = 0.33; // Select er 13% mørkere for både stroke og fill.
// Kan sette shade styrken?
let shadeStroke = SHADE_STROKE;
let shadeSelect = SHADE_SELECT;

var testFargeStringGul = "rgba(255,255,0,1)";
var testFargeIntegersGul = [255,255,0,1];

// Tar inn en string.
function getDarkerColorStringRGBA(stringRGBA){}
// Tar inn integer tall.
function getDarkerColorIntegersRGBA(r,g,b,a){}

// En funksjon for lagdata. Tar inn selve lagdataen og fill-fargen, for så å kalkulere stroke og selectFill og selectStroke fargene.
function settFargerForLagData(lagdata, fargeListe){
    lagdata[1]["strokeColor"] = getDarkerColorIntegerListRGBA(fargeListe, SHADE_STROKE);
    lagdata[1]["fillColorSelect"]= getDarkerColorIntegerListRGBA(lagdata[1]["fillColor"], SHADE_SELECT);
    lagdata[1]["strokeColorSelect"] = getDarkerColorIntegerListRGBA(lagdata[1]["strokeColor"], SHADE_SELECT);
}

// Enklere funksjoner å bruke - hardcoded for stroke og select.
function getDarkerColorIntegerListForStroke(integerListRGBA){
    return finalColorIntegerList = getDarkerColorIntegerListRGBA(integerListRGBA, SHADE_STROKE);
}
function getDarkerColorIntegerListForSelect(integerListRGBA){
    return finalSelectColorIntegerList = getDarkerColorIntegerListRGBA(integerListRGBA, SHADE_SELECT);
}
// Tar inn en liste med integers.
// Alpha vil alltid være 1.
// Returnerer en liste med integers. Eks: [0, 0, 0, 1]
// Default: 33% mørkere.
function getDarkerColorIntegerListRGBA(integerListRGBA, shadeGrade){
    // console.log("getDarkerColorIntegerListRGBA ~ integerListRGBA: " + integerListRGBA + ", shadeGrade: " + shadeGrade);
    try{
        
        if(shadeGrade <= 0){
            return integerListRGBA; // Ingen forandring.
        } else if(shadeGrade >= 1){
            shadeGrade = 1; // Maks er 1. Da vil det returneres helt sort, altså [0,0,0,1].
        }

        var colorAdjustment = 1 - shadeGrade;

        var nyIntegerListRGBA = [
            parseInt(integerListRGBA[0] * colorAdjustment),
            parseInt(integerListRGBA[1] * colorAdjustment),
            parseInt(integerListRGBA[2] * colorAdjustment),
            parseInt(integerListRGBA[3])
            // 1 // alpha er alltid 1 her.
        ]
        // console.log("nyIntegerListRGBA: " + nyIntegerListRGBA);
        return nyIntegerListRGBA;

    }catch(exception){
        // console.log("getDarkerColorIntegerListRGBA ~ exception! e: " + e);
        return integerListRGBA; // Ingen forandring, hvis noe gikk galt.
    }
}

//
function konverterRGBStrengTilArrayRGB(rgbStreng){
    var rgbArray = rgbStreng.split("(")[1].split(")")[0].split(",").map(Number); 
    // console.log("rgbArray: " + rgbArray);
    return rgbArray;
    // Kan legge til .filter(Boolean) til slutt, for å filtrere ugyldige symboler som bokstaver.
}

function konverterRGBStrengTilArrayRGBA(rgbStreng){
    var rgbArray = rgbStreng.split("(")[1].split(")")[0].split(",").map(Number); 
    // if(rgbArray.length == 3) rgbArray.push(1); // For RGBA, legge til 1 (alpha).
    rgbArray.push(1);
    // console.log("rgbArray: " + rgbArray + " | length: " + rgbArray.length);
    return rgbArray;
    // Kan legge til .filter(Boolean) til slutt, for å filtrere ugyldige symboler som bokstaver.
}
// OBS! Mangler type sjekk? At arrayRGBA er en array, og at den inneholder numre? ...
function konverterArrayRGBAtilStreng(arrayRGBA){
    if(arrayRGBA != null){
        return "rgba(" + arrayRGBA[0] + ", " + arrayRGBA[1] + ", " + arrayRGBA[2] + ", " + arrayRGBA[3] + ")";
    }
    return null;
}
function konverterArrayRGBtilStreng(arrayRGB){
    if(arrayRGB != null){
        return "rgb(" + arrayRGB[0] + ", " + arrayRGB[1] + ", " + arrayRGB[2] + ")";
    }
    return null;
}

// For device orientation
// Fra kompas.js: https://github.com/pirxpilot/kompas/blob/main/lib/kompas.js
const RAD_PER_DEG = Math.PI / 180;
function toRad(deg) { return deg * RAD_PER_DEG; }
function toDeg(rad) { return rad / RAD_PER_DEG; }

function calculateHeading(alpha, beta, gamma) {

    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);
  
    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    var cB = Math.cos(betaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);
  
    // Calculate A, B, C rotation components
    var rA = - cA * sG - sA * sB * cG;
    var rB = - sA * sG + cA * sB * cG;
    var rC = - cB * cG;
  
    // Calculate compass heading
    // var compassHeading = Math.atan(rA / rB);
    var compassHeading = Math.atan2(rA / rB);
  
    // Convert from half unit circle to whole unit circle
    if(rB < 0) {
      compassHeading += Math.PI;
    }else if(rA < 0) {
      compassHeading += 2 * Math.PI;
    }
  
    // Convert radians to degrees
    // compassHeading *= 180 / Math.PI;
  
    return compassHeading;
  }

function calculateHeadingInDegrees(alpha, beta, gamma) {

    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);
  
    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    var cB = Math.cos(betaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);
  
    // Calculate A, B, C rotation components
    var rA = - cA * sG - sA * sB * cG;
    var rB = - sA * sG + cA * sB * cG;
    var rC = - cB * cG;
  
    // Calculate compass heading
    // var compassHeading = Math.atan(rA / rB);
    var compassHeading = Math.atan2(rA / rB);
  
    // Convert from half unit circle to whole unit circle
    if(rB < 0) {
      compassHeading += Math.PI;
    }else if(rA < 0) {
      compassHeading += 2 * Math.PI;
    }
  
    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;
  
    return compassHeading;
  }
