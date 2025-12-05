function PresentationProjet() {
  return (
    <div style={{ margin: '20px auto', maxWidth: '900px' }}>
      <div className="nes-container is-rounded">
        <h2>📋 Présentation du Projet</h2>
        <p style={{ marginTop: '20px', lineHeight: '1.6' }}>
          Découvrez notre projet pour la Nuit de l'Info 2025 !
        </p>
      </div>

      <section className="nes-container is-dark" style={{ marginTop: '20px' }}>
        <h3>🎯 Objectifs</h3>
        <ul className="nes-list is-disc">
          <li>Créer une expérience interactive</li>
          <li>Sensibiliser aux enjeux environnementaux</li>
          <li>Allier technologie et créativité</li>
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
        </div>
      </section>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <i className="nes-icon trophy is-large"></i>
        <p style={{ marginTop: '10px' }}>
          <span className="nes-text is-primary">Nuit de l'Info 2025</span>
        </p>
      </div>
    </div>
  )
}

export default PresentationProjet