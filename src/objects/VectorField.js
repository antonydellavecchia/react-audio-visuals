import getConfig from '../vector-fields'
import { zeroMap } from '../utils/vector-functions'

export default class VectorField {
  constructor(name, params = [], stepSize = 0.01) {
    // defaults to null vector field
    const {x = zeroMap, y = zeroMap, z= zeroMap} = getConfig(name)
    this.x = x
    this.y = y
    this.z = z

    this.stepSize = stepSize
    this.params = params
  }

  flow ({position}) {
    return {
      x: position.x + this.x(position, this.params) * this.stepSize,
      y: position.y + this.y(position, this.params) * this.stepSize,
      z: position.z + this.z(position, this.params) * this.stepSize
    }
  }
}
