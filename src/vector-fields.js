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
      x: (position) => rho * (position.y - position.x),
      y: (position) => position.x * (rho - position.z) - position.y,
      z: (position) => position.x * position.y - beta * position.z
    }

  default:
    return {
      x: zeroMap, 
      y: zeroMap, 
      z: zeroMap
    }
  }
}

