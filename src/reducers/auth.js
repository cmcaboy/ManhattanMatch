
const defaultAuthReducer = {
    uid: null,
    email: '',
    password: '',
    error: '',
    isLoading: false,
    loggedIn: false
}

const authReducer = (state = {}, action) => {
    //console.log('action -- ',action)
    switch(action.type) {
        case 'FAILED_LOGIN':
            return {
                ...state,
                ...action.updates
            }
        case 'LOADING':
            return {
                ...state,
                isLoading: action.isLoading
            }
        case 'START_LOADING':
            return {
                ...state,
                loggedIn: action.loggedIn
            }
        case 'FINISH_LOADING':
            return {
                ...state,
                loggedIn: action.loggedIn
            }
        case 'MATCH_LOADING':
            return {
                ...state,
                matchLoading: action.matchLoading
            }
        case 'CHANGE_EMAIL':
            return {
                ...state,
                email: action.email
            }
        case 'CHANGE_PASSWORD':
            return {
                ...state,
                password: action.password
            }
        case 'LOGIN':
            return {
                ...defaultAuthReducer,
                uid: action.uid,
                loggedIn: true
            };
        case 'LOGOUT':
            return {...defaultAuthReducer};
        case 'RESET_STORE':
            return defaultAuthReducer;
        default:
            return state;
            
    }
};

export default authReducer;