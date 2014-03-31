//////////////////////////// Tab setting - START //////////////////////////////////////////////////////////////////////
$("#accordion").accordion({
    heightStyle: "content"
});

//////////////////////////// Tab setting - END //////////////////////////////////////////////////////////////////////

//////////////////////////Leaflet initialization - START ///////////////////////////////////////////////////////////////

var calgary_grey = L.tileLayer('http://136.159.122.90/PHPTileServer/CalgaryGrey/{z}/{x}/{y}.png', {
    attribution: 'Data &copy; OpenStreetMap contributors. Licensed under the Open Data Commons Open Database License. POI Data &copy; MapQuest 2013. Crime Data &copy; Calgary Police Service 2013. Design CC-BY <a href="http://gisciencegroup.ucalgary.ca/">GI Science Group.</a>', wax: 'http://136.159.122.90/PHPTileServer/CalgaryGrey.tilejson'});

var calgary_osm = L.tileLayer('http://136.159.122.90/PHPTileServer/CalgaryOSM/{z}/{x}/{y}.png', {
    attribution: 'Data &copy; OpenStreetMap contributors. Licensed under the Open Data Commons Open Database License.  POI Data &copy; MapQuest 2013. Crime Data &copy; Calgary Police Service 2013. Design CC-BY <a href="http://gisciencegroup.ucalgary.ca/">GI Science Group.</a>', wax: 'http://136.159.122.90/PHPTileServer/CalgaryOSM.tilejson'});

var map_center = new L.LatLng(51.057, -114.066);

var map = L.map('map', {center: [51.057, -114.066], zoom: 12, minZoom: 9, maxZoom: 18, layers: [calgary_grey]});

var southWest = new L.LatLng(50.68036, -114.52148),
    northEast = new L.LatLng(51.34434, -113.46714),
    bounds = new L.LatLngBounds(southWest, northEast);

map.setMaxBounds(bounds);

var base_layers = {
    "Calgary Grey": calgary_grey,
    "Calgary Colored": calgary_osm
};

var layer_control = L.control.layers(base_layers, {}, {
    collapsed: false
});
layer_control.addTo(map);

var green_marker_icon = new L.Icon({
    iconUrl: 'css/images/marker-green.png',
    shadowUrl: 'css/images/marker-shadow.png',
    iconSize: [25, 41], // size of the icon
    shadowSize: [41, 41], // size of the shadow
    iconAnchor: [13, 40], // point of the icon which will correspond to marker's location
    shadowAnchor: [13, 40], // the same for the shadow
    popupAnchor: [0, -40] // point from which the popup should open relative to the iconAnchor
});

var lat = map_center.lat;
var lng = map_center.lng;
var marker = new L.Marker(map_center, {icon: green_marker_icon, draggable: true}).addTo(map).bindPopup('Walking Start Point').openPopup();
$('#start_point_pedestrian').val(lat.toString() + ',' + lng.toString());
$('#start_point_transit').val(lat.toString() + ',' + lng.toString());
$('#start_point_bike').val(lat.toString() + ',' + lng.toString());
$('#start_point_wyp').val(lat.toString() + ',' + lng.toString());
$('#start_point_ws').val(lat.toString() + ',' + lng.toString());
marker.on('drag', function (e) {
    var point = e.target.getLatLng();
    var lat = point.lat;
    var lng = point.lng;
    $('#start_point_pedestrian').val(lat.toString() + ',' + lng.toString());
    $('#start_point_transit').val(lat.toString() + ',' + lng.toString());
    $('#start_point_bike').val(lat.toString() + ',' + lng.toString());
    $('#start_point_wyp').val(lat.toString() + ',' + lng.toString());
    $('#start_point_ws').val(lat.toString() + ',' + lng.toString());
});

marker.on('move', function (e) {
    var point = e.target.getLatLng();
    var lat = point.lat;
    var lng = point.lng;
    $('#start_point_pedestrian').val(lat.toString() + ',' + lng.toString());
    $('#start_point_transit').val(lat.toString() + ',' + lng.toString());
    $('#start_point_bike').val(lat.toString() + ',' + lng.toString());
    $('#start_point_wyp').val(lat.toString() + ',' + lng.toString());
    $('#start_point_ws').val(lat.toString() + ',' + lng.toString());
});

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<div id="accessibility_legend"></div>';
    div.innerHTML += '<div id="crime_legend"></div>';
    return div;
};

