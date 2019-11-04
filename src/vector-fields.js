import { dist, zeroMap } from './utils/vector-functions'

export default function getConfig(name) {
  switch(name) {
  case "CIRCLEXY_SINEZ":
    return {
      x: (position) => - position.y,
      y: (position) => position.x,
      z: (position) => {
        let radius = dist({pos1: position})
        let argument = position.y / radius
        let externalDerivative = Math.cos(Math.PI * Math.asin(argument)) * Math.PI / (Math.sqrt(1 - Math.pow(argument, 2)))
        let derivative = externalDerivative * position.x

        return derivative
      }
    }

  case "CIRCLEXZ":
    return {
      x: (position) => position.z,
      z: (position) => - position.x
    }

  default:
    return {
      x: zeroMap, 
      y: zeroMap, 
      z: zeroMap
    }
  }
}

