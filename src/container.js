import React, { useRef, useEffect, useState, useContext } from 'react'
import * as THREE from 'three'
import BassShader from './shaders/BassShader.glsl'
import AudioVertexShader from './shaders/AudioVertexShader.glsl'

const initialState = {
  mediaElement: null,
  analyser: null,
  uniforms: null
}

const AudioContext = React.createContext()
const AudioProvider = = ({reducer, initialState, children}) => {
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
)

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
  const mount = useRef(null)
  const [isAnimating, setAnimating] = useState(false)
  const controls = useRef(null)
  
  useEffect(() => {
    new Audio('thedeadfish.wav')

  },[])

  useEffect(() => {
    actions.loadAudio()
  }, [mediaElement])

  useEffect(() => {
    let analyser = getAnalyser(audio, 128)
    let uniforms = getUniforms(analyser)
    if (mediaElement) {
      uniforms = getUniforms()
    }
    let width = mount.current.clientWidth
    let height = mount.current.clientHeight
    let frameId

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
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

    camera.position.z = 4
    scene.add(cube)
    scene.add(torus)
    renderer.setClearColor('#000000')
    renderer.setSize(width, height)

    const renderScene = () => {
      renderer.render(scene, camera)
    }

    const handleResize = () => {
      width = mount.current.clientWidth
      height = mount.current.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderScene()
    }
    
    const animate = () => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      torus.rotation.z += 0.01
      torus.rotation.y += 0.0001

      renderScene()
      analyser.getFrequencyData()
      uniforms.tAudioData.value.needsUpdate = true
      frameId = window.requestAnimationFrame(animate)
    }

    const start = () => {
      if (!frameId) {
        mediaElement.play()
        frameId = requestAnimationFrame(animate)
      }
    }

    const stop = () => {
      cancelAnimationFrame(frameId)
      mediaElement.pause()
      frameId = null
    }

    mount.current.appendChild(renderer.domElement)
    window.addEventListener('resize', handleResize)
    start()

    controls.current = { start, stop }
    
    return () => {
      stop()
      window.removeEventListener('resize', handleResize)
      //mount.current.removeChild(renderer.domElement)

      scene.remove(cube)
      geometry.dispose()
      material.dispose()
    }
  }, [audio])

  useEffect(() => {
    if (isAnimating) {
      controls.current.start()
    } else {
      controls.current.stop()
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
