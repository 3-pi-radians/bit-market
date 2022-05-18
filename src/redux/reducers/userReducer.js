import { ActionTypes } from "../constants/action-types";

const initialState = {
    user: {
        isLoggedIn: false,
        id: "",
        name: "",
        email: "",
        phone: "",
        addresses: []
    }
};

export const userReducer = (state = initialState, action) => {
    const {type, payload} = action;

    switch(type) {
        case ActionTypes.SET_USER: {
            return {
                ...state, 
                user: {
                    ...payload
                }
            }
        }

        case ActionTypes.REMOVE_USER: {
            return {
                user: {
                    isLoggedIn: false,
                    id: "",
                    name: "",
                    email: "",
                    phone: "",
                    addresses: []
                }
            }
        }

        case ActionTypes.ADD_USER_ADDRESS: {
            return {...state, user: {
                ...state.user,
                addresses: [...state.user.addresses, payload]
            }}
        }

        case ActionTypes.UPDATE_USER_ADDRESS: {
            return {
                ...state, user: {
                    ...state.user,
                    addresses: state.user.addresses.map(address => address.id === payload.id ? payload : address)
                    
                }
            }
        }

        case ActionTypes.REMOVE_USER_ADDRESS: {
            const addresses = state.user.addresses.filter(address => address.id !== payload);

            return {
                ...state,
                user: {
                    ...state.user,
                    addresses
                }
            }
        }

        default: return state;
    }
};
