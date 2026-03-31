# Prato MVP Werkplan

## 1. Doel van dit document

Dit document is het operationele masterplan voor de bouw van de Prato Midoffice MVP. Het is bewust veel gedetailleerder dan een klassiek projectplan, zodat het ook kan dienen als:

- uitvoeringsplan,
- geheugensteun wanneer de sessiecontext vol raakt,
- checklist tegen vergeten werk,
- overdrachtsdocument voor een volgende sessie,
- referentie om gemaakte keuzes opnieuw te verankeren.

Dit document moet dus gelezen worden als een combinatie van:

- scopebeschrijving,
- architectuurkader,
- uitvoerbare fasering,
- gedetailleerde takenlijst,
- lijst van alle te maken artefacten,
- lijst van risico’s en controlemomenten.

## 2. Projectcontext

We bouwen een frontend voor een Prato mid-office MVP. Deze applicatie dient als beheersinterface tussen PratoFlex en de Earnie-loonmotor. De applicatie is bedoeld om gegevens te beheren, te valideren, te tonen en om wijzigingen om te zetten naar berichtvormen die aansluiten op de beschikbare C# berichtklassen.

Belangrijkste domeinobjecten:

- `WerkgeverGewijzigd`
- `PersoonGewijzigd`
- `ContractGewijzigd`
- `LoonberekeningBepaald`

Belangrijkste functionele assen:

- werkgevers beheren,
- personen beheren over tijd via snapshots,
- contracten beheren over tijd via snapshots,
- loonberekeningen bekijken en bewerken,
- gegenereerde berichten zichtbaar maken in preview en log.

## 3. Leidende bronnen

### 3.1 Hoofddocument

Het leidende document voor implementatie is:

- `docs/Prato MVP Midoffice - Frontend Implementatieplan.md`

### 3.2 Aanvullende brondocumenten

Deze documenten blijven belangrijk als domeinbron:

- `docs/midoffice-voor-beheer-van-personen.md`
- `docs/prato-omschrijving-via-mail 2.md`
- `docs/prato-midoffice-earnie-fix-mvp-beschrijving.md`

### 3.3 Regels voor brongebruik

- Voor technische architectuur volgen we het React/Vite-plan.
- Voor velddefinities, berichtstructuren en domeinbetekenis mogen de aanvullende documenten gebruikt worden.
- Als documenten elkaar tegenspreken, wint het React/Vite implementatieplan voor technische keuzes.
- Als aanvullende docs uitgebreider zijn qua velden, worden die meegenomen in de types, zelfs als de UI gefaseerd volgt.

## 4. Vastgelegde beslissingen

Deze keuzes zijn bevestigd en moeten als hard kader behandeld worden:

- We starten van nul code.
- We bouwen een frontend-only MVP.
- Er is geen echte backend in MVP 1.
- Er is geen echte database in MVP 1.
- We werken met mocks en `localStorage`.
- We volgen React 19 + TypeScript + Vite.
- We volgen `shadcn/ui + Tailwind`.
- We voorzien i18n vanaf het begin.
- Nederlands is de standaardtaal.
- Frans wordt technisch meteen voorzien.
- De domeintypes worden volledig gemodelleerd op basis van de C# berichten.
- We bouwen scherm per scherm.
- Na elk scherm is er een reviewpauze.
- We voorzien realistische Belgische mockdata.
- Berichtengeneratie hoort vanaf de eerste versie in scope.
- Berichtenlog hoort vanaf de eerste versie in scope.
- Testen horen vanaf de funderingsfase in scope.
- Firebase deployment blijft op de planning, maar pas na expliciete toestemming.
- Bij elke stap moet er een expliciete statusupdate naar de gebruiker gaan.

## 5. Werkafspraken voor uitvoering

Deze werkafspraken gelden tijdens de hele bouw:

- Voor elke substantiële stap geven we expliciet aan wat we aan het doen zijn.
- Voor elke edit kondigen we aan wat we gaan aanpassen.
- We lezen bestanden opnieuw vlak voor we ze wijzigen.
- We werken in kleine, gerichte stappen.
- We valideren zo klein mogelijk maar wel betekenisvol.
- We volgen retrieval-led reasoning: eerst repo- en doc-patronen, dan pas nieuwe keuzes.
- Als er later twijfel ontstaat, wordt dit document geraadpleegd vóór er nieuwe interpretaties gemaakt worden.

## 6. Scope van MVP 1

### 6.1 Wat moet MVP 1 absoluut bevatten

- loginpagina met mock-inlog,
- werkgeverslijst,
- werkgeverdetails,
- loonoverzicht,
- persoondetails,
- contractdetails,
- loonberekeningdetails,
- berichtenlog,
- lokale opslag van data,
- lokale opslag van instellingen,
- lokale opslag van berichtenlog,
- CRUD voor de velden die op de schermen voorkomen,
- toevoegen van werkgever, persoon en contract,
- zichtbare maar disabled delete-acties,
- validatie voor belangrijke Belgische velden,
- berichtengeneratie op save,
- preview van gegenereerde JSON,
- tabel- en detailnavigatie,
- i18n-structuur,
- foutafhandeling,
- basis toegankelijkheid,
- testfundering.

### 6.2 Wat bewust buiten MVP 1 valt

- echte authenticatie,
- echte REST API,
- echte database,
- synchronisatie met externe diensten,
- effectieve delete-functionaliteit,
- volledige enterprise-validatieregels buiten wat expliciet in docs staat,
- rapportering buiten de JSON-berichtgerichte flow,
- geavanceerde rollen- en rechtenstructuur,
- mobiele optimalisatie als primary target,
- performantie-optimalisatie zonder concrete bottleneck,
- productie-deploy zonder expliciete bevestiging.

## 7. Architectuurkader

## 7.1 Frontend stack

- Vite 7
- React 19
- TypeScript 5.x strict
- React Router DOM v7
- TanStack Query v5
- TanStack Table v8
- React Hook Form
- `@hookform/resolvers`
- Zod
- date-fns
- i18next
- react-i18next
- i18next-browser-languagedetector
- i18next-http-backend
- sonner
- clsx
- Tailwind CSS
- shadcn/ui

