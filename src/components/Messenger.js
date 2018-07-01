import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {db} from '../firebase';
import {CirclePicture,MyAppText} from './common';
import gql from 'graphql-tag';

class Messenger extends Component {
    
    constructor(props) {
        super(props);
    }
    
    componentDidMount = () => {
        this.unsubscribe = this.props.subscribeToNewMessages();
    }

    componentWillUnmount = () => this.unsubscribe();

    sendNewMessage = (messages) => {
        console.log('in sendNewMessage');
        console.log('messages: ',messages);
        //console.log('pic: ',this.props.pic);
        // If messages is array, we may need to change
        const now = new Date().getTime();
        // console.log("_id: ",this.props.navigation.state.params.id);
        // console.log("id: ",this.props.navigation.state.params.id);
        // console.log("matchId: ",this.props.navigation.state.params.matchId);
        // console.log("name: ",this.props.navigation.state.params.name);
        // console.log("text: ",message[0].text)
        // console.log("avatar: ",this.props.navigation.state.params.pic);
        // console.log("uid: ",message[0]._id);
        // console.log("order: ",now);
        messages.forEach(message => {
            this.props.newMessage({variables: {
                avatar: this.props.pic,
                name: this.props.name,
                uid: message.user._id,
                // id: now,
                matchId: this.props.matchId,
                // The message object returns an array.
                text: message.text,
                _id: message._id,
                order: -1 * now,
        }})
        })
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.messages.map(message => message.text) !== this.props.messages.map(message => message.text)) {
            console.log('messages change');
            console.log('old messages: ',this.props.messages.map(message => message.text));
            console.log('new messages: ',nextProps.messages.map(message => message.text));
        }
    }
    
    render() {
        // console.log('id: ',`${this.props.id}`);
        // console.log('messages: ',this.props.messages);
        return (
        <View style={styles.messengerContainer}>
            <GiftedChat 
                messages={this.props.messages}
                onSend={(message) => this.sendNewMessage(message)}
                user={{_id:`${this.props.id}`,name: this.props.name, avatar: this.props.pic}}
                showUserAvatar={false}
                onPressAvatar={(user) => this.props.navigation.navigate('UserProfile',{id:user._id,name:user.name})}
                loadEarlier={true}
                onLoadEarlier={() => this.props.fetchMoreMessages()}
                isLoadEarlier={true}
            />
        </View>
        )
    }
}

const styles = StyleSheet.create({
    messengerContainer: {
        flex: 1,
        alignItems: 'stretch',
        marginLeft: 0,
        marginRight: 0
    },
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

export default Messenger;