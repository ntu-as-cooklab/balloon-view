precision mediump float;

//uniform sampler2D Sampler;
varying vec3 color;

void main()
{
	gl_FragColor = vec4(color, 1.0);
}