## 7.2 Data-architectuur

- brondata leeft lokaal in mock datasets,
- mock service-modules doen alsof er een API-laag bestaat,
- persistente opslag gebeurt via `localStorage`,
- mutaties schrijven volledige entiteitensets terug,
- wijzigingen genereren berichten in C#-compatibele shape,
- berichten worden gelogd en visueel raadpleegbaar gemaakt.

## 7.3 Domeinarchitectuur

- werkgevers zijn top-level ingang,
- personen hangen functioneel onder werkgevers,
- contracten koppelen persoon en werkgever,
- loonberekeningen zijn periodegebonden,
- personen en contracten zijn snapshot-gebaseerd,
- snapshots bepalen tijdsafhankelijke geldigheid.

## 7.4 UI-architectuur

- layoutlaag voor shell, navigatie en globale status,
- pagina’s per route,
- herbruikbare componenten voor formulieren en detailweergaven,
- hooks voor stateful gedrag,
- services/mock API’s voor data-afhandeling,
- utils voor pure berekeningen en formatting.

## 8. Belangrijkste spanningen en aanbevelingen

### 8.1 Repo-standaard versus gekozen UI-richting

De algemene repo-instructies geven een voorkeur aan vanilla CSS, maar dit project kiest bewust voor `shadcn/ui + Tailwind`.

Aanpak:

- de gekozen stack volgen,
- design tokens toch centraliseren,
- geen willekeurige styling-patronen introduceren,
- utility-gebruik disciplineren rond componenten en layoutpatronen.

### 8.2 Volledige types versus gefaseerde UI

De berichtmodellen zijn uitgebreider dan de eerste schermnoden.

Aanpak:

- types eerst volledig modelleren,
- UI pas gefaseerd openen,
- deprecated velden wel opnemen maar niet renderen in formulieren.

### 8.3 Zware loonberekeningsscope

`LoonberekeningBepaald` kan de planning ontsporen als het te vroeg te ambitieus aangepakt wordt.

Aanpak:

- eerst types, mocks en renderstructuur,
- daarna pas rijke detailcomponenten.

### 8.4 Realistische mockdata als tijdsink

Mockdata moet geloofwaardig zijn maar mag de voortgang niet blokkeren.

Aanpak:

- eerst basale complete dataset,
- daarna scenarioverrijking.

### 8.5 i18n-overhead

Volledige vertaling kan de opbouw vertragen.

Aanpak:

- technische structuur meteen juist,
- inhoud iteratief uitbreiden.

## 9. Doelmap en beoogde projectstructuur

Deze structuur is een combinatie van wat in de docs staat en wat praktisch nodig is voor de MVP.

