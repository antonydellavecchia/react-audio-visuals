import {
  Audio,
  AudioListener,
  AudioAnalyser,
  DataTexture,
  LuminanceFormat
} from 'three'

export const useActions = (state, dispatch) => {
  const loadAudio = async (mediaElement, fftSize) => {
    console.log(mediaElement)
    let listener = new AudioListener();
    let audio = new Audio( listener );
    let analyser = new AudioAnalyser( audio, fftSize )
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
          value: new DataTexture(
            analyser.data,
            fftSize / 2,
            1,
            LuminanceFormat
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
