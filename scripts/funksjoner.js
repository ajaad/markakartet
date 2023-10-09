/*
Generelle JavaScript funksjoner.
Ikke nødvendigvis relaterte til kartdata.
*/

// NOTAT: Hver shade har en 12.5% mørkere farge.
// NOTAT 2: Ikke forandre på alpha.
// NOTAT 3: Opp til 3 grader av shades: 1, 2, 3. Dvs. 12.5%, 25%, og 32.5%.
const SHADE_RATIO = 0.125; // 12.5%
const SHADE_1 = 0.125; const SHADE_2 = 0.25; const SHADE_3 = 0.375;

var testFargeStringGul = "rgba(255,255,0,1)";
var testFargeIntegersGul = [255,255,0,1];

// Tar inn en string.
function getDarkerColorStringRGBA(stringRGBA){}
// Tar inn integer tall.
function getDarkerColorIntegersRGBA(r,g,b,a){}
// Tar inn en liste med integers.
// Returnerer en liste med integers. Eks: [0, 0, 0, 1]
function getDarkerColorIntegerListRGBA(integerListRGBA, shadeGrade){
    console.log("getDarkerColorIntegerListRGBA ~ integerListRGBA: " + integerListRGBA);
    try {
        // Clamper shadeGrade til 1-3.
        // if(shadeGrade < 1){
        //     shadeGrade = 1;
        // } else if(shadeGrade > 3){
        //     shadeGrade = 3;
        // }
        if(shadeGrade < SHADE_1){
            shadeGrade = SHADE_1;
        } else if(shadeGrade > SHADE_3){
            shadeGrade = SHADE_3;
        }

        var korrektShadeGrade = false;
        switch(shadeGrade){
            case SHADE_1:
                korrektShadeGrade = true;
            case SHADE_2:
                korrektShadeGrade = true;
            case SHADE_3:
                korrektShadeGrade = true;
        }
        if(!korrektShadeGrade) shadeGrade = SHADE_1; // Default til SHADE_1 hvis shadeGrade er ugyldig.
        // console.log("shadeGrade: " + shadeGrade);
        var colorAdjustment = 1 - shadeGrade;

        // var nyIntegerListRGBA = integerListRGBA * shadeGrade;
        var nyIntegerListRGBA = [
            parseInt(integerListRGBA[0] * colorAdjustment),
            parseInt(integerListRGBA[1] * colorAdjustment),
            parseInt(integerListRGBA[2] * colorAdjustment),
            integerListRGBA[3] // alpha
        ]
        // console.log("nyIntegerListRGBA: " + nyIntegerListRGBA);
        return nyIntegerListRGBA;

    } catch(exception){
        // console.log("getDarkerColorIntegerListRGBA ~ exception! e: " + e);
        return integerListRGBA; // Returner opprinnelig liste hvis feil.
    }
}

// var darkerRGBA = getDarkerColorIntegerListRGBA(testFargeIntegersGul, SHADE_1);
// console.log("darkerRGBA: " + darkerRGBA);