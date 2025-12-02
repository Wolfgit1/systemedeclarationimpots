// src/services/contribuableService.js
import apiService from './apiService';

class ContribuableService {
    async getContribuables() {
        return await apiService.get('/contribuables');
    }

    async getContribuable(id) {
        return await apiService.get(`/contribuables/${id}`);
    }

    async createContribuable(contribuableData) {
        return await apiService.post('/contribuables', contribuableData);
    }

    // Simulation d'authentification - vous devrez créer un contrôleur Auth dans votre API
    async login(email, motDePasse) {
        // Pour l'instant, on simule avec le endpoint contribuables
        const contribuables = await this.getContribuables();
        const contribuable = contribuables.find(c => c.email === email);
        if (contribuable) {
            return { token: 'simulated-token', user: contribuable };
        }
        throw new Error('Utilisateur non trouvé');
    }
}

export default new ContribuableService();