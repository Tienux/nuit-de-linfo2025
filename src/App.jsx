import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import Apropos from './pages/A-propos.jsx'
import DecathlonQCM from './decatchlon/decacthlon_part.jsx'
import PresentationProjet from './pages/PresentationProjet'
import QuizNird from './pages/Nuit-qcm'
import PlayGame from './PlaySnacke.jsx'
import './App.css'
import Home from './pages/Home.jsx'

function AppContent() {
  const navigate = useNavigate()
  const [hoveredZone, setHoveredZone] = useState(null)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [snakePosition, setSnakePosition] = useState({ top: '50%', left: '50%' })
  const [showSnake, setShowSnake] = useState(false)

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
      name: 'Home📔',
      path: '/home',
      style: { top: '10%', left: '21%', width: '120px', height: '100px' }
    },
    {
      id: 'A propos',
      name: 'A propos 🤓',
      path: '/a-propos',
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
      <header className="nes-container is-dark with-title" style={{ margin: '20px auto', maxWidth: '900px' }}>
        <title>Nuit de l'Info 2025</title>
        <link rel="shortcut icon" href="images/asterix.svg" type="image/svg+xml" />
        <nav onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src={`${import.meta.env.BASE_URL}images/asterix.png`} alt="asterix" style={{width: 100}}/>
        </nav>
        <p className="title">Nuit de l'Info 2025</p>
        <h1 style={{ marginTop: '10px' }}>
          <i className="nes-icon trophy is-medium"></i>
          Rejoignez la resistance numérique !
        </h1>
      </header>

      {/* Contenu des pages */}
  

      {/* Carte interactive commune */}
      <section className="nes-container is-rounded" style={{ margin: '20px auto', maxWidth: '900px' }}>
        <h2>🗺️ Carte de la résistance !</h2>
        <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
          Cliquez sur les zones de la carte pour découvrir les différentes sections.
        </p>
        
        <div style={{ 
          position: 'relative', 
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          border: '4px solid #212529',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <img 
            src={`${import.meta.env.BASE_URL}images/asterix_carte.png`}
            alt="Carte Asterix"
            style={{ 
              width: '100%', 
              height: 'auto',
              display: 'block'
            }}
          />
          
          {/* Zones cliquables */}
          {zones.map(zone => (
            <div
              key={zone.id}
              onClick={() => handleZoneClick(zone)}
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
              style={{
                position: 'absolute',
                ...zone.style,
                cursor: 'pointer',
                backgroundColor: hoveredZone === zone.id ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.2)',
                border: hoveredZone === zone.id ? '3px solid #3b82f6' : '2px solid transparent',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: hoveredZone === zone.id ? 'scale(1.05)' : 'scale(1)',
                zIndex: hoveredZone === zone.id ? 10 : 1
              }}
            >
              {hoveredZone === zone.id && (
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  {zone.name}
                </div>
              )}
            </div>
          ))}

          {/* Serpent caché Easter Egg */}
          {showSnake && (
            <img 
              src={`${import.meta.env.BASE_URL}images/snake.png`}
              alt="Serpent caché"
              onClick={() => navigate('/snake')}
              style={{
                position: 'absolute',
                top: snakePosition.top,
                left: snakePosition.left,
                width: '50px',
                height: '50px',
                cursor: 'pointer',
                zIndex: 100,
                animation: 'pulse 1s infinite',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          )}
        </div>
      </section>

      {/* Pop-up Easter Egg */}
      {showEasterEgg && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="nes-container is-rounded with-title" style={{ 
            maxWidth: '500px', 
            backgroundColor: 'white',
            position: 'relative',
            color: '#212529'
          }}>
            <p className="title" style={{ color: '#212529' }}>🐍 Indice Easter Egg</p>
            <button 
              className="nes-btn is-error" 
              style={{ position: 'absolute', top: '10px', right: '10px' }}
              onClick={() => setShowEasterEgg(false)}
            >
              X
            </button>
            <div style={{ marginTop: '20px' }}>
              <p style={{ lineHeight: '1.6', marginBottom: '15px', color: '#212529' }}>
                <strong>Indice mystérieux :</strong>
              </p>
              <div className="nes-container is-dark">
                <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'white' }}>
                  "Un serpent se cache quelque part sur cette carte... 
                  Observez bien chaque recoin du village gaulois.
                  Il apparaît et disparaît mystérieusement... Soyez rapide ! 🐍"
                </p>
              </div>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <i className="nes-icon coin is-medium"></i>
                <p style={{ marginTop: '10px', fontSize: '12px', color: '#212529' }}>
                  Bonne chance, aventurier ! 🎮
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="nes-container" style={{ textAlign: 'center', margin: '20px auto', maxWidth: '900px' }}>
        <p>
          <i className="nes-icon heart is-small"></i>
          Fait avec passion pour la Nuit de l'Info 2025
          <i className="nes-icon star is-small"></i>
        </p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path='/nuit-de-linfo2025/' element={<AppContent />} />
        <Route path="/snake" element={<PlayGame />} />
        <Route path="/a-propos" element={<Apropos />} />
        <Route path="/decathlon" element={<DecathlonQCM />} />
        <Route path="/presentation-projet" element={<PresentationProjet />} />
        <Route path="/nuit-qcm" element={<QuizNird />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App