var poi_panel = L.control({position: 'topright'});
poi_panel.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<input type="checkbox" id="poi_data_check" name="poi_data_check" disabled="true"/><span id="poi_data_text" style="color: #a0a3a0; font-style: italic;">Point of Interests</span>';
    return div;
};


//////////////////////////Leaflet initialization - END ///////////////////////////////////////////////////////////////

//////////////////////////////// WPS invocation ////////////////////////////////////////////////////////////////////

var walkshed_overlay = null;
var legend_overlay = true;
var poi_data_overlay = null;

function call_wps(approach) {
    var start_point;
    var walking_radius;
    var biking_time_period;
    var walking_time_period;
    var walking_speed;
    var bus_waiting_time;
    var bus_riding_time;
    var distance_decay_function;
    var walking_start_time;
    var walking_speed_amount;
    var wps_call;

    switch (approach) {
        case "walkscore":
            start_point = $('#start_point_ws').val();
            walking_radius = $('#walking_radius_ws').val();
            distance_decay_function = $('#distance_decay_function_ws').prop('checked');
            wps_call = "call_wps.php?wps=walkscore&start_point=" + start_point + "&radius=" + walking_radius + "&distance_decay_function=" + distance_decay_function;
            break;
        case "walkyourplace":
            start_point = $('#start_point_wyp').val();
            walking_radius = $('#walking_radius_wyp').val();
            distance_decay_function = $('#distance_decay_function_wyp').prop('checked');
            wps_call = "call_wps.php?wps=walkyourplace&start_point=" + start_point + "&radius=" + walking_radius + "&distance_decay_function=" + distance_decay_function;
            break;
        case "bike":
            start_point = $('#start_point_bike').val();
            biking_time_period = $('#biking_time_period_amount').val();
            distance_decay_function = $('#distance_decay_function_bike').prop('checked');
            wps_call = "call_wps.php?wps=bike&start_point=" + start_point + "&biking_time_period=" + biking_time_period + "&distance_decay_function=" + distance_decay_function;
            break;
        case "pedestrian":
            start_point = $('#start_point_pedestrian').val();
            walking_time_period = $('#walking_time_period_amount_pedestrian').val();
            walking_speed_amount = $('#walking_speed_amount_pedestrian').val();
            switch (walking_speed_amount) {
                case '3':
                    walking_speed = .83;
                    break;
                case '3.5':
                    walking_speed = .97;
                    break;
                case '4':
                    walking_speed = 1.11;
                    break;
                case '4.5':
                    walking_speed = 1.25;
                    break;
                case '5':
                    walking_speed = 1.38;
                    break;
                case '5.5':
                    walking_speed = 1.52;
                    break;
                case '6':
                    walking_speed = 1.67;
                    break;
            }
            distance_decay_function = $('#distance_decay_function_pedestrian').prop('checked');
            wps_call = "call_wps.php?wps=pedestrian&start_point=" + start_point + "&walking_time_period=" + walking_time_period + "&walking_speed=" + walking_speed + "&distance_decay_function=" + distance_decay_function;
            break;
        case "transit":
            start_point = $('#start_point_transit').val();
            walking_time_period = $('#walking_time_period_amount_transit').val();
            walking_speed_amount = $('#walking_speed_amount_transit').val();
            switch (walking_speed_amount) {
                case '3':
                    walking_speed = .83;
                    break;
                case '3.5':
                    walking_speed = .97;
                    break;
                case '4':
                    walking_speed = 1.11;
                    break;
                case '4.5':
                    walking_speed = 1.25;
                    break;
                case '5':
                    walking_speed = 1.38;
                    break;
                case '5.5':
                    walking_speed = 1.52;
                    break;
                case '6':
                    walking_speed = 1.67;
                    break;
            }
            bus_waiting_time = $('#bus_waiting_time_amount_transit').val();
            bus_riding_time = $('#bus_riding_time_amount_transit').val();
            distance_decay_function = $('#distance_decay_function_transit').prop('checked');
            walking_start_time = $('#walking_start_time').val() + ":00";
            wps_call = "call_wps.php?wps=transit&start_point=" + start_point + "&walking_start_time=" + walking_start_time + "&walking_time_period=" + walking_time_period + "&walking_speed=" + walking_speed + "&bus_waiting_time=" + bus_waiting_time + "&bus_riding_time=" + bus_riding_time + "&distance_decay_function=" + distance_decay_function;
            break;
    }

    $.ajax({
        url: wps_call,
        beforeSend: function () {
            $.blockUI({ css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                'border-radius': '10px',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff'
            } });
        },
        success: function (data, status) {
            var wps_results = $.parseJSON(data);
            var walkshed = wps_results['walkshed'];
            if (walkshed != 'NULL') {
                var poi_data = wps_results['poi'];
                var crime_data;
                var shed_type;
                var coordinate;
                var lat;
                var lng;
                var area;
                var poi_score;
                var color;
                var geojson_overlay;
                var crime_index;

                if (approach == 'walkscore' || approach == 'walkyourplace') {
                    shed_type = "Walkshed";
                    coordinate = walkshed['coordinates'];
                    lat = coordinate[1];
                    lng = coordinate[0];
                    var radius = walkshed['radius'];
                    area = walkshed['properties']['area'];
                    poi_score = walkshed['properties']['score'];

                    color = "#6E8AFB";
                    crime_data = 'NULL';

                    if (approach == 'walkyourplace') {
                        color = walkshed['properties']['color'];
                        crime_index = walkshed['properties']['crime_index'];
                        crime_data = wps_results['crime'];
                    }
                    geojson_overlay = L.circle([lat, lng], radius, {
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.60
                    });
                }
                else if (approach == 'bike' || approach == 'pedestrian' || approach == 'transit') {
                    crime_data = wps_results['crime'];
                    var bus_stops = '';
                    if (walkshed['features']) {
                        shed_type = walkshed['features'][0]['properties']['type'];
                        color = walkshed['features'][0]['properties']['color'];
                        area = walkshed['features'][0]['properties']['area'];
                        poi_score = walkshed['features'][0]['properties']['score'];
                        crime_index = walkshed['features'][0]['properties']['crime_index'];
                        if (wps_results['transit']) {
                            bus_stops = wps_results['transit'];
                        }
                    }
                    else {
                        shed_type = walkshed['properties']['type'];
                        color = walkshed['properties']['color'];
                        area = walkshed['properties']['area'];
                        poi_score = walkshed['properties']['score'];
                        crime_index = walkshed['properties']['crime_index'];
                        if (wps_results['transit']) {
                            bus_stops = wps_results['transit'];
                        }
                    }
                    var shed_style = {
                        "color": color,
                        "weight": 5,
                        "opacity": 0.60
                    };

                    geojson_overlay = L.geoJson(walkshed, {
                        style: shed_style
                    });

//                    if (bus_stops != '') {
//                        bus_stops_overlay = L.geoJson(bus_stops, {
//                            onEachFeature: function (feature, layer) {
//                                layer.setIcon(new L.Icon({
//                                    iconUrl: 'css/images/bus-18.png'
//                                }));
//                            }
//                        });
//                    }
                }


                //overlay legend
                $('#accessibility_score').val(poi_score);
                $('#crime_index').val(crime_index);

                if (!legend_overlay) {
                    $('div').remove('.info');
                    legend_overlay = true;
                }

                accessibility_legend();
                if (approach != 'walkscore') {
                    crime_legend();
                }

                legend.addTo(map);
                legend_overlay = false;

                var poi_score_color;
                if (poi_score >= 0 && poi_score < 20) {
                    poi_score_color = '#ED1C24';
                } else if (poi_score >= 20 && poi_score < 40) {
                    poi_score_color = '#F7941E';
                } else if (poi_score >= 40 && poi_score < 60) {
                    poi_score_color = '#FFF200';
                } else if (poi_score >= 60 && poi_score < 80) {
                    poi_score_color = '#8DC63F';
                } else if (poi_score >= 80 && poi_score <= 100) {
                    poi_score_color = '#39B54A';
                }

                marker.bindPopup('<div>Score:</div><br><div style="font-size: 36px; margin-top: -20px; margin-bottom: -5px; color: ' + poi_score_color + '"><b>' + poi_score + '</b></div>').openPopup();

                //overlay poi data
                if (poi_data_overlay != null) {
                    map.removeLayer(poi_data_overlay);
                    poi_data_overlay = null;
                }

                //overlay poi panel
                poi_panel.addTo(map);

                if (poi_data != 'NULL') {
                    $('#poi_data_check').removeAttr("disabled");
                    $('#poi_data_text').css("font-style", "normal");
                    $('#poi_data_text').css("color", "#333333");
                    $('#poi_data_check').click(function () {
                        if ($(this).is(':checked')) {
                            if (poi_data_overlay == null) {
                                if (poi_data != 'NULL') {
                                    poi_data_overlay = show_poi_data(poi_data);
                                    map.addLayer(poi_data_overlay);
                                    map.fitBounds(poi_data_overlay.getBounds());
                                }
                            }
                        } else {
                            map.removeLayer(poi_data_overlay);
                            poi_data_overlay = null;
                        }
                    });
                } else {
                    $('#poi_data_check').attr("disabled", true);
                    //$('#no_poi_message').show();
                    $('#poi_data_text').css("font-style", "italic");
                    $('#poi_data_text').css("color", "#a0a3a0");
                }

                //overlay walkshed
                //marker.closePopup();

                var walkshed_bound = geojson_overlay.getBounds();
                map.fitBounds(walkshed_bound);

                if (walkshed_overlay != null) {
                    map.removeLayer(walkshed_overlay);
                }

                geojson_overlay.addTo(map);

                walkshed_overlay = geojson_overlay;
            }
            else {
                $("#out_of_bound_error").dialog();
                $.unblockUI();
            }

        },
        complete: function () {
            $.unblockUI();
        }
    });
}


