export const dist = ({pos1 = {x: 0, y:0, z:0}, pos2 = {x: 0, y:0, z:0}}) => {
  //console.log(pos1, pos2)
  return Math.sqrt(
    Object.keys(pos1).reduce((acc, key) => {
      return acc + Math.pow(pos1[key] - pos2[key], 2)
    }, 0)
  )
}

export const zeroMap = (position) => 0
