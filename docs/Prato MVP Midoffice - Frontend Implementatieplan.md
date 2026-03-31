# Prato MVP Midoffice — Frontend Implementatieplan

## Context

Dit plan beschrijft de volledige bouw van de React-frontend voor de Prato MVP Midoffice-applicatie. De applicatie vormt een beheersinterface tussen PratoFlex (HR-systeem) en de Earnie-loonmotor. De frontend wordt gebouwd op basis van de C# berichtklassen (`PersoonGewijzigd`, `ContractGewijzigd`, `WerkgeverGewijzigd`, `LoonberekeningBepaald`) zoals gedocumenteerd in de Markdown-docs in `docs/`. Er is nog geen projectcode aanwezig — alles wordt vanaf nul gebouwd.

------

## Tech Stack

| Categorie      | Technologie                           |
| -------------- | ------------------------------------- |
| Build          | Vite 7                                |
| Framework      | React 19 + TypeScript 5.x (strict)    |
| Routing        | React Router DOM v7                   |
| Server state   | TanStack Query v5                     |
| Formulieren    | React Hook Form + @hookform/resolvers |
| Validatie      | Zod                                   |
| Tabellen       | TanStack Table v8                     |
| UI componenten | shadcn/ui (Radix UI + Tailwind CSS)   |
| Datums         | date-fns                              |
| i18n           | react-i18next + i18next-http-backend  |
| Toasts         | sonner                                |
| Utilities      | clsx                                  |
| Kwaliteit      | ESLint + Prettier                     |

------

## Vastgelegde beslissingen

1. **Backend:** Mock-implementaties in `src/lib/mock/` met localStorage-persistentie. Vervangen = één import wijzigen per module.
2. **Authenticatie:** Loginscherm met enkel één "Inloggen"-knop — geen credentials.
3. **CRUD:** Alle velden op alle schermen bewerkbaar en opslaanbaar. Toevoegen actief (werkgever, persoon, contract). Verwijderen getoond maar altijd disabled.
4. **Bouwaanpak:** Scherm per scherm — pauze + review na elk scherm voor verder te gaan.

------

## Navigatieflow

```
Login (mock knop)
  └── Werkgevers lijst
        ├── [Nieuwe werkgever]
        └── [Details] → Details werkgever (bewerkbaar)
                          └── [Naar overzicht lonen] → Overzicht lonen
                                                          ├── [rijklik] → inline detailpaneel
                                                          │     ├── → Details persoon (bewerkbaar)
                                                          │     └── → Details contract (bewerkbaar)
                                                          └── → Details loonberekening (bewerkbaar)
Zijbalk: Berichten → Berichtenlog
```

------

## Fase 1 — Projectinitialisatie

### Scaffold

```bash
npm create vite@latest . -- --template react-ts
```

### Runtime dependencies

```bash
npm install \
  react-router-dom@7 \
  @tanstack/react-query@5 \
  @tanstack/react-table@8 \
  react-hook-form @hookform/resolvers \
  zod \
  date-fns clsx \
  i18next react-i18next i18next-browser-languagedetector i18next-http-backend \
  sonner
```

### Dev dependencies

```bash
npm install -D \
  tailwindcss @tailwindcss/vite autoprefixer \
  eslint @eslint/js typescript-eslint eslint-plugin-react-hooks \
  prettier eslint-config-prettier \
  vitest @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom msw \
  @tanstack/react-query-devtools
```

### shadcn/ui

```bash
npx shadcn@latest init
npx shadcn@latest add button badge card separator table tabs tooltip \
  select dialog sheet scroll-area skeleton alert input label form \
  dropdown-menu popover calendar alert-dialog
```

### TypeScript config (verplicht strict)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Overige project-setup

- `.env.example` — `VITE_API_BASE_URL`, `VITE_MOCK_ENABLED=true`
- `.env.local` — lokale overrides, nooit in git
- `.gitignore` — `node_modules`, `dist`, `.env.local`, `.DS_Store`, `coverage/`
- `vite-env.d.ts` — `ImportMetaEnv` uitgebreid met getypte env-variabelen
- `.vscode/settings.json` — format on save, Tailwind IntelliSense
- `.vscode/extensions.json` — aanbevolen extensies

### `package.json` scripts

```json
{
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext .ts,.tsx",
  "lint:fix": "eslint src --ext .ts,.tsx --fix",
  "typecheck": "tsc --noEmit",
  "format": "prettier --write src",
  "test": "vitest",
  "test:coverage": "vitest --coverage",
  "analyze": "vite-bundle-visualizer"
}
```