```text
src/
├── components/
│   ├── ui/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── common/
│   │   ├── SnapshotTimeline.tsx
│   │   ├── FieldGroup.tsx
│   │   ├── EditableField.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── DeleteButton.tsx
│   │   ├── BerichtPreview.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── PageSkeleton.tsx
│   │   └── ErrorBoundary.tsx
│   ├── werkgever/
│   │   └── WerkgeverForm.tsx
│   ├── persoon/
│   │   ├── PersoonForm.tsx
│   │   └── PersoonSnapshotForm.tsx
│   ├── contract/
│   │   ├── ContractForm.tsx
│   │   └── ContractSnapshotForm.tsx
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
│   └── loonberekening/
│       ├── ArbeidstijdTable.tsx
│       ├── BerekeningSection.tsx
│       └── MeldingenList.tsx
├── config/
│   ├── enums.ts
│   ├── queryKeys.ts
│   └── routes.ts
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
│   ├── messageGenerator.ts
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
│       ├── werkgever.mock.ts
│       ├── lonen.mock.ts
│       ├── persoon.mock.ts
│       ├── contract.mock.ts
│       ├── loonberekening.mock.ts
│       └── data/
│           ├── werkgevers.ts
│           ├── personen.ts
│           ├── contracten.ts
│           └── loonberekeningen.ts
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

## 10. Lijst van alle te maken artefacten

Dit is de meest expliciete “niets vergeten”-lijst. Elk item hieronder moet ofwel gemaakt worden, of bewust geschrapt worden met motivatie.

### 10.1 Projectroot

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `vite.config.ts`
- `eslint.config.js` of equivalent flat config
- `postcss.config.js` indien nodig
- `components.json` voor `shadcn`
- `.gitignore`
- `.env.example`
- `index.html`
- `README.md`

### 10.2 Styling en UI infrastructuur

- `src/index.css`
- Tailwind configuratie indien vereist door stackkeuze
- globale design tokens
- globale focus states
- globale kaart-/layoutstijlen
- globale utilities voor `sr-only`, skip links en statusvisibiliteit

### 10.3 App bootstrap

- `src/main.tsx`
- `src/App.tsx`
- QueryClient setup
- Router setup
- I18nProvider setup
- eventueel React Query Devtools in dev
- globale toast provider

### 10.4 Types

In `src/types/types.ts` moeten minstens volgende categorieën aanwezig zijn:

- enum string unions,
- werkgevertypes,
- persoontypes,
- persoonsnapshottypes,
- contracttypes,
- contractsnapshottypes,
- loonberekeningtypes,
- types voor berekeningsonderdelen,
- types voor meldingen,
- types voor arbeidstijdgegevens,
- types voor berichtenlog,
- hulpertypes voor formulier- en routegebruik.

### 10.5 Config

- routeconstanten
- path builders
- query key factory
- enum label maps
- eventueel app- of layoutconstanten als aparte config nodig blijkt

### 10.6 I18n

- basisconfiguratie
- `nl` translation file
- `fr` translation file
- taalbepaling
- fallback naar `nl`
- opslag van taalkeuze

### 10.7 Validatie

- INSZ-validator
- Belgisch IBAN-validator
- BTW/KBO-validator
- postcode-validator
- BIC-validator
- werkgeverschema
- persoon snapshot schema
- contract snapshot schema
- loonberekening schema

### 10.8 Utils

- datumformatting
- daterange-formatting
- snapshot range builder
- active snapshot finder
- new snapshot prefill helper
- currency formatting
- IBAN formatting

### 10.9 Storage en mocklaag

- `loadFromStorage`
- `saveToStorage`
- `clearStorage`
- afhandeling van `QuotaExceededError`
- storage keys constanten
- seed initialisatie
- mock latency gedrag

### 10.10 Mockdata

- minstens 3 werkgevers
- minstens 5 personen per werkgever
- snapshots voor personen
- contracten met snapshots
- loonberekeningen voor meerdere periodes
- statusvariatie
- meldingsvariatie
- afwezigheids- en arbeidstijdvariatie
- voorschotscenario
- werkuitkeringsscenario
- loonbeslagscenario

### 10.11 API-laag

- `werkgever.api.ts`
- `persoon.api.ts`
- `contract.api.ts`
- `lonen.api.ts`
- `loonberekening.api.ts`
- adapter naar mockimplementaties

### 10.12 Berichtenlaag

- pure `messageGenerator`
- type mapping voor log entries
- berichtenlog opslag
- berichtenlog read
- berichtenlog clear
- JSON preview download
- JSON preview copy

### 10.13 Hooks

- auth state hook
- query hooks per entiteit
- mutation hooks per entiteit
- selected persoon hook
- unsaved changes guard

### 10.14 Layoutcomponenten

- `AppShell`
- `Sidebar`
- `TopBar`
- skip link
- `aria-live` regio

### 10.15 Gedeelde componenten

- `SnapshotTimeline`
- `FieldGroup`
- `EditableField`
- `StatusBadge`
- `DeleteButton`
- `BerichtPreview`
- `LoadingSpinner`
- `PageSkeleton`
- `ErrorBoundary`

### 10.16 Schermspecifieke componenten

- `WerkgeverForm`
- `PersoonForm`
- `PersoonSnapshotForm`
- `ContractForm`
- `ContractSnapshotForm`
- `LonenTable`
- `PeriodSelector`
- `DetailPanel`
- `ArbeidstijdKalender`
- `BrutoNettoBerekening`
- `MeldingenPanel`
- `VerloftellersPanel`
- `VoorschotPanel`
- `OpmerkingPanel`
- `ArbeidstijdTable`
- `BerekeningSection`
- `MeldingenList`

### 10.17 Pagina’s

- `LoginPage`
- `WerkgeversListPage`
- `WerkgeverPage`
- `OverzichtLonenPage`
- `PersoonPage`
- `ContractPage`
- `LoonberekeningPage`
- `BerichtenPage`
- `NotFoundPage`

### 10.18 Testinfrastructuur

- `src/test/setup.ts`
- `src/test/renderWithProviders.tsx`
- validator tests
- snapshot utility tests
- eerste form tests

### 10.19 Deploymentbasis

- buildconfig correct
- preview smoke test mogelijk
- Firebase deploymentstap gedocumenteerd

## 11. Fase 0: fundering in detail

Fase 0 is de belangrijkste fase. Als die goed staat, gaan alle schermfases sneller en met minder fouten.

### 11.1 Substap: project scaffold

Te doen:

- Vite React TypeScript project initialiseren
- standaardbestanden opschonen
- repo geschikt maken voor eigen structuur

Controle:

- dev server kan starten
- build kan lopen
- TypeScript werkt

### 11.2 Substap: dependency setup

Te installeren:

- runtime dependencies uit het hoofddocument
- dev dependencies uit het hoofddocument
- controle of versies compatibel zijn

Controle:

- `package.json` is coherent
- lockfile bestaat
- geen ontbrekende peer dependencies

### 11.3 Substap: TypeScript strict configuratie

Te doen:

- `strict` aan
- `noUnusedLocals` aan
- `noUnusedParameters` aan
- `noUncheckedIndexedAccess` aan
- pad aliasing controleren

Controle:

- configuratie sluit aan op Vite
- app buildt zonder configfouten

### 11.4 Substap: lint- en formatfundering

Te doen:

- ESLint opzetten
- Prettier indien gewenst of impliciet via bestaande setup
- scripts voorzien

Controle:

- `npm run lint` werkt
- lint is zinvol en niet te breed of kapot

### 11.5 Substap: Tailwind en shadcn

Te doen:

- Tailwind setup
- `shadcn` init
- eerste UI componenten genereren die we zeker nodig hebben
- globale theme-aanpak beslissen binnen stackkader

Controle:

- styles laden correct
- UI component importeerbaar
- geen conflict met Vite setup

### 11.6 Substap: initiële mappenstructuur

Te doen:

- alle hoofdmappen creëren
- basis placeholderbestanden maken waar nodig
- naming consistent houden

Controle:

- structuur ondersteunt de verdere fasering
- geen barrel files

### 11.7 Substap: domeintypes

Te doen:

- enums uitschrijven
- interfaces of types definiëren
- nullable velden correct modelleren
- deprecated velden markeren
- read-only systeemvelden expliciet behandelen

Controle:

- types dekken de C# shapes
- types zijn bruikbaar voor forms, API’s en mocks

### 11.8 Substap: configlaag

Te doen:

- `routes.ts`
- `queryKeys.ts`
- `enums.ts`

Controle:

- routes zijn typed
- query keys volgen vaste patroon

### 11.9 Substap: i18n bootstrap

Te doen:

- i18n initialisatiebestand maken
- translation files maken
- taalvoorkeur detecteren en opslaan

Controle:

- app toont tekst via vertaalfunctie
- fallback naar `nl` werkt

### 11.10 Substap: storage helpers

Te doen:

- load helper
- save helper
- clear helper
- foutafhandeling

Controle:

- seed data kan veilig laden
- lege opslag veroorzaakt geen crash

### 11.11 Substap: mockdata basis

Te doen:

- werkgevers seed
- personen seed
- contracten seed
- loonberekeningen seed

Controle:

- referenties kloppen over datasets heen
- snapshots zijn chronologisch logisch

### 11.12 Substap: mock API-modules

Te doen:

- list/fetch/update/create flows maken
- mock delay toevoegen
- storage integreren

Controle:

- hooks kunnen hier later probleemloos op bouwen

### 11.13 Substap: berichtenlaag

Te doen:

- berichtengenerator
- berichtenlog type
- log storage
- list/clear functies

Controle:

- mutatiepad kan loggen zonder UI

### 11.14 Substap: utils

Te doen:

- date utils
- format utils
- snapshot utils

Controle:

- unit tests mogelijk
- geen UI-afhankelijkheid

### 11.15 Substap: hooks basis

Te doen:

- auth hook
- entity hooks
- unsaved changes guard

Controle:

- hooks passen in routing- en querymodel

### 11.16 Substap: app shell skeleton

Te doen:

- basis router
- layout shell
- placeholder routes
- suspense fallback

Controle:

- navigatie werkt
- lege pagina’s renderen

### 11.17 Substap: testbasis

Te doen:

- Vitest configureren
- jsdom setup
- render helper
- eerste tests toevoegen

Controle:

- tests draaien groen

## 12. Domeinmodellering in detail

Deze sectie is bedoeld als geheugenlijst zodat later geen typefamilies vergeten worden.

### 12.1 Enumeraties die minimaal voorzien moeten worden

- `Geslacht`
- `BurgerlijkeStaat`
- `TypeBVBerekening`
- `PartnerInkomsten`
- `Taal`
- `Gewest`
- `Arbeidsstelsel`
- `Bezoldigingswijze`
- `VerloningsPeriodiciteit`
- `TypeContract`
- `TypeForfait`
- `Taalgebied`
- `Periodiciteit`
- `VrijstellingType`
- `LoonStatus`
- `MeldingSeverity`

Aanvullende enums of unions kunnen nodig zijn op basis van de uitgebreidere appendices.

### 12.2 Werkgeverdomein

Minstens modelleren:

- `WerkgeverGewijzigd`
- `Adres`
- `Rekeningnummer`
- `WerkgeversCategorieDetail`
- `Ontvangstkantoor`
- `Fonds`
- `Verzekering`
- `Boekhouding`
- `ChequeLeverancier`
- `BerekeningswijzeEenDerdeNormBVPloegen`

### 12.3 Persoondomein

Minstens modelleren:

- `PersoonGewijzigd`
- `PersoonSnapshot`
- eventuele `Periode` voor deprecated veld

### 12.4 Contractdomein

Minstens modelleren:

- `ContractGewijzigd`
- `ContractSnapshot`
- `Loon`
- `MaatregelTotBevorderingWerkgelegenheid`
- `MaatregelTotReorganisatieArbeidstijd`
- `Cyclus`
- `VoltijdsReferentieRegime`
- `Facturatie`

### 12.5 Loonberekeningsdomein

Minstens modelleren:

- `LoonberekeningBepaald`
- `Loonperiode`
- `Arbeidstijdgegeven`
- `BrutoloonBerekening`
- `WerknemersbijdrageRSZBerekening`
- `BelastbaarTotaalBerekening`
- `BedrijfsvoorheffingBerekening`
- `BijzondereBijdrageSocialeZekerheidBerekening`
- `NettoloonBerekening`
- `LoonbepalingMelding`
- `LoonberekeningMelding`
- `LoonbeslagBerekening`
- `WerkuitkeringBerekening`

Als de subtypes in de docs impliciet of onvolledig zijn, moeten we ze afleiden en consistent modelleren.

## 13. Mockdata-plan in detail

### 13.1 Werkgevers

Minimale variatie:

- grote onderneming,
- KMO,
- flexi-werkgever.

Per werkgever moeten minstens aanwezig zijn:

- identificatie,
- contact,
- adres,
- bankrekening,
- taal,
- periodiciteit,
- paritaire comités,
- sociale zekerheidsrelevante velden,
- vrijstellingen.

### 13.2 Personen

Per werkgever minstens 5 personen.

Variatie voorzien in:

- geslacht,
- burgerlijke staat,
- type BV-berekening,
- mindervalide,
- partnerinkomsten,
- aantal personen ten laste,
- taal,
- pensioenstatus,
- meerdere snapshots.

### 13.3 Contracten

Per persoon minstens 1 contract, voor sommigen 2.

Variatie voorzien in:

- type contract,
- arbeidsstelsel,
- bezoldigingswijze,
- verloningsperiodiciteit,
- starterjob,
- vrijstellingsvlaggen,
- lopend contract,
- afgelopen contract.

### 13.4 Loonberekeningen

Periodebasis:

- januari 2025
- februari 2025

Variatie voorzien in:

- alle loonstatussen,
- blokkerende meldingen,
- waarschuwende meldingen,
- geen meldingen,
- voorschot,
- werkuitkering,
- loonbeslag,
- kalender met aanwezigheid en afwezigheid.

### 13.5 Integriteitsregels voor mockdata

- referentie-ID’s moeten consistent zijn,
- snapshots moeten chronologisch oplopen,
- actieve snapshots moeten logisch afleidbaar zijn,
- contracten moeten passen bij persoon en werkgever,
- loonberekeningen moeten verwijzen naar bestaand persoon/werkgever/contractcontext.

## 14. Routing- en navigatieplan

Minimale routes:

- `/login`
- `/werkgevers`
- `/werkgevers/:werkgeverReferentieId`
- `/werkgevers/:werkgeverReferentieId/lonen`
- `/werkgevers/:werkgeverReferentieId/personen/:persoonReferentieId`
- `/werkgevers/:werkgeverReferentieId/contracten/:contractReferentieId`
- `/werkgevers/:werkgeverReferentieId/loonberekeningen/:loonberekeningReferentieId`
- `/berichten`
- `*`

Routegedrag:

- login is publieke route,
- overige routes achter mock-auth,
- `from` redirect ondersteunen,
- scroll gedrag voorspelbaar houden,
- overzichtsscherm gebruikt URL-state voor filters.

## 15. UI-bouwplan in detail

## 15.1 Login

Moet bevatten:

- Prato branding,
- één inlogknop,
- geen credentials,
- redirect naar werkgeverslijst,
- consistente focus- en keyboardflow.

### 15.2 Werkgeverslijst

Moet bevatten:

- tabel,
- sortering,
- paginatie of ten minste tabelstructuur voorbereid,
- detailactie,
- nieuwe werkgever actie,
- disabled verwijderen,
- lege state.

### 15.3 Werkgeverdetails

Moet bevatten:

- bewerkbaar formulier,
- secties zoals in het plan,
- opslaan,
- annuleren,
- disabled verwijderen,
- navigatie naar loonoverzicht,
- berichtgeneratie op save.

### 15.4 Overzicht lonen

Moet bevatten:

- periodefilter,
- tabel met kolommen uit de docs,
- statusbeheer,
- meldingsindicator,
- inline detailpaneel,
- links naar persoon, contract en loonberekening.

### 15.5 Persoondetails

Moet bevatten:

- snapshot timeline,
- bewerkbaar formulier,
- nieuw snapshot,
- nieuwe persoon,
- disabled verwijderen,
- berichtgeneratie.

### 15.6 Contractdetails

Moet bevatten:

- snapshot timeline,
- bewerkbaar formulier,
- nieuw snapshot,
- nieuw contract,
- disabled verwijderen,
- berichtgeneratie.

### 15.7 Loonberekeningdetails

Moet bevatten:

- algemene metadata,
- arbeidstijdtabel,
- berekeningssecties,
- meldingen,
- conditionele delen voor voorschot, loonbeslag, werkuitkering,
- save met berichtgeneratie.

### 15.8 Berichtenlog

Moet bevatten:

- filteren,
- lijst of tabel,
- JSON preview,
- log wissen,
- lege state.

## 16. Herbruikbare componenten: detailchecklist

### 16.1 `SnapshotTimeline`

Moet kunnen:

- snapshots tonen in chronologische logica,
- actief segment markeren,
- datumrange tonen,
- meest relevante snapshot selecteren,
- toetsenbordtoegankelijk zijn.

### 16.2 `FieldGroup`

Moet kunnen:

- consistente presentatie van label/waarde,
- meerdere veldtypes ondersteunen,
- nullwaarden netjes tonen,
- semantisch correct zijn.

### 16.3 `EditableField`

Moet kunnen:

- verschillende invoertypes ondersteunen,
- integreren met formulieren,
- fouten tonen,
- labels en helptekst respecteren.

### 16.4 `StatusBadge`

Moet kunnen:

- loonstatus tonen,
- meldingsniveau tonen waar nodig,
- kleur en tekst consistent houden.

### 16.5 `DeleteButton`

Moet:

- altijd zichtbaar zijn,
- disabled blijven,
- visueel duidelijk maken dat delete later mogelijk is.

### 16.6 `BerichtPreview`

Moet kunnen:

- openen na save,
- JSON tonen,
- kopiëren,
- downloaden,
- context tonen zoals type en entiteit.

### 16.7 `ErrorBoundary`

Moet:

- renderfouten opvangen,
- bruikbare fallback tonen,
- ontwikkelvriendelijke detailweergave toelaten.

## 17. Validatie- en foutafhandelingsplan

### 17.1 Validatie

Minimaal valideren:

- INSZ
- IBAN
- BIC
- BTW/KBO
- postcode
- datumrelaties in snapshots
- conditionele velden zoals `VastBvPercentage`

### 17.2 Async foutafhandeling

Elke asynchrone operatie moet:

- falen zonder appcrash,
- feedback geven aan de gebruiker,
- consistente fallback tonen.

### 17.3 Storagefouten

`localStorage` kan falen door:

- quota,
- ongeldige JSON,
- corrupte oude data.

Aanpak:

- try/catch,
- veilige fallbacks,
- eventueel migratiehaak voorzien als shape wijzigt.

## 18. Teststrategie in detail

### 18.1 Wat moet vroeg getest worden

- pure validators,
- snapshot helpers,
- format helpers indien relevant,
- form happy path,
- form validatiefouten.

### 18.2 Wat later getest kan worden

- complexe detailpanelen,
- berichtenloginteracties,
- routeflow,
- grotere integratieflows.

### 18.3 Minimale testdoelstelling

- fundament is betrouwbaar,
- kritische pure logica is afgedekt,
- forms breken niet stilletjes.

## 19. Controlelijst per schermfase

Voor elk scherm moeten we minstens controleren:

- route werkt,
- pagina rendert zonder crash,
- labels zijn aanwezig,
- focusring is zichtbaar,
- formulieren werken,
- save werkt,
- mock data muteert correct,
- bericht wordt gegenereerd,
- berichtpreview opent,
- log entry verschijnt,
- disabled delete zichtbaar,
- navigatie terug/door werkt,
- lint en build blijven gezond voor betrokken code,
- eventuele tests blijven groen of worden aangevuld.

## 20. Validatie- en oplevercommando’s

Minimaal relevant tijdens uitvoering:

- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run preview`

