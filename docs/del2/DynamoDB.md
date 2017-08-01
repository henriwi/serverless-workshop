# DynamoDB
Vi skal, som i del 1, starte med å sette opp en DynamoDB-tabell. Dette gjøres ved å definere en såkalt CloudFormation-template i `serverless.yml`. Du kan lese mer om dette [her](https://serverless.com/framework/docs/providers/aws/guide/resources/).

- Sett opp en DynamoDB-tabell under `resources` i `serverless.yml`. Tabellen skal være helt lik den vi lagde i del 1
  - Tabellnavn i DynamoDB er unike, bruk derfor et annet navn enn i del 1
  - Attributtene til tabellene defineres i `AttributeDefinitions`
  - `PrimaryKey` og `SortKey` defineres i `KeySchema`. `PrimaryKey` er `HASH` og `SortKey` er `RANGE`.
  - Du kan lese mer om oppsett av DynamoDB-tabeller med CloudFormation [her](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html)

### Deploy databasen
Kjør `sls deploy` for å deploye tjenesten med det som er definert av ressurser hittil. Sjekk i webkonsollet at DynamoDB-tabellen din har blitt opprettet korrekt.