------

## Fase 2 — Mappenstructuur

```
src/
├── components/
│   ├── ui/                          # shadcn output — nooit handmatig aanpassen
│   ├── layout/
│   │   ├── AppShell.tsx             # sidebar + topbar + <Outlet />
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── common/
│   │   ├── SnapshotTimeline.tsx     # herbruikbare snapshot-navigator
│   │   ├── FieldGroup.tsx           # gelabeld veldengrid
│   │   ├── EditableField.tsx        # enkelvoudig bewerkbaar veld
│   │   ├── StatusBadge.tsx          # loonstatusbadge + meldingsindicator
│   │   ├── DeleteButton.tsx         # altijd disabled
│   │   ├── BerichtPreview.tsx       # Sheet met JSON preview + kopieer/download
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
│   ├── overzicht/
│   │   ├── LonenTable.tsx
│   │   ├── PeriodSelector.tsx
│   │   └── DetailPanel/
│   │       ├── DetailPanel.tsx
│   │       ├── ArbeidstijdKalender.tsx
│   │       ├── BrutoNettoBerekening.tsx
│   │       ├── MeldingenPanel.tsx
│   │       ├── VerloftellersPanel.tsx
│   │       ├── VoorschotPanel.tsx
│   │       └── OpmerkingPanel.tsx
│   ├── werkgever/
│   │   └── WerkgeverForm.tsx
│   ├── persoon/
│   │   ├── PersoonForm.tsx
│   │   └── PersoonSnapshotForm.tsx
│   ├── contract/
│   │   ├── ContractForm.tsx
│   │   └── ContractSnapshotForm.tsx
│   └── loonberekening/
│       ├── ArbeidstijdTable.tsx
│       ├── BerekeningSection.tsx
│       └── MeldingenList.tsx
├── config/
│   ├── enums.ts                     # string unions + i18n-key maps
│   ├── queryKeys.ts                 # TanStack Query key factory
│   └── routes.ts                    # getypte routeconstanten + path builders
├── hooks/
│   ├── useAuth.ts
│   ├── useWerkgevers.ts
│   ├── useWerkgever.ts
│   ├── useLonen.ts
│   ├── usePersoon.ts
│   ├── useContract.ts
│   ├── useLoonberekening.ts
│   ├── useSelectedPersoon.ts
│   └── useUnsavedChangesGuard.ts
├── i18n/
│   ├── index.ts
│   └── locales/
│       ├── nl/translation.json
│       └── fr/translation.json
├── lib/
│   ├── apiClient.ts
│   ├── messageGenerator.ts          # pure berichtgeneratie
│   ├── werkgever.api.ts
│   ├── lonen.api.ts
│   ├── persoon.api.ts
│   ├── contract.api.ts
│   ├── loonberekening.api.ts
│   ├── validations/
│   │   ├── belgisch.schema.ts
│   │   ├── werkgever.schema.ts
│   │   ├── persoon-snapshot.schema.ts
│   │   ├── contract-snapshot.schema.ts
│   │   └── loonberekening.schema.ts
│   └── mock/
│       ├── storage.ts
│       ├── berichten.mock.ts
│       ├── data/
│       │   ├── werkgevers.ts
│       │   ├── personen.ts
│       │   ├── contracten.ts
│       │   └── loonberekeningen.ts
│       ├── werkgever.mock.ts
│       ├── lonen.mock.ts
│       ├── persoon.mock.ts
│       ├── contract.mock.ts
│       └── loonberekening.mock.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── WerkgeversListPage.tsx
│   ├── WerkgeverPage.tsx
│   ├── OverzichtLonenPage.tsx
│   ├── PersoonPage.tsx
│   ├── ContractPage.tsx
│   ├── LoonberekeningPage.tsx
│   ├── BerichtenPage.tsx
│   └── NotFoundPage.tsx
├── test/
│   ├── setup.ts
│   └── renderWithProviders.tsx
├── types/
│   └── types.ts
├── utils/
│   ├── dateUtils.ts
│   ├── formatUtils.ts
│   └── snapshotUtils.ts
├── App.tsx
└── main.tsx
```

------

## Fase 3 — TypeScript Types (`src/types/types.ts`)

Volledige mapping van alle C# klassen als `readonly` interfaces met `T | null` voor nullable velden. Enums zijn string union types.

### Enums

