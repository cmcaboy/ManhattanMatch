import React from 'react';
// import { ApolloClient } from 'apollo-client';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { ApolloProvider, graphql } from 'react-apollo';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
import Settings from './src/components/Settings';
import EditSettings from './src/components/EditSettings';
import EditProfile from './src/components/EditProfile';

import Authentication from './src/components/Authentication';
import StaggContainer from './src/components/StaggContainer';

const cache = new InMemoryCache();

export const resolvers = {
  Mutation: {
    updateAgePreferenceLocal: (_, { minAge, maxAge }, { cache, getCacheKey }) => {

      const query = gql`
        query getAgePreferenceLocal {
          user @client {
              id
              __typename
              minAgePreference
              maxAgePreference
          }
        }
      `
      const previous = cache.readQuery({query});

      const data = {
        user: {
          ...previous.user,
          //id: previous.user.id,
          minAgePreference: minAge,
          maxAgePreference: maxAge
        }
      };
      
      cache.writeQuery({query,data});
      return null;
    },
    updateDistanceLocal: (_, { id, distance }, { cache, getCacheKey }) => {

      const query = gql`
        query getDistanceLocal {
          user @client {
              id
              __typename
              distance
          }
        }
      `
      const previous = cache.readQuery({query});

      const data = {
        user: {
          ...previous.user,
          distance: distance
        }
      };

      console.log('previous: ',previous);
      console.log('data: ',data);
      
      cache.writeQuery({query,data})
      return null;
    },
    updateSendNotificationsLocal: (_, { id, sendNotifications }, { cache, getCacheKey }) => {

      const query = gql`
        query getSendNotificationsLocal {
          user @client {
              id
              __typename
              sendNotifications
          }
        }
      `
      const previous = cache.readQuery({query});

      const data = {
        user: {
          ...previous.user,
          sendNotifications: sendNotifications
        }
      };

      console.log('previous: ',previous);
      console.log('data: ',data);
      
      cache.writeQuery({query,data})
      return null;
    },
  }
}

const defaults = {
    user: {
      __typename: 'user',
      id: 13,
      minAgePreference: 18,
      maxAgePreference: 25,
      distance: 15,
      sendNotifications: true
    }
};

const typeDefs = `
  type user {
    id: Int!
  }

  type Mutation {
    alterId(id: Int!): user
  }

  type Query {
    visibilityFilter: String
    getUser: user
  }
  `

const stateLink = withClientState({
  cache,
  defaults,
  resolvers,
//  typeDefs
});

 const client = new ApolloClient({
   link: ApolloLink.from([
     stateLink,
     new HttpLink({uri: 'https://us-central1-manhattanmatch-9f9fe.cloudfunctions.net/graphql/graphql'})
   ]),
   cache
 });


export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
          {/*<Authentication />*/}
          <StaggContainer />
      </ApolloProvider>
    );
  }
}

