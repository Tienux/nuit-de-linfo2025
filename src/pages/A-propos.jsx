function Apropos(){
    return(
        <div style={{ margin: '20px auto', maxWidth: '900px' }}>
            {/* En-tête */}
            <div className="nes-container is-rounded with-title">
                <p className="title">👥 Notre Équipe</p>
                <h2>À propos de nous !</h2>
                <p style={{ marginTop: '20px', lineHeight: '1.8' }}>
                    Nous sommes une équipe de <strong>7 étudiants en Master 2 ISA</strong> (Intelligent Systems and Applications) 
                    à l'<strong>Université de Tours</strong>. Passionnés par le développement web et les défis techniques, 
                    nous participons à la <strong>Nuit de l'Info 2025</strong> avec enthousiasme et créativité !
                </p>
            </div>

            {/* Sujet principal */}
            <section className="nes-container is-dark" style={{ marginTop: '20px' }}>
                <h3>🎯 Notre Mission : NIRD</h3>
                <p style={{ marginTop: '15px', lineHeight: '1.8' }}>
                    Le sujet principal de notre projet est le <strong>NIRD</strong> (Numérique Inclusif, Responsable et Durable).
                    Notre objectif est de sensibiliser aux enjeux du numérique responsable et de proposer des solutions 
                    concrètes pour un avenir digital plus durable et accessible à tous.
                </p>
            </section>

            {/* Arborescence du site */}
            <section className="nes-container is-rounded" style={{ marginTop: '20px' }}>
                <h3>🗺️ Arborescence du Site</h3>
                <div style={{ marginTop: '15px' }}>
                    <ul className="nes-list is-disc">
                        <li>
                            <strong>🏠 Accueil</strong> : Présentation de la Nuit de l'Info et navigation via la carte interactive
                        </li>
                        <li>
                            <strong>🏃 Decathlon</strong> : Programme sportif personnalisé et quiz pour trouver votre routine idéale
                        </li>
                        <li>
                            <strong>📋 Présentation du Projet</strong> : Détails sur nos objectifs, technologies et réalisations
                        </li>
                        <li>
                            <strong>📝 Quiz NIRD</strong> : Testez vos connaissances sur le numérique responsable
                        </li>
                        <li>
                            <strong>👥 À propos</strong> : Qui nous sommes et notre démarche (vous êtes ici !)
                        </li>
                        <li>
                            <strong>🐍 Easter Egg</strong> : Un serpent mystérieux se cache sur la carte... Saurez-vous le trouver ?
                            <italic>Le code à un lien avec les big-tech...</italic>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Technologies */}
            <section className="nes-container" style={{ marginTop: '20px' }}>
                <h3>🛠️ Technologies Utilisées</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px', justifyContent: 'center' }}>
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
                        <span className="is-error">React Router</span>
                    </div>
                </div>
            </section>

            {/* Team spirit */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <i className="nes-icon trophy is-large"></i>
                <p style={{ marginTop: '15px', fontSize: '14px' }}>
                    <strong>Ensemble, nous sommes les GPT Enjoyer !</strong>
                </p>
                <div className="nes-balloon from-left" style={{ marginTop: '20px' }}>
                    <p>Merci de visiter notre projet. Bonne exploration ! </p>
                </div>
            </div>
        </div>
    )
}

export default Apropos;