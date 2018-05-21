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
const neo4j_1 = require("../../db/neo4j");
const graphql_1 = require("graphql");
//import { UserType } from '../types/user_type';
const like_user_type_1 = require("../types/like_user_type");
const uuid = require('node-uuid');
const firestore_1 = require("../../db/firestore");
const moment = require('moment');
const session = neo4j_1.driver.session();
const likeUser = {
    type: like_user_type_1.LikeUserType,
    args: {
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        likedId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) }
    },
    resolve(parentValue, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const isBoolean = val => 'boolean' === typeof val;
            // command to create like
            const mutate = `MATCH (a:User {id:'${args.id}'}), (b:User {id:'${args.likedId}'}) MERGE (a)-[r:LIKES]->(b) return b`;
            // query to check to see if like is mutual
            const query = `MATCH (a:User {id:'${args.id}'})<-[r:LIKES]-(b:User {id:'${args.likedId}'}) return b`;
            // Create the like in neo4j
            const result = yield session.run(mutate);
            const user = result.records[0]._fields[0].properties;
            // Check Match
            const resultMatch = yield session.run(query);
            // Check to see if the like is mutual
            if (resultMatch.records.length > 0) {
                //const likedUser = result.records[0]._fields[0].properties;
                const matchId = uuid.v1();
                try {
                    yield session.run(`MATCH (a:User {id:'${args.id}'})<-[r:LIKES]-(b:User {id:'${args.likedId}'}) SET r.matchId='${matchId}'`);
                    yield session.run(`MATCH (a:User {id:'${args.id}'})-[r:LIKES]->(b:User {id:'${args.likedId}'}) SET r.matchId='${matchId}'`);
                    yield firestore_1.db.collection(`matches`).doc(`${matchId}`).set({
                        user1: args.id,
                        user2: args.likedId,
                        matchTime: moment().format('MMMM Do YYYY, h:mm:ss a')
                    });
                }
                catch (e) {
                    console.log('error creating match: ', e);
                }
                console.log('likedId: ', args.likedId);
                console.log('name: ', user.name);
                return { likedId: args.likedId, name: user.name, match: true };
            }
            console.log('likedId: ', args.likedId);
            console.log('name: ', user.name);
            return { likedId: args.likedId, name: user.name, match: false };
        });
    }
};
exports.likeUser = likeUser;
//# sourceMappingURL=likeUser.js.map