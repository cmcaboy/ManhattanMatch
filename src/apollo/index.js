import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { graphql } from 'react-apollo';
import {GRAPHQL_SERVER} from '../variables';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import {ApolloLink,split} from 'apollo-link';
import gql from 'graphql-tag';

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
    updateIdLocal: (_, { id }, { cache, getCacheKey }) => {

      const query = gql`
        query getIdLocal {
          user @client {
              id
              __typename
          }
        }
      `
      //const previous = cache.readQuery({query});
      
      const data = {
        user: {
          __typename: 'user',
          id
        }
      };
      
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
      id: 5,
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

// Initiate the cache
const cache = new InMemoryCache();  

// stateLink is the local graphql engine for state management
const stateLink = withClientState({
  cache,
  defaults,
  resolvers,
//  typeDefs
});

// We put both the state link and http link in httpLink to let the application 
// query the application state when applicable
const httpLink = ApolloLink.from([
    stateLink,
    new HttpLink({uri: `${GRAPHQL_SERVER}/graphql`})
]);

const wsLink = new WebSocketLink({
    uri: 'ws://35.199.37.151:4000/subscriptions',
    options: {
        reconnect: true
    }
})

// The split function operates like a fi statement. If returned true, it hooks up to 
// the web sockets link. If false, it uses the http link.
const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
)

// At this point, the link encapsulates logic to determine if the application is trying 
// to access a subscription, graphql server, or state management.
export const client = new ApolloClient({
    link,
    cache
});