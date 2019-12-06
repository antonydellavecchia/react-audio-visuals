export default function getConfig(name = '') {
  switch(name){
  case "SQUARE":
    return [0, 1, 2, 3].map(i => {
      let angle = Math.PI * 2 * i / 4
      return {
        x: Math.cos(angle),
        y: Math.sin(angle),
        z: 0
      }
    })

  case "SQUARE_SUSPENSION":
    return [0, 1, 2, 3, 4, 5].map(i => {
      return {
        x: i % 3 == 0 ? Math.pow(-1, i % 2) : 0,
        y: i % 3 == 1 ? Math.pow(-1, i % 2) : 0,
        z: i % 3 == 2 ? Math.pow(-1, i % 2) : 0
      }
    })

  default:
    return {
      x: 0,
      y: 0,
      z: 5
    }
  }
}
