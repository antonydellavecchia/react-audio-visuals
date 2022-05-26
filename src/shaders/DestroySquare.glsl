#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D tAudioData;

vec2 mul(vec2 u, vec w) {
  return vec2(u.x * w.x - u.y * w.y, u.x * w.y + u.y * w.x);
}

vec2 mandelbrot(vec2 u, vec2 c){
  return mul(u, u) + c;
}

void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  int iterations = 0;
  float inf = 1000;
  vec2 current_z = uv;
  
  for(int i = 0; i < 10; i++) {
    if (length(current_z) > inf && iterations != 0) {
      iterations = i;
    }
    current_z = mandelbrot(current_z, vec2(0.0, 1.0));
  }
  
  gl_FragColor = vec4(vec3(float(iterations) / 10.0), 1.0);


}
