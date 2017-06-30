# API Gateway

API Gatway er Amazons tjeneste for å definere REST-APIer. API Gateway opererer med kjente REST-begreper som ressurser, actions, etc.

For å lage API-et til applikasjonen vår må vi gjøre tre ting:

- Opprette en REST-_ressurs_
- Opprette en _action_ som håndterer innkommende requests på ressursen, og knytte denne mot Lambdaen vår
- _Deploye_ APIet


### Opprett API med ressurs som trigger lambdafunksjonen
- Finn frem til API Gateway i AWS-konsollet
- Opprett et nytt API med et valgfritt navn
- I menyen, velg _Actions_ -> _Create Resource_ og bruk path `/todos`. Gi ressursen et valgfritt navn og klikk _Create resource_
- Marker den nyopprettede ressursen og opprett en ny metode på denne med _Actions_ -> _Create method_
- Velg `ANY` i dropdownen for å lage en handler for alle HTTP-metoder
- Velg Integration type _Lambda Function_
- Velg _Use Lambda Proxy integration_
- Velg regionen der Lambdaen ligger og skriv inn navnet på lambdaen

### Deploy og test API-et
- Velg _Actions_ -> _Deploy API_
- Lag et nytt deployment stage, bruk gjerne navnet `prod`
- Test API-et ved å klikke på _Invoke URL_. Legg på `/todos` på slutten, slik at du får en URL på formatet `https://<id>.execute-api.<region>.amazonaws.com/prod/todos`. Får du følgende output?

```
Hello World via API Gateway!
```

Bra! Da er API-et korrekt konfigurert. Imidlertid gjør ikke backenden vår så mye fornuftig enda, så vi går tilbake til Lambda-konsollet for å legge til litt skikkelig Forretningslogikk™.

