import * as THREE from 'three'
export default class AudioObject {
  constructor(url) {
    let fftSize = 128;
    this.mediaElement = new Audio(url);
    //mediaElement.playbackRate = playbackRate
    let listener = new THREE.AudioListener();
    

    this.audio = new THREE.Audio(listener);
    this.audio.hasPlaybackControl = true
    console.log(this.audio.setMediaElementSource(this.mediaElement), 'media set');
    this.analyser = new THREE.AudioAnalyser( this.audio, fftSize );
    this.uniforms = {
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
    this.uniforms.tAudioData.value.needsUpdate = true
  }
}
