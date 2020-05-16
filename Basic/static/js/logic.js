// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var map = L.map('map-id', {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
}).addTo(map);

function colorPick(mg) {
  switch(true) {
      case mg < 2:
          return '#8D8741';
          break;
      case mg < 3:
          return '#659DBD';
          break;
      case mg < 4:
          return '#DAAD86';
          break;
      case mg < 5:
          return '#BC986A';
          break;
      case mg < 6:
          return '#FBEEC1';
          break;
      default:
          return '#FF0000';
  }
}

//pull the coordinates and design them for the map.
d3.json(queryUrl, data => {
  console.log (data.features);
  data.features.forEach(c => {
    L.circleMarker ([c.geometry.coordinates[1], c.geometry.coordinates[0]], {
        fillOpacity:0.8,
        fillColor: colorPick(c.properties.mag),
        opacity: 1,
        color:"#000000",
        weight: 1,
        radius: c.properties.mag*6
    }).bindPopup("<h3>"+ "Magnitude "+ c.properties.mag +": Located "+ c.properties.place + "</h3><hr><p>" + new Date(c.properties.time) + "</p>").addTo(map);

  });

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      // When the layer control is added, insert a div with the class of "legend"
      var div = L.DomUtil.create("div", "info legend"),
          mags = [0, 1, 2, 3, 4, 5]; 
      
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < mags.length; i++) {
              div.innerHTML += '<i style= "background:' + colorPick(mags[i] + 1) + '"></i> ' + mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
          }
          return div;
          };

  legend.addTo(map);
});