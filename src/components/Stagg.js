import React,{Component} from 'react';
import {
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Platform, 
    Image,
    Dimensions,
    ScrollView,
    Animated,
    PanResponder,
    LayoutAnimation,
    UIManager,
    ActivityIndicator,
    ImageBackground,
    Alert,
    Button
} from 'react-native';
import {connect} from 'react-redux';
import {startLike,startDislike,startMatch,startNewQueue} from '../actions/matchList';
import {startSetCoords} from '../actions/profile';
import {matchLoading} from '../actions/auth';
//import {Card} from 'react-native-elements';
import {Card,Spinner,MyAppText} from './common';
import {Location,Permissions,Notifications} from 'expo';
import {Foundation,Ionicons} from '@expo/vector-icons';
import StaggCard from './StaggCard';
import registerForNotifications from '../services/push_notifications';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = (0.25 * SCREEN_WIDTH);
const SWIPE_OUT_DURATION = 100;
const MIN_QUEUE_LENGTH = 10;

class Stagg extends Component {
    /*static defaultProps = {
        onSwipeRight: (id) => {this.props.startLike(id)},
        onSwipeLeft:  (id) => {this.props.startDislike(id)}
    }*/
    constructor(props) {
        super(props);

        const position = new Animated.ValueXY();

        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event,gesture) => {
                position.setValue({x:gesture.dx,y:gesture.dy})
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                //return true if user is swiping, return false if it's a single click
                //console.log('gestureState: ',{...gestureState});
                return !(Math.abs(gestureState.dx) <= 0.5 && Math.abs(gestureState.dy) <= 0.5) 
            },
            onPanResponderRelease: (event,gesture) => {
                if(gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
            }
        })

        this.locationTracker;

        this.position = position;
        this.state = {panResponder, position,index:0, status: null}
    }
