# Lamda, revisited

Lambdafunksjonen vår fra tidligere gjorde ingenting fornuftig, men det skal vi gjøre noe med nå.

Vi har laget en ferdig Lambdafunksjon for å håndtere lesing og skriving av todos til og fra DynamoDB. Gå inn i Lambdakonsollet og erstatt JavaScript-koden til Lambdafunksjonen med følgende kode:

{% codesnippet "./lambda/todos.js" %} {% endcodesnippet %}

Etter å ha lagt inn den nye koden i Lambdaen og lagret trenger du ikke gjøre noe mer. Kodeendringene er virksomme omtrent umiddelbart.

Om du nå trykker _"Save and test"_ bør du få følgende output:

```
{
  "statusCode": "400",
  "body": "Fant ingen HTTP-metode på eventet. Du sendte inn følgende event: {\"type\":\"testevent\",\"message\":\"Hello World fra Lambdafunksjonen!\"}",
  "headers": {
    "Content-Type": "application/json"
  }
}
```

Vi forventer å få feilen over når vi tester Lambdaen på denne måten, ettersom testeventet ikke inneholder noen HTTP-metode, slik Lambdafunksjonen forventer. Lambdaen kan med andre ord bare brukes gjennom API Gateway.

Da er backenden nesten ferdig, men Lambdafunksjonen har ennå ingen database å kommunisere med. I neste steg setter vi opp en DynamoDB-tabell, slik at backenden blir komplett.

