using ApplicationFrontEnd.Core;
using ApplicationFrontEnd.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.Core.Services
{
    public class ValidationService : IValidationService
    {
        private readonly IRevenuCanadaService _revenuCanadaService;
        private readonly IRevenuQuebecService _revenuQuebecService;

        public ValidationService(IRevenuCanadaService revenuCanadaService, IRevenuQuebecService revenuQuebecService)
        {
            _revenuCanadaService = revenuCanadaService;
            _revenuQuebecService = revenuQuebecService;
        }

        public async Task<ValidationResult> ValiderDeclaration(Request declaration)
        {
            var result = new ValidationResult();

            // 1. Validation des données de base
            ValiderDonneesBase(declaration, result);

            // 2. Validation des revenus
            ValiderRevenus(declaration, result);

            // 3. Vérification avec Revenu Canada (simulé)
            await ValiderAvecRevenuCanada(declaration, result);

            // 4. Vérification avec Revenu Québec (simulé)
            await ValiderAvecRevenuQuebec(declaration, result);

            return result;
        }


        


        private void ValiderDonneesBase(Request declaration, ValidationResult result)
        {
            // Validation de l'adresse
            if (string.IsNullOrWhiteSpace(declaration.AdressePostale))
            {
                result.AjouterErreur("L'adresse postale est obligatoire");
            }

            // Validation du téléphone
            if (string.IsNullOrWhiteSpace(declaration.Telephone))
            {
                result.AjouterErreur("Le numéro de téléphone est obligatoire");
            }

            // Validation de la citoyenneté
            if (string.IsNullOrWhiteSpace(declaration.Citoyennete))
            {
                result.AjouterErreur("La citoyenneté doit être spécifiée");
            }

            // Validation de l'âge (doit avoir au moins 18 ans)
            var age = DateTime.Now.Year - declaration.Contribuable.DateNaissance.Year;
            if (age < 18)
            {
                result.AjouterErreur("Le contribuable doit avoir au moins 18 ans pour soumettre une déclaration");
            }

            // Validation de l'email
            if (string.IsNullOrWhiteSpace(declaration.Contribuable.Email))
            {
                result.AjouterAvertissement("L'adresse email est recommandée pour les communications");
            }
        }

        private void ValiderRevenus(Request declaration, ValidationResult result)
        {
            var totalRevenus = declaration.TotalRevenus;

            // Vérification du seuil de revenus
            if (totalRevenus > 30000)
            {
                result.AjouterAvertissement("Les revenus déclarés dépassent le seuil de 30 000$ pour la déclaration simplifiée - Révision manuelle requise");
            }

            if (totalRevenus <= 0)
            {
                result.AjouterErreur("Aucun revenu déclaré");
            }

            // Vérification des revenus d'emploi
            if (declaration.RevenusEmploi < 0)
            {
                result.AjouterErreur("Les revenus d'emploi ne peuvent pas être négatifs");
            }

            // Vérification des autres revenus
            if (declaration.AutresRevenus < 0)
            {
                result.AjouterErreur("Les autres revenus ne peuvent pas être négatifs");
            }

            // Vérification de la cohérence entre les revenus déclarés et les items
            var totalItems = declaration.RequestItems.Sum(item => item.UnitPrice * item.Quantity);
            if (Math.Abs(totalRevenus - totalItems) > 0.01m)
            {
                result.AjouterAvertissement("Incohérence détectée entre le total des revenus et la somme des items");
            }

            // Vérification si revenus trop élevés pour déclaration simplifiée
            if (totalRevenus > 50000)
            {
                result.AjouterAvertissement("Revenus élevés détectés - Vérification approfondie recommandée");
            }
        }

        private async Task ValiderAvecRevenuCanada(Request declaration, ValidationResult result)
        {
            try
            {
                var donneesCanada = await _revenuCanadaService.ObtenirDonneesFiscales(
                    declaration.Contribuable.NAS,
                    declaration.AnneeFiscale);

                if (donneesCanada != null)
                {
                    // Vérification de la cohérence des revenus avec Revenu Canada
                    var ecartRevenus = Math.Abs(declaration.TotalRevenus - donneesCanada.RevenusDeclares);
                    if (ecartRevenus > 1000) // Seuil de tolérance de 1000$
                    {
                        // ⚠️ CHANGÉ : Avertissement seulement, pas bloquant
                        result.AjouterAvertissement($"Écart détecté avec Revenu Canada. Revenus déclarés: {declaration.TotalRevenus:C}, Revenus Revenu Canada: {donneesCanada.RevenusDeclares:C}");
                    }

                    // Vérification de l'identité
                    if (!donneesCanada.Nom.Equals(declaration.Contribuable.Nom, StringComparison.OrdinalIgnoreCase) ||
                        !donneesCanada.Prenom.Equals(declaration.Contribuable.Prenom, StringComparison.OrdinalIgnoreCase))
                    {
                        // ⚠️ CHANGÉ : Avertissement seulement, pas bloquant
                        result.AjouterAvertissement("Différence d'identité avec Revenu Canada - vérification recommandée");
                    }
                }
            }
            catch (Exception ex)
            {
                result.AjouterAvertissement("Impossible de vérifier avec Revenu Canada: " + ex.Message);
            }
        }

        private async Task ValiderAvecRevenuQuebec(Request declaration, ValidationResult result)
        {
            try
            {
                var donneesQuebec = await _revenuQuebecService.ObtenirDonneesFiscales(
                    declaration.Contribuable.NAS,
                    declaration.AnneeFiscale);

                if (donneesQuebec != null)
                {
                    // Vérifications spécifiques à Revenu Québec
                    if (donneesQuebec.EstDejaDeclare)
                    {
                        result.AjouterErreur("Une déclaration existe déjà pour cette année fiscale");
                    }

                    if (donneesQuebec.EstSuspendu)
                    {
                        result.AjouterErreur("Le compte du contribuable est suspendu");
                    }
                }
            }
            catch (Exception ex)
            {
                result.AjouterAvertissement("Impossible de vérifier avec Revenu Québec: " + ex.Message);
            }
        }

        public async Task<bool> VerifierAvecRevenuCanada(string nas, int anneeFiscale)
        {
            try
            {
                return await _revenuCanadaService.VerifierContribuable(nas, anneeFiscale);
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> VerifierAvecRevenuQuebec(string nas, int anneeFiscale)
        {
            try
            {
                return await _revenuQuebecService.VerifierContribuable(nas, anneeFiscale);
            }
            catch
            {
                return false;
            }
        }
    }

    
}