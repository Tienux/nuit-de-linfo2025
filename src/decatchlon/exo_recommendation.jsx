import { useState, useEffect } from 'react'
import './exo_recommendation.css'
import programmesData from './exercises.json'

// Import des images des exercices
import squatImg from '../assets/squat.png'
import pompeGenouImg from '../assets/pompe_genou.png'
import plancheAbdoImg from '../assets/plance_abdo.png'
import burpeesImg from '../assets/burpees.png'
import climberImg from '../assets/climber.png'
import sautImg from '../assets/saut.png'
import chienImg from '../assets/chien.png'
import postureImg from '../assets/posture.png'
import etirementImg from '../assets/etirement.png'

// Mapping des noms d'images vers les imports
const imageMap = {
  'squat.png': squatImg,
  'pompe_genou.png': pompeGenouImg,
  'plance_abdo.png': plancheAbdoImg,
  'burpees.png': burpeesImg,
  'climber.png': climberImg,
  'saut.png': sautImg,
  'chien.png': chienImg,
  'posture.png': postureImg,
  'etirement.png': etirementImg
}

function UserRecommendation({ userProfile, onBack }) {
  const [recommendedProgramme, setRecommendedProgramme] = useState(null)
  const [selectedMovement, setSelectedMovement] = useState(null)

  useEffect(() => {
    if (userProfile && Object.keys(userProfile).length > 0) {
      const programme = getRecommendedProgramme(userProfile)
      setRecommendedProgramme(programme)
    }
  }, [userProfile])

  const getRecommendedProgramme = (profile) => {
    // Calculer les scores pour chaque programme
    const scores = { p1: 0, p2: 0, p3: 0 }
    
    // Parcourir toutes les réponses du profil
    Object.values(profile).forEach(answer => {
      if (answer.scores) {
        // Ajouter les scores de cette réponse
        Object.entries(answer.scores).forEach(([prog, points]) => {
          scores[prog] += points
        })
      }
    })
    
    console.log('📊 Scores calculés:', scores)
    
    // Trouver le programme avec le score le plus élevé
    const bestProgrammeId = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])[0][0]
    
    console.log('🏆 Meilleur programme:', bestProgrammeId)
    
    // Retourner le programme correspondant
    return programmesData.programmes[bestProgrammeId]
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

  if (!recommendedProgramme) {
    return (
      <div className="recommendation-container">
        <blockquote className="snes-blockquote has-ember-bg">
          <p className="text-sunshine-color">
            ⚠️ Impossible de déterminer un programme adapté.
          </p>
        </blockquote>
      </div>
    )
  }

  return (
    <div className="recommendation-container">
      <div className="recommendation-content">
        {/* Header avec nom du programme */}
        <blockquote className="snes-blockquote has-turquoise-bg">
          <h1 className="text-sunshine-color" style={{ fontSize: '2em', marginBottom: '10px' }}>
            🏆 {recommendedProgramme.nom}
          </h1>
          <p className="text-nature-color" style={{ fontSize: '1.1em' }}>
            {recommendedProgramme.objectif_principal}
          </p>
          <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span className="profile-badge has-plumber-color">
              📊 Niveau: {recommendedProgramme.niveau_recommandé}
            </span>
            <span className="profile-badge has-nature-color">
              ⏱️ {recommendedProgramme.duree_totale}
            </span>
            <span className="profile-badge has-sunshine-color">
              📅 {recommendedProgramme.frequence_recommandee}
            </span>
          </div>
        </blockquote>

        {/* Structure de la séance */}
        <div style={{ marginTop: '30px' }}>
          <h2 className="text-ocean-color" style={{ marginBottom: '15px' }}>
            📋 Structure de la séance :
          </h2>
          <blockquote className="snes-blockquote has-phantom-bg">
            <ul className="snes-list is-nature-list-color">
              {recommendedProgramme.structure_seance.map((etape, i) => (
                <li key={i} style={{ marginBottom: '8px', fontSize: '0.95em' }}>
                  {etape}
                </li>
              ))}
            </ul>
          </blockquote>
        </div>

        {/* Liste des mouvements */}
        <div style={{ marginTop: '30px' }}>
          <h2 className="text-ocean-color" style={{ marginBottom: '15px' }}>
            💪 Les mouvements détaillés :
          </h2>
          <div className="exercises-grid">
            {recommendedProgramme.mouvements.map((movement) => (
              <div
                key={movement.id}
                className="exercise-card"
                onClick={() => setSelectedMovement(movement)}
              >
                {movement.image && imageMap[movement.image] && (
                  <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                    <img 
                      src={imageMap[movement.image]} 
                      alt={movement.nom}
                      style={{ 
                        width: '100%', 
                        maxWidth: '200px', 
                        height: '120px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        border: '2px solid #0891b2'
                      }}
                    />
                  </div>
                )}
                <h3 className="text-turquoise-color" style={{ marginBottom: '10px' }}>
                  {movement.nom}
                </h3>
                <p style={{ fontSize: '0.9em', color: '#aaa', marginBottom: '15px' }}>
                  {movement.description}
                </p>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <span className="exercise-tag">
                    📊 Difficulté {movement.difficulte}/5
                  </span>
                  {movement.series && (
                    <span className="exercise-tag">
                      🔢 {movement.series} séries
                    </span>
                  )}
                  {movement.repetitions && (
                    <span className="exercise-tag">
                      ✖️ {movement.repetitions} reps
                    </span>
                  )}
                  {movement.temps_maintenu && (
                    <span className="exercise-tag">
                      ⏱️ {movement.temps_maintenu}
                    </span>
                  )}
                </div>
                <button className="snes-button has-nature-color" style={{ width: '100%', fontSize: '0.9em' }}>
                  Voir les instructions
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton retour */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          {onBack && (
            <button
              onClick={onBack}
              className="snes-button has-phantom-color"
              style={{ fontSize: '1em', padding: '12px 24px', marginRight: '10px' }}
            >
              ⬅️ Retour au profil
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="snes-button has-ember-color"
            style={{ fontSize: '1em', padding: '12px 24px' }}
          >
            🔄 Recommencer
          </button>
        </div>

        {/* Modal détails mouvement */}
        {selectedMovement && (
          <div className="exercise-modal" onClick={() => setSelectedMovement(null)}>
            <div className="exercise-modal-content" onClick={(e) => e.stopPropagation()}>
              <blockquote className="snes-blockquote has-ocean-bg">
                {selectedMovement.image && imageMap[selectedMovement.image] && (
                  <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <img 
                      src={imageMap[selectedMovement.image]} 
                      alt={selectedMovement.nom}
                      style={{ 
                        width: '100%', 
                        maxWidth: '300px', 
                        height: '200px', 
                        objectFit: 'cover', 
                        borderRadius: '12px',
                        border: '3px solid #fbbf24'
                      }}
                    />
                  </div>
                )}
                <h2 className="text-sunshine-color" style={{ fontSize: '1.8em', marginBottom: '10px' }}>
                  {selectedMovement.nom}
                </h2>
                <p style={{ fontSize: '1em', marginBottom: '20px', color: '#aaa' }}>
                  {selectedMovement.description}
                </p>

                {/* Informations pratiques */}
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {selectedMovement.series && (
                    <span className="profile-badge has-nature-color">
                      🔢 {selectedMovement.series} séries
                    </span>
                  )}
                  {selectedMovement.repetitions && (
                    <span className="profile-badge has-plumber-color">
                      ✖️ {selectedMovement.repetitions} répétitions
                    </span>
                  )}
                  {selectedMovement.temps_maintenu && (
                    <span className="profile-badge has-sunshine-color">
                      ⏱️ {selectedMovement.temps_maintenu}
                    </span>
                  )}
                  {selectedMovement.temps_repos && (
                    <span className="profile-badge has-turquoise-color">
                      😮‍💨 Repos: {selectedMovement.temps_repos}
                    </span>
                  )}
                </div>

                {/* Muscles ciblés */}
                {selectedMovement.muscles_cibles && (
                  <div style={{ marginBottom: '20px' }}>
                    <h3 className="text-turquoise-color" style={{ marginBottom: '10px' }}>
                      🎯 Muscles ciblés :
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {selectedMovement.muscles_cibles.map((muscle, i) => (
                        <span key={i} className="exercise-tag" style={{ backgroundColor: '#22c55e', color: '#fff' }}>
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructions détaillées */}
                <h3 className="text-nature-color" style={{ marginTop: '20px', marginBottom: '10px' }}>
                  📋 Instructions pas à pas :
                </h3>
                <ul className="snes-list is-nature-list-color">
                  {selectedMovement.instructions?.map((step, i) => (
                    <li key={i} style={{ marginBottom: '8px', fontSize: '0.95em' }}>
                      {step}
                    </li>
                  ))}
                </ul>

                {/* Conseils techniques */}
                {selectedMovement.conseils_technique && selectedMovement.conseils_technique.length > 0 && (
                  <>
                    <h3 className="text-sunshine-color" style={{ marginTop: '20px', marginBottom: '10px' }}>
                      💡 Conseils techniques :
                    </h3>
                    {selectedMovement.conseils_technique.map((conseil, i) => (
                      <p key={i} style={{ fontSize: '0.9em', marginBottom: '8px', paddingLeft: '10px', borderLeft: '3px solid #fbbf24' }}>
                        {conseil}
                      </p>
                    ))}
                  </>
                )}

                <button
                  onClick={() => setSelectedMovement(null)}
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