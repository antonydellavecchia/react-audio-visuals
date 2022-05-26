import React from 'react';
import './App.css';
import Container from './container'

import BrownianShader from './shaders/BrownianShader.glsl'
import RayMarching from './shaders/ray-marching.glsl'

function App() {
  return (
    <div>
      <Container backgroundShader={RayMarching}/>
    </div>
  )
}

export default App;
