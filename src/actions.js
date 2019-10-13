import * as THREE from 'three'

export const useActions = (state, dispatch) => {
  const actions = {
    loadAudio
  }

  const loadAudio = async (mediaElement) => {
    let listener = new THREE.AudioListener();
    let audio = new THREE.Audio( listener );

    await audio.setMediaElementSource(mediaElement);

    //dispatch
  }

  const getAnalyser = (audio, fftSize) => {
    return new THREE.AudioAnalyser( audio, fftSize );
  }

  const getUniforms = (state) => {
    dispatch({
      type: "SET_UNIFORMS",
      payload: {
        tAudioData: {
          value: new THREE.DataTexture(
            state.analyser.data,
            fftSize / 2,
            1,
            THREE.LuminanceFormat
          )
        }
      }
    })
  }
}