////////////////////////////// WPS invocation - END ////////////////////////////////////////////////////////////////////


////////////////////////////// Show POI - START ////////////////////////////////////////////////////////////////////////

function show_poi_data(poi_data) {
    var _markers = new L.MarkerClusterGroup({showCoverageOnHover: false});

    var geoJsonLayer = L.geoJson(poi_data, {
        onEachFeature: function (feature, layer) {
            setGeoJsonFeatureIcon(feature, layer);
            setGeoJsonFeaturePopup(feature, layer);
        }
    });
    _markers.addLayer(geoJsonLayer);
    return _markers;
}

function setGeoJsonFeatureIcon(feature, layer) {
    if (feature.properties && feature.properties.icon) {
        layer.setIcon(new L.Icon({
            iconUrl: feature.properties.icon,
            iconAnchor: [10, 0], // point of the icon which will correspond to marker's location
            popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
        }));
    }
}

function setGeoJsonFeaturePopup(feature, layer) {
    if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.name);
    }
}

////////////////////////////// Show POI - END ////////////////////////////////////////////////////////////////////////


/////////////////////////////// Show Crime - START ///////////////////////////////////////////////////////////////////

function heatmap(_data) {
    var heatmap_layer = L.TileLayer.heatMap({
        radius: 20,
        opacity: 0.8,
        gradient: {
            0.45: "rgb(0,0,255)",
            0.55: "rgb(0,255,255)",
            0.65: "rgb(0,255,0)",
            0.95: "yellow",
            1.0: "rgb(255,0,0)"
        }
    });

    var heatmap_data = {
        max: 1000,
        data: _data
    };

    heatmap_layer.addData(heatmap_data.data);
    return heatmap_layer;
}

