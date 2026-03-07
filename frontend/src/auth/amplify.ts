import { Amplify } from 'aws-amplify';

const domain = import.meta.env.VITE_COGNITO_DOMAIN;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;

export const hasCognitoSetup = Boolean(domain && clientId && userPoolId && redirectUri);

if (hasCognitoSetup) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: userPoolId!,
        userPoolClientId: clientId!,
        loginWith: {
          oauth: {
            domain: domain!,
            scopes: ['openid', 'email', 'profile'],
            redirectSignIn: [redirectUri!],
            redirectSignOut: [redirectUri!],
            responseType: 'code',
          },
        },
      },
    },
  });
}
