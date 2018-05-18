import React,{Component} from 'react';
import {Text,View,Slider,Switch,StyleSheet,Dimensions} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {connect} from 'react-redux';
import {
  startChangeNotification,
  startChangeAgePreference,
  startChangeDistance
} from '../actions/settings';
import {Card,Button} from './common';
import { PRIMARY_COLOR } from '../variables';
import { db } from '../firebase';
import { testFemale, testMale } from '../tests/testUser';
import uuid from 'uuid';

const SLIDER_WIDTH = Dimensions.get('window').width * 0.87;

class EditSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ageValues: this.props.agePreference,
      distance: this.props.distance,
      sendNotifications: this.props.sendNotifications
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
    startChangeNotification(this.state.sendNotifications);
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

  render() {
    const {ageValues,distance,sendNotifications} = this.state;
  return (
    <View style={styles.containerStyle}>
    <Card>
    
    <View style={styles.sliderContainer}>
      <View style={styles.titleSlider}>
        <Text>Age Preference </Text>
        <Text>{ageValues[0]} - {ageValues[1]}</Text>
      </View>
      <View style={{paddingTop:20,width:SLIDER_WIDTH}}>
        <MultiSlider 
          containerStyle={{height: 12}}
          markerOffsetX={10}
          sliderLength={SLIDER_WIDTH}
          markerStyle={styles.markerStyle}
          step={1}
          values={[ageValues[0],ageValues[1]]}
          max={45}
          min={18}
          onValuesChange={(ageValues) => this.setState({ageValues:ageValues})}
          onValuesChangeFinish={(ageValues) => this.props.startChangeAgePreference(ageValues)}
        />
      </View>
    </View>
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
      onSlidingComplete={(distance) => this.props.startChangeDistance(distance)}
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

const mapDispatchToProps = (dispatch) => {
  return {
    startChangeAgePreference: (age) => dispatch(startChangeAgePreference(age)),
    startChangeDistance: (distance) => dispatch(startChangeDistance(distance)),
    startChangeNotification: (notification) => dispatch(startChangeNotification(notification))
  }
}

const mapStateToProps = (state,ownProps) => {
  //console.log('state -- ',state)
  return {
    agePreference: state.settingsReducer.agePreference,
    distance: state.settingsReducer.distance,
    sendNotifications: state.settingsReducer.sendNotifications
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(EditSettings);