import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Font } from 'expo';
import {Header, Button, Spinner, CardSection} from './common';
import LoginForm from './LoginForm';
import Settings from './Settings';
import { Constants } from 'expo';
import MainNavigator from '../navigator';
import { firebase } from '../firebase';
import { login, logout, resetStore } from '../actions/auth';
import { connect } from 'react-redux';
import { standard_font } from '../styles';
import { STATUS_BAR_COLOR } from '../variables';

function UdaciStatusBar ({backgroundColor, ...props}) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

class Authentication extends React.Component {

  state = { 
    fontLoading: true,
    loggedIn: false
  }
  
  componentWillMount() {
    // Firebase authentication details gathered from my firebase account.
    firebase.auth().onAuthStateChanged((user) => {
      console.log('user: ',user);
      if(user) {
        //this.props.login(user.uid);

        this.setState({loggedIn: true});
        //console.log('firebase auth: ',firebase.auth());
        //console.log('firebase uid: ',firebase.auth().currentUser.uid);

        // We can use the firebase.auth().currentUSer.uid for our unique identifier.
      } else {
        this.setState({loggedIn: false});
        
        //this.setState({loggedIn: false});
      }
    })
  }

  async componentDidMount() {
    await Font.loadAsync({
      'oxygen-regular': require('../../assets/fonts/Oxygen-Regular.ttf'),
      //'oxygen-bold'   : require('./assets/fonts/Oxygen-Bold.ttf'),
      //'oxygen-light'   : require('./assets/fonts/Oxygen-Light.ttf'),
    })
    this.setState({fontLoading:false})
  }

  renderContent() {
    // use a switch statement to render a login screen, logout screen, or a spinner
    console.log('loggedIn: ',this.state.loggedIn);
    switch(this.state.loggedIn) {
      case true:
        if(this.state.fontLoading) {
          <View style={styles.spinnerStyle}><Spinner size="large"/></View>
        } else {
          return <MainNavigator />
          //return <Settings />
        }
            //<CardSection><Button onPress={() => firebase.auth().signOut()}>Log Out</Button></CardSection>
      case false:
        return <LoginForm />
      default:
        return <View style={styles.spinnerStyle}><Spinner size="large"/></View>
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <UdaciStatusBar backgroundColor={STATUS_BAR_COLOR} barStyle="light-content" />
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  spinnerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Authentication;
