# Kinesis-stream og posting til Slack

I denne oppgaven skal vi utvide applikasjonen vår til å inkludere post-prosessering av dataene som kommer inn i DynamoDB. Vi bygger videre på Serverless Framework-configen i `serverless.yml`.

Vi skal konfigurere DynamoDB-tabellen vår til å publisere alle endringer på en Kinesis-stream. Deretter lager vi en ny Lambda som prosesserer alle events på streamen og poster disse til Slack.

Nedenfor oppsummerer vi hva du må gjøre for å få det til, og gir en del hint underveis. Du må selv lese litt dokumentasjon og skrive koden til Lambdafunksjonen selv. Står du fast er det bare å spørre oss! Du finner et løsningsforslag til oppgaven i branchen [`losningsforslag`](https://github.com/henriwi/serverless-workshop/tree/losningsforslag) i Git-repoet.

## Oppsett

### Kinesis-stream på DynamoDB

Start med å utvide DynamoDB-konfigen til å sette opp en Kinesis-stream. Dette gjøres med elementet `StreamSpecification` i CloudFormation-configen til DynamoDB. Se [CloudFormation-dokumentasjonen for DynamoDB](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html) for detaljer.

### Tilganger

For at Lambda-funksjonen skal få tilgang til å lese fra strømmen trenger den følgende nye tilganger:

```
dynamodb:GetRecords
dynamodb:GetShardIterator
dynamodb:DescribeStream
dynamodb:ListStreams
```

### Ny function

I `serverless.yml` må vi lage en ny _function_. Lambdafunksjonen som abonnerer på Kinesis-strømmen skal angis som  _handler_ til denne.

Dokumentasjonen om [events i Serverless Framework](https://serverless.com/framework/docs/providers/aws/events/streams/) inneholder et eksempel på hvordan man konfigurerer en function til å lytte på events fra en Kinesis-stream.

Du kan ta utgangspunkt i koden under for Lambdafunksjonen din. Den logger innkommende events til `console.log`, slik at de dukker opp i [Cloudwatch](https://console.aws.amazon.com/cloudwatch). Der kan du se hvordan eventene er strukturert, slik at du får skrevet korrekt kode for å hente ut de relevante dataene.

>Hint: `eventName` på hver record angir som man har lagt til eller fjernet en record

{% codesnippet "./lambda/slackposter.js" %} {% endcodesnippet %}


### Teste manuelt

Du vil nå ha to _functions_ i `serverless.yml`, la oss kalle dem `todos` og `slackposter`. Disse kan du teste manuelt på følgende vis:

```
sls invoke -f todos -p todo-test-event.json

sls invoke -f slackposter -p kinesis-test-event.json

```

I branchen [`losningsforslag`](https://github.com/henriwi/serverless-workshop/tree/losningsforslag/slack-poster) finner du [`todo-test-event.json`](https://github.com/henriwi/serverless-workshop/blob/losningsforslag/slack-poster/todo-test-event.json) og [`kinesis-test-event.json`](https://github.com/henriwi/serverless-workshop/blob/losningsforslag/slack-poster/kinesis-test-event.json) som du kan bruke til testing.