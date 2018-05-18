import React, {Component} from 'react';
import firebase from 'firebase';
import {View,Text} from 'react-native';
import {connect} from 'react-redux';
import {Card,CardSection,Button,Spinner,Input, MyAppText} from './common';
import Expo from 'expo';
import {
    startEmailLogin,
    startFacebookLogin,
    changeEmail,
    changePassword} from '../actions/auth';
import { SECONDARY_COLOR, PRIMARY_COLOR, BACKGROUND_COLOR } from '../variables';
//import Input from './Input';


class LoginForm extends Component {

    renderButton() {
        if(this.props.isLoading) {
            return <Spinner size="small" />
        } else {
            return (
                <Button 
                    onPress={() => this.props.startEmailLogin(this.props.email,this.props.password)}
                >Log in</Button>
            )
        }
    }
    renderButtonFB() {
        if(this.props.isLoading) {
            return <Spinner size="small" />
        } else {
            return (
                <Button 
                    onPress={this.props.startFacebookLogin}
                    buttonStyleOverride={styles.buttonFBStyle}
                    textStyleOverride={styles.buttonTextFBStyle}
                >Log in with Facebook</Button>
            )
        }
    }
    render() {
        return (
            <View style={styles.loginContainer}>
                {/*
                <CardSection>
                    <Input 
                        placeholder="user@gmail.com"
                        value={this.props.email}
                        label="Email"
                        onChangeText={email => this.props.changeEmail(email)}
                    />
                </CardSection>

                <CardSection>
                    <Input 
                        placeholder="password"
                        value={this.props.password}
                        label="Password"
                        onChangeText={password => this.props.changePassword(password)}
                        secureTextEntry={true}
                    />
                </CardSection>
                */}
                <View style={styles.content}>
                
                    <Text style={styles.title}>Manhattan Stag</Text>
                    <Text style={styles.errorTextStyle}>
                        {this.props.error}
                    </Text>
                    {/*
                    <CardSection>
                        {this.renderButton()}
                    </CardSection>
                    */}
                    <CardSection style={{borderBottomWidth: 0}}>
                        {this.renderButtonFB()}
                    </CardSection>
                </View>
                <View style={{flex:1}}/>
            </View>
        )
    }
}

const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    buttonFBStyle: {
        backgroundColor: '#4C69BA'
    },
    buttonTextFBStyle: {
        color: "white"
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR
    },
    title: {
        fontSize: 32,
        color: PRIMARY_COLOR
    },
    content: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    }
}

const mapStateToProps = (state,ownProps) => {
    //console.log('state ---',state);
    return {
    email: state.authReducer.email,
    password: state.authReducer.password,
    error: state.authReducer.error,
    isLoading: state.authReducer.isLoading
}
}

const mapDispatchToProps = (dispatch) => ({
    startEmailLogin: (email,password) => dispatch(startEmailLogin(email,password)),
    startFacebookLogin: () => dispatch(startFacebookLogin()),
    changeEmail: (email) => dispatch(changeEmail(email)),
    changePassword: (password) => dispatch(changePassword(password))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);