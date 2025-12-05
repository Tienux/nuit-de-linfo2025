import { useState } from 'react'
import './decathlon_part.css'
import questionsData from './questions.json'
import UserRecommendation from './exo_recommendation'

const questions = questionsData.questions

// Variable globale pour stocker les réponses du profil utilisateur
let userSportProfile = {}

function DecathlonQCM() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex
    })
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const finishProfile = () => {
    // Construire le profil
    const profile = {}
    questions.forEach((question, index) => {
      const selectedOption = question.options[selectedAnswers[index]]
      profile[`question_${question.id}`] = {
        question: question.question,
        answer: selectedOption ? selectedOption.text : null,
        scores: selectedOption ? selectedOption.scores : null,
        answerIndex: selectedAnswers[index]
      }
    })
    
    userSportProfile = profile
    localStorage.setItem('sportProfile', JSON.stringify(profile))
    
    console.log('Profil sauvegardé:', userSportProfile)
    setShowResults(true)
  }

  const goToRecommendations = () => {
    setShowRecommendations(true)
  }

  const restartProfile = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setShowRecommendations(false)
    userSportProfile = {}
    localStorage.removeItem('sportProfile')
  }

  // Si on veut voir les recommandations
  if (showRecommendations) {
    return <UserRecommendation userProfile={userSportProfile} onBack={() => setShowRecommendations(false)} />
  }

  if (showResults) {
    return (
      <div className="decathlon-container">
        <div className="decathlon-content">
          <blockquote className="snes-blockquote has-turquoise-bg">
            <h1 className="text-sunshine-color" style={{ fontSize: '2em', marginBottom: '20px' }}>
              🏆 Votre Profil Sportif
            </h1>
            <p className="text-nature-color" style={{ fontSize: '1.1em' }}>
              Profil enregistré avec succès !
            </p>
          </blockquote>

          <div style={{ marginTop: '30px' }}>
            <h2 className="text-ocean-color" style={{ marginBottom: '20px' }}>Récapitulatif de vos réponses :</h2>
            {questions.map((question, index) => (
              <blockquote 
                key={question.id} 
                className="snes-blockquote has-phantom-bg"
                style={{ marginBottom: '15px' }}
              >
                <p className="text-sunshine-color" style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9em' }}>
                  {question.question}
                </p>
                <p className="text-nature-color" style={{ fontSize: '1em' }}>
                  ➤ {question.options[selectedAnswers[index]]?.text || "Non répondu"}
                </p>
              </blockquote>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={goToRecommendations}
              className="snes-button has-nature-color"
              style={{ fontSize: '1.2em', padding: '15px 30px' }}
            >
              🎯 Voir mes exercices personnalisés
            </button>
            <button
              onClick={restartProfile}
              className="snes-button has-ember-color"
              style={{ fontSize: '1em', padding: '12px 24px' }}
            >
              🔄 Refaire le profil
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const isAnswered = selectedAnswers[currentQuestion] !== undefined
  const progress = ((currentQuestion + 1) / questions.length) * 100
  
  return (
    <div className="decathlon-container">
      <div className="decathlon-content">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <h1 className="text-turquoise-color" style={{ margin: 0 }}>
            🏋️ Profil Sportif
          </h1>
          <span className="text-sunshine-color" style={{ fontSize: '1.2em' }}>
            Question {currentQuestion + 1}/{questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            width: '100%', 
            height: '10px', 
            backgroundColor: '#2a2a2a', 
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${progress}%`, 
              height: '100%', 
              backgroundColor: '#4ade80',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* Question */}
        <blockquote className="snes-blockquote has-ocean-bg" style={{ marginBottom: '30px' }}>
          <h2 className="text-sunshine-color" style={{ fontSize: '1.3em', lineHeight: '1.6' }}>
            {currentQ.question}
          </h2>
        </blockquote>

        {/* Options */}
        <ul className="snes-list is-nature-list-color" style={{ marginBottom: '20px' }}>
          {currentQ.options.map((option, index) => (
            <li 
              key={index}
              onClick={() => handleAnswerSelect(index)}
              style={{ 
                cursor: 'pointer',
                padding: '15px',
                margin: '10px 0',
                backgroundColor: selectedAnswers[currentQuestion] === index ? '#22c55e' : 'transparent',
                borderRadius: '5px',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                {String.fromCharCode(65 + index)}.
              </span>
              {option.text}
            </li>
          ))}
        </ul>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="snes-button has-phantom-color"
          >
            ⬅️ Précédent
          </button>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={finishProfile}
                disabled={Object.keys(selectedAnswers).length !== questions.length}
                className="snes-button has-nature-color"
              >
                ✅ Terminer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={!isAnswered}
                className="snes-button has-sunshine-color"
              >
                Suivant ➡️
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Exporter la variable globale pour pouvoir l'utiliser ailleurs
export { userSportProfile }
export default DecathlonQCM