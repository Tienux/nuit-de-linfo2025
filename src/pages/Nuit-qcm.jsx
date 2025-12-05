import React, { useState } from 'react';
import './decathlon_part.css'; 
import questionsData from './questions-nuit.json'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const questions = questionsData.questions;

function QuizNird() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [isAnswerValidated, setIsAnswerValidated] = useState(false);

  // Gestion du clic sur une option
  const handleOptionClick = (index) => {
    if (isAnswerValidated) return; // Empêche de changer après validation
    setSelectedAnswerIndex(index);
  };

  // Validation de la réponse
  const validateAnswer = () => {
    setIsAnswerValidated(true);
    const isCorrect = questions[currentQuestion].options[selectedAnswerIndex].isCorrect;
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  // Passer à la question suivante
  const nextQuestion = () => {
    setSelectedAnswerIndex(null);
    setIsAnswerValidated(false);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswerIndex(null);
    setIsAnswerValidated(false);
  };

  // --- RENDU DES RÉSULTATS ---
  if (showResults) {
    return (
      <div className="qcm-container">
        <div className="qcm-card results-container">
          <h1 className="results-title">Bilan de ta Résistance</h1>
          <div className="score-display">
            {score} / {questions.length}
          </div>
          
          <p className="score-message">
            {score === questions.length 
              ? "🥇 Tu es un véritable Jedi du Numérique Responsable !" 
              : score > 0 
                ? "🥈 Pas mal ! Tu es sur la bonne voie du NIRD." 
                : "🥉 Encore un petit effort pour sortir des griffes des Big Tech."}
          </p>

          <button onClick={() => navigate('/')} className="nav-button" style={{marginRight: '10px'}}>
            Retour Accueil
          </button>
          <button onClick={restartQuiz} className="restart-button">
            Recommencer le défi
          </button>
        </div>
      </div>
    );
  }

  // --- RENDU DU QUIZ ---
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <>
      <Navbar />
      <div className="quiz-container">
      <div className="qcm-card">
        
        {/* Header */}
        <div className="qcm-header">
          <h2 className="qcm-title">Défi NIRD</h2>
          <span className="qcm-counter">Question {currentQuestion + 1}/{questions.length}</span>
        </div>

        {/* Barre de progression */}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question */}
        <div className="question-container">
          <h3 className="question-text">{currentQ.question}</h3>
          
          <div className="options-container">
            {currentQ.options.map((option, index) => {
              // Gestion des classes pour le style (Vert si juste, Rouge si faux)
              let className = "option-button";
              if (selectedAnswerIndex === index) className += " selected";
              
              if (isAnswerValidated) {
                if (option.isCorrect) className += " correct-answer-style"; // Tu devras ajouter ce style CSS
                else if (selectedAnswerIndex === index && !option.isCorrect) className += " wrong-answer-style";
              }

              return (
                <button 
                  key={index} 
                  className={className}
                  onClick={() => handleOptionClick(index)}
                  disabled={isAnswerValidated}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
                  {option.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explication (Feedback) qui s'affiche après validation */}
        {isAnswerValidated && (
          <div className="explanation-container">
            <p className="explanation-text">
              <span className="explanation-label">Info : </span>
              {currentQ.options[selectedAnswerIndex].feedback}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="navigation-container" style={{justifyContent: 'flex-end'}}>
          {!isAnswerValidated ? (
            <button 
              className="next-button" 
              onClick={validateAnswer}
              disabled={selectedAnswerIndex === null}
            >
              Valider
            </button>
          ) : (
            <button className="next-button" onClick={nextQuestion}>
              {currentQuestion === questions.length - 1 ? "Voir les résultats" : "Suivant"}
            </button>
          )}
        </div>

      </div>
    </div>
    </>
  );
}

export default QuizNird;