Wanneer inzetten:

- na fundering,
- na grote gedeelde refactors,
- na schermfases waar zinvol.

## 21. Fases van uitvoering
Status: ✅ Gereed

## Fase A. Fundering volledig zetten

Doel:

- alle technische rails liggen.

Resultaat:

- een stabiele repo waarin schermen gebouwd kunnen worden.

Taken:

- scaffold
- dependencies
- config
- mappenstructuur
- types
- i18n
- storage
- mockbasis
- tests
- app shell skeleton

## Fase B. Gedeelde domein- en UI-bouwstenen

Doel:

- generieke bouwstenen klaarzetten vóór de eerste echte schermen.

Taken:

- `FieldGroup`
- `EditableField`
- `StatusBadge`
- `DeleteButton`
- `BerichtPreview`
- `ErrorBoundary`
- `SnapshotTimeline`
- basis form patronen

## Fase C. Scherm 1 Login

Doel:

- eerste zichtbare user flow afronden.

Taken:

- route
- mock auth flow
- branding
- navigatie

Reviewpauze verplicht na oplevering.

## Fase D. Scherm 2 Werkgeverslijst

Doel:

- eerste echte dataoverzicht klaar.

Taken:

- tabel
- acties
- lege state
- navigatie naar details

Reviewpauze verplicht na oplevering.