/*
    componentWillReceiveProps(nextProps) {
        console.log('receiveProps');
        // If we receive a new list, we should reset the index back to 0.
        if(nextProps.prospectiveList !== this.props.prospectiveList) {
            console.log('receiveProps reset index');
            this.setState({index:0});
        }
        
    }
*/
    componentDidMount() {
        console.log('queue length: ',(this.state.index + 1 + MIN_QUEUE_LENGTH));
        console.log('prospective length: ',this.props.prospectiveList.length);
        if(this.props.prospectiveList.length < 1) {
            this.props.startNewQueue(false);
        }

        // Ask user for notifications permissions
        registerForNotifications(this.props.id);
        
        // Listen for notifications
        Notifications.addListener((notification) => {
            console.log('notification: ',notification);
            const { data: { message }, origin } = notification;
            if(origin === 'received' && message) {

                Alert.alert(
                    'New Notification',
                    message,
                    [{text: 'ok' }]
                )
            } 
        })
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        // The next time the component changes, add a spring affect to it.
        LayoutAnimation.spring();
    }

    componentWillMount() {
        // Permissions function keeps track of whether the user accepted the 
        // permissions or not. It it has not asked, it will prompt the user.
        Permissions.getAsync(Permissions.LOCATION)
            .then(({ status}) => {
                console.log('status: ',status);
                this.setState(() => ({status}))
                if(status === 'granted') {
                    return this.trackLocation()
                }
            })
            .catch((error) => {
                console.warn('Error getting Location permission: ',error)
                this.setState(() => ({status: 'undetermined'}))
            })
    }

    ComponentWillUnmount = () => this.locationTracker.remove();

    askPermission = () => {
        Permissions.askAsync(Permissions.LOCATION)
        .then(({status}) => {
            if(status === 'granted') {
                return this.setLocation();
            }

            this.setState(() => ({status}))
        })
        .catch((error) => console.warn('error asking Location permission:', error))

    }

    trackLocation = () => {
        this.locationTracker = Location.watchPositionAsync({
            // Need to look at docs to determine parameter values
            enableHighAccuracy: false,
            timeInterval: 1000 * 60 * 15,
            distanceInterval: 1000
        }, ({coords}) => {
            //console.log('coords: ',coords);
            this.props.startSetCoords((coords));
            //this.setState({status:'granted'})
        })
    }

    forceSwipe(direction) {
        // same as spring, but the animation plays out slightly differently. Timing is more linear while
        // spring is more bouncy.
        Animated.timing(this.state.position, {
            toValue: { x:direction==='right'?SCREEN_WIDTH+150:-SCREEN_WIDTH-150, y:0},
            duration: SWIPE_OUT_DURATION
            // the start function can accept a callback.
        }).start(async () => this.onSwipeComplete(direction));
    }
    onSwipeComplete(direction) {
        // data is the array the comes in through props. It is the list of cards
        const {onSwipeLeft,onSwipeRight,prospectiveList} = this.props;
        const item = prospectiveList[this.state.index]

        direction === 'right' ? this.onSwipeRight(item.id) : this.onSwipeLeft(item.id);
        // Reset the card's position to be in default onscreen position
        this.state.position.setValue({x:0,y:0});
        
        console.log('prospectiveList length: ', this.props.prospectiveList.length);
        console.log('index: ', (this.state.index + 1));
        
        // Increment the state by one
        //this.setState({ index: this.state.index + 1 });

        if(this.props.prospectiveList.length === 0) {
            this.props.startNewQueue(true);
            //this.setState({index:0});
        }
    } 
    onSwipeRight = (id) => this.props.startLike(id);
    onSwipeLeft  = (id) => this.props.startDislike(id);
    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: {x:0, y:0}
        }).start();
    }
    getCardStyle() {
        const {position} = this.state;
        // position contains references to x and y position at any given time
        // interpolate allows us to translate one scale to another.
        const rotate = position.x.interpolate({
            // inputRange - the horizontal distance that the card has been dragged left or right.
            // It is not good to hard code these values as the device size can be different.
            // Instead, we should tie the deminsions to the width of the screen.
            // We can also decrease the rotation by increasing the scale of inputRange or decreasing
            // the outputRange
            inputRange: [-SCREEN_WIDTH,0,SCREEN_WIDTH],
            outputRange: ['-60deg','0deg','60deg']
        });
        return {
            ...this.state.position.getLayout(),
            transform: [{rotate}]
        }
    }

    renderCard = (prospect,cacheImages) => {
        // Instead of rendering a card, I could render an ImageBackground
        //console.log('stagg ancillary: ',prospect.ancillaryPics);

        return (
            //<Text>{prospect.name}</Text>
            
            <StaggCard 
                key={prospect.id}
                id={prospect.id}
                pics={[prospect.profilePic,...prospect.ancillaryPics]}
                //pics={[prospect.profilePic]}
                name={prospect.name}
                work={prospect.work}
                school={prospect.school}
                description={prospect.description}
                distanceApart={prospect.distanceApart}
                cacheImages={!!cacheImages}
                navigation={this.props.navigation}
            />
            
        )
    }

    noProspects() {
        return (
            <View style={styles.noProspects}>
                    <Ionicons 
                        name="md-sad"
                        size={100}
                        color="black"
                    />
                    <Text>There is no one new in your area.</Text>
                    <Text>Try again later.</Text>

                    <TouchableOpacity 
                        onPress={() => this.props.startNewQueue(true)} 
                        style={styles.noProspectsButton}
                    >
                        <MyAppText style={styles.noProspectsText}>
                            Search Again
                        </MyAppText>
                    </TouchableOpacity>
            </View>
        )
    }

    renderGranted = () => {
        if (this.props.prospectiveList.length === 0) {
            if(this.props.isMatchLoading) {
                return <Spinner />
            } else {
                return this.noProspects();
            }
        }
        return (
            <Animated.View style={styles.staggContainer}>
                {this.props.prospectiveList.map((prospect,i) => {
                    console.log('i',i);
                    console.log('state index: ',this.state.index);
                    if(i < this.state.index) { return null }
                    else if (i === this.state.index) {
                        return (
                            <Animated.View 
                                key={prospect.id} 
                                style={[this.getCardStyle(),styles.cardStyle]}
                                {...this.state.panResponder.panHandlers}
                            >
                                {this.renderCard(prospect,true)}
                            </Animated.View>
                        )
                    } else {
                        return (
                            <Animated.View
                                key={prospect.id}
                                style={[styles.cardStyle]}
                                //{...this.state.panResponder.panHandlers}
                            >
                                {this.renderCard(prospect)}
                            </Animated.View>
                        )
                    }
                }).reverse()}
            </Animated.View>
            )
    }

    renderContent() {
        if(this.state.status === 'granted'){
            return this.renderGranted();
        } else if(this.state.status === 'denied') {
            return (
                <View style={styles.center}>
                    <Foundation name='alert' size={50}/>
                    <Text style={{textAlign:'center'}}>
                        You denied your location. You can fix this by visiting your settings and enabling location services for this app.
                    </Text>
                </View>
            )
        } else if (this.state.status === 'undetermined') {
            return (
                <View style={styles.center}>
                    <Foundation name='alert' size={50} />
                    <Text>
                        You need to enable location services for this app.
                    </Text>
                    <TouchableOpacity onPress={this.askPermission} style={styles.button}>
                        <Text style={styles.buttonText}>
                            Enable
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (this.state.status === null) {
            return (
                <Spinner />
            )
        }
    }

    render() {
        // Implement Loading here
        //console.log('isMatchLoading: ',this.props.isMatchLoading);
        //console.log('status: ',this.state.status);
        if(this.props.isMatchLoading) {
            return <Spinner />
        } else {
            return this.renderContent();
        }
    }
}

const styles = StyleSheet.create({
    staggContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    cardStyle: {
        width: SCREEN_WIDTH,
        // absolute position does not seem to work as a child of ScrollView
        position: 'absolute',
        elevation:4
    },
    undeterminedContainer: {
        flex: 1,
        justifyContent: 'space-between'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight:30
    },
    button: {
        padding: 10,
        backgroundColor: 'purple',
        alignSelf: 'center',
        borderRadius: 5,
        margin: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 20
    },
    noProspects: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noProspectsButton: {
        width: SCREEN_WIDTH * 0.7,
        //height: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#007aff',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10
    },
    noProspectsText: {
        alignSelf: 'center',
        color: '#007aff',
        fontSize: 16,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
    },
    prospectText: {
        color: '#fff',
        fontSize: 32,
        marginLeft: 20,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    prospectView: {
        justifyContent: 'center',
        alignItems:'center'
    },
    prospectImage: {
        height:(SCREEN_HEIGHT*.83),
        justifyContent: 'flex-end',
        alignItems:'flex-start',
        backgroundColor: 'transparent',
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.5,
        // just like border radius, but with shadows
        shadowRadius: 2,
        // elevation makes items appear to jump out
        elevation: 1,
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        startLike: (id) => dispatch(startLike(id)),
        startDislike: (id) => dispatch(startDislike(id)),
        startMatch: (id) => dispatch(startMatch(id)),
        startNewQueue: (boo) => dispatch(startNewQueue(boo)),
        startSetCoords: (coords) => dispatch(startSetCoords(coords)),
        matchLoading: (matchLoading) => dispatch(matchLoading(matchLoading))
    }
}

const mapStateToProps = (state,ownProps) => {
    //console.log('state at stagg -- ',state);
    return {
        prospectiveList: state.matchListReducer.queue,
        likeList: state.matchListReducer.likeList,
        dislikeList: state.matchListReducer.dislikeList,
        matchList: state.matchListReducer.matches,
        isMatchLoading: state.authReducer.matchLoading,
        id: state.authReducer.uid
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Stagg);
