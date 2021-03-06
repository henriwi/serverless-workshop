# Lambda

Lambda er Function-as-a-service-løsningen til AWS. I vår applikasjon ligger backendlogikken, med håndtering av innkommende HTTP-requests og kommunikasjon med databasen, i en lambdafunksjon.

Vi starter med å sette opp en enkel "Hello World"-lambda.

Finn frem til Lambda i AWS-konsollet og klikk _"Get started now"_ eller _"Create a function"_.

- I stedet for å velge et blueprint trykker du _"Author from scratch"_
- Gi Lambdaen din et valgfritt navn
- Velg runtime _Node.js 8.10_ (default)
- Under _Role_, velg _Create new role from templates_
  - Gi rollen et navn og velg _Simple Microservice permissions_ under Policy templates
- Klikk _Create function_

- Ikke sett opp noen triggere, det gjør vi senere
- Koden i editoren erstattes med følgende kode:

{% codesnippet "./lambda/helloworld.js" %} {% endcodesnippet %}

- Trykk _Save_ og så _Test_ for å teste Lambdaen
    - Erstatt eventet i tekstboksen med følgende event:

{% codesnippet "./lambda/testevent.json" %} {% endcodesnippet %}

Svarer lambdaen med _"Hello World fra Lambdafunksjonen!"_? Glimrende!

Da er første versjon av Lambdafunksjonen ferdig. Vi har fått testet den manuelt, men for å kunne trigge den over HTTP må vi sette opp en API Gateway. Det gjør vi i neste del.
