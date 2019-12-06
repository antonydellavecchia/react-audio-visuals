import * as THREE from  'three'
import VertexShader from '../shaders/VertexShader.glsl'
import BassShader from '../shaders/BassShader.glsl'
import RedShader from '../shaders/RedShader.glsl'

export const audioMaterial = ({uniforms = null, vertexShader, fragmentShader}) => {
  console.log('uniforms', uniforms)
  return new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  });
}

export const audioMesh = ({geometry = new THREE.PlaneGeometry(10,10,10),
                           uniforms = null,
                           vertexShader = VertexShader,
                           fragmentShader = BassShader
                          }) => {

  return new THREE.Mesh(
    geometry,
    audioMaterial({uniforms: uniforms, vertexShader, fragmentShader})
  )
}


