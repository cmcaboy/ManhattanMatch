import React, {Component} from 'react';
import {View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  TextInput,
  ImageEditor,
  Image,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import {ImagePicker} from 'expo';
import {
  CirclePicture,
  Card,
  CardSection,
  Button,
  Spinner,
  CondInput
} from './common';
import {connect} from 'react-redux';
import {
  startChangeAge,
  startProfilePicture,
  startChangeAncillaryPictures,
  startChangeName,
  startChangeSchool,
  startChangeWork,
  startChangeDescription,
  startRemoveProfile
} from '../actions/profile';
import { startLogout } from '../actions/auth';
import {firebase} from '../firebase';

import expandArrayToFive from '../selectors/expandArrayToFive';
import PhotoSelector from './PhotoSelector';
import { PRIMARY_COLOR } from '../variables';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  static navigationOptions = ({navigation}) => ({
    title: `Edit Profile`,
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

  

  removeAccount = () => {
    console.log('Remove Account function');
    this.props.startRemoveProfile();
    this.props.startLogout();

  }

  render() {
    console.log('ancillaryPics: ',this.props.ancillaryPics);
    return (
      <ScrollView contentContainerStyle={styles.settingsContainer}>
      <KeyboardAvoidingView
        behavior={'position'}>
          <Card style={{padding:2}}>
            <PhotoSelector 
              urlList={[this.props.profilePic,...this.props.ancillaryPics]}
              //switchPicPosition={(a,b) => this.switchPicPosition(a,b)}
              //pickImage={this.pickImage}
            />
          </Card>
          <Card style={{padding:0}}>
            <CondInput 
              field="Name"
              value={this.props.name}
              updateValue={this.props.startChangeName}
            />
            <CondInput 
              field="Age"
              value={this.props.age}
              updateValue={this.props.startChangeAge}
            />
            {/*
            <CondInput 
              field="Gender"
              value={this.props.gender}
              updateValue={this.props.startChangeGender}
            />
            */}
            <CondInput 
              field="Education"
              value={this.props.school}
              updateValue={this.props.startChangeSchool}
            />
            <CondInput 
              field="Work"
              value={this.props.work}
              updateValue={this.props.startChangeWork}
            />
            <CondInput 
              field="Description"
              value={this.props.description}
              updateValue={this.props.startChangeDescription}
              multiline={true}
            />
          </Card>
          {/*
            <Card>
              <Button onPress={this.removeAccount}>Remove Account</Button>
            </Card>  
          */}
          </KeyboardAvoidingView>
        </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    settingsContainer: {
        //justifyContent: 'space-between',
        //alignItems: 'center',
        padding: 10
    },
    textInputStyle: {
      height: 40,
      width: 100,
      borderColor: 'gray',
      borderWidth: 1
    },
    cardContainer: {
      width: 300,
      height: 400
    },
    cardSection: {
      height:40,
    },
    editView: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    img: {
      width: 150,
      height: 150,
      resizeMode: 'contain',
      backgroundColor: 'black'
    },
    spinner: {
      width: 150,
      height: 150
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        startChangeAge: (age) => dispatch(startChangeAge(age)),
        startChangeGender: (gender) => dispatch(startChangeGender(gender)),
        startProfilePicture: (profilePic) => dispatch(startProfilePicture(profilePic)),
        startChangeAncillaryPictures: (urlList) => dispatch(startChangeAncillaryPictures(urlList)),
        startChangeName: (name) => dispatch(startChangeName(name)),
        startChangeSchool: (school) => dispatch(startChangeSchool(school)),
        startChangeWork: (work) => dispatch(startChangeWork(work)),
        startRemoveProfile: () => dispatch(startRemoveProfile()),
        startLogout: () => dispatch(startLogout()),
        startChangeDescription: (description) => dispatch(startChangeDescription(description))
    }
}

const mapStateToProps = (state,ownProps) => {
  //console.log('state: ',state);
    return {
        profilePic: state.profileReducer.profilePic,
        name: state.profileReducer.name,
        work: state.profileReducer.work,
        school: state.profileReducer.school,
        description: state.profileReducer.description,
        gender: state.profileReducer.gender,
        age: state.profileReducer.age,
        ancillaryPics: expandArrayToFive(state.profileReducer.ancillaryPics)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(EditProfile);
