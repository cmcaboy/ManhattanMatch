import React, {Component} from 'react';
import firebase from 'firebase';
import {View,Text} from 'react-native';
import {Card,CardSection,Button,Spinner,Input, MyAppText} from './common';
import { SECONDARY_COLOR, PRIMARY_COLOR, BACKGROUND_COLOR } from '../variables';
import { ApolloConsumer, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import FBLoginButton from '../services/FBLoginButton';

const NEW_USER = gql`
mutation newUser($id: ID!, $name: String, $active: Boolean, $email: String, $gender: String, $description: String, $school: String, $work: String, $sendNotifications: Boolean, $distance: Int, $token: String, $minAgePreference: Int, $maxAgePReference: Int, $pics: [String]) {
  newUser(id: $id, name: $name, active: $active, email: $email, gender: $gender, description: $description, school: $school, work: $work, sendNotifications: $sendNotifications, distance: $distance, token: $token, minAgePreference: $minAgePreference, maxAgePreference: $maxAgePreference, pics: $pics) {
    	id
        name
        email
  }
}
`

const SET_ID_LOCAL = gql`
mutation updateIdLocal($id: ID!) {
  updateIdLocal(id: $id) @client {
    id
    __typename
  }
}
`;

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: '',
            isLoading: false
        }
    }

    // startFacebookLogin = async (client) => {

    //     console.log('logging into facebook...');

    //     this.setState({loading:true, error:''});

    //     const {type,token} = await Expo.Facebook.logInWithReadPermissionsAsync('1751170988304368',
    //         {permissions:[
    //             'public_profile',
    //             'email',
    //             // 'user_about_me',
    //             'user_photos',
    //             // 'user_education_history',
    //             // 'user_work_history',
    //             'user_birthday',
    //             'user_hometown'
    //         ]}
    //     )

    //     console.log('type: ',type);
    //     console.log('token: ',token);

    //     // the /me notation will refer to the userid referenced from the access token.
    //     if(type === 'success') {
    //         const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`)
    //         const responseData = await response.json();

    //         console.log('responseData: ',responseData);

    //         const provider = firebase.auth.FacebookAuthProvider;
    //         const credential = provider.credential(token);
    //         console.log('before credential');
    //         firebase.auth().signInWithCredential(credential)
    //             .then(() =>  {
    //                 console.log('facebook login successful');
    //                 client.writeData({ data: { id: firebase.auth().currentUser.uid }});
    //                 //postLogin(firebase.auth().currentUser.uid,token);
    //             })
    //             .catch((e) => {console.log('fb login error: ',e);this.setState({error: 'Error logging into Facebook!'})});
    //     } else {
    //         this.setState({error: 'Error logging into Facebook!'});
    //     }
    // }

    // renderButtonFB() {
    //     if(this.state.isLoading) {
    //         return <Spinner size="small" />
    //     } else {
    //         return (
    //             <ApolloConsumer>
    //                 {client => (
    //                     <Button 
    //                         onPress={() => this.startFacebookLogin(client)}
    //                         buttonStyleOverride={styles.buttonFBStyle}
    //                         textStyleOverride={styles.buttonTextFBStyle}
    //                     >Log in with Facebook</Button>
    //                 )}
    //             </ApolloConsumer>
    //         )
    //     }
    // }
    render() {
        return (
            <View style={styles.loginContainer}>
                <View style={styles.content}>
                    <Text style={styles.title}>Manhattan Stag</Text>
                    <Text style={styles.errorTextStyle}>
                        {this.props.error}
                    </Text>
                    <CardSection style={{borderBottomWidth: 0}}>
                        <Mutation mutation={NEW_USER}>
                        {(newUser) => {
                            const startNewUser = (user) => {
                                console.log('in startNewUser');
                                console.log('user: ',user);
                                return newUser({variables: {
                                    id: user.id,
                                    name: user.name,
                                    active: user.active,
                                    email: user.email,
                                    gender: user.gender,
                                    description: user.description,
                                    school: user.school,
                                    work: user.work,
                                    sendNotifications: user.sendNotifications,
                                    distance: user.distance,
                                    token: user.token,
                                    latitude: user.latitude,
                                    longitude: user.longitude,
                                    minAgePreference: user.minAgePreference,
                                    maxAgePreference: user.maxAgePreference,
                                    pics: user.pics,
                                }})
                            } 
                            return (
                                <Mutation mutation={SET_ID_LOCAL}>
                                {(setId) => {
                                    const startSetId = (id) => setId({variables: {id}})
                                    return (
                                        <ApolloConsumer>
                                            {client => <FBLoginButton client={client} startNewUser={startNewUser} startSetId={startSetId}/>}
                                        </ApolloConsumer>
                                    )
                                }}
                                </Mutation>
                            )
                        }}
                        </Mutation>
                        {/*this.renderButtonFB()*/}
                    </CardSection>
                </View>
                <View style={{flex:1}}/>
            </View>
        )
    }
}

const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    buttonFBStyle: {
        backgroundColor: '#4C69BA'
    },
    buttonTextFBStyle: {
        color: "white"
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR
    },
    title: {
        fontSize: 32,
        color: PRIMARY_COLOR
    },
    content: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    }
}

export default LoginForm;