## Fase E. Scherm 3 Werkgeverdetails

Doel:

- eerste volledig formulier met save en berichtengeneratie.

Taken:

- formuliersecties
- validatie
- save
- toast
- berichtpreview
- link naar lonenoverzicht

Reviewpauze verplicht na oplevering.

## Fase F. Scherm 4 Overzicht lonen

Doel:

- de centrale operationele werkpagina van de MVP opleveren.

Taken:

- periodefilter
- tabel
- statusupdate
- detailpaneel
- navigatie naar dieptepagina’s

Reviewpauze verplicht na oplevering.

## Fase G. Scherm 5 Persoondetails

Doel:

- snapshot-gebaseerd persoonsbeheer opleveren.

Taken:

- timeline
- form
- nieuw snapshot
- nieuwe persoon
- berichtengeneratie

Reviewpauze verplicht na oplevering.

## Fase H. Scherm 6 Contractdetails

Doel:

- snapshot-gebaseerd contractbeheer opleveren.

Taken:

- timeline
- form
- nieuw snapshot
- nieuw contract
- berichtengeneratie

Reviewpauze verplicht na oplevering.

## Fase I. Scherm 7 Loonberekeningdetails

Doel:

- rijke loonberekeningsweergave en bewerking opleveren.

Taken:

- metadata
- arbeidstijd
- berekening
- meldingen
- conditionele secties
- save
- berichtengeneratie

