import React, { useRef, useEffect, useState, useContext, useReducer } from 'react'
import * as THREE from 'three'
import BassShader from './shaders/BassShader.glsl'
import AudioVertexShader from './shaders/AudioVertexShader.glsl'
import { useActions } from './actions'
import Scene from './objects/Scene'

const initialState = {
  mediaElement: null,
  analyser: null,
  uniforms: null
}

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

const reducer = (state, action) => {
  switch (action.type) {
  case "SET_MEDIA":
    return {
      ...state,
      mediaElement: action.payload
    }
  
  case "SET_ANALYSER":
    return {
      ...state,
      analyser: action.payload
    }

  case "SET_UNIFORMS":
    return {
      ...state,
      uniforms: action.payload
    }
  }
}

const Container = () => {
  const {state, actions} = useContext(AudioContext)
  const {analyser, uniforms, mediaElement} = state
  const mount = useRef(null)
  const [isAnimating, setAnimating] = useState(false)
  const controls = useRef(null)
  
  useEffect(() => {
    actions.loadAudio(new Audio('thedeadfish.wav'))
  }, [])

  useEffect(() => {
    if(mediaElement && analyser && uniforms) {
      console.log('geometry')
      let width = mount.current.clientWidth
      let height = mount.current.clientHeight
      let frameId
      let scene = new Scene(width, height)

      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: AudioVertexShader,
        fragmentShader: BassShader,
        transparent: true,
        opacity: 0.5
      } );

      //const torusGeometry = new THREE.TorusGeometry( 5, 30, 16, 100 );
      //const torusGeometry = new THREE.TorusGeometry( 1, 3, 16, 100 );
      const torusGeometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
      
      const torus = new THREE.Mesh(torusGeometry, material)
      const cube = new THREE.Mesh(geometry, material)

      scene.setCameraPosition({x: 0, y: 0, z: 4})
      scene.add([cube, torus])

      const handleResize = () => {
        scene.handleResize(mount.current.clientWidth, mount.current.clientHeight)
      }
      
      const animate = () => {
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01

        //torus.rotation.z += 0.01
        //torus.rotation.y += 0.0001

        

        //analyser.getFrequencyData()

        //uniforms.tAudioData.value.needsUpdate = true
        scene.renderScene()
        frameId = window.requestAnimationFrame(animate)
        actions.animate()
      }

      const start = () => {
        if (!frameId && mediaElement && analyser && uniforms && isAnimating) {
          mediaElement.play()
          frameId = requestAnimationFrame(animate)
        }
      }

      const stop = () => {
        if (mediaElement) {
          cancelAnimationFrame(frameId)
          state.mediaElement.pause()
          frameId = null
        }
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
        geometry.dispose()
        material.dispose()
      }
    }
  }, [isAnimating, mediaElement])

  useEffect(() => {
    console.log(state)
  }, [state])

  useEffect(() => {
    try {
      if (isAnimating) {
        controls.current.start()
      } else {
        controls.current.stop()
      }
    }

    catch {
      console.log('waiting for media')
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
