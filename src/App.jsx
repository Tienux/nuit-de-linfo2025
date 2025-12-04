import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'

import './App.css'

// Composant 3D animé
function AnimatedSphere() {
  const meshRef = useRef()

  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
  })

  return (
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
            color="#06b6d4"
            attach="material"
            distort={0.5}
            speed={2}
            roughness={0.2}
        />
      </Sphere>
  )
}

function App() {
  const [count, setCount] = useState(0)
  const [showSnake, setShowSnake] = useState(false)
  const navigate = useNavigate()

  return (
      <div className="app-container">
        {/* Header style NES */}
        <header className="nes-container is-dark with-title" style={{margin: '20px auto', maxWidth: '900px'}}>
          <p className="title">Nuit de l'Info 2025</p>
          <h1 style={{marginTop: '10px'}}>
            <i className="nes-icon trophy is-medium"></i>
            Three.js + Retro Gaming
          </h1>
        </header>

        {/* Section 3D */}
        <div className="nes-container is-rounded" style={{margin: '20px auto', maxWidth: '900px', padding: '20px'}}>
          <h2 className="nes-text">Défi Three.js - Sphère 3D Interactive</h2>
          <div style={{height: '400px', width: '100%', marginTop: '20px'}}>
            <Canvas camera={{position: [0, 0, 3]}}>
              <ambientLight intensity={0.5}/>
              <pointLight position={[10, 10, 10]}/>
              <AnimatedSphere/>
              <OrbitControls enableZoom={true}/>
            </Canvas>
          </div>
        </div>

        {/* Section interactive style NES */}
        <div className="nes-container is-rounded" style={{margin: '20px auto', maxWidth: '900px'}}>
          <div className="nes-field">
            <label htmlFor="name_field">Pseudo du joueur</label>
            <input type="text" id="name_field" className="nes-input" placeholder="Entrez votre nom"/>
          </div>

          <div style={{marginTop: '20px'}}>
            <p>Score actuel : <span className="nes-text is-primary">{count}</span></p>
            <button
                className="nes-btn is-success"
                onClick={() => setCount(count + 1)}
                style={{marginRight: '10px'}}
            >
              + 1 Point
            </button>
            <button
                className="nes-btn is-error"
                onClick={() => setCount(0)}
            >
              Reset
            </button>
          </div>

          {/* Easter egg pour le Snake */}
          <div style={{marginTop: '30px'}}>
            <button
                className="nes-btn is-warning"
                onClick={() => setShowSnake(!showSnake)}
            >
              <i className="nes-icon coin is-small"></i>
              Easter Egg Snake
            </button>
          </div>

          {showSnake && (
              <div className="nes-container is-dark" style={{marginTop: '20px'}}>
                <p className="nes-text is-success">
                  🐍 Le Snake sera caché ici ! (à implémenter)
                </p>
                <p style={{fontSize: '0.8em', marginTop: '10px'}}>
                  Tip: Utilisez le Konami Code ↑↑↓↓←→←→BA
                </p>
              </div>
          )}

          {/* Bouton vers PlayGame */}
          <div style={{marginTop: '30px'}}>
            <button
                className="nes-btn is-primary"
                onClick={() => navigate('/play')}
            >
              <i className="nes-icon trophy is-small"></i>
              Jouer au Drag & Drop PLAY!
            </button>
          </div>
        </div>

        {/* Balloons NES */}
        <div style={{textAlign: 'center', margin: '20px'}}>
          <div className="nes-balloon from-left">
            <p>Drag la sphère 3D pour la faire tourner !</p>
          </div>
        </div>

        {/* Footer avec icônes NES */}
        <footer className="nes-container" style={{margin: '20px auto', maxWidth: '900px', textAlign: 'center'}}>
          <p>
            <i className="nes-icon heart is-small"></i>
            Créé pour la Nuit de l'Info
            <i className="nes-icon star is-small"></i>
          </p>
          <div className="nes-badge" style={{marginTop: '10px'}}>
            <span className="is-success">React + Three.js</span>
          </div>
        </footer>
      </div>
  )
}

export default App