Reviewpauze verplicht na oplevering.

## Fase J. Scherm 8 Berichtenlog

Doel:

- auditing en inzicht in gegenereerde berichten opleveren.

Taken:

- lijst of tabel
- filters
- JSON preview
- log wissen

Reviewpauze verplicht na oplevering.

## Fase K. Afwerking

Taken:

- extra tests
- accessibility sweep
- polish op copy
- smoke test van preview/build
- deploymentvoorbereiding

### 21.X Demo-vriendelijke herfasering voor uitvoering met publiek

De bovenstaande fases blijven inhoudelijk geldig, maar voor de echte uitvoering met het Prato developer team hanteren we expliciet onderstaande volgorde. Die volgorde is beter afgestemd op snelle zichtbaarheid in de browser.

#### 21.X.1 Uitvoeringsprincipe

We volgen dit ritme:

1. Eerst net genoeg fundering om snel iets te laten renderen.
2. Daarna zo snel mogelijk een herkenbare applicatiestructuur tonen.
3. Daarna zo snel mogelijk echte mockdata in de browser tonen.
4. Daarna pas de diepere domein- en formulierenlaag uitwerken.

De praktische betekenis hiervan is:

- we bouwen niet eerst alle onzichtbare lagen volledig af,
- we creëren al vroeg browsermijlpalen,
- elke vroege fase moet iets toonbaars opleveren.

#### 21.X.2 Live uitvoeringsvolgorde

##### Fase D0. Eerste render

Doel:

- snel bevestigen dat de app leeft.

Browserresultaat:

- een minimale renderende app.

Taken:

- Vite scaffold
- dependency install
- eerste `main.tsx`
- eerste `App.tsx`
- globale style bootstrap
- eenvoudige placeholderpagina

##### Fase D1. App shell

Doel:

- snel een echte applicatievorm laten zien.

Browserresultaat:

- shell met layout en navigatie.

Taken:

- router skelet
- `AppShell`
- `Sidebar`
- `TopBar`
- placeholder routes

##### Fase D2. Eerste domeindata zichtbaar

Doel:

- snel de eerste echte Prato-data in de browser tonen.

Browserresultaat:

- een eerste lijst met werkgevers uit mockdata.

Taken:

- storage helpers
- basis seeddata
- eerste mock API-flow
- eerste query hook
- voorlopige werkgeverslijst

##### Fase D3. Fundering hard maken

Doel:

- de vroege browserresultaten onderbouwen met duurzame technische basis.

Taken:

- lint
- testsetup
- i18n bootstrap
- routes config
- query keys
- enum maps
- error boundaries basis

##### Fase D4. Types en validatie

Doel:

- de volledige domeinlaag correct modelleren.

Taken:

- volledige types
- enums
- nullable velden
- deprecated velden
- Belgische validators
- basis Zod schema’s

##### Fase D5. Gedeelde bouwstenen

Doel:

- schermbouw versnellen en uniform maken.

Taken:

- `FieldGroup`
- `EditableField`
- `StatusBadge`
- `DeleteButton`
- `LoadingSpinner`
- `PageSkeleton`
- `ErrorBoundary`
- `BerichtPreview`
- `SnapshotTimeline`

##### Fase D6. Login

Doel:

- eerste complete flow van binnenkomst naar app.

Browserresultaat:

- loginpagina met mockinlog.

##### Fase D7. Werkgeverslijst

Doel:

- eerste overtuigende businesspagina.

Browserresultaat:

- tabel met werkgevers en acties.

##### Fase D8. Werkgeverdetails

Doel:

- eerste volwaardige formulier- en saveflow.

Browserresultaat:

- werkgever bewerken en opslaan.

Extra nadruk:

- dit is het eerste moment waarop berichtgeneratie tastbaar moet worden.

##### Fase D9. Messaging zichtbaar maken

Doel:

- expliciet tonen dat de app berichtgedreven is.

Browserresultaat:

- JSON preview en logstartpunt voelen concreet.

##### Fase D10. Overzicht lonen

Doel:

- de centrale operationele overzichtspagina opleveren.

Browserresultaat:

- rijk loonoverzicht met detailpaneel.

##### Fase D11. Persoondetails

Doel:

- de tijdslijn en snapshotlogica zichtbaar maken voor personen.

Browserresultaat:

- snapshots en persoonsformulieren werken.

##### Fase D12. Contractdetails

Doel:

- de tijdslijn en snapshotlogica zichtbaar maken voor contracten.

Browserresultaat:

- snapshots en contractformulieren werken.

##### Fase D13. Loonberekeningdetails

Doel:

- de rijkste domeinpagina tonen.

Browserresultaat:

- arbeidstijd, berekening en meldingen zijn zichtbaar.

