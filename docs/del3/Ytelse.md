# Ytelse og metrikker

En av lovnadene til serverløse applikasjoner er at de skalerer bedre enn 
tradisjonelle applikasjoner. Det betyr ikke nødvendigvis at det skalerer 
uendelig ut av boksen. Som med tradisjonelle applikasjoner krevers det 
konfigurering, men i tilfellet for vår applikasjon er det ikke mye som skal til.

I applikasjonen dere har laget i denne workshopen er det hovedsakelig databasen
og API Gateway som kan være flaskehalsene. I denne oppgaven skal vi se hvordan
vi kan utforske og oppdage grensene i applikasjonen gjennom å lastteste
applikasjonen 

Først kan vi starte med å finne begrensningen til applikasjonen vår og samtidig 
utforske AWS tjenestenes monitoreringsmuligheter. 



## Ytelsestesting med Vegeta

Man kan bruke det ytelsestestverktøyet man er vandt til, om man har det. Vi 
kan anbefale verktøyet [Vegeta](https://github.com/tsenart/vegeta).

Vet du allerede hvordan Vegeta brukes eller bruker du et annet verktøy kan du
hoppe over denne seksjon om installasjon og bruk av Vegeta.

### Installasjon 

Vegeta kan installeres på mac gjennom homebrew: `brew install vegeta`

For andre platformer kan man laste ned binær filer: 
https://github.com/tsenart/vegeta/releases. Husk å velge filen som er for din 
platform.

### Bruk

Vegeta har to moduser: attack og report. Angrip (`attack`) gjør kall til
url(ene) man oppgir og `report` generer rapporter basert på informasjonen fra
attack-kommandoen.

Se Vegetas readme for detaljer utover det som forklares i denne guiden:
https://github.com/tsenart/vegeta#-reporter

#### Attack-kommandoen

Attack-kommandoen utfører selve ytelsestesten. Her setter man parameterene for
testen ved å sette url(ene) å gå mot, antall spørringer i sekundet og hvor lenge
testen skal kjøre.

Outputen av attack kommadoen er binærtdata som man kan lagre til fil eller
gi direkte videre til vegetas report-kommando.

Den følgende kommandoen vil sende 5 GET spørringer i sekundet i 10 minutter til 
urlen som er spesifisert og få ut en tekstbasert rapport på hvor lang tid 
kallene tok og annen info om kjøringen av ytelsestesten:

```
echo "GET https://5xv110usmk.execute-api.eu-central-1.amazonaws.com/dev/todos" | vegeta attack -rate 5 -duration 10m -http2=f | vegeta report
```


#### Report-kommandoen

Report-kommandoen til vegeta genererer rapporter basert på output fra attack
kommandoen. Basert på denne binærdataen kan rapport-kommandoen generere
forkjellige rapporter. Rapportene som kommer innebyggd er: text, json, histogram
og plot. Vi kommer nok kun til å trenge tekst-versjonen som er standard om man
ikke oppgir noe annet. 

Se Vegeta readmen for mer informasjon om reporterne:
https://github.com/tsenart/vegeta#-reporter.



## Første ytelsestest og utforsking

- Sett i gang en ytelsestest med Vegeta på 40 spørringer i sekundet over 10
  minutter. Det kan ta noen minutter før man får utslag i grafene så bare start
  kommandoen og gå videre til punktenen under.
- Gå deretter til DynamoDB tabellen for applikasjonen din i AWS konsollet og gå
  til Metrics fanen. Her kan du se aktiviteten for tabellen i forskjellige
  grafer. Blant annet ser man antall lesninger og skrivinger i sekundet og
  ventetid (latency) for lesing og skriving mm. Det er desverre ikke noen
  automatisk oppdatering av grafene så du må selv trykke på oppdateringskappen
  oppe til høyret i Metrics vinduet.
- Sett "Time Range" oppe til høyre på siden til «Latest Hour» for å se de nyeste
  hendelsene. Når ytelsestesten har kjørt noe minutter vil man kunne begynne å
  se utslag grafene. Prøv med forskjellige antall spørringer i sekundet og se
  hvordan det påvirker ytelsen av databasen.
- Alt etter hvordan du konfigurerte dynamodb tabellen i de tidligere oppgavene
  vil du nå et punkt hvor spørringer blir blokkert. Disse vil du se i grafene
  «Throttled read requests» og «Throttled write requests».

>Hvis man har satt «Provisioned read capacity units» til 1 vil man kunne gjøre
en lesing i sekundet (pluss en hvis mengde over i kortere perioder). Hvis man
utfører en test med 5 spørringen i sekundet vil man da være over grensen og om
man kjører testen over en litt en litt forlenget periode vil man se at
spørringer over den konfigurerte grensen blir blokkert.


## Oppsett av auto-scaling for Dynamodb

Det er mulig å sette opp auto-skalering av DynamoDB-tabellene med noen få steg:

- Gå til dynamodb tabellen for applikasjonen og vel "Capacity"-fanen
- Under seksjonen "Auto Scaling" finner du muligheten for å konfigurere auto-
  skalering
- Huk av sjekkboksene for "Read capacity" og "Write capacity"
- Under "IAM Role" velger du "Existing role with pre-defined policies" og fyller
inn rollen TODO: [navn ferdigoppsatt rolle her].

Du kan nå kjøre ytelses testen på 40 spørringer i sekundet igjen og følge med i
Metrics-fanen for dynamodb-tabellen. Du skal nå kunne se at den røde linjen
"Read capacity" grafen justerer seg etter trykket av ytelsestesten. 

Du har nå en fullt skalerende applikasjon!


## Oppsett av monitorering og konfigurering av struping for API gateway

API Gateway har som standard en begrensning på 1000 spørringer i sekundet og
utbruddsgrense (burst) på 5000 spørringer i sekundet i kortere perioder.

Disse grensene har du kanskje ikke nådd i testingen din, men i en
produksjonssetting kan det være være praktisk å begrense spørringer på API nivå.
Det er mulig å konfigurere disse grensene både høyere og lavere, alt etter
behov.

Konfigurasjon av dette gjøres i stag-en for API-et ditt:

- Gå til stage-en til API-et for applikasjonen
- Under Settings- fanen (som er første fanen) finner du en seksjon som heter
  "Default Method Throttling" 
- Her kan man skru av struping (throttlig) eller endre verdiene for strupingen


### Skalering av Lambda funksjoner

Det er mulig å se grafer av ytelsen til en lambda funksjon under
"Monitoring"-fanen inne på siden for funksjonen.

Som standard er det en begrensning på 1000 samtidige eksekveringer på tvers av
alle funksjonene i en region. Med utbruddsgrense på 3000 og 1000 avhengig av
hvilken region funksjonene kjører i. For å skalere utover dette trenger man
å
kontakte AWS support.

Mer detaljer finner man i dokumentasjonen til Lambda:
http://docs.aws.amazon.com/lambda/latest/dg
/concurrent-executions.html#concurrent-execution-safety-limit


## Oppsett av grafer i CloudWatch

CloudWatch er AWS sin monitorering- og loggaggregerings-tjeneste. Her lagres
blant annet loggene for lambdaene. I tillegg til å gi tilgang til logger, kan
man sette opp varsler eller grafer basert på logger eller metrikker.

Grafene som vises i DynamoDB og Lambda-sidene bruker henter data fra CloudWatch.
I tillegg til disse ferdigoppsatte grafene kan man lage egne grafer basert på
metrikkene i CloudWatch.

For å lage egne grafer og dashboards går man til "Metcis"-siden under CloudWatch
inne i AWS konsollet. 

Gå til "Metrics"-siden og utforsk hvilke metrikker som er tilgjengelig. Man kan
for eksempel lage et dashboard som samler grafer og metrikker for dynamodb,
lambda og API Gateway på en plass så man slipper å gå fram og tilbake mellom
de forskjellige sidene. Dette gjør det enklere å se hvordan de forskjellige
begrensningene i de forskjellige tjenestene på virker de andre delene av
applikasjoenen.


