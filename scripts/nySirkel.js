// Then DelKartvisningen is openened
// The user should be able to make a new sircle by clicking in the map.

// sirkelobjekt som er gjennomsiktig når DelVisning er av
// og som oppdaterer koordinatene når man trykker i kartet.

function pekerSirkel(x,y,r,f) {
    /* Function to create a new sircle object */ 

    /* Get coordinate system from form */
    var coordSys = "EPSG:" + document.getElementById("epsgForm").value;

    var sirkelGeometri = new ol.geom.Circle(
        proj4(coordSys,viewProjection,[x,y]),
        parseInt(r)
    );

    var sirkelEgenskap = new ol.Feature(sirkelGeometri);

    var vektorKilde = new ol.source.Vector({
    projection: viewProjection,
    features: [sirkelEgenskap]
    });

        
    var pekeSirkelStil = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 100, 50, 0)'
    }),
    stroke: new ol.style.Stroke({
        width: 5,
        color: f
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
        name: "pekerSirkel",
        className: "egentstil",
        source: vektorKilde,
        style: pekeSirkelStil
    });
    
    return sirkelLag;
}