##### Fase D14. Berichtenlog

Doel:

- volledige berichtencyclus zichtbaar maken.

Browserresultaat:

- berichten kunnen worden teruggevonden en geopend.

##### Fase D15. Demo-polish

Doel:

- de app geloofwaardig en stabiel laten aanvoelen tijdens presentatie.

Taken:

- accessibility sweep
- loading/empty/error states verfijnen
- copy polish
- tests uitbreiden
- preview/build smoke test

#### 21.X.3 Demo-regel per fase

Bij elke fase moet expliciet gevraagd worden:

- wat kunnen we nu in de browser tonen,
- wat is de meest overtuigende visuele stap,
- is dit begrijpelijk voor het Prato developer team,
- welke volgende fase levert opnieuw snel zichtbare vooruitgang op.

#### 21.X.4 Praktische conclusie

Voor uitvoering met publiek starten we dus niet met “alles technisch afmaken”, maar met:

1. eerste render,
2. shell,
3. eerste mockdata,
4. daarna pas de zwaardere technische verdieping.

### 21.X.5 Directe uitvoeringschecklists voor eerstvolgende sessies

Deze checklists zijn bedoeld om de echte uitvoering onmiddellijk te starten zonder opnieuw interpretatiewerk te doen.

#### Checklist voor Fase D0. Eerste render

Doel van deze sessie:

- zo snel mogelijk van lege repo naar een zichtbaar draaiende app gaan.

Concrete stappen:

1. Controleren of de repo echt nog geen bruikbare app-setup bevat.
2. Vite React TypeScript scaffold uitvoeren.
3. Basale dependencyset installeren die nodig is om een eerste render te krijgen.
4. De standaard startercode minimaliseren zodat de app niet generiek aanvoelt.
5. Een eenvoudige tijdelijke startpagina renderen met Prato-context.
6. Globale styles activeren zodat de pagina niet volledig ongestyled is.
7. De dev server starten en in de browser controleren.

Wat we in code minimaal moeten hebben na D0:

- `package.json`
- Vite basisconfiguratie
- `src/main.tsx`
- `src/App.tsx`
- `src/index.css`
- werkende mount in `index.html`

Definitie van klaar:

- de app start lokaal,
- de browser toont een Prato-gerichte placeholder,
- er is geen Vite starterboilerplate meer zichtbaar die afleidt van de demo.

Wat we aan het publiek kunnen tonen:

- “We zijn vertrokken vanaf nul en hebben nu al een renderende app.”

Wat we bewust nog niet hoeven af te hebben:

- echte routing
- echte domeintypes
- mockdata
- formulieren

Risico’s in D0:

- te veel tijd verliezen aan perfecte setup in plaats van zichtbaarheid
- te veel dependencies ineens willen installeren

Werkregel voor D0:

- snelheid van eerste render primeert op volledigheid.

#### Checklist voor Fase D1. App shell

Doel van deze sessie:

- de kale render omzetten naar een herkenbare applicatiestructuur.

Concrete stappen:

1. Routerbasis toevoegen.
2. Een globale shellstructuur voorzien.
3. `AppShell` maken met een duidelijke layout.
4. `Sidebar` maken met de toekomstige hoofdsecties.
5. `TopBar` maken met simpele titel/statusruimte.
6. Placeholderroutes koppelen aan de shell.
7. Een duidelijke “Nog in opbouw”-inhoud tonen per placeholderpagina.
8. Basis accessibility toevoegen: skip link, landmarks, focuslogica waar haalbaar.

Wat we in code minimaal moeten hebben na D1:

- `AppShell`
- `Sidebar`
- `TopBar`
- routerconfiguratie
- placeholderpagina’s voor login, werkgevers, lonen, berichten en not found

Definitie van klaar:

- navigatie werkt,
- layout voelt aan als een echte mid-office,
- elke hoofdsectie heeft minstens een placeholderroute.

Wat we aan het publiek kunnen tonen:

- “Dit is de applicatiestructuur waarin alle schermen zullen landen.”

Wat we bewust nog niet hoeven af te hebben:

- echte query hooks
- echte tabellen
- echte formulieren
- realistische detailschermen

Risico’s in D1:

- te veel visuele polish doen vóór er echte data is
- te brede shell bouwen zonder duidelijke secties

Werkregel voor D1:

- herkenbaarheid primeert op verfijning.

#### Checklist voor Fase D2. Eerste domeindata zichtbaar

Doel van deze sessie:

- zo snel mogelijk echte Prato-domeindata in de browser tonen.

Concrete stappen:

1. `localStorage` helpers opzetten.
2. Een eerste kleine maar geloofwaardige werkgeversseed maken.
3. Een mock API-laag maken die deze seed ophaalt.
4. Een eerste query hook maken voor werkgevers.
5. De placeholder werkgeverspagina vervangen door een voorlopige echte lijst.
6. Zorgen dat reload geen zichtbare breuk veroorzaakt.
7. Een eenvoudige lege state of fallback tonen als de data ontbreekt.

Wat we in code minimaal moeten hebben na D2:

- `src/lib/mock/storage.ts`
- eerste seedbestand voor werkgevers
- eerste mock module voor werkgevers
- `useWerkgevers` of equivalent eerste hook
- voorlopige render van werkgeversrecords

Definitie van klaar:

- de browser toont echte werkgeversrecords,
- de data komt niet uit hardcoded JSX maar uit de mocklaag,
- de app voelt voor het eerst inhoudelijk Prato-specifiek.

Wat we aan het publiek kunnen tonen:

- “We tonen nu al echte domeindata uit onze mockarchitectuur.”

Wat we bewust nog niet hoeven af te hebben:

- alle werkgeversvelden
- volledige validatie
- detailpagina’s
- create/update flows

Risico’s in D2:

- te lang blijven hangen in perfecte seeddata
- meteen alle entiteiten tegelijk willen modelleren

Werkregel voor D2:

- eerst werkgevers zichtbaar, daarna pas verbreden naar personen, contracten en loonberekeningen.

#### Beslissingspunt na D2

Na D2 moeten we expliciet controleren:

