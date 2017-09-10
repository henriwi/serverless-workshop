# Ytelse og metrikker

En av lovnadene til serverløse applikasjoner er at de skalerer bedre enn
tradisjonelle applikasjoner. Det betyr ikke nødvendigvis at det skalerer
uendelig ut av boksen. Som med tradisjonelle applikasjoner kreves det
konfigurering, men i tilfellet for vår applikasjon er det ikke mye som skal til.

I applikasjonen dere har laget i denne workshopen er det hovedsakelig DynamoDB
og API Gateway som kan være flaskehalsene. I denne oppgaven skal vi se hvordan
vi kan utforske og oppdage begrensningene i applikasjonen gjennom å lastteste
den.

Først kan vi starte med å finne begrensningen til applikasjonen vår og samtidig
utforske AWS-tjenestenes monitoreringsmuligheter.



## Ytelsestesting med Vegeta

Man kan bruke det ytelsestestverktøyet man er vant til, om man har det. Vi
kan anbefale verktøyet [Vegeta](https://github.com/tsenart/vegeta).

Vet du allerede hvordan Vegeta brukes eller bruker du et annet verktøy kan du
hoppe over denne seksjonen om installasjon og bruk av Vegeta.

### Installasjon

Vegeta kan installeres på Mac gjennom homebrew: `brew install vegeta`.

For andre platformer kan man laste ned binærfiler:
https://github.com/tsenart/vegeta/releases. Husk å velge riktig fil til din
plattform.

### Bruk

Vegeta har to moduser: attack og report. Angrip (`attack`) gjør kall til
url(ene) man oppgir og `report` generer rapporter basert på informasjonen fra
attack-kommandoen.

>Hvis du få feilmeldingen`socket: too many open files` kan du øke grensen for 
åpne filer med denne kommandoen: `ulimit -n 7168`


Se Vegetas readme for detaljer utover det som forklares i denne guiden:
https://github.com/tsenart/vegeta#-reporter

#### Attack-kommandoen

Attack-kommandoen utfører selve ytelsestesten. Her angir man parametrene for
testen ved å angi url(ene) å gå mot, antall spørringer i sekundet og hvor lenge
testen skal kjøre.

Outputen av attack kommadoen er binærtdata som man kan lagre til fil eller
gi direkte videre til Vegetas report-kommando.

Den følgende kommandoen vil sende 5 `GET`-spørringer i sekundet i 10 minutter til
urlen som er spesifisert og få ut en tekstbasert rapport på hvor lang tid
kallene tok og annen info om kjøringen av ytelsestesten:

```
echo "GET https://5xv110usmk.execute-api.eu-central-1.amazonaws.com/dev/todos" | vegeta attack -rate 5 -duration 10m -http2=f | vegeta report
```


#### Report-kommandoen

Report-kommandoen til Vegeta genererer rapporter basert på output fra attack-
kommandoen. Basert på denne binærdataen kan rapport-kommandoen generere
forkjellige rapporter. Rapportene som kommer innebyggd er: text, json, histogram
og plot. Vi kommer nok kun til å trenge tekst-versjonen som er standard om man
ikke oppgir noe annet.

Eksempel på output fra en `text` rapport:
```
Requests      [total, rate]            348, 40.12
Duration      [total, attack, wait]    8.758333528s, 8.674999574s, 83.333954ms
Latencies     [mean, 50, 95, 99, max]  341.097576ms, 99.622132ms, 1.496621772s, 1.761080975s, 2.041584333s
Bytes In      [total, mean]            73428, 211.00
Bytes Out     [total, mean]            0, 0.00
Success       [ratio]                  100.00%
Status Codes  [code:count]             200:348
Error Set:
```

Se Vegetas readme for mer informasjon om reporterne: https://github.com/tsenart/vegeta#-reporter.



## Første ytelsestest og utforsking

- Sett i gang en ytelsestest med Vegeta på 40 spørringer i sekundet over 10
  minutter. Det kan ta noen minutter før man får utslag i grafene, så bare start
  kommandoen og gå videre til punktenen under.
- Gå deretter til DynamoDB-tabellen for applikasjonen din i AWS-konsollet og gå
  til fanen _Metrics_. Her kan du se aktiviteten for tabellen i forskjellige
  grafer. Blant annet ser man antall lesninger og skrivinger i sekundet og
  ventetid (latency) for lesing og skriving mm. Det er desverre ikke noen
  automatisk oppdatering av grafene så du må selv trykke på oppdateringskappen
  oppe til høyret i Metrics vinduet.
- Sett _Time Range_ oppe til høyre på siden til _Last Hour_ for å se de nyeste
  hendelsene. Når ytelsestesten har kjørt noen minutter vil man kunne begynne å
  se utslag på grafene. Prøv med forskjellige antall spørringer i sekundet og se
  hvordan det påvirker ytelsen til databasen.
- Med read og write capacity satt til 1 som konfigurer i tidligere oppgaver vil
  man ganske raskt nå punktet hvor spørringer blir blokkert. Disse vil du se i
  grafene «Throttled read requests» og «Throttled write requests».

>Hvis man har satt «Provisioned read capacity units» til 1 vil man kunne gjøre
én lesing i sekundet (pluss en viss mengde over i kortere perioder). Hvis man
utfører en test med 40 spørringer i sekundet vil man da være over grensen og om
man kjører testen over en litt forlenget periode vil man se at spørringer over
den konfigurerte grensen blir blokkert.


## Oppsett av auto-scaling for Dynamodb

Det er mulig å sette opp auto-skalering av DynamoDB-tabellene med noen få steg:

- Gå til DynamoDB-tabellen for applikasjonen og velg fanen _Capacity_
- Under seksjonen _Auto Scaling_ finner du muligheten for å konfigurere auto-
  skalering
- Huk av sjekkboksene for _Read capacity_ og _Write capacity_
- Under _IAM Role_ velger du _New role: DynamoDBAutoscaleRole_
- Aktiver konfigurasjonen med trykke _Save_-knappen

Du kan nå kjøre ytelsestesten på 40 spørringer i sekundet igjen og følge med i
Metrics-fanen for DynamoDB-tabellen. Du skal nå kunne se at den røde linjen for
_Read capacity_-grafen justerer seg etter trykket av ytelsestesten.
  
Du har nå en applikasjon som skalerer helt automatisk!


## Oppsett av monitorering og konfigurering av struping for API gateway

API Gateway har som standard en begrensning på 10000 spørringer i sekundet og
utbruddsgrense (burst) på 5000 spørringer i sekundet i kortere perioder.

Disse grensene har du nok ikke nådd i testingen din, men i en produksjonssetting
kan det være være praktisk å begrense spørringer på API-nivå. For eksempel om
man har en del av applikasjone som enda ikke skalerer etter behov. 

Det er mulig å konfigurere disse grensene både høyere og lavere, alt etter
behov.

Konfigurasjon av dette gjøres under _Stages_-menyen API-et ditt:

- Gå til _Stages_ til API-et for applikasjonen
- Under _Settings_-fanen finner du en seksjon som heter _Default Method Throttling_
- Her kan man skru av struping (throttlig) eller endre verdiene for strupingen
- Sett _Rate_ til 50 request per second og _Burst_ til 10 request per second
- Start en ytelsestest med 100 spørringer i sekundet (`-rate 100`) i en kort
  periode og se hvordan endringen påvirker testen


### Skalering av Lambda funksjoner

Det er mulig å se grafer over ytelsen til en Lambdafunksjon under
_Monitoring_-fanen inne på siden for funksjonen.
Interessante grafer her kan blant annet være `Invocation duration` og
`Invocation errors`.

Som standard er det en begrensning på 1000 samtidige eksekveringer på tvers av
alle funksjonene i en region, med utbruddsgrense på 3000 og 1000 avhengig av
hvilken region funksjonene kjører i. For å skalere utover dette må man
kontakte support hos AWS.

Mer detaljer finner man i dokumentasjonen til Lambda:
http://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html#concurrent-execution-safety-limit


## Oppsett av grafer i CloudWatch

CloudWatch er AWS sin monitorering- og loggaggregerings-tjeneste. Her lagres
blant annet loggene for Lambdaene. I tillegg til å gi tilgang til logger, kan
man sette opp varsler eller grafer basert på logger eller metrikker.

Grafene som vises i DynamoDB og Lambda-sidene bruker henter data fra CloudWatch.
I tillegg til disse ferdigoppsatte grafene kan man lage egne grafer basert på
metrikkene i CloudWatch.

For å lage egne grafer og dashboards går man til _Metrics_-siden under CloudWatch
inne i AWS-konsollet.

Gå til _Metrics_-siden og utforsk hvilke metrikker som er tilgjengelig. Man kan
for eksempel lage et dashboard som samler grafer og metrikker for DynamoDB,
Lamda og API Gateway på én plass så man slipper å gå fram og tilbake mellom
de forskjellige sidene. Dette gjør det enklere å se hvordan de forskjellige
begrensningene i de forskjellige tjenestene påvirker de andre delene av
applikasjoenen.
