> Hierbij de omschrijving van wat ik eigenlijk van plan was om voor eind maart te doen (samen met Mo). Als we dat met turnleaf kunnen doen sparen we zeker tijd ![:slightly_smiling_face:](https://a.slack-edge.com/production-standard-emoji-assets/15.0/apple-medium/1f642@2x.png).
>
> *De interfacing tussen onze eigen midoffice applicatie (PratoFlex) en de Earnie loonmotor gebeurt via messaging.*
> *We hebben alle berichten die uitgewisseld moeten worden en die dus volstaan om de Earnie loonmotor te voeden als c# classes te beschikking.*
> *De PratoFlex midoffice bestaat eigenlijk gewoon uit een aantal schermen waarvan voor Earnie het nut is dat de velden die nodig zijn voor Earnie beheerd/gevalideerd kunnen worden voordat ze doorgestuurd worden.*
> *We hebben echter geen midoffice voor vaste verloning.*
> *Hetgeen we willen doen is dus aan de hand van de berichten die nodig zijn voor Earnie een middoffice applicatie laten genereren die dienst kan doen om die data te beheren.*
> *Hetgeen we nog niet hebben zijn de validatieregels die op deze opbjecten van toepassing zijn hebben we momenteel niet in code. Deze kunnen toegevoegd worden door onze functioneel analisten als teks of eventueel in de C# code van de berichten als validatie-code.*
> *Momenteel is onze stack Angular voor de front-end, C# (.net 8) in de backend, met een Postgresql database.*
> *C# en postgresql zijn duidelijke voorkeuren. Angular kan zondermeer ingewisseld worden voor een andere technologie.*
>
> *Een voorbeeldje van een bericht waarvoor een scherm zou moeten bestaan is PersoonGewijzigd:*
>
> 
>
> ```
> namespace Elvive.Berichten.Persoon
> {
>     [Message]
>     public class PersoonGewijzigd
>     {
>         [JsonProperty(Order = 1)]
>         public string PersoonReferentieId { get; set; }
> 
>         [JsonProperty(Order = 2)]
>         public string WerkgeverReferentieId { get; set; }
> 
>         [JsonProperty(Order = 0)]
>         public DateTime RecordDatum { get; set; }
> 
>         [JsonProperty(Order = 3)]
>         public List<PersoonSnapshot> PersoonSnapshots { get; set; }
>     }
> }
> ```
>
> 
>
> Een persoongewijzigd bericht bevat een reeks snapshots van fiscale data voor personen. Ene dergelijke snapshot geeft een beeld van hoe de fiscale gegevens van een persoon wijzigen over gans zijn tijdslijn.
> Een snapshot is van toepassing tussen zijn aanvangsdatum en de aanvangsdatum van de volgende snapshot.
>
> 
>
> ```
> namespace Elvive.Berichten.Persoon
> {
>     public class PersoonSnapshot
>     {
>         [JsonProperty(Order = 0)]
>         public DateTime AanvangsDatum { get; set; }
> 
>         [JsonProperty(Order = 1)]
>         public List<string> Werknemerskengetallen { get; set; }
> 
>         [JsonProperty(Order = 2)]
>         public DateTime? DatumInDienst { get; set; }
> 
>         [JsonProperty(Order = 5)]
>         public DateTime? GepensioneerdVanaf { get; set; }
> 
>         [JsonProperty(Order = 6)]
>         public string INSZNummer { get; set; }
> 
>         [JsonProperty(Order = 7)]
>         public string FamilieNaam { get; set; }
> 
>         [JsonProperty(Order = 8)]
>         public string Voornaam { get; set; }
> 
>         [JsonProperty(Order = 9)]
>         public Geslacht Geslacht { get; set; }
> 
>         [JsonProperty(Order = 10)]
>         public string Straat { get; set; }
> 
>         [JsonProperty(Order = 11)]
>         public string Huisnummer { get; set; }
> 
>         [JsonProperty(Order = 12)]
>         public string Bus { get; set; }
> 
>         [JsonProperty(Order = 13)]
>         public string Gemeente { get; set; }
> 
>         [JsonProperty(Order = 14)]
>         public string PostCode { get; set; }
> 
>         [JsonProperty(Order = 15)]
>         public string Land { get; set; }
> 
>         [JsonProperty(Order = 16)]
>         public string IBAN { get; set; }
> 
>         [JsonProperty(Order = 17)]
>         public string BIC { get; set; }
> 
>         [JsonProperty(Order = 18)]
>         public BurgerlijkeStaat? BurgerlijkeStaat { get; set; }
> 
>         [JsonProperty(Order = 19)]
>         public TypeBVBerekening? TypeBvBerekening { get; set; }
> 
>         [JsonProperty(Order = 20)]
>         public decimal? VastBvPercentage { get; set; }
> 
>         [JsonProperty(Order = 21)]
>         public bool? Mindervalide { get; set; }
> 
>         [JsonProperty(Order = 22)]
>         public PartnerInkomsten? PartnerInkomsten { get; set; }
> 
>         [JsonProperty(Order = 23)]
>         public bool? PartnerMindervalide { get; set; }
> 
>         [JsonProperty(Order = 24)]
>         public int? AantalKinderenTenLaste { get; set; }
> 
>         [JsonProperty(Order = 25)]
>         public int? AantalMindervalideKinderenTenLaste { get; set; }
> 
>         [JsonProperty(Order = 26)]
>         public int? AantalOuderePersonenTenLaste { get; set; }
> 
>         [JsonProperty(Order = 27)]
>         public int? AantalMindervalideOuderePersonenTenLaste { get; set; }
> 
>         [JsonProperty(Order = 28)]
>         public int? AantalAnderePersonenTenLaste { get; set; }
> 
>         [JsonProperty(Order = 29)]
>         public int? AantalAndereMindervalidePersonenTenLaste { get; set; }
> 
>         [JsonProperty(Order = 30)]
>         public int? AantalZorgbehoevendeOuderePersonenTenLaste { get; set; }
> 
>         [Obsolete]
>         [JsonProperty(Order = 31)]
>         public List<Periode> GrensArbeiderPeriodes { get; set; }
> 
>         [JsonProperty(Order = 32)]
>         public DateTime? Geboortedatum { get; set; }
> 
>         [JsonProperty(Order = 33)]
>         public string GeboortePlaats { get; set; }
> 
>         [JsonProperty(Order = 34)]
>         public Taal Taal { get; set; }
> 
>         [JsonProperty(Order = 35)]
>         public string EmailLoonbrief { get; set; }
>     }
> }
> ```