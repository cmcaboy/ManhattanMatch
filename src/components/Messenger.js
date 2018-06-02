import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {db} from '../firebase';
import {CirclePicture,MyAppText} from './common';

class Messenger extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
        
        this.messageRef = db.collection(`matches/${this.props.navigation.state.params.matchId}/messages`);
        this.unsubscribe;
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
    
    componentDidMount() {
        this.listenForUpdates();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    listenForUpdates() {
        // Could listen for lastMessage and lastUser as well
        this.unsubscribe = this.messageRef.orderBy("order").onSnapshot((querySnapshot) => {
            // the snapshot first returns all messages
            // It then will listen to updates.
            let messages = [];
            querySnapshot.docChanges.forEach((change) => {
                
                const changeData = change.doc.data();
                messages.push({
                    _id: changeData.createdAt,
                    text: changeData.text,
                    createdAt: new Date(changeData.createdAt),
                    user: {
                        _id: changeData.uid,
                        name: changeData.name,
                        avatar: changeData.avatar
                    }
                });
                
            })
            this.setState((prevState) => ({
                messages: [...messages,...prevState.messages]
            }));
        })
    }

    onSend(messages = []) {
        const {name,profilePic,id} = this.props.navigation.state.params;
        messages.forEach(message => {
            console.log(message);
            const now = new Date().getTime();
            this.messageRef.add({
                _id: now,
                text: message.text,
                createdAt: now,
                uid: id,
                order: -1 * now,
                name: name,
                avatar: profilePic
            })
            // Update lastUser and lastMessage here
            //this.props.startUpdateLastMessage(this.props.matchId,message.text);
            //this.props.startUpdateLastName(this.props.matchId,this.props.name);
        })
    }
    
    render() {
        const {id} = this.props.navigation.state.params;
        return (
        <View style={styles.messengerContainer}>
            <GiftedChat 
                messages={this.state.messages}
                onSend={(message) => this.onSend(message)}
                user={{_id:id}}
                showUserAvatar={false}
                onPressAvatar={(user) => this.props.navigation.navigate('UserProfile',{id:user._id,name:user.name})}
            />
            {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
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