# Prato Midoffice Earnie Fix - MVP beschrijving

## Details werkgever

Je vertrekt van de werkgever om lonen te verwerken. Dit is een eenvoudig scherm met enkele

basisgegevens van de werkgever (Details bericht zie appendix).

## Overzichtsscherm voor controle van de lonen

Op dit scherm krijg je een lijst van personen met een lopend contract bij de werkgever uit vorige stap in

een bepaalde periode (te selecteren). Dat zijn dus alle personen die voor die periode een loon(brief)

moeten krijgen. De contracten worden gepubliceerd via een ContractGewijzigd-bericht (details zie

appendix).

In de lijst zie je o.a. de volgende gegevens:

- id van de persoon
- naam en voornaam
- type werknemer (arbeider, bediende, flexi, jobstudent, …)
- aanduiding als er meldingen zijn (blokkerend of waarschuwend)
- status van het loon (te berekenen, te controleren, klaargezet, afgesloten, betaald)



Als je een persoon aanklikt, moet je de details van de loonberekening kunnen zien (liefst op hetzelfde

scherm, om geen tijd te verliezen bij openen van een nieuw scherm). De details van de loonberekening

zitten in het LoonberekeningBepaald-berich (details zie appendix)t.

De volgende gegevens moeten getoond worden op het scherm:

- kalender met arbeidstijdgegevens (d.w.z. hoeveel uren heeft de persoon per dag gewerkt of
- welke types van afwezigheid zijn er geboekt, vb. vakantie, ziekte, …)
- bruto-netto-berekening
- meldingen
- (is er al een voorschot betaald aan deze persoon)
- (eventueel vooraf ingegeven opmerkingen)
- beknopte info van de persoon + link naar detailscherm van de persoon met alle gegevens
- beknopte info van het contract + link naar detailscherm van het contract met alle gegevens
- verloftellers

## Appendix

Details persoon

Scherm met basisgegevens van de persoon te genereren o.b.v.

https://prodelviveberichtenwa.azurewebsites.net/Berichten#Elvive_Berichten_Persoon_PersoonGewijzigd

namespace Elvive.Berichten.Persoon

`{`

`[Message]`

`public class PersoonGewijzigd`

`{`

`[JsonProperty(Order = 1)]`

`public string PersoonReferentieId { get; set; }`

`[JsonProperty(Order = 2)]`

`public string WerkgeverReferentieId { get; set; }`

`[JsonProperty(Order = 0)]`

`public DateTime RecordDatum { get; set; }`

`[JsonProperty(Order = 3)]`

`public List<PersoonSnapshot> PersoonSnapshots { get; set; }`

`}`

`}`



Een PersoonGewijzigd-bericht bevat een reeks snapshots van fiscale data voor personen. Een

dergelijke snapshot geeft een beeld van hoe de fiscale gegevens van een persoon wijzigen in de tijd.

Een snapshot is van toepassing tussen zijn aanvangsdatum en de aanvangsdatum van de volgende

snapshot.



`namespace Elvive.Berichten.Persoon`

`{`

`public class PersoonSnapshot`

`{`

`[JsonProperty(Order = 0)]`

`public DateTime AanvangsDatum { get; set; }`

`[JsonProperty(Order = 1)]`

`public List<string> Werknemerskengetallen { get; set; }`

`[JsonProperty(Order = 2)]`

`public DateTime? DatumInDienst { get; set; }`

`[JsonProperty(Order = 5)]`

`public DateTime? GepensioneerdVanaf { get; set; }`

`[JsonProperty(Order = 6)]`

`2public string INSZNummer { get; set; }`

`[JsonProperty(Order = 7)]`

`public string FamilieNaam { get; set; }`

`[JsonProperty(Order = 8)]`

`public string Voornaam { get; set; }`

`[JsonProperty(Order = 9)]`

`public Geslacht Geslacht { get; set; }`

`[JsonProperty(Order = 10)]`

`public string Straat { get; set; }`

`[JsonProperty(Order = 11)]`

`public string Huisnummer { get; set; }`

`[JsonProperty(Order = 12)]`

`public string Bus { get; set; }`

`[JsonProperty(Order = 13)]`

`public string Gemeente { get; set; }`

`[JsonProperty(Order = 14)]`

`public string PostCode { get; set; }`

`[JsonProperty(Order = 15)]`

`public string Land { get; set; }`

`[JsonProperty(Order = 16)]`

`public string IBAN { get; set; }`

`[JsonProperty(Order = 17)]`

`public string BIC { get; set; }`

`[JsonProperty(Order = 18)]`

`public BurgerlijkeStaat? BurgerlijkeStaat { get; set; }`

`[JsonProperty(Order = 19)]`

`public TypeBVBerekening? TypeBvBerekening { get; set; }`

`[JsonProperty(Order = 20)]`

`public decimal? VastBvPercentage { get; set; }`

`[JsonProperty(Order = 21)]`

`public bool? Mindervalide { get; set; }`

`[JsonProperty(Order = 22)]`

`public PartnerInkomsten? PartnerInkomsten { get; set; }`

`[JsonProperty(Order = 23)]`

`public bool? PartnerMindervalide { get; set; }`

`[JsonProperty(Order = 24)]`

`3public int? AantalKinderenTenLaste { get; set; }`

`[JsonProperty(Order = 25)]`

`public int? AantalMindervalideKinderenTenLaste { get; set; }`

`[JsonProperty(Order = 26)]`

`public int? AantalOuderePersonenTenLaste { get; set; }`

`[JsonProperty(Order = 27)]`

`public int? AantalMindervalideOuderePersonenTenLaste { get; set; }`

`[JsonProperty(Order = 28)]`

`public int? AantalAnderePersonenTenLaste { get; set; }`

`[JsonProperty(Order = 29)]`

`public int? AantalAndereMindervalidePersonenTenLaste { get; set; }`

`[JsonProperty(Order = 30)]`

`public int? AantalZorgbehoevendeOuderePersonenTenLaste { get; set; }`

`[Obsolete]`

`[JsonProperty(Order = 31)]`

`public List<Periode> GrensArbeiderPeriodes { get; set; }`

`[JsonProperty(Order = 32)]`

`public DateTime? Geboortedatum { get; set; }`

`[JsonProperty(Order = 33)]`

`public string GeboortePlaats { get; set; }`

`[JsonProperty(Order = 34)]`

`public Taal Taal { get; set; }`

`[JsonProperty(Order = 35)]`

`public string EmailLoonbrief { get; set; }`

`}`

`}`



## Details contract

Scherm met basisgegevens van het contract te genereren o.b.v.

https://prodelviveberichtenwa.azurewebsites.net/Berichten#Elvive_Berichten_Contract_ContractGewijzigd



`namespace Elvive.Berichten.Contract`

`{`

`[Message]`

`public class ContractGewijzigd`

`{`

`[JsonProperty(Order = 0)]`

`public DateTime RecordDatum { get; set; }`

`[JsonProperty(Order = 1)]`

`4public string ContractReferentieId { get; set; }`

`[JsonProperty(Order = 2)]`

`public bool Reset { get; set; }`

`[JsonProperty(Order = 3)]`

`public List<ContractSnapshot> ContractSnapshots { get; set; }`

`[JsonProperty(Order = 4)]`

`public int? TotaalAantalContractSnapshots { get; set; }`

`[JsonProperty(Order = 5)]`

`public string EventId { get; set; }`

`}`

`}`



Het ContractGewijzigd-bericht bevat, net zoals dat van de persoon, een lijst met snapshots.

Een individuele snapshot bevat volgende velden:



`public class ContractSnapshot`

`{`

`[JsonProperty(Order = 0)]`

`public DateTime AanvangsDatum { get; set; }`

`[JsonProperty(Order = 1)]`

`public DateTime BeginDatum { get; set; }`

`[JsonProperty(Order = 2)]`

`public DateTime? EindDatum { get; set; }`

`[JsonProperty(Order = 3)]`

`[Obsolete("Het vestigingnummer zal bepaald moeten worden door te`

`luisteren naar VestigingseenheidGewijzigd berichten")]`

`public string Vestigingsnummer { get; set; }`

`[JsonProperty(Order = 4)]`

`public string WerkgeverReferentieId { get; set; }`

`[JsonProperty(Order = 5)]`

`public string WerkgeversCategorie { get; set; }`

`[JsonProperty(Order = 6)]`

`public string PersoonReferentieId { get; set; }`

`[JsonProperty(Order = 7)]`

`public string VestigingseenheidReferentieId { get; set; }`

`[JsonProperty(Order = 8)]`

`public string OmzetkantoorReferentieId { get; set; }`

`[JsonProperty(Order = 9)]`

`5public string KlantReferentieId { get; set; }`

`[JsonProperty(Order = 10)]`

`public string WerknemersKengetal { get; set; }`

`[JsonProperty(Order = 11)]`

`public string ParitairComite { get; set; }`

`[JsonProperty(Order = 12)]`

`public Gewest? Gewest { get; set; }`

`[JsonProperty(Order = 13)]`

`public Arbeidsstelsel Arbeidsstelsel { get; set; }`

`[JsonProperty(Order = 14)]`

`public bool VoorwaardenBvVrijstellingPloegenarbeidVoldaan { get; set; }`

`[JsonProperty(Order = 15)]`

`public bool VoorwaardenBvVrijstellingNachtarbeidVoldaan { get; set; }`

`[JsonProperty(Order = 16)]`

`public bool VoorwaardenBvVrijstellingVolcontinuVoldaan { get; set; }`

`[JsonProperty(Order = 17)]`

`public bool VoorwaardenBvVrijstellingOnroerendeStaatVoldaan { get; set;`

`}`

`[JsonProperty(Order = 18)]`

`public bool VoorwaardenBVVrijstellingPloegenarbeidBISVoldaan { get; set;`

`}`

`[JsonProperty(Order = 19)]`

`public bool VoorwaardenBVVrijstellingVolcontinuBISVoldaan { get; set; }`

`[JsonProperty(Order = 20)]`

`public Bezoldigingswijze? Bezoldigingswijze { get; set; }`

`[JsonProperty(Order = 21)]`

`public VerloningsPeriodiciteit VerloningsPeriodiciteit { get; set; }`

`[JsonProperty(Order = 22)]`

`public Loon Loon { get; set; }`

`[JsonProperty(Order = 23)]`

`public MaatregelTotBevorderingWerkgelegenheid?`

`MaatregelTotBevorderingWerkgelegenheid { get; set; }`

`[JsonProperty(Order = 24)]`

`public MaatregelTotReorganisatieArbeidstijd?`

`MaatregelTotReorganisatieArbeidstijd { get; set; }`

`6[JsonProperty(Order = 25)]`

`[Obsolete("NotieVrijstellingPrestaties is iets wat berekend wordt bij`

`het genereren van een DmfA aangifte")]`

`public bool NotieVrijstellingPrestaties { get; set; }`

`[JsonProperty(Order = 26)]`

`public bool NotieLaattijdigeFlexi { get; set; }`

`[JsonProperty(Order = 27)]`

`public string WerknemersStatuut { get; set; }`

`[JsonProperty(Order = 28)]`

`public Cyclus Cyclus { get; set; }`

`[JsonProperty(Order = 29)]`

`public string Functie { get; set; }`

`[JsonProperty(Order = 30)]`

`public TypeContract TypeContract { get; set; }`

`[JsonProperty(Order = 31)]`

`[Obsolete("De plaats van de vestiging zal bepaald moeten worden door te`

`luisteren naar VestigingseenheidGewijzigd berichten")]`

`public string PlaatsVestiging { get; set; }`

`[JsonProperty(Order = 32)]`

`public string PlaatsVanTewerkstelling { get; set; }`

`[JsonProperty(Order = 33)]`

`public VoltijdsReferentieRegime VoltijdsReferentieRegime { get; set; }`

