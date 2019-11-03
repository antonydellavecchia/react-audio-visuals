import React, { useRef, useEffect, useState, useContext, useReducer } from 'react'
import * as THREE from 'three'
import BassShader from './shaders/BassShader.glsl'
import GuitarShader from './shaders/GuitarShader.glsl'
import AudioVertexShader from './shaders/AudioVertexShader.glsl'
import { useActions } from './actions'
import Scene from './objects/Scene'

const AudioContext = React.createContext()
const AudioProvider = ({reducer, initialState, children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const actions = useActions(state, dispatch)
  const value = {
    state: state,
    actions: actions
  }
  
  return(
    <AudioContext.Provider value={value} >
      { children }
    </AudioContext.Provider>
  )
}

const initialState = {
  loading: true
}

const reducer = (state, action) => {
  switch (action.type) {
  case "SET_LOADING":
    return {
      ...state,
      loading: action.payload
    }
  }
}

const Container = () => {
  console.log('container')
  const {state, actions} = useContext(AudioContext)
  const mount = useRef(null)
  const [isAnimating, setAnimating] = useState(false)
  const controls = useRef(null)

  useEffect(() => {
    // initate scene
    let width = mount.current.clientWidth
    let height = mount.current.clientHeight
    let frameId
    let scene = new Scene(width, height)
    scene.loadAudioObject('thedeadfish.wav').then(({uniforms}) => {
      console.log(uniforms)
      scene.loadMeshes([{
        uniforms: uniforms,
        geometry: new THREE.SphereGeometry( 1, 32, 32 ),
        name: 'disco-ball',
        position: {x: 0, y: 0, z: 10},
        vertexShader: AudioVertexShader
      }, {
        uniforms: uniforms,
        geometry: new THREE.PlaneGeometry(50,50,50),
        name: 'floor',
        vertexShader: AudioVertexShader
      }])
    })

    scene.setCameraPosition({x: 0, y: 3, z: 10})
    
    const handleResize = () => {
      scene.handleResize(mount.current.clientWidth, mount.current.clientHeight)
    }
      
    const animate = () => {
      //cube.rotation.x += 0.01
      //cube.rotation.y += 0.01
//
//      torus.rotation.z += 0.01
//      torus.rotation.y += 0.0001

      scene.renderScene()
      frameId = window.requestAnimationFrame(animate)
    }

    const start = () => {
      if (!frameId) {
        scene.play()
        frameId = requestAnimationFrame(animate)
      }
    }

    const stop = () => {
      cancelAnimationFrame(frameId)
      scene.pause()
      frameId = null
    }

    mount.current.appendChild(scene.renderer.domElement)
    window.addEventListener('resize', handleResize)
    //start()

    controls.current = { start, stop }
      
    return () => {
      stop()
      window.removeEventListener('resize', handleResize)
      //mount.current.removeChild(renderer.domElement)

      //scene.remove(cube)
      //geometry.dispose()
      //material.dispose()
    }
  }, [])

  useEffect(() => {
    //console.log(state)
  }, [])

  useEffect(() => {
    try {
      if (isAnimating) {
        controls.current.start()
      } else {
        controls.current.stop()
      }
    }

    catch {
      console.log('waiyting for media')
    }
  }, [isAnimating])
  
  return <div className="container" ref={mount} onClick={() => setAnimating(!isAnimating)} />
}

const AudioContainer = () => {
  return (
    <AudioProvider initialState={initialState} reducer={reducer}>
      <Container/>
    </AudioProvider>
  )
}

export default AudioContainer
