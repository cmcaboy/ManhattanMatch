"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const LikeUserType = new graphql_1.GraphQLObjectType({
    name: 'LikeUserType',
    fields: () => ({
        likedId: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        match: { type: graphql_1.GraphQLBoolean },
    })
});
exports.LikeUserType = LikeUserType;
//# sourceMappingURL=like_user_type.js.map