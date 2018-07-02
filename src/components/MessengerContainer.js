import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {db} from '../firebase';
import {CirclePicture,MyAppText,Spinner} from './common';
import {Query,Mutation} from 'react-apollo';
import Messenger from './Messenger';
import gql from 'graphql-tag';

// const GET_MESSAGES = gql`
// query user($id: String!, $otherId: String) {
//     user(id: $id) {
//         id
//         name
//         work
//         school
//         pics
//         matches(otherId: $otherId) {
//             messages {
//                 cursor
//                 list {
//                     name
//                     text
//                     createdAt
//                     avatar
//                     order
//                     uid
//                     _id
//                 }
//             }
//         }
//     }
// }
// `;


const GET_MESSAGES = gql`
query messages($id: String!) {
    messages(id: $id) {
        id
        cursor
        list {
            _id
            name
            text
            createdAt
            avatar
            order
            uid
        }
    }
}
`;

const MORE_MESSAGES = gql`
query moreMessages($id: String!, $cursor: String) {
    moreMessages(id: $matchId, cursor: $cursor) {
        id
        cursor
        list {
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
`;

const GET_NEW_MESSAGES = gql`
subscription($matchId: String, $id: String) {
    newMessageSub(matchId: $matchId, id: $id) {
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

    }

    static navigationOptions = ({navigation}) => ({
        title: `${navigation.state.params.otherName}`,
        headerTitle: (
            <View style={styles.headerViewStyle}>
                {console.log('navigation params: ',navigation.state.params)}
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile',
                    {id:navigation.state.params.otherId,name:navigation.state.params.otherName})}>
                    <CirclePicture imageURL={navigation.state.params.otherPic} picSize="mini" />
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
    
    render() {
        return (
            <Query 
                query={GET_MESSAGES} 
                //fetchPolicy='network-only'
                variables={{
                    id: this.props.navigation.state.params.matchId,
                }}
            >
                {({loading, error, data, subscribeToMore, fetchMore}) => {
                    //console.log('loading: ',loading);
                    //console.log('error: ',error);
                    //console.log('MessengerContainer data: ',data);
                    //console.log('id: ',this.props.navigation.state.params.otherId);
                    //console.log('otherId: ',this.props.navigation.state.params.id);
                    if(loading) return <Spinner />
                    if(error) return <Text>Error! {error.message}</Text>
                        //const messages = data.user.matches[0].messages
                        //console.log('messages before refactor: ',data.user.matches[0].messages);
                            const messages = data.messages.list.map(message => {
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
                            //console.log('messages after refactor: ',messages);
                    return (
                        <Mutation mutation={SEND_MESSAGE} ignoreResults={false}>
                        {(newMessage,_) => {
                            //console.log('start of mutation');
                            //console.log('pic in mcontainer: ',this.props.navigation.state.params.pic)
                            return (
                                <Messenger 
                                    messages={messages}
                                    newMessage={newMessage}
                                    id={this.props.navigation.state.params.id}
                                    otherId={this.props.navigation.state.params.otherId}
                                    matchId={this.props.navigation.state.params.matchId}
                                    name={this.props.navigation.state.params.name}
                                    pic={this.props.navigation.state.params.pic}
                                    navigation={this.props.navigation}
                                    cursor={data.user.matches[0].messages.cursor}
                                    fetchMoreMessages={() => {
                                        console.log('in fetchMoreMessages');
                                        return fetchMore({
                                            query: MORE_MESSAGES,
                                            variables: {
                                                matchId: this.props.navigation.state.params.matchId, 
                                                cursor: data.user.matches[0].messages.cursor,
                                            },
                                            updateQuery: (prev, { fetchMoreResult }) => {
                                                console.log('fetchMore updateQuery');
                                                console.log('fetchMore Result: ',fetchMoreResult)
                                                console.log('prev: ',prev)
                                                let newMessages = fetchMoreResult.moreMessages.list;
                                                const newCursor = fetchMoreResult.moreMessages.cursor;

                                                // Append the new messages to the existing query result
                                                const messages = {
                                                    messages: {
                                                        id: prev.messages.id,
                                                        cursor: newCursor,
                                                        list: [...prev.messages.list,...newMessages],
                                                        __typename: 'Message',
                                                    },
                                                }
                                                console.log('fetchMore New Result: ',messages);
                                                return messages;
                                            }
                                        })
                                    }}
                                    subscribeToNewMessages={() => {
                                        console.log('in subscribeToNewMessages');
                                        return subscribeToMore({
                                            document: GET_NEW_MESSAGES,
                                            variables: {
                                                matchId: this.props.navigation.state.params.matchId, 
                                                id: this.props.navigation.state.params.id
                                            },
                                            updateQuery: (prev, { subscriptionData }) => {
                                                if(!subscriptionData.data) return prev;
                                                //console.log('prev: ',prev);
                                                console.log('subscriptionData.data: ',subscriptionData.data);
                                                const newMessage = subscriptionData.data.newMessageSub;
                                                    
                                                console.log('newMessage via updateQuery: ',newMessage);

                                                // You must return an object that has the same structure as what the query
                                                // component returns.
                                                const messages = {
                                                    messages: {
                                                        id: prev.messages.id,
                                                        cursor: prev.messages.cursor,
                                                        list: [newMessage,...prev.messages.list],
                                                        __typename: 'Message',
                                                    },
                                                }
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