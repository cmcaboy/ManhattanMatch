"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const graphql = require('graphql');
const graphql_1 = require("graphql");
//const { GraphQLSchema } = graphql;
//const RootQueryType = require('./types/root_query_type');
const root_query_type_1 = require("./types/root_query_type");
const mutations_1 = require("./mutations");
exports.default = new graphql_1.GraphQLSchema({
    query: root_query_type_1.RootQueryType,
    mutation: mutations_1.mutation
});
//# sourceMappingURL=schema.js.map