# Functionele beschrijving van de te bouwen applicatie
We willen een mid-office applicatie bouwen die vooral CRUD functionaliteit bevat.
De eerste functionaliteit die moet voorzien worden in de applicatie dient voor het beheer van persoonsgegevens.
Persoonsgevens wijzigen over de tijd.  De applicatie moet geschikt zijn om de volledige historiek van een persoon te beheren.
Een persoon wordt in C# gemodelleerd door volgende class:

    public class PersoonGewijzigd
    {
        public string PersoonReferentieId { get; set; }
        public string WerkgeverReferentieId { get; set; }
        public List<PersoonSnapshot> PersoonSnapshots { get; set; }
    }
	
De PersoonSnaphosts bevatten de details van een bepaalde persoon in een bepaalde periode van zijn leven.
De PersoonSnapshot class ziet eruit vals volgt:

    public class PersoonSnapshot
    {
        public DateTime AanvangsDatum { get; set; }
        public List<string> Werknemerskengetallen { get; set; }
        public DateTime? DatumInDienst { get; set; }
        public DateTime? GepensioneerdVanaf { get; set; }
        public string INSZNummer { get; set; }
        public string FamilieNaam { get; set; }
        public string Voornaam { get; set; }
        public Geslacht Geslacht { get; set; } // dit kan zijn Man, Vrouw of X
        public string Straat { get; set; }
        public string Huisnummer { get; set; }
        public string Bus { get; set; }
        public string Gemeente { get; set; }
        public string PostCode { get; set; }
        public string Land { get; set; }
        public string IBAN { get; set; }
        public string BIC { get; set; }
        public BurgerlijkeStaat? BurgerlijkeStaat { get; set; } // dit kan zijn Ongehuwd, Gehuwd, Weduwe, WettelijkGescheiden, FeitelijkGescheiden, Samenwonend, FeitelijkSamenwonend, ScheidingVanTafelEnBed 
        public TypeBVBerekening? TypeBvBerekening { get; set; } // dit kan zijn         VastPercentage, Schalen
        public decimal? VastBvPercentage { get; set; }
        public bool? Mindervalide { get; set; }
        public PartnerInkomsten? PartnerInkomsten { get; set; } // dit kan zijn         EigenInkomsten, EigenInkomstenOnderGrens3, EigenInkomstenOnderGrens2, EigenInkomstenOnderGrens1, GeenEigenInkomsten
        public bool? PartnerMindervalide { get; set; }
        public int? AantalKinderenTenLaste { get; set; }
        public int? AantalMindervalideKinderenTenLaste { get; set; }
        public int? AantalOuderePersonenTenLaste { get; set; }
        public int? AantalMindervalideOuderePersonenTenLaste { get; set; }
        public int? AantalAnderePersonenTenLaste { get; set; }
        public int? AantalAndereMindervalidePersonenTenLaste { get; set; }
        public int? AantalZorgbehoevendeOuderePersonenTenLaste { get; set; }
        public DateTime? Geboortedatum { get; set; }
        public string GeboortePlaats { get; set; }
        public Taal Taal { get; set; } // dit kan zijn Nederlands of Frans
        public string EmailLoonbrief { get; set; }
    }
	
Een persoon snapshot is voor ene persoon geldig vanaf de AanvangsDatum van de snaphot tot de aanvangsdatum van de volgende snapshot.
Maak schermen waarbij we al deze data kunnen bekijken en editeren over gans de levenscyclus van een persoon.
Groepeer data die logisch gezien bij elkaar horen ook op de schermen.	

# Technische beschrijving van de te bouwen applicatie
De applicatie dient te bestan uit 3 lagen: UI, services en database.
Voor de UI moet gebruik gemaakt worden van Angular, Typsecipt, bootstrap.  Het gebruik van primeNG is een optie.
Voor de services gebruiken we C# .net 8.  De services worden vanuit de UI aangesproken met behulp van REST calls.  Het persisteren van data naar de database gebeurt door middel van Dapper. We gebruiken AutoFac voor dependency injection.
Als database gebruiken we postgresql.

# Guidelines te volgen bij de bouw van de applicatie
### Componenten & Templates
- **Logica-vrije Templates:** Houd logica in de TypeScript-class. Templates moeten declaratief zijn.
- **i18n Mandaat:** Elke string die zichtbaar is voor de gebruiker **moet** een `i18n`-attribuut hebben. Zorg dat vertalings-ID's uniek en beschrijvend zijn.
- **Smart vs. Dumb Componenten:** Geef de voorkeur aan kleine, herbruikbare "dumb" componenten (met `@Input` en `@Output`) voor de UI, terwijl "smart" componenten de data-afhandeling regelen.
- **Change Detection:** Wees alert op dure berekeningen in getters of methoden die direct vanuit templates worden aangeroepen (gebruik in plaats daarvan Pipes).

### Services & RxJS
- **Unsubscribe:** Voorkom geheugenlekken. Gebruik waar mogelijk de `async` pipe in templates, of gebruik `takeUntil`-patronen met een `Subject`.
- **Side Effects:** Houd services waar mogelijk stateless. Gebruik `Observable` streams om data te verspreiden.
- **Error Handling:** Zorg altijd voor een catch-blok of een strategie voor foutafhandeling bij HTTP-aanroepen.

---

### TypeScript Standaarden
- **Strong Typing:** Vermijd `any`. Gebruik `unknown` als een type onbekend is.
- **Null Safety:** Zelfs als strikte null-checks zijn uitgeschakeld, gebruik expliciet `Type | null` voor eigenschappen die leeg kunnen zijn om de intentie aan te geven.
- **Immutability:** Gebruik `readonly` voor eigenschappen die na initialisatie niet mogen veranderen. Geef de voorkeur aan `const` boven `let`.
- **Modellen:** Gebruik het vastgestelde patroon van op classes gebaseerde modellen met `Object.assign(this, input)` voor eenvoudige instantiëring en type-veiligheid.

---

### UI & Styling (Bootstrap & PrimeNG)
- **Grid Integriteit:** Respecteer altijd het 12-koloms Bootstrap-grid. Zorg dat rijen optellen tot 12 of gebruik auto-layout.
- **Utility First:** Gebruik Bootstrap utility classes (bijv. `px-2`, `mt-3`) voordat je aangepaste CSS schrijft.
- **Custom SCSS:** Plaats globale stijlen in `styles.scss` onder de `@layer app` en lokale stijlen in component-specifieke `.scss` bestanden.

## Service Layer Best Practices
### Controller classes 
- Contollers bevatten geen logica.  Controllers maken gebruiken van service-classes om logica uit te voeren

### Service classes
- Alle logica zit in service classes.  


