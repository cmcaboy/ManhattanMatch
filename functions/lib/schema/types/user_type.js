"use strict";
//const graphql = require('graphql');
//import * as graphql from 'graphql';
//const driver = require('../../db/neo4j');
Object.defineProperty(exports, "__esModule", { value: true });
const neo4j_1 = require("../../db/neo4j");
//const session = driver.session();
const graphql_1 = require("graphql");
const session = neo4j_1.driver.session();
const UserType = new graphql_1.GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: graphql_1.GraphQLString },
        active: { type: graphql_1.GraphQLBoolean },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        age: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
        school: { type: graphql_1.GraphQLString },
        work: { type: graphql_1.GraphQLString },
        sendNotifications: { type: graphql_1.GraphQLBoolean },
        gender: { type: graphql_1.GraphQLString },
        distance: { type: graphql_1.GraphQLInt },
        token: { type: graphql_1.GraphQLString },
        latitude: { type: graphql_1.GraphQLFloat },
        longitude: { type: graphql_1.GraphQLFloat },
        minAgePreference: { type: graphql_1.GraphQLInt },
        maxAgePreference: { type: graphql_1.GraphQLInt },
        pics: { type: graphql_1.GraphQLList(graphql_1.GraphQLString) },
        likes: {
            type: graphql_1.GraphQLList(UserType),
            resolve(parentValue, args) {
                return session
                    .run(`MATCH(a:User{id:'${parentValue.id}'})-[r:LIKES]->(b:User) RETURN b`)
                    .then(result => result.records)
                    .then(records => records.map(record => record._fields[0].properties))
                    .catch(e => console.log('error: ', e));
                //session.close();
            }
        },
        dislikes: {
            type: graphql_1.GraphQLList(UserType),
            resolve(parentValue, args) {
                return session
                    .run(`MATCH(a:User{id:'${parentValue.id}'})-[r:DISLIKES]->(b:User) RETURN b`)
                    .then(result => result.records)
                    .then(records => records.map(record => record._fields[0].properties))
                    .catch(e => console.log('error: ', e));
            }
        },
        matches: {
            type: graphql_1.GraphQLList(UserType),
            resolve(parentValue, args) {
                return session
                    .run(`MATCH(a:User{id:'${parentValue.id}'}),(b:User) where (a)-[:LIKES]->(b) AND (a)<-[:LIKES]-(b) RETURN b`)
                    .then(result => result.records)
                    .then(records => records.map(record => record._fields[0].properties))
                    .catch(e => console.log('error: ', e));
            }
        },
        queue: {
            type: graphql_1.GraphQLList(UserType),
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
                    .catch(e => console.log('error: ', e));
            }
        },
    })
});
exports.UserType = UserType;
//# sourceMappingURL=user_type.js.map