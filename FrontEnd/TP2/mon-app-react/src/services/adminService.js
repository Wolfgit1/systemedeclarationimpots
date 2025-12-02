import api from './apiService'

class AuthService {
  async login(email, password) {
    const response = await api.post('/auth/login', {
      email: email,
      motDePasse: password
    })
    
    if (response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('contribuableId', response.user.id)
      localStorage.setItem('userRole', response.user.role || 'Contribuable')
    }
    
    return response
  }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('contribuableId')
    localStorage.removeItem('userRole')
  }

  isAdmin() {
    return localStorage.getItem('userRole') === 'Admin'
  }

  isAuthenticated() {
    return !!localStorage.getItem('token')
  }

  getToken() {
    return localStorage.getItem('token')
  }
}

export default new AuthService()