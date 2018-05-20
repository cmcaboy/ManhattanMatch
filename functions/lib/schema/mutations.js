"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const newUser_1 = require("./mutations/newUser");
const editUser_1 = require("./mutations/editUser");
const mutation = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        newUser: newUser_1.newUser,
        editUser: editUser_1.editUser
    }
});
exports.mutation = mutation;
//# sourceMappingURL=mutations.js.map