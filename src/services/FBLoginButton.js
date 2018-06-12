import React, { Component } from 'react';
import { View } from 'react-native';
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import {firebase} from '../firebase';
import gql from 'graphql-tag';
import uploadImage from '../firebase/uploadImage.js';

const GET_EMAIL_BY_TOKEN = gql`
query user($id: String!) {
    user(id: $id) {
        email
    }
}
`

class FBLoginButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <LoginButton
          //publishPermissions={["email","public_profile","user_photos","user_birthday","user_hometown"]}
          readPermissions={['public_profile','email','user_photos','user_birthday','user_hometown']}
          onLoginFinished={
            async (error, result) => {
              console.log('error: ',error);
              console.log('result: ',result)
              if (error) {
                alert("Login failed with error: " + error.message);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                const tokenRaw = await AccessToken.getCurrentAccessToken();
                const token = tokenRaw.accessToken.toString();

                console.log('token: ',token);

                // Determine if user is registered.

                const provider = firebase.auth.FacebookAuthProvider;
                const credential = provider.credential(token);
                
                console.log('credential: ',credential);
                console.log('this.props: ',this.props);

                const responseEmailRaw = await fetch(`https://graph.facebook.com/me/?fields=email&access_token=${token}`)
                const responseEmail = await responseEmailRaw.json();

                console.log('response Email: ',responseEmail.email);

                const {data, error} = await this.props.client.query({query: GET_EMAIL_BY_TOKEN, variables: {id: responseEmail.email}})
                console.log('data: ',data);
                console.log('error: ',error);
                const email = !!data.user? data.user.email : null;
                console.log('email: ',email);

                // If we do not have record of the user's email, this is a new user.
                // We should build their profile from their facebook profile
                if(!email) {
                  // An alternative approach would be to run this all on the graphql server
                  const responseRaw = await fetch(`https://graph.facebook.com/me/?fields=first_name,last_name,picture.height(300),education,about,gender,email&access_token=${token}`)
                  const response = await responseRaw.json();
                  
                  console.log('response: ',response);

                  const photosRaw = await fetch(`https://graph.facebook.com/me/photos/?fields=source.height(300)&limit=5&access_token=${token}`)
                  const photos = await photosRaw.json();

                  console.log('photos: ',photos);

                  const profilePic = await uploadImage(response.picture.data.url);
                  const ancillaryPics = await Promise.all(photos.data.map(async (datum) => {return await uploadImage(datum.source)}));
                  const pics = [profilePic, ...ancillaryPics];

                  const newUser = {
                    // By default the profilePic property will contain the user's profile pic along with the next
                    // 5 photos the user is tagged in.
                    pics,
                    name: response.first_name,
                    active: true,
                    school: response.education?response.education[response.education.length -1].school.name:'',
                    description: response.about,
                    gender: !!response.gender ? response.gender : 'male',
                    email: response.email,
                    id: response.email,
                    //coords: coords.coords,
                    sendNotifications: true, // default
                    distance: 15, // default
                    minAgePreference: 18, // default
                    maxAgePreference: 28, // default
                  }

                  console.log('newUser: ',newUser);

                  // Load up new user in our database
                  this.props.startNewUser(newUser);
                }

                this.props.startSetId(token);

                console.log('token: ',token)
                
                // Login via Firebase Auth
                const {user} = await firebase.auth().signInWithCredential(credential);

                console.log('user after fb login: ',user);
                
              }
            }
          }
          onLogoutFinished={async () => {
            return await firebase.auth().signOut()
          }
          }
          >
          </LoginButton>
      </View>
    );
  }
};

export default FBLoginButton;