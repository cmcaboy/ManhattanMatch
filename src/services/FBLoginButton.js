import React, { Component } from 'react';
import { View } from 'react-native';
import { LoginButton } from 'react-native-fbsdk';

class FBLoginButton extends Component {
  render() {
    return (
      <View>
        <LoginButton
          publishPermissions={["email","public_profile","user_photos","user_birthday","user_hometown"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + error.message);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                alert("Login was successful with permissions: " + result.grantedPermissions);
                console.log('result: ',result);
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}/>
      </View>
    );
  }
};

export default FBLoginButton;