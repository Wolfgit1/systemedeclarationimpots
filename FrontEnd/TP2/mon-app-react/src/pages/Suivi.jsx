import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DeclarationService from '../services/declarationService'
import AuthService from '../services/authService'
import './Suivi.css'

function Suivi() {
  const navigate = useNavigate()
  const [declarationsEnCours, setDeclarationsEnCours] = useState([])
  const [historique, setHistorique] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDeclarations()
  }, [])

  const loadDeclarations = async () => {
    try {
      const contribuableId = localStorage.getItem('contribuableId')
      const declarations = await DeclarationService.getDeclarationsByContribuable(parseInt(contribuableId))
      
      // AJOUT: Vérification que declarations n'est pas undefined
      if (!declarations) {
        console.error('Aucune déclaration retournée');
        setDeclarationsEnCours([]);
        setHistorique([]);
        return;
      }
      
      const enCours = declarations.filter(d => d.statut < 3) // Brouillon, Soumis, EnRevision
      const hist = declarations.filter(d => d.statut >= 3) // ApprouveAutomatique, ApprouveAgent, Rejetee

      setDeclarationsEnCours(enCours)
      setHistorique(hist)
    } catch (error) {
      console.error('Erreur chargement déclarations:', error)
      // AJOUT: Réinitialiser les états en cas d'erreur
      setDeclarationsEnCours([]);
      setHistorique([]);
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (statut) => {
    const classes = {
      0: 'status-draft',      // Brouillon
      1: 'status-submitted',  // Soumis
      2: 'status-validating', // EnRevision
      3: 'status-issued',     // ApprouveAutomatique
      4: 'status-issued',     // ApprouveAgent
      5: 'status-rejected'    // Rejetee
    }
    return classes[statut] || 'status-default'
  }

  const getStatusLabel = (statut) => {
    const labels = {
      0: 'Brouillon',
      1: 'Soumise',
      2: 'En révision',
      3: 'Avis émis (auto)',
      4: 'Avis émis (agent)',
      5: 'Rejetée'
    }
    return labels[statut] || 'Inconnu'
  }

  const handleViewAvis = async (declaration) => {
    try {
      const avis = await DeclarationService.getAvisCotisation(declaration.id)
      if (avis) {
        if (avis.estAutomatique) {
          navigate('/avis-auto', { state: { avis, declaration } })
        } else {
          navigate('/avis-personnalise', { state: { avis, declaration } })
        }
      } else {
        alert('Avis non disponible pour le moment')
      }
    } catch (error) {
      console.error('Erreur chargement avis:', error)
      alert('Erreur lors du chargement de l\'avis')
    }
  }

  const handleDownloadPdf = async (declaration) => {
    try {
      await DeclarationService.downloadAvisPdf(declaration.id)
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error)
      alert('Erreur lors du téléchargement du PDF')
    }
  }

  const handleLogout = () => {
    AuthService.logout()
    navigate('/connexion')
  }

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  return (
    <div className="suivi-container">
      <header className="suivi-header">
        <div className="header-content">
          <h1 className="logo">Revenu Québec</h1>
          <nav className="nav-menu">
            <button className="nav-button active">Suivi</button>
            <button className="nav-button" onClick={() => navigate('/declaration')}>
              Nouvelle déclaration
            </button>
            <button className="nav-button">Profil</button>
          </nav>
          <button className="btn-logout" onClick={handleLogout}>
            ⏻ Se déconnecter
          </button>
        </div>
      </header>

      <div className="suivi-content">
        <h2 className="page-title">Tableau de bord</h2>

        <section className="dashboard-section">
          <h3 className="section-title">Déclarations en cours</h3>

          {declarationsEnCours.length === 0 ? (
            <p>Aucune déclaration en cours</p>
          ) : (
            <div className="table-container">
              <table className="declarations-table">
                <thead>
                  <tr>
                    <th>Année fiscale</th>
                    <th>Date de création</th>
                    <th>Dernière modification</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {declarationsEnCours.map((declaration) => (
                    <tr key={declaration.id}>
                      <td><strong>{declaration.anneeFiscale}</strong></td>
                      <td>{new Date(declaration.orderDate).toLocaleDateString('fr-CA')}</td>
                      <td>{new Date(declaration.orderDate).toLocaleDateString('fr-CA')}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(declaration.statut)}`}>
                          {getStatusLabel(declaration.statut)}
                        </span>
                      </td>
                      <td>
                        {declaration.statut === 0 && (
                          <button
                            className="btn-action btn-edit"
                            onClick={() => navigate('/declaration', { state: { declaration } })}
                          >
                            Continuer
                          </button>
                        )}
                        {declaration.statut === 1 && (
                          <button className="btn-action btn-view">
                            Voir détails
                          </button>
                        )}
                        {declaration.statut === 2 && (
                          <span className="status-waiting">En révision</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h3 className="section-title">Historique des déclarations passées</h3>

          {historique.length === 0 ? (
            <p>Aucune déclaration dans l'historique</p>
          ) : (
            <div className="table-container">
              <table className="declarations-table">
                <thead>
                  <tr>
                    <th>Année fiscale</th>
                    <th>Date de dépôt</th>
                    <th>Date de l'avis</th>
                    <th>Type d'avis</th>
                    <th>Résultat</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {historique.map((declaration) => (
                    <tr key={declaration.id}>
                      <td><strong>{declaration.anneeFiscale}</strong></td>
                      <td>{new Date(declaration.orderDate).toLocaleDateString('fr-CA')}</td>
                      <td>{declaration.avisCotisation ? new Date(declaration.avisCotisation.dateGeneration).toLocaleDateString('fr-CA') : '-'}</td>
                      <td>
                        <span className={`type-badge ${declaration.avisCotisation?.estAutomatique ? 'type-auto' : 'type-manual'}`}>
                          {declaration.avisCotisation?.estAutomatique ? 'Automatisé' : 'Personnalisé'}
                        </span>
                      </td>
                      <td>
                        <span className={`montant ${declaration.avisCotisation?.montantAPayer >= 0 ? 'montant-positif' : 'montant-negatif'}`}>
                          {declaration.avisCotisation ? `${declaration.avisCotisation.montantAPayer >= 0 ? '+' : ''}${declaration.avisCotisation.montantAPayer.toFixed(2)} $` : 'N/A'}
                        </span>
                      </td>
                      <td>
                        {declaration.statut === 3 || declaration.statut === 4 ? ( // ApprouveAutomatique ou ApprouveAgent
                          <button
                            className="btn-action btn-download"
                            onClick={() => handleDownloadPdf(declaration)}
                          >
                            📥 Télécharger
                          </button>
                        ) : declaration.statut === 5 ? ( // Rejetee
                          <span className="status-rejected">Rejetée</span>
                        ) : (
                          <button
                            className="btn-action btn-view"
                            onClick={() => handleViewAvis(declaration)}
                          >
                            Voir détails
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="action-center">
          <button
            className="btn-new-declaration"
            onClick={() => navigate('/declaration')}
          >
            + Commencer une nouvelle déclaration
          </button>
        </div>
      </div>

      <footer className="suivi-footer">
        <p>© Gouvernement du Québec - Revenu Québec</p>
        <div className="footer-links">
          <a href="#">Aide</a>
          <a href="#">Contact</a>
          <a href="#">Confidentialité</a>
        </div>
      </footer>
    </div>
  )
}

export default Suivi