# Events

Som i del 1 skal vi trigge lambdaen via API Gateway. Les om hvordan dette gjøres [her](https://serverless.com/framework/docs/providers/aws/events/apigateway/).

- Vi ønsker å sette opp integrasjonen med `Lambda Proxy Integration`
- For at API-gatewayen skal fungere med frontenden vår og CloudFront er det viktig at pathen til ressursen i APIet er `/todos` , på samme måte som i del 1.

### Deploy gateway
Kjør `sls deploy` igjen, og sjekk i webkonsollet at API-gatewayen har blitt opprettet korrekt. Endepunktet som skrives ut i terminalen etter `sls deploy` vil ikke fungere før du setter opp tilganger i neste punkt.