```ts
export type Geslacht = 'Man' | 'Vrouw' | 'X'
export type BurgerlijkeStaat = 'Ongehuwd' | 'Gehuwd' | 'Weduwe' | 'WettelijkGescheiden'
  | 'FeitelijkGescheiden' | 'Samenwonend' | 'FeitelijkSamenwonend' | 'ScheidingVanTafelEnBed'
export type TypeBVBerekening = 'VastPercentage' | 'Schalen'
export type PartnerInkomsten = 'EigenInkomsten' | 'EigenInkomstenOnderGrens3'
  | 'EigenInkomstenOnderGrens2' | 'EigenInkomstenOnderGrens1' | 'GeenEigenInkomsten'
export type Taal = 'Nederlands' | 'Frans'
export type Gewest = 'Vlaanderen' | 'Wallonie' | 'Brussel'
export type Arbeidsstelsel = 'Voltijds' | 'Deeltijds' | 'Flexi' | 'Jobstudent'
export type Bezoldigingswijze = 'UurLoon' | 'MaandLoon' | 'DagLoon'
export type VerloningsPeriodiciteit = 'Maandelijks' | 'Tweewekelijks' | 'Wekelijks'
export type TypeContract = 'OnbepaaldeDuur' | 'BepaaldeDuur' | 'Vervangingscontract' | 'Uitvoering'
export type TypeForfait = 'Geen' | 'Klein' | 'Groot'
export type Taalgebied = 'Nederlandstalig' | 'Franstalig' | 'Duitstalig' | 'Tweetalig'
export type Periodiciteit = 'Maandelijks' | 'Tweewekelijks' | 'Wekelijks' | 'Dagelijks'
export type VrijstellingType = 'Ploegenarbeid' | 'Nachtarbeid' | 'VolContinue'
  | 'OnroerendeStaat' | 'PloegenarbeidBIS' | 'VolContinueBIS'
export type LoonStatus = 'TeBerekenen' | 'TeControleren' | 'Klaargezet' | 'Afgesloten' | 'Betaald'
export type MeldingSeverity = 'Blokkerend' | 'Waarschuwend'
```

### Domeininterfaces

Volledige mapping van `WerkgeverGewijzigd`, `PersoonGewijzigd` + `PersoonSnapshot`, `ContractGewijzigd` + `ContractSnapshot`, `LoonberekeningBepaald` en alle sub-types.

**Regels:**

- `[Obsolete]`-velden (`GrensArbeiderPeriodes`, `Vestigingsnummer`, `PlaatsVestiging`, `NotieVrijstellingPrestaties`) krijgen `@deprecated` JSDoc — niet gerendered in formulieren
- Systeem-managed velden (`RecordDatum`, alle `*ReferentieId`) zijn read-only in alle formulieren

------

## Fase 4 — Config · i18n · API Layer · Hooks · Routing

- **`enums.ts`** — `Record<EnumType, i18nKey>` maps voor alle enums
- **`routes.ts`** — getypte routeconstanten + typed path builder functies
- **`queryKeys.ts`** — TanStack Query key factory (alle keys als `as const` tuples)
- **i18n** — NL (standaard) + FR · alle zichtbare strings via `t('sleutel')` · taalkeuze persisteert in localStorage · `fallbackLng: 'nl'` · `saveMissing: true` (console.warn in DEV)
- **Hooks** — `useQuery` + `useMutation` per entiteit · query-invalidatie na elke mutatie in `onSuccess` · `keepPreviousData` op overzichtscherm
- **Router** — `createBrowserRouter` · lazy loading alle routes behalve Login · `<Suspense fallback={<PageSkeleton />}>` · `<ScrollRestoration />` · `RequireAuth` wrapper · URL-state voor periodefilter + geselecteerde persoon · `*` → NotFoundPage

------

## Fase 4b — Mock Data (`src/lib/mock/`)

### Storage (`storage.ts`)

```ts
function loadFromStorage<T>(key: string, fallback: T): T
function saveToStorage<T>(key: string, data: T): void  // vangt QuotaExceededError op
function clearStorage(key: string): void
```

### localStorage keys

| Key                      | Inhoud                          |
| ------------------------ | ------------------------------- |
| `prato_werkgevers`       | `WerkgeverGewijzigd[]`          |
| `prato_personen`         | `PersoonGewijzigd[]`            |
| `prato_contracten`       | `ContractGewijzigd[]`           |
| `prato_loonberekeningen` | `LoonberekeningBepaald[]`       |
| `prato_loon_statussen`   | `Record<persoonId, LoonStatus>` |
| `prato_berichten_log`    | `BerichtLogEntry[]`             |

Bij eerste gebruik: voorgedefinieerde mock-arrays ingeladen en weggeschreven. Mutaties: lees → pas aan → schrijf volledig terug. Netwerk-delay: ~300ms per mock-functie.

