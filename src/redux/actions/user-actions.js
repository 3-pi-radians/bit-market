import { ActionTypes } from "../constants/action-types"

export const setUser = (user) => {
    return {
        type: ActionTypes.SET_USER,
        payload: user
    }
}

export const addUserAddress = (address) => {
    return {
        type: ActionTypes.ADD_USER_ADDRESS,
        payload: address
    }
}

export const updateUserAddress = (address) => {
    return {
        type: ActionTypes.UPDATE_USER_ADDRESS,
        payload: address
    }
}

export const removeUserAddress = (id) => {
    return {
        type: ActionTypes.REMOVE_USER_ADDRESS,
        payload: id
    }
}
export const removeUser = () => {
    return {
        type: ActionTypes.REMOVE_USER,
        payload: {
            isLoggedIn: false
        }
    }
};