// src/services/authService.js
import apiService from './apiService';

class AuthService {
    async login(email, motDePasse) {
        return await apiService.post('/auth/login', { email, motDePasse });
    }

    async register(userData) {
        return await apiService.post('/auth/register', userData);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('contribuableId');
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isAuthenticated() {
        return !!this.getToken();
    }
}

export default new AuthService();