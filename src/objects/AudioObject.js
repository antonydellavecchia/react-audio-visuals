export default class AudioObject {
  constructor(playbackRate, models, url, fragmentShader, VertexShader) {
    let fftSize = 128;
    let listener = new THREE.AudioListener();
    let audio = new THREE.Audio( listener );
    this.mediaElement = new Audio(url);
    this.meshes = []
    this.models = models
    this.name = models[0].name
    //this.mediaElement.playbackRate = playbackRate
    audio.setMediaElementSource( this.mediaElement );

    
    this.analyser = new THREE.AudioAnalyser( audio, fftSize );
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

    models.forEach(model => {
      
      let uniforms = {...this.uniforms}

      if (model.frequencies) {
        uniforms.frequency ={
          value: model.frequencies[0]
        }
      }

      console.log(uniforms, this.name)
      let material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: VertexShader,
        fragmentShader: fragmentShader,
        transparent: this.name == 'twinkle',
        opacity: 0.5
      } );

      material.side = THREE.DoubleSide;

      let mesh = new THREE.Mesh( model.geometry, material )
      mesh.name = this.name

      if (model.position) {
        mesh.position.set(
          model.position.x,
          model.position.y,
          model.position.z
        )

      }

      if (model.rotation ) {
        mesh.rotation.set(
          model.rotation[0],
          model.rotation[1],
          model.rotation[2]
        )
      }

      if (model.rotation) {
        mesh.scale.set(
          model.scale,
          model.scale,
          model.scale
        )
      }
      
      this.meshes.push(mesh);
    })
  }

  play = () => {
    console.log('play audio')
    this.mediaElement.play();
  }

  animate = (time) => {
    let frequencyArr = this.analyser.getFrequencyData();
    let sum = 0;
    frequencyArr.forEach(frequency => {
      sum += frequency;
    });
    let average = sum / frequencyArr.length;
    
    
    this.uniforms.tAudioData.value.needsUpdate = true
    this.models.forEach(model => {
      if (model.trajectory) {
        model.animate(time)
      }
    })

    return average
  }
}
