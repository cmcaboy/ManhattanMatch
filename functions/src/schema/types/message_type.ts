import  {
    GraphQLObjectType,
    GraphQLString, // GraphQL's string type
    GraphQLBoolean,
    GraphQLID,
  } from 'graphql';
  
  const MessageType = new GraphQLObjectType({
    name: 'MessageType',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        date: {type: GraphQLString},
        message: {type: GraphQLString},
    })
  });


  
  export {MessageType};