const layers = []

mapLink = 'data/{id}/{z}/{x}/{y}.jpg';

var renderBounds = { minX: 0, minY: 0, maxX: 8192, maxY: 8192 };
	
var layer  = L.tileLayer(mapLink, {id: 'layer', noWrap: true}); 

var map = L.map('map', {
    center: [0.0, 0.0], 
    zoom: 2, 
    minZoom: 2, 
    maxZoom: 5, 
    doubleClickZoom: false, 
    attributionControl: false,
}).addLayer(layer);

var baseLayers = {"layer": layer};

var markerArray = [];
var projArray = [];
                                
var southWest = map.unproject([0, 8192], map.getMaxZoom());
var northEast = map.unproject([8192, 0], map.getMaxZoom());
map.setMaxBounds(new L.LatLngBounds(southWest, northEast));


var interactiveLayerGroup = L.layerGroup().addTo(map);
var heatLayerGroup = L.layerGroup().addTo(map);
addZoomLayer(interactiveLayerGroup, 4, 5);
addZoomLayer(heatLayerGroup, 3, 3);


createLayer(heatData, heatLayerGroup);
createLayer(modelData, interactiveLayerGroup);


document.getElementById('closeBtn-glb').addEventListener('click', function() {
    document.getElementById('foreground-glb').style.display = 'none';
});

document.getElementById('closeBtn-gal').addEventListener('click', function() {
    document.getElementById('foreground-gal').style.display = 'none';
});



L.imageOverlay('./data/images/description.png', [
    map.unproject([0,7600], map.getMaxZoom()),
    map.unproject([1400, 6116], map.getMaxZoom())
]).addTo(map);





map.on('zoomend', togglePointsByZoom);
togglePointsByZoom();

/*
map.on('click', function(e) {
    // Convert lat/lng to pixel coordinates (project to the map's zoom level)
    var clickPoint = map.project(e.latlng, map.getMaxZoom());

    // Map to the custom coordinate system (invert Y-axis)
    var mappedX = clickPoint.x;
    var mappedY = renderBounds.maxY - clickPoint.y;

    console.log("Mapped Coordinates: X =", mappedX, "Y =", 8192-mappedY);

    // Unproject the point to convert back to lat/lng and place the marker
    var unprojectedPoint = map.unproject([mappedX, clickPoint.y], map.getMaxZoom());
    L.marker(unprojectedPoint).addTo(map)
        .bindPopup("Mapped X: " + mappedX + ", Mapped Y: " + (8192-mappedY))
        .openPopup();
});
*/




function addZoomLayer(layer, minZoom, maxZoom){
    layers.push({layer: layer, min: minZoom, max: maxZoom})
}


function togglePointsByZoom() {
    let currentZoom = map.getZoom();

    layers.forEach(layer => {
        if (currentZoom >= layer.min && currentZoom <= layer.max) {
            if (!map.hasLayer(layer.layer)) {
                map.addLayer(layer.layer);
            }
        } else {
            if (map.hasLayer(layer.layer)) {
                map.removeLayer(layer.layer);
            }
        }
    })
}

function createLayer(pointsData, layer){
    pointsData.point = pointsData.point.map(point => 
        new InteractivePointOverlay(map, point.coordinate, point.bounds, point.front, point.image, layer)
    );
    
    pointsData.rect = pointsData.rect.map(rect => 
        new InteractiveOverlay(map, rect.bounds, rect.image, rect.toggle, layer)
    );
}