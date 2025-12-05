import Navbar from '../components/Navbar';
import VillageGaulois from '../components/VillageGaulois';

function PresentationProjet() {
  return (
    <>
      <Navbar />
      <div style={{ margin: '20px auto', maxWidth: '1200px' }}>
        <div className="nes-container is-rounded">
          <h2>📋 Présentation du Projet</h2>
          <p style={{ marginTop: '20px', lineHeight: '1.6' }}>
            Explorez notre village gaulois en 3D ! Chaque tente représente un projet unique. 
            Utilisez ZQSD pour vous déplacer et cliquez sur les éléments pour en savoir plus.
          </p>
        </div>

        {/* Village 3D intégré */}
        <section className="nes-container" style={{ marginTop: '20px', padding: '0' }}>
          <VillageGaulois />
        </section>

        <section className="nes-container is-dark" style={{ marginTop: '20px' }}>
          <h3>🎯 Nos Projets</h3>
          <ul className="nes-list is-disc">
            <li><strong>🏛️ Nuit de l'info</strong> - Quiz éducatif sur le numérique responsable</li>
            <li><strong>🏃 Decathlon</strong> - Recommandations d'exercices personnalisées</li>
            <li><strong>🐍 Hidden Snake</strong> - Jeu de lettres sur les GAFAM</li>
            <li><strong>👾 Retro</strong> - Style rétro gaming 8-bit</li>
            <li><strong>📋 Village 3D</strong> - Présentation interactive avec Three.js</li>
          </ul>
        </section>

        <section className="nes-container" style={{ marginTop: '20px' }}>
          <h3>🛠️ Technologies utilisées</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
            <div className="nes-badge">
              <span className="is-primary">React</span>
            </div>
            <div className="nes-badge">
              <span className="is-success">Vite</span>
            </div>
            <div className="nes-badge">
              <span className="is-warning">NES.css</span>
            </div>
            <div className="nes-badge">
              <span className="is-error">Three.js</span>
            </div>
          </div>
        </section>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <i className="nes-icon trophy is-large"></i>
          <p style={{ marginTop: '10px' }}>
            <span className="nes-text is-primary">Nuit de l'Info 2025 - Village Gaulois Interactive</span>
          </p>
        </div>
      </div>
    </>
  )
}

export default PresentationProjet