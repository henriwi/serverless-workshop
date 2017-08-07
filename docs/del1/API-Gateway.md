# API Gateway

API Gateway er Amazons tjeneste for å sette opp REST-APIer. API Gateway opererer med kjente REST-begreper som ressurser, actions, m.m.

For å lage API-et til applikasjonen vår må vi gjøre tre ting:

- Opprette en REST-_ressurs_
- Opprette en _action_ som håndterer innkommende requests på ressursen, og knytte denne mot Lambdaen vår
- _Deploye_ APIet


### API med ressurs
Start med å åpne API Gateway i AWS-konsollet
- Opprett et nytt API med et valgfritt navn
- I menyen, velg _Actions_ -> _Create Resource_ og bruk path `/todos`. Gi ressursen et valgfritt navn og klikk _Create resource_

Vi har nå laget en REST-ressurs. For å definere hvordan ressursen håndterer innkommende HTTP-requester må vi lage en action.

### Action for å håndtere innkommende requests
- Marker den nyopprettede ressursen og opprett en ny metode på denne med _Actions_ -> _Create method_
- Velg `ANY` i dropdownen for å lage en handler for alle HTTP-metoder
- Velg Integration type _Lambda Function_
- Velg _Use Lambda Proxy integration_
- Velg regionen der Lambdaen ligger og skriv inn navnet på lambdaen
- Trykk _Save_

API-et er nå ferdig konfigurert, og vil sende alle innkommende HTTP-requester rett videre til Lambdaen, uten å modifisere hverken request eller respons. API-et kan riktignok ikke brukes før det _deployes_. API Gateway har et begrep om _"deployment stages"_, som muliggjør versjons- og miljøkontroll. I denne workshopen klarer vi oss med ett stage/ett miljø.

### Deploy og test API-et
- Velg _Actions_ -> _Deploy API_
- Lag et nytt deployment stage, bruk gjerne navnet `prod`
- Test API-et ved å klikke på _Invoke URL_. Legg på `/todos` på slutten, slik at du får en URL på dette formatet:
```https://<id>.execute-api.<region>.amazonaws.com/prod/todos```

Får du følgende output når du tester URL-en?

```
Hello World via API Gateway!
```

Bra! Da er API-et korrekt konfigurert og deployet. Imidlertid gjør ikke backenden vår så mye fornuftig enda, så vi går tilbake til Lambda-konsollet for å legge til litt skikkelig Forretningslogikk™.

