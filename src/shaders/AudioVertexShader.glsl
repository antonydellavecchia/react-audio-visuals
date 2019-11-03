varying vec4 vUv;
uniform sampler2D tAudioData;
varying vec3 newPosition;

void main() {
  float dist = distance(position, vec3(0,0, position.z));
  float f1 = texture2D(tAudioData, vec2(position.y, position.x)).g;
  float f2 = texture2D(tAudioData, vec2(position.x, position.y)).g;
  float M_PI = 3.1415926535897932384626433832795;
  //float f =  texture2D( tAudioData, vec2( 0.5 + 0.5 * sin(M_PI * position.x) * cos(2.0 * M_PI * position.y), 0.0) ).g;
		      
  newPosition = vec3(position.x,  position.y, f1 * f2);
  //vUv = vec4(position.x, position.y, 10.0 * sin(2.0 * position.x), 1.0);
  vUv = vec4(position, 1.0);
  
  vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
