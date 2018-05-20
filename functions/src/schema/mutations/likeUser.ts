import {driver} from '../../db/neo4j';
import { 
    GraphQLNonNull,
    GraphQLID,
} from 'graphql';
import { UserType } from '../types/user_type';

const session = driver.session();

const likeUser = {
    type: UserType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID)},
        likedId: { type: new GraphQLNonNull(GraphQLID)}
    },
    resolve(parentValue, args) {
        const isBoolean = val => 'boolean' === typeof val;
        console.log('args: ',args)
        const query = `MATCH (a:User {id:'${args.id}'}), (b:User {id:'${args.likedId}'}) MERGE (a)-[r:LIKES]->(b) return a,b,r`;
        console.log('query: ',query);
        return session
            .run(query)
            .then(result => {
                console.log('result: ',result);
                return result.records
            })
            .then(records => records[0]._fields[0].properties)
            .catch(e => console.log('error: ',e))
    }
}
//MATCH (a:Person {name:”Jack}), (b:Person {name:”Jill”) MERGE (a)-[r:MARRIED]->(b)

export {likeUser};