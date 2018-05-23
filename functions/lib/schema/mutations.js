"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const newUser_1 = require("./mutations/newUser");
const editUser_1 = require("./mutations/editUser");
const likeUser_1 = require("./mutations/likeUser");
const dislikeUser_1 = require("./mutations/dislikeUser");
const newMessage_1 = require("./mutations/newMessage");
const mutation = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        newUser: newUser_1.newUser,
        editUser: editUser_1.editUser,
        likeUser: likeUser_1.likeUser,
        dislikeUser: dislikeUser_1.dislikeUser,
        newMessage: newMessage_1.newMessage,
    }
});
exports.mutation = mutation;
//# sourceMappingURL=mutations.js.map