export const queryKeys = {
  werkgevers: () => ['werkgevers'] as const,
  werkgever: (id: string) => ['werkgevers', id] as const,
  personen: (werkgeverId: string) => ['personen', werkgeverId] as const,
  persoon: (id: string) => ['persoon', id] as const,
  contracten: (persoonId: string) => ['contracten', persoonId] as const,
  contract: (id: string) => ['contract', id] as const,
  lonen: (werkgeverId: string, van: string, tot: string) =>
    ['lonen', werkgeverId, van, tot] as const,
  loonberekening: (id: string) => ['loonberekening', id] as const,
  berichten: () => ['berichten'] as const,
}
