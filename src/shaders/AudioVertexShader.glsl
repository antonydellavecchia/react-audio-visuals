varying vec4 vUv;
uniform sampler2D tAudioData;
varying vec3 newPosition;
uniform float time;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float gaussian(vec2 co, vec2 mu, vec2 sigma) {
  //float M_PI = 3.1415926535897932384626433832795;
  return exp(-1.0 * dot(co - mu, co - mu) / dot(sigma, sigma));
  //return exp(- 1.0 * pow(dot(vec2(co.x - mu.x, co.y - mu.y), vec2(co.x - mu.x, co.y - mu.y)) / dot(sigma, sigma), 2)); /// sqrt(dot(sigma, sigma) * 2 * M_PI)
}

float mixture(vec2 co) {
  vec2 mu1 = vec2(-25.0, 1.0);
  vec2 sigma1 = vec2(5.0, 8.0);
  vec2 mu2 = vec2(50.0, 1.0);
  vec2 sigma2 = vec2(1.0, 11.0);

  return gaussian(co, mu1, sigma1) + gaussian(co, mu2, sigma2);
}

vec2 move(vec2 co, vec2 dir, float time) {
  return vec2(co.x + fract(time / 100.0) * dir.x, co.y + fract(time) * dir.y);
}

void main() {
  float dist = distance(position, vec3(0,0, position.z));
  float f1 = texture2D(tAudioData, vec2(position.y, position.x)).g;
  //float f2 = texture2D(tAudioData, vec2(position.x, position.y)).g;
  float M_PI = 3.1415926535897932384626433832795;
  //float f =  texture2D( tAudioData, vec2( 0.5 + 0.5 * sin(M_PI * position.x) * cos(2.0 * M_PI * position.y), 0.0) ).g;

  vec2 newPos = move(vec2(position.x, position.y), vec2(5.0, 0.0), time);
  float amplitude = 25.0 * mixture(newPos);
  
  newPosition = vec3(position.x, position.y, amplitude * f1);
  //vUv = vec4(position.x, position.y, 10.0 * sin(2.0 * position.x), 1.0);
  vUv = vec4(position, 1.0);
  
  vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
