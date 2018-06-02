import {Text} from 'react-native';
import {Spinner} from './common';
import React,{Component} from 'react';
import { Query, Mutation } from 'react-apollo';
import GET_ID from '../queries/getId';
import Stagg from './Stagg';
import gql from 'graphql-tag';

const GET_QUEUE = gql`
query user($id: ID!) {
    user(id: $id) {
        queue {
            id
            name
            pics
            age
            description
            work
            school
        }
    }
  }
`

const SET_COORDS = gql`
mutation editUser($id: ID!, $latitude: Float, $longtitude: Float) {
    editUser(id: $id, latitude: $latitude, longitude: $longitude) {
        id
        latitude
        longitude
    }
}
`
const SET_PUSH_TOKEN = gql`
mutation editUser($id: ID!, $token: String) {
    editUser(id: $id, token: $token) {
        id
        token
    }
}
`

const LIKE = gql`
mutation likeUser($id: ID!, $likedId: ID!) {
    likeUser(id: $id, likedId: $likedId) {
        id
        name
    }
}
`;
const DISLIKE = gql`
mutation dislikeUser($id: ID!, $dislikedId: ID!) {
    dislikeUser(id: $id, dislikedId: $dislikedId) {
        id
        name
    }
}
`;

class StaggContainer extends Component {

    render() {
        return (
            <Query query={GET_ID}>
                {({loading, error, data}) => {
                console.log('local data: ',data);
                console.log('local error: ',error);
                console.log('local loading: ',loading);
                if(loading) return <Spinner />
                if(error) return <Text>Error! {error.message}</Text>
                const { id } = data.user;
                return (
                    <Query query={GET_QUEUE} variables={{id}}>
                    {({loading, error, data}) => {
                        console.log('data: ',data);
                        console.log('error: ',error);
                        console.log('loading: ',loading);
                        if(loading) return <Spinner />
                        if(error) return <Text>Error! {error.message}</Text>
                        return <Mutation mutation={LIKE}>
                        {(likeUser) => {
                            return <Mutation mutation={DISLIKE}>
                            {(dislikeUser) => {
                                return <Mutation mutation={SET_COORDS}>
                                {(setCoords) => {
                                    return <Mutation mutation={SET_PUSH_TOKEN}>
                                    {(setPushToken) => {
                                        const startSetCoords = (lat,lon) =>         setCoords({variables: {id,lat,lon}});
                                        const startSetPushToken = (token) =>        setPushToken({variables: {id,token}});
                                        const startLikeUser = (likedId) =>          likeUser({variables: {id, likedId}});
                                        const startDislikeUser = (dislikedId) =>    dislikeUser({variables: {id, dislikedId}});
                                            return <Stagg 
                                                queue={data.user.queue} 
                                                likeUser={startLikeUser}
                                                dislikeUser={startDislikeUser}
                                                startSetCoords={startSetCoords}
                                                startSetPushToken={startSetPushToken}
                                            />
                                    }}
                                    </Mutation>
                                }}
                                </Mutation> 
                            }}
                            </Mutation>
                        }}
                        </Mutation>
                    }}
                    </Query>
                ) 
                }}
            </Query>
          )
    }
}

export default StaggContainer;
