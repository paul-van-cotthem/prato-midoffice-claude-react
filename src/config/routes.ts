export const ROUTES = {
  LOGIN: '/login',
  WERKGEVERS: '/werkgevers',
  WERKGEVER: '/werkgevers/:werkgeverReferentieId',
  LONEN_OVERZICHT: '/werkgevers/:werkgeverReferentieId/lonen',
  PERSOON: '/werkgevers/:werkgeverReferentieId/personen/:persoonReferentieId',
  CONTRACT: '/werkgevers/:werkgeverReferentieId/contracten/:contractReferentieId',
  LOONBEREKENING:
    '/werkgevers/:werkgeverReferentieId/loonberekeningen/:loonberekeningReferentieId',
  BERICHTEN: '/berichten',
  PERSONEN_LIST: '/personen',
  CONTRACTEN_LIST: '/contracten',
  LOONBEREKENINGEN_LIST: '/loonberekeningen',
} as const

export function werkgeverPath(werkgeverReferentieId: string): string {
  return `/werkgevers/${werkgeverReferentieId}`
}

export function lonenPath(werkgeverReferentieId: string): string {
  return `/werkgevers/${werkgeverReferentieId}/lonen`
}

export function persoonPath(werkgeverReferentieId: string, persoonReferentieId: string): string {
  return `/werkgevers/${werkgeverReferentieId}/personen/${persoonReferentieId}`
}

export function contractPath(
  werkgeverReferentieId: string,
  contractReferentieId: string,
): string {
  return `/werkgevers/${werkgeverReferentieId}/contracten/${contractReferentieId}`
}

export function loonberekeningPath(
  werkgeverReferentieId: string,
  loonberekeningReferentieId: string,
): string {
  return `/werkgevers/${werkgeverReferentieId}/loonberekeningen/${loonberekeningReferentieId}`
}
