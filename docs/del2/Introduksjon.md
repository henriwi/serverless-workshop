# Del 2 – Oppsett med [Serverless framework](https://serverless.com)

I del 1 satte vi opp en fullstack webapplikasjon på AWS, kun ved bruk av ulike serverless-tjenester. Men hele applikasjon ble satt opp ved å manuelt gå gjennom webkonsollet til AWS. Ved å gjøre det på denne måten er det stor sannsynlighet for å gjøre feil, og det er ikke mulig å automatisere oppsettet. I denne delen av workshopen skal vi se derfor se på hvordan vi kan automatisere og forbedre måten å sette opp applikasjonen på.

Det er flere verktøy som kan benyttes til dette, men vi har valgt å benytte [Serverless Framework](https://serverless.com/framework/docs/). Dette er et rammeverk som kan brukes til å konfigurere opp alle komponentene til applikasjon vår, og det kommer i tillegg med verktøy for å teste lambdafunksjonene våre, lese logger og hente ut ulike metrikker.

## Installering
Det første vi skal gjøre er å installere Serverless Framework

- Åpne terminalen din og kjør `npm install -g serverless`
- Når installasjonen er ferdig kan du verifisere at Serverless Framework er installert ved å kjøre kommandoen `serverless` eller `sls` (`sls` er et alias for `serverless`)

## Sett opp AWS Credentials

For å gi Serverless Framework mulighet til å opprette ressurser i AWS, må vi sette opp AWS credentials som vi setter som miljøvariabler i terminalen.

- I AWS Console, klikk på brukernavnet ditt øverst til høyre og velg *My Security Credentials*
- Hvis det kommer opp en dialog som sier *You are accessing the security credentials (...)* velg *Continue to Security Credentials*
- Velg *Users* og klikk på brukernavnet ditt i listen
- Velg *Security Credentials* og trykk på knappen *Create New Access Key*
- Last ned nøklene og eksporter disse som miljøvariabler i terminalen ved å kjøre følgende kommandoer:

  ```
  export AWS_ACCESS_KEY_ID=<your-key-here>
  export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
  ```

Hvis du støter på problemer, kan du se på dokumentasjon til hvordan man setter opp AWS Credentials med Serverless Framework [her](https://serverless.com/framework/docs/providers/aws/guide/credentials/). Eller du kan selvfølgelig spørre en av oss!

Når du har satt opp AWS Credentials er det bare å gå videre til neste steg.