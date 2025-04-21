
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'eu-west-1_9iU8CwZBn', // your Cognito pool ID
  ClientId: '1r92gnprfc1lhl6lbodholv193' // your app client ID
};

export const userPool = new CognitoUserPool(poolData);
