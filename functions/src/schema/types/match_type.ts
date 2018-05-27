import  {
    GraphQLObjectType,
    GraphQLString, // GraphQL's string type
    GraphQLList,
  } from 'graphql';
  import {MessageType} from './message_type';
  import {UserType} from './user_type';
  import {db} from '../../db/firestore';
  
  const MatchType = new GraphQLObjectType({
    name: 'MatchType',
    fields: () => ({
        matchId: {type: GraphQLString},
        user: {type: UserType},
        messages: {
            type: new GraphQLList(MessageType),
            async resolve(parentValue,_) {
                if(!parentValue.matchId) {
                    return [];
                }
                const data = await db.collection(`matches/${parentValue.matchId}/messages`).get();

                return data.docs.map(doc => {
                    const docData = doc.data();
                    return {
                        id: docData.id,
                        name: docData.name,
                        date: docData.date,
                        message: docData.message
                    };
                })
            }
        },
    })
  });

  export {MatchType};