import { useState, useEffect } from 'react'
import './exo_recommendation.css'
import exercisesData from './exercises.json'

function UserRecommendation({ userProfile }) {
  const [recommendedExercises, setRecommendedExercises] = useState([])
  const [selectedExercise, setSelectedExercise] = useState(null)

  useEffect(() => {
    if (userProfile && Object.keys(userProfile).length > 0) {
      const exercises = getRecommendedExercises(userProfile)
      setRecommendedExercises(exercises)
    }
  }, [userProfile])

  const getRecommendedExercises = (profile) => {
    const exercises = exercisesData.exercises || []
    
    // Extraire les infos du profil utilisateur
    const goal = profile.question_1?.answer || ''
    const frequency = profile.question_2?.answer || ''
    const equipment = profile.question_3?.answer || ''
    const duration = profile.question_4?.answerIndex || 0
    const targetArea = profile.question_5?.answer || ''
    const injuries = profile.question_6?.answer || ''
    
    // Mapper les durées (index vers minutes)
    const durationMap = [15, 30, 45, 60]
    const userDuration = durationMap[duration]
    
    // Filtrer les exercices
    let filtered = exercises.filter(ex => {
      // Vérifier l'objectif
      if (ex.goal && !ex.goal.some(g => goal.toLowerCase().includes(g.toLowerCase()))) {
        return false
      }
      
      // Vérifier l'équipement
      if (ex.equipment) {
        const hasEquipment = ex.equipment.some(eq => 
          equipment.toLowerCase().includes(eq.toLowerCase()) ||
          (equipment.includes('Rien') && eq === 'bodyweight') ||
          (equipment.includes('tapis') && (eq === 'mat' || eq === 'bodyweight'))
        )
        if (!hasEquipment) return false
      }
      
      // Vérifier la durée
      if (ex.duration && ex.duration > userDuration) {
        return false
      }
      
      // Vérifier la zone ciblée
      if (ex.targetArea) {
        const matchesArea = ex.targetArea.some(area => {
          if (targetArea.includes('haut')) return area === 'upper'
          if (targetArea.includes('bas')) return area === 'lower'
          if (targetArea.includes('abdominale')) return area === 'core'
          if (targetArea.includes('Tout')) return area === 'fullbody'
          return false
        })
        if (!matchesArea) return false
      }
      
      // Éviter si blessure
      if (ex.avoidIf && injuries !== 'Non, je suis en pleine forme') {
        const hasConflict = ex.avoidIf.some(avoid => {
          if (injuries.includes('genoux')) return avoid === 'knees'
          if (injuries.includes('dos')) return avoid === 'back'
          if (injuries.includes('poignets')) return avoid === 'wrists'
          return false
        })
        if (hasConflict) return false
      }
      
      return true
    })
    
    // Si pas assez de résultats, être plus permissif
    if (filtered.length < 3) {
      filtered = exercises.filter(ex => {
        if (ex.duration && ex.duration > userDuration) return false
        if (ex.avoidIf && injuries !== 'Non, je suis en pleine forme') {
          const hasConflict = ex.avoidIf.some(avoid => {
            if (injuries.includes('genoux')) return avoid === 'knees'
            if (injuries.includes('dos')) return avoid === 'back'
            if (injuries.includes('poignets')) return avoid === 'wrists'
            return false
          })
          if (hasConflict) return false
        }
        return true
      })
    }
    
    return filtered.slice(0, 6)
  }

  if (!userProfile || Object.keys(userProfile).length === 0) {
    return (
      <div className="recommendation-container">
        <blockquote className="snes-blockquote has-ember-bg">
          <p className="text-sunshine-color">
            ⚠️ Aucun profil utilisateur trouvé. Complétez d'abord le questionnaire.
          </p>
        </blockquote>
      </div>
    )
  }

  return (
    <div className="recommendation-container">
      <div className="recommendation-content">
        {/* Header */}
        <blockquote className="snes-blockquote has-turquoise-bg">
          <h1 className="text-sunshine-color" style={{ fontSize: '2em', marginBottom: '10px' }}>
            💪 Tes exercices personnalisés
          </h1>
          <p className="text-nature-color">
            Basé sur ton profil, voici {recommendedExercises.length} exercices adaptés pour toi !
          </p>
        </blockquote>

        {/* Résumé du profil */}
        <div style={{ marginTop: '30px', marginBottom: '30px' }}>
          <h2 className="text-ocean-color" style={{ marginBottom: '15px' }}>
            📋 Ton profil en bref :
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <span className="profile-badge has-plumber-color">
              🎯 {userProfile.question_1?.answer}
            </span>
            <span className="profile-badge has-nature-color">
              🏋️ {userProfile.question_2?.answer}
            </span>
            <span className="profile-badge has-turquoise-color">
              🛠️ {userProfile.question_3?.answer}
            </span>
            <span className="profile-badge has-sunshine-color">
              ⏱️ {userProfile.question_4?.answer}
            </span>
            <span className="profile-badge has-phantom-color">
              🎪 {userProfile.question_5?.answer}
            </span>
            {userProfile.question_6?.answer !== 'Non, je suis en pleine forme' && (
              <span className="profile-badge has-ember-color">
                ⚠️ {userProfile.question_6?.answer}
              </span>
            )}
          </div>
        </div>

        {/* Liste des exercices */}
        {recommendedExercises.length === 0 ? (
          <blockquote className="snes-blockquote has-ember-bg">
            <p className="text-sunshine-color">
              😕 Aucun exercice ne correspond exactement à ton profil. Ton collègue doit ajouter plus d'exercices dans exercises.json !
            </p>
          </blockquote>
        ) : (
          <div className="exercises-grid">
            {recommendedExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="exercise-card"
                onClick={() => setSelectedExercise(exercise)}
              >
                <h3 className="text-turquoise-color" style={{ marginBottom: '10px' }}>
                  {exercise.name}
                </h3>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <span className="exercise-tag">⏱️ {exercise.duration} min</span>
                  <span className="exercise-tag">💪 {exercise.difficulty || 'Débutant'}</span>
                  {exercise.equipment && (
                    <span className="exercise-tag">🛠️ {exercise.equipment[0]}</span>
                  )}
                </div>
                <p style={{ fontSize: '0.9em', color: '#aaa', marginBottom: '10px' }}>
                  {exercise.reps}
                </p>
                <button className="snes-button has-nature-color" style={{ width: '100%' }}>
                  Voir les détails
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal détails exercice */}
        {selectedExercise && (
          <div className="exercise-modal" onClick={() => setSelectedExercise(null)}>
            <div className="exercise-modal-content" onClick={(e) => e.stopPropagation()}>
              <blockquote className="snes-blockquote has-ocean-bg">
                <h2 className="text-sunshine-color" style={{ fontSize: '1.8em', marginBottom: '20px' }}>
                  {selectedExercise.name}
                </h2>

                {/* Instructions */}
                <h3 className="text-turquoise-color" style={{ marginTop: '20px', marginBottom: '10px' }}>
                  📋 Instructions :
                </h3>
                <ul className="snes-list is-nature-list-color">
                  {selectedExercise.instructions?.map((step, i) => (
                    <li key={i} style={{ marginBottom: '8px' }}>{step}</li>
                  ))}
                </ul>

                {/* Erreurs courantes */}
                {selectedExercise.mistakes && selectedExercise.mistakes.length > 0 && (
                  <>
                    <h3 className="text-ember-color" style={{ marginTop: '20px', marginBottom: '10px' }}>
                      ⚠️ Erreurs courantes :
                    </h3>
                    {selectedExercise.mistakes.map((mistake, i) => (
                      <p key={i} style={{ fontSize: '0.95em', marginBottom: '5px' }}>{mistake}</p>
                    ))}
                  </>
                )}

                {/* Conseils */}
                {selectedExercise.tips && selectedExercise.tips.length > 0 && (
                  <>
                    <h3 className="text-nature-color" style={{ marginTop: '20px', marginBottom: '10px' }}>
                      ✅ Conseils :
                    </h3>
                    {selectedExercise.tips.map((tip, i) => (
                      <p key={i} style={{ fontSize: '0.95em', marginBottom: '5px' }}>{tip}</p>
                    ))}
                  </>
                )}

                {/* Répétitions */}
                <p className="text-plumber-color" style={{ marginTop: '20px', fontSize: '1.2em', fontWeight: 'bold' }}>
                  🔢 {selectedExercise.reps}
                </p>

                <button
                  onClick={() => setSelectedExercise(null)}
                  className="snes-button has-phantom-color"
                  style={{ marginTop: '30px', width: '100%' }}
                >
                  Fermer
                </button>
              </blockquote>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserRecommendation