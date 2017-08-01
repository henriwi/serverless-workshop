# GAMLE BONUSOPPGAVER

Ferdig med alle oppgavene? Da har vi noen bonusoppgaver som du kan bryne deg på til slutt.

### Sette opp et nytt miljø

Serverless Framework kan brukes til å deploye servicen vår til et helt nytt miljø ved å bruke `stage`-konseptet til SF. Default stage er `dev`, men vi ønsker nå å deploye servicen vår til et annet miljø, f.eks. `prod`.


- Først må navnet til DynamoDB-tabellen ta hensyn til `stage` slik at vi unngår navnekonflikter når vi deployer et nytt miljø
- I `serverless.yml` erstatt navnet til DynamoDB-tabellen med `${opt:stage, self:provider.stage}-<tabellnavn>`. Dette gjør at man bruker default stage (dev) fra konfigurasjonen, med mulig overstyring fra kommandolinjen
- Når tabellen har blitt prefixet med miljø, må lambdakoden også ta hensyn til dette. Legg til følgende kode i lambdafunksjonen for å ta hensyn til miljø:
  ```
  event.requestContext.stage + "-" + TABLE_NAME;
  ```
- `sls deploy --stage <miljo>` vil deploye hele servicen til et nytt miljø. Kjør kommandoen og verifiser at du har fått opprettet nye tjenester med prefix `<miljo>-`

### Lokal kjøring av lambdafunksjoner

Serverless Framework har støtte for å kjøre lambdafunksjonene lokalt ved å emulere kjøretidsmiljøet til AWS Lambda. Dette er dokumentert [her](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/).

- Lag en ny lambdafunksjon som f.eks. printer noe til konsollet, og test at du får kjørt denne lokalt
- Test at du kan sende inn data til funksjonen og print datene du får sendt inn til konsollet
- Legg til den nye lambdafunksjonen din i `serverless.yml`, deploy servicen din på nytt og verifiser at du nå får eksekvert lambdafunksjonen din i AWS

### Versjonering av lambdafunksjoner

Lambdafunksjoner har støtte for såkalte versjoner og aliaser som gjør det mulig å ha ulike versjoner av samme lambdafunksjon. Dette er dokumentert [her](http://docs.aws.amazon.com/lambda/latest/dg/versioning-aliases.html). Du kan også lese mer om det [her](https://aws.amazon.com/blogs/compute/using-api-gateway-stage-variables-to-manage-lambda-functions/).

API Gateway kan videre peke på ulike aliaser av lambdafunksjoner, noe som gjør det mulig å ha ulike versjoner av lambdafunksjonene i de ulike API Gateway `stagene`.

- Opprett to aliaser av lambdafunksjonen din, en `dev` og en `prod` som peker på to ulike versjoner av lambdafunksjonen din
- Opprett et nytt stage i API Gatewayen `prod`
- Opprett så stagevariabler, en for hvert stage, som har nøkkelen `lambdaAlias` og verdiene `dev` og `prod`.
- Videre må du referere til stagevariablen i integrasjonsoppsettet: Under _Integration Type_ -> _Lambda Function_, legg til en referanse til stagevariablen slik `MinLambda:${stageVariables.lambdaAlias}`
- Etter at API Gateway stagene dine peker på ulike aliaser, prøv å oppdatere lambdafunksjonene dine med ny kode (f.eks. printing til konsollet), først i `dev` og så i `prod`
