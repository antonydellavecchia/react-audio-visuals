import * as THREE from  'three'

export default class Scene {
  constructor(width, height) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)

  }

  setCameraPosition(position) {
    this.camera.position.z = position.z
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  add(objects) {
    objects.forEach(object => {
      this.scene.add(object)
    })
  }

  handleResize(width, height) {
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderScene()
  }
}
