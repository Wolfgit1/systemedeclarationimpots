import { useNavigate } from 'react-router-dom'
import './Avis.css'

function AvisAuto() {
  const navigate = useNavigate()

  const avisData = {
    numeroReference: 'RQ-2024-0012345',
    dateEmission: '2024-05-20',
    contribuable: {
      nom: 'Tremblay',
      prenom: 'Jean',
      nas: '000 000 000',
      adresse: '123 Rue Principale',
      ville: 'Montréal',
      codePostal: 'H1A 1A1'
    },
    anneeFiscale: 2021,
    revenus: [
      { type: 'Revenus d\'emploi', montant: 28500.00 },
      { type: 'Intérêts bancaires', montant: 120.00 }
    ],
    calculs: [
      { ligne: 'Revenu total', montant: 28620.00 },
      { ligne: 'Déductions de base', montant: -15000.00 },
      { ligne: 'Revenu imposable', montant: 13620.00 },
      { ligne: 'Impôt provincial (taux 15%)', montant: 2043.00 },
      { ligne: 'Crédits d\'impôt', montant: -500.00 },
      { ligne: 'Impôt à payer avant retenues', montant: 1543.00 },
      { ligne: 'Retenues à la source', montant: -1723.00 }
    ],
    resultat: {
      type: 'remboursement',
      montant: 180.00
    }
  }

  const handleDownload = () => {
    alert('Téléchargement du PDF en cours... (Fonctionnalité simulée)')
  }

  const handleLogout = () => {
    // Simulation de la déconnexion
    navigate('/connexion')
  }

  return (
    <div className="avis-container">
      <header className="avis-header">
        <h1 className="logo">Revenu Québec</h1>
        <div className="header-actions">
          <button className="btn-back" onClick={() => navigate('/suivi')}>
            ← Retour au suivi
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            ⏻ Se déconnecter
          </button>
        </div>
      </header>

      <div className="avis-content">
        <div className="avis-card">
          {/* En-tête de l'avis */}
          <div className="avis-card-header">
            <div className="avis-logo-section">
              <h2>Gouvernement du Québec</h2>
              <h3>Revenu Québec</h3>
            </div>
            <div className="avis-type-badge auto">
              Avis automatisé
            </div>
          </div>

          <h1 className="avis-title">Avis de cotisation</h1>

          {/* Informations de référence */}
          <div className="avis-section reference-section">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Numéro de référence:</span>
                <span className="info-value">{avisData.numeroReference}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date d'émission:</span>
                <span className="info-value">{new Date(avisData.dateEmission).toLocaleDateString('fr-CA')}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Année fiscale:</span>
                <span className="info-value">{avisData.anneeFiscale}</span>
              </div>
            </div>
          </div>

          {/* Identité du contribuable */}
          <div className="avis-section">
            <h3 className="section-title">Contribuable</h3>
            <div className="contribuable-info">
              <p><strong>{avisData.contribuable.prenom} {avisData.contribuable.nom}</strong></p>
              <p>NAS: {avisData.contribuable.nas}</p>
              <p>{avisData.contribuable.adresse}</p>
              <p>{avisData.contribuable.ville}, {avisData.contribuable.codePostal}</p>
            </div>
          </div>

          {/* Revenus pris en compte */}
          <div className="avis-section">
            <h3 className="section-title">Revenus pris en compte</h3>
            <div className="avis-table-container">
              <table className="avis-table">
              <thead>
                <tr>
                  <th>Type de revenu</th>
                  <th className="text-right">Montant</th>
                </tr>
              </thead>
              <tbody>
                {avisData.revenus.map((revenu, index) => (
                  <tr key={index}>
                    <td>{revenu.type}</td>
                    <td className="text-right">{revenu.montant.toFixed(2)} $</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td><strong>Total des revenus</strong></td>
                  <td className="text-right">
                    <strong>{avisData.revenus.reduce((sum, r) => sum + r.montant, 0).toFixed(2)} $</strong>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>

          {/* Calcul de l'impôt */}
          <div className="avis-section">
            <h3 className="section-title">Calcul de l'impôt</h3>
            <div className="avis-table-container">
              <table className="avis-table calcul-table">
              <tbody>
                {avisData.calculs.map((calcul, index) => (
                  <tr key={index}>
                    <td>{calcul.ligne}</td>
                    <td className={`text-right ${calcul.montant < 0 ? 'negative' : ''}`}>
                      {calcul.montant.toFixed(2)} $
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Résultat final */}
          <div className="avis-section resultat-section">
            <div className={`resultat-box ${avisData.resultat.type}`}>
              <h3 className="resultat-title">
                {avisData.resultat.type === 'remboursement' ? 'Montant à recevoir' : 'Montant à payer'}
              </h3>
              <div className="resultat-montant">
                {avisData.resultat.montant.toFixed(2)} $
              </div>
              <p className="resultat-description">
                {avisData.resultat.type === 'remboursement'
                  ? 'Vous recevrez un remboursement. Le montant sera déposé dans votre compte bancaire dans un délai de 10 jours ouvrables.'
                  : 'Vous devez effectuer un paiement. Veuillez payer avant la date limite indiquée pour éviter les intérêts.'}
              </p>
            </div>
          </div>

          {/* Information importante */}
          <div className="avis-section">
            <div className="info-box">
              <div className="info-box-icon">ℹ️</div>
              <div className="info-box-content">
                <h4>Cet avis a été généré automatiquement</h4>
                <p>
                  Votre déclaration a été traitée par nos systèmes automatisés.
                  Aucune vérification manuelle n'a été nécessaire. Si vous avez des questions,
                  vous pouvez nous contacter au 1-800-REVENU-QC.
                </p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="avis-actions">
            <button className="btn-primary" onClick={handleDownload}>
              📥 Télécharger en PDF
            </button>
            <button className="btn-secondary" onClick={() => navigate('/suivi')}>
              Retour au suivi
            </button>
          </div>
        </div>
      </div>

      <footer className="avis-footer">
        <p>© Gouvernement du Québec - Revenu Québec</p>
        <p className="footer-note">
          Ce document est une représentation officielle de votre avis de cotisation.
          Conservez-le pour vos dossiers.
        </p>
      </footer>
    </div>
  )
}

export default AvisAuto
