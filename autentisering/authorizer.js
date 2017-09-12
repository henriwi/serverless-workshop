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
    console.log("Mottok event i authorizerFunc: ", JSON.stringify(event));
    const token = event.authorizationToken;

    if (token.length > 5) {
       callback(null, generatePolicy('myPrincipalId', 'Allow', event.methodArn));
     } else {
       callback(null, generatePolicy('myPrincipalId', 'Deny', event.methodArn));
     }
};