### Werkgevers — min. 3

| ID     | Scenario                                                     |
| ------ | ------------------------------------------------------------ |
| WG-001 | Grote onderneming, meerdere paritaire comités, maaltijdcheques, BV-vrijstellingen actief |
| WG-002 | KMO, eenvoudig profiel, geen maaltijdcheques                 |
| WG-003 | Flexi-werkgever, dagelijkse periodiciteit                    |

Alle velden ingevuld met realistisch Belgisch adres, geldig RSZ-formaat, BTW, IBAN.

### Personen — min. 5 per werkgever

Variatie: Geslacht (M/V/X), BurgerlijkeStaat (≥4), TypeBvBerekening (beide), Mindervalide, ten laste (kinderen + ouderen), Taal (mix NL/FR) · elke persoon min. 2 snapshots · één persoon ≥3 snapshots

### Contracten — min. 1-2 per persoon

Variatie: TypeContract (3 soorten), Arbeidsstelsel (4 soorten), Bezoldigingswijze (mix), StarterJob, BV-vrijstellingen (meerdere vlaggen) · min. 2 snapshots · één afgelopen contract (EindDatum ingevuld)

### Loonberekeningen — min. 1 per persoon per periode

Periodes: jan 2025 + feb 2025 · alle 5 loonstatussen aanwezig · min. 2 blokkerende + 2 waarschuwende + 1 zonder meldingen · volledige maandkalender (werkuren, vakantie, ziekte, weekends) · min. 1 met loonbeslag · min. 1 met werkuitkering · min. 1 met voorschot betaald

------

## Fase 5 — Schermen (pauze + review na elk scherm)

> **Werkwijze:** Na elk scherm stop, toon resultaat, wacht op goedkeuring, dan pas verder.

### Scherm 1 — Login

**Route:** `/login` Prato-logo + "PRATO" in witte hoofdletters + één "Inloggen"-knop → navigeert naar werkgeverslijst.

### Scherm 2 — Werkgevers lijst

**Route:** `/werkgevers` Tabel: `MaatschappelijkeNaam`, `OndernemingsNummer`, `RSZNummer` · sortering · paginatie · "Details"-knop per rij · "Nieuwe werkgever"-knop · disabled "Verwijderen" per rij · lege state met CTA.

### Scherm 3 — Details werkgever

**Route:** `/werkgevers/:werkgeverReferentieId` Bewerkbaar formulier (React Hook Form + Zod) — secties:

1. Identificatie — `OndernemingsNummer`, `RSZNummer`, `BTWNummer`, `RechtspersonenRegister`
2. Naam & Structuur — `MaatschappelijkeNaam`, `Vennootschapsvorm`, `Taal`, `Periodiciteit`
3. Contactgegevens — `Adres`, `Email`, `Telefoon`, `Website`
4. Bankgegevens — `Rekeningnummer` (IBAN+BIC), `RekeningnummerLonen`
5. Sociale zekerheid — `ParitaireComites`, `Vrijstellingen`, `BetaaltBvZelf`, DMFA-vlaggen
6. Maaltijdcheques — `ChequeLeverancier`
7. Overige — `NotieCuratele`, `Erkenningsnummer`, `BegindatumVakantieperiode`

Acties: **Opslaan** (+ genereert `WerkgeverGewijzigd` bericht) · **Annuleren** · disabled **Verwijderen** · "Naar overzicht lonen"-knop.

### Scherm 4 — Overzicht lonen

**Route:** `/werkgevers/:werkgeverReferentieId/lonen?van=&tot=&persoonId=` Periodefilter (synct met URL) · TanStack Table:

| Kolom          | Inhoud                                                       |
| -------------- | ------------------------------------------------------------ |
| Persoon-ID     | `persoonReferentieId`                                        |
| Naam           | `familieNaam` + `voornaam`                                   |
| Type werknemer | `arbeidsstelsel`                                             |
| Meldingen      | Rood badge (blokkerend) / amber (waarschuwend)               |
| Status         | Bewerkbare `<Select>`: Te berekenen / Te controleren / Klaargezet / Afgesloten / Betaald |

Rijklik → inline detailpaneel (zelfde scherm) met tabs:

- **Arbeidstijd** — `ArbeidstijdKalender` (7-koloms maandgrid)
- **Berekening** — `BrutoNettoBerekening` (watervalweergave)
- **Meldingen** — blokkerend (rood) + waarschuwend (amber)
- **Verloftellers** — placeholder/TODO
- **Voorschot** — conditioneel
- **Opmerkingen** — conditioneel

