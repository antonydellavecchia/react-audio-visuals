uniform sampler2D tAudioData;
varying vec4 vUv;
float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main() {
  float random1 = rand(vec2(vUv.x, vUv.y));
  float random2 = rand(vec2(vUv.x, vUv.z));
  float f = texture2D( tAudioData, vec2(1.0 /(random1 * abs(vUv.x) * random2 * abs(vUv.y)), 0.0 ) ).g;
  //float f = texture2D( tAudioData, vec2((random1 * abs(vUv.x) * random2 * abs(vUv.y)), 0.0 ) ).g;
  float radius = pow(pow(vUv.y, 2.0) + pow(vUv.x, 2.0), 0.5);
  //vec3 backgroundColor = vec3( min(vUv.y, f), min(radius, f), min((f / 10.0), 0.1) );
  vec3 backgroundColor = vec3( min(abs(vUv.y), f), min(radius, f / 10.0), min((f / 10.0), 0.1) );
  float red  = min(vUv.y / 4.0, 1.0);
  vec3 color = vec3( red, sin(f), cos(f));
  float i = step(radius, f) * step(radius, f - 0.5);
  gl_FragColor = vec4( mix(color, backgroundColor, i), 1.0 );
  //gl_FragColor = vec4(backgroundColor, 0.1);
}
