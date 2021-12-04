uniform sampler2D tAudioData;
varying vec4 vUv;
float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main() {
  float M_PI = 3.1415926535897932384626433832795;
  float f =  texture2D( tAudioData, vUv.xy).g;
  float radius = 0.5;

  vec3 backgroundColor = vec3(1.0, 0.0 , 0.0);
  float red  = min(vUv.y / 4.0, 1.0);
  vec3 color = vec3( 0.0, 0.0, 0.0);
  float i = step(sin(vUv.x + vUv.y + vUv.z), f) ;
  gl_FragColor = vec4( mix(backgroundColor, color, i), 1.0 );
  
  //gl_FragColor = vec4(vec3(1,0,0), 1.0);
  //gl_FragColor.a = f;
}
