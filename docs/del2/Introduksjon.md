# Oppsett med Serverless framework

I del 1 satte vi opp en fullstack webapplikasjon på AWS kun ved bruk av ulike serverless-tjenester. Men hele applikasjon ble satt opp ved å manuelt gå gjennom webkonsollet til AWS. Ved å gjøre det på denne måten er det stor sannsynlighet for å gjøre feil, og det er ikke mulig å automatisere oppsettet. I denne delen av workshopen skal vi derfor sette opp applikasjonen fra del 1 på nytt, men med et verktøy som forbedrer arbeidsflyten.

Det er flere verktøy som kan benyttes til dette, men vi har valgt å benytte Serverless Framework. Dette er et rammeverk som kan brukes til å konfigurere opp alle komponentene til applikasjonen vår. I tillegg inkluderer det funksjonalitet for å teste lambdafunksjonene våre, lese logger og hente ut ulike metrikker. Serverless Framework støtter Microsoft Azure, IBM Open Whisk og Google Cloud Platform i tillegg til AWS.

> Servleress Framework er dokumentert [her](https://serverless.com/framework/docs/providers/aws/guide/intro/). Sjekk gjerne ut dokumentasjonen for å se mer om hva Serverless Framework er og de grunnleggende konseptene som rammeverket tilbyr. Hvis du står fast anbefaler vi å ta en titt i dokumentasjonen, der står det ofte svar på det du lurer på.
>
> Ikke vær redd for å ta tak i en av oss for å spørre!

## Installasjon
Det første vi skal gjøre er å installere Serverless Framework

- Åpne terminalen din og kjør `npm install -g serverless`
- Når installasjonen er ferdig kan du verifisere at Serverless Framework er installert ved å kjøre kommandoen `serverless` eller `sls` (`sls` er et alias for `serverless`)

## Sett opp AWS Credentials

For å gi Serverless Framework tilgang til å opprette ressurser i AWS, må vi sette opp AWS credentials som vi setter som miljøvariabler i terminalen.

- I webkonsollet til AWS, klikk på brukernavnet ditt øverst til høyre og velg *My Security Credentials*
- Velg *Users* og klikk på brukernavnet ditt i listen
- Velg *Security Credentials* og trykk på knappen *Create access key*
- Last ned nøklene og eksporter disse som miljøvariabler i terminalen ved å kjøre følgende kommandoer:

  ```
  export AWS_ACCESS_KEY_ID=<your-key-here>
  export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
  ```

Hvis du støter på problemer, kan du se på dokumentasjon til hvordan man setter opp AWS Credentials med Serverless Framework [her](https://serverless.com/framework/docs/providers/aws/guide/credentials/). Eller du kan selvfølgelig spørre en av oss!

Når du har satt opp AWS Credentials er det bare å gå videre til neste steg.
