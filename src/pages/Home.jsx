import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate('/quiz'); 
  };

  return (
    <div className="home-container">
      <div className="hero-content">
        
        {/* Titre impactant basé sur la métaphore du village résistant */}
        <h1 className="main-title">Le Village Numérique Résistant</h1>
        
        <div className="problem-statement">
          <h2>David contre le Goliath Numérique</h2>
          <br />
          <p>
            À l'heure où la fin de Windows 10 menace de rendre obsolètes des milliers 
            d'ordinateurs parfaitement fonctionnels, nos écoles font face à un mur : 
            licences coûteuses, écosystèmes fermés et dépendance aux géants de la Tech.
          </p>
          <br />
          <p>
            <strong>L'enjeu ?</strong> Refuser le gaspillage et reprendre le contrôle. 
            La démarche <em>NIRD</em> (Numérique Inclusif, Responsable et Durable) prouve 
            qu'une autre voie est possible : celle du logiciel libre, de l'autonomie et de la sobriété.
          </p>
        </div>

        <div className="cta-section">
          <p className="cta-text">
            Votre établissement est-il prêt à entrer en résistance ?
          </p>
          <br />
          <button onClick={handleStartQuiz} className="btn-resistance">
            Rejoindre la démarche NIRD
          </button>
        </div>

      </div>
    </div>
  )
}

export default Home