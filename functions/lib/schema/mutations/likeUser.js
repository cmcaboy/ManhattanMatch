"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neo4j_1 = require("../../db/neo4j");
const graphql_1 = require("graphql");
const user_type_1 = require("../types/user_type");
const session = neo4j_1.driver.session();
const likeUser = {
    type: user_type_1.UserType,
    args: {
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        likedId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) }
    },
    resolve(parentValue, args) {
        const isBoolean = val => 'boolean' === typeof val;
        console.log('args: ', args);
        const query = `MATCH (a:User {id:'${args.id}'}), (b:User {id:'${args.likedId}'}) MERGE (a)-[r:LIKES]->(b) return a,b,r`;
        console.log('query: ', query);
        return session
            .run(query)
            .then(result => {
            console.log('result: ', result);
            return result.records;
        })
            .then(records => records[0]._fields[0].properties)
            .catch(e => console.log('error: ', e));
    }
};
exports.likeUser = likeUser;
//# sourceMappingURL=likeUser.js.map