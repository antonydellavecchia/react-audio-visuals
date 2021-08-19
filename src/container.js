import React, { useRef, useEffect, useState, useContext, useReducer } from 'react'
import * as THREE from 'three'
import BassShader from './shaders/BassShader.glsl'
import GuitarShader from './shaders/GuitarShader.glsl'
import AudioVertexShader from './shaders/AudioVertexShader.glsl'
import GridShader from './shaders/GridShader.glsl'
import { useActions } from './actions'
import Scene from './objects/Scene'
import axios from 'axios'
import SoundCloudAudio from 'soundcloud-audio'

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
  const [points, setPoints] = useState([{x:0, y: 0, z:0}])
  const [isAnimating, setAnimating] = useState(false)
  const controls = useRef(null)
  
  useEffect(() => {

  }, [])
  
  useEffect(() => {
    console.log(points)
    if (!points) return
    
    // initate scene
    let width = mount.current.clientWidth
    let height = mount.current.clientHeight
    let frameId
    let models = points.map((point, index) => {
      return {
        geometry: new THREE.SphereGeometry(50, 50, 50),
        name: `disco-ball-${index}`,
        position: point,
        vectorFieldConfig: "LORENZ"
      }
    })

    models.push({
      geometry: new THREE.TorusGeometry(25, 25, 25),
      name: 'floor',
      position: {x: 0, y:0, z: -1},
      vertexShader: AudioVertexShader,
      fragmentShader: GridShader
    })
    
    let scene = new Scene({
      width,
      height,
      models: models
    })

    let scStream = new SoundCloudAudio('')
    scStream.resolve('https://soundcloud.com/thebloodymoustache/sleepy-candies/s-XsBcp', function (track){
      console.log("this is the youtube track", track)
    })
    
    scene.loadAudioObject({url: 'thedeadfish.mp3'}).then(({uniforms}) => {
      scene.loadMeshes(uniforms)
    })
    
    const handleResize = () => {
      scene.handleResize(mount.current.clientWidth, mount.current.clientHeight)
    }
      
    const animate = () => {
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
  }, [points])

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
