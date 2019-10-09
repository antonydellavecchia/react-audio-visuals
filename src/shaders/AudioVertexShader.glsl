varying vec4 vUv;
float magnitude(vec3 pos) {
  return pow(pow(pos.x, 2.0) + pow(pos.y, 2.0) + pow(pos.z, 2.0), 0.5);
}
void main() {
  vUv = vec4(position, 1.0);
  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
