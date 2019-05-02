export const DB_URI = 'https://dhq1rkjlfl.execute-api.us-west-1.amazonaws.com/default/handleLifeCalendarReq';

export const SORT_KEY = 'UserID';

export const AUTH_DATA = {
  ClientId: '7p7eebmak03blh8otale70ccuh',
  AppWebDomain: 'auth.lifecalender.me',
  TokenScopesArray: [
    'phone', 
    'email', 
    'profile',
    'openid', 
    'aws.cognito.signin.user.admin'
  ],
  RedirectUriSignIn : 'http://localhost:3000',
	RedirectUriSignOut : 'http://localhost:3000'
};
