import * as THREE from  'three'
import BassShader from '../shaders/BassShader.glsl'
import GuitarShader from '../shaders/GuitarShader.glsl'
import AudioVertexShader from '../shaders/AudioVertexShader.glsl'

import AudioObject from './AudioObject'
import VectorField from './VectorField'
import { audioMesh } from '../utils'

export default class Scene {
  constructor(width, height) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.cameraVectorField = new VectorField({
      x: (position) => - position.y,
      y: (position) => position.x
    })
    
    console.log(this.scene)
  }

  setCameraPosition({x, y, z}) {
    this.camera.position.z = z
    this.camera.position.x = x
    this.camera.position.y = y
    this.camera.lookAt(0, 0, 0)
    console.log(this.camera)
  }

  cameraAnimate(stepSize) {
    let curr = this.camera.position
    let next = this.cameraVectorField.flow({position: curr, stepSize: stepSize})
    this.setCameraPosition(next)
  }

  renderScene() {
    this.cameraAnimate()
    this.renderer.render(this.scene, this.camera)
    this.audio.animate()
    let discoBall = this.scene.children.find(mesh => mesh.name === 'disco-ball')
    discoBall.rotation.z += 0.01
  }

  play() {
    this.audio.play()
  }

  pause() {
    this.audio.pause()
  }

  add(objects) {
    console.log('adding objects')
    objects.forEach(object => {
      this.scene.add(object)
    })
  }

  async loadAudioObject(url) {
    this.audio = new AudioObject(url)
    console.log(this.audio, 'audio')
    //let mesh1 = audioMesh({uniforms})
    //let mesh2 = audioMesh({ geometry: new THREE.SphereGeometry( 1, 32, 32 ), uniforms})
    //mesh2.position.set(0, 3, 5)
    //meshes = [mesh1, mesh2]

    //meshes.forEach(mesh => { this.scene.add(mesh) })
    return this.audio
  }

  loadMeshes(models) {
    models.forEach(model => {
      const {geometry, uniforms, name, position = {x:0, y:0, z:0}, vertexShader} = model
      console.log(vertexShader)
      let mesh = audioMesh({geometry, uniforms, vertexShader})
      mesh.name = name
      mesh.position.set(position.x, position.y, position.z)
      this.scene.add(mesh)
    })
  }
  
  
  handleResize(width, height) {
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderScene()
  }
}