Onderaan paneel: beknopte persooninfo + **"Details persoon"** · beknopte contractinfo + **"Details contract"** · **"Details loonberekening"**

### Scherm 5 — Details persoon

**Route:** `/werkgevers/:werkgeverReferentieId/personen/:persoonReferentieId` SnapshotTimeline bovenaan. Bewerkbaar formulier per actieve snapshot:

1. Identiteit — `INSZNummer`, `FamilieNaam`, `Voornaam`, `Geslacht`, `Geboortedatum`, `GeboortePlaats`, `Taal`
2. Adres — `Straat`, `Huisnummer`, `Bus`, `Gemeente`, `PostCode`, `Land`
3. Financieel — `IBAN`, `BIC`, `EmailLoonbrief`
4. Fiscaal — `BurgerlijkeStaat`, `TypeBvBerekening`, `VastBvPercentage` (conditioneel), `Mindervalide`, `PartnerInkomsten`, `PartnerMindervalide`
5. Ten laste — 7 tellers
6. Tewerkstelling — `DatumInDienst`, `GepensioneerdVanaf`, `Werknemerskengetallen`

Acties: **Opslaan** (+ genereert `PersoonGewijzigd`) · **Nieuw snapshot** (pre-fill van laatste) · disabled **Verwijderen** · "Nieuwe persoon"-knop.

### Scherm 6 — Details contract

**Route:** `/werkgevers/:werkgeverReferentieId/contracten/:contractReferentieId` SnapshotTimeline bovenaan. Bewerkbaar formulier per actieve snapshot:

1. Periode — `BeginDatum`, `EindDatum`, `AanvangsDatum`
2. Identificatie — `ParitairComite`, `Gewest`, `WerknemersStatuut`, `Functie`, `TypeWerknemerDimona`, `Tikkaartnummer`
3. Arbeidsregeling — `Arbeidsstelsel`, `TypeContract`, `VerloningsPeriodiciteit`, `Bezoldigingswijze`, `VoltijdsReferentieRegime`, `TypeForfait`, `Taalgebied`
4. Verloning — `Loon`, `WerkgeversbijdrageMaaltijdcheque`, `MaaltijdchequesManueelToegekend`, `StarterJob`
5. BV-vrijstellingen — 6 boolean vlaggen
6. Overige — `BuitenlandseLoonbelasting`, `NotieLaattijdigeFlexi`

Acties: **Opslaan** (+ genereert `ContractGewijzigd`) · **Nieuw snapshot** · disabled **Verwijderen** · "Nieuw contract"-knop.

### Scherm 7 — Details loonberekening

**Route:** `/werkgevers/:werkgeverReferentieId/loonberekeningen/:loonberekeningReferentieId` Bewerkbaar formulier: `FiscaalJaar`, `Loonperiode`, `Berekeningsdatum`, `BerekeningType` · `ArbeidstijdTable` (bewerkbaar per dag) · `BerekeningSection` per stap (bruto/RSZ/belastbaar/BV/BBSZ/netto) · `LoonbeslagBerekeningen` · `WerkuitkeringBerekening` (conditioneel) · `MeldingenList`.

Acties: **Opslaan** (+ genereert `LoonberekeningBepaald`) · disabled **Verwijderen**.

------

## Fase 5b — Design System

### CSS variabelen (`src/index.css`)

```css
--color-primary:        #3b5cc8;
--color-primary-hover:  #2f4eb0;
--color-bg-page:        #2d2d2d;
--color-bg-card:        #ffffff;
--color-bg-sidebar:     #1e1e1e;
--color-text:           #1a1a1a;
--color-text-muted:     #6b7280;
--color-border:         #e5e7eb;
--color-accent-top:     #3b5cc8;
--color-error-bg:       #fef2f2;
--color-error-text:     #991b1b;
--color-warning-bg:     #fffbeb;
--color-warning-text:   #92400e;
```

### Card-patroon

Witte achtergrond · `border-top: 3px solid var(--color-accent-top)` · subtiele schaduw · ruime padding.

### Knoppen

Primair: vol blauw · Secundair: outlined blauw · Verwijderen: grijs + `cursor: not-allowed` (altijd disabled).

### Foutmeldingen

`--color-error-bg` + `--color-error-text` · rechthoekige box · geen icoon vereist.

### Tailwind thema-extensie

```ts
theme: { extend: { colors: {
  primary: 'var(--color-primary)',
  'bg-page': 'var(--color-bg-page)',
  // ...
}}}
```

