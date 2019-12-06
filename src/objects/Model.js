import * as THREE from 'three'
import AudioVertexShader from '../shaders/AudioVertexShader.glsl'
import VertexShader from '../shaders/VertexShader.glsl'
import { audioMesh } from '../utils'
import VectorField from './VectorField'

export default class Model {
  constructor({
    geometry,
    name,
    position = {x:0, y:0, z:0},
    vertexShader = VertexShader,
    fragmentShader,
    vectorFieldConfig
  }) {
    this.geometry = geometry
    this.name = name
    this.position = position
    this.vertexShader = vertexShader
    this.fragmentShader = fragmentShader
    this.vectorField = new VectorField(vectorFieldConfig)
  }

  initMesh(uniforms) {
    let mesh = audioMesh({
      uniforms,
      geometry: this.geometry,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader
    })

    mesh.name = this.name
    mesh.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    )

    this.mesh = mesh
    return mesh
  }

  animate(stepSize) {
    let curr = this.mesh.position
    let next = this.vectorField.flow({position: curr, stepSize})
    this.mesh.position.set(
      next.x,
      next.y,
      next.z
    )
  }
}
