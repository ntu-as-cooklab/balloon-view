var map;
var loraLayer;
var balloon;
var infowindow;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 25.014852, lng: 121.538715},
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.HYBRID,
		disableDefaultUI: false,
		zoomControl: false,
  		mapTypeControl: false,
  		scaleControl: false,
  		streetViewControl: false,
  		rotateControl: true,
  		fullscreenControl: false
	});

	/*// Register map types
	SatelliteMapType = new google.maps.ImageMapType({
		getTileUrl: function(coord, zoom) {
			var scale = 1 << zoom;
			var x = ((coord.x % scale) + scale) % scale; // Wrap tiles horizontally.
			var y = coord.y; if (y < 0 || y >= scale) return null; // Don't wrap tiles vertically.
			return 'https://khms0.googleapis.com/kh?v=196&x='+x+'&y='+y+'&z='+zoom;
		},
		tileSize: new google.maps.Size(256, 256),
		minZoom: 0,
		maxZoom: 19,
		name: 'Satellite'
	});
  	map.mapTypes.set('Satellite', SatelliteMapType);
	*/
	map.mapTypes.set('Coordinate', new CoordMapType(new google.maps.Size(256, 256)));

	/*// To show the latlng under mouse cursor.
	var coordsDiv = document.getElementById('coords');
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(coordsDiv);
	map.addListener('mousemove', function(event) {
	coordsDiv.textContent = event.latLng.lat().toFixed(5) + ', ' + event.latLng.lng().toFixed(5);
	});
	*/

	// Executed after map loaded
	google.maps.event.addListenerOnce(map, 'idle', function(){mapLoaded();});

	// Add balloon marker
	balloon = new google.maps.Marker({
		position: {lat: lora.data[1].latitude, lng: lora.data[1].longitude},
		map: map
	});
	// Add info window
	infowindow = new google.maps.InfoWindow({
  		content: lora.data[1].latitude + ", " + lora.data[1].longitude
	});
	balloon.addListener('click', function() {infowindow.open(map, balloon);});

	// Add lora layer
	loraLayer = new google.maps.KmlLayer({
		url: 'http://mospc.cook.as.ntu.edu.tw/phormoza/data/0124.kml',
		map: map
	});

	//map.overlayMapTypes.insertAt(0, map.mapTypes.coordinate);
}

function mapLoaded()
{
	/*
	var HybridMapType = map.mapTypes.hybrid;
	map.mapTypes.set('hybrid', HybridMapType);
	map.setMapTypeId('hybrid');
	*/
}

function CoordMapType(tileSize) {
  this.tileSize = tileSize;
}

CoordMapType.prototype.maxZoom = 19;
CoordMapType.prototype.name = 'Tile #s';
CoordMapType.prototype.alt = 'Tile Coordinate Map Type';

CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
  var div = ownerDocument.createElement('div');
  div.innerHTML = coord;
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  div.style.fontSize = '10';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px';
  div.style.borderColor = '#AAAAAA';
  return div;
};
