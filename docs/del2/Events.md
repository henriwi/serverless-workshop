# Events

Som i del 1 skal vi sette opp en API Gateway og konfigurere den slik at innkommende HTTP requester trigger lambdafunksjonen vår.

>Dokumentasjon om hvordan API Gateway blir satt opp med Serverless Framework finner du [her](https://serverless.com/framework/docs/providers/aws/events/apigateway/)

- Vi ønsker å sette opp integrasjonen med `Lambda Proxy Integration`
- For at API-gatewayen skal fungere med frontenden vår og CloudFront er det viktig at pathen til ressursen i APIet er `/todos` , på samme måte som i del 1.

## Deploy API Gateway
Kjør `sls deploy` igjen, og kopier URLen som blir printet i terminalen under `endpoints`. Får du følgende output når du tester URL-en?

```
{
	Items: [],
	Count: 0,
	ScannedCount: 0
}
```

Bra! Det betyr at API-et fungerer korrekt og at lambdaen henter og returnerer data fra tabellen korrekt.