//import * as graphql from 'graphql';
import {driver} from '../../db/neo4j';
//const UserType = require('./user_type');
import {UserType} from './user_type';
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

const session = driver.session();

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID)}},
      resolve(parentValue, args) {

        return session.run(`Match (n:User {id: '${args.id}'}) RETURN n`)
          .then(result => result.records)
          .then(records => {
            const properties =  records[0]._fields[0].properties;
            return {
              ...properties,
            }
          })
          .catch(e => console.log('error: ',e))
      }        
    }
  })
})

export { RootQueryType }; 