### Moderne toevoegingen

Donkere zijbalk · skeleton loaders · smooth tab-transitions (`transition: opacity 150ms ease`) · sticky tabelheaders · hover-states op tabelrijen · sonner toasts · loonstatus badges (grijs/oranje/blauw/groen/donkergroen).

### Responsiviteit

Min. viewport: 1024px · onder 1024px: tabel scrolt horizontaal, zijbalk inklapbaar · `@media print`: zijbalk verbergen, `BrutoNettoBerekening` uitvouwen.

------

## Fase 5c — Error Boundary Strategie

**3 niveaus:**

1. **App-niveau** (`App.tsx`) — volledig scherm foutpagina + "Herlaad"-knop
2. **Route-niveau** — elke route gewrapped → crash op één scherm laat navigatie intact
3. **Component-niveau** — `DetailPanel`, `ArbeidstijdKalender`, `BrutoNettoBerekening`, `SnapshotTimeline`

**Weergave bij fout:** card met rode accentlijn · foutboodschap in monospace · "Toon details"-toggle (DEV: volledige stack trace) · "Opnieuw proberen"-knop.

**Async fouten (naast error boundaries):**

| Fouttype             | Opgevangen door                       |
| -------------------- | ------------------------------------- |
| Renderfouten         | `ErrorBoundary` niveau 2/3            |
| Mislukte query       | `isError` → inline `<Alert>`          |
| Mislukte mutatie     | `onError` → sonner toast              |
| `QuotaExceededError` | `storage.ts` try/catch → console.warn |
| Onverwachte crash    | `ErrorBoundary` niveau 1              |

------

## Fase 6 — Herbruikbare Componenten

**`SnapshotTimeline<T extends { aanvangsDatum: string }>`** Horizontale tijdlijnbalk · elk segment = klikbare knop met datumbereik · actief segment = primaire kleur · standaard meest recent · `aria-pressed` + `aria-label` per segment.

**`FieldGroup` + `Field`** CSS-grid (2 kolommen md+) · `<dt>` + `<dd>` · null → em-streepje · boolean → vinkje/kruis · datum → `dd/MM/yyyy` · currency → `Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' })`.

**`ArbeidstijdKalender`** 7-koloms maandgrid via date-fns · cellen: gewerkte uren (groen), afwezigheid (kleur per type), geen data (grijs), weekend (gedempt) · `Map<string, Arbeidstijdgegeven>` voor O(1) opzoeken · aggregatierij onderaan.

**`BrutoNettoBerekening`** Watervalweergave: bruto → RSZ → belastbaar → BV → BBSZ → netto · subtotalen per sectie · `<Separator>` tussen stappen · loonbeslag conditioneel · werkuitkering conditioneel.

**`MeldingenPanel`** Blokkerend (destructive, rood) + waarschuwend (amber) · gesorteerd: blokkerend eerst · code in monospace + omschrijving.

**`DeleteButton`** Altijd `disabled` · `cursor: not-allowed` · visueel aanwezig · `AlertDialog` structuur aanwezig voor toekomstig gebruik.

**`BerichtPreview`** Shadcn `<Sheet>` · header: berichttype + timestamp + entiteitnaam · `<pre>` met `JSON.stringify(bericht, null, 2)` · eenvoudige CSS syntax-kleuring (strings groen, keys blauw, nummers amber) · "Kopieer JSON" (`navigator.clipboard`) · "Download .json" (Blob URL) · "Bekijk laatste bericht"-knop op formulierschermen.

------

## Fase 7 — Utils

**`dateUtils.ts`** — `formatDate(iso): string` · `formatDateRange(van, tot): string` · `buildSnapshotRanges<T>` · `isDateInRange`

**`formatUtils.ts`** — `formatCurrency(amount): string` · `formatIBAN(iban): string`

**`snapshotUtils.ts`** — `getActiveSnapshot<T>(snapshots, referenceDate?)` · `prefillNewSnapshot<T>(snapshots)` (kopie van laatste, `aanvangsDatum: null`)

------

## Fase 8 — Best Practices

### 8.1 TanStack Query

```ts
new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5*60*1000, gcTime: 10*60*1000, retry: 2, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
})
```

React Query Devtools conditioneel in `main.tsx` (`import.meta.env.DEV`). Query-invalidatie in elke `useMutation` `onSuccess`. `keepPreviousData` op overzichtscherm.

### 8.2 TanStack Table

`getSortedRowModel()` · `getFilteredRowModel()` · `getPaginationRowModel()` · `ColumnDef<T>` · filter op type werknemer + meldingsstatus.

