export const DB_URI = 'https://dhq1rkjlfl.execute-api.us-west-1.amazonaws.com/default/handleLifeCalendarReq';

export const SORT_KEY = 'username';

export const AUTH_DATA = {
  ClientId: '5cbo1alr1l8a24mi64aqsradtt',
  AppWebDomain: 'auth.lifecalender.me',
  TokenScopesArray: [
    'phone', 
    'email', 
    'profile',
    'openid', 
    'aws.cognito.signin.user.admin'
  ],
  RedirectUriSignIn : 'https://lifecalender.me',
	RedirectUriSignOut : 'https://lifecalender.me'
};
