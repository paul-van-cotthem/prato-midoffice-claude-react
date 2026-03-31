// ─── Enum string unions ────────────────────────────────────────────────────────

export type Geslacht = 'Man' | 'Vrouw' | 'X'
export type BurgerlijkeStaat =
  | 'Ongehuwd'
  | 'Gehuwd'
  | 'Weduwe'
  | 'WettelijkGescheiden'
  | 'FeitelijkGescheiden'
  | 'Samenwonend'
  | 'FeitelijkSamenwonend'
  | 'ScheidingVanTafelEnBed'
export type TypeBVBerekening = 'VastPercentage' | 'Schalen'
export type PartnerInkomsten =
  | 'EigenInkomsten'
  | 'EigenInkomstenOnderGrens3'
  | 'EigenInkomstenOnderGrens2'
  | 'EigenInkomstenOnderGrens1'
  | 'GeenEigenInkomsten'
export type Taal = 'Nederlands' | 'Frans'
export type Gewest = 'Vlaanderen' | 'Wallonie' | 'Brussel'
export type Arbeidsstelsel = 'Voltijds' | 'Deeltijds' | 'Flexi' | 'Jobstudent'
export type Bezoldigingswijze = 'UurLoon' | 'MaandLoon' | 'DagLoon'
export type VerloningsPeriodiciteit = 'Maandelijks' | 'Tweewekelijks' | 'Wekelijks'
export type TypeContract = 'OnbepaaldeDuur' | 'BepaaldeDuur' | 'Vervangingscontract' | 'Uitvoering'
export type TypeForfait = 'Geen' | 'Klein' | 'Groot'
export type Taalgebied = 'Nederlandstalig' | 'Franstalig' | 'Duitstalig' | 'Tweetalig'
export type Periodiciteit = 'Maandelijks' | 'Tweewekelijks' | 'Wekelijks' | 'Dagelijks'
export type VrijstellingType =
  | 'Ploegenarbeid'
  | 'Nachtarbeid'
  | 'VolContinue'
  | 'OnroerendeStaat'
  | 'PloegenarbeidBIS'
  | 'VolContinueBIS'
export type LoonStatus =
  | 'TeBerekenen'
  | 'TeControleren'
  | 'Klaargezet'
  | 'Afgesloten'
  | 'Betaald'
export type MeldingSeverity = 'Blokkerend' | 'Waarschuwend'
export type BerekeningType = 'Normaal' | 'Correctie' | 'Simulatie'
export type AfwezigheidsType =
  | 'Vakantie'
  | 'Ziekte'
  | 'FeestdagWettelijk'
  | 'VerlofdagExtra'
  | 'Tijdskrediet'
  | 'Arbeidsongeval'
  | 'BeroepsZiekte'
  | 'Moederschapsverlof'
  | 'Vaderschapsverlof'
  | 'Ouderschapsverlof'
export type WerknemersStatuut = 'Arbeider' | 'Bediende' | 'Kader' | 'Directeur'

// ─── Persoon ──────────────────────────────────────────────────────────────────

export interface PersoonSnapshot {
  readonly AanvangsDatum: string
  readonly Werknemerskengetallen: readonly string[]
  readonly DatumInDienst: string | null
  readonly GepensioneerdVanaf: string | null
  readonly INSZNummer: string
  readonly FamilieNaam: string
  readonly Voornaam: string
  readonly Geslacht: Geslacht
  readonly Straat: string
  readonly Huisnummer: string
  readonly Bus: string | null
  readonly Gemeente: string
  readonly PostCode: string
  readonly Land: string
  readonly IBAN: string | null
  readonly BIC: string | null
  readonly BurgerlijkeStaat: BurgerlijkeStaat | null
  readonly TypeBvBerekening: TypeBVBerekening | null
  readonly VastBvPercentage: number | null
  readonly Mindervalide: boolean | null
  readonly PartnerInkomsten: PartnerInkomsten | null
  readonly PartnerMindervalide: boolean | null
  readonly AantalKinderenTenLaste: number | null
  readonly AantalMindervalideKinderenTenLaste: number | null
  readonly AantalOuderePersonenTenLaste: number | null
  readonly AantalMindervalideOuderePersonenTenLaste: number | null
  readonly AantalAnderePersonenTenLaste: number | null
  readonly AantalAndereMindervalidePersonenTenLaste: number | null
  readonly AantalZorgbehoevendeOuderePersonenTenLaste: number | null
  readonly Geboortedatum: string | null
  readonly GeboortePlaats: string | null
  readonly Taal: Taal
  readonly EmailLoonbrief: string | null
}

export interface PersoonGewijzigd {
  readonly PersoonReferentieId: string
  readonly WerkgeverReferentieId: string
  readonly RecordDatum: string
  readonly PersoonSnapshots: readonly PersoonSnapshot[]
}

// ─── Contract ─────────────────────────────────────────────────────────────────

export interface ContractSnapshot {
  readonly AanvangsDatum: string
  readonly BeginDatum: string
  readonly EindDatum: string | null
  readonly ParitairComite: string
  readonly Gewest: Gewest
  readonly WerknemersStatuut: WerknemersStatuut
  readonly Functie: string | null
  readonly TypeWerknemerDimona: string | null
  readonly Tikkaartnummer: string | null
  readonly Arbeidsstelsel: Arbeidsstelsel
  readonly TypeContract: TypeContract
  readonly VerloningsPeriodiciteit: VerloningsPeriodiciteit
  readonly Bezoldigingswijze: Bezoldigingswijze
  readonly VoltijdsReferentieRegime: number | null
  readonly TypeForfait: TypeForfait
  readonly Taalgebied: Taalgebied
  readonly LoonBedrag: number | null
  readonly LoonMunt: string
  readonly WerkgeversbijdrageMaaltijdcheque: number | null
  readonly MaaltijdchequesManueelToegekend: boolean
  readonly StarterJob: boolean
  readonly VrijstellingPloegenarbeid: boolean
  readonly VrijstellingNachtarbeid: boolean
  readonly VrijstellingVolContinu: boolean
  readonly VrijstellingOnroerendeStaat: boolean
  readonly VrijstellingPloegenarbeidBIS: boolean
  readonly VrijstellingVolContinuBIS: boolean
  readonly BuitenlandseLoonbelasting: boolean
  readonly NotieLaattijdigeFlexi: boolean
}