- staat er iets overtuigends in de browser,
- voelt de app al als een echte richting voor Prato,
- is het publiek mee in de structuur,
- kunnen we nu verantwoord overschakelen naar hardere fundering zonder het demo-tempo te verliezen.

Als het antwoord ja is, dan gaan we verder met:

1. `Fase D3. Fundering hard maken`
2. `Fase D4. Types en validatie`
3. `Fase D5. Gedeelde bouwstenen`

Pas daarna duiken we de echte schermdiepte in.

## 22. Persisterende “vergeet niets”-checklist

Deze lijst is bedoeld om steeds opnieuw af te vinken bij contextwissels:

- Is de leidende bron nog steeds het React/Vite implementatieplan?
- Zijn we nog frontend-only?
- Zijn alle types volledig genoeg voor de huidige fase?
- Zijn deprecated velden niet per ongeluk in formulieren terechtgekomen?
- Zijn alle save-acties gekoppeld aan berichtengeneratie?
- Verschijnen berichten in het log?
- Is `localStorage` foutveilig behandeld?
- Is i18n op nieuwe user-facing tekst toegepast?
- Zijn disabled delete-knoppen zichtbaar gebleven?
- Zijn focus states en labels aanwezig?
- Zijn snapshots correct chronologisch?
- Zijn route builders en query keys centraal gehouden?
- Zijn er geen barrel files geïntroduceerd?
- Zijn er geen nieuwe `any` types toegevoegd?
- Zijn validatie- en formatteringshelpers niet in componenten blijven hangen?
- Zijn tests meegegroeid waar de logica dat vraagt?
- Is het werk nog binnen MVP-scope?

## 23. Hoe dit document gebruikt moet worden in latere sessies

Bij een nieuwe sessie of na contextverlies:

1. Lees eerst dit document volledig of minstens de relevante fase.
2. Bepaal in welke fase het werk momenteel zit.
3. Controleer de “vergeet niets”-checklist.
4. Gebruik de artefactenlijst om ontbrekende bestanden of modules op te sporen.
5. Gebruik de schermchecklist vóór oplevering.
6. Werk dit document bij als een structurele keuze verandert.

## 24. Aanbevolen eerstvolgende uitvoering

De aanbevolen startvolgorde is nu bewust demo-vriendelijk:

1. Eerst `Fase D0. Eerste render`.
2. Daarna `Fase D1. App shell`.
3. Daarna `Fase D2. Eerste domeindata zichtbaar`.
4. Daarna `Fase D3. Fundering hard maken`.
5. Daarna `Fase D4. Types en validatie`.
6. Daarna `Fase D5. Gedeelde bouwstenen`.
7. Daarna de schermfases in volgorde.

De kernstrategie is:

- vroeg renderen,
- vroeg navigeren,
- vroeg domeindata tonen,
- daarna verdiepen.

## 25. Samenvatting

Dit document is bedoeld als de blijvende ruggengraat van het project. Als de sessiecontext later vol raakt, moet dit document volstaan om:

- de scope te herinneren,
- de keuzes te herstellen,
- de fasering te hervatten,
- ontbrekend werk op te sporen,
- en systematisch verder te bouwen zonder belangrijke onderdelen te vergeten.

## 26. Huidige uitvoeringsstatus op 30 maart 2026

Deze sectie legt vast waar de implementatie werkelijk staat, zodat een volgende sessie niet hoeft te reconstrueren wat al gebouwd werd.

### 26.1 Voltooide demo-fases

De volgende demo-fases zijn inhoudelijk gerealiseerd:

- `Fase D0. Eerste render`
- `Fase D1. App shell`
- `Fase D2. Eerste domeindata zichtbaar`
- `Fase D3. Fundering hard maken`
- grote delen van `Fase D4. Types en validatie`
- bruikbare delen van `Fase D5. Gedeelde bouwstenen`

### 26.2 Wat vandaag effectief werkt

De applicatie heeft nu werkende browserflows voor:

- login met persistente mock-auth
- auth-guard op interne routes
- werkgeverslijst
- werkgeverdetail met saveflow
- persoondetail met saveflow
- contractdetail met saveflow
- loonoverzicht
- loonberekeningdetail met saveflow
- berichtenlog
- JSON berichtpreview na save-acties

### 26.3 Wat technisch is opgezet

De volgende technische fundamenten zijn aanwezig:

- React Router met centrale routehelpers
- React Query hooks voor de hoofdentiteiten
- i18n bootstrap met NL en FR
- error boundary
- localStorage mocklaag
- seeddata voor werkgevers, personen, contracten en loonberekeningen
- berichtengeneratie voor werkgever, persoon, contract en loonberekening
- route-level lazy loading
- testbasis met vitest en testing-library

### 26.4 Reële regressies die al opgelost zijn

Tijdens de uitvoering zijn deze concrete fouten geraakt en hersteld:

- `useSyncExternalStore` auth snapshot veroorzaakte een `Maximum update depth` lus
- werkgeverspagina kon crashen op oudere of onvolledige lokale data zonder `paritaireComites`
- loonmocklaag had een TypeScript-probleem door `noUncheckedIndexedAccess`

Deze fixes zijn belangrijk omdat latere sessies anders het risico lopen dezelfde problemen opnieuw te introduceren.

### 26.5 Nog open werk

Deze punten staan nog open voor verdere afwerking:

- extra tests rond mutaties, routeguard en berichtenflows
- verdere componentisering van gedeelde form- en statusbouwstenen
- meer documentatie van wat exact binnen en buiten MVP blijft naarmate de code groeit
- eventuele cleanup van tijdelijke starterresten zoals `prato-app-temp/`
- latere deploymentvoorbereiding richting Firebase, pas na expliciete bevestiging

### 26.6 Aanbevolen hervatting vanaf hier

De aanbevolen vervolgstappen zijn nu:

1. testdekking verder uitbreiden voor de hoofdflows
2. gedeelde UI-bouwstenen verder abstraheren waar herhaling ontstaat
3. documentatie en polish synchroon houden met de werkende browserdemo
4. pas daarna deployment- en oplevervoorbereiding oppakken
