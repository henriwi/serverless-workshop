# DynamoDB

Som nevnt i forrige steg blir konfigurasjonen som ligger i `serverless.yml` gjort om til en såkalt CloudFormation template og lastet opp til AWS. CloudFormation er en tjeneste som AWS tilbyr for å opprette og endre på ressurser basert på en konfigurasjonsfil. Alle ressursene lambdafunksjonene våre er avhengig av definerer vi ved å definere en såkalt CloudFormation-template i `serverless.yml`.

- Sett opp en DynamoDB-tabell under `resources` i `serverless.yml`. Tabellen skal være helt lik den vi lagde i del 1
  - Tabellnavn i DynamoDB er unike, bruk derfor et annet navn enn i del 1
  - Attributtene til tabellene defineres i `AttributeDefinitions`
  - Hvilke attributter som skal være `PrimaryKey` og `SortKey` defineres under `KeySchema`. `PrimaryKey` er `HASH` og `SortKey` er `RANGE`.

>Hvordan ressurser blir definert med Serverless Framework kan du lese mer om [her](https://serverless.com/framework/docs/providers/aws/guide/resources/), og du kan lese mer om oppsett av DynamoDB-tabeller med CloudFormation [her](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html).

## Deploy databasen
Kjør `sls deploy` for å deploye tjenesten med det som er definert av ressurser hittil. Sjekk i webkonsollet at DynamoDB-tabellen din har blitt opprettet korrekt.

## Tilganger

For at lambdafunksjonen skal kunne lese og skrive til DynamoDB-tabellen vår, må den gis tilgang til dette. Se under seksjonen *Permissions* i dokumentasjonen til [Functions](https://serverless.com/framework/docs/providers/aws/guide/functions) for hvordan dette gjøres.

Kjør `sls deploy` på nytt etter at du har lagt til de nødvendige tilgangene.

---

## Lambda, runde 2

Nå som vi har en tabell, gå tilbake til lambdafunksjonen din som ligger i `handler.js` og erstatt verdien av variabelen `TABLE` med navnet på tabellen din.

Kjør `sls deploy function -f <navn-på-funksjon>` for å deploye funksjonen til AWS.

Nå som lambdafunksjonen er endret til å gå mot dynamodb-tabellen kan vi teste lambdafunksjonen på nytt og verifisere at vi får lagret data. Når man eksekverer en lambdafunksjon med Serverless Framework kan vi også sende med data som simulerer et event fra API Gateway.

Kjør `sls invoke -f <din-funksjon> -d '{"body": "{\"key\":\"key2\",\"text\":\"test\"}","httpMethod": "POST"}'`. Forventet output er:

```
{
    "statusCode": "200",
    "body": "{}",
    "headers": {
        "Content-Type": "application/json"
    }
}
```

Finn tabellen din i AWS Consollet under DynamoDB og verifiser at dataene har blitt lagret i tabellen. Endre gjerne på innholdet i `key` eller `text` og kjør kommandoen flere ganger for å verifisere at all data blir lagret i tabellen.
