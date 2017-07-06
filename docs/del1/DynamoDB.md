# DynamoDB

Finn frem til konsollet for DynamoDB og klikk _"Create table"_ for å lage en ny tabell.

- Gi tabellen et valgfritt navn
- Lag _Primary (partition) key_ med navnet`key`, type string
- Lag _Sort key_ med navnet `text`, type string
- Bruk ellers default settings
- Notér deg navnet på tabellen

That's it! Finn frem test URL-en til API-et som du brukte i stad og prøv på nytt. Får du følgende output?

```
{
  "Items": [],
  "Count": 0,
  "ScannedCount": 0
}
```

Glimrende! Da er backenden helt ferdig. I neste steg deployer vi en frontend som benytter API-et vårt.
