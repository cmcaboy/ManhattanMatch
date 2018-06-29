import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {db} from '../firebase';
import {CirclePicture,MyAppText,Spinner} from './common';
import {Query,Mutation} from 'react-apollo';
import Messenger from './Messenger';
import gql from 'graphql-tag';

const GET_MESSAGES = gql`
query user($id: String!, $otherId: String) {
    user(id: $id) {
        name
        work
        school
        pics
        matches(otherId: $otherId) {
            messages {
                name
                text
                createdAt
                avatar
                order
                uid
                _id
            }
        }
    }
}
`;

const GET_NEW_MESSAGES = gql`
subscription($matchId: String) {
    newMessageSub(matchId: $matchId) {
        name
        text
        createdAt
        avatar
        order
        uid
        _id
    }
  }
`;

const SEND_MESSAGE = gql`
mutation($matchId: String!, $name: String, $text: String, $createdAt: String, $avatar: String, $order: Float, $uid: String, $_id: String) {
    newMessage(matchId: $matchId, name: $name, text: $text, createdAt: $createdAt, avatar: $avatar, order: $order, uid: $uid, _id: $_id) {
        name
        text
        createdAt
        avatar
        order
        uid
        _id
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
        title: `${navigation.state.params.otherName}`,
        headerTitle: (
            <View style={styles.headerViewStyle}>
                {console.log('navigation params: ',navigation.state.params)}
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile',
                    {id:navigation.state.params.otherId,name:navigation.state.params.otherName})}>
                    <CirclePicture imageURL={navigation.state.params.pic} picSize="mini" />
                </TouchableOpacity>
                <MyAppText style={styles.textHeader}>{navigation.state.params.otherName}</MyAppText>
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
                fetchPolicy='network-only'
                variables={{
                    id: this.props.navigation.state.params.otherId,
                    otherId: this.props.navigation.state.params.id
                }}
            >
                {({loading, error, data, subscribeToMore}) => {
                    console.log('loading: ',loading);
                    console.log('error: ',error);
                    console.log('MessengerContainer data: ',data);
                    console.log('id: ',this.props.navigation.state.params.otherId);
                    console.log('otherId: ',this.props.navigation.state.params.id);
                    if(loading) return <Spinner />
                    if(error) return <Text>Error! {error.message}</Text>
                        //const messages = data.user.matches[0].messages
                        console.log('messages before refactor: ',data.user.matches[0].messages);
                            const messages = data.user.matches[0].messages.map(message => {
                                return {
                                    _id: message._id,
                                    text: message.text,
                                    createdAt: message.createdAt,
                                    order: message.order,
                                    user: {
                                        name: message.name,
                                        avatar: message.avatar,
                                        _id: message.uid,
                                    },
                                }
                            });
                            console.log('messages after refactor: ',messages);
                    return (
                        <Mutation mutation={SEND_MESSAGE} ignoreResults={true}>
                        {(newMessage,_) => {
                            console.log('start of mutation');
                            return (
                                <Messenger 
                                    messages={messages}
                                    newMessage={newMessage}
                                    id={this.props.navigation.state.params.id}
                                    matchId={this.props.navigation.state.params.matchId}
                                    name={this.props.navigation.state.params.name}
                                    pic={this.props.navigation.state.params.pic}
                                    subscribeToNewMessages={() => {
                                        console.log('in subscribeToNewMessages');
                                        return subscribeToMore({
                                            document: GET_NEW_MESSAGES,
                                            variables: {matchId: this.props.navigation.state.params.matchId},
                                            updateQuery: (prev, { subscriptionData}) => {
                                                if(!subscriptionData.data) return prev;
                                                //console.log('prev: ',prev);
                                                console.log('subscriptionData.data: ',subscriptionData.data);
                                                const newMessage = subscriptionData.data.newMessageSub;
                                                    
                                                console.log('newMessage via updateQuery: ',newMessage);
                                                // const messages = Object.assign({}, prev, {
                                                //     user: {
                                                //         matches: [{
                                                //             messages: [...prev.user.matches[0].messages,newMessage]
                                                //         }]
                                                //     }
                                                // });

                                                // You must return an object that has the same structure as what the query
                                                // component returns.
                                                const messages = {
                                                    ...prev,
                                                    user: {
                                                        ...prev.user,
                                                        matches: [{
                                                            messages: [newMessage,...prev.user.matches[0].messages],
                                                            __typename: 'Match',
                                                        }]

                                                    }
                                                }
                                                //console.log('messages after subscription update: ',messages);
                                                return messages;
                                            } 
                                        })
                                    }
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

const styles = StyleSheet.create({
    textHeader: {
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight:'bold',
        fontSize: 18,
        color: '#000',
        paddingLeft: 8
    },
    headerViewStyle: {
        flexDirection: 'row',
        paddingVertical: 5
    }
});


export default MessengerContainer;