import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DeclarationService from '../services/declarationService'
import AuthService from '../services/authService'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const [declarations, setDeclarations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDeclaration, setSelectedDeclaration] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAjustementModal, setShowAjustementModal] = useState(false)
  const [motifsAjustement, setMotifsAjustement] = useState('')

  useEffect(() => {
    loadDeclarations()
  }, [])

  const loadDeclarations = async () => {
    try {
      const allDeclarations = await DeclarationService.getAllDeclarations();
      setDeclarations(allDeclarations)
    } catch (error) {
      console.error('Erreur chargement déclarations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (statut) => {
    const classes = {
      0: 'status-draft',      // Brouillon
      1: 'status-submitted',  // Soumis
      2: 'status-validating', // EnRevision
      3: 'status-approved',   // ApprouveAutomatique
      4: 'status-approved',   // ApprouveAgent
      5: 'status-rejected'    // Rejetee
    }
    return classes[statut] || 'status-default'
  }

  const getStatusLabel = (statut) => {
    const labels = {
      0: 'Brouillon',
      1: 'Soumise',
      2: 'En révision',
      3: 'Approuvée (Auto)',
      4: 'Approuvée (Agent)',
      5: 'Rejetée'
    }
    return labels[statut] || 'Inconnu'
  }

  const handleViewDetails = (declaration) => {
    setSelectedDeclaration(declaration)
    setShowDetailsModal(true)
  }

  const handleApproveAuto = async (declarationId) => {
    try {
      console.log('Génération avis automatique pour:', declarationId);
      await DeclarationService.genererAvisAutomatique(declarationId);
      alert('Avis automatique généré avec succès');
      await loadDeclarations();
    } catch (error) {
      console.error('Erreur détaillée génération avis auto:', error);
      alert('Erreur lors de la génération de l\'avis automatique: ' + error.message);
    }
  };

  const handleOpenAjustement = (declaration) => {
    setSelectedDeclaration(declaration)
    setShowAjustementModal(true)
  }

  const handleSubmitAjustement = async () => {
    try {
      await DeclarationService.genererAvisPersonnalise(
        selectedDeclaration.id, 
        motifsAjustement
      )
      alert('Avis personnalisé généré avec succès')
      setShowAjustementModal(false)
      setMotifsAjustement('')
      loadDeclarations()
    } catch (error) {
      console.error('Erreur génération avis personnalisé:', error)
      alert('Erreur lors de la génération de l\'avis personnalisé')
    }
  }

  const handleDownloadPdf = async (declaration) => {
    try {
      await DeclarationService.downloadAvisPdf(declaration.id);
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error);
      alert('Erreur lors du téléchargement du PDF: ' + error.message);
    }
  };

  const handleReject = async (declarationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir rejeter cette déclaration ?')) {
      try {
        await DeclarationService.rejeterDeclaration(declarationId)
        alert('Déclaration rejetée avec succès')
        loadDeclarations()
      } catch (error) {
        console.error('Erreur rejet déclaration:', error)
        alert('Erreur lors du rejet de la déclaration')
      }
    }
  }

  const handleLogout = () => {
    AuthService.logout()
    navigate('/connexion')
  }

  // Filtrer les déclarations pour l'admin (seulement celles en révision)
  const declarationsEnRevision = declarations.filter(d => d.statut === 2);
  const declarationsApprouvees = declarations.filter(d => d.statut === 3 || d.statut === 4);
  const declarationsRejetees = declarations.filter(d => d.statut === 5);

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1 className="logo">Administration Revenu Québec</h1>
          <nav className="nav-menu">
            <button className="nav-button active">Tableau de bord</button>
            <button className="nav-button" onClick={() => navigate('/')}>
              Vue publique
            </button>
          </nav>
          <button className="btn-logout" onClick={handleLogout}>
            ⏻ Se déconnecter
          </button>
        </div>
      </header>

      <div className="admin-content">
        <h2 className="page-title">Gestion des déclarations</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total déclarations</h3>
            <div className="stat-number">{declarations.length}</div>
          </div>
          <div className="stat-card">
            <h3>En révision</h3>
            <div className="stat-number">{declarationsEnRevision.length}</div>
          </div>
          <div className="stat-card">
            <h3>Approuvées</h3>
            <div className="stat-number">{declarationsApprouvees.length}</div>
          </div>
          <div className="stat-card">
            <h3>Rejetées</h3>
            <div className="stat-number">{declarationsRejetees.length}</div>
          </div>
        </div>

        {/* Section Déclarations en Révision */}
        <section className="dashboard-section">
          <h3 className="section-title">Déclarations nécessitant une révision manuelle</h3>
          
          {declarationsEnRevision.length === 0 ? (
            <div className="no-data">
              <p>Aucune déclaration en attente de révision</p>
              <small>Toutes les déclarations valides sont traitées automatiquement</small>
            </div>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Contribuable</th>
                    <th>Année fiscale</th>
                    <th>Date soumission</th>
                    <th>Total revenus</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {declarationsEnRevision.map((declaration) => (
                    <tr key={declaration.id}>
                      <td>#{declaration.id}</td>
                      <td>
                        {declaration.contribuable?.prenom} {declaration.contribuable?.nom}
                        <br />
                        <small>NAS: {declaration.contribuable?.nas}</small>
                      </td>
                      <td>{declaration.anneeFiscale}</td>
                      <td>{new Date(declaration.orderDate).toLocaleDateString('fr-CA')}</td>
                      <td>{declaration.totalRevenus?.toFixed(2)} $</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(declaration.statut)}`}>
                          {getStatusLabel(declaration.statut)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-action btn-view"
                            onClick={() => handleViewDetails(declaration)}
                          >
                            📋 Détails
                          </button>
                          
                          <button 
                            className="btn-action btn-approve"
                            onClick={() => handleApproveAuto(declaration.id)}
                          >
                            ✅ Approuver Auto
                          </button>
                          <button 
                            className="btn-action btn-adjust"
                            onClick={() => handleOpenAjustement(declaration)}
                          >
                            📝 Ajuster
                          </button>
                          <button 
                            className="btn-action btn-reject"
                            onClick={() => handleReject(declaration.id)}
                          >
                            ❌ Rejeter
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Section Déclarations Traitées */}
        <section className="dashboard-section">
          <h3 className="section-title">Déclarations traitées</h3>
          
          {declarationsApprouvees.length === 0 && declarationsRejetees.length === 0 ? (
            <div className="no-data">
              <p>Aucune déclaration traitée</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Contribuable</th>
                    <th>Année fiscale</th>
                    <th>Date traitement</th>
                    <th>Type traitement</th>
                    <th>Montant</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...declarationsApprouvees, ...declarationsRejetees].map((declaration) => (
                    <tr key={declaration.id}>
                      <td>#{declaration.id}</td>
                      <td>
                        {declaration.contribuable?.prenom} {declaration.contribuable?.nom}
                      </td>
                      <td>{declaration.anneeFiscale}</td>
                      <td>
                        {declaration.avisCotisation 
                          ? new Date(declaration.avisCotisation.dateGeneration).toLocaleDateString('fr-CA')
                          : new Date(declaration.orderDate).toLocaleDateString('fr-CA')
                        }
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(declaration.statut)}`}>
                          {getStatusLabel(declaration.statut)}
                        </span>
                      </td>
                      <td>
                        {declaration.avisCotisation ? (
                          <span className={declaration.avisCotisation.montantAPayer >= 0 ? 'montant-positif' : 'montant-negatif'}>
                            {declaration.avisCotisation.montantAPayer.toFixed(2)} $
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-action btn-view"
                            onClick={() => handleViewDetails(declaration)}
                          >
                            📋 Détails
                          </button>
                          
                          {(declaration.statut === 3 || declaration.statut === 4) && declaration.avisCotisation && (
                            <button 
                              className="btn-action btn-download"
                              onClick={() => handleDownloadPdf(declaration)}
                            >
                              📥 PDF
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

     {showDetailsModal && selectedDeclaration && (
    <div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-header">
                <h3>Détails de la déclaration #{selectedDeclaration.id}</h3>
                <button 
                    className="btn-close"
                    onClick={() => setShowDetailsModal(false)}
                >
                    ✕
                </button>
            </div>
            <div className="modal-body">
                <div className="detail-section">
                    <h4>Informations contribuable</h4>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Nom complet:</label>
                            <span>{selectedDeclaration.contribuable?.prenom} {selectedDeclaration.contribuable?.nom}</span>
                        </div>
                        <div className="info-item">
                            <label>NAS:</label>
                            <span>{selectedDeclaration.contribuable?.nas || 'Non renseigné'}</span>
                        </div>
                        <div className="info-item">
                            <label>Email:</label>
                            <span>{selectedDeclaration.contribuable?.email || 'Non renseigné'}</span>
                        </div>
                        <div className="info-item">
                            <label>Date naissance:</label>
                            <span>{selectedDeclaration.contribuable?.dateNaissance ? new Date(selectedDeclaration.contribuable.dateNaissance).toLocaleDateString('fr-CA') : 'Non renseignée'}</span>
                        </div>
                        <div className="info-item">
                            <label>Âge:</label>
                            <span>
                                {selectedDeclaration.contribuable?.dateNaissance 
                                    ? (new Date().getFullYear() - new Date(selectedDeclaration.contribuable.dateNaissance).getFullYear()) + ' ans'
                                    : 'Non renseigné'
                                }
                            </span>
                        </div>
                        <div className="info-item">
                            <label>Adresse:</label>
                            <span>{selectedDeclaration.contribuable?.adresse || selectedDeclaration.adressePostale || 'Non renseignée'}</span>
                        </div>
                        <div className="info-item">
                            <label>Téléphone:</label>
                            <span>{selectedDeclaration.contribuable?.telephone || selectedDeclaration.telephone || 'Non renseigné'}</span>
                        </div>
                        <div className="info-item">
                            <label>Citoyenneté:</label>
                            <span>{selectedDeclaration.citoyennete || 'Non renseignée'}</span>
                        </div>
                        <div className="info-item">
                            <label>ID Contribuable:</label>
                            <span>{selectedDeclaration.contribuable?.id || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h4>Informations déclaration</h4>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Année fiscale:</label>
                            <span>{selectedDeclaration.anneeFiscale}</span>
                        </div>
                        <div className="info-item">
                            <label>Date de soumission:</label>
                            <span>{new Date(selectedDeclaration.orderDate).toLocaleDateString('fr-CA')}</span>
                        </div>
                        <div className="info-item">
                            <label>Statut:</label>
                            <span className={`status-badge ${getStatusBadgeClass(selectedDeclaration.statut)}`}>
                                {getStatusLabel(selectedDeclaration.statut)}
                            </span>
                        </div>
                        <div className="info-item">
                            <label>Type traitement:</label>
                            <span>
                                {selectedDeclaration.avisCotisation 
                                    ? (selectedDeclaration.avisCotisation.estAutomatique ? 'Automatique' : 'Personnalisé')
                                    : 'En attente'
                                }
                            </span>
                        </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h4>Revenus déclarés</h4>
                    <table className="detail-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Montant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedDeclaration.requestItems?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.typeDocument}</td>
                                    <td>{item.description}</td>
                                    <td>{item.unitPrice.toFixed(2)} $</td>
                                </tr>
                            ))}
                            {(!selectedDeclaration.requestItems || selectedDeclaration.requestItems.length === 0) && (
                                <tr>
                                    <td colSpan="3" style={{textAlign: 'center', color: '#999'}}>
                                        Aucun revenu déclaré
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2"><strong>Total des revenus:</strong></td>
                                <td><strong>{selectedDeclaration.totalRevenus?.toFixed(2)} $</strong></td>
                            </tr>
                            <tr>
                                <td colSpan="2"><strong>Revenus emploi:</strong></td>
                                <td><strong>{selectedDeclaration.revenusEmploi?.toFixed(2)} $</strong></td>
                            </tr>
                            <tr>
                                <td colSpan="2"><strong>Autres revenus:</strong></td>
                                <td><strong>{selectedDeclaration.autresRevenus?.toFixed(2)} $</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {selectedDeclaration.avisCotisation && (
                    <div className="detail-section">
                        <h4>Avis de cotisation</h4>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Numéro référence:</label>
                                <span>{selectedDeclaration.avisCotisation.numeroReference}</span>
                            </div>
                            <div className="info-item">
                                <label>Date génération:</label>
                                <span>{new Date(selectedDeclaration.avisCotisation.dateGeneration).toLocaleDateString('fr-CA')}</span>
                            </div>
                            <div className="info-item">
                                <label>Montant à payer:</label>
                                <span className={`montant-important ${selectedDeclaration.avisCotisation.montantAPayer >= 0 ? 'montant-positif' : 'montant-negatif'}`}>
                                    {selectedDeclaration.avisCotisation.montantAPayer.toFixed(2)} $
                                </span>
                            </div>
                            <div className="info-item">
                                <label>Type:</label>
                                <span>{selectedDeclaration.avisCotisation.estAutomatique ? 'Automatique' : 'Personnalisé'}</span>
                            </div>
                            {selectedDeclaration.avisCotisation.motifsAjustement && (
                                <div className="info-item full-width">
                                    <label>Motifs d'ajustement:</label>
                                    <div className="motifs-text">
                                        {selectedDeclaration.avisCotisation.motifsAjustement}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
)}

      {/* Modal Ajustement */}
      {showAjustementModal && selectedDeclaration && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Ajustement déclaration #{selectedDeclaration.id}</h3>
              <button 
                className="btn-close"
                onClick={() => setShowAjustementModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Motifs d'ajustement *</label>
                <textarea
                  value={motifsAjustement}
                  onChange={(e) => setMotifsAjustement(e.target.value)}
                  placeholder="Décrivez les motifs de l'ajustement (revenus manquants, données incohérentes, documents absents, etc.)..."
                  rows="6"
                  required
                />
                <small>Exemples: "Revenus d'emploi sous-déclarés de 5 000$ selon Revenu Canada", "Justificatifs manquants pour les revenus de placement", etc.</small>
              </div>
              <div className="modal-actions">
                <button 
                  className="btn-cancel"
                  onClick={() => setShowAjustementModal(false)}
                >
                  Annuler
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleSubmitAjustement}
                  disabled={!motifsAjustement.trim()}
                >
                  Générer avis personnalisé
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard