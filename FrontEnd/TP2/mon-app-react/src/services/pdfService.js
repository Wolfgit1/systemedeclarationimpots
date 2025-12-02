import jsPDF from 'jspdf'

class PdfService {
  genererAvisCotisation(avis, declaration, contribuable) {
    // Validation des données requises
    if (!avis || !declaration || !contribuable) {
        alert('Données manquantes pour générer le PDF');
        return;
    }

    if (!avis.numeroReference || avis.montantAPayer === undefined) {
        alert('Données de l\'avis incomplètes');
        return;
    }

    const doc = new jsPDF()
    let yPosition = 20
    
    // En-tête officielle
    this.addHeader(doc, yPosition);
    yPosition = 45
    
    // Section informations (réduite)
    yPosition = this.addInformations(doc, avis, declaration, contribuable, yPosition);
    
    // Section revenus
    yPosition = this.addRevenus(doc, declaration, yPosition + 10);
    
    // Section calcul impôt
    yPosition = this.addCalculImpôt(doc, declaration, avis, yPosition + 10);
    
    // Section résultat finale
    this.addResultatFinal(doc, avis, yPosition + 10);
    
    // Pied de page
    this.addFooter(doc);
    
    // Sauvegarder avec un nom de fichier simple
    const fileName = `avis-cotisation-${declaration.id}.pdf`;
    doc.save(fileName);
}

  addHeader(doc, yPosition) {
    doc.setFillColor(0, 51, 102) // Bleu Revenu Québec
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Gouvernement du Québec', 20, 15)
    doc.setFontSize(14)
    doc.text('Revenu Québec', 20, 25)
    
    doc.setFontSize(20)
    doc.text('AVIS DE COTISATION', 105, 35, { align: 'center' })
  }

  addInformations(doc, avis, declaration, contribuable, yPosition) {
    doc.setFillColor(240, 240, 240)
    doc.rect(15, yPosition, 180, 75, 'F') // RÉDUIT: 105 → 75
    
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORMATIONS', 20, yPosition + 8)
    
    doc.setFont('helvetica', 'normal')
    
    // Informations du contribuable (colonnes gauche)
    doc.text(`Nom: ${contribuable.prenom} ${contribuable.nom}`, 25, yPosition + 20)
    doc.text(`NAS: ${contribuable.nas}`, 25, yPosition + 30)
    doc.text(`Date de naissance: ${contribuable.dateNaissance ? new Date(contribuable.dateNaissance).toLocaleDateString('fr-CA') : 'Non spécifiée'}`, 25, yPosition + 40)
    doc.text(`Email: ${contribuable.email || 'Non spécifié'}`, 25, yPosition + 50)
    
    // Informations de l'avis (colonnes droite)
    doc.text(`Numéro de référence: ${avis.numeroReference}`, 110, yPosition + 20)
    doc.text(`Date d'émission: ${new Date(avis.dateGeneration).toLocaleDateString('fr-CA')}`, 110, yPosition + 30)
    doc.text(`Année fiscale: ${declaration.anneeFiscale}`, 110, yPosition + 40)
    doc.text(`Type: ${avis.estAutomatique ? 'Automatique' : 'Personnalisé'}`, 110, yPosition + 50)
    
    return yPosition + 75; // RÉDUIT: 105 → 75
  }

  addRevenus(doc, declaration, yPosition) {
    doc.setFont('helvetica', 'bold')
    doc.text('REVENUS DÉCLARÉS', 20, yPosition + 8)
    
    doc.setFont('helvetica', 'normal')
    let currentY = yPosition + 20;
    
    // En-tête du tableau
    doc.setFillColor(220, 220, 220)
    doc.rect(20, currentY - 5, 170, 8, 'F')
    doc.text('Type', 25, currentY)
    doc.text('Description', 80, currentY)
    doc.text('Montant', 150, currentY)
    
    currentY += 10;
    
    // Lignes des revenus
    declaration.requestItems.forEach((item) => {
      doc.text(item.typeDocument, 25, currentY)
      doc.text(item.description.substring(0, 30), 80, currentY) // Limiter la longueur
      doc.text(`${item.unitPrice.toFixed(2)} $`, 150, currentY)
      currentY += 8;
    });
    
    // Ligne totale
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL DES REVENUS:', 80, currentY + 5)
    doc.text(`${declaration.totalRevenus.toFixed(2)} $`, 150, currentY + 5)
    
    return currentY + 15;
  }

  addCalculImpôt(doc, declaration, avis, yPosition) {
    doc.setFont('helvetica', 'bold')
    doc.text('CALCUL DE L\'IMPÔT', 20, yPosition + 8)
    
    doc.setFont('helvetica', 'normal')
    doc.text(`Revenu imposable: ${declaration.totalRevenus.toFixed(2)} $`, 25, yPosition + 20)
    doc.text(`Taux d'imposition: 15%`, 25, yPosition + 30)
    doc.text(`Impôt brut: ${(declaration.totalRevenus * 0.15).toFixed(2)} $`, 25, yPosition + 40)
    
    // Ajouter les ajustements si présents
    if (!avis.estAutomatique && avis.motifsAjustement) {
      doc.text(`Ajustements: ${avis.motifsAjustement}`, 25, yPosition + 50)
    }
    
    return yPosition + 50;
  }

  addResultatFinal(doc, avis, yPosition) {
    doc.setFillColor(240, 240, 240)
    doc.rect(15, yPosition, 180, 25, 'F')
    
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    
    if (avis.montantAPayer > 0) {
      doc.setTextColor(255, 0, 0)
      doc.text(`MONTANT À PAYER: ${avis.montantAPayer.toFixed(2)} $`, 105, yPosition + 15, { align: 'center' })
    } else {
      doc.setTextColor(0, 128, 0)
      doc.text(`REMBOURSEMENT: ${Math.abs(avis.montantAPayer).toFixed(2)} $`, 105, yPosition + 15, { align: 'center' })
    }
  }

  addFooter(doc) {
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Document généré électroniquement - Valide sans signature', 105, 280, { align: 'center' })
    doc.text('Revenu Québec - 3800, rue de Marly Québec (Québec) G1X 4A5', 105, 285, { align: 'center' })
  }
}

export default new PdfService()