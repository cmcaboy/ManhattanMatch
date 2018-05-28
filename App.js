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

import Authentication from './src/components/Authentication';

const cache = new InMemoryCache();

export const resolvers = {
  Mutation: {
    updateAgePreference: (_, { minAge, maxAge }, { cache, getCacheKey }) => {

      const query = gql`
        query getAgePreference {
          user {
            settings {
              minAgePreference
              maxAgePreference
            }
          }
        }
      `
      
      const previous = cache.readQuery({query});
      
      const data = {
        ...previous,
        user: {
          settings: {
            minAgePreference: minAge,
            maxAgePreference: maxAge
          }
        }
      };

      
      cache.writeData({query,data})
    }
  }
}

const defaults = {
    user: {
      __typename: 'user',
      id: 13,
      settings: {
        __typename: 'settings',
        minAgePreference: 18,
        maxAgePreference: 25,
        distance: 15,
        sendNotifications: true
      } 
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
          <EditSettings />
      </ApolloProvider>
    );
  }
}

