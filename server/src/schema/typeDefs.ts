const typeDefs = `
    type User {
        id: String!
        active: Boolean
        name: String
        email: String
        age: Int
        description: String
        school: String
        work: String
        sendNotifications: String
        gender: String
        distance: Int
        token: String
        latitude: Float
        longitude: Float
        minAgePreference: Int
        maxAgePreference: Int
        match: Boolean
        pics: [String]
        profilePics: String
        likes: [User]
        dislikes: [User]
        matches(otherId: String): [Match]
        queue: [User]
    }

    type MessageUser {
        _id: String
        name: String
        avatar: String
    }
    
    type Message {
        user: MessageUser
        _id: String
        createdAt: String
        text: String
        order: Float
        uid: String
    }

    type LikeUser {
        id: String
        name: String
        match: Boolean
    }

    type Match {
        matchId: String
        user: User
        messages: [Message]
        lastMessage: Message
    }

    
    type Query {
        user(id: String!): User
        match(matchId: String!): Match
    }

    type Subscription {
        newMessageSub(matchId: String): Message
    }

    type Mutation {
        dislikeUser (
            id: String! 
            dislikedId: String!
        ): User
        likeUser (
            id: String!
            likedId: String!
        ): LikeUser
        editUser (
            id: String!
            name: String
            active: Boolean
            email: String
            gender: String
            age: Int
            description: String
            school: String
            work: String
            sendNotifications: Boolean
            distance: Int
            token: String
            latitude: Float
            longitude: Float
            minAgePreference: Int
            maxAgePreference: Int
            pics: [String]
        ): User
        newUser (
            id: String!
            name: String
            active: Boolean
            email: String
            gender: String
            age: Int
            description: String
            school: String
            work: String
            sendNotifications: Boolean
            distance: Int
            token: String
            latitude: Float
            longitude: Float
            minAgePreference: Int
            maxAgePreference: Int
            pics: [String]
        ): User
        newMessage (
            matchId: String! 
            user: MessageUser
            text: String
            createdAt: String
            order: Float
            uid: String
            _id: String
        ): Message
    }

    schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
    }
`;

export default typeDefs;