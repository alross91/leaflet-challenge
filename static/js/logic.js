// setting map in center of US
var myMap = L.map("map", {
    center: [37.10, -95.70],
    zoom: 5
});

// adding street tilelayer
var streetTile = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.optilelayertreetmap.org/\">OptilelayertreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 17,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);


// making the query and setting colors

var QuakesQuery = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(QuakesQuery, function (data) {
    var earthquakes = data.features;
    //    console.log(earthquakes);
    

    var color = {
        level1: "green",
        level2: "brown",
        level3: "yellow",
        level4: "orange",
        level5: "blue",
        level6: "red"
    }

    // getting lat long and magitude to determine color

    for (var i = 0; i < earthquakes.length; i++) {
        var lat = earthquakes[i].geometry.coordinates[1];
        var long = earthquakes[i].geometry.coordinates[0];
        var magnitude = earthquakes[i].properties.mag;
        var circleColor;
        if (magnitude > 5) {
            circleColor = color.level6;
        } else if (magnitude > 4) {
            circleColor = color.level5;
        } else if (magnitude > 3) {
            circleColor = color.level4;
        } else if (magnitude > 2) {
            circleColor = color.level3;
        } else if (magnitude > 1) {
            circleColor = color.level2;
        } else {
            circleColor = color.level1;
        }

        //markers for each quake
        var quakeCenter = L.circleMarker([lat, long], {
            radius: magnitude ** 2,
            color: "black",
            fillColor: circleColor,
            fillOpacity: 1,
            weight: 1
        });
        quakeCenter.addTo(myMap);


        //popup labels

        quakeCenter.bindPopup("<h3> " + new Date(earthquakes[i].properties.time) + "</h3><h4>Magnitude: " + magnitude +
            "<br>Location: " + earthquakes[i].properties.place + "</h4><br>");

    }

    //adding legend to explain color for each level
    var legend = L.control({
        position: 'bottomleft'
    });

    legend.onAdd = function () {
    
        var div = L.DomUtil.create('div', 'info legend')
        
        div.innerHTML = "<h3>Magnitude Legend</h3><table><tr><th>6</th><td>Red</td></tr><tr><th> 5</th><td>Blue</td></tr><tr><th> 4</th><td>Orange</td></tr><tr><th>3</th><td>Yellow</td></tr><tr><th>2</th><td>Brown</td></tr><th>1</th><td>Green</td></tr></table>";

        return div;
    };
    
    legend.addTo(myMap);
})