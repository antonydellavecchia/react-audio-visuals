uniform sampler2D tAudioData;
uniform vec2 u_resolution;

varying vec4 vUv;
float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  
  float height;

  height = 0.25 * sin( 10.0 *st.x) + 0.5;

  float color = step(height, st.y) * step(st.y - 0.01, height);
  //float xAxis = step(0.1, st.x) * step(st.x, - 0.1);
  
  gl_FragColor = vec4( color *vec3(1., 1., 0.), 1.0 );
  
}
