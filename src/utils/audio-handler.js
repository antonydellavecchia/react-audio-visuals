import * as THREE from  'three'
import VertexShader from '../shaders/VertexShader.glsl'
import BassShader from '../shaders/BassShader.glsl'
import RedShader from '../shaders/RedShader.glsl'

export const audioMaterial = ({uniforms = null, vertexShader, fragmentShader = BassShader}) => {
  console.log('uniforms', uniforms)
  return new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    opacity: 0.5
  });
}

export const audioMesh = ({geometry = new THREE.PlaneGeometry(10,10,10),
                           uniforms = null,
                           vertexShader = VertexShader
                          }) => {
  console.log(geometry, uniforms, 'audioMesh')
  return new THREE.Mesh(
    geometry,
    audioMaterial({uniforms: uniforms, vertexShader})
  )
}


