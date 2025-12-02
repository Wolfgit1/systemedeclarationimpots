using ApplicationFrontEnd.SharedKernel;
using System;

namespace ApplicationFrontEnd.Core
{
    public class RequestItem : BaseEntity
    {
        public string Description { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        // Pour les documents justificatifs
        public string TypeDocument { get; set; } = string.Empty;
        public string CheminFichier { get; set; } = string.Empty;
        public DateTime DateUpload { get; set; } = DateTime.Now;

        // Navigation property
        public int RequestId { get; set; }
        public virtual Request Request { get; set; }

        public decimal TotalPrice()
        {
            return UnitPrice * Quantity;
        }

        public RequestItem()
        {
            // exigé par EF
        }

        public RequestItem(string description, int quantity, decimal unitPrice)
        {
            Description = description;
            Quantity = quantity;
            UnitPrice = unitPrice;
        }
    }
}