`[JsonProperty(Order = 34)]`

`public decimal? WerkgeversbijdrageMaaltijdcheque { get; set; }`

`[JsonProperty(Order = 35)]`

`public bool MaaltijdchequesManueelToegekend { get; set; }`

`[JsonProperty(Order = 36)]`

`public bool StarterJob { get; set; }`

`[JsonProperty(Order = 37)]`

`public Taalgebied? Taalgebied { get; set; }`

`[JsonProperty(Order = 38)]`

`public Facturatie Facturatie { get; set; }`

`[JsonProperty(Order = 39)]`

`public TypeForfait? TypeForfait { get; set; }`

`[JsonProperty(Order = 40)]`

`public string ProfielReferentieId { get; set; }`

`7[JsonProperty(Order = 41)]`

`public string TypeWerknemerDimona { get; set; }`

`[JsonProperty(Order = 42)]`

`public string Tikkaartnummer { get; set; }`

`[JsonProperty(Order = 43)]`

`public bool BuitenlandseLoonbelasting { get; set; }`

`}`



## Details werkgever

Een werkgevergewijzigd bericht ziet eruit als volgt:



`using Elvive.Berichten.Common;`

`using Newtonsoft.Json;`

`using System;`

`using System.Collections.Generic;`

`using Elvive.Berichten.Persoon;`



`namespace Elvive.Berichten.Werkgever`

`{`

`[Message]`

`public class WerkgeverGewijzigd`

`{`

`[JsonProperty(Order = 0)]`

`public DateTime RecordDatum { get; set; }`

`[JsonProperty(Order = 1)]`

`public DateTime Aanvangsdatum { get; set; }`

`[JsonProperty(Order = 2)]`

`public string WerkgeverReferentieId { get; set; }`

`[JsonProperty(Order = 3)]`

`public string OndernemingsNummer { get; set; }`

`[JsonProperty(Order = 4)]`

`public string RSZNummer { get; set; }`

`[JsonProperty(Order = 5)]`

`public string MaatschappelijkeNaam { get; set; }`

`[JsonProperty(Order = 6)]`

`public string Vennootschapsvorm { get; set; }`

`[JsonProperty(Order = 7)]`

`public string BTWNummer { get; set; }`

`[JsonProperty(Order = 8)]`

`public string RechtspersonenRegister { get; set; }`

`8[JsonProperty(Order = 9)]`

`public Adres Adres { get; set; }`

`[JsonProperty(Order = 10)]`

`public Rekeningnummer Rekeningnummer { get; set; }`

`[JsonProperty(Order = 11)]`

`public List<WerkgeversCategorieDetail> WerkgeversCategorieDetails {`

`get; set; }`

`[JsonProperty(Order = 12)]`

`public List<string> ParitaireComites { get; set; }`

`[JsonProperty(Order = 13)]`

`public int? Belangrijkheidscode { get; set; }`

`[JsonProperty(Order = 14)]`

`public bool? NotieCuratele { get; set; }`

`[JsonProperty(Order = 15)]`

`public DateTime? BegindatumVakantieperiode { get; set; }`

`[JsonProperty(Order = 16)]`

`public string Email { get; set; }`

`[JsonProperty(Order = 17)]`

`public string Telefoon { get; set; }`

`[JsonProperty(Order = 18)]`

`public Ontvangstkantoor Ontvangstkantoor { get; set; }`

`[JsonProperty(Order = 19)]`

`public List<VrijstellingType> Vrijstellingen { get; set; }`

`[JsonProperty(Order = 20)]`

`public bool BetaaltBvZelf { get; set; }`

`[JsonProperty(Order = 21)]`

`public Periodiciteit Periodiciteit { get; set; }`

`[JsonProperty(Order = 22)]`

`public ChequeLeverancier? ChequeLeverancier { get; set; }`

`[JsonProperty(Order = 23)]`

`public string Erkenningsnummer { get; set; }`

`[JsonProperty(Order = 24)]`

`public bool DMFAVoorschotten { get; set; }`

`[JsonProperty(Order = 25)]`

