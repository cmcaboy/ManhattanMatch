import React,{Component} from 'react';
import {Text,View,Slider,Switch,StyleSheet,Dimensions} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {Card,Button} from './common';
import { PRIMARY_COLOR } from '../variables';
import { db } from '../firebase';
import { testFemale, testMale } from '../tests/testUser';
import uuid from 'uuid';
import gql from 'graphql-tag';
import GET_ID from '../queries/getId';
import { Query, Mutation } from 'react-apollo';

const SLIDER_WIDTH = Dimensions.get('window').width * 0.87;

const GET_SETTINGS = gql`
query user($id: ID!) {
  user(id: $id) {
      minAgePreference
      maxAgePreference
      distance
      sendNotifications
  }
}
`;

const GET_AGE_PREFERENCE = gql`
query {
  user @client {
      settings {
        minAgePreference
        maxAgePreference
      }
  }
}
`;

// last left off
const SET_AGE_PREFERENCE = gql`
mutation updateAgePreference($id: ID!, $minAge: Int!,$maxAge: Int!) {
  updateAgePreference(id: $id, minAge: $minAge, maxAge: $maxAge) @client {
    id
    settings {
      minAgePreference
      maxAgePreference
    }
  }
}
`;

const isBoolean = val => 'boolean' === typeof val;

class EditSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ageValues: [18,24],
      distance: 15,
      sendNotifications: true,
    } 
  }

  static navigationOptions = ({navigation}) => ({
    title: `Settings`,
    headerRight: (<View></View>),
    headerTitleStyle: 
        {
            alignSelf: 'center',
            textAlign: 'center',
            fontWeight:'normal',
            fontSize: 22,
            color: PRIMARY_COLOR
        }
})
    
  notificationChange = () => {
    this.setState((prevState) => ({sendNotifications:!prevState.sendNotifications}))
    console.log(this.state.sendNotifications);
  }

  testCases = () => {
    const res = [...Array(10)].map(() => {
      const uid = uuid();
      db.collection(`users`).doc(`${uid}`).set({
        ...testMale,
        uid
      })
      .then(() => console.log(`User ${uid} added.`))
      .catch(() => console.log(`User ${uid} could not be added.`))
    })
  }

  renderContent(user) {
    console.log('user: ',user);
    // this.setState({
    //   ageValues: [
    //     !!user.minAgePreference? user.minAgePreference : 18,
    //     !!user.maxAgePreference? user.maxAgePreference : 24
    //   ],
    //   distance: !!user.distance? user.distance : 15,
    //   //sendNotifications: isBoolean(user.sendNotifications)? user.sendNotifications : true
    // })
    const {ageValues,distance,sendNotifications} = this.state;
  return (
    <View style={styles.containerStyle}>
    <Card>
      <Query query={GET_AGE_PREFERENCE}>
        {({loading, error, data}) => {
          console.log('data: ',data);
          console.log('error: ',error);
          console.log('loading: ',loading);
          if(loading) return <Text>Loading...</Text>
          if(error) return <Text>Error! {error.message}</Text>

          const { minAgePreference, maxAgePreference } = data.user.settings;
          console.log('minAge: ',minAgePreference);
          console.log('maxAge: ',maxAgePreference);

          return (
            <View style={styles.sliderContainer}>
              <View style={styles.titleSlider}>
                <Text>Age Preference </Text>
                <Text>{minAgePreference} - {maxAgePreference}</Text>
              </View>
              <View style={{paddingTop:20,width:SLIDER_WIDTH}}>
                <Mutation mutation={SET_AGE_PREFERENCE}>
                  {(updateAgePreference, { data }) => {
                    console.log('data: ',data);
                    return (
                      <MultiSlider 
                        containerStyle={{height: 12}}
                        markerOffsetX={10}
                        sliderLength={SLIDER_WIDTH}
                        markerStyle={styles.markerStyle}
                        step={1}
                        values={[minAgePreference,maxAgePreference]}
                        max={45}
                        min={18}
                        onValuesChange={(ageValues) => updateAgePreference({variables: {minAge: ageValues[0], maxAge:ageValues[1]}})}
                        onValuesChangeFinish={(ageValues) => console.log(ageValues)}
                    />
                    )
                  }
                }
                </Mutation>
              </View>
            </View>
          )
        }}
      </Query>
        
    </Card>
    <Card>
    <View style={styles.sliderContainer}>
      <View style={styles.titleSlider}>
        <Text>Search Distance</Text>
        <Text>{distance}</Text>
      </View>
      <View style={{width:SLIDER_WIDTH}}>
    <Slider 
      step={1}
      value={distance}
      maximumValue={50}
      minimumValue={0}
      disabled={false}
      onValueChange={(distance) => this.setState({distance:distance})}
      onSlidingComplete={(distance) => console.log(distance)}
    />
    </View>
    </View>
    </Card>
    <Card>
    <View style={styles.titleSlider}>
    <Text>Send Notifications</Text> 
      <Switch 
        onValueChange={() => this.setState((prevState) => ({sendNotifications:!prevState.sendNotifications}) )}
        value={this.state.sendNotifications}
      />
    </View>
    </Card>
    <Card style={{display: 'none'}}>
      <Button 
        onPress={() => this.testCases()}
      >Insert Test cases</Button>
    </Card>
  </View>
  )}

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

          console.log('id: ',id);

          return this.renderContent(id);

        }} 
      </Query>
    )
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    display:'flex',
    justifyContent: 'flex-start',
    padding: 10,
  },
  titleSlider: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  sliderContainer: {
    minHeight: 50,
    justifyContent: 'flex-start',
  },
  markerStyle: {
    height: 30,
    width: 30,
    borderRadius: 30
  }
})

// const mapDispatchToProps = (dispatch) => {
//   return {
//     startChangeAgePreference: (age) => dispatch(startChangeAgePreference(age)),
//     startChangeDistance: (distance) => dispatch(startChangeDistance(distance)),
//     startChangeNotification: (notification) => dispatch(startChangeNotification(notification))
//   }
// }

// const mapStateToProps = (state,ownProps) => {
//   //console.log('state -- ',state)
//   return {
//     agePreference: state.settingsReducer.agePreference,
//     distance: state.settingsReducer.distance,
//     sendNotifications: state.settingsReducer.sendNotifications
//   }
// }

export default EditSettings;