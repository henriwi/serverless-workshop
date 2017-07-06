# Lambda

Lambda er Function-as-a-service-løsningen til AWS. I vår applikasjon ligger backendlogikken, med håndtering av innkommende requests og kommunikasjon med databasen, i en lambdafunksjon.

Vi starter med å sette opp en enkel "Hello World"-lambda.

Finn frem til Lambda i AWS-konsollet og klikk _"Get started now"_ eller _"Create new lambda"_.

- Start med templaten _Blank Function_
- Ikke sett opp noen triggere, dette gjør vi senere
- Gi Lambdaen din et valgfritt navn
- Velg runtime _Node.js 6.10_ (default)
- Koden i tekstboksen erstattes med koden fra [`lambda/helloworld.js`](../lambda/helloworld.js).
  - Variabelen `TABLE` erstattes med navnet på DynamoDB-tabellen din
- Under _Role_, la _Create new role from templates_ stå
  - Gi rollen et navn og velg _Simple Microservice permissions_ under Policy templates
- La resten stå som default, klikk _Next_ og _Create function_
- Test Lambdaen din ved å trykke på _Test_
  - Erstatt eventet i tekstboksen med testeventet du finner her: [`lambda/testevent.json`](../lambda.testevent.json)
  - Lambdaen skal svare med en variant av _"Hello World!"_

Da er første versjon av Lambdafunksjonen ferdig. Vi har fått testet den manuelt, men for å kunne trigge den over HTTP må vi sette opp en API Gateway. Det gjør vi i neste del.

TODO: Lenkene til koden her funker ikke
