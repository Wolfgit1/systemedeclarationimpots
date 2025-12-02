// src/services/declarationService.js
import apiService from './apiService';
import PdfService from './pdfService';

class DeclarationService {
    async getDeclarations() {
        return await apiService.get('/requests');
    }

    async getDeclaration(id) {
        return await apiService.get(`/requests/${id}`);
    }

    async getDeclarationsByContribuable(contribuableId) {
        return await apiService.get(`/requests/contribuable/${contribuableId}`);
    }

    async createDeclaration(declarationData) {
        return await apiService.post('/requests', declarationData);
    }

    async updateDeclaration(id, declarationData) {
        return await apiService.put(`/requests/${id}`, declarationData);
    }

    async soumettreDeclaration(id) {
        return await apiService.post(`/requests/${id}/soumettre`);
    }

    async getAvisCotisation(declarationId) {
        return await apiService.get(`/aviscotisation/declaration/${declarationId}`);
    }

    async genererAvisAutomatique(declarationId) {
        return await apiService.post(`/aviscotisation/generer-automatique/${declarationId}`);
    }

    async genererAvisPersonnalise(declarationId, motifsAjustement) {
        return await apiService.post(`/aviscotisation/generer-personnalise/${declarationId}`, motifsAjustement);
    }

    async rejeterDeclaration(declarationId) {
        return await apiService.post(`/requests/${declarationId}/rejeter`);
    }

    async getAllDeclarations() {
        return await apiService.get('/requests');
    }

    async downloadAvisPdf(declarationId) {
        try {
            // Récupérer les données complètes
            const declaration = await this.getDeclaration(declarationId);
            const avis = await this.getAvisCotisation(declarationId);
            
            if (!avis) {
                throw new Error('Avis de cotisation non trouvé pour cette déclaration');
            }

            const contribuable = declaration.contribuable;

            // Générer le PDF côté client
            PdfService.genererAvisCotisation(avis, declaration, contribuable);
            
            return true;
        } catch (error) {
            console.error('Erreur génération PDF:', error);
            throw error;
        }
    }

    async getDeclarationComplete(declarationId) {
        const declaration = await this.getDeclaration(declarationId);
        const avis = await this.getAvisCotisation(declarationId);
        return { declaration, avis };
    }
}

export default new DeclarationService();