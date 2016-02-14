var gl; // A global variable for the WebGL context
var renderer;
var canvas, timeline;
var imet, lora;

function main()
{
	// Get DOM elements
	canvas 		= document.getElementById("glCanvas");
	orientation = document.getElementById("orientation");
	infobox 	= document.getElementById("infobox");
	timeline 	= document.getElementById("timeline");

	// Init GL context
	gl = initWebGL(canvas);
	if(!gl) return null;

	// Init and start render
	renderer = new Renderer();
	renderer.init().done(function(){renderer.start();})

	// Load data
	//imet = new Sounding("data/0124_iMet.csv");
	lora = new Sounding("data/0124_LoRa_orientation.csv");
	lora.get.done(function(){
		initUI();
		updateCanvasSize();
		initMap();
		update();
	});
}

function initWebGL(canvas)
{
	gl = null;
	try {	// Try to grab the standard context. If it fails, fallback to experimental.
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
 	} catch(e) {}

	if (!gl) document.write("</br>Unable to initialize WebGL.</br>");
  	return gl;
}

function initUI() {
	timeline.min = Time.valueOf(lora.data[1].time);
	timeline.max = Time.valueOf(lora.data[lora.data.length-1].time);
	timeline.defaultValue = timeline.min;
	timeline.value = timeline.min;
	timestart.innerHTML = Time.toString(timeline.min);
	timeend.innerHTML 	= Time.toString(timeline.max);
}

function update() {
	if (lora.data[lora.current].millis < timeline.value)
		while(lora.data[lora.current+1].millis <= timeline.value && lora.current<lora.data.length-2) lora.current++;
	else if (lora.data[lora.current].millis > timeline.value)
		while(lora.data[lora.current-1].millis >= timeline.value && lora.current>1) lora.current--;

	// Update timeline
	timecurrent.innerHTML = Time.toString(timeline.value);
	timecurrent.style.left = 1 + (timeline.value - timeline.min)*92/(timeline.max - timeline.min) + "%";

	// Update infobox
	var info = "<table style='border-spacing: 5px;'>";
	var omit = ["w", "x", "y", "z", "elevation_angle", "azimuth"];
	for (var i=0; i<lora.header.length; i++)
		if (omit.indexOf(lora.header[i])<0) {
			info += "<tr>"
				+ "<td>" + lora.display_name[lora.header[i]] + ": " + "</td>"
				+ "<td>" + lora.data[lora.current][lora.header[i]] + " " + lora.units[lora.header[i]] + "</td>"
				+ "</tr>";}
	info += "</table>";
	infobox.innerHTML = info;

	// Update orientation
	cube.orientation = new Float32Array([lora.data[lora.current].x, lora.data[lora.current].y, lora.data[lora.current].z, lora.data[lora.current].w]);
	orientation.innerHTML = "Orientation: "
		+ lora.data[lora.current].w + (lora.data[lora.current].x>0?" +":"")
		+ lora.data[lora.current].x + (lora.data[lora.current].y>0?"i +":"i ")
		+ lora.data[lora.current].y + (lora.data[lora.current].z>0?"j +":"j ")
		+ lora.data[lora.current].z + "k"
		+ "</br>Elevation angle: " + lora.data[lora.current].elevation_angle
		+ "</br>Azimuth: " + lora.data[lora.current].azimuth;

	// Update map
	balloon.setPosition( new google.maps.LatLng(lora.data[lora.current].latitude, lora.data[lora.current].longitude) );
};

function play() {}
function speedUp() {}
function speedDown() {}

function updateCanvasSize() {
	canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);
}

function moveCanvas(event) {
	// TODO
}
