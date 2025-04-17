// src/authService.js
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';
import { userPool } from './cognitoConfig';

export function loginCognito(email, password, onSuccess, onFailure, onNewPasswordRequired) {
  const user = new CognitoUser({
    Username: email,
    Pool: userPool
  });

  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password
  });

  user.authenticateUser(authDetails, {
    onSuccess: (result) => {
      const idToken = result.getIdToken().getJwtToken();
      const accessToken = result.getAccessToken().getJwtToken();
      const refreshToken = result.getRefreshToken().getToken();

      onSuccess({ idToken, accessToken, refreshToken });
    },

    onFailure: (err) => {
      onFailure(err);
    },

    // ✅ handle new password challenge
    newPasswordRequired: (userAttributes, requiredAttributes) => {
      onNewPasswordRequired(user, userAttributes, requiredAttributes);
    }
  });
}
export function signUpCognito(name, email, password, role, onSuccess, onFailure) {
  const attributes = [
    new CognitoUserAttribute({ Name: 'name', Value: name }),
    new CognitoUserAttribute({ Name: 'email', Value: email }),
    new CognitoUserAttribute({ Name: 'custom:role', Value: role }) // custom attribute
  ];

  userPool.signUp(email, password, attributes, null, (err, result) => {
    if (err) {
      onFailure(err);
    } else {
      onSuccess(result);
    }
  });
}