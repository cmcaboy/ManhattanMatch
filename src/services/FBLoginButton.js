import React, { Component } from 'react';
import { View } from 'react-native';
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import {firebase} from '../firebase';

const GET_EMAIL_BY_TOKEN = gql`
query user($token: String!) {
    user(token: $token) {
        id
        email
    }
}
`

class FBLoginButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('facebook login component');
    return (
      <View>
        <LoginButton
          //publishPermissions={["email","public_profile","user_photos","user_birthday","user_hometown"]}
          readPermissions={['public_profile','email','user_photos','user_birthday','user_hometown']}
          onLoginFinished={
            async (error, result) => {
              console.log('fb result: ',result);
              if (error) {
                alert("Login failed with error: " + error.message);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                console.log('result: ',result);
                //alert("Login was successful with permissions: " + result.grantedPermissions);
                const tokenRaw = await AccessToken.getCurrentAccessToken();
                const token = tokenRaw.accessToken.toString();

                // Determine if user is registered.


                const provider = firebase.auth.FacebookAuthProvider;
                const credential = proivder.credential(token);

                const {email} = await this.props.client.query({query: GET_EMAIL_BY_TOKEN, variables: {token}})

                // If we do not have record of the user's email, this is a new user.
                // We should build their profile from their facebook profile
                if(!email) {
                  // An alternative approach would be to run this all on the graphql server
                  const responseRaw = await fetch(`https://graph.facebook.com/me/?fields=first_name,last_name,picture.height(300),education,about,gender,email&access_token=${token}`)
                  const response = await responseRaw.json();
                  console.log('fb response: ',response);

                  const photosRaw = await fetch(`https://graph.facebook.com/me/photos/?fields=source.height(300)&limit=5&access_token=${token}`)
                  const photos = await phototsRaw.response.json();

                  // Will the uploadImage function work for us? yes

                  const profilePic = await uploadImage(response.picture.data.url);
                  const ancillaryPics = await Promise.all(photos.data.map(async (datum) => {return await uploadImage(datum.source)}));
                  const pics = [profilePic, ...ancillaryPics];

                  const newUser = {
                    // By default the profilePic property will contain the user's profile pic along with the next
                    // 5 photos the user is tagged in.
                    pics
                    name: response.first_name,
                    school: response.education?response.education[response.education.length -1].school.name:'',
                    description: response.about,
                    gender: response.gender,
                    email: response.email
                    uid,
                    //coords: coords.coords,
                    sendNotifications: true, // default
                    distance: 15, // default
                    minAgePreference: 18, // default
                    maxAgePreference: 28, // default
                  }
                  console.log('new user: ',newUser);

                  // Load up new user in our database
                  this.props.startNewUser(newUser);
                }

                // Login via Firebase Auth
                await firebase.auth().signInWithCredential(credential);

              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}>
          </LoginButton>
      </View>
    );
  }
};

export default FBLoginButton;