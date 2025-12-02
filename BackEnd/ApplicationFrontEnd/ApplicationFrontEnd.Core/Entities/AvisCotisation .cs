using ApplicationFrontEnd.SharedKernel;
using System;

namespace ApplicationFrontEnd.Core
{
    public class AvisCotisation : BaseEntity
    {
        public string NumeroReference { get; set; } = Guid.NewGuid().ToString();
        public DateTime DateGeneration { get; set; } = DateTime.Now;
        public decimal MontantAPayer { get; set; }
        public bool EstAutomatique { get; set; }
        public string? MotifsAjustement { get; set; }

        // Navigation property
        public int RequestId { get; set; }
        public virtual Request Request { get; set; }

        public AvisCotisation()
        {
            // exigé par EF
        }
    }
}