### 8.3 Zod Schemas (`src/lib/validations/`)

**Belgische validators (`belgisch.schema.ts`):**

```ts
// INSZ: 97 - (9 cijfers mod 97), +2 voor geboortejaar >= 2000
export const inszSchema = z.string().refine(validateInsz, 'Ongeldig INSZ-nummer')
// IBAN: BE + 14 cijfers, MOD-97
export const belgischIbanSchema = z.string().refine(validateIban, 'Ongeldig IBAN')
// BTW/KBO: BE + 10 cijfers, MOD-97 op cijfers 3-10
export const btwNummerSchema = z.string().refine(validateBtw, 'Ongeldig BTW-nummer')
// Belgische postcode: 4 cijfers, 1000-9999
export const belgischPostcodeSchema = z.string().regex(/^\d{4}$/).refine(n => +n >= 1000)
// BIC: 8 of 11 tekens
export const bicSchema = z.string().regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)
```

**Entiteitsschema's:** `werkgever.schema.ts` · `persoon-snapshot.schema.ts` (conditioneel: `VastBvPercentage` verplicht als `TypeBvBerekening === 'VastPercentage'`) · `contract-snapshot.schema.ts` (`EindDatum > BeginDatum`, `AanvangsDatum > vorige snapshot` als cross-record check in `onSubmit`) · `loonberekening.schema.ts`.

### 8.4 React Hook Form patronen

**Unsaved changes guard:**

```ts
// hooks/useUnsavedChangesGuard.ts — via React Router v7 useBlocker
export function useUnsavedChangesGuard(isDirty: boolean) { ... }
// Toont <AlertDialog>: "Wijzigingen gaan verloren. Verdergaan?"
```

Toegepast op alle 4 formulierschermen.

Submit-knop: `disabled` + spinner via `formState.isSubmitting`. Systeem-velden (`RecordDatum`, `*ReferentieId`) niet gerendered in formulieren.

### 8.5 Routing aanvullingen

Lazy loading alle routes behalve Login · `<ScrollRestoration />` in AppShell · URL-state: `?van=&tot=&persoonId=` op overzichtscherm · `RequireAuth` wrapper met redirect naar `/login?from=...` en terugnavigatie na login.

### 8.6 UX patronen

Sonner toasts: `toast.success('Opgeslagen')` + `toast.error(message)` · lege states per lijst · `AlertDialog` voor destructieve acties · externe links (`Url`, `BerichtUrl`) als `<a target="_blank" rel="noopener noreferrer">` · verloftellers als zichtbaar TODO-placeholder.

### 8.7 Toegankelijkheid

Focus naar `<h1>` bij elke routewijziging · skip-nav link als eerste focusbaar element (`sr-only focus:not-sr-only`) · `aria-live="polite"` regio in AppShell · WCAG AA kleurcontrast geverifieerd op alle statusbadges · tekst is nooit enige informatiedrager.

### 8.8 Testing (`src/test/`)

```
vitest + @testing-library/react + jsdom + msw
test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', coverage: { thresholds: { lines: 70 } } }
```

`renderWithProviders.tsx` — wrapper met QueryClientProvider + RouterProvider + I18nextProvider.

**Minimale testdekking MVP:**

1. Belgische validators (INSZ, IBAN, BTW) — pure functies
2. Snapshot utilities (`getActiveSnapshot`, `buildSnapshotRanges`, `prefillNewSnapshot`)
3. Formuliersubmissie persoon-snapshot (happy path + validatiefouten)

------

## Fase 9 — Berichtengeneratie

Elke mutatie wordt omgezet naar een JSON bericht volgens C# specificaties en gelogd in de `SyncQueueService`. De `SyncActivityDrawer` opent automatisch om de payload te tonen: `PersoonGewijzigd`, `ContractGewijzigd`, `WerkgeverGewijzigd`, `LoonberekeningBepaald`.

### Berichten per entiteit

| Actie                        | Gegenereerd bericht     |
| ---------------------------- | ----------------------- |
| Werkgever opgeslagen         | `WerkgeverGewijzigd`    |
| Persoon snapshot opgeslagen  | `PersoonGewijzigd`      |
| Contract snapshot opgeslagen | `ContractGewijzigd`     |
| Loonberekening opgeslagen    | `LoonberekeningBepaald` |

### `src/lib/messageGenerator.ts` — pure functies

```ts
export function generatePersoonGewijzigd(persoon: PersoonGewijzigd): PersoonGewijzigd {
  return { ...persoon, recordDatum: new Date().toISOString() }
}
// idem voor ContractGewijzigd, WerkgeverGewijzigd, LoonberekeningBepaald
```

