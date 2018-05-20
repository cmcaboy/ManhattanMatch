"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neo4j_1 = require("../../db/neo4j");
const graphql_1 = require("graphql");
const user_type_1 = require("../types/user_type");
const session = neo4j_1.driver.session();
const editUser = {
    type: user_type_1.UserType,
    args: {
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: graphql_1.GraphQLString },
        active: { type: graphql_1.GraphQLBoolean },
        email: { type: graphql_1.GraphQLString },
        gender: { type: graphql_1.GraphQLString },
        age: { type: graphql_1.GraphQLInt },
        description: { type: graphql_1.GraphQLString },
        school: { type: graphql_1.GraphQLString },
        work: { type: graphql_1.GraphQLString },
        sendNotifications: { type: graphql_1.GraphQLBoolean },
        distance: { type: graphql_1.GraphQLInt },
        token: { type: graphql_1.GraphQLString },
        latitude: { type: graphql_1.GraphQLFloat },
        longitude: { type: graphql_1.GraphQLFloat },
        minAgePreference: { type: graphql_1.GraphQLInt },
        maxAgePreference: { type: graphql_1.GraphQLInt },
        pics: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
    },
    resolve(parentValue, args) {
        const isBoolean = val => 'boolean' === typeof val;
        console.log('args: ', args);
        let query = `MATCH(a:User{id: '${args.id}'}) SET `;
        !!args.name && (query = query + `a.name='${args.name}'`);
        isBoolean(args.active) && (query = query + `,a.active=${args.active}`);
        !!args.email && (query = query + `,a.email='${args.email}'`);
        !!args.gender && (query = query + `,a.gender='${args.gender}'`);
        !!args.age && (query = query + `,a.age=${args.age}`);
        !!args.description && (query = query + `,a.description='${args.description}'`);
        !!args.school && (query = query + `,a.school='${args.school}'`);
        !!args.work && (query = query + `,a.work='${args.work}'`);
        !!args.token && (query = query + `,a.token='${args.token}'`);
        isBoolean(args.sendNotifications) && (query = query + `,a.sendNotifications=${args.sendNotifications}`);
        !!args.distance && (query = query + `,a.distance=${args.distance}`);
        !!args.latitude && (query = query + `,a.latitude=${args.latitude}`);
        !!args.longitude && (query = query + `,a.longitude=${args.longitude}`);
        !!args.minAgePreference && (query = query + `,a.minAgePreference=${args.minAgePreference}`);
        !!args.maxAgePreference && (query = query + `,a.maxAgePreference=${args.maxAgePreference}`);
        !!args.pics && (query = query + `,a.pics=${args.pics}`);
        query = query + ` RETURN a`;
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
exports.editUser = editUser;
//# sourceMappingURL=editUser.js.map