export interface ContractGewijzigd {
  readonly ContractReferentieId: string
  readonly PersoonReferentieId: string
  readonly WerkgeverReferentieId: string
  readonly RecordDatum: string
  readonly ContractSnapshots: readonly ContractSnapshot[]
}

// ─── Werkgever ────────────────────────────────────────────────────────────────

export interface Adres {
  readonly Straat: string
  readonly Huisnummer: string
  readonly Bus: string | null
  readonly Gemeente: string
  readonly PostCode: string
  readonly Land: string
}

export interface ParitairComiteConfig {
  readonly Code: string
  readonly Omschrijving: string
}

export interface WerkgeverSnapshot {
  readonly AanvangsDatum: string
  readonly OndernemingsNummer: string
  readonly RSZNummer: string
  readonly BTWNummer: string | null
  readonly RechtspersonenRegister: string | null
  readonly MaatschappelijkeNaam: string
  readonly Vennootschapsvorm: string | null
  readonly Taal: Taal
  readonly Periodiciteit: Periodiciteit
  readonly Adres: Adres
  readonly Email: string | null
  readonly Telefoon: string | null
  readonly Website: string | null
  readonly IBAN: string | null
  readonly BIC: string | null
  readonly IBANLonen: string | null
  readonly BICLonen: string | null
  readonly ParitaireComites: readonly ParitairComiteConfig[]
  readonly BetaaltBvZelf: boolean
  readonly VrijstellingPloegenarbeid: boolean
  readonly VrijstellingNachtarbeid: boolean
  readonly VrijstellingVolContinu: boolean
  readonly VrijstellingOnroerendeStaat: boolean
  readonly ChequeLeverancier: string | null
  readonly WerkgeversbijdrageMaaltijdcheque: number | null
  readonly NotieCuratele: boolean
  readonly Erkenningsnummer: string | null
  readonly BegindatumVakantieperiode: string | null
}

export interface WerkgeverGewijzigd {
  readonly WerkgeverReferentieId: string
  readonly RecordDatum: string
  readonly WerkgeverSnapshots: readonly WerkgeverSnapshot[]
}

// ─── Loonberekening ───────────────────────────────────────────────────────────

export interface Melding {
  readonly Code: string
  readonly Omschrijving: string
  readonly Severity: MeldingSeverity
}

export interface BerekeningsRegel {
  readonly Omschrijving: string
  readonly Bedrag: number
  readonly IsTotaal: boolean
}

export interface BerekeningsStap {
  readonly Naam: string
  readonly Regels: readonly BerekeningsRegel[]
  readonly Totaal: number
}

export interface Arbeidstijdgegeven {
  readonly Datum: string
  readonly UrenGewerkt: number | null
  readonly AfwezigheidsType: AfwezigheidsType | null
}

export interface VerlofTeller {
  readonly Type: string
  readonly Saldo: number
  readonly Opgenomen: number
  readonly Resterend: number
}

export interface LoonbeslagBerekening {
  readonly Omschrijving: string
  readonly Bedrag: number
}

export interface WerkuitkeringBerekening {
  readonly Instelling: string
  readonly Bedrag: number
  readonly Periode: string
}

export interface LoonberekeningBepaald {
  readonly LoonberekeningReferentieId: string
  readonly PersoonReferentieId: string
  readonly ContractReferentieId: string
  readonly WerkgeverReferentieId: string
  readonly RecordDatum: string
  readonly FiscaalJaar: number
  readonly Loonperiode: string
  readonly Berekeningsdatum: string
  readonly BerekeningType: BerekeningType
  readonly Status: LoonStatus
  readonly Arbeidstijdgegevens: readonly Arbeidstijdgegeven[]
  readonly BrutoLoonBerekening: BerekeningsStap
  readonly RSZBerekening: BerekeningsStap
  readonly BelastbaarInkomenBerekening: BerekeningsStap
  readonly BVBerekening: BerekeningsStap
  readonly BBSZBerekening: BerekeningsStap
  readonly NettoLoonBerekening: BerekeningsStap
  readonly LoonbeslagBerekeningen: readonly LoonbeslagBerekening[]
  readonly WerkuitkeringBerekening: WerkuitkeringBerekening | null
  readonly VoorschotBedrag: number | null
  readonly VoorschotBetaald: boolean
  readonly Meldingen: readonly Melding[]
  readonly Opmerkingen: string | null
  readonly BerichtUrl: string | null
}

// ─── UI-only types ────────────────────────────────────────────────────────────

export interface LonenOverzichtRij {
  readonly persoonReferentieId: string
  readonly contractReferentieId: string
  readonly loonberekeningReferentieId: string
  readonly familieNaam: string
  readonly voornaam: string
  readonly arbeidsstelsel: Arbeidsstelsel
  readonly status: LoonStatus
  readonly aantalBlokkerende: number
  readonly aantalWaarschuwende: number
  readonly loonperiode: string
}