Data is al in de correcte berichtshape. Enkel `RecordDatum` wordt vers ingesteld.

### `src/lib/mock/berichten.mock.ts` — berichtenlog

```ts
export interface BerichtLogEntry {
  readonly id: string
  readonly type: 'PersoonGewijzigd' | 'ContractGewijzigd' | 'WerkgeverGewijzigd' | 'LoonberekeningBepaald'
  readonly timestamp: string
  readonly entiteitId: string
  readonly entiteitNaam: string
  readonly bericht: unknown
}
export function logBericht(entry: Omit<BerichtLogEntry, 'id' | 'timestamp'>): BerichtLogEntry
export function fetchBerichten(): BerichtLogEntry[]
export function clearBerichten(): void
```

Opgeslagen in localStorage onder `prato_berichten_log`.

### Integratie in mutatie-hooks

Na elke succesvolle `onSuccess`:

1. Genereer bericht via `messageGenerator`
2. Log via `logBericht`
3. Sla op in lokale state
4. Open `BerichtPreview` sheet automatisch

### Niveau 1 — Directe preview (`BerichtPreview.tsx`)

Shadcn `<Sheet>` · opent automatisch na save · header: type + timestamp + entiteitnaam · `<pre>` met `JSON.stringify(bericht, null, 2)` · CSS syntax-kleuring (geen extra library) · "Kopieer JSON" + "Download .json" knoppen · "Bekijk laatste bericht"-knop blijft beschikbaar op formulierscherm.

### Niveau 2 — Berichtenlog (`BerichtenPage.tsx`)

**Route:** `/berichten` · link in zijbalk

Filterbar: berichttype (dropdown) + datum (datumbereik) + zoek op entiteitnaam · TanStack Table:

| Kolom     | Inhoud                                 |
| --------- | -------------------------------------- |
| Timestamp | `dd/MM/yyyy HH:mm:ss`                  |
| Type      | Badge per berichttype                  |
| Entiteit  | naam + ID                              |
| Acties    | "Bekijk JSON" → opent `BerichtPreview` |

Badgekleuren: `WerkgeverGewijzigd` (blauw) · `PersoonGewijzigd` (groen) · `ContractGewijzigd` (paars) · `LoonberekeningBepaald` (oranje)

"Log wissen"-knop met `AlertDialog` bevestiging · lege state: "Nog geen berichten gegenereerd. Sla een entiteit op om te starten."

------

## Fase 10 — Deployment — Firebase

Live URL: **https://prato-midoffice-gemini-v2.web.app**
Project: `prato-midoffice-gemini-v2`

## Verificatie per scherm (na elke pauze)

1. `npx tsc --noEmit` — geen TypeScript-fouten
2. `npm run lint` — geen ESLint-fouten
3. Manuele check:
   - Alle velden zichtbaar + correct gelabeld (i18n)
   - Formuliervalidatie werkt (Zod)
   - Opslaan triggert mock-mutatie + sonner toast + `BerichtPreview` sheet
   - Gegenereerde JSON correct geformatteerd in sheet
   - Bericht verschijnt in berichtenlog
   - Disabled verwijderknop aanwezig maar niet klikbaar
   - Navigatieknoppen correct
   - Focus-ring zichtbaar · aria-labels aanwezig

------

## Bouwinstructie (volgorde)

```
1.  Project setup (Vite + deps + shadcn + .env + .gitignore)
2.  src/types/types.ts
3.  src/config/* + src/i18n/locales/*
4.  src/lib/validations/belgisch.schema.ts + entiteitsschema's
5.  src/lib/mock/storage.ts + data/* + *.mock.ts + berichten.mock.ts
6.  src/lib/messageGenerator.ts
7.  src/hooks/*
8.  src/utils/*
9.  src/components/common/* (incl. ErrorBoundary + BerichtPreview)
10. src/components/layout/* + routing (AppShell, Sidebar, TopBar)

--- SCHERM 1: Login                    → pauze + review ---
--- SCHERM 2: Werkgevers lijst         → pauze + review ---
--- SCHERM 3: Details werkgever        → pauze + review ---
--- SCHERM 4: Overzicht lonen          → pauze + review ---
--- SCHERM 5: Details persoon          → pauze + review ---
--- SCHERM 6: Details contract         → pauze + review ---
--- SCHERM 7: Details loonberekening   → pauze + review ---
--- SCHERM 8: Berichtenlog             → pauze + review ---
```