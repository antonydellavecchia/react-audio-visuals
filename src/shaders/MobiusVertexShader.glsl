varying vec4 vUv;
float magnitude(vec3 pos) {
  return pow(pow(pos.x, 2.0) + pow(pos.y, 2.0) + pow(pos.z, 2.0), 0.5);
}
void main() {
  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  float xPeriod = acos(position[0] / magnitude(position));
  float yPeriod = asin(position[1] / magnitude(position));  
  float y = min(xPeriod, yPeriod) / (4.0 * 3.14);
  vUv = vec4(modelViewPosition[0], y, position[2], 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
