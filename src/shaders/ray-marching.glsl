#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float distance_from_sphere(in vec3 p, in vec3 c, float r)
{
  vec2 xy_plane_distance = (p.xy - c.xy); //* u_resolution.xy / 2.0;
  float z_distance = p.z - c.z;
  return length(p-c) - r;
}

vec3 ray_march(in vec3 ro, in vec3 rd)
{
    float total_distance_traveled = 0.0;
    const int NUMBER_OF_STEPS = 32;
    const float MINIMUM_HIT_DISTANCE = 1.0;
    const float MAXIMUM_TRACE_DISTANCE = 1000.0;
    vec3 color = vec3(0.0, 0.0, 0.0);
    
    for (int i = 0; i < NUMBER_OF_STEPS; ++i)
    {
        // Calculate our current position along the ray
        vec3 current_position = ro + total_distance_traveled * rd;

        // We wrote this function earlier in the tutorial -
        // assume that the sphere is centered at the origin
        // and has unit radius
        float distance_to_closest = distance_from_sphere(current_position, vec3(0.0), 1.0);

        if (distance_to_closest < MINIMUM_HIT_DISTANCE) // hit
        {
            // We hit something! Return red for now
            color = vec3(1.0, 0.0, 0.0);
        }

        if (total_distance_traveled > MAXIMUM_TRACE_DISTANCE) // miss
        {
	  break;
        }

        // accumulate the distance traveled thus far
        total_distance_traveled += distance_to_closest;
    }

    // If we get here, we didn't hit anything so just
    // return a background color (black)
    return color;
}

void main() {
  vec3 ray_origin = vec3(0.0, 0.0, -10.0);
  vec2 uv =  gl_FragCoord.xy/u_resolution.xy;
  vec3 ray_direction = vec3(uv, 1.0);
  gl_FragColor = vec4(ray_march(ray_origin, ray_direction), 1.0);
}
