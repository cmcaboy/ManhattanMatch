"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as graphql from 'graphql';
const neo4j_1 = require("../../db/neo4j");
//const UserType = require('./user_type');
const user_type_1 = require("./user_type");
const graphql_1 = require("graphql");
const session = neo4j_1.driver.session();
const RootQueryType = new graphql_1.GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        user: {
            type: user_type_1.UserType,
            args: { id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve(parentValue, args) {
                console.log('parentValue: ', parentValue);
                console.log('args: ', args);
                console.log(`id: ${args.id}`);
                return session.run(`Match (n:User {id: '${args.id}'}) RETURN n`)
                    .then(result => result.records)
                    .then(records => {
                    console.log('records: ', records);
                    const properties = records[0]._fields[0].properties;
                    return Object.assign({}, properties);
                })
                    .catch(e => console.log('error: ', e));
            }
        }
    })
});
exports.RootQueryType = RootQueryType;
//# sourceMappingURL=root_query_type.js.map