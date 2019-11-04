import getConfig from '../vector-fields'
import { zeroMap } from '../utils/vector-functions'

export default class VectorField {
  constructor(name) {
    // defaults to null vector field
    const {x = zeroMap, y = zeroMap, z= zeroMap} = getConfig(name)
    this.x = x
    this.y = y
    this.z = z
  }

  flow ({position, stepSize = 0.01}) {
    return {
      x: position.x + this.x(position) * stepSize,
      y: position.y + this.y(position) * stepSize,
      z: position.z + this.z(position) * stepSize
    }
  }
}
