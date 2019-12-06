import getConfig from '../camera-configs'
import VectorField from './VectorField'

export default class CameraGroup {
  constructor({name, focus = {x: 0, y:0, z:0}, vectorField}, dist = 5) {
    // defaults to null vector field
    let directions = getConfig(name)
    this.config = name
    this.dist = dist
    this.positions = directions.map(direction => {
      return {
        x: dist * direction.x + focus.x,
        y: dist * direction.y + focus.y,
        z: dist * direction.z + focus.z
      }
    })
    this.focus = focus
    this.number = 0
    this.vectorField = new VectorField(vectorField)
    console.log(this.positions)
  }

  flow(stepSize) {
    let initialFocus = this.focus
    let finalFocus = this.vectorField.flow({position: initialFocus, stepSize})

    this.positions = this.positions.map(position => {
      return {
        x: position.x + finalFocus.x - initialFocus.x,
        y: position.y + finalFocus.y - initialFocus.y,
        z: position.z + finalFocus.z - initialFocus.z
      }
    })

    this.focus = finalFocus
  }

  resetFocus(point) {
    let directions = getConfig(this.config)
    this.positions = directions.map(direction => {
      return {
        x: this.dist * direction.x + point.x,
        y: this.dist * direction.y + point.y,
        z: this.dist * direction.z + point.z
      }
    })
    this.focus = point
  }

  follow(point, vectorField) {
    this.resetFocus(point)
    this.vectorField = vectorField
  }
  
  activePosition() {
    return this.positions[this.number]
  }

  switch(number) {
    this.number = number
  }

  next() {
    this.number = (this.number + 1) % this.positions.length
  }

  setVectorField(vectorField) {
    this.vectorField = vectorField
  }
}
