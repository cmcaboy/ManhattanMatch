"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const message_type_1 = require("./message_type");
const user_type_1 = require("./user_type");
const firestore_1 = require("../../db/firestore");
const MatchType = new graphql_1.GraphQLObjectType({
    name: 'MatchType',
    fields: () => ({
        matchId: { type: graphql_1.GraphQLString },
        user: { type: user_type_1.UserType },
        messages: {
            type: new graphql_1.GraphQLList(message_type_1.MessageType),
            resolve(parentValue, _) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!parentValue.matchId) {
                        return [];
                    }
                    const data = yield firestore_1.db.collection(`matches/${parentValue.matchId}/messages`).get();
                    return data.docs.map(doc => {
                        const docData = doc.data();
                        return {
                            id: docData.id,
                            name: docData.name,
                            date: docData.date,
                            message: docData.message
                        };
                    });
                });
            }
        },
    })
});
exports.MatchType = MatchType;
//# sourceMappingURL=match_type.js.map