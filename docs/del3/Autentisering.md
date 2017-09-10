I denne oppgaven skal vi utvide applikasjonen vår med å legge på en enkel autentisering på APIet, slik at ikke hvem som helst kan hente ut og legge til todoer. Vi bygger videre på Serverless Framework-configen i `serverless.yml`.

API Gateway kommer med støtte for å definere en såkalt _Custom Authorizer_, en egen lambdafunksjon som er ansvarlig for å kontrollere tilgangen til APIet. Når det kommer en request til APIet vil API Gateway først sjekke om det eksisterer en egen _authorizer_ for APIet. Hvis det er tilfelle vil API Gateway kalle lambdafunksjonen med et token som input som er hentet ut fra en spesifikk header i requesten. Lambdafunksjonen vil ta dette tokenet, validere det, og returnere en såkalt IAM policy, et JSON-objekt som sier om brukeren har tilgang til å kalle APIet eller ikke.

I denne oppgaven skal vi lage en slik lambdafunksjon og konfigurere vår API Gateway til å bruke denne funksjonen til å validere alle requester mot APIet.

> Du kan lese mer om hvordan en slik _custom authorizer_ fungerer [her](http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html).

## Oppsett

### Authorizer på APIet

Start med å utvide _events_-delen av todo-funksjonen vår til å inneholde en _authorizer_. I tillegg trenger du å definere en ny _function_. Se under [HTTP Endpoints with Custom Authorizers](https://serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoints-with-custom-authorizers) for detaljer om hvordan dette gjøres.

### Implementer lambdafunksjonen

Lambdafunksjonen din vil motta et event på følgende format:

```
{
    "type": "TOKEN",
    "methodArn": "arn:aws:execute-api:eu-west-1:436890957976:4sipqbz4ug/dev/GET/todos",
    "authorizationToken": "mysecrettoken"
}
```

Basert på dette eventet skal du skrive en funksjon som returnerer en såkalt IAM Policy som sier om brukeren får lov til å aksessere APIet vårt. For denne oppgaven foreslår vi at du f.eks. gir brukeren tilgang hvis tokenet er over 5 tegn, og ikke tilgang ellers. I et reelt scenario kan man f.eks. validere tokenet mot en OAuth-provider eller validere tokenet som et JSON Web Token.

Policien som returneres må inneholde følgende:

- `principalId` representerer en id til brukeren som prøver å aksessere ressursen. I vårt tilfelle kan den være hva som helst
- `"Version": "2012-10-17"` er default versjon på policydokumenter
- `"Action": "execute-api:Invoke"` sier at brukeren skal ha tilgang til å kalle APIet
- `"Effect": "Allow"` betyr at brukeren får tilgang
- `"Effect": "Deny"` betyr at brukeren ikke får tilgang
- `Resource` inneholder en arn til API Gatewayen (en unik id som identifiserer din API Gateway)

Formatet på policien må være slik:

```
{
  "principalId": "yyyyyyyy",
  "policyDocument": {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "execute-api:Invoke",
        "Effect": "Allow",
        "Resource": "arn:aws:execute-api:eu-west-1:436890957976:4sipqbz4ug/dev/GET/todos"
      }
    ]
  }
}
```

For å hjelpe deg i gang kan du ta utgangspunkt i koden under for lambdafunksjonen din. Den inneholder også en hjelpefunksjon for å generere en gyldig policy.

{% codesnippet "./lambda/authorizer.js" %} {% endcodesnippet %}

### Testing av funksjonen

For å teste funksjonen din anbefaler vi at du kopierer eventet nedenfor og lagrer dette i en fil `event.json`. Da kan du bruke kommandoen `sls invoke local -f <navn-på-function> -p event.json` for å teste funksjonen din lokalt. Når funksjonen din er ferdig, kjør `sls deploy` for å deploye alle endringer. Finn API Gateway i AWS Consollet, velg _Authorizers_ og verifiser at APIet har din nye lambdafunksjon som _authorizer_.

```
{
    "type": "TOKEN",
    "methodArn": "arn:aws:execute-api:eu-west-1:436890957976:4sipqbz4ug/dev/GET/todos",
    "authorizationToken": "mysecrettoken"
}
```

> Husk at du kan deploye kun funksjonen din med kommandoen `sls deploy function -f <navn-på-function>`. Dette vil gå en del raskere enn å kjøre `sls deploy` som deployer hele servicen din.

### Test APIet

For å teste APIet kan vi bruke curl. Når API Gateway er satt opp med en egen _authorizer_ forventer den at tokenet ligger i headeren `Authorization`. Test APIet med kommandoene nedenfor, og sjekk at du både får tilgang til APIet når du sender med et token, og at du ikke får tilgang til APIet hvis du har et for kort token, eller ikke sender med et token.

- `curl -H "Authorization: mysecrettoken" -X GET <url-til-apiet>` vil hente ut alle todoene fra DynamoDB-tabellen 
- `curl -X POST -H "Content-Type: application/json" -H "Authorization: mysecrettoken" -d '{"key":"key1","text":"test"}' <url-til-api>` vil legge inn en ny todo. Merk at `key` må være unik.

Frontenden til appen vår er satt opp med å sende en `Authorization`-header med verdien `mysecrettoken`. Det betyr at frontenden vår fortsatt bør fungere, også etter at vi har lagt på sikkerhet på APIet! Test at vi fortsatt kan hente ut todos fra appen vår.