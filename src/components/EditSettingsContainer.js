import React,{Component} from 'react';
import {Text} from 'react-native';
import { Query } from 'react-apollo';
import EditSettings from './EditSettings';
import {GET_SETTINGS} from '../apollo/queries';
import { GET_ID } from '../apollo/local/queries';

class EditSettingsContainer extends Component {
  constructor(props) {
    super(props);
  }

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
          return (
            <Query query={GET_SETTINGS} variables={{id}}>
                {({loading, error, data}) => {
                console.log('loading: ',loading);
                console.log('error: ',error);
                console.log('data: ',data);
                if(loading) return <Text>Loading...</Text>
                if(error) return <Text>Error! {error.message}</Text>
                const { minAgePreference, maxAgePreference, distance, sendNotifications } = data.user;
                    return <EditSettings 
                        id={id} 
                        minAgePreference={minAgePreference}
                        maxAgePreference={maxAgePreference}
                        distance={distance}
                        sendNotifications={sendNotifications}
                    />
                }}
            </Query>
            )

        }} 
      </Query>
    )
  }
}

export default EditSettingsContainer;