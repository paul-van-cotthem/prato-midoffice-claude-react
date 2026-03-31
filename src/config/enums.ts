import type {
  AfwezigheidsType,
  Arbeidsstelsel,
  BerekeningType,
  Bezoldigingswijze,
  BurgerlijkeStaat,
  Gewest,
  Geslacht,
  LoonStatus,
  PartnerInkomsten,
  Periodiciteit,
  Taal,
  Taalgebied,
  TypeBVBerekening,
  TypeContract,
  TypeForfait,
  VerloningsPeriodiciteit,
  WerknemersStatuut,
} from '@/types/types'

export const geslachtLabels: Record<Geslacht, string> = {
  Man: 'enum.geslacht.Man',
  Vrouw: 'enum.geslacht.Vrouw',
  X: 'enum.geslacht.X',
}

export const burgerlijkeStaatLabels: Record<BurgerlijkeStaat, string> = {
  Ongehuwd: 'enum.burgerlijkeStaat.Ongehuwd',
  Gehuwd: 'enum.burgerlijkeStaat.Gehuwd',
  Weduwe: 'enum.burgerlijkeStaat.Weduwe',
  WettelijkGescheiden: 'enum.burgerlijkeStaat.WettelijkGescheiden',
  FeitelijkGescheiden: 'enum.burgerlijkeStaat.FeitelijkGescheiden',
  Samenwonend: 'enum.burgerlijkeStaat.Samenwonend',
  FeitelijkSamenwonend: 'enum.burgerlijkeStaat.FeitelijkSamenwonend',
  ScheidingVanTafelEnBed: 'enum.burgerlijkeStaat.ScheidingVanTafelEnBed',
}

export const typeBVBerekeningLabels: Record<TypeBVBerekening, string> = {
  VastPercentage: 'enum.typeBVBerekening.VastPercentage',
  Schalen: 'enum.typeBVBerekening.Schalen',
}

export const partnerInkomstenLabels: Record<PartnerInkomsten, string> = {
  EigenInkomsten: 'enum.partnerInkomsten.EigenInkomsten',
  EigenInkomstenOnderGrens3: 'enum.partnerInkomsten.EigenInkomstenOnderGrens3',
  EigenInkomstenOnderGrens2: 'enum.partnerInkomsten.EigenInkomstenOnderGrens2',
  EigenInkomstenOnderGrens1: 'enum.partnerInkomsten.EigenInkomstenOnderGrens1',
  GeenEigenInkomsten: 'enum.partnerInkomsten.GeenEigenInkomsten',
}

export const taalLabels: Record<Taal, string> = {
  Nederlands: 'enum.taal.Nederlands',
  Frans: 'enum.taal.Frans',
}

export const arbeidsstelselLabels: Record<Arbeidsstelsel, string> = {
  Voltijds: 'enum.arbeidsstelsel.Voltijds',
  Deeltijds: 'enum.arbeidsstelsel.Deeltijds',
  Flexi: 'enum.arbeidsstelsel.Flexi',
  Jobstudent: 'enum.arbeidsstelsel.Jobstudent',
}

export const bezoldigingswijzeLabels: Record<Bezoldigingswijze, string> = {
  UurLoon: 'enum.bezoldigingswijze.UurLoon',
  MaandLoon: 'enum.bezoldigingswijze.MaandLoon',
  DagLoon: 'enum.bezoldigingswijze.DagLoon',
}

export const verloningsPeriodiciteitsLabels: Record<VerloningsPeriodiciteit, string> = {
  Maandelijks: 'enum.verloningsPeriodiciteit.Maandelijks',
  Tweewekelijks: 'enum.verloningsPeriodiciteit.Tweewekelijks',
  Wekelijks: 'enum.verloningsPeriodiciteit.Wekelijks',
}

export const typeContractLabels: Record<TypeContract, string> = {
  OnbepaaldeDuur: 'enum.typeContract.OnbepaaldeDuur',
  BepaaldeDuur: 'enum.typeContract.BepaaldeDuur',
  Vervangingscontract: 'enum.typeContract.Vervangingscontract',
  Uitvoering: 'enum.typeContract.Uitvoering',
}

export const typeForfaitLabels: Record<TypeForfait, string> = {
  Geen: 'enum.typeForfait.Geen',
  Klein: 'enum.typeForfait.Klein',
  Groot: 'enum.typeForfait.Groot',
}

export const taalgebiedLabels: Record<Taalgebied, string> = {
  Nederlandstalig: 'enum.taalgebied.Nederlandstalig',
  Franstalig: 'enum.taalgebied.Franstalig',
  Duitstalig: 'enum.taalgebied.Duitstalig',
  Tweetalig: 'enum.taalgebied.Tweetalig',
}

export const periodiciteitLabels: Record<Periodiciteit, string> = {
  Maandelijks: 'enum.periodiciteit.Maandelijks',
  Tweewekelijks: 'enum.periodiciteit.Tweewekelijks',
  Wekelijks: 'enum.periodiciteit.Wekelijks',
  Dagelijks: 'enum.periodiciteit.Dagelijks',
}

export const gewestLabels: Record<Gewest, string> = {
  Vlaanderen: 'enum.gewest.Vlaanderen',
  Wallonie: 'enum.gewest.Wallonie',
  Brussel: 'enum.gewest.Brussel',
}

export const werknemersStatuutLabels: Record<WerknemersStatuut, string> = {
  Arbeider: 'enum.werknemersStatuut.Arbeider',
  Bediende: 'enum.werknemersStatuut.Bediende',
  Kader: 'enum.werknemersStatuut.Kader',
  Directeur: 'enum.werknemersStatuut.Directeur',
}

export const berekeningTypeLabels: Record<BerekeningType, string> = {
  Normaal: 'enum.berekeningType.Normaal',
  Correctie: 'enum.berekeningType.Correctie',
  Simulatie: 'enum.berekeningType.Simulatie',
}

export const afwezigheidsTypeLabels: Record<AfwezigheidsType, string> = {
  Vakantie: 'enum.afwezigheidsType.Vakantie',
  Ziekte: 'enum.afwezigheidsType.Ziekte',
  FeestdagWettelijk: 'enum.afwezigheidsType.FeestdagWettelijk',
  VerlofdagExtra: 'enum.afwezigheidsType.VerlofdagExtra',
  Tijdskrediet: 'enum.afwezigheidsType.Tijdskrediet',
  Arbeidsongeval: 'enum.afwezigheidsType.Arbeidsongeval',
  BeroepsZiekte: 'enum.afwezigheidsType.BeroepsZiekte',
  Moederschapsverlof: 'enum.afwezigheidsType.Moederschapsverlof',
  Vaderschapsverlof: 'enum.afwezigheidsType.Vaderschapsverlof',
  Ouderschapsverlof: 'enum.afwezigheidsType.Ouderschapsverlof',
}

export const loonStatusLabels: Record<LoonStatus, string> = {
  TeBerekenen: 'enum.loonStatus.TeBerekenen',
  TeControleren: 'enum.loonStatus.TeControleren',
  Klaargezet: 'enum.loonStatus.Klaargezet',
  Afgesloten: 'enum.loonStatus.Afgesloten',
  Betaald: 'enum.loonStatus.Betaald',
}
