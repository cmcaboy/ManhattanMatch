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
// import { startLogout } from '../actions/auth';
// import {firebase} from '../firebase';
import expandArrayToFive from '../selectors/expandArrayToFive';
import PhotoSelector from './PhotoSelector';
import { PRIMARY_COLOR } from '../variables';
import {Query, Mutation} from 'react-apollo';
import GET_ID from '../queries/getId';
import gql from 'graphql-tag';

const GET_PROFILE = gql`
  query user($id: ID!) {
    user(id: $id) {
        id
        pics
        name
        age
        school
        work
        description
    }
  }
`

const SET_NAME = gql`
mutation editUser($id: ID!, $name: String ) {
  editUser(id: $id, name: $name) {
    	id
      name
  }
}
`
const SET_AGE = gql`
mutation editUser($id: ID!, $age: Int ) {
  editUser(id: $id, age: $age) {
    	id
      age
  }
}
`
const SET_WORK = gql`
mutation editUser($id: ID!, $work: String ) {
  editUser(id: $id, work: $work) {
    	id
      work
  }
}
`
const SET_SCHOOL = gql`
mutation editUser($id: ID!, $school: String ) {
  editUser(id: $id, school: $school) {
    	id
      school
  }
}
`
const SET_DESCRIPTION = gql`
mutation editUser($id: ID!, $description: String ) {
  editUser(id: $id, description: $description) {
    	id
      description
  }
}
`
const SET_PICS = gql`
mutation editUser($id: ID!, $pics: [String] ) {
  editUser(id: $id, pics: $pics) {
    	id
      pics
  }
}
`

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
    // this.props.startRemoveProfile();
    // this.props.startLogout();
  }

  renderContent({name,age,school,work,description,pics = [],id}) {
    console.log('ancillaryPics: ',this.props.ancillaryPics);
    return (
      <ScrollView contentContainerStyle={styles.settingsContainer}>
      <KeyboardAvoidingView
        behavior={'position'}>
          <Card style={{padding:2}}>
            <Mutation mutation={SET_PICS}>
            {(changePics, { data }) => {
              const startChangePics = (newPics) => changePics({variables: {id, pics:newPics}})
              return (
                <PhotoSelector 
                  urlList={pics}
                  startChangePics={startChangePics}
                  //switchPicPosition={(a,b) => this.switchPicPosition(a,b)}
                  //pickImage={this.pickImage}
                />
              )}}
            </Mutation>
          </Card>
          <Card style={{padding:0}}>
          <Mutation mutation={SET_NAME}>
            {(changeName, { data }) => {
              const startChangeName = (newName) => changeName({variables: {id, name:newName}})
              return (
                  <CondInput 
                    field="Name"
                    value={name}
                    updateValue={startChangeName}
                  />
              )}
            }
          </Mutation> 
          <Mutation mutation={SET_AGE}>
          {(changeAge, { data }) => {
            const startChangeAge = (newAge) => changeAge({variables: {id, age:newAge}})
            return (
            <CondInput 
              field="Age"
              value={age}
              updateValue={startChangeAge}
            />
            )}}
          </Mutation>
            {/*
            <CondInput 
              field="Gender"
              value={this.props.gender}
              updateValue={this.props.startChangeGender}
            />
            */}
            <Mutation mutation={SET_SCHOOL}>
            {(changeSchool, { data }) => {
              const startChangeSchool = (newSchool) => changeSchool({variables: {id, school:newSchool}})
              return (
                <CondInput 
                  field="Education"
                  value={school}
                  updateValue={startChangeSchool}
                />
              )}}
            </Mutation>
            <Mutation mutation={SET_WORK}>
            {(changeWork, { data }) => {
              const startChangeWork = (newWork) => changeWork({variables: {id, work:newWork}})
              return (
                <CondInput 
                  field="Work"
                  value={work}
                  updateValue={startChangeWork}
                />
              )}}
              </Mutation>
              <Mutation mutation={SET_DESCRIPTION}>
              {(changeDescription, { data }) => {
                const startChangeDescription = (newDescription) => changeDescription({variables: {id, description:newDescription}})
                return (  
                  <CondInput 
                    field="Description"
                    value={description}
                    updateValue={startChangeDescription}
                    multiline={true}
                  />
                )}}
              </Mutation>
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

  render() {
    return (
      <Query query={GET_ID}>
        {({loading, error, data}) => {
          console.log('local data: ',data);
          console.log('local error: ',error);
          console.log('local loading: ',loading);
          if(loading) return <Text>Loading...</Text>
          if(error) return <Text>Error! {error.message}</Text>
          const { id } = data.user;
          return (
            <Query query={GET_PROFILE} variables={{id}}>
              {({loading, error, data}) => {
                console.log('data: ',data);
                console.log('error: ',error);
                console.log('loading: ',loading);
                if(loading) return <Text>Loading...</Text>
                if(error) return <Text>Error! {error.message}</Text>
                return this.renderContent(data.user);
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

// const mapDispatchToProps = (dispatch) => {
//     return {
//         startChangeAge: (age) => dispatch(startChangeAge(age)),
//         startChangeGender: (gender) => dispatch(startChangeGender(gender)),
//         startProfilePicture: (profilePic) => dispatch(startProfilePicture(profilePic)),
//         startChangeAncillaryPictures: (urlList) => dispatch(startChangeAncillaryPictures(urlList)),
//         startChangeName: (name) => dispatch(startChangeName(name)),
//         startChangeSchool: (school) => dispatch(startChangeSchool(school)),
//         startChangeWork: (work) => dispatch(startChangeWork(work)),
//         startRemoveProfile: () => dispatch(startRemoveProfile()),
//         startLogout: () => dispatch(startLogout()),
//         startChangeDescription: (description) => dispatch(startChangeDescription(description))
//     }
// }

// const mapStateToProps = (state,ownProps) => {
//   //console.log('state: ',state);
//     return {
//         profilePic: state.profileReducer.profilePic,
//         name: state.profileReducer.name,
//         work: state.profileReducer.work,
//         school: state.profileReducer.school,
//         description: state.profileReducer.description,
//         gender: state.profileReducer.gender,
//         age: state.profileReducer.age,
//         ancillaryPics: expandArrayToFive(state.profileReducer.ancillaryPics)
//     }
// }

export default EditProfile;
