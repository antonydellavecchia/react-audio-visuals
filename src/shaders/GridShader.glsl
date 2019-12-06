varying vec4 vUv;
uniform vec4 params;
uniform float time;

// adapted from https://thebookofshaders.com/edit.php#10/ikeda-simple-grid.frag
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 move(vec2 co, vec2 dir, float time) {
  return vec2(co.x + fract(time) * dir.x, co.y + fract(time) * dir.y);
}
 
float grid(vec2 st, float res)
{
  float motion = fract(time);
  vec2 grid = fract(st*res);
  return (step(res, grid.x) * step(res, grid.y));
}
 
void main()
{
  vec2 newPos = move(vec2(vUv.x, vUv.y) * 0.5, vec2(2.0, 5.0), time);
  vec2 grid_uv = newPos * 5.0; //params.x; // scale
  float x = grid(grid_uv, 0.3);//params.y); // resolution

  // gold grid
  //gl_FragColor.rgb = vec3(0.5, 0.4, 0.1) * (1.0 - x);

  // random greens
  float threshold = abs(sin(time));
  float p = step(threshold, rand(vUv.xy));
  gl_FragColor.rgb = (vec3(0.33, 0.0, 1.0) * p  + vec3(0.73, 0.0, 0.623) * (1.0 - p))  * (1.0 - x) ;
  gl_FragColor.a = 1.0;
} 
