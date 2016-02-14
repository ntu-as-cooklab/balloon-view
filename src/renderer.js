var PI = 3.14159265358979;

function Renderer()
{
	var startTime;

	this.init = function()
	{
		glMatrix.setMatrixArrayType(Float32Array);
		cube = new glObject();
		plate = new glObject();
		loadVertexData();
		return glObject.init().done();
	}

	// Start the loop
	this.start = function()
	{
		if(!glObject.program) {
			document.write("</br>Failed to start render program.</br>");
			return null;
		}
		startTime = new Date().getTime();
		setInterval(render, 50);
		console.log("Render loop started");
	}

	// Render on the canvas
	function render()
	{
		seconds = (new Date().getTime() - startTime) / 1000;

		updateCanvasSize();

		// Clear buffers
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Use program
		gl.useProgram(glObject.program);

		// Uniforms
		var view = mat4.create(),
			projection = mat4.create(),
			eye = vec3.fromValues(0.0, 5.0, 0.0),
			center = vec3.fromValues(0.0, 0.0, 0.0),
			up = vec3.fromValues(0.0, 0.0, 1.0);
		mat4.lookAt(view, eye, center, up);
		mat4.perspective(projection, PI/180.0 * 45.0, canvas.clientWidth *1.0/canvas.clientHeight, 0.1, 100.0);
		mat4.multiply(glObject.MVP, projection, view);
		gl.uniformMatrix4fv(glObject.uniform_MVP, false, glObject.MVP);

		// Attributes & render
		cube.render();
		plate.render();
	}

}
