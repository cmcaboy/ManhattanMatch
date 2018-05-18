import React,{Component} from 'react';
import {
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Platform, 
    ScrollView 
} from 'react-native';
import {connect} from 'react-redux';
import {CirclePicture,MyAppText} from './common';
import MatchListItem from './MatchListItem';
import {Ionicons} from '@expo/vector-icons';
import { PRIMARY_COLOR } from '../variables';

class Matches extends Component {
    constructor(props) {
        super(props);
    }
    noMatches = () => {
        return (
            <View style={styles.noMatches}>
                <Ionicons 
                    name="md-sad"
                    size={100}
                    color="black"
                />
                <MyAppText>You do not have any matches.</MyAppText>
                <MyAppText>Better get to swipping!</MyAppText>
            </View>
        )
    }
    render() {
        const {matches,navigation} = this.props;

        if (matches.length === 0) {
            return this.noMatches();
        } else {
            return (
                <View style={styles.matchContainer}>
                    <View style={styles.newMatchesContainer}>
                        <MyAppText style={styles.heading}>New Matches</MyAppText>
                        <ScrollView
                            horizontal={true}
                        >
                        {matches.filter(match => !match.lastMessage).map((match) => {
                            return (
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate('Messenger',{
                                        matchId:match.matchId,
                                        id:this.props.id,
                                        otherId: match.id,
                                        name:match.name,
                                        pic:match.profilePic
                                    })}
                                    key={match.id}
                                >
                                    <View style={styles.newMatch}>
                                        <CirclePicture imageURL={match.profilePic} picSize="small"/>
                                        <MyAppText>{match.name}</MyAppText>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                        </ScrollView>
                    </View>
                    <View style={styles.messagesContainer}>
                        <MyAppText style={styles.heading}>Messages</MyAppText>
                        <ScrollView>
                            {matches.filter(match => !!match.lastMessage).map((match) => (
                            <MatchListItem 
                                key={match.id}
                                name={match.name} 
                                picture={match.profilePic}
                                lastMessage={match.lastMessage}
                                onPress={() => navigation.navigate('Messenger',{
                                    matchId:match.matchId,
                                    id:this.props.id,
                                    otherId: match.id,
                                    name:match.name,
                                    pic:match.profilePic
                                })}
                            />
                        ))}
                        </ScrollView>
                    </View>
                </View>
            )
    }
    }
}
/*
const Matches = (props) => {
    return (
        <View style={styles.matchContainer}>
            <Text>
                Stagg Page
            </Text>
        </View>
    )
}
*/
const styles = StyleSheet.create({
    matchContainer: {
        flex: 1,
        paddingLeft: 10,
        paddingTop:5,
        backgroundColor: '#FFFFFF'

    },
    newMatchesContainer: {
        flex: 2
    },
    messagesContainer: {
        flex: 5,
        //marginTop: 10
    },
    newMatch: {
        margin: 5,
        display:'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection:'column'
    },
    noMatches: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: {
        fontSize: 20,
        fontWeight: '900',
        color: PRIMARY_COLOR,
        marginTop: 10,
        marginBottom: 5,
        //textDecorationLine: 'underline'
    }
});

const mapStateToProps = (state,ownProps) => {
    //console.log('state at matches -- ',state);
    //console.log('state matchList: ',state.matchListReducer);
    return {
        matches: state.matchListReducer.matches,
        id: state.authReducer.uid
    }
}

export default connect(mapStateToProps)(Matches);