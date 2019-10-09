uniform sampler2D tAudioData;
uniform float frequency;
varying vec4 vUv;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  float f =  texture2D( tAudioData, vec2( vUv.z, frequency) ).g;
  float radius = length(vUv);
  float circleNumber = floor(radius);
  
  vec3 backgroundColor = vec3( 0.25, circleNumber / 15.0, 0.0);

  gl_FragColor = vec4(backgroundColor, 0.1);
}
