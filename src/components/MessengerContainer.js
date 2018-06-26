import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {db} from '../firebase';
import {connect} from 'react-redux';
import {CirclePicture,MyAppText,Spinner} from './common';
import gql from 'graphql-tag';

const GET_MESSAGES = gql`
query user($id: String!, $matchId: String) {
    user(id: $id) {
        name
        work
        school
        pics
        matches(id: $matchId) {
            name
            messages {
                id
                name
                message
                date
            }
        }
    }
}
`;

const GET_NEW_MESSAGES = gql`
subscription($matchId: String) {
    newMessageSub(matchId: $matchId) {
      id
      name
      date
      message
    }
  }
`;

const SEND_MESSAGE = gql`
mutation($matchId: String!,$id: String!, $name: String, $message: String) {
    newMessage(matchId: $matchId, id: $id, name: $name, message: $message) {
        id
        name
        date
        message
    }
}
`;

class MessengerContainer extends Component {
    
    constructor(props) {
        super(props);

        console.log('matchId: ',this.props.navigation.state.params.matchId);
        // this.messageRef = db.collection(`matches/${this.props.navigation.state.params.matchId}/messages`);
        // this.unsubscribe;

        // this.name = this.props.navigation.state.params.name;
        // this.pic = this.props.navigation.state.params.pic;
        // this.id = this.props.navigation.state.params.id;
    }

    static navigationOptions = ({navigation}) => ({
        title: `${navigation.state.params.name}`,
        headerTitle: (
            <View style={styles.headerViewStyle}>
                {console.log('navigation params: ',navigation.state.params)}
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile',
                    {id:navigation.state.params.otherId,name:navigation.state.params.name})}>
                    <CirclePicture imageURL={navigation.state.params.pic} picSize="mini" />
                </TouchableOpacity>
                <MyAppText style={styles.textHeader}>{navigation.state.params.name}</MyAppText>
                <View style={{width: 100}}></View>
            </View>
        ),
        headerTitleStyle: 
            {
                alignSelf: 'center',
                textAlign: 'center',
                fontWeight:'normal',
                fontSize: 22,
                color: 'black'
            }
    })
    
    //componentDidMount = () => this.listenForUpdates();
    // componentWillUnmount = () => this.unsubscribe();

    // listenForUpdates() {
    //     // Could listen for lastMessage and lastUser as well
    //     this.unsubscribe = this.messageRef.orderBy("order").onSnapshot((querySnapshot) => {
    //         // the snapshot first returns all messages
    //         // It then will listen to updates.
    //         let messages = [];
    //         console.log('num messages: ',querySnapshot.docChanges.length);
    //         querySnapshot.docChanges.forEach((change) => {
                
    //             const changeData = change.doc.data();
    //             messages.push({
    //                 _id: changeData.createdAt,
    //                 text: changeData.text,
    //                 createdAt: new Date(changeData.createdAt),
    //                 user: {
    //                     _id: changeData.uid,
    //                     name: changeData.name,
    //                     avatar: changeData.avatar
    //                 }
    //             });
                
    //         });
    //         console.log('messages: ',messages);
    //         this.setState((prevState) => ({
    //             messages: [...messages,...prevState.messages]
    //         }));
    //     })
    // }

    // onSend(messages = []) {
    //     messages.forEach(message => {
    //         console.log(message);
    //         const now = new Date().getTime();
    //         this.messageRef.add({
    //             _id: now,
    //             text: message.text,
    //             createdAt: now,
    //             uid: this.id,
    //             order: -1 * now,
    //             name: this.name,
    //             avatar: this.pic
    //         })
    //     })
    // }
    
    render() {
        return (
            <Query 
                query={GET_MESSAGES} 
                variables={{
                    id: this.props.navigation.state.params.id,
                    matchId: this.props.navigation.state.params.matchId
                }}
            >
                {({loading, error, data, subscribeToMore}) => {
                    console.log('loading: ',loading);
                    console.log('error: ',error);
                    console.log('data: ',data);
                    if(loading) return <Spinner />
                    if(error) return <Text>Error! {error.message}</Text>
                    return (
                        <Mutation mutation={SEND_MESSAGE}>
                        {(newMessage,_) => {
                            const sendNewMessage = (message) => newMessage({variables: {
                                id: this.props.navigation.state.params.id,
                                matchId: this.props.navigation.state.params.matchId,
                                name: this.props.navigation.state.params.name,
                                message
                            }})
                            return (
                                <Messenger 
                                    messages={data.user.matches.messages}
                                    sendMessage={sendNewMessage}
                                    id={this.props.navigation.state.params.id}
                                    subscribeToNewMessages={() => 
                                        subscribeToMore({
                                            document: GET_NEW_MESSAGES,
                                            variables: {matchId: this.props.navigation.state.params.matchId},
                                            updateQuery: (prev, { subscriptionData}) => {
                                                if(!subscriptionData.data) return prev;
                                                console.log('prev: ',prev);
                                                console.log('subscriptionData.data: ',subscriptionData.data);
                                                const newMessage = subscriptionData.data.newMessageSub;
    
                                                return Object.assign({}, prev, {
                                                    matches: {
                                                        messages: [newMessage, ...prev.matches.messages]
                                                    }
                                                })
                                            } 
                                        })
                                    }
                                />
                            )
                        }}
                        </Mutation>
                    )
                }}
            </Query>
        )
    }
}

export default ContainerMessenger;