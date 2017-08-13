Oppgave om Slack-integrasjon

Notater:

- Enable stream på DynamoDB
- Lambda poller streamen


Outline for oppgaven:
- Enable stream på tabellen
- Opprette lambda, velge ferdig konfigurert IAM-rolle
- Kode opp lambdaen delvis selv, gi noe prekode?

Prep vi må gjøre:
- Lage IAM-rolle de kan bruke direkte


## Serverless-framework

Utvide fungerende config for todo-appen i serverless.yml

- Enable stream på DynamoDB-tabellen
- Få ut ARN til streamen som output-variabel i configen
- Sett opp ny lambdafunksjon med Kinesis-event som trigger og bruk ARN til streamen

