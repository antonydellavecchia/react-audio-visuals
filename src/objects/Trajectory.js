const zeroMap = (position) => 0

export default class VectorField {
  constructor({x = zeroMap, y = zeroMap, z = zeroMap}) {
    // defaults to null vector field
    this.x = x
    this.y = y
    this.z = z
  }
  
  flow ({position, stepSize = 0.01}) => {
    return {
      x: position.x + this.x(position) * stepSize,
      y: position.y + this.y(position) * stepSize,
      z: position.z + this.z(position) * stepSize
    }
  }
}
