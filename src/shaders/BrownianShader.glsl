// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D tAudioData;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x , 289.0); }

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123 + u_time);
}

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  float f1 = texture2D( tAudioData, vec2(0.0, 1.0) ).r;
  float f2 = texture2D( tAudioData, vec2(0.0, 4.0) ).r;
  float f3 = texture2D( tAudioData, vec2(0.0, 7.0) ).r;

  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;

  vec3 h = abs(x + f1 * cos(0.1 * u_time) * sin(0.1 * u_time)) - 0.5;
  vec3 ox = floor(x + 0.5 + f2 * cos(0.1 * u_time));
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  
  float f4 = texture2D( tAudioData, vec2(0.0, 30.0) ).r;
  float f5 = texture2D( tAudioData, vec2(0.0, 60.0) ).r;

  g.x  = f4 * a0.x  * x0.x  + h.x  * x0.y;
  g.yz = f5 * a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

#define OCTAVES 2
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .8;
    float frequency = 0.;
    float offset = 0.5;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
      float n = abs(snoise(st));     // create creases
      n = offset - n; // invert so creases are at top
      n = n * n;      // sharpen creases
      value += amplitude * n;
      st *= 2.;
      amplitude *= .5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.0);\

    float f1 = texture2D( tAudioData, vec2(0.0, 1.0) ).r;
    float f2 = texture2D( tAudioData, vec2(0.0, 4.0) ).r;
    float f3 = texture2D( tAudioData, vec2(0.0, 7.0) ).r;

    color += fbm(3.0*st);

    color = vec3(color.r, 1. - color.r, (.5 - color.r) / color.g);

    gl_FragColor = vec4(color,1.0);
}
