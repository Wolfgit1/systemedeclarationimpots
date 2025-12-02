import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthService from '../services/authService'
import './Inscription.css'

function Inscription() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [signupForm, setSignupForm] = useState({
    email: '',
    nas: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    motDePasse: '',
    confirmMotDePasse: ''
  })

  const handleChange = (e) => {
    setSignupForm({
      ...signupForm,
      [e.target.name]: e.target.value
    })
    setError('')
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (signupForm.motDePasse !== signupForm.confirmMotDePasse) {
    setError('Les mots de passe ne correspondent pas')
    return
  }

  if (signupForm.motDePasse.length < 6) {
    setError('Le mot de passe doit contenir au moins 6 caractères')
    return
  }

  setLoading(true)
  setError('')

  try {
    const userData = {
      NAS: signupForm.nas,
      Prenom: signupForm.prenom,
      Nom: signupForm.nom,
      Email: signupForm.email,
      MotDePasse: signupForm.motDePasse,
      DateNaissance: signupForm.dateNaissance
    }

    console.log('Données envoyées:', userData)
    const result = await AuthService.register(userData)
    console.log('Réponse reçue:', result)
    
    if (result.token && result.user) {
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('contribuableId', result.user.id)
      navigate('/suivi')
    } else {
      setError('Réponse inattendue du serveur')
    }
  } catch (error) {
    console.error('Erreur d\'inscription:', error)
    // Votre API retourne directement le message d'erreur
    if (error.message) {
      setError(error.message)
    } else {
      setError('Erreur lors de la création du compte. L\'email ou le NAS existe peut-être déjà.')
    }
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="inscription-container">
      <div className="inscription-header">
        <div className="logo-container">
          <h1 className="logo-text">Revenu Québec</h1>
          <p className="logo-subtitle">Déclaration de revenus en ligne</p>
        </div>
      </div>

      <div className="inscription-card">
        <h2 className="card-title">Créer un compte</h2>
        <p className="card-subtitle">Remplissez le formulaire pour créer votre compte</p>

        {error && (
          <div className="error-message" style={{
            background: '#ffebee',
            borderLeft: '4px solid #f44336',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            color: '#c62828'
          }}>
            {error}
          </div>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Courriel *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={signupForm.email}
              onChange={handleChange}
              required
              placeholder="exemple@courriel.com"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="nas">Numéro d'assurance sociale (NAS) *</label>
            <input
              type="text"
              id="nas"
              name="nas"
              value={signupForm.nas}
              onChange={handleChange}
              required
              placeholder="000 000 000"
              maxLength="11"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nom">Nom *</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={signupForm.nom}
                onChange={handleChange}
                required
                autoComplete="family-name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="prenom">Prénom *</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={signupForm.prenom}
                onChange={handleChange}
                required
                autoComplete="given-name"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dateNaissance">Date de naissance *</label>
            <input
              type="date"
              id="dateNaissance"
              name="dateNaissance"
              value={signupForm.dateNaissance}
              onChange={handleChange}
              required
              autoComplete="bday"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="motDePasse">Mot de passe *</label>
            <input
              type="password"
              id="motDePasse"
              name="motDePasse"
              value={signupForm.motDePasse}
              onChange={handleChange}
              required
              placeholder="Minimum 6 caractères"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmMotDePasse">Confirmer le mot de passe *</label>
            <input
              type="password"
              id="confirmMotDePasse"
              name="confirmMotDePasse"
              value={signupForm.confirmMotDePasse}
              onChange={handleChange}
              required
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="divider">
          <span>ou</span>
        </div>

        <div className="login-link">
          <p>Vous avez déjà un compte ?</p>
          <Link to="/connexion" className="link-primary">
            Se connecter
          </Link>
        </div>
      </div>

      <footer className="inscription-footer">
        <p>© Gouvernement du Québec - Revenu Québec</p>
        <div className="footer-links">
          <a href="#">Aide</a>
          <a href="#">Politique de confidentialité</a>
          <a href="#">Accessibilité</a>
        </div>
      </footer>
    </div>
  )
}

export default Inscription