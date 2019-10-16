import * as THREE from 'three'

export const useActions = (state, dispatch) => {
  const loadAudio = async (mediaElement, fftSize) => {
    console.log(mediaElement)
    let listener = new THREE.AudioListener();
    let audio = new THREE.Audio( listener );
    let analyser = new THREE.AudioAnalyser( audio, fftSize )
    await audio.setMediaElementSource(mediaElement);

    dispatch({
      type: "SET_MEDIA",
      payload: mediaElement
    })
    
    dispatch({
      type: "SET_ANALYSER",
      payload: analyser
    })
    
    dispatch({
      type: "SET_UNIFORMS",
      payload: {
        tAudioData: {
          value: new THREE.DataTexture(
            analyser.data,
            fftSize / 2,
            1,
            THREE.LuminanceFormat
          )
        }
      }
    })
  }

  const animate = () => {
    state.analyser.getFrequencyData()
    state.uniforms.tAudioData.value.needsUpdate = true
  }

  return {
    loadAudio,
    animate
  }
}
