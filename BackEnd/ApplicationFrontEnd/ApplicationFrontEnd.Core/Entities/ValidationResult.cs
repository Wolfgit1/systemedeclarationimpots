using System.Collections.Generic;

namespace ApplicationFrontEnd.Core
{
    public class ValidationResult
    {
        public bool EstValide => Erreurs.Count == 0;
        public List<string> Erreurs { get; } = new List<string>();
        public List<string> Avertissements { get; } = new List<string>();
        public List<string> Informations { get; } = new List<string>();

        public void AjouterErreur(string message) => Erreurs.Add(message);
        public void AjouterAvertissement(string message) => Avertissements.Add(message);
        public void AjouterInformation(string message) => Informations.Add(message);
    }
}