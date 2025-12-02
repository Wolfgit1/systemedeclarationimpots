# Prototype - Déclaration de revenus Revenu Québec

## Description du projet

Ce prototype est un site web statique pour Revenu Québec permettant aux contribuables ayant des revenus inférieurs à 30 000 $ de produire gratuitement leur déclaration de revenus en ligne.

**Important:** Ce prototype représente uniquement l'aspect visuel du site. Aucune logique fonctionnelle n'est implémentée.

## Technologies utilisées

- **React 19.1.1** - Bibliothèque JavaScript pour l'interface utilisateur
- **React Router DOM** - Gestion de la navigation entre les pages
- **Vite** - Outil de build rapide pour le développement
- **CSS** - Styles personnalisés pour le thème Revenu Québec

## Structure du projet

```
mon-app-react/
├── src/
│   ├── pages/
│   │   ├── Connexion.jsx            # Page de connexion
│   │   ├── Connexion.css
│   │   ├── Inscription.jsx          # Page d'inscription
│   │   ├── Inscription.css
│   │   ├── Declaration.jsx          # Page de déclaration de revenus
│   │   ├── Declaration.css
│   │   ├── Suivi.jsx               # Page de gestion et suivi
│   │   ├── Suivi.css
│   │   ├── AvisAuto.jsx            # Page d'avis automatisé
│   │   ├── AvisPersonnalise.jsx    # Page d'avis personnalisé
│   │   └── Avis.css                # Styles communs pour les avis
│   ├── App.jsx                     # Composant principal avec routage
│   ├── App.css
│   ├── index.css                   # Styles globaux et thème
│   └── main.jsx                    # Point d'entrée
├── package.json
└── README.md
```

## Les 6 pages du prototype

### 1. Page de connexion (`/connexion`)
- Formulaire de connexion : courriel et mot de passe
- Lien "Mot de passe oublié ?"
- Lien vers la page d'inscription pour les nouveaux utilisateurs
- Message informatif sur le service
- Design : fond bleu pâle, carte blanche centrée

### 2. Page d'inscription (`/inscription`)
- Formulaire d'inscription complet avec tous les champs requis
- Champs : courriel, NAS, nom, prénom, date de naissance, mot de passe, confirmation
- Lien vers la page de connexion pour les utilisateurs existants
- Message informatif sur la sécurité des données
- Design : fond bleu pâle, carte blanche centrée

### 3. Page de déclaration de revenus (`/declaration`)
- Barre d'étapes horizontale : Profil → Revenus → Pièces → Revue
- **Étape 1 - Profil :**
  - Identité (lecture seule)
  - Coordonnées (modifiables)
- **Étape 2 - Revenus :**
  - Tableau pour ajouter des revenus
  - Calcul automatique du total
- **Étape 3 - Pièces justificatives :**
  - Zone de téléversement de fichiers
  - Liste des fichiers téléversés
- **Étape 4 - Revue :**
  - Récapitulatif de toutes les informations
  - Case à cocher de confirmation
- Boutons : Annuler, Sauvegarder brouillon, Envoyer

### 4. Page de gestion et suivi (`/suivi`)
- En-tête avec menu de navigation
- Section "Déclarations en cours" avec tableau et badges d'état
- Timeline verticale illustrant les étapes de traitement
- Section "Historique des déclarations passées"
- Bouton "Commencer une nouvelle déclaration"

### 5. Page d'avis de cotisation automatisé (`/avis-auto`)
- Badge "Avis automatisé"
- Informations de référence (numéro, date, année)
- Identité du contribuable
- Revenus pris en compte
- Calcul détaillé de l'impôt
- Résultat final (remboursement ou paiement)
- Boutons : Télécharger PDF, Retour au suivi

### 6. Page d'avis de cotisation personnalisé (`/avis-personnalise`)
- Badge "Avis personnalisé"
- Même structure que l'avis automatisé
- **Section supplémentaire "Motifs de l'ajustement" :**
  - Informations sur l'agent réviseur
  - Comparaison avant/après ajustement
  - Observations détaillées avec explications
  - Informations sur le droit de contestation
- Revenus ajustés marqués visuellement

## Installation et lancement

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation
```bash
cd mon-app-react
npm install
```

### Démarrage du serveur de développement
```bash
npm run dev
```

L'application sera accessible à l'adresse : `http://localhost:5173`

### Build de production
```bash
npm run build
```

### Prévisualisation du build
```bash
npm run preview
```

## Navigation dans le prototype

1. Démarrez sur la page de connexion (`/connexion`) - **page d'accueil par défaut**
2. Options de navigation initiale :
   - **Se connecter** : Remplir le formulaire → redirige vers `/suivi`
   - **Créer un compte** : Cliquer sur le lien → redirige vers `/inscription`
3. Sur la page d'inscription (`/inscription`) :
   - Remplir le formulaire complet
   - Cliquer sur "Créer mon compte" → redirige vers `/suivi`
   - Ou cliquer sur "Se connecter" pour retourner à `/connexion`
4. Sur la page de suivi (`/suivi`), cliquez sur "Commencer une nouvelle déclaration" → `/declaration`
5. Complétez les 4 étapes de la déclaration
6. Cliquez sur "Envoyer la déclaration" → retour à `/suivi`
7. Dans l'historique, cliquez sur "Voir l'avis" pour voir :
   - Un avis automatisé (`/avis-auto`)
   - Un avis personnalisé (`/avis-personnalise`)

## Caractéristiques visuelles

### Palette de couleurs
- **Bleu principal:** #0d47a1 (Revenu Québec)
- **Bleu secondaire:** #1976d2
- **Fond clair:** #e3f2fd
- **Succès:** #4caf50
- **Avertissement:** #ff9800
- **Erreur:** #f44336

### Typographie
- Police principale : Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- Responsive design pour mobile, tablette et desktop

### Éléments interactifs
- Tous les boutons ont des effets de survol
- Les formulaires ont une validation visuelle
- Les transitions sont fluides (0.3s)
- Les badges de statut sont colorés selon l'état

## Notes importantes

- **Aucune donnée n'est sauvegardée** : Toutes les données sont simulées et stockées temporairement en mémoire
- **Pas de backend** : Aucune connexion à une base de données ou API
- **PDF factice** : Le téléchargement PDF affiche simplement une alerte
- **Navigation simulée** : Les liens fonctionnent mais ne font que changer de page

## Conformité aux spécifications

Ce prototype respecte et améliore les exigences de la section 4.1 du TP1 :
- ✅ **6 pages créées** (au lieu de 5 - séparation connexion/inscription pour une meilleure UX)
- ✅ Page de connexion dédiée (meilleure pratique gouvernementale)
- ✅ Page d'inscription avec tous les champs requis
- ✅ Page de déclaration avec 4 sections (Profil, Revenus, Pièces, Revue)
- ✅ Tableau de bord avec suivi des déclarations et timeline de traitement
- ✅ Avis de cotisation automatisé
- ✅ Avis de cotisation personnalisé avec section "Motifs de l'ajustement"
- ✅ Design cohérent avec la charte visuelle gouvernementale
- ✅ Interface intuitive et accessible
- ✅ Navigation claire entre toutes les pages avec liens contextuels
