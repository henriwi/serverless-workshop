# Funksjoner
Vi skal, som i del 1, starte med lambdafunksjonen vår. Men i motsetning til i del 1 skal vi denne gangen deploye lambdafunksjonen vår med Serverless Framework.

- Erstatt innholdet i filen `handler.js` med følgende innhold. Dette er den samme funksjonen som ble brukt i del 1. **Merk at `exports.handler` må byttes ut med `module.exports.<navn-på-lambda>`**. Du velger selv hva lambdafunksjonen din skal hete

{% codesnippet "./lambda/todos.js" %} {% endcodesnippet %}

- La foreløpig tabellnavnet stå som det er. Vi skal endre dette i neste steg.
- Finn konfigurasjonsdelen for funksjoner i `serverless.yml` og erstatt `hello` med navnet på lambdafunksjonen din (både på linjen under `functions` og etter `handler`).

---

## Deploy funksjonen
Da er vi klare for å deploye funksjonen vår til AWS. Kjør `sls deploy`, vent til den er ferdig og sjekk i AWS consollet at lambdafunksjonen din har blitt opprettet korrekt.

>**Hva skjedde egentlig nå?**
>Det er en del som skjer under panseret når man kjører `sls deploy`. Kort oppsummert gjør Serverless Framework følgende:
>
>Serverless Framework pakker `serverless.yml` samt koden til lambdafunksjonen i en zip-fil og laster dette opp til en S3-bucket i AWS. Basert på `serverless.yml` vil rammeverket opprettet en såkalt CloudFormation template som beskriver alle ressursene vi ønsker å opprette. Deretter vil CloudFormation kjøre og lambdafunksjonen (og ev. andre ressurser vi har definert) vil bli opprettet.

### Test funksjonen
Som nevnt tidligere kommer Serverless Framework med verktøy for å teste lambdafunksjonen uten å måtte bruke AWS consollet. Vi skal utforske disse verktøyene i mer detalj senere, men vi skal kjøre en kommando allerede nå.

Kjør `sls invoke -f <navn-på-funksjonen>`. Siden vi ikke sender med noe til lambdafunksjonen er forventet output følgende:

```
{
    "statusCode": "400",
    "body": "Fant ingen HTTP-metode på eventet. Du sendte inn følgende event: {}",
    "headers": {
        "Content-Type": "application/json"
    }
}
```

Du har da fått opprettet en lambdafunksjon gjennom Serverless Framework og vi er klare for å definere neste ressurs, nemlig DynamoDB-tabellen.