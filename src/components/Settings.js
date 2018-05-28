import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import {CirclePicture,Card,MyAppText} from './common';
import {MaterialCommunityIcons,Ionicons,MaterialIcons} from '@expo/vector-icons';
import { PRIMARY_COLOR, PLACEHOLDER_PHOTO } from '../variables';
import {firebase} from '../firebase';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import GET_ID from '../queries/getId';

const GET_PROFILE = gql`
query user($id: ID!) {
    user(id: $id) {
        name
        work
        school
        profilePic
    }
}
`

// Moved to separate file
// ----------------------
// const GET_ID = gql`
// query {
//     user @client {
//         id
//     }
// }`

const ICON_OPACITY = 0.75;
const ICON_SIZE = Dimensions.get('window').height *0.05;

class Settings extends React.Component {
    constructor(props) {
        super(props);
    }

    startLogout = () => firebase.auth().signOut();

    renderSubheading = (work,school) => {
        if (work || school) {
            if(school) {
                return (
                    <View style={styles.subHeading}>
                        <Ionicons name="md-school" size={14} color="black" style={styles.schoolText}/>
                        <Text style={[styles.schoolText,{paddingLeft:4}]}>{school}</Text>
                    </View>
                )
            } else {
                return (
                    <View style={styles.subHeading}>
                        <MaterialIcons name="work" size={14} color="black" style={styles.schoolText}/>
                        <Text style={[styles.schoolText,{paddingLeft:4}]}>{work}</Text>
                    </View>
                )
            }
        }
    }

    renderContent(user) {
        const profilePic = !!user.profilePic? user.profilePic : PLACEHOLDER_PHOTO
        const {work, school, name } = user;
        console.log('profilePic: ',profilePic);
        console.log('name: ',name);
        console.log('work: ',work);
        console.log('school: ',school);
        return (
            <View style={styles.settingsContainer}>
                <View style={styles.miniProfile}> 
                    <CirclePicture size='large' imageURL={profilePic} auto={true}/>
                    <View style={styles.profileText}>
                        <Text style={styles.nameText}>{name}</Text>
                        {this.renderSubheading(work, school)}
                    </View>
                    <View style={styles.horizontalLine}/>
                </View>
                <View style={styles.options}>
                    <TouchableOpacity 
                        onPress={() => this.props.navigation.navigate('EditSettings')}
                        style={styles.buttons}
                    >
                        <Ionicons 
                            name="md-settings"
                            size={ICON_SIZE}
                            color="black"
                            style={{opacity:ICON_OPACITY}}
                        />
                        <Text style={styles.optionText}>
                            Settings
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => this.props.navigation.navigate('EditProfile')}
                        style={styles.buttons}
                    >
                        <MaterialCommunityIcons 
                            name="account-edit"
                            size={ICON_SIZE}
                            color="black"
                            style={{opacity:ICON_OPACITY}}
                        />
                        <Text style={styles.optionText}>
                            Edit Info
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => this.startLogout()}
                        style={styles.buttons}
                    >
                        <MaterialCommunityIcons 
                            name="logout"
                            size={ICON_SIZE}
                            color="black"
                            style={{opacity:ICON_OPACITY}}
                        />
                        <Text style={styles.optionText}>
                        Log out
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    render() {
        return (
            <Query query={GET_ID}>
            {({ loading, error, data}) => {
                console.log('local data: ',data);
                console.log('local error: ',error);
                console.log('local loading: ',loading);
                if(loading) return <Text>Loading...</Text>
                if(error) return <Text>Error! {error.message}</Text>
                
                const id = data.user.id;
                
                return (
                    <Query query={GET_PROFILE} variables={{id}}>
                        {({loading, error, data}) => {
                            console.log('loading: ',loading);
                            console.log('error: ',error);
                            console.log('data: ',data);
                            if(loading) return <Text>Loading...</Text>
                            if(error) return <Text>Error! {error.message}</Text>
            
                            return this.renderContent(data.user)
                        }}
                    </Query>
                )
            }}
          </Query>
        )
    }
}

const styles = StyleSheet.create({
    settingsContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        margin:10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderBottomWidth: 0,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 2,
        shadowOpacity: 0.5,
        borderRadius: 10
    },
    miniProfile: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 20,
        minHeight: 100
    },
    profileText: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    options: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%'
    },
    optionText: {
        opacity: 0.7
    },
    nameText: {
        fontSize: 30,
        color: PRIMARY_COLOR,
        textAlign:'center',
        //fontFamily:'oxygen-regular'
    },
    schoolText: {
        fontSize: 14,
        opacity: 0.7
    },
    buttons: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    subHeading: {
        flexDirection: 'row',
        marginTop: 2
    },
    horizontalLine: {
        borderBottomColor:'black',
        borderBottomWidth:1,
        paddingVertical: 10,
        marginBottom: 10,
        flex:1
    },
});

export default Settings;
