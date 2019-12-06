import * as THREE from 'three'
export default class AudioObject {
  constructor({url, stepSize = 0.01}) {
    let fftSize = 128;
    this.mediaElement = new Audio(url);
    //mediaElement.playbackRate = playbackRate
    let listener = new THREE.AudioListener();
    this.stepSize = stepSize
    this.audio = new THREE.Audio(listener);
    this.audio.hasPlaybackControl = true
    this.audio.setMediaElementSource(this.mediaElement)
    this.analyser = new THREE.AudioAnalyser( this.audio, fftSize );
    this.uniforms = {
      time: {
        value: 0
      },
      tAudioData: {
        value: new THREE.DataTexture(
          this.analyser.data,
          fftSize / 2,
          1,
          THREE.LuminanceFormat
        )
      }
    }
  }
  
  play = () => {
    console.log('play audio')
    this.mediaElement.play();
  }

  pause = () => {
    console.log('pause mediaElement')
    this.mediaElement.pause();
  }

  animate = () => {
    this.analyser.getFrequencyData()
    this.uniforms.time.value += this.stepSize
    this.uniforms.tAudioData.value.needsUpdate = true
  }
}
