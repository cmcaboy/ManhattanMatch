//const graphql = require('graphql');
import {GraphQLSchema} from 'graphql';
//const { GraphQLSchema } = graphql;

//const RootQueryType = require('./types/root_query_type');
import {RootQueryType} from './types/root_query_type';
import {mutation} from './mutations';

export default new GraphQLSchema({
  query: RootQueryType,
  mutation
});
