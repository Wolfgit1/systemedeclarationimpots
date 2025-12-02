using ApplicationFrontEnd.Core;
using ApplicationFrontEnd.Infrastructure;
using ApplicationFrontEnd.SharedKernel.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.ConsoleTestApp
{
    class Program
    {
        static async Task Main()
        {
            Test1();
            await Test2();
        }

        static void Test1()
        {
            // dirty code
            var context = new ApplicationFrontEndDBContext();

            // add a contribuable
            Contribuable aContribuable = new Contribuable("123456789", "Jean", "Tremblay", "jean.tremblay@email.com", "motdepasse123", new DateTime(1985, 5, 15));
            context.Contribuables.Add(aContribuable);
            context.SaveChanges();

            // add a request (déclaration)
            Request aRequest = new Request(aContribuable, 2024);
            aRequest.RevenusEmploi = 20000m;
            aRequest.AutresRevenus = 5000m;
            aRequest.AdressePostale = "123 Rue Test, Québec";
            aRequest.Telephone = "418-111-2222";
            aRequest.Citoyennete = "Canadienne";

            RequestItem aRequestItem = new RequestItem("Relevé d'emploi T4", 1, 0M);
            aRequestItem.TypeDocument = "T4";
            aRequestItem.CheminFichier = "/documents/t4_2024.pdf";
            aRequest.AddRequestItem(aRequestItem);

            aRequestItem = new RequestItem("Relevé de frais médicaux", 1, 0M);
            aRequestItem.TypeDocument = "MEDICAL";
            aRequestItem.CheminFichier = "/documents/frais_medicaux.pdf";
            aRequest.AddRequestItem(aRequestItem);

            context.Requests.Add(aRequest);
            foreach (RequestItem requestItem in aRequest.RequestItems)
                context.RequestItems.Add(requestItem);
            context.SaveChanges();

            // add a second request
            aRequest = new Request(aContribuable, 2023);
            aRequest.RevenusEmploi = 18000m;
            aRequest.AutresRevenus = 2000m;
            aRequest.AdressePostale = "123 Rue Test, Québec";
            aRequest.Telephone = "418-111-2222";
            aRequest.Citoyennete = "Canadienne";

            aRequestItem = new RequestItem("Relevé d'emploi 2023", 1, 0M);
            aRequestItem.TypeDocument = "T4";
            aRequestItem.CheminFichier = "/documents/t4_2023.pdf";
            aRequest.AddRequestItem(aRequestItem);

            context.Requests.Add(aRequest);
            foreach (RequestItem requestItem in aRequest.RequestItems)
                context.RequestItems.Add(requestItem);
            context.SaveChanges();

            // add another contribuable
            Contribuable anotherContribuable = new Contribuable("987654321", "Toto", "Toto", "toto@uqar.ca", "toto", new DateTime(1990, 5, 15));
            context.Contribuables.Add(anotherContribuable);
            context.SaveChanges();

            // add a request for him
            aRequest = new Request(anotherContribuable, 2024);
            aRequest.RevenusEmploi = 22000m;
            aRequest.AutresRevenus = 3000m;
            aRequest.AdressePostale = "456 Autre Rue, Montréal";
            aRequest.Telephone = "514-333-4444";
            aRequest.Citoyennete = "Canadienne";

            aRequestItem = new RequestItem("Relevé d'emploi principal", 1, 0M);
            aRequestItem.TypeDocument = "T4";
            aRequestItem.CheminFichier = "/documents/t4_principal.pdf";
            aRequest.AddRequestItem(aRequestItem);

            context.Requests.Add(aRequest);
            foreach (RequestItem requestItem in aRequest.RequestItems)
                context.RequestItems.Add(requestItem);
            context.SaveChanges();

            Console.WriteLine("Test1 terminé avec succès !");
            Console.WriteLine($"Contribuable 1: {aContribuable.Prenom} {aContribuable.Nom}");  // CORRECTION
            Console.WriteLine($"Contribuable 2: {anotherContribuable.Prenom} {anotherContribuable.Nom}");  // CORRECTION
            Console.WriteLine("Données de test ajoutées à la base de données.");
        }

        static async Task Test2()
        {
            using (ApplicationFrontEndDBContext context = new ApplicationFrontEndDBContext())
            {
                IAsyncRepository<Contribuable> ar = new EfRepository<Contribuable>(context);
                Contribuable aContribuable = await ar.GetByIdAsync(1);
                if (aContribuable != null)
                    System.Console.WriteLine(aContribuable.Email);
                else System.Console.WriteLine("Contribuable not found");
            }
        }
    }
}