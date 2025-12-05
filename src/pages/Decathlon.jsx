function Decathlon() {
  return (
    <div className="nes-container is-rounded" style={{ margin: '20px auto', maxWidth: '900px' }}>
      <h2>🏃 Page Decathlon</h2>
      <p style={{ marginTop: '20px', lineHeight: '1.6' }}>
        Découvrez nos solutions innovantes pour le sport et l'environnement.
      </p>
      <div style={{ marginTop: '20px' }}>
        <div className="nes-badge is-splited">
          <span className="is-dark">Sport</span>
          <span className="is-success">Éco-responsable</span>
        </div>
      </div>
      <section className="nes-container" style={{ marginTop: '20px' }}>
        <h3>Nos défis sportifs</h3>
        <ul className="nes-list is-disc">
          <li>Challenge environnemental</li>
          <li>Innovation durable</li>
          <li>Sport pour tous</li>
        </ul>
      </section>
    </div>
  )
}

export default Decathlon