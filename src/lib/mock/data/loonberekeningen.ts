import type { LoonberekeningBepaald, Arbeidstijdgegeven, BerekeningsStap } from '@/types/types'

// ─── Helper: generate January 2025 workdays (Mon-Fri) ────────────────────────
// January 2025: weekdays are 2,3,6,7,8,9,10,13,14,15,16,17,20,21,22,23,24,27,28,29,30,31
// = 23 workdays. We assign: 6th = Vakantie, 7th = Vakantie, 13th = Ziekte

const jan2025Workdays: Arbeidstijdgegeven[] = [
  { Datum: '2025-01-02', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-03', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-06', UrenGewerkt: null, AfwezigheidsType: 'Vakantie' },
  { Datum: '2025-01-07', UrenGewerkt: null, AfwezigheidsType: 'Vakantie' },
  { Datum: '2025-01-08', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-09', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-10', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-13', UrenGewerkt: null, AfwezigheidsType: 'Ziekte' },
  { Datum: '2025-01-14', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-15', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-16', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-17', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-20', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-21', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-22', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-23', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-24', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-27', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-28', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-29', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-30', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-01-31', UrenGewerkt: 8, AfwezigheidsType: null },
]

// February 2025 workdays: 3,4,5,6,7,10,11,12,13,14,17,18,19,20,21,24,25,26,27,28 = 20 days
// 10th = Vakantie, 14th = FeestdagWettelijk
const feb2025Workdays: Arbeidstijdgegeven[] = [
  { Datum: '2025-02-03', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-04', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-05', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-06', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-07', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-10', UrenGewerkt: null, AfwezigheidsType: 'Vakantie' },
  { Datum: '2025-02-11', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-12', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-13', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-14', UrenGewerkt: null, AfwezigheidsType: 'FeestdagWettelijk' },
  { Datum: '2025-02-17', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-18', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-19', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-20', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-21', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-24', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-25', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-26', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-27', UrenGewerkt: 8, AfwezigheidsType: null },
  { Datum: '2025-02-28', UrenGewerkt: 8, AfwezigheidsType: null },
]

// ─── Calculation steps builders ───────────────────────────────────────────────

function buildBruto(basisloon: number, toeslag: number, premieAandeel: number): BerekeningsStap {
  const totaal = basisloon + toeslag + premieAandeel
  return {
    Naam: 'Brutoloon',
    Regels: [
      { Omschrijving: 'Basisloon', Bedrag: basisloon, IsTotaal: false },
      { Omschrijving: 'Ploegentoeslag (20%)', Bedrag: toeslag, IsTotaal: false },
      { Omschrijving: 'Eindejaarspremie (aandeel)', Bedrag: premieAandeel, IsTotaal: false },
      { Omschrijving: 'Totaal brutoloon', Bedrag: totaal, IsTotaal: true },
    ],
    Totaal: totaal,
  }
}

function buildRSZ(bruto: number): BerekeningsStap {
  const persoonlijk = Math.round(bruto * 0.1307 * 100) / 100
  const bijzondere = Math.round(bruto * 0.0107 * 100) / 100
  const totaal = -(persoonlijk + bijzondere)
  return {
    Naam: 'RSZ-inhoudingen',
    Regels: [
      { Omschrijving: 'Persoonlijke RSZ-bijdrage (13,07%)', Bedrag: -persoonlijk, IsTotaal: false },
      { Omschrijving: 'Bijzondere bijdrage sociale zekerheid (1,07%)', Bedrag: -bijzondere, IsTotaal: false },
      { Omschrijving: 'Totaal RSZ', Bedrag: totaal, IsTotaal: true },
    ],
    Totaal: totaal,
  }
}

function buildBelastbaar(bruto: number, rsz: number): BerekeningsStap {
  const beroepskosten = Math.round(bruto * 0.05 * 100) / 100
  const belastbaar = Math.round((bruto + rsz - beroepskosten) * 100) / 100
  return {
    Naam: 'Belastbaar inkomen',
    Regels: [
      { Omschrijving: 'Bruto belastbaar', Bedrag: bruto, IsTotaal: false },
      { Omschrijving: 'RSZ-inhoudingen', Bedrag: rsz, IsTotaal: false },
      { Omschrijving: 'Forfaitaire beroepskosten (5%)', Bedrag: -beroepskosten, IsTotaal: false },
      { Omschrijving: 'Belastbaar inkomen', Bedrag: belastbaar, IsTotaal: true },
    ],
    Totaal: belastbaar,
  }
}

function buildBV(belastbaar: number, bvPct: number): BerekeningsStap {
  const bv = Math.round(belastbaar * bvPct * 100) / 100
  const vermindering = Math.round(bv * 0.03 * 100) / 100
  const nettoBv = -(bv - vermindering)
  return {
    Naam: 'Bedrijfsvoorheffing',
    Regels: [
      { Omschrijving: `Bedrijfsvoorheffing (${(bvPct * 100).toFixed(2)}%)`, Bedrag: -bv, IsTotaal: false },
      { Omschrijving: 'Vermindering ten laste', Bedrag: vermindering, IsTotaal: false },
      { Omschrijving: 'Netto bedrijfsvoorheffing', Bedrag: nettoBv, IsTotaal: true },
    ],
    Totaal: nettoBv,
  }
}

function buildBBSZ(bruto: number): BerekeningsStap {
  let bbsz = 0
  if (bruto > 6038.82) bbsz = 60.94
  else if (bruto > 3969.38) bbsz = Math.round((bruto - 3969.38) * 0.0222 * 100) / 100
  const neg = -bbsz
  return {
    Naam: 'Bijzondere bijdrage sociale zekerheid',
    Regels: [
      { Omschrijving: 'BBSZ maandbijdrage', Bedrag: neg, IsTotaal: true },
    ],
    Totaal: neg,
  }
}

function buildNetto(bruto: number, rsz: number, bv: number, bbsz: number, maaltijdcheques: number): BerekeningsStap {
  const netto = Math.round((bruto + rsz + bv + bbsz + maaltijdcheques) * 100) / 100
  return {
    Naam: 'Nettoloon',
    Regels: [
      { Omschrijving: 'Brutoloon', Bedrag: bruto, IsTotaal: false },
      { Omschrijving: 'RSZ-inhoudingen', Bedrag: rsz, IsTotaal: false },
      { Omschrijving: 'Bedrijfsvoorheffing', Bedrag: bv, IsTotaal: false },
      { Omschrijving: 'BBSZ', Bedrag: bbsz, IsTotaal: false },
      { Omschrijving: 'Maaltijdcheques werkgeversbijdrage', Bedrag: maaltijdcheques, IsTotaal: false },
      { Omschrijving: 'Nettoloon', Bedrag: netto, IsTotaal: true },
    ],
    Totaal: netto,
  }
}

function buildCalc(
  basisloon: number,
  toeslag: number,
  premieAandeel: number,
  bvPct: number,
  maaltijdcheques: number,
): {
  bruto: BerekeningsStap
  rsz: BerekeningsStap
  belastbaar: BerekeningsStap
  bv: BerekeningsStap
  bbsz: BerekeningsStap
  netto: BerekeningsStap
} {
  const bruto = buildBruto(basisloon, toeslag, premieAandeel)
  const rszStap = buildRSZ(bruto.Totaal)
  const belastbaarStap = buildBelastbaar(bruto.Totaal, rszStap.Totaal)
  const bvStap = buildBV(belastbaarStap.Totaal, bvPct)
  const bbszStap = buildBBSZ(bruto.Totaal)
  const nettoStap = buildNetto(bruto.Totaal, rszStap.Totaal, bvStap.Totaal, bbszStap.Totaal, maaltijdcheques)
  return {
    bruto,
    rsz: rszStap,
    belastbaar: belastbaarStap,
    bv: bvStap,
    bbsz: bbszStap,
    netto: nettoStap,
  }
}

// ─── January 2025 calculations ────────────────────────────────────────────────
// PERS-001: bruto ~4550 → netto ~2900
const p1jan = buildCalc(4550.0, 455.0, 189.58, 0.2647, 152.02)
// PERS-002: bruto ~2400 deeltijds → netto ~1650
const p2jan = buildCalc(2400.0, 0, 100.0, 0.2675, 152.02)
// PERS-003: bruto ~5350 kader → netto ~3200
const p3jan = buildCalc(5350.0, 535.0, 222.92, 0.3410, 152.02)
// PERS-004: flexi uurloon ~15.50/u * 120u = 1860 → netto ~1400
const p4jan = buildCalc(1860.0, 0, 77.5, 0.35, 0)
// PERS-005: jobstudent 12.08/u * 80u = 966.40 → netto ~900
const p5jan = buildCalc(966.4, 0, 40.27, 0.0, 0)

// February 2025 calculations (20 workdays → slightly lower due to missing days)
const p1feb = buildCalc(4550.0, 420.0, 189.58, 0.2647, 138.2)
const p2feb = buildCalc(2400.0, 0, 100.0, 0.2675, 138.2)
const p3feb = buildCalc(5350.0, 490.0, 222.92, 0.3410, 138.2)
const p4feb = buildCalc(1550.0, 0, 64.58, 0.35, 0)
const p5feb = buildCalc(966.4, 0, 40.27, 0.0, 0)

// ─── Main data export ─────────────────────────────────────────────────────────

export const loonberekeningenData: LoonberekeningBepaald[] = [
  // ─ January 2025 ─────────────────────────────────────────────────────────────

  // PERS-001 Jan 2025 — TeBerekenen, 2 Blokkerend
  {
    LoonberekeningReferentieId: 'LB-PERS001-202501',
    PersoonReferentieId: 'PERS-001',
    ContractReferentieId: 'CONT-001',
    WerkgeverReferentieId: 'WG-001',
    RecordDatum: '2025-01-31T17:00:00.000Z',
    FiscaalJaar: 2025,
    Loonperiode: '2025-01',
    Berekeningsdatum: '2025-01-31',
    BerekeningType: 'Normaal',
    Status: 'TeBerekenen',
    Arbeidstijdgegevens: jan2025Workdays,
    BrutoLoonBerekening: p1jan.bruto,
    RSZBerekening: p1jan.rsz,
    BelastbaarInkomenBerekening: p1jan.belastbaar,
    BVBerekening: p1jan.bv,
    BBSZBerekening: p1jan.bbsz,
    NettoLoonBerekening: p1jan.netto,
    LoonbeslagBerekeningen: [],
    WerkuitkeringBerekening: null,
    VoorschotBedrag: null,
    VoorschotBetaald: false,
    Meldingen: [
      {
        Code: 'BLK-001',
        Omschrijving: 'INSZ-nummer kon niet worden gevalideerd bij RSZ. Herberekening vereist.',
        Severity: 'Blokkerend',
      },
      {
        Code: 'BLK-002',
        Omschrijving: 'Loonschaal paritair comité 200 niet gevonden voor het gevraagde loonbedrag.',
        Severity: 'Blokkerend',
      },
    ],
    Opmerkingen: null,
    BerichtUrl: null,
  },

  // PERS-002 Jan 2025 — TeControleren, 1 Blokkerend + 1 Waarschuwend
  {
    LoonberekeningReferentieId: 'LB-PERS002-202501',
    PersoonReferentieId: 'PERS-002',
    ContractReferentieId: 'CONT-002',
    WerkgeverReferentieId: 'WG-001',
    RecordDatum: '2025-01-31T17:00:00.000Z',
    FiscaalJaar: 2025,
    Loonperiode: '2025-01',
    Berekeningsdatum: '2025-01-31',
    BerekeningType: 'Normaal',
    Status: 'TeControleren',
    Arbeidstijdgegevens: jan2025Workdays,
    BrutoLoonBerekening: p2jan.bruto,
    RSZBerekening: p2jan.rsz,
    BelastbaarInkomenBerekening: p2jan.belastbaar,
    BVBerekening: p2jan.bv,
    BBSZBerekening: p2jan.bbsz,
    NettoLoonBerekening: p2jan.netto,
    LoonbeslagBerekeningen: [],
    WerkuitkeringBerekening: null,
    VoorschotBedrag: null,
    VoorschotBetaald: false,
    Meldingen: [
      {
        Code: 'BLK-010',
        Omschrijving: 'Starterjobreductie kon niet worden toegepast: leeftijdsgrens overschreden.',
        Severity: 'Blokkerend',
      },
      {
        Code: 'WARN-020',
        Omschrijving: 'Vast BV-percentage 26,75% wijkt meer dan 5% af van het berekend schaalpercentage.',
        Severity: 'Waarschuwend',
      },
    ],
    Opmerkingen: 'Controleer starterjobreductie en BV-percentage voor akkoord.',
    BerichtUrl: null,
  },

  // PERS-003 Jan 2025 — Klaargezet, 2 Waarschuwend
  {
    LoonberekeningReferentieId: 'LB-PERS003-202501',
    PersoonReferentieId: 'PERS-003',
    ContractReferentieId: 'CONT-003',
    WerkgeverReferentieId: 'WG-001',
    RecordDatum: '2025-01-31T17:00:00.000Z',
    FiscaalJaar: 2025,
    Loonperiode: '2025-01',
    Berekeningsdatum: '2025-01-31',
    BerekeningType: 'Normaal',
    Status: 'Klaargezet',
    Arbeidstijdgegevens: jan2025Workdays,
    BrutoLoonBerekening: p3jan.bruto,
    RSZBerekening: p3jan.rsz,
    BelastbaarInkomenBerekening: p3jan.belastbaar,
    BVBerekening: p3jan.bv,
    BBSZBerekening: p3jan.bbsz,
    NettoLoonBerekening: p3jan.netto,
    LoonbeslagBerekeningen: [],
    WerkuitkeringBerekening: null,
    VoorschotBedrag: null,
    VoorschotBetaald: false,
    Meldingen: [
      {
        Code: 'WARN-030',
        Omschrijving: 'Vrijstelling ploegenarbeid BIS is actief maar geen ploegentoeslag gevonden in looncomponenten.',
        Severity: 'Waarschuwend',
      },
      {
        Code: 'WARN-031',
        Omschrijving: 'Mindervalide werknemer: controleer of verhoogde belastingvrije som correct is toegepast.',
        Severity: 'Waarschuwend',
      },
    ],
    Opmerkingen: 'Klaargemaakt voor betaling, maar aandachtspunten controleren.',
    BerichtUrl: null,
  },

  // PERS-004 Jan 2025 — Afgesloten, 0 meldingen, met loonbeslag
  {
    LoonberekeningReferentieId: 'LB-PERS004-202501',
    PersoonReferentieId: 'PERS-004',
    ContractReferentieId: 'CONT-004',
    WerkgeverReferentieId: 'WG-001',
    RecordDatum: '2025-01-31T17:00:00.000Z',
    FiscaalJaar: 2025,
    Loonperiode: '2025-01',
    Berekeningsdatum: '2025-01-31',
    BerekeningType: 'Normaal',
    Status: 'Afgesloten',
    Arbeidstijdgegevens: jan2025Workdays,
    BrutoLoonBerekening: p4jan.bruto,
    RSZBerekening: p4jan.rsz,
    BelastbaarInkomenBerekening: p4jan.belastbaar,
    BVBerekening: p4jan.bv,
    BBSZBerekening: p4jan.bbsz,
    NettoLoonBerekening: p4jan.netto,
    LoonbeslagBerekeningen: [
      { Omschrijving: 'Loonbeslag deurwaarder De Graef (ref. 2024/1234)', Bedrag: -180.0 },
      { Omschrijving: 'Vrijgesteld gedeelte (alimentatieverplichting)', Bedrag: 50.0 },
    ],
    WerkuitkeringBerekening: null,
    VoorschotBedrag: null,
    VoorschotBetaald: false,
    Meldingen: [],
    Opmerkingen: 'Loonbeslag toegepast conform gerechtelijk bevel 2024/1234.',
    BerichtUrl: null,
  },

  // PERS-005 Jan 2025 — Betaald, 0 meldingen
  {
    LoonberekeningReferentieId: 'LB-PERS005-202501',
    PersoonReferentieId: 'PERS-005',
    ContractReferentieId: 'CONT-005',
    WerkgeverReferentieId: 'WG-001',
    RecordDatum: '2025-01-31T17:00:00.000Z',
    FiscaalJaar: 2025,
    Loonperiode: '2025-01',
    Berekeningsdatum: '2025-01-31',
    BerekeningType: 'Normaal',
    Status: 'Betaald',
    Arbeidstijdgegevens: jan2025Workdays,
    BrutoLoonBerekening: p5jan.bruto,
    RSZBerekening: p5jan.rsz,
    BelastbaarInkomenBerekening: p5jan.belastbaar,
    BVBerekening: p5jan.bv,
    BBSZBerekening: p5jan.bbsz,
    NettoLoonBerekening: p5jan.netto,
    LoonbeslagBerekeningen: [],
    WerkuitkeringBerekening: null,
    VoorschotBedrag: null,
    VoorschotBetaald: false,
    Meldingen: [],
    Opmerkingen: null,
    BerichtUrl: 'https://prato.example.be/berichten/LB-PERS005-202501.pdf',
  },

  // ─ February 2025 ─────────────────────────────────────────────────────────────

  // PERS-001 Feb 2025 — Klaargezet, 1 Waarschuwend, met voorschot
  {
    LoonberekeningReferentieId: 'LB-PERS001-202502',
    PersoonReferentieId: 'PERS-001',
    ContractReferentieId: 'CONT-001',
    WerkgeverReferentieId: 'WG-001',
    RecordDatum: '2025-02-28T17:00:00.000Z',
    FiscaalJaar: 2025,
    Loonperiode: '2025-02',
    Berekeningsdatum: '2025-02-28',
    BerekeningType: 'Normaal',
    Status: 'Klaargezet',
    Arbeidstijdgegevens: feb2025Workdays,
    BrutoLoonBerekening: p1feb.bruto,
    RSZBerekening: p1feb.rsz,
    BelastbaarInkomenBerekening: p1feb.belastbaar,
    BVBerekening: p1feb.bv,
    BBSZBerekening: p1feb.bbsz,
    NettoLoonBerekening: p1feb.netto,
    LoonbeslagBerekeningen: [],
    WerkuitkeringBerekening: null,
    VoorschotBedrag: 500.0,
    VoorschotBetaald: true,
    Meldingen: [
      {
        Code: 'WARN-100',
        Omschrijving: 'Voorschot van €500,00 werd verrekend. Controleer het resterende nettobedrag.',
        Severity: 'Waarschuwend',
      },
    ],
    Opmerkingen: 'Voorschot van €500 betaald op 2025-02-15.',
    BerichtUrl: null,
  },

  // PERS-002 Feb 2025 — Betaald, met werkuitkering
  {
    LoonberekeningReferentieId: 'LB-PERS002-202502',
    PersoonReferentieId: 'PERS-002',
    ContractReferentieId: 'CONT-002',
    WerkgeverReferentieId: 'WG-001',
    RecordDatum: '2025-02-28T17:00:00.000Z',
    FiscaalJaar: 2025,
    Loonperiode: '2025-02',
    Berekeningsdatum: '2025-02-28',
    BerekeningType: 'Normaal',
    Status: 'Betaald',
    Arbeidstijdgegevens: feb2025Workdays,
    BrutoLoonBerekening: p2feb.bruto,
    RSZBerekening: p2feb.rsz,
    BelastbaarInkomenBerekening: p2feb.belastbaar,
    BVBerekening: p2feb.bv,
    BBSZBerekening: p2feb.bbsz,
    NettoLoonBerekening: p2feb.netto,
    LoonbeslagBerekeningen: [],
    WerkuitkeringBerekening: {
      Instelling: 'RIZIV / INAMI',
      Bedrag: 312.5,
      Periode: '2025-02',
    },
    VoorschotBedrag: null,
    VoorschotBetaald: false,
    Meldingen: [],
    Opmerkingen: 'Werkuitkering RIZIV verrekend voor ziekteperiode.',
    BerichtUrl: 'https://prato.example.be/berichten/LB-PERS002-202502.pdf',
  },

  // PERS-003 Feb 2025 — TeBerekenen, 0 meldingen
  {
    LoonberekeningReferentieId: 'LB-PERS003-202502',
    PersoonReferentieId: 'PERS-003',
    ContractReferentieId: 'CONT-003',
    WerkgeverReferentieId: 'WG-001',
    RecordDatum: '2025-02-28T17:00:00.000Z',
    FiscaalJaar: 2025,
    Loonperiode: '2025-02',
    Berekeningsdatum: '2025-02-28',
    BerekeningType: 'Normaal',
    Status: 'TeBerekenen',
    Arbeidstijdgegevens: feb2025Workdays,
    BrutoLoonBerekening: p3feb.bruto,
    RSZBerekening: p3feb.rsz,
    BelastbaarInkomenBerekening: p3feb.belastbaar,
    BVBerekening: p3feb.bv,
    BBSZBerekening: p3feb.bbsz,
    NettoLoonBerekening: p3feb.netto,
    LoonbeslagBerekeningen: [],
    WerkuitkeringBerekening: null,
    VoorschotBedrag: null,
    VoorschotBetaald: false,
    Meldingen: [],
    Opmerkingen: null,
    BerichtUrl: null,
  },

  // PERS-004 Feb 2025 — TeControleren, loonbeslag ook in feb
  {
    LoonberekeningReferentieId: 'LB-PERS004-202502',
    PersoonReferentieId: 'PERS-004',
    ContractReferentieId: 'CONT-004',
    WerkgeverReferentieId: 'WG-001',
    RecordDatum: '2025-02-28T17:00:00.000Z',
    FiscaalJaar: 2025,
    Loonperiode: '2025-02',
    Berekeningsdatum: '2025-02-28',
    BerekeningType: 'Normaal',
    Status: 'TeControleren',
    Arbeidstijdgegevens: feb2025Workdays,
    BrutoLoonBerekening: p4feb.bruto,
    RSZBerekening: p4feb.rsz,
    BelastbaarInkomenBerekening: p4feb.belastbaar,
    BVBerekening: p4feb.bv,
    BBSZBerekening: p4feb.bbsz,
    NettoLoonBerekening: p4feb.netto,
    LoonbeslagBerekeningen: [
      { Omschrijving: 'Loonbeslag deurwaarder De Graef (ref. 2024/1234)', Bedrag: -180.0 },
      { Omschrijving: 'Vrijgesteld gedeelte (alimentatieverplichting)', Bedrag: 50.0 },
    ],
    WerkuitkeringBerekening: null,
    VoorschotBedrag: null,
    VoorschotBetaald: false,
    Meldingen: [
      {
        Code: 'WARN-200',
        Omschrijving: 'Gepresteerde uren februari lager dan verwacht referentieregime. Controleer arbeidstijdregistratie.',
        Severity: 'Waarschuwend',
      },
    ],
    Opmerkingen: null,
    BerichtUrl: null,
  },

  // PERS-005 Feb 2025 — Afgesloten, 0 meldingen
  {
    LoonberekeningReferentieId: 'LB-PERS005-202502',
    PersoonReferentieId: 'PERS-005',
    ContractReferentieId: 'CONT-005',
    WerkgeverReferentieId: 'WG-001',
    RecordDatum: '2025-02-28T17:00:00.000Z',
    FiscaalJaar: 2025,
    Loonperiode: '2025-02',
    Berekeningsdatum: '2025-02-28',
    BerekeningType: 'Normaal',
    Status: 'Afgesloten',
    Arbeidstijdgegevens: feb2025Workdays,
    BrutoLoonBerekening: p5feb.bruto,
    RSZBerekening: p5feb.rsz,
    BelastbaarInkomenBerekening: p5feb.belastbaar,
    BVBerekening: p5feb.bv,
    BBSZBerekening: p5feb.bbsz,
    NettoLoonBerekening: p5feb.netto,
    LoonbeslagBerekeningen: [],
    WerkuitkeringBerekening: null,
    VoorschotBedrag: null,
    VoorschotBetaald: false,
    Meldingen: [],
    Opmerkingen: null,
    BerichtUrl: 'https://prato.example.be/berichten/LB-PERS005-202502.pdf',
  },
]
