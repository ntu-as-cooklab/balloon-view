var Time = {
	valueOf: function(string) {
		var time = string.split(':').map(Number);
		return (time[0]*3600 + time[1]*60 + time[2]) * 1000;
	},
	toString: function(millis) {
		var ms = millis, sec, min, hr;
		sec = ~~(millis/1000), 	ms %= 1000;
		min = ~~(sec/60),		sec %= 60;
		hr = ~~(min/60),		min %= 60;
		return hr + ":" + (min<10?"0":"") + min + ":" + (sec<10?"0":"") + sec;
	}
}

var Sounding = function(csv_path)
{
	this.header = [];
	this.data = [];
	this.current = 1;
	this.currentData = function() { return this.data[this.current]; }
	var instance = this;
	this.get = jQuery.get(csv_path, function(source){ parse(instance, source); });

	var add = (function () {
	    var counter = 0;
	    return function () {return counter += 1;}
	})();

	function parse(instance, source)
	{
		var rows = source.split(/\r\n|\n/);
   		instance.header 	= rows[0].split(',');
		instance.display_name 	= [];
		instance.units 			= [];
		var display_name 	= rows[1].split(','),
			units			= rows[2].split(',');
		for (var i=0; i<display_name.length; i++) 	instance.display_name[instance.header[i]] = display_name[i];
		for (var i=0; i<units.length; i++) 			instance.units[instance.header[i]] = units[i];

   		for (var i=3; i<rows.length; i++) {
	   		var vals = rows[i].split(',');
			if(vals.length>1) {
				var entry = [];
		   		for (var j=0; j<vals.length; j++) entry[instance.header[j]] = vals[j];
				entry.millis = Time.valueOf(entry.time);
				entry.orientation = quat.fromValues(entry.x, entry.y, entry.z, entry.w);
				entry.latitude = Number([entry.latitude.slice(0, 2), ".", entry.latitude.slice(2)].join(''));
				entry.longitude = Number([entry.longitude.slice(0, 3), ".", entry.longitude.slice(3)].join(''));
				entry.altitude = Number(entry.altitude/1e5).toFixed(4); // km
				entry.temperature = Number(entry.temperature).toFixed(2); // hPa
				entry.pressure = Number(entry.pressure/1e2).toFixed(2); // hPa
				entry.elevation_angle = Number(entry.elevation_angle).toFixed(1);
				entry.azimuth = Number(entry.azimuth).toFixed(1);
		   		instance.data.push(entry);
			}
   		}
	}
}
