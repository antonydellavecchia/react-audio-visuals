import * as THREE from  'three'
import VertexShader from '../shaders/VertexShader.glsl'
import FragmentShader from '../shaders/DefaultFragmentShader.glsl'
import RedShader from '../shaders/RedShader.glsl'

export const audioMaterial = ({uniforms = null, vertexShader, fragmentShader}) => {
  return new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  });
}

export const audioMesh = ({
  geometry = new THREE.PlaneGeometry(10,10,10),
  uniforms = null,
  vertexShader = VertexShader,
  fragmentShader = FragmentShader
}) => {

  return new THREE.Mesh(
    geometry,
    audioMaterial({uniforms: uniforms, vertexShader, fragmentShader})
  )
}