/////////////////////////////// Show Crime - END ///////////////////////////////////////////////////////////////////


///////////////////////////// Slider setting - START /////////////////////////////////////////////////////

$("#biking_time_period").slider({
    value: 15,
    min: 0,
    max: 20,
    step: 1,
    slide: function (event, ui) {
        $("#biking_time_period_amount").val(ui.value);
    }
});
$("#biking_time_period_amount").val($("#biking_time_period").slider("value"));

$("#walking_time_period_pedestrian").slider({
    value: 15,
    min: 0,
    max: 20,
    step: 1,
    slide: function (event, ui) {
        $("#walking_time_period_amount_pedestrian").val(ui.value);
    }
});
$("#walking_time_period_amount_pedestrian").val($("#walking_time_period_pedestrian").slider("value"));

$("#walking_speed_pedestrian").slider({
    value: 5,
    min: 3,
    max: 6,
    step: .5,
    slide: function (event, ui) {
        $("#walking_speed_amount_pedestrian").val(ui.value);
    }
});
$("#walking_speed_amount_pedestrian").val($("#walking_speed_pedestrian").slider("value"));

$("#walking_time_period_transit").slider({
    value: 15,
    min: 0,
    max: 20,
    step: 1,
    slide: function (event, ui) {
        $("#walking_time_period_amount_transit").val(ui.value);
    }
});
$("#walking_time_period_amount_transit").val($("#walking_time_period_transit").slider("value"));


$("#walking_speed_transit").slider({
    value: 5,
    min: 3,
    max: 6,
    step: .5,
    slide: function (event, ui) {
        $("#walking_speed_amount_transit").val(ui.value);
    }
});
$("#walking_speed_amount_transit").val($("#walking_speed_transit").slider("value"));

$("#bus_waiting_time_transit").slider({
    value: 10,
    min: 0,
    max: 10,
    step: 1,
    slide: function (event, ui) {
        $("#bus_waiting_time_amount_transit").val(ui.value);
    }
});
$("#bus_waiting_time_amount_transit").val($("#bus_waiting_time_transit").slider("value"));