`9public bool DMFABetalingDoorWerkgever { get; set; }`

`[JsonProperty(Order = 26)]`

`public string DMFAFactuurVrijeTekst { get; set; }`

`[JsonProperty(Order = 27)]`

`public Fonds Kinderbijslagfonds { get; set; }`

`[JsonProperty(Order = 28)]`

`public Fonds Vakantiefonds { get; set; }`

`[JsonProperty(Order = 29)]`

`public Verzekering Wetsverzekering { get; set; }`

`[JsonProperty(Order = 30)]`

`public Boekhouding Boekhouding { get; set; }`

`[JsonProperty(Order = 31)]`

`public Taal Taal { get; set; }`

`[JsonProperty(Order = 32)]`

`public BerekeningswijzeEenDerdeNormBVPloegen?`

`BerekeningswijzeEenDerdeNormBVPloegen { get; set; }`

`[JsonProperty(Order = 33)]`

`public string Website { get; set; }`

`[JsonProperty(Order = 34)]`

`public Rekeningnummer RekeningnummerLonen { get; set; }`

`}`

`}`



## LoonberekeningBepaald

Een loonberekeningBepaald bericht ziet eruit als volgt:



`[Message]`

`public class LoonberekeningBepaald : IOndersteundExternBewaardeInhoud`

`{`

`[JsonProperty(Order = 0)]`

`public string LoonberekeningReferentieId { get; set; }`

`[JsonProperty(Order = 1)]`

`public string PersoonReferentieId { get; set; }`

`[JsonProperty(Order = 2)]`

`public string WerknemersKengetal { get; set; }`

`[JsonProperty(Order = 3)]`

`public string WerkgeverReferentieId { get; set; }`

`[JsonProperty(Order = 4)]`

`public string WerkgeversCategorie { get; set; }`

`10[JsonProperty(Order = 5)]`

`public int FiscaalJaar { get; set; }`

`[JsonProperty(Order = 6)]`

`public Loonperiode Loonperiode { get; set; }`

`[JsonProperty(Order = 7)]`

`public IEnumerable<Arbeidstijdgegeven> Arbeidstijdgegevens { get; set; }`

`[JsonProperty(Order = 8)]`

`public BrutoloonBerekening BrutoloonBerekening { get; set; }`

`[JsonProperty(Order = 9)]`

`public WerknemersbijdrageRSZBerekening WerknemersbijdrageRSZBerekening {`

`get; set; }`

`[JsonProperty(Order = 10)]`

`public BelastbaarTotaalBerekening BelastbaarTotaalBerekening { get; set;`

`}`

`[JsonProperty(Order = 11)]`

`public BedrijfsvoorheffingBerekening BedrijfsvoorheffingBerekening {`

`get; set; }`

`[JsonProperty(Order = 12)]`

`public BijzondereBijdrageSocialeZekerheidBerekening`

`BijzondereBijdrageSocialeZekerheidBerekening { get; set; }`

`[JsonProperty(Order = 13)]`

`public NettoloonBerekening NettoloonBerekening { get; set; }`

`[JsonProperty(Order = 14)]`

`public string Url { get; set; }`

`[JsonProperty(Order = 15)]`

`public IEnumerable<LoonbepalingMelding> LoonbepalingMeldingen { get;`

`set; }`

`set; }`

`[JsonProperty(Order = 16)]`

`public IEnumerable<LoonberekeningMelding> LoonberekeningMeldingen { get;`

`[JsonProperty(Order = 17)]`

`public DateTime Berekeningsdatum { get; set; }`

`[JsonProperty(Order = 18)]`

`public IEnumerable<LoonbeslagBerekening> LoonbeslagBerekeningen { get;`

`set; }`

`[JsonProperty(Order = 19)]`

`11public WerkuitkeringBerekening WerkuitkeringBerekening { get; set; }`

`[JsonProperty(Order = 20)]`

`public string BerekeningType { get; set; }`

`[JsonProperty(Order = 21)]`

`public string BerichtUrl { get; set; }`

`}`

