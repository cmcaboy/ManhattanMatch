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

import Authentication from './src/components/Authentication';

const cache = new InMemoryCache();

const defaults = {
    id: null
};

const stateLink = withClientState({
  cache,
  defaults
});

 const client = new ApolloClient({
   link: ApolloLink.from([
     stateLink,
     new HttpLink({uri: 'https://us-central1-manhattanmatch-9f9fe.cloudfunctions.net/graphql/graphql'})
   ]),
   cache
 });

// const client = new ApolloClient({
//   uri: `https://us-central1-manhattanmatch-9f9fe.cloudfunctions.net/graphql/graphql`,
//   clientState: {
//     defaults: defaultState
//   }
// })

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
          {/*<Authentication />*/}
          <Settings />
      </ApolloProvider>
    );
  }
}

