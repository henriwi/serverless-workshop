1. Opprett S3-bucket med
2. Opprett API
3. Opprett Cloudfront-distribution
  1. Velg Web -> Get Started
  2. Origin Domain Name: Velg din bucket
  3. La _Origin Path_ være blank
  4. Velg _Restrict bucket access_ og _Create a New Identity_. Huk av for _Yes, Update Bucket Policy_
  5. Velg _Redirect HTTP to HTTPS_
  5. Sett _Default Root Object_ til `index.html`
  6. La resten stå som default og klikk _Create Distribution_

Du har nå laget en Cloudfront-distribution med én origin for S3-bucketen. Det ble opprettet en default _behavior_ som vil returnere `index.html` fra S3-bucketen din når man går til `/` på rot-URL-en til distribusjonen.

Nå må vi lage en ny origin for API-et, med tilhørende behavior.

1. Under _Origins_, velg _Create Origin_
2. Lim inn URL-en til API-et ditt. Den vil automatisk splittes slik at API-ets deployment stage (f.eks. `/prod`) legges inn i _Origin Path_
3. Velg _HTTPS Only_ og trykk _Create_

Vi må nå lage en _behavior_ som ruter trafikk på visse ruter videre til API-et

1. Lag en ny behavior
2. Skriv `/api`i _Path Pattern_
3. _Redirect HTTP to HTTPS_
4. La resten stå som default og klikk _Create_

Nå tar det en god stund før distribusjonen er ferdig satt opp. Ta deg en kaffe i mellomtiden.
