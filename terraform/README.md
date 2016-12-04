Terraform oppsett
=================

Dette oppsettet har to begrensinger:

1. Klarer ikke å koble opp integrasjonen med lambda korrekt så man må manuelt gå
inn i "Integration Request" konfigureringen til API ressursen å skru av og på 
"Use Lambda Proxy integration". Dette er mulig en bug i Terraform eller bare en 
konfigureringsfeil.
2. Setter ikke opp CORS. Se ["Kofigurer CORS"](https://github.com/henriwi/serverless-workshop#konfigurer-cors)