$("#bus_riding_time_transit").slider({
    value: 5,
    min: 0,
    max: 10,
    step: 1,
    slide: function (event, ui) {
        $("#bus_riding_time_amount_transit").val(ui.value);
    }
});
$("#bus_riding_time_amount_transit").val($("#bus_riding_time_transit").slider("value"));

////////////////////////////// Slider setting - END //////////////////////////////////////////////////////////////////


///////////////////////////// Time Spinner setting - START ////////////////////////////////////////////////////////////

$.widget("ui.timespinner", $.ui.spinner, {
    options: {
        // seconds
        step: 60 * 1000,
        // hours
        page: 60
    },

    _parse: function (value) {
        if (typeof value === "string") {
            // already a timestamp
            if (Number(value) == value) {
                return Number(value);
            }
            return +Globalize.parseDate(value);
        }
        return value;
    },

    _format: function (value) {
        return Globalize.format(new Date(value), "t");
    }
});
var current_time = new Date();
var current_hour = current_time.getHours();
var current_minute = current_time.getMinutes();
current_time = current_hour + ":" + current_minute;
$("#walking_start_time").timespinner();
Globalize.culture("de-DE");
$("#walking_start_time").timespinner("value", current_time);

///////////////////////////// Time Spinner setting - END ////////////////////////////////////////////////////////////

////////////////////////////////////// Legend - START /////////////////////////////////////////////////////

function accessibility_legend() {
    var margin = {top: 5, right: 15, bottom: 20, left: 120},
        width = 150,
        height = 50 - margin.top - margin.bottom;

    var chart = d3.bullet()
        .width(width)
        .height(height);

    d3.json("accessibility_legend_init.json", function (error, data) {
        var svg = d3.select("#accessibility_legend").selectAll("svg")
            .data(data)
            .enter().append("svg")
            .attr("class", "bullet")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(chart);

        var title = svg.append("g")
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + height / 2 + ")");

        title.append("text")
            .attr("class", "title")
            .text(function (d) {
                return d.title;
            });

        title.append("text")
            .attr("class", "subtitle")
            .attr("dy", "1em")
            .text(function (d) {
                return d.subtitle;
            });

        svg.datum(update_accessibility_value).call(chart.duration(1000));
    });
}

function update_accessibility_value(d) {
    var new_value = $('#accessibility_score').val();
    d.value = get_value(d, new_value);
    d.markers = d.markers.map(d.value);
    d.measures = d.measures.map(d.value);
    return d;
}

function crime_legend() {
    var margin = {top: 5, right: 15, bottom: 20, left: 120},
        width = 150,
        height = 50 - margin.top - margin.bottom;

    var chart = d3.bullet()
        .width(width)
        .height(height);

    d3.json("crime_legend_init.json", function (error, data) {
        var svg = d3.select("#crime_legend").selectAll("svg")
            .data(data)
            .enter().append("svg")
            .attr("class", "bullet")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(chart);

        var title = svg.append("g")
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + height / 2 + ")");

        title.append("text")
            .attr("class", "title")
            .text(function (d) {
                return d.title;
            });

        title.append("text")
            .attr("class", "subtitle")
            .attr("dy", "1em")
            .text(function (d) {
                return d.subtitle;
            });

        svg.datum(update_crime_value).call(chart.duration(1000));
    });
}

function update_crime_value(d) {
    var new_value = $('#crime_index').val();
    d.value = get_value(d, new_value);
    d.markers = d.markers.map(d.value);
    d.measures = d.measures.map(d.value);
    return d;
}

function get_value(d, num) {
    return function (d) {
        return num;
    };
}

///////////////////////////////// Legend - END ///////////////////////////////////////////////////////////////////////


//////////////////////////// About Dialog - START //////////////////////////////////////////////////////////////////////

$(function () {
    $("#about-dialog").dialog({
        height: "auto",
        width: 500,
        modal: true,
        draggable: false,
        resizable: false
    });
});

//////////////////////////// About Dialog - END ///////////////////////////////////////////////////////////////////////

//////////////////////////// Adding geocoder control - START ///////////////////////////////////////////////////////////
function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, ])[1]
    );
}

var regionParameter = getURLParameter('region');
var region = (regionParameter === 'undefined') ? '' : regionParameter;

var geocoder_control = new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.Google({
        region: region
    })
}).addTo(map);

//////////////////////////// Adding geocoder control - END ///////////////////////////////////////////////////////////