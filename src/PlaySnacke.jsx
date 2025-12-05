import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function PlayGame() {
    const [draggedLetters, setDraggedLetters] = useState([]);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showError, setShowError] = useState(false);
    const [returningLetters, setReturningLetters] = useState([]);

    const correctWord = 'GAFAM';

    const handleDrop = (e) => {
        e.preventDefault();
        const letter = e.dataTransfer.getData('letter');

        if (!draggedLetters.includes(letter)) {
            const newLetters = [...draggedLetters, letter];
            setDraggedLetters(newLetters);

            if (newLetters.length === 5) {
                const formedWord = newLetters.map(l => l.charAt(0)).join('');
                const correct = formedWord === correctWord;
                setIsComplete(true);
                setIsCorrect(correct);

                if (!correct) {
                    setShowError(true);
                    setReturningLetters(newLetters);

                    // Retourner chaque lettre progressivement
                    newLetters.forEach((_, index) => {
                        setTimeout(() => {
                            setDraggedLetters(prev => prev.slice(0, -1));
                        }, 300 * (index + 1));
                    });

                    setTimeout(() => {
                        setDraggedLetters([]);
                        setIsComplete(false);
                        setIsCorrect(false);
                        setShowError(false);
                        setReturningLetters([]);
                    }, 300 * (newLetters.length + 1));
                }
            }
        }
    };

    const paragraphs = [
        {
            letter: 'A',
            text: 'Apple impose son écosystème fermé et contrôle strictement son App Store. Cette mainmise sur le marché mobile limite l\'innovation et crée une dépendance des utilisateurs et développeurs.'
        },
        {
            letter: 'G',
            text: 'Google domine la recherche en ligne et collecte des données massives. Sa position monopolistique soulève des questions sur la vie privée et la concurrence équitable dans le numérique.'
        },
        {
            letter: 'M',
            text: 'Microsoft étend son emprise sur l\'informatique professionnelle et éducative. Sa stratégie d\'enfermement propriétaire limite les alternatives libres et renforce la dépendance technologique.'
        },

        {
            letter: 'F',
            text: 'Facebook (Meta) monétise nos données personnelles et influence l\'opinion publique. Ses algorithmes façonnent notre perception du monde et menacent notre autonomie numérique.'
        },
        {
            letter: 'A',
            text: 'Amazon centralise le commerce en ligne et exploite ses vendeurs. Sa logistique agressive et ses pratiques anticoncurrentielles fragilisent les commerces locaux et l\'emploi durable.'
        }
    ];

    const handleDragStart = (e, letter) => {
        e.dataTransfer.setData('letter', letter);
    };



    const handleButtonClick = () => {
        if (isComplete && isCorrect) {
            setShowSnackbar(true);
            setTimeout(() => {
                setShowSnackbar(false);
            }, 3000);
        }
    };

    const resetGame = () => {
        setDraggedLetters([]);
        setIsComplete(false);
        setIsCorrect(false);
        setShowSnackbar(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };



    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
.snes-dropped-letter.returning {
  animation: walkBack 0.3s ease-in-out;
}

@keyframes walkBack {
  0% { 
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  20% { 
    transform: scale(1.1) translateY(-10px) rotate(5deg);
  }
  40% { 
    transform: scale(1) translateY(0) rotate(-5deg);
  }
  60% { 
    transform: scale(0.9) translateY(-5px) rotate(5deg);
  }
  80% { 
    transform: scale(1.05) translateY(0) rotate(-5deg);
  }
  100% { 
    transform: scale(0) translateY(-20px) rotate(15deg);
    opacity: 0;
  }
}

.snes-drop-zone.incorrect {
  border-color: #ff0000;
  background: rgba(255,0,0,0.1);
  animation: shakeZone 0.5s ease-in-out;
}

@keyframes shakeZone {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}
        
        
        
        
        .snes-dropped-letter.error {
          animation: errorBounce 0.5s ease-out, fadeOut 1.5s ease-out 0.5s;
        }
        
        @keyframes errorBounce {
          0% { transform: scale(1); }
          25% { transform: scale(1.2) rotate(10deg); }
          50% { transform: scale(0.9) rotate(-10deg); }
          75% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes fadeOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0); }
        }
        
        .snes-error-message {
          position: fixed;
          top: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(145deg, #f56565, #c53030);
          color: #fff;
          padding: 1.5rem 2rem;
          border: 4px solid #000;
          box-shadow:
            inset -2px -2px 0px rgba(0,0,0,0.5),
            inset 2px 2px 0px rgba(255,255,255,0.3),
            6px 6px 0px rgba(0,0,0,0.8);
          font-size: 0.8rem;
          text-shadow: 2px 2px 0px #000;
          animation: errorSlide 0.5s ease-out, shakeMessage 0.5s ease-in-out 0.5s;
          z-index: 1000;
        }
        
        @keyframes errorSlide {
          0% { transform: translateX(-50%) translateY(-100px); }
          100% { transform: translateX(-50%) translateY(0); }
        }
        
        @keyframes shakeMessage {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-50%) translateY(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(-50%) translateY(5px); }
        }
                
        .snes-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          font-family: 'Press Start 2P', cursive;
          position: relative;
          overflow: hidden;
        }

        .snes-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.15) 3px),
            repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.15) 3px);
          pointer-events: none;
        }

        .snes-title {
  font-size: 2rem;
  color: #fff;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 4px 4px 0px #000, 6px 6px 0px rgba(0,0,0,0.3);
  animation: titleBounce 2s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.snes-snake {
  font-size: 3rem;
  display: inline-block;
  filter: drop-shadow(3px 3px 0px #000);
}

.snes-snake.left {
  animation: snakeWiggleLeft 2s ease-in-out infinite;
}

.snes-snake.right {
  animation: snakeWiggleRight 2s ease-in-out infinite;
  transform: scaleX(-1);
}

@keyframes snakeWiggleLeft {
  0%, 100% {
    transform: translateX(0) translateY(0) rotate(0deg);
  }
  25% {
    transform: translateX(-5px) translateY(-5px) rotate(-10deg);
  }
  50% {
    transform: translateX(0) translateY(-10px) rotate(0deg);
  }
  75% {
    transform: translateX(-5px) translateY(-5px) rotate(10deg);
  }
}

@keyframes snakeWiggleRight {
  0%, 100% {
    transform: scaleX(-1) translateX(0) translateY(0) rotate(0deg);
  }
  25% {
    transform: scaleX(-1) translateX(-5px) translateY(-5px) rotate(-10deg);
  }
  50% {
    transform: scaleX(-1) translateX(0) translateY(-10px) rotate(0deg);
  }
  75% {
    transform: scaleX(-1) translateX(-5px) translateY(-5px) rotate(10deg);
  }
}


        @keyframes titleBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .snes-paragraph {
          background: linear-gradient(145deg, #4a5568, #2d3748);
          border: 4px solid #000;
          border-radius: 0;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow:
            inset -2px -2px 0px rgba(0,0,0,0.5),
            inset 2px 2px 0px rgba(255,255,255,0.1),
            4px 4px 0px rgba(0,0,0,0.5);
          transition: transform 0.2s;
          position: relative;
          z-index: 1;
        }

        .snes-paragraph:hover {
          transform: translate(-2px, -2px);
          box-shadow:
            inset -2px -2px 0px rgba(0,0,0,0.5),
            inset 2px 2px 0px rgba(255,255,255,0.1),
            6px 6px 0px rgba(0,0,0,0.5);
        }

        .snes-letter {
          font-size: 3rem;
          font-weight: bold;
          color: #ffd700;
          text-shadow: 3px 3px 0px #000;
          transition: all 0.3s;
          display: inline-block;
        }

        .snes-letter.active {
          cursor: grab;
          animation: letterFloat 1.5s ease-in-out infinite;
        }

        .snes-letter.active:hover {
          transform: scale(1.2) rotate(-5deg);
          filter: brightness(1.3);
        }

        .snes-letter.active:active {
          cursor: grabbing;
        }

        .snes-letter.disabled {
          color: #4a5568;
          cursor: not-allowed;
          opacity: 0.4;
        }

        @keyframes letterFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .snes-text {
          color: #e2e8f0;
          line-height: 1.8;
          font-size: 0.7rem;
          font-family: 'Courier New', monospace;
        }

        .snes-drop-zone {
          width: 25rem;
          height: 5rem;
          border: 4px dashed #ffd700;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow:
            inset 0 0 20px rgba(0,0,0,0.5),
            0 0 20px rgba(255,215,0,0.3);
          position: relative;
          z-index: 1;
        }

        .snes-drop-zone.complete {
          border-color: #00ff00;
          background: rgba(0,255,0,0.1);
          animation: zonePulse 1s ease-in-out infinite;
        }

        @keyframes zonePulse {
          0%, 100% { box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px rgba(0,255,0,0.3); }
          50% { box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 0 40px rgba(0,255,0,0.6); }
        }

        .snes-dropped-letter {
          font-size: 2rem;
          color: #ffd700;
          text-shadow: 2px 2px 0px #000;
          animation: dropBounce 0.5s ease-out;
        }

        @keyframes dropBounce {
          0% { transform: scale(0) rotate(-180deg); }
          50% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        .snes-button {
          padding: 1rem 2rem;
          font-size: 1rem;
          font-family: 'Press Start 2P', cursive;
          border: 4px solid #000;
          border-radius: 0;
          cursor: pointer;
          transition: all 0.1s;
          position: relative;
          text-transform: uppercase;
          box-shadow:
            inset -2px -2px 0px rgba(0,0,0,0.5),
            inset 2px 2px 0px rgba(255,255,255,0.3),
            4px 4px 0px rgba(0,0,0,0.8);
        }

        .snes-button.active {
          background: linear-gradient(145deg, #48bb78, #38a169);
          color: #fff;
          text-shadow: 2px 2px 0px #000;
        }

        .snes-button.active:hover {
          transform: translate(-2px, -2px);
          box-shadow:
            inset -2px -2px 0px rgba(0,0,0,0.5),
            inset 2px 2px 0px rgba(255,255,255,0.3),
            6px 6px 0px rgba(0,0,0,0.8);
        }

        .snes-button.active:active {
          transform: translate(2px, 2px);
          box-shadow:
            inset -2px -2px 0px rgba(0,0,0,0.5),
            inset 2px 2px 0px rgba(255,255,255,0.3),
            1px 1px 0px rgba(0,0,0,0.8);
        }

        .snes-button.disabled {
          background: #718096;
          color: #4a5568;
          cursor: not-allowed;
          text-shadow: 1px 1px 0px rgba(0,0,0,0.5);
        }

        .snes-reset {
          font-size: 0.6rem;
          color: #ffd700;
          text-decoration: none;
          cursor: pointer;
          text-shadow: 1px 1px 0px #000;
          transition: all 0.2s;
        }

        .snes-reset:hover {
          color: #fff;
          transform: scale(1.1);
        }

        .snes-snackbar {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(145deg, #48bb78, #38a169);
          color: #fff;
          padding: 1.5rem 2rem;
          border: 4px solid #000;
          box-shadow:
            inset -2px -2px 0px rgba(0,0,0,0.5),
            inset 2px 2px 0px rgba(255,255,255,0.3),
            6px 6px 0px rgba(0,0,0,0.8);
          font-size: 0.8rem;
          text-shadow: 2px 2px 0px #000;
          animation: snackbarSlide 0.5s ease-out;
          z-index: 1000;
        }

        @keyframes snackbarSlide {
          0% { transform: translateX(-50%) translateY(100px); }
          100% { transform: translateX(-50%) translateY(0); }
        }

        .snes-icon {
          width: 1.5rem;
          height: 1.5rem;
          filter: drop-shadow(2px 2px 0px #000);
        }
      `}</style>

            <div className="snes-container">
                <div style={{ maxWidth: '64rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <h1 className="snes-title">
                        <span className="snes-snake left">🐍</span>
                        Drag & Drop - Big Tech Challenge!
                        <span className="snes-snake right">🐍</span>
                    </h1>

                    <div style={{ marginBottom: '3rem' }}>
                        {paragraphs.map((para, index) => (
                            <div key={index} className="snes-paragraph">
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                  <span
                      draggable={!draggedLetters.includes(para.letter + index)}
                      onDragStart={(e) => handleDragStart(e, para.letter + index)}
                      className={`snes-letter ${
                          draggedLetters.includes(para.letter + index) ? 'disabled' : 'active'
                      }`}
                  >
                    {para.letter}
                  </span>
                                    <p className="snes-text" style={{ flex: 1, paddingTop: '0.5rem' }}>
                                        {para.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem'}}>
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className={`snes-drop-zone ${isComplete && isCorrect ? 'complete' : ''} ${isComplete && !isCorrect ? 'incorrect' : ''}`}
                        >
                            {draggedLetters.length === 0 ? (
                                <span style={{color: '#718096', fontSize: '0.7rem'}}>
            Glissez les lettres ici
        </span>
                            ) : (
                                draggedLetters.map((letter, index) => (
                                    <span
                                        key={index}
                                        className={`snes-dropped-letter ${
                                            returningLetters.length > 0 && index === draggedLetters.length - 1
                                                ? 'returning'
                                                : ''
                                        }`}
                                    >
                {letter.charAt(0)}
            </span>
                                ))
                            )}
                        </div>


                        <button
                            onClick={handleButtonClick}
                            disabled={!isComplete}
                            className={`snes-button ${isComplete ? 'active' : 'disabled'}`}
                        >
                            {isComplete ? '▶ Découvrir!' : 'Collectez toutes les lettres'}
                        </button>

                        {isComplete && (
                            <span onClick={resetGame} className="snes-reset">
                ↺ Recommencer
              </span>
                        )}
                    </div>
                </div>
            </div>

            {showError && (
                <div className="snes-error-message">
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <span style={{fontSize: '1.5rem'}}>❌</span>
                        <span>Mauvais ordre! Les lettres retournent à leur place...</span>
                    </div>
                </div>
            )}

            {showSnackbar && (
                <div className="snes-snackbar">
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <Check className="snes-icon"/>
                        <span>🎉 Bravo! Vous avez découvert GAFAM!</span>
                    </div>
                </div>
            )}


            {showSnackbar && (
                <div className="snes-snackbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Check className="snes-icon" />
                        <span>🎉 Bravo! Vous avez découvert GAFAM!</span>
                        
                    </div>
                </div>
            )}
        </>
    );
}
