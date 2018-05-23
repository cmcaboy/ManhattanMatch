"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const MessageType = new graphql_1.GraphQLObjectType({
    name: 'MessageType',
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        date: { type: graphql_1.GraphQLString },
        message: { type: graphql_1.GraphQLString },
    })
});
exports.MessageType = MessageType;
//# sourceMappingURL=message_type.js.map