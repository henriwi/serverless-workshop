'use strict';

const generatePolicy = (principalId, effect, resource) => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource:resource
        }
      ]
    }
  }
};

module.exports.authorizerFunc = (event, context, callback) => {
  // Valider om tokenet er gyldig
  // Hvis gyldig: Returner en policy med 'Allow' som 'effect', dvs. at brukeren får tilgang
  // Hvis ikke gyldig: Returner en policy med 'Deny' som 'effect', dvs. at brukeren får tilgang

  const policy = {};
  callback(null, policy);
};
