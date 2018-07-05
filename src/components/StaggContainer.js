import {Text} from 'react-native';
import {Spinner} from './common';
import React,{Component} from 'react';
import { Query, Mutation } from 'react-apollo';
import {GET_QUEUE,MORE_QUEUE} from '../apollo/queries';
import {GET_ID} from '../apollo/local/queries';
import {SET_COORDS,LIKE,DISLIKE,SET_PUSH_TOKEN} from '../apollo/mutations';
import Stagg from './Stagg';
import gql from 'graphql-tag';

class StaggContainer extends Component {
    render() {
        return (
            <Query query={GET_ID}>
                {({loading, error, data, fetchMore }) => {
                //console.log('local data stagg: ',data);
                //console.log('local error stagg: ',error);
                //console.log('local loading stagg: ',loading);
                if(loading) return <Spinner />
                if(error) return <Text>Error! {error.message}</Text>
                const { id } = data.user;
                return (
                    <Query query={GET_QUEUE} variables={{id}}>
                    {({loading, error, data}) => {
                        // console.log('data stagg: ',data);
                        // console.log('error stagg: ',error);
                        // console.log('loading stagg: ',loading);
                        if(loading) return <Spinner />
                        if(error) return <Text>Error! {error.message}</Text>
                        const fetchMoreQueue = () => fetchMore({
                            query: MORE_QUEUE,
                            variables: {id, cursor: data.user.queue.cursor},
                            updateQuery: (prev,fetchMoreQueue) => {
                                console.log('fetchMore queue');
                                console.log('new queue: ',queue);

                                const newQueue = fetchMoreQueue.moreQueue.list;
                                const newCursor = fetchMoreQueue.moreQueue.cursor;

                                const result = {
                                    user: {
                                        ...prev.user,
                                        queue: {
                                            list: [...prev.user.queue.list,...newQueue],
                                            cursor: newCursor,
                                        }
                                    }
                                }
                                console.log('moreQueue New Result: ', result);
                                return result;
                            }
                        })
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
                                        const startDislikeUser = (dislikedId) =>    dislikeUser({variables: {id, dislikedId}});
                                        const startLikeUser = (likedId) => likeUser({
                                            variables: {id, likedId},
                                            //optimisticResponse: {},
                                            // We can add on an update and optimistic response to this if we want to 
                                            // check for a match
                                            update: (store,data) => console.log('likeUser response data: ',data),
                                        });
                                            return <Stagg 
                                                id={id}
                                                queue={data.user.queue.list} 
                                                likeUser={startLikeUser}
                                                dislikeUser={startDislikeUser}
                                                startSetCoords={startSetCoords}
                                                startSetPushToken={startSetPushToken}
                                                navigation={this.props.navigation}
                                                fetchMoreQueue={fetchMoreQueue}
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
