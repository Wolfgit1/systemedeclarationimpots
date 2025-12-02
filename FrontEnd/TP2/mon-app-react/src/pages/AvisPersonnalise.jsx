import { useNavigate } from 'react-router-dom'
import './Avis.css'

function AvisPersonnalise() {
  const navigate = useNavigate()

  const avisData = {
    numeroReference: 'RQ-2020-0045678',
    dateEmission: '2021-06-10',
    contribuable: {
      nom: 'Tremblay',
      prenom: 'Jean',
      nas: '000 000 000',
      adresse: '123 Rue Principale',
      ville: 'Montréal',
      codePostal: 'H1A 1A1'
    },
    anneeFiscale: 2020,
    revenus: [
      { type: 'Revenus d\'emploi', montant: 26800.00 },
      { type: 'Revenus de placement (ajusté)', montant: 450.00, ajuste: true }
    ],
    calculs: [
      { ligne: 'Revenu total', montant: 27250.00 },
      { ligne: 'Déductions de base', montant: -15000.00 },
      { ligne: 'Revenu imposable', montant: 12250.00 },
      { ligne: 'Impôt provincial (taux 15%)', montant: 1837.50 },
      { ligne: 'Crédits d\'impôt', montant: -450.00 },
      { ligne: 'Impôt à payer avant retenues', montant: 1387.50 },
      { ligne: 'Retenues à la source', montant: -1262.00 }
    ],
    resultat: {
      type: 'paiement',
      montant: 125.50
    },
    motifs: {
      agent: 'Marie Dupont',
      matricule: 'MD-7845',
      dateRevision: '2021-06-08',
      observations: [
        {
          titre: 'Revenus de placement non déclarés',
          description: 'Nous avons identifié des revenus d\'intérêts non déclarés provenant de votre compte d\'épargne à la Banque Nationale (450,00 $). Ces revenus doivent être inclus dans votre déclaration selon l\'article 87 de la Loi sur les impôts.'
        },
        {
          titre: 'Pièces justificatives manquantes',
          description: 'Le reçu pour don de charité de 200,00 $ n\'était pas conforme. Nous avons retiré ce crédit d\'impôt de votre déclaration. Pour être accepté, le reçu doit être émis par un organisme de bienfaisance enregistré.'
        }
      ],
      montantAjuste: 125.50,
      montantInitial: -180.00
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
            <div className="avis-type-badge personnalise">
              Avis personnalisé
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

          {/* SECTION MOTIFS DE L'AJUSTEMENT - Unique à l'avis personnalisé */}
          <div className="avis-section motifs-section">
            <div className="warning-header">
              <span className="warning-icon">⚠️</span>
              <h3 className="section-title">Motifs de l'ajustement</h3>
            </div>

            <div className="motifs-box">
              <div className="revision-info">
                <p><strong>Révisé par:</strong> {avisData.motifs.agent} (Matricule: {avisData.motifs.matricule})</p>
                <p><strong>Date de révision:</strong> {new Date(avisData.motifs.dateRevision).toLocaleDateString('fr-CA')}</p>
              </div>

              <div className="ajustement-summary">
                <div className="summary-item">
                  <span className="summary-label">Résultat initial déclaré:</span>
                  <span className="summary-value positive">{avisData.motifs.montantInitial.toFixed(2)} $</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Résultat après ajustement:</span>
                  <span className="summary-value negative">{avisData.motifs.montantAjuste.toFixed(2)} $</span>
                </div>
              </div>

              <h4>Observations détaillées:</h4>

              {avisData.motifs.observations.map((observation, index) => (
                <div key={index} className="observation-item">
                  <div className="observation-number">{index + 1}</div>
                  <div className="observation-content">
                    <h5>{observation.titre}</h5>
                    <p>{observation.description}</p>
                  </div>
                </div>
              ))}

              <div className="recours-info">
                <h4>Droit de contestation</h4>
                <p>
                  Si vous n'êtes pas d'accord avec cet ajustement, vous avez le droit de contester
                  cette décision dans un délai de 90 jours suivant la date d'émission de cet avis.
                  Pour ce faire, vous devez soumettre un avis d'opposition écrit expliquant les motifs
                  de votre désaccord.
                </p>
              </div>
            </div>
          </div>

          {/* Revenus pris en compte */}
          <div className="avis-section">
            <h3 className="section-title">Revenus pris en compte</h3>
            <table className="avis-table">
              <thead>
                <tr>
                  <th>Type de revenu</th>
                  <th className="text-right">Montant</th>
                </tr>
              </thead>
              <tbody>
                {avisData.revenus.map((revenu, index) => (
                  <tr key={index} className={revenu.ajuste ? 'row-ajuste' : ''}>
                    <td>
                      {revenu.type}
                      {revenu.ajuste && <span className="badge-ajuste">Ajusté</span>}
                    </td>
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

          {/* Calcul de l'impôt */}
          <div className="avis-section">
            <h3 className="section-title">Calcul de l'impôt</h3>
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
                  : 'Vous devez effectuer un paiement avant le 30 septembre 2021. Des intérêts de retard seront appliqués si le paiement n\'est pas reçu à temps.'}
              </p>
            </div>
          </div>

          {/* Information importante */}
          <div className="avis-section">
            <div className="info-box warning-variant">
              <div className="info-box-icon">📝</div>
              <div className="info-box-content">
                <h4>Cet avis a été rédigé par un agent de Revenu Québec</h4>
                <p>
                  Votre déclaration a fait l'objet d'une révision manuelle par un agent qualifié.
                  Les ajustements apportés sont détaillés dans la section "Motifs de l'ajustement" ci-dessus.
                  Pour toute question, vous pouvez communiquer avec l'agent responsable de votre dossier
                  au 1-800-REVENU-QC en mentionnant votre numéro de référence.
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

export default AvisPersonnalise
