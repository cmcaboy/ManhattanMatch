import gql from 'graphql-tag';

export const SET_COORDS = gql`
mutation editUser($id: String!, $latitude: Float, $longtitude: Float) {
    editUser(id: $id, latitude: $latitude, longitude: $longitude) {
        id
        latitude
        longitude
    }
}
`;

export const SET_PUSH_TOKEN = gql`
mutation editUser($id: String!, $token: String) {
    editUser(id: $id, token: $token) {
        id
        token
    }
}
`;

export const LIKE = gql`
mutation likeUser($id: String!, $likedId: String!) {
    likeUser(id: $id, likedId: $likedId) {
        id
        user {
            id
            name
        }
        match
        matchId
    }
}
`;

export const DISLIKE = gql`
mutation dislikeUser($id: String!, $dislikedId: String!) {
    dislikeUser(id: $id, dislikedId: $dislikedId) {
        id
        name
    }
}
`;

export const SEND_MESSAGE = gql`
mutation($matchId: String!, $name: String, $text: String, $createdAt: String, $avatar: String, $order: Float, $uid: String, $_id: String) {
    newMessage(matchId: $matchId, name: $name, text: $text, createdAt: $createdAt, avatar: $avatar, order: $order, uid: $uid, _id: $_id) {
        name
        text
        createdAt
        avatar
        order
        uid
        _id
    }
}
`;

export const SET_AGE_PREFERENCE = gql`
mutation editUser($id: String!, $minAgePreference: Int, $maxAgePreference: Int ) {
  editUser(id: $id, minAgePreference: $minAgePreference, maxAgePreference: $maxAgePreference) {
    	id
      minAgePreference
      maxAgePreference
  }
}
`;

export const SET_DISTANCE = gql`
mutation editUser($id: String!, $distance: Int ) {
  editUser(id: $id, distance: $distance) {
    	id
        distance
  }
}
`;


export const SET_NOTIFICATIONS = gql`
mutation editUser($id: String!, $sendNotifications: Boolean ) {
  editUser(id: $id, sendNotifications: $sendNotifications) {
    	id
        sendNotifications
  }
}
`;

