//const graphql = require('graphql');
//import * as graphql from 'graphql';
//const driver = require('../../db/neo4j');

import {driver} from '../../db/neo4j';

//const session = driver.session();

import  {
    GraphQLObjectType,
    GraphQLString, // GraphQL's string type
    GraphQLInt, // GraphQL's int type
    //GraphQLSchema,
    GraphQLList,
    //GraphQLNonNull,
    GraphQLFloat,
    GraphQLBoolean,
  } from 'graphql';

  const session = driver.session();
  
  const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLString},
        active: {type: GraphQLBoolean},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLString},
        description: {type: GraphQLString},
        school: {type: GraphQLString},
        work: {type: GraphQLString},
        sendNotifications: {type: GraphQLBoolean},
        gender: {type: GraphQLString},
        distance: {type: GraphQLInt},
        token: {type: GraphQLString}, // fb auth token
        latitude: {type: GraphQLFloat},
        longitude: {type: GraphQLFloat},
        minAgePreference: {type: GraphQLInt},
        maxAgePreference: {type: GraphQLInt},
        pics: {type: GraphQLList(GraphQLString)},
        likes: {
            type: GraphQLList(UserType),
            resolve(parentValue, args) {
                return session
                    .run(`MATCH(a:User{id:'${parentValue.id}'})-[r:LIKES]->(b:User) RETURN b`)
                        .then(result => result.records)
                        .then(records => records.map(record => record._fields[0].properties))
                        .catch(e => console.log('error: ',e))
                //session.close();
            }
        },
        dislikes: {
            type: GraphQLList(UserType),
            resolve(parentValue, args) {
                return session
                    .run(`MATCH(a:User{id:'${parentValue.id}'})-[r:DISLIKES]->(b:User) RETURN b`)
                        .then(result => result.records)
                        .then(records => records.map(record => record._fields[0].properties))
                        .catch(e => console.log('error: ',e))
            }
        },
        matches: {
            type: GraphQLList(UserType),
            resolve(parentValue, args) {
                return session
                    .run(`MATCH(a:User{id:'${parentValue.id}'}),(b:User) where (a)-[:LIKES]->(b) AND (a)<-[:LIKES]-(b) RETURN b`)
                        .then(result => result.records)
                        .then(records => records.map(record => record._fields[0].properties))
                        .catch(e => console.log('error: ',e))
            }
        },
        queue: {
            type: GraphQLList(UserType),
            resolve(parentValue, args) {
                // Should add distance calculation here
                return session
                    .run(`MATCH(a:User{id:'${parentValue.id}'}),(b:User) 
                        where NOT (a)-[:LIKES|DISLIKES]->(b) AND 
                        NOT b.id='${parentValue.id}' AND
                        NOT b.gender='${parentValue.gender}'
                        RETURN b`)
                        .then(result => result.records)
                        .then(records => records.map(record => record._fields[0].properties))
                        .catch(e => console.log('error: ',e))
            }
        },

    })
  });

  // queue: MATCH(a:User{name:"Nathan"}),(b:User) where NOT (a)-[:LIKES|DISLIKES]->(b) RETURN b

  //MATCH(a:User{name:"Nathan"})-[r:LIKES]->(b:User) RETURN b
  
  export {UserType};