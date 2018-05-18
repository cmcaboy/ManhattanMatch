import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import {CirclePicture,Card,MyAppText} from './common';
import {connect} from 'react-redux';
import {startLogout} from '../actions/auth';
import {MaterialCommunityIcons,Ionicons,MaterialIcons} from '@expo/vector-icons';
import { PRIMARY_COLOR, PLACEHOLDER_PHOTO } from '../variables';


const ICON_OPACITY = 0.75;
const ICON_SIZE = Dimensions.get('window').height *0.05;

const Settings = (props) => {
    const {profilePic = PLACEHOLDER_PHOTO,name,work,school} = props;
    // console.log('work: ',work);
    // console.log('school: ',school);
    // console.log('school: ',!!school);
    // console.log('work: ',!!work);

    const renderSubheading = () => {
        if (work || school) {
            if(school) {
                return (
                    <View style={styles.subHeading}>
                        <Ionicons name="md-school" size={14} color="black" style={styles.schoolText}/>
                        <MyAppText style={[styles.schoolText,{paddingLeft:4}]}>{school}</MyAppText>
                    </View>
                )
            } else {
                return (
                    <View style={styles.subHeading}>
                        <MaterialIcons name="work" size={14} color="black" style={styles.schoolText}/>
                        <MyAppText style={[styles.schoolText,{paddingLeft:4}]}>{work}</MyAppText>
                    </View>
                )
            }
        }
    }

    return (
        <View style={styles.settingsContainer}>
            
            <View style={styles.miniProfile}> 
                <CirclePicture size='large' imageURL={profilePic} auto={true}/>
                <View style={styles.profileText}>
                    <MyAppText style={styles.nameText}>{name}</MyAppText>
                    {renderSubheading()}
                    
                </View>
                <View style={styles.horizontalLine}/>
            </View>
            
            <View style={styles.options}>
                
                <TouchableOpacity 
                    onPress={() => props.navigation.navigate('EditSettings')}
                    style={styles.buttons}
                >
                    <Ionicons 
                        name="md-settings"
                        size={ICON_SIZE}
                        color="black"
                        style={{opacity:ICON_OPACITY}}
                    />
                    <MyAppText style={styles.optionText}>
                        Settings
                    </MyAppText>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => props.navigation.navigate('EditProfile')}
                    style={styles.buttons}
                >
                    <MaterialCommunityIcons 
                        name="account-edit"
                        size={ICON_SIZE}
                        color="black"
                        style={{opacity:ICON_OPACITY}}
                    />
                    <MyAppText style={styles.optionText}>
                        Edit Info
                    </MyAppText>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => props.startLogout()}
                    style={styles.buttons}
                >
                    <MaterialCommunityIcons 
                        name="logout"
                        size={ICON_SIZE}
                        color="black"
                        style={{opacity:ICON_OPACITY}}
                    />
                    <MyAppText style={styles.optionText}>
                    Log out
                    </MyAppText>
                </TouchableOpacity>
            </View>
        
        </View>
    )
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
        fontFamily:'oxygen-regular'
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

const mapDispatchToProps = (dispatch) => {
    return {
        startLogout: () => dispatch(startLogout())
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        profilePic: state.profileReducer.profilePic,
        name: state.profileReducer.name,
        work: state.profileReducer.work,
        school: state.profileReducer.school
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Settings);
