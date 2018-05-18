import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Font } from 'expo';
import {Header, Button, Spinner, CardSection} from './common';
import LoginForm from './LoginForm';
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

  state = { fontLoading: true}
  
  componentWillMount() {
    // Firebase authentication details gathered from my firebase account.
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.props.login(user.uid);

        //this.setState({loggedIn: true});
        //console.log('firebase auth: ',firebase.auth());
        //console.log('firebase uid: ',firebase.auth().currentUser.uid);

        // We can use the firebase.auth().currentUSer.uid for our unique identifier.
      } else {
        this.props.logout();
        this.props.resetStore();
        
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
    console.log('loggedIn: ',this.props.loggedIn);
    switch(this.props.loggedIn) {
      case true:
        if(this.state.fontLoading) {
          <View style={styles.spinnerStyle}><Spinner size="large"/></View>
        } else {
          return <MainNavigator />
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

const mapDispatchToProps = (dispatch) => {
  return {
      login:  (id) => dispatch(login(id)),
      logout: () => dispatch(logout()),
      resetStore: () => dispatch(resetStore()),
 }
}



const mapStateToProps = (state,ownProps) => {
  return {
      loggedIn: state.authReducer.loggedIn
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Authentication);
