"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neo4j_1 = require("../../db/neo4j");
const graphql_1 = require("graphql");
const user_type_1 = require("../types/user_type");
const session = neo4j_1.driver.session();
const dislikeUser = {
    type: user_type_1.UserType,
    args: {
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        dislikedId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) }
    },
    resolve(parentValue, args) {
        const query = `MATCH (a:User {id:'${args.id}'}), (b:User {id:'${args.dislikedId}'}) MERGE (a)-[r:DISLIKES]->(b) return a,b,r`;
        return session
            .run(query)
            .then(result => {
            return result.records;
        })
            .then(records => records[0]._fields[0].properties)
            .catch(e => console.log('error: ', e));
    }
};
exports.dislikeUser = dislikeUser;
//# sourceMappingURL=dislikeUser.js.map