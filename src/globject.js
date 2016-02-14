var glObject = function()
{
	// Init
	this.orientation = new Float32Array([0, 0, 0, 1]);
	this.position 	= gl.createBuffer();
	this.color 		= gl.createBuffer();
	this.draw = function() { gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.nVertex); }

	this.positionData = function(data) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.position);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		this.nVertex = data.length/3;
	}

	this.colorData = function(data) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	}

	// Render
	this.render = function() {

		gl.uniform4fv(glObject.uniform_orientation, this.orientation);

		// Attribute: vertexPosition
		gl.bindBuffer(gl.ARRAY_BUFFER, this.position);
		gl.vertexAttribPointer(glObject.attrib_vertexPosition, 3, gl.FLOAT, false, 0, 0);

		// Attribute: vertexPosition
		gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
		gl.vertexAttribPointer(glObject.attrib_vertexColor, 3, gl.FLOAT, false, 0, 0);

		// Draw
		this.draw();
	}

}

glObject.init = function()
{
	glObject.MVP = mat4.create();

	// Init render options
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	return loadShaders('glsl/quat.vs', 'glsl/quat.fs').done(function() {
			glObject.program = this.program;
			if(glObject.program) glObject.initShaderVars();
		});
}

glObject.initShaderVars = function()
{
	// Init uniforms
	glObject.uniform_orientation 	= gl.getUniformLocation(glObject.program, "orientation");
	glObject.uniform_MVP 			= gl.getUniformLocation(glObject.program, "MVP");

	// Init attributes
	glObject.attrib_vertexPosition 	= gl.getAttribLocation(glObject.program, "vertexPosition");
	glObject.attrib_vertexColor 	= gl.getAttribLocation(glObject.program, "vertexColor");
	gl.enableVertexAttribArray(glObject.attrib_vertexPosition);
	gl.enableVertexAttribArray(glObject.attrib_vertexColor);
}
