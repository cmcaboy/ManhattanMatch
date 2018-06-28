import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {db} from '../firebase';
import {connect} from 'react-redux';
import {CirclePicture,MyAppText} from './common';
import gql from 'graphql-tag';

class Messenger extends Component {
    
    constructor(props) {
        super(props);
        // this.state = {
        //     messages: []
        // }
        // console.log('matchId: ',this.props.navigation.state.params.matchId);
        // this.messageRef = db.collection(`matches/${this.props.navigation.state.params.matchId}/messages`);
        // this.unsubscribe;

        // this.name = this.props.navigation.state.params.name;
        // this.pic = this.props.navigation.state.params.pic;
        // this.id = this.props.navigation.state.params.id;


    }
    
    componentDidMount = () => {
        //console.log('Messenger props: ',this.props);
        this.unsubscribe = this.props.subscribeToNewMessages();
    }

    componentWillUnmount = () => this.unsubscribe();

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
        //console.log('id: ',this.props.id);
        console.log('messages: ',this.props.messages);
        return (
        <View style={styles.messengerContainer}>
            <GiftedChat 
                messages={this.props.messages}
                onSend={(message) => this.props.sendMessage(message)}
                user={{_id:this.props.id}}
                showUserAvatar={false}
                onPressAvatar={(user) => this.props.navigation.navigate('UserProfile',{id:user._id,name:user.name})}
            />
            {/*Platform.OS === 'android' ? <KeyboardSpacer /> : null */}
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

// const mapStateToProps = (state,ownProps) => {
//     return {
//         matchId: ownProps.navigation.state.params.matchId,
//         id: ownProps.navigation.state.params.id,
//         //otherId: ownProps.navigation.state.params.otherId,
//         name: state.profileReducer.name,
//         profilePic: state.profileReducer.profilePic
//    }
// }
export default Messenger;