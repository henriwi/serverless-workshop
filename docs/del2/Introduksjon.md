# Del 2 – Oppsett med [Serverless framework](https://serverless.com)

I del 2 av workshopen skal vi benytte Serverless Framework til å deploye store deler av applikasjonen vår.
Serverless Framework er dokumentert [her](https://serverless.com/framework/docs/).

## Installer Serverless Framework
- Installer serverless ved å kjøre `npm install -g serverless`
- Når installasjonen er ferdig kan du verifisere at Serverless Framework er installert ved å kjøre kommandoen `serverless` eller `sls` (`sls` er en snarvei for `serverless`)

## Sett opp AWS Credentials

For å gi Serverless Framework mulighet til å opprette ressurser i AWS, må vi sette opp AWS credentials som vi setter som miljøvariabler i terminalen.

- I AWS Console, klikk på brukernavnet ditt øverst til høyre og velg *Security Credentials*
- Hvis det kommer opp en dialog som sier *You are accessing the security credentials (...)* velg *Continue to Security Credentials*
- Velg *Access Keys* og trykk på knappen *Create New Access Key*
- Last ned nøklene og eksporter disse som miljøvariabler i terminalen ved å kjøre følgende kommandoer:

  ```
  export AWS_ACCESS_KEY_ID=<your-key-here>
  export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
  ```

Hvis du støter på problemer, kan du se på dokumentasjon til hvordan man setter opp AWS Credentials med Serverless Framework [her](https://serverless.com/framework/docs/providers/aws/guide/credentials/).