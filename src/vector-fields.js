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
        let externalDerivative = Math.cos(Math.asin(argument)) / (Math.sqrt(1 - Math.pow(argument, 2)))
        let derivative = externalDerivative * position.x

        return derivative
      }
    }

  case "CIRCLEXZ":
    return {
      x: (position) => position.z,
      z: (position) => - position.x
    }


  case "RANDOM":
    return {
      x: (position) => position.x * position.z,
      y: (position) => - position.z,
      z: (position) => - position.z
    }

  case "LORENZ":
    let sigma = 10
    let beta = 8 / 3
    let rho = 28

    return {
      x: (position, params) => params[0] ? params[0] * (position.y - position.x) : sigma * (position.y - position.x),
      y: (position, params) => params[1] ? position.x * (params[0] - position.z) - position.y : position.x * (rho - position.z) - position.y,
      z: (position, params) => params[2] ? position.x * position.y - params[2] * position.z : position.x * position.y - beta * position.z
    }

  default:
    return {
      x: zeroMap, 
      y: zeroMap, 
      z: zeroMap
    }
  }
}

