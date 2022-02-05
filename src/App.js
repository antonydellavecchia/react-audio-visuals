import React from 'react';
import './App.css';
import Container from './container'

import BrownianShader from './shaders/BrownianShader.glsl'
import DestroySquare from './shaders/DestroySquare.glsl'

function App() {
  return (
    <div>
      <Container backgroundShader={DestroySquare}/>
    </div>
  )
}

export default App;
