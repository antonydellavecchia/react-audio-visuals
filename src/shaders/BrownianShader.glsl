varying vec4 vUv;
uniform float time;
float PI = 3.14159265358979323846;

float rand(vec2 c){
  return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p, float freq ){
  float unit = 100.0 / freq;
  vec2 ij = floor(p/unit);
  vec2 xy = mod(p,unit)/unit;
  //xy = 3.*xy*xy-2.*xy*xy*xy;
  xy = .5*(1.-cos(PI*xy));
  float a = rand((ij+vec2(0.,0.)));
  float b = rand((ij+vec2(1.,0.)));
  float c = rand((ij+vec2(0.,1.)));
  float d = rand((ij+vec2(1.,1.)));
  float x1 = mix(a, b, xy.x);
  float x2 = mix(c, d, xy.x);
  return mix(x1, x2, xy.y);
}

float pNoise(vec2 p, int res){
  float persistance = .5;
  float n = 0.;
  float normK = 0.;
  float f = 4.;
  float amp = 1.;
  int iCount = 0;
  for (int i = 0; i<50; i++){
    n+=amp*noise(p, f);
    f*=2.;
    normK+=amp;
    amp*=persistance;
    if (iCount == res) break;
    iCount++;
  }
  float nf = n/normK;
  return nf*nf*nf*nf;
}

void main() {
  float x = vUv.x;
  float y = vUv.y;
  float brownianHeight = 0.0;
  
  // Properties
  const int octaves = 1;
  float lacunarity = 100.0;
  float gain = 0.5;
  //
  // Initial values
  float amplitude = 5. * abs(y) / 10.0;
  float frequency = 1.;
  //brownianHeight = sin(y * frequency);
  float t = 0.01*(-time * 130.0);
  
  //brownianHeight += sin(y*frequency*2.1 + t)*4.5;
  //brownianHeight += sin(y*frequency*1.72 + t*1.121)*4.0;
  //brownianHeight += sin(y*frequency*2.221 + t*0.437)*5.0;
  //brownianHeight += sin(y*frequency*3.1122+ t*4.269)*2.5;
  //brownianHeight *= amplitude*0.06;
  //
  // Loop of octaves
  for (int i = 0; i < octaves; i++) {
    brownianHeight += amplitude * noise(vUv.xy + t, frequency);
    frequency *= lacunarity;
    amplitude *= gain;
  }

  float wave = step(brownianHeight, x) * step(x, brownianHeight + 2.0);
  gl_FragColor = vec4(255.0 * wave, 0.0, 0.0, 1.0);
}
