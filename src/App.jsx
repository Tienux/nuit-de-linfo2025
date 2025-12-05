import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import SnakeGame from "./components/SnakeGame";
import "./App.css";

// Composant 3D animé
function AnimatedSphere() {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
  });

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
  );
}

function App() {
  const [count, setCount] = useState(0);
  const [showSnake, setShowSnake] = useState(false);

  // Apparition aléatoire du serpent
  useEffect(() => {
    const randomAppearance = () => {
      // Position aléatoire
      const randomTop = Math.random() * 70 + 10 // Entre 10% et 80%
      const randomLeft = Math.random() * 70 + 10 // Entre 10% et 80%
      
      setSnakePosition({ top: `${randomTop}%`, left: `${randomLeft}%` })
      setShowSnake(true)
      
      // Le serpent disparaît après 5 secondes
      setTimeout(() => {
        setShowSnake(false)
      }, 5000)
    }

    // Première apparition après 3 secondes
    const firstTimeout = setTimeout(randomAppearance, 3000)
    
    // Réapparitions aléatoires toutes les 10-20 secondes
    const interval = setInterval(() => {
      randomAppearance()
    }, Math.random() * 10000 + 10000)

    return () => {
      clearTimeout(firstTimeout)
      clearInterval(interval)
    }
  }, [])

  // Définition les zones cliquables sur los cartos :)
  const zones = [
    {
      id: 'home',
      name: 'Acceuil📔',
      path: '/',
      style: { top: '10%', left: '21%', width: '120px', height: '100px' }
    },
    {
      id: 'A propos',
      name: 'A propos 🤓',
      path: '/A-propos',
      style: { top: '15%', left: '38%', width: '90px', height: '100px' }
    }, {
      id: 'projets',
      name: 'Projets📋',
      path: '/presentation-projet',
      style: { top: '25%', left: '15%', width: '90px', height: '100px' }
    }, {
      id: 'Decathlon',
      name: 'Decathlon🏃',
      path: '/decathlon',
      style: { top: '25%', left: '26%', width: '90px', height: '100px' }
    }, {
      id: 'Easter-egg',
      name: 'Maison du 🐍',
      isEasterEgg: true,
      style: { top: '22%', left: '37%', width: '90px', height: '100px' }
    }
  ]

  const handleZoneClick = (zone) => {
    if (zone.isEasterEgg) {
      setShowEasterEgg(true)
    } else if (zone.path) {
      navigate(zone.path)
    }
  }

  return (
    <div className="app-container">
      {/* Header style NES */}
      <header
        className="nes-container is-dark with-title"
        style={{ margin: "20px auto", maxWidth: "900px" }}
      >
        <p className="title">Nuit de l'Info 2025</p>
        <h1 style={{ marginTop: "10px" }}>
          <i className="nes-icon trophy is-medium"></i>
          Rejoignez la resistance numérique !
        </h1>
      </header>

      {/* Section 3D */}
      <div
        className="nes-container is-rounded"
        style={{ margin: "20px auto", maxWidth: "900px", padding: "20px" }}
      >
        <h2 className="nes-text">Défi Three.js - Sphère 3D Interactive</h2>
        <div style={{ height: "400px", width: "100%", marginTop: "20px" }}>
          <Canvas camera={{ position: [0, 0, 3] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <AnimatedSphere />
            <OrbitControls enableZoom={true} />
          </Canvas>
        </div>
      </div>

      {/* Section interactive style NES */}
      <div
        className="nes-container is-rounded"
        style={{ margin: "20px auto", maxWidth: "900px" }}
      >
        <div className="nes-field">
          <label htmlFor="name_field">Pseudo du joueur</label>
          <input
            type="text"
            id="name_field"
            className="nes-input"
            placeholder="Entrez votre nom"
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <p>
            Score actuel : <span className="nes-text is-primary">{count}</span>
          </p>
          <button
            className="nes-btn is-success"
            onClick={() => setCount(count + 1)}
            style={{ marginRight: "10px" }}
          >
            + 1 Point
          </button>
          <button className="nes-btn is-error" onClick={() => setCount(0)}>
            Reset
          </button>
        </div>

        {/* Easter egg pour le Snake - VERSION AMÉLIORÉE */}
        <div style={{ marginTop: "30px" }}>
          <button
            className="nes-btn is-warning"
            onClick={() => setShowSnake(!showSnake)}
          >
            <i className="nes-icon coin is-small"></i>
            {showSnake ? "Cacher" : "Jouer au"} Snake 🐍
          </button>
        </div>
      </div>

      {/* SECTION SNAKE - Affichage conditionnel amélioré */}
      {showSnake && (
        <div
          className="nes-container is-rounded is-dark"
          style={{
            margin: "20px auto",
            maxWidth: "900px",
            padding: "20px",
            background: "#212529",
          }}
        >
          <h3
            className="nes-text is-warning"
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            🐍 SNAKE GAME - Easter Egg débloqué !
          </h3>
          <SnakeGame />

          {/* Message d'encouragement */}
          <div className="nes-balloon from-right" style={{ marginTop: "20px" }}>
            <p>Nostalgie du Game Boy ? Ce Snake est pour toi ! 🎮</p>
          </div>
        </div>
      )}

      {/* Balloons NES */}
      {!showSnake && (
        <div style={{ textAlign: "center", margin: "20px" }}>
          <div className="nes-balloon from-left">
            <p>
              Drag la sphère 3D pour la faire tourner ! Pssst... y'a un Easter
              Egg 🐍
            </p>
          </div>
        </div>
      )}

      {/* Footer avec icônes NES */}
      <footer
        className="nes-container"
        style={{ margin: "20px auto", maxWidth: "900px", textAlign: "center" }}
      >
        <p>
          <i className="nes-icon heart is-small"></i>
          Fait avec passion pour la Nuit de l'Info 2025
          <i className="nes-icon star is-small"></i>
        </p>
        <div className="nes-badge" style={{ marginTop: "10px" }}>
          <span className="is-success">React + Three.js + Snake</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
