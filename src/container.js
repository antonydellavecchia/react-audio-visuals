import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import BassShader from './shaders/BassShader.glsl'
import AudioVertexShader from './shaders/AudioVertexShader.glsl'

export const Container = () => {
  const mount = useRef(null)
  const [isAnimating, setAnimating] = useState(true)
  const controls = useRef(null)

  useEffect(() => {
    let fftSize = 128;
    let listener = new THREE.AudioListener();
    let audio = new THREE.Audio( listener );
    let mediaElement = new Audio('~/music/thedeadfish.wav');
    audio.setMediaElementSource(mediaElement);

    
    let analyser = new THREE.AudioAnalyser( audio, fftSize );
    let uniforms = {
      tAudioData: {
        value: new THREE.DataTexture(
          analyser.data,
          fftSize / 2,
          1,
          THREE.LuminanceFormat
        )
      }
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

    const cube = new THREE.Mesh(geometry, material)

    camera.position.z = 4
    scene.add(cube)
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

      renderScene()
      frameId = window.requestAnimationFrame(animate)
      uniforms.tAudioData.value.needsUpdate = true
    }

    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate)
        mediaElement.play()
      }
    }

    const stop = () => {
      cancelAnimationFrame(frameId)
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
  }, [])

  useEffect(() => {
    if (isAnimating) {
      controls.current.start()
    } else {
      controls.current.stop()
    }
  }, [isAnimating])
  
  return <div className="container" ref={mount} onClick={() => setAnimating(!isAnimating)} />
}
